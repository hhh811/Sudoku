/* 游戏保存功能 */

function SudokuSaver (
  game
) {
  this.game = game

  //读取 config 中的题目
  /**
   * @param problem 题目数组
   */
  this.readProblem = function (problem) {
    this.game.dataModel.cleanup()
    for (let i = 0; i < this.game.numUnits; i++) {
      if (problem[i] > 0) {
        this.game.units[i].inputValue = problem[i]
        this.game.units[i].unitInput.value = problem[i]
        this.game.units[i].locked = true
        this.game.dataModel.updateUnitData(i)
      } else {
        this.game.units[i].inputValue = -1
        this.game.units[i].unitInput.value = ""
        this.game.units[i].locked = false
      }
    }
    this.game.viewer.render()
  }

  //存档缓存
  this.gameCache = []

  //游戏快照
  this.makeSnapshot = function () {
    snapShot = []
    for (let unit of this.game.units) {
      if (unit.inputValue > 0) {
        let data = {
          index: unit.index,
          inputValue: unit.inputValue,
          locked: unit.locked
        }
        snapShot.push(data)
      }
    }
    return snapShot
  }

  //读取快照
  this.readSnapshot = function (snapShot) {
    this.game.dataModel.cleanup()
    for (let unit of this.game.units) {
      unit.inputValue = -1
      unit.unitInput.value = ""
      unit.locked = false
    }
    for (let data of snapShot) {
      let unit = this.game.units[data.index]
      unit.inputValue = data.inputValue
      unit.unitInput.value = data.inputValue
      unit.locked = data.locked
      this.game.dataModel.updateUnitData(data.index)
    }
    this.game.viewer.render()
  }


  this.saveGame = function () {
    rs = false
    snapShot = this.makeSnapshot()
    if (snapShot.length > 0) {
      rs = true
      if (this.game.currentGameNumber < this.gameCache.length) {
        this.gameCache[this.game.currentGameNumber] = snapShot
      } else {
        this.gameCache.push(snapShot)
      }
    }
    return rs
  }

  this.loadGame = function (id) {
    let cache = this.gameCache[id]
    if (cache) {
      this.readSnapshot(this.gameCache[id])
    } else {
      this.gameCache[id] = []
      this.readSnapshot(this.gameCache[id])
    }
  }

  this.nextGame = function () {
    if (this.saveGame()) {
      this.game.currentGameNumber++
      this.loadGame(this.game.currentGameNumber)
    }
  }

  this.prevGame = function () {
    if (this.game.currentGameNumber > 0) {
      this.game.currentGameNumber--
      this.loadGame(this.game.currentGameNumber)
    }
  }
}