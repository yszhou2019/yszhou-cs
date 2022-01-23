
/**
 * 给定一个数组，和窗口的宽度w，求出窗口每个位置的max形成的数组
 * 要求时间O(N)
 * @param {*} w 窗口的宽度
 * 利用滑动窗口
 * 窗口qmax内部，从大到小排列，每次要存储的是qmax[0]
 */
function GetMaxWindow(arr, w) {
    if (arr == null || w < 1 || arr.length < w) {
        return null;
    }
    let qmax = []; // 对应的窗口
    let res = new Array(arr.length - w + 1); // 储存每个窗口的max
    let idx = 0;
    for (let i = 0; i < arr.length; i++) {
        // 窗口添加数据的逻辑，可以保证q[0]总保存的是最大值元素的idx
        while (qmax.length > 0 && arr[qmax[qmax.length - 1]] <= arr[i]) {
            qmax.pop();
        }
        qmax.push(i);
        // 当窗口已经装满的时候，需要减数
        if (i - qmax[0] == w) { // 重点！当前idx和max对应的idx i-q[0]+1=W+1 说明窗口已经满了
            qmax.shift();
        }
        if (i - w + 1 >= 0) { // 窗口大小为w，则形成窗口，保存一次max
            res[idx++] = arr[qmax[0]];
        }
    }
    return res;
}

// fot test
function main() {
    let arr = [2, 3, 4, 2, 6, 2, 5, 1];
    let size = 3;
    console.log(GetMaxWindow(arr, size));
}

main();