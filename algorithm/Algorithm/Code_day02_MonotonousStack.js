
/**
 * 单调栈介绍
 * O(N)时间求出数组中每个元素，左边最近的比它大的和右边最近的比它小的
 * 采用单调栈
 * - 遍历数组，从小到大入栈，违背者弹出并写入res数组
 * - 遍历完毕，逐一弹出，写入res
 */
function getNearLessNoRepeat(arr) {
    let res = new Array(2);
    res[0] = new Array(arr.length);
    res[1] = new Array(arr.length);
    let stack = [];
    // 遍历数组，单调栈入栈，违背者弹出并写入
    for (let i = 0; i < arr.length; i++) {
        // 违背了top<=arr，也就是top>arr，则弹出
        while (stack.length > 0 && arr[stack[stack.length - 1]] > arr[i]) {
            let top = stack.pop();
            res[0][top] = stack.length == 0 ? -1 : stack[stack.length - 1];
            res[1][top] = i;
        }
        // 不违背则入栈
        stack.push(i);
    }
    // 遍历完毕，逐一弹空
    while (stack.length > 0) {
        let top = stack.pop();
        res[0][top] = stack.length == 0 ? -1 : stack[stack.length - 1];
        res[1][top] = -1;
    }
    return res;
}

// [3,3,2,1]
// 0  :  -1 ,  2
// 1  :  -1 ,  2
// 2  :  -1 ,  3
// 3  :  -1 , -1
/**
 * 带有重复元素的单调栈
 * 单调栈中保存的是链表的下标，每个链表可以包含多个重复元素的下标
 */
function getNearLess(arr) {
    let res = new Array(2);
    res[0] = new Array(arr.length);
    res[1] = new Array(arr.length);
    let stack = [];
    // 遍历数组，遵循单调则入栈，违背者弹出并写入res
    for (let i = 0; i < arr.length; i++) {
        // 违背大小顺序，弹出链表并写入res
        while (stack.length > 0 && arr[stack[stack.length - 1][0]] > arr[i]) {
            let list = stack.pop();
            let left = stack.length == 0 ? -1 : stack[stack.length - 1][stack[stack.length - 1].length - 1];
            for (let v of list) {
                res[0][v] = left;
                res[1][v] = i;
            }
        }
        // 不违背则正常形成链表入栈
        if (stack.length > 0 && arr[stack[stack.length - 1][0]] == arr[i]) {
            // 如果有对应的链表
            stack[stack.length - 1].push(i);
        } else {
            // 没有则形成链表
            stack.push([i]);
        }
    }
    // 遍历完毕，不断弹出并写入res
    while (stack.length > 0) {
        let list = stack.pop();
        let left = stack.length == 0 ? -1 : stack[stack.length - 1][stack[stack.length - 1].length - 1];
        for (let v of list) {
            res[0][v] = left;
            res[1][v] = -1;
        }
    }
    return res;
}

// for test
function getRandomArrayNoRepeat(size) {
    let arr = new Array(Math.floor(Math.random() * size + 1));
    for (let i = 0; i < arr.length; i++) {
        arr[i] = i;
    }
    for (let i = 0; i < arr.length; i++) {
        let swapIndex = Math.floor(Math.random() * arr.length);
        let tmp = arr[swapIndex];
        arr[swapIndex] = arr[i];
        arr[i] = tmp;
    }
    return arr;
}

function getRandomArray(size, max) {
    let arr = new Array(Math.floor(Math.random() * size + 1));
    for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * max) - Math.floor(Math.random() * max);
    }
    return arr;
}

// for test O(N^2)
function rightWay(arr) {
    let res = new Array(2);
    res[0] = new Array(arr.length);
    res[1] = new Array(arr.length);
    for (let i = 0; i < arr.length; i++) {
        let leftLessIndex = -1;
        let rightLessIndex = -1;
        let cur = i - 1;
        while (cur >= 0) {
            if (arr[cur] < arr[i]) {
                leftLessIndex = cur;
                break;
            }
            cur--;
        }
        cur = i + 1;
        while (cur < arr.length) {
            if (arr[cur] < arr[i]) {
                rightLessIndex = cur;
                break;
            }
            cur++;
        }
        res[0][i] = leftLessIndex;
        res[1][i] = rightLessIndex;
    }
    return res;
}

function isEqual(res1, res2) {
    if (res1.length != res2.length) {
        return false;
    }
    for (let i = 0; i < res1.length; i++) {
        if (res1[0][i] != res2[0][i] || res1[1][i] != res2[1][i]) {
            return false;
        }
    }

    return true;
}

function printArray(arr) {
    console.log(arr);
}

function main() {
    let size = 10;
    let max = 20;
    let testTimes = 2000000;
    for (let i = 0; i < testTimes; i++) {
        let arr1 = getRandomArrayNoRepeat(size);
        let arr2 = getRandomArray(size, max);
        if (!isEqual(getNearLessNoRepeat(arr1), rightWay(arr1))) {
            console.log("Oops!");
            printArray(arr1);
            break;
        }
        if (!isEqual(getNearLess(arr2), rightWay(arr2))) {
            console.log("Oops!");
            printArray(arr2);
            break;
        }
    }
    console.log("Yes!");
}

main();