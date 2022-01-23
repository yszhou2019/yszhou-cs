
class Node {
    constructor(v) {
        this.value = v;
        this.left = null;
        this.right = null;
    }
}

/**
 * 内存二叉树持久化，按照先序遍历即可
 */
function serialByPre(head) {
    if (head == null) {
        return "#!";
    }
    let left = serialByPre(head.left);
    let right = serialByPre(head.right);
    return head.value + "!" + left + right;y
}

/**
 * 先序重构
 * 用一个队列，保存所有节点的value
 */
function reconByPreString(preStr) {
    let values = preStr.split('!');
    values.pop();
    return reconPreOrder(values);
    let queue = [];
    for (let i = 0; i < values.length; i++) {
        queue.push(values[i]);
    }
    return reconPreOrder(queue);
}

/**
 * 根据队列，递归地构造一个二叉树
 * 先构造head，然后构造left和right，最后返回head
 */
function reconPreOrder(queue) {
    let value = queue.shift();
    if (value == "#") {
        return null;
    }
    let head = new Node(value);
    head.left = reconPreOrder(queue);
    head.right = reconPreOrder(queue);
    return head;
}

/**
 * 层次序列化，实际上就是层次遍历
 */
function serialByLevel(head) {
    if (head == null) {
        return "#!";
    }
    let queue = [head];
    let str = "";
    while (queue.length > 0) {
        let temp = queue.shift();
        str += temp == null ? "#!" : temp.value + "!";
        temp && queue.push(temp.left);
        temp && queue.push(temp.right);
    }
    return str;
}

/**
 * 用一个队列，保存的是node而不是value
 * 给定的中序字符串，重构为内存二叉树
 * 先split出各个value，然后处理head=null的边界情况
 * 然后当queue.length>0的时候，不断队首拿出node，然后从values中取出两个value生成node，添加到当前node的left和right，然后这两个node非空，则进队列
 */
function reconByLevelString(levelStr) {
    let values = levelStr.split('!');
    values.pop();
    let head = getNode(values[0]);
    if (head == null) {
        return null;
    }
    let queue = [head];
    values.shift();
    while (queue.length > 0) {
        let temp = queue.shift(); // values中的前两个节点是q[0]的左右子节点
        let left = values.shift();
        let right = values.shift();
        if (left != '#') {
            temp.left = getNode(left);
            queue.push(temp.left);
        }
        if (left != '#') {
            temp.right = getNode(right);
            queue.push(temp.right);
        }
    }
    return head;
}

function getNode(val) {
    if (val == '#') {
        return null;
    }
    return new Node(val);
}

// for test -- print tree
function printTree(head) {
    console.log("Binary Tree:");
    printInOrder(head, 0, "H", 17);
}

function printInOrder(head, height, to, len) {
    if (head == null) {
        return;
    }
    printInOrder(head.right, height + 1, "v", len);
    let val = to + head.value + to;
    let lenM = val.length;
    let lenL = Math.floor((len - lenM) / 2);
    let lenR = len - lenM - lenL;
    val = getSpace(lenL) + val + getSpace(lenR);
    console.log(getSpace(heigth * len) + val);
    printInOrder(head.left, height + 1, "^", len);
}

function getSpace(num) {
    // let space = " ";
    // let buf=new 
}


// for test
function main() {
    let head = null;
    //		printTree(head);

    let pre = serialByPre(head);
    console.log("serialize tree by pre-order:   " + pre);
    console.log("reconstruct tree by pre-order: " + serialByPre(reconByPreString(pre)));
    //		printTree(head);

    let level = serialByLevel(head);
    console.log("serialize tree by level:   " + level);
    console.log("reconstruct tree by level: " + serialByLevel(reconByLevelString(level)));
    // head = reconByLevelString(level);
    //		printTree(head);

    console.log("====================================");

    head = new Node(1);
    //		printTree(head);

    pre = serialByPre(head);
    console.log("serialize tree by pre-order:   " + pre);
    console.log("reconstruct tree by pre-order: " + serialByPre(reconByPreString(pre)));
    // head = reconByPreString(pre);
    // console.log("reconstruct tree by pre-order, ");
    //		printTree(head);

    level = serialByLevel(head);
    console.log("serialize tree by level:   " + level);
    console.log("reconstruct tree by level: " + serialByLevel(reconByLevelString(level)));
    // head = reconByLevelString(level);
    // console.log("reconstruct tree by level, ");
    //		printTree(head);

    console.log("====================================");

    head = new Node(1);
    head.left = new Node(2);
    head.right = new Node(3);
    head.left.left = new Node(4);
    head.right.right = new Node(5);
    //		printTree(head);

    pre = serialByPre(head);
    console.log("serialize tree by pre-order:   " + pre);
    console.log("reconstruct tree by pre-order: " + serialByPre(reconByPreString(pre)));
    // head = reconByPreString(pre);
    // console.log("reconstruct tree by pre-order, ");
    //		printTree(head);

    level = serialByLevel(head);
    console.log("serialize tree by level:   " + level);
    console.log("reconstruct tree by level: " + serialByLevel(reconByLevelString(level)));
    // head = reconByLevelString(level);
    // console.log("reconstruct tree by level, ");
    //		printTree(head);

    console.log("====================================");

    head = new Node(100);
    head.left = new Node(21);
    head.left.left = new Node(37);
    head.right = new Node(-42);
    head.right.left = new Node(0);
    head.right.right = new Node(666);
    //		printTree(head);

    pre = serialByPre(head);
    console.log("serialize tree by pre-order:   " + pre);
    console.log("reconstruct tree by pre-order: " + serialByPre(reconByPreString(pre)));
    // head = reconByPreString(pre);
    // console.log("reconstruct tree by pre-order, ");
    //		printTree(head);

    level = serialByLevel(head);
    console.log("serialize tree by level:   " + level);
    console.log("reconstruct tree by level: " + serialByLevel(reconByLevelString(level)));
    // head = reconByLevelString(level);
    // console.log("reconstruct tree by level, ");
    //		printTree(head);

    console.log("====================================");
}

main();