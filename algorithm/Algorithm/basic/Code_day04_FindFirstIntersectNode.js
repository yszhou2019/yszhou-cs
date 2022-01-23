
class Node{
    constructor(v) {
        this.value = v;
        this.next = null;
    }
}

/**
 * 
 * 两个单链表，可能有环可能无环，如果相交，求第一个交点；不相交，返回null
 * - 两个都无环，如果尾节点不同，不相交；尾节点相同，相交
 * - 两个都有环，包括{2个独立成环->null不相交，两个入环节点相同->相交，两个入环节点不同->返回任意一个入环节点}
 * - 一个有环一个无环，直接返回null，不可能相交
 */
function getIntersectNode(head1, head2) {
    if (head1 == null || head2 == null) {
        return null;
    }
    let loop1 = getLoopNode(head1); // 获取入环节点
    let loop2 = getLoopNode(head2);
    if (loop1 == null && loop2 == null) { // 两个都无环
        return noLoop(head1, head2);
    }
    if (loop1 != null && loop2 != null) { // 两个都有环
        return bothLoop(head1, loop1, head2, loop2);
    }
    return null;
}

/**
 * 获取单链表的入环节点，如果无环，返回null
 * 快慢指针相遇，快指针回到开头，然后步调一致，再次相遇，则为入环节点
 */
function getLoopNode(head) {
    if (head == null || head.next == null || head.next.next == null) { // 这里需要特别注意！至少要有两个节点才能构成环
        return null;
    }
    let n1 = head.next; // 一开始的位置需要注意
    let n2 = head.next.next;
    while (n1 != n2) {
        if (n2.next == null || n2.next.next == null) { // 这里需要特别注意！
            return null; // 快指针到达null 直接返回false
        }
        n1 = n1.next;
        n2 = n2.next.next;
    }
    n2 = head; // 相遇之后，快指针回到开头，再次相遇，就是入环节点
    while (n1 != n2) {
        n1 = n1.next;
        n2 = n2.next;
    }
    return n1;
}

/**
 * 两个无环链表，求第一个交点
 * 分别遍历，获取两链表的长度和尾节点
 * 如果尾节点不同，那么不相交，返回null
 * 如果尾节点相同，那么长的链表走一段距离之后，两链表同时开始走，直到相遇的节点，就是第一个交点
 */
function noLoop(head1, head2) {
    if (head1 == null || head2 == null) {
        return null;
    }
    let cur1 = head1;
    let cur2 = head2;
    let n = 0;
    while (cur1.next != null) { // 这里是cur1.next而不是cur1，要求尾节点！
        n++;
        cur1 = cur1.next;
    }
    while (cur2.next != null) {
        n--;
        cur2 = cur2.next;
    }
    if (cur1 != cur2) {
        return null;
    }
    // cur1 = n > 0 ? head1 : head2; // cur1遍历长的
    // cur2 = n > 0 ? head2 : head1; // cur2遍历短的
    // n = Math.abs(n);
    // while (n > 0) {
    //     cur1 = cur1.next;
    //     n--;
    // }
    cur1 = head1;
    cur2 = head2;
    if (n > 0) {
        while (n > 0) {
            cur1 = cur1.next;
            n--;
        }
    } else {
        while (n < 0) {
            cur2 = cur2.next;
            n++;
        }
    }
    while (cur1 != cur2) {
        cur1 = cur1.next;
        cur2 = cur2.next;
    }
    return cur1;
}

/**
 * 两个有环链表，求第一个交点
 * 两个入环节点相同，类似于项链吊坠，转化成两个无环链表的第一个交点
 * 两个入环节点不同，转一圈，如果相同，则返回loop1或者loop2任意一个；如果不相同，说明独立成环，返回null
 */
function bothLoop(head1, loop1, head2, loop2) {
    if (loop1 == loop2) {
        let cur1 = head1;
        let cur2 = head2;
        let n = 0;
        while (cur1 != loop1) {
            cur1 = cur1.next;
            n++;
        }
        while (cur2 != loop2) {
            cur2 = cur2.next;
            n--;
        }
        cur1 = n > 0 ? head1 : head2;
        cur2 = n > 0 ? head2 : head1;
        n = Math.abs(n);
        while (n > 0) {
            cur1 = cur1.next;
            n--;
        }
        while (cur1 != cur2) {
            cur1 = cur1.next;
            cur2 = cur2.next;
        }
        return cur1;
    } else {
        let cur1 = loop1.next;
        while (cur1 != loop1) {
            if (cur1 == loop2) {
                return loop1;
            }
            cur1 = cur1.next;
        }
        return null;
    }
}


// for test
function main() {
    // 1->2->3->4->5->6->7->null
    let head1 = new Node(1);
    head1.next = new Node(2);
    head1.next.next = new Node(3);
    head1.next.next.next = new Node(4);
    head1.next.next.next.next = new Node(5);
    head1.next.next.next.next.next = new Node(6);
    head1.next.next.next.next.next.next = new Node(7);

    // 0->9->8->6->7->null
    let head2 = new Node(0);
    head2.next = new Node(9);
    head2.next.next = new Node(8);
    head2.next.next.next = head1.next.next.next.next.next; // 8->6
    console.log(getIntersectNode(head1, head2).value);

    // 1->2->3->4->5->6->7->4...
    head1 = new Node(1);
    head1.next = new Node(2);
    head1.next.next = new Node(3);
    head1.next.next.next = new Node(4);
    head1.next.next.next.next = new Node(5);
    head1.next.next.next.next.next = new Node(6);
    head1.next.next.next.next.next.next = new Node(7);
    head1.next.next.next.next.next.next = head1.next.next.next; // 7->4

    // 0->9->8->2...
    head2 = new Node(0);
    head2.next = new Node(9);
    head2.next.next = new Node(8);
    head2.next.next.next = head1.next; // 8->2
    console.log(getIntersectNode(head1, head2).value);

    // 0->9->8->6->4->5->6..
    head2 = new Node(0);
    head2.next = new Node(9);
    head2.next.next = new Node(8);
    head2.next.next.next = head1.next.next.next.next.next; // 8->6
    console.log(getIntersectNode(head1, head2).value);
}

main();