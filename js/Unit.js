/* 小方格对象 用于封装小方格的对象和数据*/
function Unit(
				game,					//主数独表格指针
				index,					//编号
				unitDiv,				//div
				unitInput,				//input 输入数字
				unitP,					//P元素 用于显示已输入数字
				// unitTab					//table元素 用于显示可以输入的数字
			) {
	this.game = game
	this.index = index
	this.unitDiv = unitDiv
	this.unitInput = unitInput
	this.unitP = unitP
	// this.unitTab = unitTab
	
	// 小方格状态
	this.inputValue = -1				//已输入的数字
	this.activated = false 				//单元是否被激活
	this.conflicted = false				//单元数字是否冲突
	this.conflictedColor = ""			//冲突颜色
	this.locked = false					//锁定状态，用于出题，锁住已给定的单元格

}

//数据模型，该单元的部分
Unit.prototype.getModelData = function() {
	return this.game.dataModel.getUnitData(this.index)
}

//该单元需要且可以填入的数字，分行、列、块3个列表
Unit.prototype.getNeedValue = function() {
	return this.game.solver.getNeedValue(this.index)
}