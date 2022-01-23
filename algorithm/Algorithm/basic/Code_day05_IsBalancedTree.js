
class Node {
    constructor(val) {
        this.value = val;
        this.left = null;
        this.right = null;
    }
}


function isBalance(head) {
    return process(head).isBalanced;
}

function process(root) {
    if (root == null) {
        return new Info(true, 0);
    }
    let left = process(root.left);
    let right = process(root.right);
    if (left.isBalanced && right.isBalanced && Math.abs(left.height - right.height) < 2) {
        return new Info(true, Math.max(left.height, right.height) + 1);
    }
    return new Info(false, Math.max(left.head, right.height) + 1);
}


/**
 * 设计所需要的信息，作为递归函数返回值的类型
 */
class Info {
    constructor(isBalanced, height) {
        this.isBalanced = isBalanced;
        this.height = height;
    }
}

/**
 * 
 * 判断给定二叉树是否为平衡二叉树
 */
function isBalance2(head) {
    return process2(head).isBalanced;
}

/**
 * 
 * 递归函数要求
 * 整理出返回值的类型，整个递归过程按照同样的结构得到子树的信息并整合，向上返回
 */
function process2(head) {
    if (head == null) {
        return new Info(true, 0);
    }
    let leftInfo = process2(head.left);
    if (!leftInfo.isBalanced) {
        return new Info(false, 0);
    }
    let rightInfo = process2(head.right);
    if (!rightInfo.isBalanced) {
        return new Info(false, 0);
    }
    if (Math.abs(leftInfo.height - rightInfo.height) > 1) {
        return new Info(false, 0);
    }
    return new Info(true, Math.max(leftInfo.height, rightInfo.height) + 1);
}



// for test
function main() {
    let head = new Node(1);
    head.left = new Node(2);
    head.right = new Node(3);
    head.left.left = new Node(4);
    head.left.right = new Node(5);
    head.right.left = new Node(6);
    head.right.right = new Node(7);
    console.log(isBalance(head));
    console.log(isBalance2(head));
}

main();