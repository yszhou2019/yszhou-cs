
class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

/**
 * 
 * @param {Node} head 
 * O(n)空间，全部用栈存起来对比即可
 */
function isPalindrome1(head) {
    let p = head;
    let stack = [];
    while (p != null) {
        stack.push(p.value);
        p = p.next;
    }
    p = head;
    while (p != null) {
        if (p.value != stack.pop()) {
            return false;
        }
        p = p.next;
    }
    return true;
}

/**
 * 
 * @param {Node} head 
 * O(n)空间，快慢指针找中点，后部分用栈存起来对比即可
 * 偶数个节点，慢指针需要停留到中间两个的后一个上
 * 奇数个节点，慢指针需要停留到中间节点上
 * 需要用简单例子测试，来确定慢指针的起始位置是head还是head.next
 */
function isPalindrome2(head) {
    if (head == null || head.next == null) { // 注意！边界处理
        return true;
    }
    let fast = head;
    let slow = head.next;
    while (fast.next != null && fast.next.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    let stack = [];
    // let mid = slow;
    while (slow != null) {
        stack.push(slow.value);
        slow = slow.next;
    }
    fast = head;
    while (stack.length > 0) {
        if (fast.value != stack.pop()) {
            return false;
        }
        fast = fast.next;
    }
    return true;
}

/**
 * 
 * @param {Node} head 
 * O(n)时间，O(1)空间。快慢指针确定中点，逆序后部分，判断完毕后复原。
 * 简单例子测试，slow=head
 * 偶数个节点，停留在中间两个节点的前一个节点上
 * 奇数个节点，停留在中间节点上
 * 偶数个节点，拆分成等长两个链表1->2(nil)<-2<-1
 * 奇数个节点，两个链表公用中间的节点1->2(nil)<-1
 */
function isPalindrome3(head) {
    if (head == null || head.next == null) {
        return true;
    }
    let n1 = head;
    let n2 = head;
    while (n2.next != null && n2.next.next != null) {
        n1 = n1.next;
        n2 = n2.next.next;
    }
    n2 = n1.next; // reverse
    n1.next = null;
    let n3 = null;
    while (n2 != null) {
        n3 = n2.next;
        n2.next = n1;
        n1 = n2;
        n2 = n3;
    }
    n3 = n1; // record last node
    n2 = head; // ispalindrome
    let res = true;
    while (n2 != null) {
        if (n2.value != n1.value) {
            res = false;
            break;
        }
        n2 = n2.next;
        n1 = n1.next;
    }
    n2 = n3.next; // recovery
    n3.next = null;
    while (n2 != null) {
        n1 = n2.next;
        n2.next = n3;
        n3 = n2;
        n2 = n1;
    }
    return res;
}

function newC(head) {
    if (head == null || head.next == null) {
        return true;
    }
    let n1 = head, n2 = head;
    while (n2.next != null && n2.next.next != null) {
        n1 = n1.next;
        n2 = n2.next.next;
    }
    // 翻转
    n2 = n1.next;
    n1.next = null;
    let n3 = null;
    while (n2 != null) {
        n3 = n2.next; // 记录下一个
        n2.next = n1;
        n1 = n2;
        n2 = n3; // n2移动到下一个
    }
    // n1为新表头
    n3 = n1;
    n2 = head;
    // 判断
    let res = true;
    while (n2 != null) {
        if (n2.val != n1.val) {
            res = false;
            break;
        }
        n1 = n1.next;
        n2 = n2.next;
    }
    // 恢复
    n2 = n3.next;
    n3.next = null;
    n1 = n3;
    while (n2 != null) {
        n3 = n2.next // 保留cur.next
        n2.next = n1; // 指向front
        n1 = n2; // front后移 
        n2 = n3; // cur后移
    }
    return res;
}

function reverseList(head) {
    let cur = head;
    let front = null;
    while (cur != null) {
        let back = cur.next; // 先记录下来后面的部分，以便cur向后移动
        cur.next = front; // 指向前面
        front = cur; // front后移，要保证先front后移再cur后移
        cur = back; // cur后移
    }
    return front;
}


function printLinkedList(node) {
    let str = "Linked List: ";
    while (node != null) {
        str += node.value + " ";
        node = node.next;
    }
    console.log(str);
}


// for test
function main() {
    let head = null;
    printLinkedList(head);
    console.log(isPalindrome1(head) + " | " + isPalindrome2(head) + " | " + isPalindrome3(head) + " | ");
    printLinkedList(head);
    console.log("=========================");

    head = new Node(1);
    printLinkedList(head);
    console.log(isPalindrome1(head) + " | " + isPalindrome2(head) + " | " + isPalindrome3(head) + " | ");
    printLinkedList(head);
    console.log("=========================");

    head.next = new Node(2);
    printLinkedList(head);
    console.log(isPalindrome1(head) + " | " + isPalindrome2(head) + " | " + isPalindrome3(head) + " | ");
    printLinkedList(head);
    console.log("=========================");

    head.next.next = new Node(3);
    printLinkedList(head);
    console.log(isPalindrome1(head) + " | " + isPalindrome2(head) + " | " + isPalindrome3(head) + " | ");
    printLinkedList(head);
    console.log("=========================");

    head.next.next.next = new Node(2);
    printLinkedList(head);
    console.log(isPalindrome1(head) + " | " + isPalindrome2(head) + " | " + isPalindrome3(head) + " | ");
    printLinkedList(head);
    console.log("=========================");

    head.next.next.next.next = new Node(1);
    printLinkedList(head);
    console.log(isPalindrome1(head) + " | " + isPalindrome2(head) + " | " + isPalindrome3(head) + " | ");
    printLinkedList(head);
    console.log("=========================");
}

main();