/* 游戏保存功能 */

function SudokuSaver (
    game
) {
    this.game = game
    //存档缓存
    this.gameCache = []

	//游戏快照
	this.makeSnapshot = function() {
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
	this.readSnapshot = function(snapShot) {
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
	

    this.saveGame = function() {
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

    this.loadGame = function(id) {
		let cache = this.gameCache[id]
		if (cache) {
        	this.readSnapshot(this.gameCache[id])
		} else {
			this.gameCache[id] = []
			this.readSnapshot(this.gameCache[id])
		}
    }

	this.nextGame = function() {
		if (this.saveGame()) {
			this.game.currentGameNumber++
			this.loadGame(this.game.currentGameNumber)
		}
	}

	this.prevGame = function() {
		if (this.game.currentGameNumber > 0) {
			this.game.currentGameNumber--
			this.loadGame(this.game.currentGameNumber)
		}
	}
}