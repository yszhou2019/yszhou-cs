
/**
 * 切分金条
 * 按照指定的要求进行切割，求出最小的切割代价
 * 最关键的地方，按照huffman编码思想，利用优先级队列实现
 */
function LessMoney(arr) {
    let pq = new PQ();
    for (let i = 0; i < arr.length; i++){
        pq.push(arr[i]);
    }
    let res = 0;
    while (pq.length > 1) {
        let temp = pq.pop() + pq.pop();
        res += temp;
        pq.push(temp);
    }
    return res;
}


// for test
function main() {
    let N = 4;
    printAllFolds(N);
}

main();