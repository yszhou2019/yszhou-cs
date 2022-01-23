
/**
 * 给定矩阵，从左上到右下，只能向右或者向下，返回最小路径和
 * 暴力尝试，递归版本
 */
function minPath1(m) {
    return process1(m, 0, 0);
}

/**
 * 从(i,j)触发，到达右下角的最小路径和
 * 递归版本
 * 确实，存在很多重复子问题
 * 会存在重复计算right和down的坐标
 */
function process1(m, i, j) {
    if (i == m.length - 1 && j == m[0].length - 1) {
        return m[i][j];
    }
    if (i == m.length - 1) {
        return m[i][j] + process1(m, i, j + 1);
    }
    if (j == m[0].length - 1) {
        return m[i][j] + process1(m, i + 1, j);
    }
    let right = process1(m, i, j + 1);
    let down = process1(m, i + 1, j);
    return m[i][j] + Math.min(right, down);
}

/**
 * 动态规划版本，减少了重复计算
 * i is from 0 to m.length-1
 * j is from 0 to m[0].length-1
 * to get dp[0][0]
 * 
 * 
 */
function minPath2(m) {
    let dp = new Array(m.length);
    let n = m[0].length;
    for (let i = 0; i < m.length; i++) {
        dp[i] = new Array(n).fill(0);
    }
    let a = m.length;
    let b = m[0].length;
    dp[a - 1][b - 1] = m[a - 1][b - 1];
    for (let i = b - 2; i >= 0; i--) {
        dp[a - 1][i] = m[a - 1][i] + dp[a - 1][i + 1];
    }
    for (let i = a - 2; i >= 0; i--) {
        dp[i][b - 1] = m[i][b - 1] + dp[i + 1][b - 1];
    }
    for (let i = a - 2; i >= 0; i--) {
        for (let j = b - 2; j >= 0; j--) {
            dp[i][j] = m[i][j] + Math.min(dp[i + 1][j], dp[i][j + 1]);
        }
    }
    return dp[0][0];
}


function generateRandomMatrix(rowSize, colSize) {
    if (rowSize < 0 || colSize < 0) {
        return null;
    }
    let result = new Array(rowSize);
    for (let i = 0; i < rowSize; i++) {
        result[i] = new Array(colSize);
    }
    for (let i = 0; i != result.length; i++) {
        for (let j = 0; j != result[0].length; j++) {
            result[i][j] = Math.floor(Math.random() * 10);
        }
    }
    return result;
}


// for test
function main() {
    let m = [
        [1, 3, 5, 9],
        [8, 1, 3, 4],
        [5, 0, 6, 1],
        [8, 8, 4, 0]];
    console.log(minPath1(m));
    console.log(minPath2(m));

    m = generateRandomMatrix(6, 7);
    console.log(minPath1(m));
    console.log(minPath2(m));
}

main();