
/**
 * 无序数组，返回TOP-K问题
 * sln-1 用size=K的堆解决TOPK，时间O(N*logK)
 * sln-2 BFRPT解决，最坏O(N)
 */


/**
 * 求最小的K个元素，用大根堆
 * sln-1 堆解决TOP-K
 * 时间O(N*logK)
 * 先创建size=k的数组作为大根堆
 * arr中前k个元素添加到堆中
 * arr之后的元素遍历，如果arr小于大根堆的堆顶，放入堆顶进行heapify
 * 
 */
function getMinKNumsByHeap(arr, k) {
    if (k < 1 || k > arr.length) {
        return arr;
    }
    let res = new Array(k);
    for (let i = 0; i < k; i++) {
        heapInsert(res, arr[i], i);
    }
    for (let i = k; i != arr.length; i++) {
        if (arr[i] < res[0]) { // arr存在比[大根堆堆顶]小的元素
            res[0] = arr[i];
            heapify(res, 0, k);
        }
    }
    return res;
}

/**
 * 大根堆
 * 添加元素到堆中，然后上滤
 */
function heapInsert(arr, value, idx) {
    arr[idx] = value;
    while (idx != 0) {
        let parent = Math.floor((idx - 1) / 2);
        if (arr[idx] > arr[parent]) {
            swap(arr, parent, idx);
            idx = parent;
        } else {
            break;
        }
    }
}

/**
 * 大根堆
 * 堆顶元素修改后，进行下滤
 * 将cur和左右孩子中的更大者交换
 */
function heapify(arr, idx, heapSize) {
    let left = idx * 2 + 1;
    let right = idx * 2 + 2;
    let largest = idx;
    while (left < heapSize) {
        if (arr[left] > arr[idx]) {
            largest = left;
        }
        if (right < heapSize && arr[right] > arr[largest]) {
            largest = right;
        }
        if (largest != idx) {
            // 如果左右孩子更大，那么进行交换下滤
            swap(arr, largest, idx);
        } else {
            // 否则，下滤停止
            break;
        }
        idx = largest;
        left = idx * 2 + 1;
        right = idx * 2 + 2;
    }
}

/**
 * BFRPT
 * 1.
 * 
 */
function getMinKNumsByBFPRT(arr, k) {
    if (k < 1 || k > arr.length) {
        return arr;
    }
    let minK = getMinKthByBFPRT(arr, k); // O(N)时间获取第k小元素的val
    let res = new Array(k);
    let idx = 0;
    for (let i = 0; i < arr.length; i++) { // 遍历数组，小于val就填充，
        if (arr[i] < minK) {
            res[idx++] = arr[i];
        }
    }
    for (; idx != res.length; idx++) { // 最后如果不够K个，就填充val
        res[idx] = minK;
    }
    return res; // 返回前k小的元素构成的数组
}

/**
 * O(N)获取第K大的value
 * rank=k即排序后处于idx=k-1
 */
function getMinKthByBFPRT(arr, K) {
    let cp = copyArray(arr);
    return select(cp, 0, cp.length - 1, K - 1);
}

/**
 * BFPRT核心函数，最核心的过程
 * 先分组，获取中位数数组的中位数作为pivot
 * 然后用pivot进行划分三部分
 * - 如果idx命中了等于区间，直接返回value
 * - 如果idx在左侧，递归
 * - 如果idx在右侧，递归
 */
function select(arr, begin, end, i) {
    if (begin == end) {
        return arr[begin];
    }
    let pivot = medianOfMeidans(arr, begin, end);
    let pivotRange = partition(arr, begin, end, pivot);
    if (i >= pivotRange[0] && i <= pivotRange[1]) {
        return arr[i];
    } else if (i < pivotRange[0]) {
        return select(arr, begin, pivotRange[0] - 1, i);
    } else {
        return select(arr, pivotRange[1] + 1, end, i);
    }
}

/**
 * 以每组5人为单位进行划分，然后对每个小组排序，取出中位数构成数组
 * 然后递归BFPRT，获取新数组的中位数，rank=newArr.length/2
 * 作为pivot进行划分
 */
function medianOfMeidans(arr, begin, end) {
    let size = end - begin + 1;
    let offset = size % 5 == 0 ? 0 : 1;
    let mids = new Array(Math.floor(size / 5) + offset);
    for (let i = 0; i < mids.length; i++) {
        let beginI = i * 5 + begin;
        let endI = beginI + 4;
        mids[i] = getMedian(arr, beginI, Math.min(endI, end));
    }
    // 至此，已经获取了中位数数组
    return select(mids, 0, mids.length - 1, Math.floor(mids.length / 2));
    // 调用BFPRT，返回rank=mids.length/2的元素，也就是中位数
}

/**
 * 返回等于区域的左边界和右边界
 */
function partition(arr, begin, end, pivotValue) {
    let small = begin - 1;
    let cur = begin;
    let big = end + 1;
    while (cur != big) {
        if (arr[cur] < pivotValue) {
            small++;
            swap(arr, small, cur++);
        } else if (arr[cur] > pivotValue) {
            swap(arr, --big, cur);
        } else {
            cur++;
        }
    }
    let res = new Array(2);
    res[0] = small + 1;
    res[1] = big - 1;
    return res;
}

function getMedian(arr, begin, end) {
    insertSort(arr, begin, end);
    let sum = begin + end;
    if (sum % 2 == 0) {
        return arr[sum / 2];
    } else {
        return arr[Math.floor(sum / 2) + 1];
    }
}

function insertSort(arr, begin, end) {
    for (let i = begin + 1; i < end; i++) {
        let j = i - 1;
        while (j >= 0 && arr[j] > arr[j + 1]) {
            swap(arr, j, j + 1);
            j--;
        }
    }
}

function copyArray(arr) {
    return arr.slice();
}

function getMinKNumsByQuicksort(arr, k) {
    let res = new Array(k);
    _process(arr, 0, arr.length - 1, k);
    for (let i = 0; i < k; i++){
        res[i] = arr[i];
    }
    return res;
}

function _process(arr, L, R, k) {
    if (L < R) {
        let idx = L + Math.floor(Math.random() * (R - L + 1));
        swap(arr, idx, R);
        let res = _partition(arr, L, R);
        if (k < res[0]) {
            _process(arr, L, res[0] - 1, k);
        } else if (k > res[1]) {
            _process(arr, res[1] + 1, R, k);
        }
        return;
    }
}

function _partition(arr, L, R) {
    let small = L - 1;
    let big = R;
    let pivot = arr[R];
    let cur = L;
    while (cur < big) {
        if (arr[cur] < pivot) {
            swap(arr, ++small, cur++);
        } else if (arr[cur] > pivot) {
            swap(arr, --big, cur);
        } else {
            cur++;
        }
    }
    swap(arr, big++, R);
    return [small + 1, big - 1];
}

function swap(arr, idx1, idx2) {
    let temp = arr[idx1];
    arr[idx1] = arr[idx2];
    arr[idx2] = temp;
}

function printArray(arr) {
    console.log(arr);
}

// for test
function main() {
    let arr = [6, 9, 1, 3, 1, 2, 2, 5, 6, 1, 3, 5, 9, 7, 2, 5, 6, 1, 9];
    printArray(getMinKNumsByHeap(arr, 5));
    printArray(getMinKNumsByBFPRT(arr, 5));
    printArray(getMinKNumsByQuicksort(arr, 5));
}

main();