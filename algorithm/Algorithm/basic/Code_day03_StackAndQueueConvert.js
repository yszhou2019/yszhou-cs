
class TwoStackQueue {
    constructor() {
        this.stack1 = [];
        this.stack2 = [];
    }
    push(num) {
        this.stack1.push(num);
    }
    pop() {
        if (this.stack2.length > 0) { // stack2有数据，则直接pop
            return this.stack2.pop();
        }
        else {
            while (this.stack1.length > 0) { // 没有数据，则stack1全部倒入到stack2中，然后pop
                this.stack2.push(this.stack1.pop());
            }
            return this.stack2.pop();
        }
    }
};

class TwoQueueStack {
    constructor() {
        this.data = [];
        this.help = [];
    }
    push(num) {
        this.data.push(num);
    }
    pop() {
        // 队列中除了最后一个元素，剩下元素全部进入另外一个队列
        while (this.data.length > 1) {
            this.help.push(this.data.shift()); // unshift()是添加到队首
        }
        let res = this.data.pop();
        // 将两个que进行交换
        let temp = this.data;
        this.data = this.help;
        this.help = temp;
        return res;
    }
};

// for test
function main() {
    let stack = new TwoQueueStack();
    stack.push(1);
    stack.push(2);
    stack.push(3);
    stack.push(4);
    console.log([stack.pop(), stack.pop(), stack.pop(), stack.pop()]);
    let queue = new TwoStackQueue();
    queue.push(1);
    queue.push(2);
    queue.push(3);
    queue.push(4);
    console.log([queue.pop(), queue.pop(), queue.pop(), queue.pop()]);

}

main();