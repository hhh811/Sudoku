function UnitViewer () {

  this.init = function (unit, unitViewConfig) {
    let unitDiv = unit.unitDiv
    let i = unit.index

    unitDiv.style.height = unitViewConfig.unitHeight + "px"
    unitDiv.style.width = unitViewConfig.unitWidth + "px"
    unitDiv.style.float = "left"
    unitDiv.style.overflow = "hidden"
    unitDiv.id = "div" + i
    unitDiv.className = "unitSquare"
    unitDiv.style.position = "relative"

    //表格内边框
    //横格线
    if (unitViewConfig.innerBorderIndex.indexOf(Math.floor(i / unitViewConfig.numLine)) >= 0) {
      unitDiv.style.borderBottomStyle = "solid"
      unitDiv.style.borderBottomWidth = unitViewConfig.innerBorderWidth + "px"
    } else if (Math.floor(i / unitViewConfig.numLine) < unitViewConfig.numLine - 1) {
      unitDiv.style.borderBottomStyle = "dotted"
      unitDiv.style.borderBottomWidth = unitViewConfig.innerBorderWidth + "px"
    }
    //竖格线
    if (unitViewConfig.innerBorderIndex.indexOf(Math.floor(i % unitViewConfig.numLine)) >= 0) {
      unitDiv.style.borderRightStyle = "solid"
      unitDiv.style.borderRightWidth = unitViewConfig.innerBorderWidth + "px"
    } else if (i % unitViewConfig.numLine < unitViewConfig.numLine - 1) {
      unitDiv.style.borderRightStyle = "dotted"
      unitDiv.style.borderRightWidth = unitViewConfig.innerBorderWidth + "px"
    }

    let unitInput = unit.unitInput

    unitInput.id = "input" + i
    unitInput.style.height = unitViewConfig.unitHeight + "px"
    unitInput.style.width = unitViewConfig.unitWidth + "px"
    unitInput.style.fontSize = unitViewConfig.inputValueFontSize + "px"
    unitInput.style.backgroundColor = "azure"
    unitInput.style.textAlign = "center"
    unitInput.style.position = "absolute"
    unitInput.style.left = "0px"
    unitInput.style.top = "0px"
    unitInput.style.visibility = "hidden"

    //添加段落，用于显示输入的数字
    let unitP = unit.unitP
    unitP.id = "p" + i
    unitP.style.height = unitViewConfig.unitHeight + "px"
    unitP.style.width = unitViewConfig.unitWidth + "px"
    unitP.style.fontSize = unitViewConfig.inputValueFontSize + "px"
    unitP.style.lineHeight = unitViewConfig.unitHeight + "px"
    unitP.style.textAlign = "center"
    unitP.style.position = "absolute"
    unitP.style.left = "0px"
    unitP.style.top = "0px"
    unitP.style.visibility = "visible"

    // //添加一个显示填入数字顺序的标签
    // let unitLabel  = unit.unitLabel
    // unitLabel.id = "label" + i
    // unitLabel.style.height = "20px"
    // unitLabel.style.width = "20px"
    // unitLabel.style.fontSize = "20px"
    // unitLabel.style.color = "orange"
    // unitLabel.style.textAlign = "center"
    // unitLabel.style.position = "absolute"
    // unitLabel.style.left = "0px"
    // unitLabel.style.top = "0px"
    unitLabel.style.visibility = "visible"

    //添加表格，用于显示提示可输入的数字
    // var unitTab = document.createElement("table")
    // unitDiv.appendChild(unitTab)
    // unitTab.id = "p" + i
    // unitTab.style.height = this.unitHeight + "px"
    // unitTab.style.width = this.unitWidth + "px"
    // unitTab.style.fontSize = this.charTableFontSize + "px"
    // unitTab.style.textAlign = "center"
    // unitTab.style.position = "relative"
    // unitTab.style.visibility = "hidden"

  }

  this.render = function (unit, gameMode) {
    this.changeBGColor(unit)
    this.updateP(unit, gameMode)
  }

  this.activateInput = function (unit) {
    unit.unitInput.style.visibility = "visible"
    unit.unitP.style.visibility = "hidden"
  }

  this.deactivateInput = function (unit) {
    unit.unitInput.style.visibility = "hidden"
    unit.unitP.style.visibility = "visible"
  }

  this.changeBGColor = function (unit) {
    let color = this.originalColor(unit)
    if (unit.conflicted) {
      color = "red"
      if (unit.locked) {
        color = "darkred"
      }
    } else if (unit.locked) {
      color = "gray"
    } else if (unit.activated) {
      color = "green"
    }
    unit.unitDiv.style.backgroundColor = color
  }

  //根据单元格编号计算原始颜色,用于初始化颜色和鼠标点击恢复非激活单元格颜色
  this.originalColor = function (unit) {
    let index = unit.index
    if (Math.floor(index / 9) % 2 == 0) {
      if (index % 2 == 0) {
        return "#6691E8"
      } else {
        return "#6699F0"
      }
    } else {
      if (index % 2 == 0) {
        return "#6691E8"
      } else {
        return "#6699F0"
      }
    }
  }

  //更新小方格显示内容
  this.updateP = function (unit, gameMode) {
    let toShow
    if (unit.inputValue == -1) {
      toShow = ""
      if (gameMode == "TEST") {
        let okValuesCount = unit.getModelData().okValuesCount
        toShow = toShow + "(" + okValuesCount + ")"
      }
      if (gameMode == "SOLVE") {
        let subs = unit.getNeedValue(this.index)
        toShow += "<p style=\"color: gold; font-size: 20px; height: 26px; line-height: 26px\">"
        for (sub of subs) {
          if (sub) {
            toShow = toShow + sub + "(" + sub.length + ")" + "<br>"
          }
        }
        toShow += "</p>"
      }
    } else {
      toShow = unit.inputValue
    }
    unit.unitP.innerHTML = toShow
  }

  //排列小方格中要显示的数字  
  this.arrangeTableContent = function (unit) {
    let lenValues = this.numsTo.length
    let nCols = Math.ceil(Math.sqrt(lenValues))
    let nRows = Math.ceil(lenValues / nCols)
    let tableContent = ""
    let index = 0

    for (i = 0; i < nRows; i++) {
      tableContent += "<tr>"
      for (j = 0; j < nCols; j++) {
        if (index >= lenValues) {
          break
        }
        tableContent = tableContent + "<th>" + this.numsTo[index] + "</th>"
        index += 1;
      }
      tableContent += "</tr>"
    }

    // this.unitTab.innerHTML = tableContent
  }
}
