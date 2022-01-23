
/**
 * idx从arr.len到0，aim从0到aim进行dp
 * 暂时不考虑dp计算过程的优化
 * 时间复杂度O(n^3)
 */
function coins1(arr, aim) {
    if (arr == null || arr.length == 0 || aim < 0) {
        return 0;
    }
    let dp = new Array(arr.length + 1);
    for (let i = 0; i < dp.length; i++) {
        dp[i] = new Array(aim + 1).fill(0);
    }
    for (let i = 0; i < dp.length; i++) {
        dp[i][0] = 1;
    }
    for (let i = dp.length - 1; i >= 0; i--) {
        for (let j = 1; j <= aim; j++) {
            for (let k = 0; k * arr[i] <= j; k++) {
                dp[i][j] += dp[i + 1][j - k * arr[i]];
            }
        }
    }
    return dp[0][aim];
}

/**
 * 在dp1的基础上对计算过程进行优化
 * dp[i][j]+dp[i+1][j]=dp[i][j+arr[i]]
 * 时间O(n^2)
 * 空间O(n^2)
 */
function coins2(arr, aim) {
    if (arr == null || arr.length == 0 || aim < 0) {
        return 0;
    }
    let dp = new Array(arr.length + 1);
    for (let i = 0; i < dp.length; i++) {
        dp[i] = new Array(aim + 1).fill(0);
    }
    // aim=0的一列都是1
    for (let i = 0; i < dp.length; i++) {
        dp[i][0] = 1;
    }
    for (let i = dp.length - 2; i >= 0; i--) {
        for (let j = 1; j <= aim; j++) {
            dp[i][j] = dp[i + 1][j];
            dp[i][j] += j - arr[i] >= 0 ? dp[i][j - arr[i]] : 0;
        }
    }
    return dp[0][aim];
}

/**
 * 和coins2一样
 * 初始化方式不同，将最后一列商品初始化
 */
function coins3(arr, aim) {
    if (arr == null || arr.length == 0 || aim < 0) {
        return 0;
    }
    let dp = new Array(arr.length + 1);
    for (let i = 0; i < dp.length; i++) {
        dp[i] = new Array(aim + 1).fill(0);
    }
    // aim=0的一列都是1
    for (let i = 0; i < dp.length; i++) {
        dp[i][0] = 1;
    }
    // 最后一类商品是base case
    for (let k = 1; k * arr[arr.length - 1] <= aim; k++) {
        dp[arr.length - 1][k * arr[arr.length - 1]] = 1;
    }
    for (let i = dp.length - 2; i >= 0; i--) {
        for (let j = 1; j <= aim; j++) {
            dp[i][j] = dp[i + 1][j];
            dp[i][j] += (j - arr[i] >= 0) ? dp[i][j - arr[i]] : 0;
        }
    }
    return dp[0][aim];
}

/**
 * 状态压缩
 * 时间O(n^2)
 * 空间O(n)
 */
function coins4(arr, aim) {
    if (arr == null || arr.length == 0 || aim < 0) {
        return 0;
    }
    let dp = new Array(aim + 1).fill(0);
    // base case 初始化
    for (let i = 0; i * arr[arr.length - 1] <= aim; i++){
        dp[i * arr[arr.length - 1]] = 1;
    }
    for (let i = arr.length - 2; i >= 0; i--){
        for (let j = 1; j <= aim; j++){
            dp[j] += j - arr[i] >= 0 ? dp[j - arr[i]] : 0;
        }
    }
    return dp[aim];
}

// for test
function main() {
    let coins = [10, 5, 1, 25];
    let aim = 2000;
    console.log(coins1(coins, aim));
    console.log(coins2(coins, aim));
    console.log(coins3(coins, aim));
    console.log(coins4(coins, aim));
}

main();