
/**
 * 
 * @param {*} arr 
 * 假设都是正整数
 * 桶排序，数据范围0-150，桶的容量需要给定
 * 1. 确定桶的个数=(max-min)/容量+1
 * 2. 各个桶内部进行排序
 * 3. 按照顺序输出各个桶即可
 */
function bucketSort(arr, bucketSize = 10) {
    if (arr == null || arr.length < 2) {
        return;
    }
    // 这里默认每个桶最多容纳10个元素
    let max = Number.MIN_SAFE_INTEGER;
    let min = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < arr.length; i++) {
        max = Math.max(max, arr[i]);
        min = Math.min(min, arr[i]);
    }
    let buckets = new Array(Math.floor((max - min) / bucketSize) + 1);
    for (let i = 0; i < buckets.length; i++) {
        buckets[i] = [];
    }
    for (let i = 0; i < arr.length; i++) {
        let idx = bucketNum(max, min, arr[i], bucketSize);
        buckets[idx].push(arr[i]);
    }
    for (let i = 0; i < buckets.length; i++) {
        buckets[i].sort();
    }
    let k = 0;
    for (let i = 0; i < buckets.length; i++) {
        for (let j = 0; j < buckets[i].length; j++) {
            arr[k++] = buckets[i][j];
        }
    }
}

/**
 * 
 * @param {*} max 
 * @param {*} min 
 * @param {*} num 
 * @param {*} bucketSize 桶的容量
 * 给定一个num，返回应该放入桶的下标
 */
function bucketNum(max, min, num, bucketSize) {
    return Math.floor((num - min) / bucketSize);
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
    let arr = new Array(Math.ceil((maxSize + 1) * Math.random()));
    for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.ceil((maxValue + 1) * Math.random());
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
    let maxValue = 150;
    let succeed = true;
    for (let i = 0; i < testTime; i++) {
        let arr1 = generateRandomArray(maxSize, maxValue);
        let arr2 = copyArray(arr1);
        if (bucketSort(arr1) != comparator(arr2)) {
            succeed = false;
            printArray(arr1);
            printArray(arr2);
            break;
        }
    }
    console.log(succeed ? "Nice!" : "Fucking fucked!");
}

main();