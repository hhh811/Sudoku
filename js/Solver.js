/* 求解器对象 */



function DemoSolver(
					sudoku,
					dataModel
					) {
	
	this.sudoku = sudoku
	this.dataModel = dataModel
	
	/* 
	 把同行的3块（如1~3行）称为块行，同列的三块称为快列
	 某个数字在一个块行/块列中所在的行/列号的次序一定是[123 132 231 213 312 321]中的一个
	 9个数字需要选取9个次序，把这6个排列被选取的个数记为a1 a2 a3 a4 a5 a6则需要满足
	 a1+a2=3(每一块的第一行只有三个格子...) ...
	 可以得到a1~a6的解只有4个即 [3, 0, 3, 0, 3, 0] [0, 3, 0, 3, 0, 3] [2, 1, 2, 1, 2, 1] [1, 2, 1, 2, 1, 2]
	*/
   
	this.rcOrders = [[0, 1, 2], [0, 2, 1], [1, 2, 0], [1, 0, 2], [2, 0, 1], [2, 1, 0]]
	this.ordersCounts = [[3, 0, 3, 0, 3, 0], [0, 3, 0, 3, 0, 3], [2, 1, 2, 1, 2, 1], [1, 2, 1, 2, 1, 2]]
	
	this.GetNeedValue = function(index) {
		/* 	对每个单元格，求出其可填入数字集合与和它同行（或者同列、或者同块）单元格可填入数字集合之并的差 */
		let [, [rowUnitsId, colUnitsId, blkUnitsId], ] = this.sudoku.getRelatedUnitsId(index, true)
		let rowSub = this.substractUnions(index, rowUnitsId)		//同行之差
		let colSub = this.substractUnions(index, colUnitsId)		//同列之差
		let blkSub = this.substractUnions(index, blkUnitsId)		//同块之差
		return [rowSub, colSub, blkSub]
	}
	
	//某个单元可填数字减掉一些可填数字之并
	this.substractUnions = function(index, ids) {
		let rst = []
		let unitValueCount = this.dataModel.getUnitData(index).unitValueCount
		for (let i = 0; i < unitValueCount.length; i++){
			//如果数字可填入
			if (unitValueCount[i] == 0) {
				let toPush = true
				//判断在一些单元可填数字中是否有它
				for (let id of ids) {
					//如果单元格已填入数字，判断该数字是否是i+1
					let unit = this.sudoku.units[id]
					if (unit && unit.inputValue > 0) {continue}
					let othValueCount = this.dataModel.getUnitData(id).unitValueCount
					//如果出现，直接break
					if (othValueCount[i] == 0) {
						toPush = false
						break
					}
				}
				//如果都没出现则将该数字记入结果中
				if (toPush) {rst.push(i+1)}
			}
		}
		
		return rst
	}
}

