
class Node {
    constructor(v) {
        this.value = v;
        this.left = null;
        this.right = null;
    }
}

class ReturnType {
    constructor(balanced, h) {
        this.balanced = balanced;
        this.h = h;
    }
}

// 判断二叉树是否平衡
function isBST(head) {
    if (head == null) {
        return new ReturnType(true, 0);
    }
    let leftinfo = isBST(head.left);
    let rightinfo = isBST(head.right);
    let ret = false;
    if (leftinfo.balanced && rightinfo.balanced && Math.abs(leftinfo.h - rightinfo.h) < 2) {
        ret = true;
    }
    return new ReturnType(ret, Math.max(leftinfo.h, rightinfo.h) + 1);
}

// 判断完全二叉树
function isCBT(head) {
    if (head == null) {
        return true;
    }
    let leaf = false;
    let q = [head];
    while (q.length > 0) {
        let temp = q.shift();
        let { left, right } = temp;
        if (((leaf) && (left || right)) || (left == null && right != null)) {
            return false;
        }
        if (right == null) { // 开启叶节点验证
            leaf = true;
        }
        left && q.push(left);
        right && q.push(right);
    }
    return true;
}

// for test
function main() {
    let head = new Node(4);
    head.left = new Node(2);
    head.right = new Node(6);
    head.left.left = new Node(1);
    head.left.right = new Node(3);
    head.right.left = new Node(5);

    console.log(isBST(head));
    console.log(isCBT(head));
}

main();