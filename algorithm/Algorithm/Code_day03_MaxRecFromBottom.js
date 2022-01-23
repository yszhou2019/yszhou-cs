
/**
 * 单调栈的应用
 * @param {Array} height 直方图数组
 * 单调栈从小到大，记录每个元素的左右两边临近的更小者的下标
 * 从而计算出最大矩阵=max{当前height下，最左边和最右边的距离*height}
 * O(N)
 */
function maxRecFromBottom(height) {
    if (height == null || height.length == 0) {
        return 0;
    }
    let res = 0;
    let stack = [];
    // 遍历数组，顺序则入栈，违背则弹出
    for (let i = 0; i < height.length; i++){
        while (stack.length > 0 && height[stack.length - 1] > height[i]) {
            let top = stack.pop();
            let left = stack.length == 0 ? -1 : stack[stack.length - 1];
            let curArea = (i - left - 1) * height[top];
            res = Math.max(res, curArea);
        }
        stack.push(i);
    }
    // 遍历完毕，弹空栈
    while (stack.length > 0) {
        let top = stack.pop();
        let left = stack.length == 0 ? -1 : stack[stack.length - 1];
        let curArea = (height.length - left - 1) * height[top];
        res = Math.max(res, curArea);
    }
    return res;
}

// for test
function main() {
    let arr = [3, 5, 3, 9];
    console.log(maxRecFromBottom(arr));
}

main();