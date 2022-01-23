
/**
 * 最重要！
 * 先写出暴力递归，通过尝试得到答案
 * 给定一个数组，两个人，每次只能从最左边或者最右边取出数字，两个人都是最优决策，返回最后获胜者的分数
 * 我们假设A总是先手
 * 函数返回值返回的是最大分数
 */
function win1(arr) {
    
}

/**
 * 
 * 暴力递归改出动态规划，不重要！
 * 时间O(n^2)，空间O(n^2)
 */
function win2(arr) {
    
}

// for test
function main() {
    let arr = [1, 9, 1];
    console.log(win1(arr), win2(arr));
}

main();