/* Game对象 用于封装游戏所有内容 */

Game = function (
				game,
				config,
				indexElements,
				gameMode
				) {
	
	
	this.gameObj = new game(config, indexElements, gameMode)
	this.gameObj.initGame()
	
}


/* 主程序 */
game = new Game(Sudoku, config, indexElements, gameMode)
