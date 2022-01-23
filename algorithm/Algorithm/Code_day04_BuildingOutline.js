
class Node {
	constructor(pos, height, up) {
		this.pos = pos;
		this.height = height;
		this.up = up;
	}
}

function compare(a, b) {
	if (a.pos != b.pos) {
		return a.pos - b.pos;
	}
	if (a.up != b.up) {
		return !a.up;
	}
	return 0;
}

Map.prototype.LastKey = function () {
	let maxKey = 0;
	this.forEach((v, k) => {
		maxKey = Math.max(maxKey, k);
	})
	return maxKey;
}

function buildingOutline(buildings) {
	let mapHeightCount = new Map(); // (高度，次数)
	let nodes = new Array(buildings.length * 2);
	for (let i = 0; i < buildings.length; i++) {
		nodes[2 * i] = new Node(buildings[i][0], buildings[i][2], true);
		nodes[2 * i + 1] = new Node(buildings[i][1], buildings[i][2], false);
	}
	nodes.sort(compare);
	// console.log(nodes)
	let mapPosMaxheight = new Map();
	for (let i = 0; i < nodes.length; i++) {
		// 用来更新高度的次数
		if (nodes[i].up) {
			if (mapHeightCount.has(nodes[i].height)) {
				mapHeightCount.set(nodes[i].height, mapHeightCount.get(nodes[i].pos) + 1);
			} else {
				mapHeightCount.set(nodes[i].height, 1);
			}
		} else {
			if (mapHeightCount.has(nodes[i].height)) {
				if (mapHeightCount.get(nodes[i].height) == 1) {
					mapHeightCount.delete(nodes[i].height);
				} else {
					mapHeightCount.set(nodes[i].height, mapHeightCount.get(nodes[i].height) - 1);
				}
			}
		}
		// 更新完毕之后，记录每个pos的MaxHeight
		if (mapHeightCount.size == 0) {
			mapPosMaxheight.set(nodes[i].pos, 0);
		} else {
			mapPosMaxheight.set(nodes[i].pos, mapHeightCount.LastKey()); // JS的语言限制，没有TreeMap，这里仅仅是描述一下
		}
	}
	// 至此，得到了mapPosMaxheight，处理一下就能得到最后结果
	let res = [];
	let height = 0;
	let start = 0;
	mapPosMaxheight.forEach((curheight, curPos) => {
		if (height != curheight) {
			if (height != 0) {
				res.push([start, curPos, height])
			}
			start = curPos;
			height = curheight;
		}
	})
	return res;
}

// for test
function main() {
	console.log(buildingOutline([[1, 3, 3], [2, 4, 4], [5, 6, 1]]))
}

main();