
config = {
  // 视图尺寸
  mainFrameHeight: 720,
  mainFrameWidth: 720,
  valueTableFontSize: 30,
  inputValueFontSize: 30,
  innerBorderWidth: 2,
  outerBorderWidth: 3,

  buttonHeight: 35,
  buttonWidth: 80,

  // 游戏参数
  sudokuSize: 3, // 数独阶数

  // 题目数组
  problems: [
    [
      0, 4, 6, 9, 0, 3, 0, 0, 0,
      0, 0, 3, 0, 5, 0, 0, 6, 0,
      9, 0, 0, 0, 0, 2, 0, 0, 3,
      0, 0, 5, 0, 0, 6, 0, 0, 0,
      8, 0, 0, 0, 0, 0, 0, 1, 0,
      0, 1, 0, 7, 8, 0, 2, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 5, 0,
      0, 8, 1, 3, 0, 0, 0, 0, 7,
      0, 0, 0, 8, 0, 0, 1, 0, 4,
    ],
  ],
}

indexElements = {
  container: document.getElementById("container"),
  mainFrame: document.getElementById("mainFrame"),
  victoryDiv: document.getElementById("victory"),
  buttonsFrame: document.getElementById("buttons")
}

gameMode = "SOLVE"


