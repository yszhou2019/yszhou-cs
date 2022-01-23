
class Node {
    constructor(v) {
        this.value = v;
        this.left = null;
        this.right = null;
    }
}

/**
 * 三种递归遍历，遍历过程都是如此，不同之处仅仅是第1次到达/第2次到达/第3次到达该节点的时候打印当前节点的信息而已。
 */
function process(head) {
    if (head == null) {
        return;
    }
    // 首次到达 第1次到达 console.log(head.value); 先序
    process(head.left);
    // 处理完左子树 第2次到达console.log(head.value); 中序
    process(head.right);
    // 处理完右子树 第3次到达 console.log(head.value); 后序
}


/**
 * 当前节点的没左子树，当前节点到达一次
 * 当前节点有左子树，到达两次
 *  第1次，就是离开当前节点进入left之前
 *  第2次，从左子树的rightMost回到cur
 * Morris遍历，如果一个节点有左子树，那么能到达该节点两次，并且第二次到达该节点的时候，左子树所有节点全部遍历完毕；没有左子树，只能到达该节点一次
 */
function morris(head) {
    if (head == null) {
        return;
    }
    let str = 'In :';
    let cur = head;
    let mostRight = null;
    while (cur != null) {
        mostRight = cur.left;
        // 寻找左子树的最右节点，并设置right为cur或者恢复为null
        if (mostRight != null) {
            while (mostRight.right != null && mostRight.right != cur) {
                mostRight = mostRight.right;
            }
            // 如果mostRight的右节点是null，那么设置为cur
            if (mostRight.right == null) {
                mostRight.right = cur;
                // 第1次离开cur，可以理解为第1次到达cur
                cur = cur.left;
                continue;
            } else {
                // 第2次到达有左子树的cur
                // 如果右节点指向cur，那么恢复为null
                // 然后退出if，cur进入cur.right
                mostRight.right = null;
            }
        } else {
            // 当前节点没左子树，就直接离开了cur，cur到达第1次
            // 没有左子树的节点，递归遍历时，前2次是合并的，也可以理解为cur到达第1次和第2次
        }
        // str += cur.value + ' ';
        cur = cur.right;
    }
    console.log(str);
}

/**
 * Morris先序，是第1次到达cur的时候打印。就是将递归的第一次来到节点的时候打印cur.value这个过程，放入到Morris遍历第一次到达节点中。
 * Morris遍历何时是第一次来到节点
 * 1. 当前节点没有左子树
 * 2. 当前节点左子树的mostRight=null
 */
function morrisPre(head) {
    if (head == null) {
        return;
    }
    let str = 'Pre:';
    let cur = head;
    let mostRight = null;
    while (cur != null) {
        mostRight = cur.left;
        // 寻找左子树的最右节点，并设置right为cur或者恢复为null
        // 当前节点有左子树，会找到
        if (mostRight != null) {
            while (mostRight.right != null && mostRight.right != cur) {
                mostRight = mostRight.right;
            }
            // 如果mostRight的右节点是null，那么设置为cur
            if (mostRight.right == null) {
                mostRight.right = cur;
                // mostRight的right是null的时候，第一次来到发现是第一次来到节点的时候打印
                str += cur.value + ' ';
                cur = cur.left;
                continue;
            } else { // 如果右节点指向cur，那么恢复为null
                mostRight.right = null;
            }
        } else {
            // 当前节点没有左子树，会直接打印。这种情况下，第一次来到和第二次来到是一起的
            str += cur.value + ' ';
        }
        cur = cur.right;
    }
    console.log(str);
}

/**
 * 
 * morris中序，是第2次到达cur的时候打印。和递归中序一样，打印完左子树，再打印cur.val，再处理右子树。
 * morris何时第2次到达
 * 1. 节点没有左子树
 * 2. 节点有左子树，且rightMost.right=cur
 * 两种情况可以合并，morrisIn2()就是没有合并的情况
 */
function morrisIn(head) {
    if (head == null) {
        return;
    }
    let str = 'In :';
    let cur = head;
    let mostRight = null;
    while (cur != null) {
        mostRight = cur.left;
        // 寻找左子树的最右节点，并设置right为cur或者恢复为null
        if (mostRight != null) {
            while (mostRight.right != null && mostRight.right != cur) {
                mostRight = mostRight.right;
            }
            // 如果mostRight的右节点是null，那么设置为cur
            if (mostRight.right == null) {
                mostRight.right = cur;
                cur = cur.left;
                continue;
            } else { // 如果右节点指向cur，那么恢复为null
                mostRight.right = null;
            }
        }
        str += cur.value + ' ';
        cur = cur.right;
    }
    console.log(str);
}


function morrisIn2(head) {
    if (head == null) {
        return;
    }
    let str = 'In :';
    let cur = head;
    let mostRight = null;
    while (cur != null) {
        mostRight = cur.left;
        if (mostRight != null) {
            while (mostRight.right != null && mostRight.right != cur) {
                mostRight = mostRight.right;
            }
            if (mostRight.right == null) {
                mostRight.right = cur;
                cur = cur.left;
                continue;
            } else {
                // 第2次到达
                mostRight.right = null;
                str += cur.value + ' ';
            }
        } else {
            // 第2次到达
            str += cur.value + ' ';
        }
        cur = cur.right;
    }
    console.log(str);
}


/**
 * 后序遍历，只逆序打印能够访问2次的节点的左子树的右边界，以及逆序打印整个树的右边界
 */
function morrisPos(head) {
    if (head == null) {
        return;
    }
    let str = 'Pos:';
    let cur = head;
    let mostRight = null;
    while (cur != null) {
        mostRight = cur.left;
        if (mostRight != null) {
            while (mostRight.right != null && mostRight.right != cur) {
                mostRight = mostRight.right;
            }
            if (mostRight.right == null) {
                mostRight.right = cur;
                cur = cur.left;
                continue;
            } else { // 逆序打印到达两次的节点的左子树的右边界
                mostRight.right = null;
                str += printEdge(cur.left);
            }
        }
        cur = cur.right;
    }
    // 逆序打印整个树的右边界
    str += printEdge(head);
    console.log(str);
}

/**
 * 二叉树的右边界逆序打印
 * 首先翻转，然后打印，然后恢复
 */
function printEdge(head) {
    let tail = reverseEdge(head);
    let cur = tail;
    let str = "";
    while (cur != null) {
        str += cur.value + ' ';
        cur = cur.right;
    }
    reverseEdge(tail);
    return str;
}

/**
 * 返回翻转后的右子树表头
 */
function reverseEdge(head) {
    let pre = null;
    let next = null;
    while (head != null) {
        next = head.right;
        head.right = pre;
        pre = head;
        head = next;
    }
    return pre;
}

// 虽然完成了功能，但是由于Morris要求额外空间O(1)，不能采用递归
// 因此需要将二叉树作为链表进行处理，修改链表之后再恢复链表，从而额外空间O(1)
function printEdge2(head) {
    if (head == null) {
        return '';
    }
    return printEdge2(head.right) + ' ' + head.value;
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
    // printTree(head);
    morrisIn(head);
    morrisPre(head);
    morrisPos(head);
    // printTree(head);
}

main();