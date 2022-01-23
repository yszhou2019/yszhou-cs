
class Node {
    constructor(p, c) {
        this.p = p;
        this.c = c;
    }
}

/**
 * 
 * @param {*} k 最多允许项目个数
 * @param {*} W 初始资金
 * @param {*} Profits 每个项目的净盈利
 * @param {*} Capital 每个项目需要的资金
 * 输出最终的最大收益
 * 使用两个优先队列
 */
function findMaximizedCapital(k, W, Profits, Capital) {
    let nodes = new Array(Profits.length);
    for (let i = 0; i < Profits.length; i++) {
        nodes[i] = new Node(Profits[i], Capital[i]);
    }
    let minCost = new PQ();
    let maxProfit = new PQ();
    for (let i = 0; i < nodes.length; i++) {
        minCost.push(nodes[i]);
    }
    for (let i = 0; i < k; i++) {
        while (!minCost.isEmpty() && minCost.top().c <= W) {
            maxProfit.push(minCost.pop());
        }
        if (maxProfit.isEmpty()) {
            return W;
        }
        W += maxProfit.pop().p;
    }
    return W;
}





// for test
function main() {

}

main();