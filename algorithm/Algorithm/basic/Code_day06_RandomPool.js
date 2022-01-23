
/**
 * RandomPool
 * 在实现hashset的添加、删除功能的基础上，增加函数getRandom()，随机等概率返回任意一个关键词
 */
class Pool {
    constructor() {
        this.keyIndexMap = new Map();
        this.indexKeyMap = new Map();
        this.size = 0;
    }
    insert(key) {
        this.keyIndexMap.set(key, this.size);
        this.indexKeyMap.set(this.size++, key);
    }
    /**
     * 
     * 删除指定的key
     */
    delete(key) {
        if (this.keyIndexMap.has(key)) {
            let deleteIdx = this.keyIndexMap.get(key);
            let lastIdx = this.size--;
            let lastKey = this.indexKeyMap.get(lastIdx);
            // 最后一个key放入到之前的idx中
            this.keyIndexMap.set(lastKey, deleteIdx);
            this.indexKeyMap.set(deleteIdx, lastKey);
            this.keyIndexMap.delete(key);
            this.indexKeyMap.delete(lastIdx);
        }

    }
    getRandom() {
        if (this.size == 0) {
            return null;
        }
        let randomIdx = Math.floor(Math.random() * this.size);
        return this.indexKeyMap.get(randomIdx);

    }
}


// for test
function main() {
    let pool = new Pool();
    pool.insert("zuo");
    pool.insert("cheng");
    pool.insert("yun");
    console.log(pool.getRandom());
    console.log(pool.getRandom());
    console.log(pool.getRandom());
    console.log(pool.getRandom());
    console.log(pool.getRandom());
    console.log(pool.getRandom());
}

main();