
class Node{
    constructor(huo) {
        this.huo = huo;
        this.nexts = [];
    }
}

class ReturnType{
    constructor(l,b) {
        this.lai_huo = l;
        this.bulai_huo = b;
    }
}

function MaxHappy(head) {
    let ret = process(head);
    return Math.max(ret.lai_huo, ret.bulai_huo);
}

function process(head) {
    let lai_huo = head.huo;
    let bulai_huo = 0;
    for (let i = 0; i < head.nexts; i++){
        let ret = process(head.nexts[i]);
        // 所有的子树解决完了，搜集完子的信息，整理出父的信息交给上层
        lai_huo += ret.bulai_huo;
        bulai_huo += Math.max(ret.lai_huo, ret.bulai_huo);
    }
    return new ReturnType(lai_huo, bulai_huo);

}

// 另外有树形DP的解法，参照java源文件

// for test
function main() {
    
}

main();