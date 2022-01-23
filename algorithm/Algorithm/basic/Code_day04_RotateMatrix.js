
/**
 * 
 * @param {*} matrix 
 * 将给定的正方形顺时针旋转90度，要求额外空间O(1)
 */
function rotate(matrix) {
    let start = 0;
    let end = matrix.length - 1; // 计算好每次rotateEdge的左上角和右下角的坐标
    while (start < end) { // 最后如果是2*2矩阵，需要旋转，如果是1*1，中间数据不需要旋转
        rotateEdge(matrix, start++, end--);
    }
}

function rotateEdge(matrix, start, end) {
    let cnt = end - start;
    for (let i = 0; i < cnt; i++){
        // 注意这是4个数据逐一被覆盖的过程，而不是覆盖别人的过程
        let temp = matrix[start][start + i];
        matrix[start][start + i] = matrix[end - i][start];
        matrix[end - i][start] = matrix[end][end - i];
        matrix[end][end - i] = matrix[start + i][end];
        matrix[start + i][end] = temp;
    }

}

function printMatrix(matrix) {
    for (let i = 0; i < matrix.length; i++) {
        console.log(matrix[i]);
    }
}


// for test
function main() {
    let matrix = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]];
    printMatrix(matrix);
    rotate(matrix);
    console.log("===========");
    printMatrix(matrix);
}

main();