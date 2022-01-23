

/**
 * 荷兰国旗问题，将数组下标处于[L,R]的数组，划分成三部分，小于 = 大于 num，返回等于num区域的左右边界 
 * 线性时间复杂度完成对给定数组的划分，划分成三部分，用双指针less和more分别标记小于部分的边界和大于部分的边界
 */
function NetherlandFlags(arr, L, R, num) {
    let less = L - 1;
    let more = R + 1;
    let cur = L;
    while (cur < more) { // 注意终止条件cur>=more
        if (arr[cur] < num) { // 小于的，放到左边
            less++;
            swap(arr, less, cur);
            cur++;
        }
        else if (arr[cur] > num) { // 大于的，放到右边
            swap(arr, --more, cur);
        }
        else {
            cur++;
        }
    }
    return [less + 1, more - 1];
}

function QuickSort(arr) {
    if (arr == null || arr.length < 2) {
        return;
    }
    quickSort(arr, 0, arr.length - 1);
}


function quickSort(arr, L, R) {
    if (L < R) { // 如果partition划分之后没有小于区域，或者没有大于区域，那么不会进入if分支
        swap(arr, L + parseInt(Math.random() * (R - L + 1), R)); // 随机快排，随机选择作为pivot
        let p = partition(arr, L, R);
        quickSort(arr, L, p[0] - 1);
        quickSort(arr, p[1] + 1, R);
    }
}

/**
 * 根据荷兰国旗改进的partition算法，默认选择最后一个元素作为num，将数组划分为三部分
 * 大于区域直接more=R，包括了最后一个元素X，X不参与遍历，最后直接归为，放入到等于区域的最后一个位置即可
 */
function partition(arr, L, R) {
    let less = L - 1;
    let more = R;
    while (L < more) {
        if (arr[L] < arr[R]) { // 直接和最后一个元素比较
            swap(arr, ++less, L++);
        }
        else if (arr[L] > arr[R]) {
            swap(arr, --more, L);
        }
        else {
            L++;
        }
    }
    swap(arr, more, R); // 注意这里，最后直接将X放入等于区域最后一个位置
    return [less + 1, more];
    // 等价于
    swap(arr, more++, R);
    return [less + 1, more - 1];
}


function swap(arr, i, j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}


// for test
/**
 * 
 * @param {Array} arr 
 */
function comparator(arr) {
    arr.sort((a, b) => a - b);
}

// for test
/**
 * 
 * @param {number} maxSize 
 * @param {number} maxValue 
 */
function generateRandomArray(maxSize, maxValue) {
    let arr = new Array(Math.floor((maxSize + 1) * Math.random()));
    for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor((maxValue + 1) * Math.random()) - Math.floor(maxValue * Math.random());
    }
    return arr;
}

// for test
/**
 * 
 * @param {Array} arr 
 */
function copyArray(arr) {
    if (arr == null) {
        return null;
    }
    let res = new Array(arr.length);
    for (let i = 0; i < arr.length; i++) {
        res[i] = arr[i];
    }
    return res;
}

// for test
/**
 * 
 * @param {Array} arr1 
 * @param {Array} arr2 
 */
function isEqual(arr1, arr2) {
    if ((arr1 == null && arr2 != null) || (arr1 != null && arr2 == null)) {
        return false;
    }
    if (arr1 == null && arr2 == null) {
        return true;
    }
    if (arr1.length != arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] != arr2[i]) {
            return false;
        }
    }
    return true;
}

// for test
/**
 * 
 * @param {Array} arr 
 */
function printArray(arr) {
    if (arr == null) {
        return;
    }
    console.log(arr);
    // for (let i = 0; i < arr.length; i++) {
    //     console.log(arr[i] + " ");
    // }
}

// for test
function main() {
    let testTime = 500000;
    let maxSize = 100;
    let maxValue = 100;
    let succeed = true;
    for (let i = 0; i < testTime; i++) {
        let arr1 = generateRandomArray(maxSize, maxValue);
        let arr2 = copyArray(arr1);
        if (QuickSort(arr1) != comparator(arr2)) {
            succeed = false;
            printArray(arr1);
            printArray(arr2);
            break;
        }
    }
    console.log(succeed ? "Nice!" : "Fucking fucked!");
}

main();