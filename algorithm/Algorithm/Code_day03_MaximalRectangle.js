
/**
 * 单调栈
 * O(M*N)求出最大子矩阵的面积
 */
function maxRecSize(map) {
    if (map == null || map.length == 0 || map[0].length == 0) {
        return 0;
    }
    let res = 0;
    let height = new Array(map[0].length).fill(0);
    for (let i = 0; i < map.length; i++){
        for (let j = 0; j < height.length; j++){
            height[j] = map[i][j] == 0 ? 0 : height[j] + 1;
        }
        res = Math.max(res, maxRecFromBottom(height));
    }
    return res;
}

function maxRecFromBottom(height) {
    if (height == null || height.length == 0) {
        return 0;
    }
    let res = 0;
    let stack = [];
    for (let i = 0; i < height.length; i++){
        while (stack.length > 0 && height[stack[stack.length - 1]] > height[i]) {
            let top = stack.pop();
            let left = stack.length == 0 ? -1 : stack.length - 1;
            res = Math.max(res, (i - left - 1) * height[top]);
        }
        stack.push(i);
    }
    while (stack.length > 0) {
        let top = stack.pop();
        let left = stack.length == 0 ? -1 : stack.length - 1;
        res = Math.max(res, (height.length - left - 1) * height[top]);
    }
    return res;
}

// for test
function main() {
    let map = [[1, 0, 1, 1], [1, 1, 1, 1], [1, 1, 1, 0]];
    console.log(maxRecSize(map));
}

main();