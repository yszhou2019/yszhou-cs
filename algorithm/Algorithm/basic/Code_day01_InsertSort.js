
function InsertSort(arr) {
    if (arr == null || arr.length < 2) {
        return;
    }
    for (let i = 1; i < arr.length; i++) {
        for (let j = i - 1; j >= 0 && arr[j] > arr[j + 1]; j--){
            swap(arr, j, j + 1);
        }
    }
}

function swap(arr, idx1, idx2) {
    let temp = arr[idx1];
    arr[idx1] = arr[idx2];
    arr[idx2] = temp;
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
        if (InsertSort(arr1) != comparator(arr2)) {
            succeed = false;
            printArray(arr1);
            printArray(arr2);
            break;
        }
    }
    console.log(succeed ? "Nice!" : "Fucking fucked!");
}

main();