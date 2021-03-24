
mainTableConfig = {
	mainFrameHeight: 720,
	mainFrameWidth: 720,
	valueTableFontSize: 30,
	inputValueFontSize: 30,
	innerBorderWidth: 2,
	outerBorderWidth: 3
}

indexElements = {
	container: document.getElementById("container"),
	mainFrame: document.getElementById("mainFrame"),
	victoryDiv: document.getElementById("victory"),
	buttonsFrame: document.getElementById("buttons")
}

gameFormat = "SOLVE"

/* 主程序 */
game = new Game(Sudoku, mainTableConfig, indexElements, gameFormat)



