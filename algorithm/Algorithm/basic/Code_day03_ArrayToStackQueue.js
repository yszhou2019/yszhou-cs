
class Stack {
    constructor(size) {
        if (size < 0) {
            throw new Error("Init size is less than 0")
        }
        this.data = new Array(size);
        this.ptr = 0;
    }
    push(num) {
        if (this.ptr == this.data.length) {
            throw new Error("Stack is full")
        }
        this.data[ptr++] = num;
    }
    pop() {
        if (this.ptr == 0) {
            throw new Error("Stack is empty");
        }
        return this.data[--ptr];

    }
    peek() {
        if (this.ptr == 0) {
            throw new Error("Stack is empty")
        }
        return arr[ptr - 1];
    }
};

class Queue {
    constructor(size) {
        if (size < 0) {
            throw new Error("Init size is less than 0")
        }
        this.data = new Array(size);
        this.len = 0; // 额外用一个变量标记容量，否则的话就需要根据first和last的关系来判断是否empty和full
        this.first = 0;
        this.last = 0;
    }
    push() {
        if (this.len == this.data.length) {
            throw new Error("Queue is full")
        }
        this.len++;
        arr[this.last] = num;
        this.last = this.last == this.data.length - 1 ? 0 : last + 1;
    }
    pop() {
        if (this.len == 0) {
            throw new Error("Queue is empty")
        }
        this.len--;
        let temp = this.first;
        this.first = this.first == this.data.length - 1 ? 0 : this.first + 1;
        return this.data[temp];
    }
    peek() {
        if (this.len == 0) {
            return null;
        }
        return this.data[this.first];
    }

};





// for test
function main() {

}

main();