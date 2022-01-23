
function heapSort(arr) {
    if (arr == null || arr.length < 2) {
        return;
    }
    // 数组逐渐建堆，复杂度O(n)
    for (let i = 0; i < arr.length; i++) {
        heapInsert(arr, i);
    }
    let heapSize = arr.length;
    // 堆顶弹出到堆尾，heapSize--
    swap(arr, 0, --heapSize);
    while (heapSize > 0) {
        heapify(arr, 0, heapSize);
        swap(arr, 0, --heapSize);
    }
}

/**
 * 从指定的index开始进行上滤
 */
function heapInsert(arr, index) {
    let parent = parseInt((index - 1) / 2);
    while (arr[index] > arr[parent]) {
        swap(arr, index, parent);
        index = parent;
    }
}

/**
 * 大根堆的从指定的index开始进行下滤，从子节点中选择更大的节点
 */
function heapify(arr, index, size) {
    let left = index * 2 + 1;
    while (left < size) {
        let largest = left + 1 < size && arr[left] < arr[left + 1] ? left + 1 : left;
        largest = arr[largest] > arr[index] ? largest : index;
        if (largest == index) {
            break;
        }
        swap(arr, largest, index);
        index = largest;
        left = index * 2 + 1;
    }
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
        if (heapSort(arr1) != comparator(arr2)) {
            succeed = false;
            printArray(arr1);
            printArray(arr2);
            break;
        }
    }
    console.log(succeed ? "Nice!" : "Fucking fucked!");
}

main();