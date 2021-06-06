
/* 1 冲突列表模型 */
function ConflictListsModel(
    sudoku,
        ){
//指向sudoku主数独框架的指针
this.sudoku = sudoku

// 所有冲突信息构成一个二维列表
// 每个列表项是一个对象记录：冲突的数字、冲突的单元号
this.rowConflictLists = new ConflictLists(this.sudoku, this)
this.colConflictLists = new ConflictLists(this.sudoku, this)
this.blkConflictLists = new ConflictLists(this.sudoku, this)

//列表，记录每个单元的冲突数
this.unitsConflictCount = []
for (let i = 0; i < 81; i++) {
this.unitsConflictCount.push(0)
}

}

//主要方法，更新单元
ConflictListsModel.prototype.updateUnitData = function (
                                index,			//待更新单元号
                                oldValue = -1	//旧值，为了兼容性，这个参数在这个函数没用
                                ) {
//首先计算小方格的行、列、块号
let [[unitRow, unitCol, unitBlk], [rowUnitsId, colUnitsId, blkUnitsId], ] = this.sudoku.getRelatedUnitsId(unit.index)
let unit= this.sudoku.units[index]
//调用ConflictLIsts的update方法,并得到是否更新冲突的标签，判断后面是否需要再进行重复检查
let rowUpdated = this.rowConflictLists.updateConflictList(unit, unitRow, unit.inputValue)
let colUpdated = this.colConflictLists.updateConflictList(unit, unitCol, unit.inputValue)
let blkUpdated = this.blkConflictLists.updateConflictList(unit, unitBlk, unit.inputValue)

//如果没有更新冲突则需要进行重复检查判断是否需要添加冲突
if (!rowUpdated){
this.rowConflictLists.checkConflict(unit, rowUnitsId, unitRow)
}
if (!colUpdated){
this.colConflictLists.checkConflict(unit, colUnitsId, unitCol)
}
if (!blkUpdated){
this.blkConflictLists.checkConflict(unit, blkUnitsId, unitBlk)
}
}

//增加冲突数
ConflictListsModel.prototype.addConflictCount = function(unit, color) {
let index = unit.index
this.unitsConflictCount[index] += 1
unit.getConflictColor(color)
unit.conflict()
}

//减少冲突数
ConflictListsModel.prototype.reduceConflictCount = function(unit) {
let index = unit.index
this.unitsConflictCount[index] -= 1
if (this.unitsConflictCount[index] < 0){
this.unitsConflictCount[index] = 0
}
if (this.unitsConflictCount[index] <= 0){
unit.deconflict()
}
}

/* 子模型 */
function ConflictLists(
        sudoku,
        model
        ){

//指向sudoku主数独框架的指针
this.sudoku = sudoku
//指向ConflictListsModel的指针
this.model = model

// 所有冲突信息构成一个二维列表
// 每个列表项是一个对象记录：冲突的数字、冲突的单元号
this.conflictLists = []

for (let i = 0; i < 9; i++){
this.conflictLists.push([])
}
}

// ConflictList对象方法，新冲突 两个单元格的数字冲突，向conflictList中添加项
ConflictLists.prototype.addNewConflict = function(
units,		//冲突单元列表
rcbId,		//行、列、块号
num			//冲突数字
){

//防止值为空
if (!num || num < 0) {
return
}
let newConflict = {
unitList: units,
conflictValue: num
}

this.conflictLists[rcbId].push(newConflict)

//冲突单元增加冲突数
let color = this.getConflictColor()
for (let unit of units) {
this.model.addConflictCount(unit, color)
}

}

// 某单元数字变化后，扫描conflictList更新冲突列表
ConflictLists.prototype.updateUnitConflictList = function(
unit,			//单元
rcbId,		//行、列、块号
num			//更新后的数字
){
let conflictList = this.conflictLists[rcbId]

//返回一个是否更新冲突的标签，如果已经更新冲突，则不用再判断是否需要添加冲突
let updated = false

for (let {unitList, conflictValue} of conflictList){
//如果已经有冲突的单元数字改变，则在冲突中删去该单元,包含改变后单元值为空的情况
if (unitList.indexOf(unit) > -1  && conflictValue != num){
let unitInList = unitList.indexOf(unit)
unitList.splice(unitInList, 1)
//单元恢复颜色
this.model.reduceConflictCount(unit)
}
//如果改变后的数字与已有的冲突数字相同，在该冲突的单元列表中增加该单元号
if (unitList.indexOf(unit) == -1  && conflictValue == num){
unitList.push(unit)
updated = true
//新增冲突单元变色
this.model.addConflictCount(unit, this.getConflictColor())
}
}

//检查冲突列表，如果有冲突单元少于2个则删除该项
for (let {unitList, } of conflictList){
if (unitList.length < 2){
this.model.reduceConflictCount(unitList[0].index)		//单元恢复颜色
conflictList.splice(i, i+1)
}
}

return updated
}

//检查冲突
ConflictLists.prototype.checkConflict = function(
                    unit,			//需要检查的单元对象
                    unitsId,		//需要检查的行、列、块中的单元号
                    rcbId,			//行、列、块编号
                    ){
let conflict = false

//数字相冲突的单元，添加到ConflictLists中
let conflictUnits = []

for (let unitId of unitsId){
if(unitId != unit.index && this.sudoku.units[unitId].inputValue == unit.inputValue && unit.inputValue > 0){
conflict = true
conflictUnits.push(this.sudoku.units[unitId])
}
}

if (conflict){
conflictUnits.push(unit)
//调用ConflictLists的addNewConflict方法添加新冲突
this.addNewConflict(conflictUnits, rcbId, unit.inputValue)
}
return conflict
}

//计算冲突单元背景颜色
ConflictLists.prototype.getConflictColor = function() {
let color = "red"

return color
}
