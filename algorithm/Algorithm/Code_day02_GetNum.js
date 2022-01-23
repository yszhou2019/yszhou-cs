
/**
 * 子数组这里指的是连续的，size=n的数组，一共有O(n^2)个子数组
 * sln-1 暴力解法，作为对数器，O(N^3)，绝对会超时
 * sln-2 O(N)求出符合条件的子数组个数
 */

function GetNum1(arr, num) {
    let res = 0;
    for (let i = 0; i < arr.length; i++) {
        for (let j = i; j < arr.length; j++) {
            if (isValid(arr, i, j, num)) {
                res++;
            }
        }
    }
    return res;
}

function isValid(arr, start, end, num) {
    let max = Number.MIN_SAFE_INTEGER;
    let min = Number.MAX_SAFE_INTEGER;
    for (let i = start; i <= end; i++) {
        max = Math.max(max, arr[i]);
        min = Math.min(min, arr[i]);
    }
    return max - min <= num;
}

/**
 * 基于以下几点推论
 * 1. 如果arr[i,j]满足了max-min<=num，那么arr[i,j]的子数组仍然满足(达标的数组，子数组一定达标)
 * 2. 如果arr[i,j]不满足max-min<=num，那么arr[i,j]往外扩充形成的数组，仍然不达标(不达标，外扩必然不达标)
 */
function GetNum2(arr, num) {
    if (arr.length == 0 || arr == null) {
        return 0;
    }
    // 准备最小值和最大值的更新结构
    let qmax = [];
    let qmin = [];
    let L = 0, R = 0, res = 0;
    while (L < arr.length) {
        // L确定时，R往右扩展到最右
        // 本层循环最多进行L=arr.len次
        while (R < arr.length) {
            // 本层循环最多进行R=arr.len次
            // 两层循环嵌套最多进行2*arr.len次
            // 最小值结构更新
            while (qmin.length > 0 && arr[qmin[qmin.length - 1]] >= arr[R]) {
                qmin.pop();
            }
            qmin.push(R);
            // 最大值结构更新
            while (qmax.length > 0 && arr[qmax[qmax.length - 1]] <= arr[R]) {
                qmax.pop();
            }
            qmax.push(R);
            if (arr[qmax[0]] - arr[qmin[0]] > num) {
                // 不达标的情况
                break;
            }
            R++;
        }
        if (qmin[0] == L) { // 如果q[0]是L，意味着当前以L开头的子数组已经统计完毕
            qmin.shift();
        }
        if (qmax[0] == L) {
            qmax.shift();
        }
        // 一次性加上所有以L开头的子数组数量
        res += R - L;
        L++;
    }
    return res;
}
/**
 * 整体思路和暴力算法一样，枚举左边界和右边界，不停向右扩，扩的同时用滑动窗口求解max和min，直到无法扩
 * 无法扩右边界的时候说明此时以i开头的满足条件的数组已经统计完毕；进行i++即将开始下个位置的统计，需要提前看看qmax和qmin[0]是不是i，如果是就需要pop i
 */
function GetNum3(arr, num) {
    if (arr.length == 0 || arr == null) {
        return 0;
    }
    let res = 0;
    let j = 0;
    let qmax = [];
    let qmin = [];
    for (let i = 0; i < arr.length; i++) {
        while (j < arr.length) { // R不停的向右扩，直到扩不动，统计以i开头，j结尾的数组的子数组的个数
            while (qmax.length > 0 && arr[qmax[qmax.length - 1]] <= arr[j]) { // CNM！ 这两个是while循环！ 不是if！
                qmax.pop();
            }
            qmax.push(j);
            while (qmin.length > 0 && arr[qmin[qmin.length - 1]] >= arr[j]) { // CNM！ 这两个是while循环！ 不是if！
                qmin.pop();
            }
            qmin.push(j);
            if (arr[qmax[0]] - arr[qmin[0]] > num) {
                break;
            }
            j++; // 扩的前提是max-min<=num
        }
        // j不能再扩的时候进行统计
        res += j - i; // 由于j推出循环的时候刚好不满足扩充条件，所以j-i刚好就是子数组的个数
        if (qmax[0] == i) { // 当qmax[0]==i，由于我们下一步要求解 i++ 后 以i开始的数组，因此数据过期，将过期数据退出
            qmax.shift();
        }
        if (qmin[0] == i) {
            qmin.shift();
        }
    }
    return res;
}

// for test
function main() {
    let arr = [0, 7, 3, 1];
    console.log(GetNum1(arr, 2));
    console.log(GetNum2(arr, 2));
    console.log(GetNum3(arr, 2));
}

main();