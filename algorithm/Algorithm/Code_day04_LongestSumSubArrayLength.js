
/**
 * 求累加和为给定值的最长子数组
 * 时间O(n) 空间O(n)，一张哈希表
 * map保存的是每个累加以及相应的位置
 */
function LongestSumSubArrayLength(arr, target) {
    let mapSumIdx = new Map();
    let sum = 0;
    let res = 0;
    mapSumIdx.set(0, -1); // 0这个累加和最早出现在idx=-1，举例比如[999,2,2]，target=999，最长子数组长度=1且为arr[0]的情况
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
        if (mapSumIdx.has(sum - target)) {
            res = Math.max(res, i - mapSumIdx.get(sum - target))
        }
        if (!mapSumIdx.has(sum)) {
            mapSumIdx.set(sum, i);
        }
    }
    return res;
}


/**
 * 包含相同数量的奇数偶数的最长子数组
 * 等价于累加和=0的最长子数组
 */
function sln(arr) {
    if (arr == null || arr.length == 0) {
        return 0;
    }
    let res = 0;
    let sum = 0;
    let map = new Map();
    map.set(0, -1);
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i] % 2 == 0 ? -1 : 1; // 奇数+1 偶数-1
        if (map.has(sum - 0)) { // 注意这里是判断map中是否存在累加和=(sum-0)而不是(0-sum)
            res = Math.max(res, i - map.get(sum - 0));
        }
        if (!map.has(sum)) {
            map.set(sum, i);
        }
    }
    return res;
}

// for test
function main() {
    let arr = [7, 3, 2, 1, 1, 7, 7, 7];
    console.log(LongestSumSubArrayLength(arr, 7));
    console.log(sln(arr));
}

main();