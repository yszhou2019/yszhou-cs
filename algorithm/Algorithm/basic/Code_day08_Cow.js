
/**
 * 
 * 兔子每年生一只兔子，新出生的兔子三年之后每年生一只，假设不会死亡。求n年后，兔子的数量
 * 顺序计算fn=f(n-1)+f(n-3)
 * 时间O(n)，空间O(1)
 * 存在O(logn)的方法，利用线性代数的矩阵乘法方式
 */
function cowNumber1(n) {
    if (n == 1 || n == 2 || n == 3) {
        return n;
    }
    let res = 3;
    let pre = 2;
    let prepre = 1; // 3年前的兔子总量
    let temp1 = 0;
    let temp2 = 0;
    for (let i = 4; i <= n; i++){
        temp1 = res;
        temp2 = pre;
        res += prepre; // 3年前的兔子总量
        pre = temp1;
        prepre = temp2;
    }
    return res;
}

function cowNumber2(n) {
    if (n == 1) {
        return 1;
    }
    if (n == 2) {
        return 2;
    }
    if (n == 3) {
        return 3;
    }
    return cowNumber2(n - 1) + cowNumber2(n - 3);
}

/**
 * res + = 3年前的res
 * 数据流动: res->1年前的res->2年前的res->3年前的res
 */
function cowNumber3(n) {
    if (n == 1 || n == 2 || n == 3) {
        return n;
    }
    let t = [1, 2, 3];
    let res = 3;
    for (let i = 4; i <= n; i++){
        res += t[0];
        t[0] = t[1];
        t[1] = t[2];
        t[2] = res;
    }
    return res;
}


// for test
function main() {
    let n = 20;
    console.log(cowNumber1(n));
    console.log(cowNumber2(n));
    console.log(cowNumber3(n));
}

main();