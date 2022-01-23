
class Program {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}

/**
 * 最多安排会议的数量
 * 贪心策略，最早结束时间进行排序
 */
function bestArrange(programs, start) {
    programs.sort((a, b) => a.end - b.end); // 按照结束时间最早进行升序排列
    let res = 0;
    for (let i = 0; i < programs.length; i++) {
        if (start <= programs[i].start) { // start记录的是上一个会议的结束时间
            res++;
            start = programs[i].end; // 如果能够召开，那么更新start
        }
    }
    return res;
}



// for test
function main() {

}

main();