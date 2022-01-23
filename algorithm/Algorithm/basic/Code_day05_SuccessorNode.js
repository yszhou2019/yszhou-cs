
class Node {
    constructor(v) {
        this.value = v;
        this.left = null;
        this.right = null;
        this.parent = null;
    }
}

/**
 * 带有parent节点的二叉树
 * 给定任意一个节点，返回中序遍历下该节点的后序节点
 * - 如果有右子树，那么后序节点就是右子树的最左节点
 * - 没有右子树，x不断向上，父p，当x是p的左节点的时候，p为后序节点
 */
function getSuccessorNode(node) {
    if (node == null) {
        return null;
    }
    if (node.right != null) { // 存在右子树，必然存在右子树中的最左节点
        return getLeftMost(node.right);
    }
    let parent = null;
    while (node != null) {
        parent = node.parent;
        if (parent == null || parent.left == node) { // 为了处理中序遍历的最后一个节点，中序遍历最后一个节点没有后继节点，向上到parent==null的时候直接返回null
            return parent;
        }
        node = parent;
    }
}

/**
 * 右子树的最左节点
 */
function getLeftMost(node) {
    if (node == null) {
        return null;
    }
    while (node.left != null) {
        node = node.left;
    }
    return node;
}


/**
 * 获取node的前驱节点
 * - 有左子树，则返回左子树的最右节点
 * - 没有左子树，当前x，父p，当x是p的左节点，返回p
 */
function getPrevNode(node) {
    if (node == null) {
        return null;
    }
    if (node.left != null) {
        return getRightMost(node.left);
    }
    let parent = null;
    while (node != null) {
        parent = node.parent;
        if (parent == null || parent.right == node) {
            return parent;
        }
        node = parent;
    }
}

function getRightMost(node) {
    if (node == null) {
        return null;
    }
    while (node.right != null) {
        node = node.right;
    }
    return node;
}


// for test
function main() {
    let head = new Node(6);
    head.parent = null;
    head.left = new Node(3);
    head.left.parent = head;
    head.left.left = new Node(1);
    head.left.left.parent = head.left;
    head.left.left.right = new Node(2);
    head.left.left.right.parent = head.left.left;
    head.left.right = new Node(4);
    head.left.right.parent = head.left;
    head.left.right.right = new Node(5);
    head.left.right.right.parent = head.left.right;
    head.right = new Node(9);
    head.right.parent = head;
    head.right.left = new Node(8);
    head.right.left.parent = head.right;
    head.right.left.left = new Node(7);
    head.right.left.left.parent = head.right.left;
    head.right.right = new Node(10);
    head.right.right.parent = head.right;

    let test = head.left.left;
    console.log(test.value + " next: " + getSuccessorNode(test).value);
    test = head.left.left.right;
    console.log(test.value + " next: " + getSuccessorNode(test).value);
    test = head.left;
    console.log(test.value + " next: " + getSuccessorNode(test).value);
    test = head.left.right;
    console.log(test.value + " next: " + getSuccessorNode(test).value);
    test = head.left.right.right;
    console.log(test.value + " next: " + getSuccessorNode(test).value);
    test = head;
    console.log(test.value + " next: " + getSuccessorNode(test).value);
    test = head.right.left.left;
    console.log(test.value + " next: " + getSuccessorNode(test).value);
    test = head.right.left;
    console.log(test.value + " next: " + getSuccessorNode(test).value);
    test = head.right;
    console.log(test.value + " next: " + getSuccessorNode(test).value);
    test = head.right.right; // 10's next is null
    console.log(test.value + " next: " + getSuccessorNode(test));

    test = head.left.left;
    console.log(test.value + " prev: " + getPrevNode(test));
    test = head.left.left.right;
    console.log(test.value + " prev: " + getPrevNode(test).value);
    test = head.left;
    console.log(test.value + " prev: " + getPrevNode(test).value);
    test = head.left.right;
    console.log(test.value + " prev: " + getPrevNode(test).value);
    test = head.left.right.right;
    console.log(test.value + " prev: " + getPrevNode(test).value);
    test = head;
    console.log(test.value + " prev: " + getPrevNode(test).value);
    test = head.right.left.left;
    console.log(test.value + " prev: " + getPrevNode(test).value);
    test = head.right.left;
    console.log(test.value + " prev: " + getPrevNode(test).value);
    test = head.right;
    console.log(test.value + " prev: " + getPrevNode(test).value);
    test = head.right.right; // 10's next is null
    console.log(test.value + " prev: " + getPrevNode(test).value);
}

main();