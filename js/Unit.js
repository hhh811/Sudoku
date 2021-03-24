/* 小方格对象 用于封装小方格的对象和数据*/
function Unit(
				sudoku,					//主数独表格指针
				index,					//编号
				unitDiv,				//div
				unitInput,				//input 输入数字
				unitP,					//P元素 用于显示已输入数字
				// unitTab					//table元素 用于显示可以输入的数字
			) {
	this.sudoku = sudoku
	this.index = index
	this.unitDiv = unitDiv
	this.unitDiv.unit = this			//为unitDiv添加一个指向unit的指针，为了给unitDiv添加事件
	this.unitInput = unitInput
	this.unitP = unitP
	// this.unitTab = unitTab
	
	this.inputValue = -1				//已输入的数字
	this.activated = false 				//单元是否被激活
	this.conflicted = false				//单元数字是否冲突
	this.conflictedColor = ""			//冲突颜色
	this.locked = false					//锁定状态，用于出题，锁住已给定的单元格
	
	//单元格原始配色
	this.unitDiv.style.backgroundColor = this.originalColor()

}

// Unit对象方法，更新小方格p值
Unit.prototype.update = function(value){
	
	//如若单元格锁住了，直接返回，不执行该方法
	if (this.locked) {
		return
	}
	
	let inputValue
	if (value) {
		inputValue = value
	} else {
		inputValue = this.unitInput.value
	}
	
	inputValue = parseInt(inputValue)
	let inputValid = this.checkValue(inputValue)
	if (!inputValid) {
		inputValue = -1
	}
	this.checkConflict(inputValue)
	this.updateP(inputValid)
	
	if (inputValid && !this.conflicted) {
		// this.lock()
	}
}

//小方格更新值
Unit.prototype.checkValue = function(inputValue) {
	let inputValid = false
	
	//检查输入数字合法性
	if(inputValue <=9 && inputValue >= 1){
		this.unitInput.value = inputValue
		inputValid = true
	}
	else {
		this.unitInput.value = ""
	}
	
	return inputValid
}

//小方格检查冲突
Unit.prototype.checkConflict = function (inputValue) {
	//如果小方格数字改变，检查冲突
	if (this.inputValue != inputValue) {
		let oldValue = this.inputValue
		this.inputValue = inputValue
		this.sudoku.dataModel.updateUnitData(this.index, oldValue)
	}
}

//更新小方格显示内容
Unit.prototype.updateP = function (inputValid) {
	if (this.locked) {
		return
	}
	let toShow
	if (this.inputValue == -1) {
		toShow = ""
		if (this.sudoku.gameFormat == "TEST") {
			let okValuesCount = this.getData().okValuesCount
			toShow = toShow + "(" + okValuesCount + ")"
		}
		if (this.sudoku.gameFormat == "SOLVE") {
			let subs = this.sudoku.solver.GetNeedValue(this.index)
			toShow += "<p style=\"color: gold; font-size: 20px; height: 26px; line-height: 26px\">"
			for (sub of subs) {
				if (sub) {
					toShow = toShow + sub + "(" + sub.length + ")" + "<br>"
				}
			}
			toShow += "</p>"
		}
	} else {
		toShow = this.inputValue
	}
	this.unitP.innerHTML = toShow
}
	
// Unit对象方法,排列小方格中要显示的数字  
Unit.prototype.arrangeTableContent = function(){	
	let lenValues = this.numsTo.length
	let nCols = Math.ceil(Math.sqrt(lenValues))
	let nRows = Math.ceil(lenValues / nCols)
	let tableContent = ""
	let index = 0
	
	for (i = 0; i < nRows; i++){
		tableContent += "<tr>"
		for (j = 0; j < nCols; j++){
			if (index >= lenValues){
				break
				}
			tableContent = tableContent + "<th>" + this.numsTo[index] + "</th>"
			index += 1;
		}
		tableContent += "</tr>"
	}
	
	// this.unitTab.innerHTML = tableContent
}

//根据单元格编号计算原始颜色,用于初始化颜色和鼠标点击恢复非激活单元格颜色
Unit.prototype.originalColor = function(){
	let index = this.index
	if (Math.floor(index/9)%2 == 0){
		if (index % 2 == 0){
			return "#6691E8"
		} else {
			return "#6699F0"
		}
	} else {
		if (index % 2 == 0){
			return "#6691E8"
		} else {
			return "#6699F0"
		}
	}
}
	
//改变单元背景颜色
Unit.prototype.changeBackGrdColor = function(color){
	if (color) {
		this.unitDiv.style.backgroundColor = color
	}
}

//恢复单元原始配色
Unit.prototype.recoverBackGrdCorlor = function () {
	if (this.locked) {
		let color = "gray"
		this.changeBackGrdColor(color)
	} else {
		this.changeBackGrdColor(this.originalColor())
	}
}

//激活单元
Unit.prototype.activate = function () {
	this.activated = true
}

//反激活单元
Unit.prototype.deactivate = function () {
	this.activated = false
}

//单元冲突
Unit.prototype.conflict = function () {
	this.conflicted = true
}

//单元不冲突
Unit.prototype.deconflict = function () {
	this.conflicted = false
}

//获取单元冲突色
Unit.prototype.getConflictColor = function (color) {
	this.conflictedColor = color
}

//单元颜色判定
Unit.prototype.checkColor = function () {
	
	if (this.conflicted) {
		let color = this.conflictedColor
		if (!color) {
			color = "red"
		}
		if (this.locked) {
			color = "darkred"
		}
		this.changeBackGrdColor(color)
	} else if (this.activated && !this.locked) {
		this.changeBackGrdColor("green")
	} else {
		this.recoverBackGrdCorlor()
	}
}

//单元上锁
Unit.prototype.lock = function () {
	this.locked = true
}

//从数据模型中提取单元数据
Unit.prototype.getData = function () {
	return this.sudoku.dataModel.getUnitData(this.index)
}