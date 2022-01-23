
// 由于JS不支持函数重载
function smallSum(arr) {
    if (arr == null || arr.length < 2) {
        return 0;
    }
    return mergeSort(arr, 0, arr.length - 1);
}

function mergeSort(arr, left, right) {
    if (left == right) {
        return 0;
    }
    let mid = left + ((right - left) >> 1);
    return mergeSort(arr, left, mid) + mergeSort(arr, mid + 1, right) + merge(arr, left, mid, right);
}

function merge(arr, left, mid, right) {
    let helper = new Array(right - left + 1);
    let p1 = left, p2 = mid + 1;
    let i = 0;
    let res = 0;
    while (p1 <= mid && p2 <= right) {
        // 问题转化成 两个有序数组，求合并过程中的小和
        // 最小和概念 等价于 数组右侧大于number的元素个数 * number 
        if (arr[p1] < arr[p2]) {
            res += (right - p2 + 1) * arr[p1];
            helper[i++] = arr[p1++];
        }
        else {// arr[p1] == arr[p2]
            helper[i++] = arr[p2++];
        }
        // res += arr[p1] < arr[p2] ? (right - p2 + 1) * arr[p1] : 0;
        // helper[i++] = arr[p1] < arr[p2] ? arr[p1++] : arr[p2++]; // 这里只能是p1<p2不能是p1<=p2，例子[2,1,2,3]，最后合并的时候[1,2][2,3]思考即可

    }
    while (p1 <= mid) {
        helper[i++] = arr[p1++];
    }
    while (p2 <= right) {
        helper[i++] = arr[p2++];
    }
    for (i = 0; i < helper.length; i++){
        arr[left + i] = helper[i];
    }
    return res;
}

// for test
/**
 * 
 * @param {Array} arr 
 */
function comparator(arr) {
    if (arr == null || arr.length < 2) {
        return 0;
    }
    let res = 0;
    for (let i = 1; i < arr.length; i++){
        for (let j = 0; j < i; j++) {
            res += arr[j] < arr[i] ? arr[j] : 0;
        }
    }
    return res;
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
        if (smallSum(arr1) != comparator(arr2)) {
            succeed = false;
            printArray(arr1);
            printArray(arr2);
            console.log(smallSum(arr1),comparator(arr2))
            break;
        }
    }
    console.log(succeed ? "Nice!" : "Fucking fucked!");
}

main();
// console.log(smallSum([2, 1, 2, 3]), comparator([2, 1, 2, 3]))