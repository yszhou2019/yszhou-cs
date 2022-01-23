
/**
 * 
 * @param {*} arr 
 * 给定一个数组，
 * 最关键的有两点，桶的个数，以及每个arr[i]该存放到哪个Bucket中
 * 桶的个数=arrLen+1，因此，buckets中必然至少存在一个空桶
 */
function maxGap(arr) {
    if (arr == null || arr.length < 2) {
        return 0;
    }
    let max = Number.MIN_SAFE_INTEGER;
    let min = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < arr.length; i++) {
        max = Math.max(max, arr[i]);
        min = Math.min(min, arr[i]);
    }
    let hasNum = new Array(arr.length + 1);
    let maxs = new Array(arr.length + 1);
    let mins = new Array(arr.length + 1);
    // 遍历所有arr[i]，更新相应的bucket
    for (let i = 0; i < arr.length; i++) {
        let idx = bucket(arr[i], arr.length, max, min);
        maxs[idx] = hasNum[idx] ? Math.max(maxs[idx], arr[i]) : arr[i];
        mins[idx] = hasNum[idx] ? Math.min(mins[idx], arr[i]) : arr[i];
        hasNum[idx] = true;
    }
    // 遍历所有的bucket，找到最大gap即可
    let res = 0;
    let lastMax = maxs[0]; // 注意这里，lastMax初始值是maxs[0]而不是min
    for (let i = 1; i < arr.length + 1; i++) {
        if (hasNum[i]) {
            res = Math.max(res, mins[i] - lastMax);
            lastMax = maxs[i];
        }
    }
    return res;
}

/**
 * 
 * @param {*} num 
 * @param {*} arrLen 给定arr数组的长度
 * @param {*} max 
 * @param {*} min 
 * 对于arr[i]，返回相应需要存入的桶的序号
 * min元素返回idx=0，存入到bucket[0]中
 * max元素返回idx=arrLen,存入到bucket[arrLen]中
 */
function bucket(num, arrLen, max, min) {
    return Math.floor((num - min) * arrLen / (max - min));
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
    if (arr == null || arr.length < 2) {
        return 0;
    }
    arr.sort((a, b) => a - b); // JS尤其要注意这里，升序排列，返回a-b；不写compare函数，默认以字符串进行处理，按照字典序排序
    let gap = Number.MIN_SAFE_INTEGER;
    for (let i = 1; i < arr.length; i++) {
        gap = Math.max(gap, arr[i] - arr[i - 1]);
    }
    return gap;
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
        arr[i] = Math.ceil((maxValue + 1) * Math.random()) - Math.ceil(maxValue * Math.random());
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
        if (maxGap(arr1) != comparator(arr2)) {
            succeed = false;
            printArray(arr1);
            printArray(arr2);
            break;
        }
    }
    console.log(succeed ? "Nice!" : "Fucking fucked!");
}

main();