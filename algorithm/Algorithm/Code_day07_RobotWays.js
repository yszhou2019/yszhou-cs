
/**
 * 
 * @param {*} N 一共有1~N位置
 * @param {*} M 当前处于M位置
 * @param {*} P 还可以走P步
 * @param {*} K 最终目的地
 * 暴力递归
 */
function ways(N, M, P, K) {
    // 过滤无效情况
    if (N < 2 || M < 1 || M > N || P < 0 || K < 1 || K > N) {
        return 0;
    }
    if (P == 0) { // 最终达到K，返回1；否则返回0
        return M == K ? 1 : 0;
    }
    let res = 0;
    if (M == 1) { // 来到最左边，只能向右
        res += ways(N, M + 1, P - 1, K);
    } else if (M == N) { // 来到最右边，只能向左
        res += ways(N, M - 1, P - 1, K);
    } else { // 两边都能走
        res += ways(N, M + 1, P - 1, K) + ways(N, M - 1, P - 1, K);
    }
    return res;
}

/**
 * 可变参数，M，P
 * M范围1-N M表示当前所在的位置
 * P范围0-P
 * 初始化边界
 * dp[i][j]表示从j位置经过i步到达K的种类数
 */
function waysDP(N, M, P, K) {
    if (N < 2 || M < 1 || M > N || P < 0 || K < 1 || K > N) {
        return 0;
    }
    let dp = new Array(P + 1);
    for (let i = 0; i < dp.length; i++) {
        dp[i] = new Array(N + 1).fill(0);
    }
    // base case
    dp[0][K] = 1;
    for (let i = 0; i < P; i++) {
        for (let j = 1; j <= N; j++) {
            dp[i + 1][j - 1] += j > 1 ? dp[i][j] : 0;
            dp[i + 1][j + 1] += j < N ? dp[i][j] : 0;
        }
    }
    return dp[P][M];
}

// for test
function main() {
    console.log(ways(4, 2, 3, 3), waysDP(4, 2, 3, 3));
}

main();