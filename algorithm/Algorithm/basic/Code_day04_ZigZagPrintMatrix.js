
/**
 * 
 * @param {*} matrix 
 * 将给定的矩阵zigzag打印，要求额外空间O(1)
 */
function printMatrixZigZag(matrix) {
    let aR = 0;
    let aC = 0;
    let bR = 0;
    let bC = 0;
    let endRow = matrix.length - 1;
    let endCol = matrix[0].length - 1; // 这里计算的是临界坐标
    let Up2Down = false;
    while (aR != endRow + 1) { // 右下角的点也需要单独打印，因此需要包括aR=endRow
        printLevel(matrix, aR, aC, bR, bC, Up2Down);
        // aR = aC == endCol ? aR + 1 : aR; // 由于点a是先向右，再向下，点b是先向下，再向右。每次只能走一步，一定要注意顺序否则就容易一次走两步。为了避免犯错，这里可以直接改成if分支
        // aC = aC == endCol ? aC : aC + 1;
        aC == endCol ? aR++ : aC++;
        bR == endRow ? bC++ : bR++;
        // bC = bR == endRow ? bC + 1 : bC;
        // bR = bR == endRow ? bR : bR + 1;
        Up2Down = !Up2Down;
    }
}

function printLevel(matrix, startR, startC, endR, endC, Up2Down) {
    if (Up2Down) {
        while (startR != endR + 1) {
            console.log(matrix[startR++][startC--]);
        }
    } else {
        while (endR != startR - 1) {
            console.log(matrix[endR--][endC++]);
        }
    }
}


// for test
function main() {
    let matrix = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]];
    printMatrixZigZag(matrix);
}

main();