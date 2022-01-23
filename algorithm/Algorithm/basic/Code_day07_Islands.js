
/**
 * 
 * @param {Array} m 
 * - 计算01矩阵中岛屿的数量
 * - 进阶，大数据问题
 * 超大01矩阵中，分布式计算岛屿数量，需要用到并查集和spark
 */
function countIslands(m) {
    let res = 0;
    if (m == null || m[0] == null) {
        return 0;
    }
    let M = m.length;
    let N = m[0].length;
    for (let i = 0; i < M; i++) {
        for (let j = 0; j < N; j++) {
            if (m[i][j] == 1) {
                res++;
                infect(m, i, j, M, N);
            }
        }
    }
    return res;
}

/**
 * 
 * @param {Array} m 
 * 
 */
function infect(m, i, j, M, N) {
    if (i < 0 || i >= M || j < 0 || j >= N || m[i][j] != 1) {
        return;
    }
    m[i][j] = 2;
    infect(m, i + 1, j, M, N);
    infect(m, i - 1, j, M, N);
    infect(m, i, j + 1, M, N);
    infect(m, i, j - 1, M, N);
}

// for test
function main() {
    let m1 = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0, 0, 0, 1, 0],
        [0, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],];
    console.log(countIslands(m1));

    let m2 = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 0, 0, 0, 1, 0],
        [0, 1, 1, 0, 0, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],];
    console.log(countIslands(m2));
}

main();