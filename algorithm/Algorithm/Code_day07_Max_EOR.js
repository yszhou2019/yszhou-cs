
// 暴力算法，时间复杂度O(n^3)
// 组合有O(n^2)对，但是每组为了求解sum，花费的基本时间是O(n)，因此总时间为O(n^3)
function getMaxE1(arr) {
    if (arr == null || arr.length == 0) {
        return 0;
    }
    let res = Number.MIN_SAFE_INTEGER;
    for (let end = 0; end < arr.length; end++) {
        for (let start = 0; start <= end; start++) {
            let sum = 0;
            for (let k = start; k <= end; k++) {
                sum = sum ^ arr[k];
                res = Math.max(res, sum);
            }
        }
    }
    return res;
}


/**
 * 用额外数组记录中间状态，利用a^b=c => a=b^c的结论，时间O(n^2)，空间O(n)
 * arr[0]   arr[1]   arr[2]   ...   arr[i]   ...   arr[end]
 * <----------------EOR[i]------------------->
 * <-dp[0]-><-----------To Compute----------->
 * 
 * 遍历范围下标的确定:
 * 异或运算，左边长度至少有1个arr元素,右边长度至少有一个arr元素，
 * 右边[start ... i ]start<=i
 * 左边[0 ... start-1 ] => start >=1
 * 
 */
function getMaxE2(arr) {
    if (arr == null || arr.length == 0) {
        return 0;
    }
    let dp = new Array(arr.length).fill(0);
    let res = Number.MIN_SAFE_INTEGER;
    let curSum = 0;
    for (let i = 0; i < arr.length; i++) { // Sum [0, i]
        curSum = curSum ^ arr[i];
        res = Math.max(res, curSum);
        dp[i] = curSum;
        for (let mid = 1; mid <= i; mid++) { // start ... i
            let temp = curSum ^ dp[mid - 1];
            res = Math.max(res, temp);
        }
    }
    return res;
}

/**
 * sln2本质上和sln1没区别，都是通过暴力遍历得到
 * sln3时间O(n)，前缀树，思路其实和sln2差不多，都是a^b=c，那么b=a^c
 * 树中保存的已有的异或和数据
 */
function getMaxE3(arr) {
    if (arr == null || arr.length == 0) {
        return 0;
    }
    let max = Number.MIN_SAFE_INTEGER;
    let eor = 0;
    let Tree = new NumTrie(); // 创建前缀树
    Tree.add(0); // 添加0
    for (let i = 0; i < arr.length; i++) {
        eor ^= arr[i];
        max = Math.max(max, Tree.maxXor(eor)); // 从前缀树中已有的异或和数据中，根据当前数据，直接构建出并返回最大的异或和
        Tree.add(eor); // 并再次添加到前缀树中
    }
    return max;
}

class Node {
    constructor() {
        this.nexts = [null, null];
    }
}

class NumTrie {
    constructor() {
        this.head = new Node();
    }

    // 将给定的新数据添加到前缀树中
    add(num) {
        let cur = this.head;
        for (let move = 31; move >= 0; move--) {
            let path = (num >> move) & 1;
            if (cur.nexts[path] == null) {
                cur.nexts[path] = new Node();
            }
            cur = cur.nexts[path];
        }
    }

    // 根据树中已有数据，返还和指定num进行异或之后的最大值
    maxXor(num) {
        let cur = this.head;
        let res = 0;
        for (let move = 31; move >= 0; move--) {
            let path = (num >> move) & 1;
            // 期待的最好结果
            let best = move == 31 ? path : path ^ 1;
            // 对期待进行现实的修正
            best = cur.nexts[best] == null ? best ^ 1 : best;
            // 对前缀树中的数据直接进行计算，返回最大计算结果
            res = res | ((path ^ best) << move);
            cur = cur.nexts[best];
        }
        return res;
    }
}

function generateRandomArray(maxSize, maxValue) {
    let arr = new Array(Math.floor((maxSize + 1) * Math.random()));
    for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor((maxValue + 1) * Math.random()) - Math.floor(maxValue * Math.random());
    }
    return arr;
}

// for test
function main() {
    let testTime = 500000;
    let maxSize = 30;
    let maxValue = 50;
    let succeed = true;
    for (let i = 0; i < testTime; i++) {
        // let arr = [-3];
        let arr = generateRandomArray(maxSize, maxValue);
        let res = getMaxE3(arr);
        let cmp = getMaxE2(arr);
        let comp = getMaxE1(arr);
        if (res != comp) {
            succeed = false;
            console.log(arr);
            console.log(res);
            console.log(cmp);
            console.log(comp);
            break;
        }
    }
    console.log(succeed ? "Nice!" : "Fucking fucked!");
}

main();