function SudokuViewer (
  game,        // 模型
) {

  this.game = game;
  this.unitViewer = new UnitViewer

  /* 方法 初始化数独表格 */
  this.initMainFrame = function () {
    //指定大表格样式
    this.game.mainFrame.style.height = this.game.mainFrameHeight + (this.game.numLine - 1) * this.game.innerBorderWidth + "px"
    this.game.mainFrame.style.width = this.game.mainFrameWidth + (this.game.numLine - 1) * this.game.innerBorderWidth + "px"
    this.game.mainFrame.style.position = "relative"
    this.game.mainFrame.style.margin = "auto"
    this.game.mainFrame.style.borderStyle = "solid"
    this.game.mainFrame.style.borderWidth = game.outerBorderWidth + "px"

    //给div指定样式,生成内部表单,表格对象
    unitViewConfig = {
      unitHeight: this.game.unitHeight,
      unitWidth: this.game.unitWidth,
      innerBorderWidth: this.game.innerBorderWidth,
      inputValueFontSize: this.game.inputValueFontSize,
      numLine: this.game.numLine,
      innerBorderIndex: this.game.innerBorderIndex
    }
    for (let unit of this.game.units) {
      this.unitViewer.init(unit, unitViewConfig)
    }

    //按钮
    this.game.buttons.prevGameButton.style.height = this.game.buttonHeight + 'px'
    this.game.buttons.prevGameButton.style.width = this.game.buttonWidth + 'px'
    this.game.buttons.prevGameButton.value = 'prev'
    this.game.buttons.prevGameButton.type = 'button'

    this.game.buttons.nextGameButton.style.height = this.game.buttonHeight + 'px'
    this.game.buttons.nextGameButton.style.width = this.game.buttonWidth + 'px'
    this.game.buttons.nextGameButton.value = 'next'
    this.game.buttons.nextGameButton.type = 'button'

    this.game.currentGameText.innerHTML = 'Game: ' + (this.game.currentGameNumber + 1)

    this.game.buttons.trySolveButton.style.height = this.game.buttonHeight + 'px'
    this.game.buttons.trySolveButton.style.width = this.game.buttonWidth + 'px'
    this.game.buttons.trySolveButton.value = 'trySolve'
    this.game.buttons.trySolveButton.type = 'button'

    //初始渲染
    this.render()
  }

  this.render = function () {
    if (this.game.prevClick >= 0) {
      this.unitViewer.deactivateInput(this.game.units[this.game.prevClick])
    }
    if (this.game.currentClick >= 0) {
      this.unitViewer.activateInput(this.game.units[this.game.currentClick])
    }
    for (let unit of this.game.units) {
      if (unit.index == this.game.currentClicked) continue
      this.unitViewer.render(unit, this.game.gameMode)
    }
    this.game.currentGameText.innerHTML = 'Game: ' + (this.game.currentGameNumber + 1)
  }

}

