
class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

/**
 * 
 * 给定单链表，根据pivot划分为三部分
 * 按照快排方式，将链表转化为Node数组，然后快排partition，然后再讲数组还原为链表
 * 时间O(n)空间O(n)，没有稳定性
 */
function listPartition1(head, pivot) {
    if (head == null) {
        return null;
    }
    let cur = head;
    let len = 0;
    while (cur != null) {
        cur = cur.next;
        len++;
    }
    cur = head;
    let nodeArr = new Array(len);
    for (let i = 0; i < nodeArr.length; i++) {
        nodeArr[i] = cur;
        cur = cur.next;
    }
    arrPartition(nodeArr, pivot);
    for (let i = 1; i < nodeArr.length; i++) {
        nodeArr[i - 1].next = nodeArr[i];
    }
    nodeArr[len - 1].next = null;
    return nodeArr[0];
}

function arrPartition(nodeArr, pivot) {
    let small = -1;
    let big = nodeArr.length;
    let cur = 0;
    while (cur < big) {
        if (nodeArr[cur].value < pivot) {
            swap(nodeArr, ++small, cur++);
        } else if (nodeArr[cur].value > pivot) {
            swap(nodeArr, --big, cur);
        } else {
            cur++;
        }
    }
}

function swap(nodeArr, a, b) {
    let temp = nodeArr[a];
    nodeArr[a] = nodeArr[b];
    nodeArr[b] = temp;
}

/**
 * 
 * 链表拆分3部分，最后连接
 * 时间O(n)空间O(1)，保持稳定性
 * 分配每个节点的时候，必须要将各个节点的连接断开，将当前节点的next置空，否则链表混乱
 * 分配->3链表连接->返回
 */
function listPartition2(head, pivot) {
    if (head == null) {
        return head;
    }
    let sH = null;
    let sT = null;
    let eH = null;
    let eT = null;
    let bH = null;
    let bT = null;
    let next = null;
    while (head != null) {
        next = head.next; // 必须要用next记录下一个节点，并且将head.next置空，不置空，三个链表就混乱了
        head.next = null;
        if (head.value < pivot) {
            if (sH == null) {
                sH = head;
                sT = head;
            } else {
                sT.next = head;
                sT = head;
            }
        } else if (head.value == pivot) {
            if (eH == null) {
                eH = head;
                eT = head;
            } else {
                eT.next = head;
                eT = head;
            }
        } else {
            if (bH == null) {
                bH = head;
                bT = head;
            } else {
                bT.next = head;
                bT = head;
            }
        }
        head = next;
    }
    if (sT != null) { // 链接
        sT.next = eH;
        if (eT == null) {
            eT = sT;
        }
    }
    if (eT != null) {
        eT.next = bH;
    }
    return sH != null ? sH : eH != null ? eH : bH; // 返回链接后的head

    // 考虑第一段是否存在
    if (lessTail == null) {
        // 第二段如果不存在，head=第二段
        head = equalHead;
    } else {
        // 如果存在，连接上第二段
        head = lessHead;
        lessTail.next = equalHead;
    }
    // 考虑第二段是否存在
    if (equalTail == null) {
        // 第二段如果不存在，需要考虑第一段是否存在
        if (head == null) {
            // 第一段如果不存在，head=第三段
            head = moreHead;
        } else {
            // 第一段如果存在，连接后面的
            lessTail.next = moreHead;
        }
    } else {
        // 第二段如果存在，直接连接后面的
        equalTail.next = moreHead;
    }
    return head;
}


function printLinkedList(node) {
    let str = "Linked List: ";
    while (node != null) {
        str += node.value + " ";
        node = node.next;
    }
    console.log(str);
}


// test JS Array 保存的是内存的引用，也就是说nodeArr=new Array，然后nodeArr[i]=cur，内存共享；而nodeArr[i]=new Node才是独立开辟内存
function test1(head) {
    let len = 0;
    let cur = head;
    while (cur != null) {
        len++;
        cur = cur.next;
    }
    cur = head;
    let nodeArr = new Array(len);
    for (let i = 0; i < len; i++) {
        nodeArr[i] = cur;
        cur = cur.next;
    }
    return nodeArr[0];
}

function test2(head) {
    let len = 0;
    let cur = head;
    while (cur != null) {
        len++;
        cur = cur.next;
    }
    cur = head;
    let nodeArr = new Array(len);
    for (let i = 0; i < len; i++) {
        // nodeArr[i] = cur;
        nodeArr[i] = new Node(cur.value);
        nodeArr[i].next = cur.next;
        cur = cur.next;
    }
    nodeArr[1].value = 2;
    return nodeArr[0];
}

// for test
function main() {
    let head1 = new Node(7);
    head1.next = new Node(9);
    head1.next.next = new Node(1);
    head1.next.next.next = new Node(8);
    head1.next.next.next.next = new Node(5);
    head1.next.next.next.next.next = new Node(2);
    head1.next.next.next.next.next.next = new Node(5);
    printLinkedList(head1);
    // printLinkedList(test1(head1));
    // printLinkedList(test2(head1));
    // printLinkedList(head1);

    // head1 = listPartition1(head1, 5);
    // printLinkedList(head1);
    head1 = listPartition2(head1, 5);
    printLinkedList(head1);
}

main();