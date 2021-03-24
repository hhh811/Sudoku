function SudoViewer (
            sudokuModel,        // 模型
            indexElements,		//页面元素
            ) {

    this.model = sudokuModel;
    this.container = indexElements.container				//页面上存放素有内容的框架
	this.mainFrame = indexElements.mainFrame				//页面上的游戏框架
	this.victoryDiv = indexElements.victoryDiv				//页面上的表示胜利的框架
	this.buttonsFrame = indexElements.buttonsFrame			//页面上放置按钮的区域
	
	
    /* 方法 初始化数独表格 */ 
	this.initMainFrame = function(){
		//指定大表格样式
		this.mainFrame.style.height = this.mainFrameHeight + 8 * this.innerBorderWidth + "px"
		this.mainFrame.style.width = this.mainFrameWidth + 8 * this.innerBorderWidth + "px"
		this.mainFrame.style.position = "relative"
		this.mainFrame.style.margin = "auto"
		this.mainFrame.style.borderStyle = "solid"
		this.mainFrame.style.borderWidth = this.outerBorderWidth + "px"
		
		
		//给div指定样式,生成内部表单,表格对象
		for (let i = 0; i < 81; i++){
			let unitDiv = this.model.units[i]
			this.mainFrame.appendChild(unitDiv)
			unitDiv.style.height = this.unitHeight + "px"
			unitDiv.style.width = this.unitWidth + "px"
			unitDiv.style.float = "left"
			unitDiv.style.overflow = "hidden"
			unitDiv.id = "div" + i
			unitDiv.className = "unitSquare"
			unitDiv.style.position = "relative"
			
			//表格内边框
			//横格线
			if (Math.floor(i/9) == 2 || Math.floor(i/9) == 5){
				unitDiv.style.borderBottomStyle = "solid"
				unitDiv.style.borderBottomWidth = this.innerBorderWidth + "px"
			} else if (Math.floor(i/9) < 8){
				unitDiv.style.borderBottomStyle = "dotted"
				unitDiv.style.borderBottomWidth = this.innerBorderWidth + "px"
			}
			//竖格线
			if (i % 9 == 2 || i % 9 == 5){
				unitDiv.style.borderRightStyle = "solid"
				unitDiv.style.borderRightWidth = this.innerBorderWidth + "px"
			}	else if (i % 9 < 8){
				unitDiv.style.borderRightStyle = "dotted"
				unitDiv.style.borderRightWidth = this.innerBorderWidth + "px"
			}
			
			//添加表单
			let unitInput = document.createElement("input")
			unitDiv.appendChild(unitInput)
			unitInput.id = "input" + i
			unitInput.style.height = this.unitHeight + "px"
			unitInput.style.width = this.unitWidth + "px"
			unitInput.style.fontSize = this.inputValueFontSize + "px"
			unitInput.style.backgroundColor = "azure"
			unitInput.style.textAlign = "center"
			unitInput.style.position = "absolute"
			unitInput.style.left = "0px"
			unitInput.style.top = "0px"
			unitInput.style.visibility = "hidden"
			
			//添加段落，用于显示输入的数字
			let unitP = document.createElement("p")
			unitDiv.appendChild(unitP)
			unitP.id = "p" + i
			unitP.style.height = this.unitHeight + "px"
			unitP.style.width = this.unitWidth + "px"
			unitP.style.fontSize = this.inputValueFontSize + "px"
			unitP.style.lineHeight = this.unitHeight + "px"
			unitP.style.textAlign = "center"
			unitP.style.position = "absolute"
			unitP.style.left = "0px"
			unitP.style.top = "0px"
			unitP.style.visibility = "visible"
			
			//添加一个显示填入数字顺序的标签
			let unitLabel  = document.createElement("p")
			unitDiv.appendChild(unitLabel)
			unitLabel.id = "label" + i
			unitLabel.style.height = "20px"
			unitLabel.style.width = "20px"
			unitLabel.style.fontSize = "20px"
			unitLabel.style.color = "orange"
			unitLabel.style.textAlign = "center"
			unitLabel.style.position = "absolute"
			unitLabel.style.left = "0px"
			unitLabel.style.top = "0px"
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
		
	}
}

