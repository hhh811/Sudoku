
config = {
	// 视图尺寸
	mainFrameHeight: 720,
	mainFrameWidth: 720,
	valueTableFontSize: 30,
	inputValueFontSize: 30,
	innerBorderWidth: 2,
	outerBorderWidth: 3,

	buttonHeight: 35,
	buttonWidth: 35,

	// 游戏参数
	sudokuSize: 3, // 数独阶数
}

indexElements = {
	container: document.getElementById("container"),
	mainFrame: document.getElementById("mainFrame"),
	victoryDiv: document.getElementById("victory"),
	buttonsFrame: document.getElementById("buttons")
}

gameMode = "SOLVE"
