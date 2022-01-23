
/**
 * 累加和<=给定值的最长子数组
 * 最优解，时间O(n)
 * min_sum[idx] 从idx开始的所有子数组的累加和的最小者
 * min_sum_index[idx] 取得最小累加和的右边界
 */
function maxLengthAwesome(arr, aim) {
    if (arr == null || arr.length == 0) {
        return 0;
    }
    let sums = new Array(arr.length);
    let ends = new Array(arr.length);
    // 生成两个辅助数组
    sums[arr.length - 1] = arr[arr.length - 1];
    ends[arr.length - 1] = arr.length - 1;
    for (let i = arr.length - 2; i >= 0; i--) { // 注意是倒着计算
        if (sums[i + 1] < 0) {
            sums[i] = arr[i] + sums[i + 1];
            ends[i] = ends[i + 1];
        } else {
            sums[i] = arr[i];
            ends[i] = i;
        }
    }

    let R = 0;
    let sum = 0;
    let len = 0;
    for (let start = 0; start < arr.length; start++){
        // 数组没有越界，并且累加和<=aim的情况下，不断根据辅助数组，向右扩充
        while (R < arr.length && sum + sums[R] <= aim) {
            sum += sums[R];
            R = ends[R] + 1;
        }
        // 右边界不回退，直接减小左边界，从而加速 类似于双指针滑动窗口
        sum -= R > start ? arr[start] : 0;
        // [start, R-1] 一共R-1 - start +1=R-start
        len = Math.max(len, R - start);
        // 处理R没有向右扩的情况，比如一开始arr[0]就超过了aim
        R = Math.max(R, start + 1);
    }
    return len;
}

/**
 * 二分加速，不是最优价，时间O(nlogn)
 */
function maxLength(arr, k) {
    
}

function getLessIndex(arr, num) {
    
}

function generateRandomArray(size, maxValue) {
    let arr = new Array(size);
    for (let i = 0; i < size; i++) {
        arr[i] = Math.floor(Math.random() * maxValue) - (maxValue / 3);
    }
    return arr;
}

// for test
function main() {
    // for (let i = 0; i < 1000000; i++) {
    //     let arr = generateRandomArray(10, 20);
    //     let k = Math.floor(Math.random() * 20) - 5;
    //     if (maxLengthAwesome(arr, k) != maxLength(arr, k)) {
    //         System.out.println("oops!");
    //     }
    // }
    let arr = [100, 200, 7, -6, -3, 300];
    console.log(maxLengthAwesome(arr, 7));
}

main();