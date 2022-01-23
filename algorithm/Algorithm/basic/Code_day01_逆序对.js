
// 由于JS不支持函数重载
function nixudui(arr) {
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
        if (arr[p1] > arr[p2]) {
            res += mid - p1 + 1;
            helper[i++] = arr[p2++];
        } else { // arr[p1] == arr[p2]
            helper[i++] = arr[p1++];
        }
        // 求逆序对 转化成 求两个有序数组 之间的逆序对。逆序对数量=每个右侧数组中的number，左侧数组中大于number的元素个数
        // res += arr[p1] > arr[p2] ? (mid - p1 + 1) : 0;
        // helper[i++] = arr[p1] <= arr[p2] ? arr[p1++] : arr[p2++]; // 这里必须是p1 <= p2 不能是p1 < p2，否则求左右两个数组之间的逆序对时，两个指针指向相同的数据，会优先消耗右边的数组，右侧数组如果直接越界跳出while循环，就会不再统计逆序对。例子比如[-1,-2,-2]。因此，应该优先消耗左侧数组，也就是元素相同的时候，移动左侧指针并拷贝。
    }
    while (p1 <= mid) {
        helper[i++] = arr[p1++];
    }
    while (p2 <= right) {
        helper[i++] = arr[p2++];
    }
    for (i = 0; i < helper.length; i++) {
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
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] > arr[j]) {
                res++;
            }
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
        let a = nixudui(arr1);
        let b = comparator(arr2);
        if (a != b) {
            succeed = false;
            printArray(arr1);
            printArray(arr2);
            console.log(a, b);
            break;
        }
    }
    console.log(succeed ? "Nice!" : "Fucking fucked!");
}

main();
// function another() {
//     let get = nixudui([-1, -2, -2]);
//     console.log(get);
//     get = comparator([-1, -2, -2])
//     console.log(get);
// }
// another();
