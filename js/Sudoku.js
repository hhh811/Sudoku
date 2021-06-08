/* 大数独表格对象 */
function Sudoku (
  config,	//数独表所有样式配置信息
  indexElements,		//页面元素
  gameMode
) {

  // 游戏参数
  this.hardLevel = 1							//难度等级
  this.gameMode = gameMode					//游戏模式
  this.sudokuSize = config.sudokuSize			//数独阶数
  this.numLine = this.sudokuSize ** 2			//每行，列，块单元数
  this.numUnits = this.numLine ** 2		//总单元数
  this.problems = config.problems   // 所有题目

  // 页面元素参数
  this.mainFrameHeight = config.mainFrameHeight
  this.mainFrameWidth = config.mainFrameWidth
  this.innerBorderWidth = config.innerBorderWidth
  this.outerBorderWidth = config.outerBorderWidth
  this.valueTableFontSize = config.valueTableFontSize
  this.inputValueFontSize = config.inputValueFontSize
  this.unitHeight = this.mainFrameHeight / this.numLine
  this.unitWidth = this.mainFrameWidth / this.numLine
  this.innerBorderIndex = []	//需要加粗内网格的单元行、列号

  for (let i = 1; i < this.sudokuSize; i++) {
    this.innerBorderIndex.push(i * this.sudokuSize - 1)
  }

  // 页面元素
  this.container = indexElements.container				//页面上存放素有内容的框架
  this.mainFrame = indexElements.mainFrame				//页面上的游戏框架
  this.victoryDiv = indexElements.victoryDiv				//页面上的表示胜利的框架
  this.buttonsFrame = indexElements.buttonsFrame			//页面上放置按钮的区域


  this.victory = false			//游戏胜利判断

  // 初始化小方格
  this.units = []					//所有方格div的节点集合
  for (let i = 0; i < this.numUnits; i++) {
    let unitDiv = document.createElement("div")
    this.mainFrame.appendChild(unitDiv)
    let unitInput = document.createElement("input")
    unitDiv.appendChild(unitInput)
    let unitP = document.createElement("p")
    unitDiv.appendChild(unitP)
    unitLabel = document.createElement("p")
    unitDiv.appendChild(unitLabel)
    //封装单元格
    unit = new Unit(this, i, unitDiv, unitInput, unitP)
    this.units.push(unit)
  }

  this.buttonHeight = config.buttonHeight
  this.buttonWidth = config.buttonWidth

  //控制按钮
  let prevGameButton = document.createElement("input")
  this.buttonsFrame.appendChild(prevGameButton)
  let nextGameButton = document.createElement("input")
  this.buttonsFrame.appendChild(nextGameButton)
  let trySolveButton = document.createElement("input")
  this.buttonsFrame.appendChild(trySolveButton)
  this.buttons = {
    prevGameButton: prevGameButton,
    nextGameButton: nextGameButton,
    trySolveButton: trySolveButton,
  }
  this.currentGameText = document.createElement("p")
  this.buttonsFrame.appendChild(this.currentGameText)

  this.prevClick = -1				//记录上次点击的单元号
  this.currentClick = -1			//本次点击单元号
  this.unitClicked = false		//记录本次单击是否单击了单元，用于在单击单元时排除单击整个界面的事件
  this.activatedUnits = []
  this.currentGameNumber = 0		//当前存档编号

  //组件
  //视图
  this.viewer = new SudokuViewer(this, indexElements)
  //数据模型
  this.dataModel = new ValuesCountModel(this)
  //求解器
  this.solver = new DemoSolver(this, this.dataModel)
  //存档功能
  this.saver = new SudokuSaver(this)

  /* 初始化 */
  this.initGame = function () {
    this.container.sudoku = this		//给container添加一个指向sudoku的指针，方便被container添加事件
    this.viewer.initMainFrame()
    this.initEvents()
    this.initProblem(0)
  }

  /* 初始化事件 */
  this.initEvents = function () {
    /* 设置单元格点击事件 */
    for (let unit of this.units) {
      unit.unitDiv.addEventListener("click",
        () => {
          if (!unit.locked) {
            this.currentClick = unit.index
          }
        }, false)
    }
    /* 设置整个页面container即表格外点击事件 */
    this.container.addEventListener("click",
      () => {
        this.updateUnitsInputNumber()
        this.deactivateAndActivate()
        this.viewer.render()
        // 清空当前点击单元记录
        this.prevClick = this.currentClick
        this.currentClick = -1
      }, false)
    //按钮事件
    this.buttons.nextGameButton.addEventListener("click",
      () => {
        this.saver.nextGame()
      }, false)
    this.buttons.prevGameButton.addEventListener("click",
      () => {
        this.saver.prevGame()
      }, false)
    this.buttons.trySolveButton.addEventListener("click",
      () => {
        this.solver.trySolve()
      }, false)
  }

  // 向单元中填入数字
  this.updateUnitInputNumber = function (index, inputValue) {
    let unit = this.units[index]
    if (inputValue <= this.numLine && inputValue >= 1) {
      unit.unitInput.value = inputValue
    }
    else {
      unit.unitInput.value = ""
      inputValue = -1
    }
    // 更新数据模型，检查冲突
    let oldValue = unit.inputValue
    unit.inputValue = inputValue
    this.dataModel.updateUnitData(this.prevClick, oldValue)
  }

  // 更新单元格数字
  this.updateUnitsInputNumber = function () {
    if (this.prevClick < 0) {
      return
    }
    // 检查输入数字有效性
    let unit = this.units[this.prevClick]
    let inputValue = unit.unitInput.value
    this.updateUnitInputNumber(this.prevClick, inputValue)
  }

  // 激活点击单元及相关单元 清空上次激活的单元
  this.deactivateAndActivate = function () {
    for (let index of this.activatedUnits) {
      this.units[index].activated = false
    }
    this.activatedUnits = []
    if (this.currentClick >= 0) {
      //获取相关单元列表
      let [, , ids] = this.getRelatedUnitsId(this.currentClick)
      this.activatedUnits = ids
      //激活本次点击的相关单元
      for (let index of this.activatedUnits) {
        this.units[index].activated = true
      }
    }
  }


  //计算同行,同列,同块的单元格id,同时返回行列块号和相关单元格
  this.getRelatedUnitsId = function (
    index,
    blkRepeated = false		//同块且同行或者同列单元格是否重复记入
  ) {
    let ids = []
    let rowUnitsId = []
    let colUnitsId = []
    let blkUnitsId = []
    //同行
    let irow = Math.floor(index / this.numLine)	//行号
    for (i = 0; i < this.numLine; i++) {
      let num = irow * this.numLine + i
      if (num != index) {
        ids.push(num)
        rowUnitsId.push(num)
      }
    }
    //同列
    let icol = index % this.numLine			//列号
    for (i = 0; i < this.numLine; i++) {
      let num = i * this.numLine + icol
      if (num != index) {
        ids.push(num)
        colUnitsId.push(num)
      }
    }
    //同块
    let brow = Math.floor(irow / this.sudokuSize)	//块行号
    let bcol = Math.floor(icol / this.sudokuSize)	//块列号
    for (i = 0; i < this.sudokuSize; i++) {
      for (j = 0; j < this.sudokuSize; j++) {
        let krow = brow * this.sudokuSize + i
        let kcol = bcol * this.sudokuSize + j
        let num = krow * this.numLine + kcol
        if (!(krow == irow || kcol == icol) || blkRepeated) {
          ids.push(num)
          blkUnitsId.push(num)
        }
      }
    }

    let iblk = brow * this.sudokuSize + bcol
    return [[irow, icol, iblk], [rowUnitsId, colUnitsId, blkUnitsId], ids]

  }


  //出题
  this.initProblem = function (problemId) {
    this.saver.readProblem(this.problems[problemId])
  }


  //判断是否胜利
  this.checkVictory = function () {
    console.log("checkVic")
    for (let unit of this.units) {
      if (unit.conflicted) {
        console.log("unit", unit.index, "conflicted")
        break
      }

      if (unit.inputValue < 0) {
        break
      }
      console.log(2, this.victory)
      this.victory = true
      this.victoryDiv.innerHTML = "Victory"
    }
  }

}