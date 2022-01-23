
class Node {
    constructor(v) {
        this.left = null;
        this.right = null;
        this.value = v;
    }
}

/**
 * 收集的是什么信息？
 * 最大BST的root和size
 * 整个子树的max和min
 */
class ReturnType {
    constructor(size, head, max, min) {
        this.size = size;
        this.head = head;
        this.max = max;
        this.min = min;
    }
}

function biggestSubBST(head) {
    return process(head);
}

/**
 * 算法核心，递归处理，收集左右子树的maxV和minV
 */
function process(head) {
    if (head == null) {
        return new ReturnType(0, null, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
    }
    let leftinfo = process(head.left);
    let rightinfo = process(head.right);
    // 又构成了BST
    if (head.left == leftinfo.head && head.right == rightinfo.head && head.value > leftinfo.max && head.value < rightinfo.min) {
        let maxsize = leftinfo.size + rightinfo.size + 1;
        // DEBUG了一个小时！这里的BST有4种情况！比如head两个null节点，或者左空 或者 右空 或者 有两个child且构成BST，如果有两个child，当然可以直接max:rightinfo.max min:leftinfo.min 
        // 但是如果有0个child，那么BST的max和min都应该是当前head的value
        // 如果有1个child，那么BST的max和min就应该是这几个的max和min
        // return new ReturnType(maxsize, head, rightinfo.max, leftinfo.min);
        return new ReturnType(maxsize, head, Math.max(leftinfo.max, rightinfo.max, head.value), Math.min(leftinfo.min, rightinfo.min, head.value));
    }
    // 如果head不是BST，那么要返回相应的BST子树和BST的size，以及head的min和max
    let maxhead = leftinfo.size > rightinfo.size ? leftinfo.head : rightinfo.head;
    if (leftinfo.size > rightinfo.size) {
        return leftinfo;
    } else {
        return rightinfo;
    }
    // 不构成BST的情况，就是确实违背了BST，此时可以直接返回leftinfo或者rightinfo，也可以在leftinfo或者rightinfo的基础上，更新整个树的max或者min，不过即使更新，由于BST子树在整个树中已经中断，max和min信息也就用不到了
    return new ReturnType(Math.max(leftinfo.size, rightinfo.size), maxhead, Math.max(leftinfo.max, rightinfo.max, head.value), Math.min(leftinfo.min, rightinfo.min, head.value));
}



// 改进
function process2(head) {
    if (head == null) {
        return new ReturnType(0, null, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
    }
    let leftinfo = process2(head.left);
    let rightinfo = process2(head.right);
    // 4类情况可以命中BST，符合BST的，有2个child，有1个child，有0个child
    if (head.left == leftinfo.head && head.right == rightinfo.head && leftinfo.max < head.value && head.value < rightinfo.min) {
        return new ReturnType(leftinfo.size + rightinfo.size + 1, head, Math.max(leftinfo.max, rightinfo.max, head.value), Math.min(leftinfo.min, rightinfo.min, head.value));
    }
    // 只要不命中上述4种情况，那么离散的BST子树的信息一定不会继续整合
    // 也就是说，下面按照BST的size大小返回info，更新不更新info中的max和min无所谓了
    // 如果某个BST连不上，那么后续一定还是连不上，始终命中不了上面的if
    if (leftinfo.size > rightinfo.size) {
        return leftinfo;
    }
    return rightinfo;
}

// for test
function main() {

    let head = new Node(6);
    head.left = new Node(1);
    head.left.left = new Node(0);
    head.left.right = new Node(3);
    head.right = new Node(12);
    head.right.left = new Node(10);
    head.right.left.left = new Node(4);
    head.right.left.left.left = new Node(2);
    head.right.left.left.right = new Node(5);
    head.right.left.right = new Node(14);
    head.right.left.right.left = new Node(11);
    head.right.left.right.right = new Node(15);
    head.right.right = new Node(13);
    head.right.right.left = new Node(20);
    head.right.right.right = new Node(16);

    let bst = biggestSubBST(head);
    console.log(bst.head); // max BST root value should be 10 , size should be 7
    console.log(process2(head).size)
}

main();