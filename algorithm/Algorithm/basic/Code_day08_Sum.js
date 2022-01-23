
/**
 * 给一个数组和aim，可以从arr中任意挑选数字，能否累加得到aim，返回true或者false
 * 返回值表示数组中能否累加得到aim
 * 暴力版本，递归尝试出结果！是写出dp的基础！
 */
function Sum1(arr, aim) {
    function process(idx, curSum) {
        if (curSum == aim) {
            return true;
        }
        if (idx == arr.length) {
            return curSum == aim;
        }
        let res1 = process(idx + 1, curSum + arr[idx]);
        let res2 = process(idx + 1, curSum);
        return res1 || res2;
    }
    return process(0, 0);
}

/**
 * 这里的curSum的范围是0到sum(arr)，这样写也行，但是没必要开辟这么多空间，只需要aim大小的空间即可
 * 动态规划，以空间换时间，时间O(m*n)，空间O(m*n)
 * 用变量存储中间结果，减少了重复子问题的计算
 */
function Sum2(arr, aim) {
    let total = 0;
    for (let i = 0; i < arr.length; i++) {
        total += arr[i];
    }
    if (aim > total) {
        return false;
    }
    if (aim == total) {
        return true;
    }
    let m = arr.length;
    let n = total;
    let dp = new Array(m + 1);
    for (let i = 0; i < m + 1; i++) {
        dp[i] = new Array(n + 1).fill(false);
    }
    dp[m][aim] = true;
    for (let i = m - 1; i >= 0; i--) {
        for (let j = 0; j <= n; j++) {
            dp[i][j] = dp[i + 1][j] || dp[i + 1][j + arr[i]];
        }
    }
    return dp[0][0];
}

/**
 * 
 * 这里curSum的范围是0到aim-1
 * 因为dp[i][j],j代表curSum，curSum>aim，也就是矩阵右侧，全部都是False
 */
function Sum3(arr, aim) {
    let dp = new Array(arr.length + 1);
    for (let i = 0; i < dp.length; i++) {
        dp[i] = new Array(aim + 1).fill(false);
    }
    for (let i = 0; i < dp.length; i++) {
        dp[i][aim] = true;
    }
    for (let i = arr.length - 1; i >= 0; i--) {
        for (let j = aim - 1; j >= 0; j--) {
            dp[i][j] = dp[i + 1][j];
            if (j + arr[i] <= aim) {
                dp[i][j] = dp[i][j] || dp[i + 1][j + arr[i]];
            }
        }
    }
    return dp[0][0];
}


// for test
function main() {
    console.log(Sum1([2, 3, 7, 13], 9));
    console.log(Sum2([2, 3, 7, 13], 9));
    console.log(Sum3([2, 3, 7, 13], 9));
}

main();