
class GetMinStack {
    constructor() {
        this.data = [];
        this.help = []; // 辅助stack
    }
    push(num) {
        if (this.data.length == 0) {
            this.help.push(num);
        }
        else {
            this.help.push(num < this.getMin() ? num : this.getMin());
        }
        this.data.push(num);
    }
    pop() {
        if (this.data.length == 0) {
            throw console.error("Your stack is empty.");
        }
        this.help.pop();
        return this.data.pop();

    }
    getMin() {
        if (this.data.length == 0) {
            throw console.error("Your stack is empty.");
        }
        return this.help[this.help.length - 1];
    }
};


// for test
function main() {
    let stack = new GetMinStack();
    stack.push(3);
    console.log(stack.getMin());
    stack.push(1);
    console.log(stack.getMin());
    stack.push(4);
    console.log(stack.getMin());
    console.log(stack.pop());
    console.log(stack.getMin());


}

main();