
/**
 * 暴力递归
 * process函数返回的是从idx开始以及之后的最大value
 * 函数返回值代表最大价值
 */
 function base(weight, value, beg) {
    function process(idx, curWeight) {
        if (idx == weight.length) {
            return 0;
        }
        // 第idx个商品放进背包还是不放进背包取决于背包容量
        if (curWeight + weight[idx] > beg) {
            return process(idx + 1, curWeight);
        }
        return Math.max(process(idx + 1, curWeight), value[idx] + process(idx + 1, curWeight + weight[idx]));
    }
    return process(0, 0);
}

/**
 * idx is from 0 to arr.len
 * curWeight is from 0 to beg
 * to get dp[0][0]
 * if j+weight[i]>beg
 *  dp[i][j]=dp[i+1][j]
 * else
 *  dp[i][j]=max(dp[i+1][j],value[i]+dp[i+1][j+weight[i]])
 * initial dp[arr.len][j]=0
 */
function basedp(weight, value, beg) {
    let m = weight.length;
    let dp = new Array(m + 1);
    for (let i = 0; i < dp.length; i++){
        dp[i] = new Array(beg + 1).fill(0);
    }
    for (let i = 0; i <= beg; i++) {
        dp[m][i] = 0;
    }
    for (let i = m - 1; i >= 0; i--){
        for (let j = 0; j <= beg; j++){
            dp[i][j] = dp[i + 1][j];
            if (j + weight[i] <= beg) {
                dp[i][j] = Math.max(dp[i][j], value[i] + dp[i + 1][j + weight[i]]);
            }
        }
    }
    return dp[0][0];
}

// for test
function main() {
    let c = [3, 2, 4, 7];
    let p = [5, 6, 3, 19];
    let bag = 11;
    console.log(base(c, p, bag));
    console.log(basedp(c, p, bag));
}

main();