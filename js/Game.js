/* Game对象 用于封装游戏所有内容 */

Game = function (
				game,
				config,
				indexElements,
				gameFormat
				) {
	
	
	this.gameObj = new game(config, indexElements, gameFormat)
	this.gameObj.initGame()
	
}