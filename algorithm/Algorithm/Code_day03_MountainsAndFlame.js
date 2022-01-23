
/**
 * 单调栈的应用
 * 单调栈从大到小，求出环形山中可以相互看到的山峰对数（如果连续几个高度相同，那么都可以互相看见）（高度不同，只要不存在比左右两边更低者要高的山峰，也能相互看见）
 * 
 */
function communications(arr) {
    if (arr == null || arr.length == 2) {
        return 0;
    }
    let res = 0;
    let stack = [];
    let maxIdx = 0;
    // 记录最高山峰的idx
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > arr[maxIdx]) {
            maxIdx = i;
        }
    }
    stack.push(new Pair(arr[maxIdx]));
    // 从maxIdx开始遍历数组
    let idx = nextIndex(arr.length, maxIdx);
    while (idx != maxIdx) {
        while (stack.length > 0 && stack[stack.length - 1].value < arr[idx]) {
            let top = stack.pop();
            if (top.times == 1) {
                res += 2;
            } else {
                res += getCk2(top.times) + top.times * 2;
            }
        }
        if (stack[stack.length - 1].value == arr[idx]) {
            stack[stack.length - 1].times++;
        } else {
            stack.push(new Pair(arr[idx]));
        }
        idx = nextIndex(arr.length, idx);
    }
    while (stack.length > 0) {
        if (stack.length > 2) {
            // 正常结算
            let top = stack.pop();
            if (top.times == 1) {
                res += 2;
            } else {
                res += getCk2(top.times) + top.times * 2;
            }
        } else if (stack.length == 2) {
            let top = stack.pop();
            if (stack[0].times > 1) {
                // 正常结算
                if (top.times == 1) {
                    res += 2;
                } else {
                    res += getCk2(top.times) + top.times * 2;
                }
            } else {
                // 最高山峰只有1个
                if (top.times == 1) {
                    res += 1;
                } else {
                    res += getCk2(top.times) + top.times;
                }
            }
        } else {
            let top = stack.pop();
            if (top.times > 1) {
                res += getCk2(top.times);
            }
        }
    }
    return res;
}

class Pair {
    constructor(v) {
        this.value = v; // 某个值和值出现的次数
        this.times = 1;
    }
}

/**
 * 环形山脉，循环
 */
function nextIndex(size, i) {
    return i == size - 1 ? 0 : i + 1;
}

/**
 * 组合数C_^2
 */
function getCk2(n) {
    return n * (n - 1) / 2;
}



function communications2(arr) {
    if (arr == null || arr.length == 2) {
        return 0;
    }
    let res = 0;
    let stack = [];
    let maxIdx = 0;
    // 记录最高山峰的idx
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > arr[maxIdx]) {
            maxIdx = i;
        }
    }
    stack.push(new Pair(arr[maxIdx]));
    // 从maxIdx开始遍历数组
    let idx = nextIndex(arr.length, maxIdx);
    while (idx != maxIdx) {
        while (stack.length > 0 && stack[stack.length - 1].value < arr[idx]) {
            let top = stack.pop();
            res += cnt(top.times);
        }
        if (stack[stack.length - 1].value == arr[idx]) {
            stack[stack.length - 1].times++;
        } else {
            stack.push(new Pair(arr[idx]));
        }
        idx = nextIndex(arr.length, idx);
    }
    while (stack.length > 0) {
        // if (stack.length > 2) {
        //     // 正常结算
        //     let top = stack.pop();
        //     res += cnt(top.times);
        // } else if (stack.length == 2) {
        //     let top = stack.pop();
        //     if (stack[0].times > 1) {
        //         res += cnt(top.times);
        //     } else {
        //         res += ck2(top.times) + top.times;
        //     }
        // } else {
        //     let top = stack.pop();
        //     res += ck2(top.times);
        // }
        let top = stack.pop();
        res += ck2(top.times);
        if (stack.length > 1) {
            res += 2 * top.times;
        }
        if (stack.length == 1) {
            res += stack[0].times == 1 ? top.times : 2 * top.times;
        }
    }
    return res;
}

function ck2(num) {
    if (num == 1) {
        return 0;
    }
    return Math.floor(num * (num - 1) / 2);
}

function cnt(num) {
    return ck2(num) + 2 * num;
}

// for test
function main() {
    let arr = [3, 1, 2, 4, 5];
    console.log(communications(arr));
    console.log(communications2(arr));
    arr = [5, 4, 4, 4, 5];
    console.log(communications(arr));
    console.log(communications2(arr));
}

main();