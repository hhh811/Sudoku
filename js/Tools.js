/* 一些工具，包含随机数 */


//从数组中随机选取一个元素
function randomPick (
						list,				//被抽取的列表
						remove = false,		//是否从列表中移除抽取的元素
						) {
	let pick = Math.floor(Math.random() * list.length)
	let rst = list[pick]
	if (remove) {
		list.splice(pick, 1)
	}
	return rst
}