
class Node {
    constructor(v) {
        this.value = v;
        this.left = null;
        this.right = null;
    }
}


function preOrderRecur(head) {
    if (head == null) {
        return null;
    }
    console.log(head.value);
    preOrderRecur(head.left);
    preOrderRecur(head.right);
}

function inOrderRecur(head) {
    if (head == null) {
        return null;
    }
    inOrderRecur(head.left);
    console.log(head.value);
    inOrderRecur(head.right);
}

function posOrderRecur(head) {
    if (head == null) {
        return null;
    }
    posOrderRecur(head.left);
    posOrderRecur(head.right);
    console.log(head.value);
}

/**
 * 
 * 用到一个栈
 * 用一个栈实现非递归的先序遍历
 */
function preOrderUnRecur(head) {
    let str = "pre-order: ";
    if (head != null) {
        let stack = [head];
        let temp = null;
        while (stack.length > 0) {
            temp = stack.pop();
            str += temp.value + ' ';
            temp.right && stack.push(temp.right);
            temp.left && stack.push(temp.left);
        }
    }
    console.log(str);
}

/**
 * 
 * 用到一个栈
 * 实现非递归的中序遍历
 * 不断移动到左子树，到达null的时候，弹出节点并访问，然后进入右子树
 */
function inOrderUnRecur(head) {
    let str = "in-order: ";
    if (head != null) {
        let stack = [];
        let cur = head;
        while (stack.length > 0 || cur != null) {
            if (cur != null) { // 当cur为空的时候进入另外的分支
                stack.push(cur); // 不断移动到左子树，进入最左边
                cur = cur.left;
            } else {
                let temp = stack.pop(); // 弹出并访问
                // print(temp.value);
                str += temp.value + " ";
                cur = temp.right; // 移动到右子树，如果右子树=null，继续循环
            }
        }
    }
    console.log(str);
}

/**
 * 
 * 用两个栈实现非递归的后序遍历
 * 后序：左右中
 * 先序：中左右，先序改造得到中右左，再用栈颠倒得到左右中
 */
function posOrderUnRecur1(head) {
    if (head != null) { // 注意这里！由于stack1之后的push都是保证了非空，这里也要保证非空
        let stack1 = [head];
        let stack2 = [];
        let temp = null;
        while (stack1.length > 0) {
            temp = stack1.pop();
            stack2.push(temp.value);
            temp.left && stack1.push(temp.left);
            temp.right && stack1.push(temp.right);
        }
        let str = "pos-order: ";
        while (stack2.length > 0) {
            str += stack2.pop() + " ";
        }
        console.log(str);
    }
}



// for test
function main() {
    let head = new Node(5);
    head.left = new Node(3);
    head.right = new Node(8);
    head.left.left = new Node(2);
    head.left.right = new Node(4);
    head.left.left.left = new Node(1);
    head.right.left = new Node(7);
    head.right.left.left = new Node(6);
    head.right.right = new Node(10);
    head.right.right.left = new Node(9);
    head.right.right.right = new Node(11);

    // recursive
    // console.log("==============recursive==============");
    // console.log("pre-order: ");
    // preOrderRecur(head);
    // console.log("in-order: ");
    // inOrderRecur(head);
    // console.log("pos-order: ");
    // posOrderRecur(head);

    // unrecursive
    console.log("============unrecursive=============");
    preOrderUnRecur(head);
    inOrderUnRecur(head);
    posOrderUnRecur1(head);
}

main();