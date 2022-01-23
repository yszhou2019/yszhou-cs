
/**
 * 求正整数数组中，累加和=给定值的最长子数组的长度
 * 双指针构成滑动窗口，时间O(n)，空间O(1)
 */
function getMaxLength(arr, k) {
    if (arr == null || arr.length == 0 || k <= 0) {
        return 0;
    }
    let L = 0;
    let R = 0;
    let sum = arr[0];
    let len = 0; // len设置成1可以吗，不重要！len只对部分情况进行求值，移动过程中不需要对len进行改变。只有当累加和=给定值的时候，才对len求值，所以初值设置成0没问题，设置成1也没问题。
    // R代表的是下标，合法下标最多为arr.len-1
    while (R < arr.length) {
        if (sum == k) {
            len = Math.max(len, R - L + 1);
            sum -= arr[L];
            L++;
        } else if (sum > k) {
            sum -= arr[L];
            L++;
        } else {
            R++;
            if (R == arr.length) {
                break;
            }
            sum += arr[R];
        }
    }
    return len;
}

function getMaxLength2(arr, k) {
    if (arr == null || arr.length == 0 || k <= 0) {
        return 0;
    }
    let L = 0;
    let R = 0;
    let sum = 0;
    let len = 0;
    while (R < arr.length) {
        if (sum < k) {
            sum += arr[R++];
        } else {
            if (sum == k) {
                len = Math.max(len, R - L);
            }
            sum -= arr[L++];
        }
    }
    return len;
}

function generatePositiveArray(size) {
    let arr = new Array(size);
    for (let i = 0; i < size; i++) {
        arr[i] = Math.floor(Math.random() * 10) + 1;
    }
    return arr;
}

// for test
function main() {
    let len = 20;
    let k = 15;
    let arr = generatePositiveArray(len);
    console.log(arr);
    console.log(getMaxLength(arr, k));
    console.log(getMaxLength2(arr, k));
}

main();