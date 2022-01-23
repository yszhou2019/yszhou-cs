
/**
 * 
 * 知道怎么算，P类解法
 */
function getFactorial1(n) {
    let res = 1;
    for (let i = 1; i <= n; i++) {
        res *= i;
    }
    return res;
}

/**
 * 
 * 不知道怎么算，但是知道怎么尝试出答案，NP类解法
 */
function getFactorial2(n) {
    if (n == 1) {
        return 1;
    }
    return n * getFactorial2(n - 1);
}



// for test
function main() {
    let n = 5;
    console.log(getFactorial1(n));
    console.log(getFactorial2(n));
}

main();