
/* 行、列、块数字表，统计相同行、列、块填入的某个数字的个数 */
function ValuesCountModel (game) {

  //指向game主数独框架的指针
  this.game = game

  this.unitsData = []

  //单元数据	
  for (let i = 0; i < this.game.numUnits; i++) {
    let unitData = {
      okValuesCount: this.game.numLine,							//可填入的数字个数
      unitValueCount: [],				//相关单元格已经填入的数字
    }
    for (let j = 0; j < this.game.numLine; j++) {
      unitData.unitValueCount.push(0)
    }
    this.unitsData.push(unitData)
  }

  this.cleanup = function () {
    for (let i = 0; i < this.game.numUnits; i++) {
      let unitData = this.unitsData[i]
      unitData.okValuesCount = this.game.numLine
      for (let i = 0; i < unitData.unitValueCount.length; i++) {
        unitData.unitValueCount[i] = 0
      }
      this.game.units[i].conflicted = false
    }
  }


  //主要方法，更新单元
  this.updateUnitData = function (
    index,
    oldValue = -1
  ) {
    let value = this.game.units[index].inputValue
    if (oldValue == value) {
      return
    }
    let [, , ids] = this.game.getRelatedUnitsId(index)	//计算所有相关单元号
    ids.push(index)

    for (let id of ids) {
      let unitI = this.game.units[id]
      let unitIData = this.unitsData[id]

      if (value > 0) {
        unitIData.unitValueCount[value - 1] += 1
        //如果某个数字相关单元填入数从0加到1，则该单元可填入的数字数减少1
        if (unitIData.unitValueCount[value - 1] == 1) {
          unitIData.okValuesCount -= 1
        }
      }
      if (oldValue > 0) {
        if (unitIData.unitValueCount[oldValue - 1] > 0) {
          unitIData.unitValueCount[oldValue - 1] -= 1
          //如果某个数字相关单元填入数变回到0，则该单元可填入的数字数增加1
          if (unitIData.unitValueCount[oldValue - 1] == 0) {
            unitIData.okValuesCount += 1
          }
        }
      }

      //发生但冲突的单元打标签
      if (unitIData.unitValueCount[unitI.inputValue - 1] > 1 && unitI.inputValue > 0) {
        unitI.conflicted = true
      } else {
        unitI.conflicted = false
      }
    }
  }

  //提取单元数据
  this.getUnitData = function (index) {
    return this.unitsData[index]
  }

  // //根据单元号生成一个随机不冲突的数字,用于出题
  // this.generateUnitValue = function (id) {

  //   //根据unitsValueCount计算可以输入的数字集
  //   let unitValueCount = this.unitsData[id].unitValueCount
  //   let valuesTo = []
  //   for (let i = 0; i < unitValueCount.length; i++) {
  //     if (unitValueCount[i] == 0) {
  //       valuesTo.push(i + 1)
  //     }
  //   }

  //   //从可以输入的数字集中随机选取
  //   let pick = Math.floor(Math.random() * valuesTo.length)

  //   return valuesTo[pick]

  // }
}

