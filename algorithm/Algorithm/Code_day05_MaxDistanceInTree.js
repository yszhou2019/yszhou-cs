
class Node{
    constructor(v) {
        this.value = v;
        this.left = null;
        this.right = null;
    }
}

class ReturnType{
    constructor(maxD, h) {
        this.maxD = maxD;
        this.h = h;
    }
}

// 情况1和情况2，maxD来自左or右
// 情况3，maxD=root+左最大深度+右最大深度
function process(head) {
    if (head == null) {
        return new ReturnType(0, 0);
    }
    let leftinfo = process(head.left);
    let rightinfo = process(head.right);
    let maxD = 1 + leftinfo.h + rightinfo.h;
    return new ReturnType(Math.max(maxD, leftinfo.maxD, rightinfo.maxD), 1 + Math.max(leftinfo.h, rightinfo.h));
}

// for test
function main() {

    let head1 = new Node(1);
    head1.left = new Node(2);
    head1.right = new Node(3);
    head1.left.left = new Node(4);
    head1.left.right = new Node(5);
    head1.right.left = new Node(6);
    head1.right.right = new Node(7);
    head1.left.left.left = new Node(8);
    head1.right.left.right = new Node(9);
    console.log(process(head1));
    let head2 = new Node(1);
    head2.left = new Node(2);
    head2.right = new Node(3);
    head2.right.left = new Node(4);
    head2.right.right = new Node(5);
    head2.right.left.left = new Node(6);
    head2.right.right.right = new Node(7);
    head2.right.left.left.left = new Node(8);
    head2.right.right.right.right = new Node(9);
    console.log(process(head2));
}

main();