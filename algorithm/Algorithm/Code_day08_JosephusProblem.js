
class Node{
    constructor(v) {
        this.value = v;
        this.next = null;
    }
}

function josephusKill2(head, m) {
    if (head == null || head.next == head || m < 1) {
        return head;
    }
    let cur = head.next;
    let len = 1;
    while (cur != head) {
        len++;
        cur = cur.next;
    }
    len = getLive(len, m);
    while (--len != 0) {
        head = head.next;
    }
    head.next = head;
    return head;
}

function getLive(i, m) {
    if (i == 1) {
        return 1;
    }
    return (getLive(i - 1, m) + m - 1) % i + 1;
}

// for test
function main() {
    let head1 = new Node(1);
    head1.next = new Node(2);
    head1.next.next = new Node(3);
    head1.next.next.next = new Node(4);
    head1.next.next.next.next = new Node(5);
    head1.next.next.next.next.next = head1;
    // console.log(josephusKill1(head1, 3));

    let head2 = new Node(1);
    head2.next = new Node(2);
    head2.next.next = new Node(3);
    head2.next.next.next = new Node(4);
    head2.next.next.next.next = new Node(5);
    head2.next.next.next.next.next = head2;
    console.log(josephusKill2(head2, 3));
}

main();