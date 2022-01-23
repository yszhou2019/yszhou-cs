
// 由于JS不支持函数重载
function MergeSort(arr) {
    if (arr == null || arr.length < 2) {
        return;
    }
    mergeSort(arr, 0, arr.length - 1);
}

function mergeSort(arr, left, right) {
    if (left == right) {
        return;
    }
    let mid = left + ((right - left) >> 1); //JS运算符优先级是个坑！加减乘除高于移位运算!
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}

function merge(arr, left, mid, right) {
    let helper = new Array(right - left + 1);
    let p1 = left, p2 = mid + 1;
    let i = 0;
    while (p1 <= mid && p2 <= right) {
        if (arr[p1] < arr[p2]) {
            helper[i++] = arr[p1++];
        } else if (arr[p1] > arr[p2]) {
            helper[i++] = arr[p2++];
        } else { // arr[p1] == arr[p2]
            helper[i++] = arr[p1++];//或者=arr[p2++] 取决于具体问题 例简单的例子思考即可
        }
    }
    while (p1 <= mid) {
        helper[i++] = arr[p1++];
    }
    while (p2 <= right) {
        helper[i++] = arr[p2++];
    }
    for (i = 0; i < helper.length; i++){
        arr[left + i] = helper[i]; // 这里需要拷贝到arr[left+i]中
    }
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
        if (MergeSort(arr1) != comparator(arr2)) {
            succeed = false;
            printArray(arr1);
            printArray(arr2);
            break;
        }
    }
    console.log(succeed ? "Nice!" : "Fucking fucked!");
}

main();