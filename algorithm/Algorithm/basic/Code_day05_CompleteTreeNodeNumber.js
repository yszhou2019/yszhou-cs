
class Node {
    constructor(v) {
        this.value = v;
        this.left = null;
        this.right = null;
        this.parent = null;
    }
}

/**
 * 
 * 已知一个完全二叉树，求CBT的节点个数
 * 要求时间复杂度低于O(n)，n为树中节点个数
 * 递归版
 */
function nodeNum1(head) {
    if (head == null) {
        return 0;
    }
    let left = getHeight(head.left);
    let right = getHeight(head.right);
    if (left == right) {
        return 2 ** left + nodeNum1(head.right);
    } else {
        return 2 ** right + nodeNum1(head.left);
    }
}

/**
 * 
 * 非递归版
 */
function nodeNum2(head) {
    if (head == null) {
        return 0;
    }
    let res = 0;
    let cur = head;
    while (cur != null) {
        let left = getHeight(cur.left);
        let right = getHeight(cur.right);
        if (left == right) { // 左满
            res += 2 ** left;
            cur = cur.right;
        } else {
            res += 2 ** right;
            cur = cur.left;
        }
    }
    return res;
}

/**
 * 
 * 获取以node为根的树的高度
 */
function getHeight(node) {
    let res = 0;
    while (node != null) {
        res++;
        node = node.left;
    }
    return res;
}


// for test
function main() {
    let head = new Node(1);
    head.left = new Node(2);
    head.right = new Node(3);
    head.left.left = new Node(4);
    head.left.right = new Node(5);
    head.right.left = new Node(6);
    console.log(nodeNum1(head));
    console.log(nodeNum2(head));
    head = new Node(1);
    head.left = new Node(2);
    head.right = new Node(3);
    head.left.left = new Node(4);
    head.left.right = new Node(5);
    head.right.left = new Node(6);
    head.right.right = new Node(7);
    head.left.left.left = new Node(8);
    head.left.left.right = new Node(9);
    head.left.right.left = new Node(10);
    head.left.right.right = new Node(11);
    head.right.left.left = new Node(12);
    head.right.left.right = new Node(13);
    console.log(nodeNum1(head));
    console.log(nodeNum2(head));
}

main();