
/**
 * 
 * @param {Array} matrix 
 */
function spiralOrderPrint(matrix) {
    if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
        return;
    }
    let startRow = 0, startCol = 0;
    let endRow = matrix.length - 1, endCol = matrix[0].length - 1;
    while (startRow <= endRow && startCol <= endCol) {
        printEdge(matrix, startRow, startCol, endRow, endCol); // 需要注意主循环，计算边界的坐标。这里的函数打印包含了退化的情况，因此只需要保证左上角坐标<=右下角坐标，(a,b),(c,d)，如果a=c,b=d，可以处理；一个相等，一个不相等，可以打印一行或者一列；两个不等，可以打印一圈；
        startRow++;
        startCol++;
        endRow--;
        endCol--;
    }
}

/**
 * 
 * 函数的功能是根据坐标，打印一圈，或者打印一行或者打印一列，也就是包含了退化的情况
 */
function printEdge(matrix, startRow, startCol, endRow, endCol) {
    if (startRow == endRow) { // 同一行
        for (let i = startCol; i <= endCol; i++){
            console.log(matrix[startRow][i]);
        }
    } else if (startCol == endCol) { // 同一列
        for (let i = startRow; i <= endRow; i++){
            console.log(matrix[i][startCol]);
        }
    } else {
        let curRow = startRow;
        let curCol = startCol;
        while (curCol != endCol) { // 没有打印第一行最后一个
            console.log(matrix[curRow][curCol]);
            curCol++;
        }
        while (curRow != endRow) { // 没有打印最后一列最后一行
            console.log(matrix[curRow][curCol]);
            curRow++;
        }
        while (curCol != startCol) { // 没有打印最后一行第一个
            console.log(matrix[curRow][curCol]);
            curCol--;
        }
        while (curRow != startRow) { // 没有打印第一列第一个
            console.log(matrix[curRow][curCol]);
            curRow--;
        }
    }
}



// for test
function main() {
    let matrix = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]];
    spiralOrderPrint(matrix);
}

main();