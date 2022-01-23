
/**
 * 一个数据流中，随时取得中位数
 */
class MedianHolder {
    constructor() {
        this.maxHeap = new PQ();
        this.minHeap = new PQ();
    }
    modifyTwoHeapsSize() {
        if (this.maxHeap.size() == this.minHeap.size() + 2) {
            this.minHeap.push(this.maxHeap.pop());
        }
        if (this.minHeap.size() == this.maxHeap.size() + 2) {
            this.maxHeap.push(minHead.pop());
        }
    }
    /**
     * 
     * 根据不同情况，添加num分别到两个堆中
     * num < maxHeap堆顶，放入maxHeap中
     * 否则
     *     num >= minHeap堆顶，放入minHeap中
     *     num < minHeap堆顶，还是放入到maxHeap中
     * 然后调整两个堆的size
     * getMedian()的时候，偶数则取平均，奇数则取size大的堆的堆顶
     * 
     */
    addNumber(num) {
        if (this.maxHeap.isEmpty()) {
            this.maxHeap.push(num);
            return;
        }
        if (num <= this.maxHeap.top()) {
            this.maxHeap.push(num);
        } else {
            if (this.minHeap.isEmpty()) {
                this.minHeap.push(num);
                return;
            }
            if (num < this.minHeap.top()) {
                this.maxHeap.push(num);
            } else {
                this.minHeap.push(num);
            }
        }
        this.modifyTwoHeapsSize();
    }
    getMedian() {
        let maxHeapSize = this.maxHeap.size();
        let minHeapSize = this.minHeap.size();
        if (maxHeapSize + minHeapSize == 0) {
            return null;
        }
        let maxHead = this.maxHeap.top();
        let minHead = this.minHeap.top();
        if (((maxHeapSize + minHeapSize) & 1) == 0) {
            return (maxHead + minHead) / 2;
        }
        return maxHeapSize > minHeapSize ? maxHead : minHead;
    }
}


// for test
function getRandomArray(maxLen, maxValue) {
    let res = new Array(Math.floor((maxSize + 1) * Math.random()));
    for (let i = 0; i != res.length; i++) {
        res[i] = Math.floor(Math.random() * maxValue);
    }
    return res;
}

// for test, this method is ineffective but absolutely right
function getMedianOfArray(arr) {
    let newArr = copyArray(arr);
    Arrays.sort(newArr);
    let mid = (newArr.length - 1) / 2;
    if ((newArr.length & 1) == 0) {
        return (newArr[mid] + newArr[mid + 1]) / 2;
    } else {
        return newArr[mid];
    }
}

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

function prletArray(arr) {
    console.log(arr);
}


// for test
function main() {
    let err = false;
    let testTimes = 200000;
    for (let i = 0; i != testTimes; i++) {
        let len = 30;
        let maxValue = 1000;
        let arr = getRandomArray(len, maxValue);
        let medianHold = new MedianHolder();
        for (let j = 0; j != arr.length; j++) {
            medianHold.addNumber(arr[j]);
        }
        if (medianHold.getMedian() != getMedianOfArray(arr)) {
            err = true;
            prletArray(arr);
            break;
        }
    }
    console.log(err ? "Oops..what a fuck!" : "today is a beautiful day^_^");
}

main();