
/**
 * 前缀树的节点
 * - end 查某个字符串是否存在于树中
 * - path 查前缀的词频是多少
 */
class TrieNode{
    constructor() {
        this.path = 0;
        this.end = 0;
        this.nexts = new Array(26); // 26个字母
    }
}

/**
 * 前缀树
 * - 添加word
 * - 删除word
 * - 查某个字符串是否存在于树中
 * - 查前缀的词频是多少
 */
class Trie{
    constructor() {
        this.root = new TrieNode();
    }
    /**
     * 
     * @param {string} word 
     * 功能
     * 添加word到前缀树当中一次
     * - 无返回值
     */
    insert(word) {
        if (word == null) {
            return;
        }
        let node = this.root;
        for (let i = 0; i < word.length; i++){
            let idx = word.charCodeAt(i) - 97;
            if (node.nexts[idx] == null) {
                node.nexts[idx] = new TrieNode();
            }
            node = node.nexts[idx]; // 先进入node.next然后再path++
            node.path++;
        }
        node.end++;
    }
    /**
     * 
     * @param {string} word 
     * 功能
     * 从前缀树当中删除指定word一次
     * 首先需要将指定的word删除一次
     * 然后路径上的前缀都需要删除一次
     * JS垃圾回收，需要手动删除一次自动释放；如果是cxx还需要手动释放全部
     */
    delete(word) {
        if (this.search(word) != 0) {
            let node = this.root;
            for (let i = 0; i < word.length; i++){
                let idx = word.charCodeAt(i) - 97;
                node.nexts[idx].path--;
                if (node.nexts[idx].path == 0) {
                    delete node.nexts[idx];
                    node.nexts[idx] = null;
                    return;
                }
                node = node.nexts[idx];
            }
            node.end--;
        }
    }
    /**
     * 
     * @param {string} word 
     * 查询字符串出现了多少次
     */
    search(word) {
        if (word == null) {
            return 0;
        }
        let node = this.root;
        for (let i = 0; i < word.length; i++){
            let idx = word.charCodeAt(i) - 97;
            if (node.nexts[idx] == null) {
                return 0;
            }
            node = node.nexts[idx];
        }
        return node.end;
    }
    /**
     * 
     * @param {string} word 
     * 查询前缀的词频
     */
    prefixNumber(word) {
        if (word == null) {
            return 0;
        }
        let node = this.root;
        for (let i = 0; i < word.length; i++){
            let idx = word.charCodeAt(i) - 97;
            if (node.nexts[idx] == null) {
                return 0;
            }
            node = node.nexts[idx];
        }
        return node.path;
    }
}


// for test
function main() {
    let trie = new Trie();
    console.log(trie.search("zuo"));
    trie.insert("zuo");
    console.log(trie.search("zuo"));
    trie.delete("zuo");
    console.log(trie.search("zuo"));
    trie.insert("zuo");
    trie.insert("zuo");
    trie.delete("zuo");
    console.log(trie.search("zuo"));
    trie.delete("zuo");
    console.log(trie.search("zuo"));
    trie.insert("zuoa");
    trie.insert("zuoac");
    trie.insert("zuoab");
    trie.insert("zuoad");
    trie.delete("zuoa");
    console.log(trie.search("zuoa"));
    console.log(trie.prefixNumber("zuo"));
}

main();