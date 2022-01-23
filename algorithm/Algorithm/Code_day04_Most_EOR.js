
/**
 * 子数组异或和为0的最多划分
 */
function mostEOR(arr) {
    let res = 0;
    let xor = 0;
    let mosts = new Array(arr.length).fill(0); // mosts[i] 代表[0-i]上最优划分的异或和=0的子数组数量
    let map = new Map();
    map.set(0, -1);
    for (let i = 0; o < arr.length; i++){
        xor ^= arr[i];
        if (map.has(xor)) {
            let pre = map.get(xor);
            mosts[i] = pre == -1 ? 1 : mosts[pre] + 1;
        }
        if (i > 0) {
            mosts[i] = Math.max(mosts[i - 1], mosts[i]); // 0-i的最优划分一定要优于0到i-1的最优划分
        }
        map.set(xor, i); // 记录当前异或和以及出现的位置
        res = Math.max(res, mosts[i]); // 记录最优划分的数量
    }
    return res;
}