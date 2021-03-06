
/**
 * 
 * O(M+N)的时间，在有序矩阵中判断是否存在K
 */
function isContains(matrix, K) {
    let row = 0;
    let col = matrix[0].length - 1;
    while (col >= 0 && row < matrix.length) {
        if (matrix[row][col] == K) {
            return true;
        } else if (matrix[row][col] > K) {
            col--;
        } else {
            row++;
        }
    }
    return false;
}



// for test
function main() {
    let matrix = [[0, 1, 2, 3, 4, 5, 6],// 0
    [10, 12, 13, 15, 16, 17, 18],// 1
    [23, 24, 25, 26, 27, 28, 29],// 2
    [44, 45, 46, 47, 48, 49, 50],// 3
    [65, 66, 67, 68, 69, 70, 71],// 4
    [96, 97, 98, 99, 100, 111, 122],// 5
    [166, 176, 186, 187, 190, 195, 200],// 6
    [233, 243, 321, 341, 356, 370, 380] // 7
    ];
    let K = 233;
    console.log(isContains(matrix, K));
}

main();