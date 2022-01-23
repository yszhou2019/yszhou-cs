
class Node {
    constructor(v) {
        this.value = v;
        this.next = null;
        this.rand;
    }
}

/**
 * 时间O(n)，空间O(n)
 * hashMap
 * k---v
 * 链表节点---新建链表节点
 * 所有节点建立完毕之后，只需要根据原链表的勾连关系，勾连新链表节点即可
 */
function copyListWithRand1(head) {
    let map = new Map();
    map.set(null, null);
    let cur = head;
    while (cur != null) {
        map.set(cur, new Node(cur.value));
        cur = cur.next;
    }
    cur = head;
    while (cur != null) {
        map.get(cur).next = map.get(cur.next);
        map.get(cur).rand = map.get(cur.rand);
        cur = cur.next;
    }
    return map.get(head);
}

/**
 * 时间O(n)，空间O(1)
 * 不好写啊，链表有点复杂
 * copy every node -> set rand -> split to two lists
 */
function copyListWithRand2(head) {
    if (head == null) {
        return null;
    }
    let cur = head;
    let next = null;
    while (cur != null) { // copy every node
        next = cur.next;
        cur.next = new Node(cur.value);
        cur.next.next = next;
        cur = next;
    }
    cur = head;
    let curCopy = null;
    while (cur != null) { // copy rand of node
        next = cur.next.next;
        curCopy = cur.next;
        curCopy.rand = cur.rand == null ? null : cur.rand.next;
        cur = next;
    }
    let ret = head.next;
    cur = head;
    while (cur != null) { // split to two lists
        next = cur.next.next;
        curCopy = cur.next;
        cur.next = next;
        curCopy.next = next == null ? null : next.next;
        cur = next;
    }
    return ret;
}

function printRandLinkedList(head) {
    let cur = head;
    let str = "value: ";
    while (cur != null) {
        str += cur.value + " ";
        cur = cur.next;
    }
    console.log(str);
    cur = head;
    str = "rand:  ";
    while (cur != null) {
        str += cur.rand == null ? "- " : cur.rand.value + " ";
        cur = cur.next;
    }
    console.log(str);
}


// for test
function main() {
    let head = null;
    let res1 = null;
    let res2 = null;
    printRandLinkedList(head);
    res1 = copyListWithRand1(head);
    printRandLinkedList(res1);
    res2 = copyListWithRand2(head);
    printRandLinkedList(res2);
    printRandLinkedList(head);
    console.log("=========================");

    head = new Node(1);
    head.next = new Node(2);
    head.next.next = new Node(3);
    head.next.next.next = new Node(4);
    head.next.next.next.next = new Node(5);
    head.next.next.next.next.next = new Node(6);

    head.rand = head.next.next.next.next.next; // 1 -> 6
    head.next.rand = head.next.next.next.next.next; // 2 -> 6
    head.next.next.rand = head.next.next.next.next; // 3 -> 5
    head.next.next.next.rand = head.next.next; // 4 -> 3
    head.next.next.next.next.rand = null; // 5 -> null
    head.next.next.next.next.next.rand = head.next.next.next; // 6 -> 4

    printRandLinkedList(head);
    res1 = copyListWithRand1(head);
    printRandLinkedList(res1);
    res2 = copyListWithRand2(head);
    printRandLinkedList(res2);
    printRandLinkedList(head);
    console.log("=========================");

}

main();