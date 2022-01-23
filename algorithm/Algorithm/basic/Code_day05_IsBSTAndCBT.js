
class Node {
    constructor(val) {
        this.value = val;
        this.left = null;
        this.right = null;
    }
}

/**
 * 
 * java版本对应的答案实际上是Morris遍历，等待之后学到再完善
 */
function isBST(head) {

}

/**
 * 递归版
 * ！错误
 */
function isBST1(head) {
    if (head == null) {
        return true;
    }
    let left = isBST1(head.left);
    let right = isBST1(head.right);
    if (left && right) {
        let ret1 = head.left == null ? true : head.value > head.left.value; // 错误！
        let ret2 = head.right == null ? true : head.value < head.right.value; // 错误！实际上应当判断root.val>left.max root.val<right.min
        return ret1 && ret2;
    }
    return false;
}

class RET {
    constructor(isB, max, min) {
        this.isBST = isB;
        this.max = max;
        this.min = min;
    }
}

/**
 * 递归版本，判断BST的正确做法
 */
function isBST2(head) {
    return rec(head).isBST;
}

function rec(head) {
    if (head == null) {
        return new RET(true, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
    }
    let left = rec(head.left);
    let right = rec(head.right);
    if (left.isBST && right.isBST && head.value > left.max && head.value < right.min) { // root.val>left.max && root.val<right.min才能说明是BST
        return new RET(true, Math.max(head.value, left.max, right.max), Math.min(head.value, left.min, right.min));
    }
    return new RET(false, Math.max(head.value, left.max, right.max), Math.min(head.value, left.min, right.min));
}


/**
 * 非递归版中序遍历
 * 时间O(n)，空间O(h)，每个节点只遍历一遍！
 * 左侧链方式打印，额外用到一个栈
 * - 当前节点的非空，当前节点入栈，进入lchild
 * - 当前节点的为空，栈中弹出节点并打印，然后当前节点进入弹出节点的rchild中
 */
function isBST3(head) {
    if (head == null) {
        return true;
    }
    let stack = [];
    let preVal = Number.MIN_SAFE_INTEGER;
    let cur = head;
    while (stack.length > 0 || cur != null) { // 不能仅仅是cur!=null，比如进入某个子树的右节点，为空，但是stack中仍然有数据 cur非空针对的是最后一个节点，此时lchild为空，栈空，但是应当继续判断当前节点是否为空
        if (cur != null) { // 当前节点非空，入栈，进入左侧链
            stack.push(cur);
            cur = cur.left;
        } else {
            let temp = stack.pop(); // 弹出并打印，进入右节点
            if (preVal > temp.value) {
                return false;
            }
            preVal = temp.value; // 记录前一个节点的val
            cur = temp.right;
        }
    }
    return true;
}

/**
 * 判断是否为完全二叉树
 * 分层遍历，根据节点的left和right，分三种情况
 * 1. left和right都有，继续遍历
 * 2. 无left有right，false
 * 3. （无right）无left无right，或，有left无right，则后续所有节点都应当是叶节点，否则false
 */
function isCBT(head) {
    if (head == null) {
        return true;
    }
    let queue = [head];
    let leaf = false;
    while (queue.length > 0) {
        let temp = queue.shift();
        if (leaf && (temp.left != null || temp.right != null)) { // 开启叶节点之后，后续的节点必须左右都为空
            return false;
        }
        if ((temp.left == null && temp.right != null)) { // 只有right没有left
            return false;
        }
        temp.left && queue.push(temp.left);
        temp.right && queue.push(temp.right);
        if (temp.left == null || temp.right == null) { // 两个都没有，或者只有left没有right的时候，开启后续全部叶节点的判断（当左右节点不满足双全的时候，只可能是无left无right，或者有left无right）
            leaf = true;
        }
        // 归纳一下就是，当无left无right或者有left无right的时候，开启left
        // if (temp.right == null) {
        //     left = true;
        // }
    }
    return true;
}

function isCBT2(head) {
    if (head == null) {
        return true;
    }
    let q = [head];
    let leaf = false;
    while (q.length > 0) {
        let temp = q.shift();
        let left = temp.left;
        let right = temp.right;
        if ((leaf && (left || right)) || (leaf == null && right != null)) {
            return false;
        }
        if (right == null) {
            leaf = true;
        }
        left && q.push(left);
        right && q.push(right);
    }
    return true;
}

// for test
function main() {
    let head = new Node(5);
    head.left = new Node(2);
    head.right = new Node(7);
    head.left.left = new Node(1);
    head.left.right = new Node(6);
    head.right.left = new Node(6);
    head.right.right = new Node(9);

    // printTree(head);
    console.log("is BST: ")
    console.log('[错误递归]', isBST1(head));
    console.log('[正确递归]', isBST2(head));
    console.log('[正确迭代]', isBST3(head));
    head = new Node(4);
    head.left = new Node(2);
    head.right = new Node(6);
    head.left.left = new Node(1);
    head.left.right = new Node(3);
    head.right.left = new Node(5);
    console.log("is BST: ")
    console.log('[错误递归]', isBST1(head));
    console.log('[正确递归]', isBST2(head));
    console.log('[正确迭代]', isBST3(head));
    console.log("is CBT: ");
    console.log(isCBT(head));
    console.log(isCBT2(head));
}

main();