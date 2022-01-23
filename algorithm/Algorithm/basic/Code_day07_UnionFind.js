

class Node {
    constructor() {

    }
}

/**
 * 并查集
 * 完成三个功能
 * 1. findHead  查询一个元素所在的集合
 * 2. isSameSet 查询两个元素是否属于同一个集合
 * 3. union     将两个元素所在的集合进行合并（元素少的合并到元素多的集合中）
 */
class UnionFindSet {
    constructor(nodes) {
        this.fatherMap = new Map();
        this.sizeMap = new Map();
        this.makesets(nodes);
    }
    /**
     * 
     * @param {Array} nodes 
     */
    makesets(nodes) {
        for (let i = 0; i < nodes.length; i++){
            this.fatherMap.set(nodes[i], nodes[i]);
            this.sizeMap.set(nodes[i], 1);
        }
    }
    /**
     * 
     * @param {*} node 
     * 功能
     * （递归函数）返回给定元素的代表节点，并进行扁平处理
     */
    findHead(node) {
        let father = this.fatherMap.get(node);
        while (father != node) {
            father = this.findHead(father);
        }
        this.fatherMap.set(node, father);
        return father;
    }
    /**
     * 
     * @param {Node} a 
     * @param {Node} b 
     * 功能
     * 判断两个元素是否属于同一个集合
     */
    isSameSet(a, b) {
        return this.findHead(a) == this.findHead(b);
    }
    /**
     * 
     * @param {Node} a 
     * @param {Node} b 
     * 功能
     * 将元素少的集合并入到元素多的集合当中
     */
    union(a, b) {
        if (a == null || b == null) {
            return;
        }
        let aHead = this.findHead(a);
        let bHead = this.findHead(b);
        if (aHead != bHead) {
            let aSize = this.sizeMap.get(aHead);
            let bSize = this.sizeMap.get(bHead);
            if (aSize <= bSize) { // a并入b中
                this.fatherMap.set(aHead, bHead);
                this.sizeMap.set(bHead, aSize + bSize);
            } else { // b并入a中
                this.fatherMap.set(bHead, aHead);
                this.sizeMap.set(aHead, aSize + bSize);
            }
        }
    }
}


// for test
function main() {
    
}

main();