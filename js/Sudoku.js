/* 大数独表格对象 */
function Sudoku(
					mainFrameConfig,	//数独表所有样式配置信息
					indexElements,		//页面元素
					gameFormat
					){
	this.mainFrameHeight = mainFrameConfig.mainFrameHeight
	this.mainFrameWidth = mainFrameConfig.mainFrameWidth
	this.innerBorderWidth = mainFrameConfig.innerBorderWidth
	this.outerBorderWidth = mainFrameConfig.outerBorderWidth
	this.valueTableFontSize = mainFrameConfig.valueTableFontSize
	this.inputValueFontSize = mainFrameConfig.inputValueFontSize
	this.unitHeight = this.mainFrameHeight / 9
	this.unitWidth = this.mainFrameWidth / 9
	
	
	this.hardLevel = 1				//难度等级
	this.gameFormat = gameFormat	//游戏模式
	
	this.victory = false			//游戏胜利判断
	
	// 初始化小方格
	this.units = []					//所有方格div的节点集合
	for (let i = 0; i < 81; i++){
		let unitDiv = document.createElement("div")
		//封装单元格
		unit = new Unit(this, i, unitDiv, unitInput, unitP)
		this.units.push(unit)

	// 初始化视图
	this.viewer = new SudoViewer(this, indexElements)
	this.viewer.initMainFrame()
	
	//实例化数据模型
	this.dataModel = new ValuesCountModel(this)
	
	//实例化求解器
	this.solver = new DemoSolver(this, this.dataModel)
	
	this.prevClick = -1				//记录上次点击的单元号
	this.unitClicked = false		//记录本次单击是否单击了单元，用于在单击单元时排除单击整个界面的事件
	
	/* 初始化 */
	this.initGame = function() {
		this.container.sudoku = this		//给container添加一个指向sudoku的指针，方便被container添加事件
		this.initMainFrame()
		this.initEvents()
		// this.initProblem(this.hardLevel)
	}
	
	/* 初始化事件 */
	this.initEvents = function () {
		/* 设置单元格点击事件 */
		for (let unit of this.units){
			unit.unitDiv.addEventListener("click", 
			() => {
				this.unitClick(unit.index)
			}, true)
		}
		
		/* 设置整个页面container即表格外点击事件 */		
		this.container.addEventListener("click", 
			() => {
				this.refresh()
				this.updateUnitsColor()
				}, true)
	}

	
	//计算同行,同列,同块的单元格id,同时返回行列块号和相关单元格
	this.getRelatedUnitsId = function(
									index, 
									blkRepeated = false		//同块且同行或者同列单元格是否重复记入
									){
		let ids = []
		let rowUnitsId = []
		let colUnitsId = []
		let blkUnitsId = []
		//同行
		let irow = Math.floor(index/9)	//行号
		for (i=0; i<9; i++){
			let num = irow * 9 + i
			if (num != index) {
				ids.push(num)
				rowUnitsId.push(num)
			}
		}
		//同列
		let icol = index % 9			//列号
		for (i=0; i<9; i++){
			let num = i*9+icol
			if (num != index) {
				ids.push(num)
				colUnitsId.push(num)
			}
		}
		//同块
		let brow = Math.floor(irow/3)	//块行号
		let bcol = Math.floor(icol/3)	//块列号
		for (i=0; i<3; i++){
			for (j=0; j<3; j++){
				let krow = brow*3+i
				let kcol = bcol*3+j
				let num = krow*9 + kcol
				if (!(krow == irow || kcol == icol) || blkRepeated){
					ids.push(num)
					blkUnitsId.push(num)
				}
			}
		}
		
		let iblk = brow * 3 + bcol
		return [[irow, icol, iblk], [rowUnitsId, colUnitsId, blkUnitsId], ids]
		
	}
	
	// 激活相关小方格
	this.activateUnits = function(ids){		
		for(let unit of this.units){
			if (ids.indexOf(unit.index) != -1){
				unit.activate()
			} 
		}
	}
	
	//更新所有单元颜色
	this.updateUnitsColor = function () {
		for(let unit of this.units) {
			unit.checkColor()
		}
	}
	
	
	// 单元点击事件
	this.unitClick = function(index){
		
		this.refresh()
		let unit = this.units[index]
		
		//获取相关单元列表
		let [ , , ids] = this.getRelatedUnitsId(index)
		
		//激活本次点击的相关单元
		this.activateUnits(ids)

		//本次单击单元激活input
		if (!unit.locked) {
			unit.unitInput.style.visibility = "visible"
			unit.unitP.style.visibility = "hidden"
		}

		//更新所有单元颜色
		this.updateUnitsColor()
		//检查胜利条件
		// this.checkVictory()
		this.prevClick = index
		
		this.unitClicked = true
	}
	
	//每次点击的刷新事件，也用于点击页面其他地方
	this.refresh = function () {
		//取消激活所有单元
		for (unit of this.units) {
			unit.deactivate()
		}
		
		let unitPrev = this.units[this.prevClick]
		//上次单击的单元更新P的数字，隐藏input，显示p
		if(unitPrev) {
			let updateOk = false
			if (!unitPrev.locked){
				unitPrev.update()
				unitPrev.unitInput.style.visibility = "hidden"
				unitPrev.unitP.style.visibility = "visible"
			}
			if (this.gameFormat == "TEST") {
				//相关单元也要更新
				let [ , , ids] = this.getRelatedUnitsId(unitPrev.index)
				this.updateUnits(ids)
			} else if (this.gameFormat == "SOLVE") {
				this.updateUnits()
			}
		} else {
			//更新所有单元
			this.updateUnits()
		}
	}
	
	
	//对指定的数个单元进行更新
	this.updateUnits = function (ids) {
		//输入参数为指定单元号的列表
		//若输入为空，则更新所有单元
		let unitsToUpdate = []
		if (!ids) {
			unitsToUpdate = this.units
		} else {
			for (id of ids) {
				unitsToUpdate.push(this.units[id])
			}
		}
		
		for (unit of unitsToUpdate) {
			unit.update()
		}
	}
	
	//出题
	this.initProblem = function (
								hardLevel		//难度等级
								)
	{
		let givenUnitsCount = [30 , 15, 10][hardLevel - 1]	//根据难度等级，给出单元格数字的数量
		let generateModel = this.dataModel					//出题用检查冲突模型			！！！！！！！！！！
		let givenIds = []									//给出数字的单元号
		
		//选取givenUnitsCount个单元号，注意不要重复
		for (let i = 0; i < givenUnitsCount; i++) {
			let newId
			do {
				newId = Math.floor(Math.random() * this.units.length)
			} while (givenIds.indexOf(newId) != -1)
			givenIds.push(newId)
		}
		
		//锁住单元，生成数字，调用生成dataModel的相关方法
		for (let id of givenIds) {
			let unit = this.units[id]
			let givenValue = generateModel.generateUnitValue(id)
			unit.update(givenValue)
			unit.lock()
		}
		
		//更新所有单元
		this.refresh()
		this.updateUnitsColor()
		
	}
	
	
	//判断是否胜利
	this.checkVictory = function () {
		console.log("checkVic")
		for (let unit of this.units) {
			if (unit.conflicted){
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