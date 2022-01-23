
function printAllFolds(N) {
    printProcess(1, N, true);
}

function printProcess(i, N, down) {
    if (i > N) {
        return;
    }
    printProcess(i + 1, N, true);
    console.log(down ? "down" : "up");
    printProcess(i + 1, N, false);
}


// for test
function main() {
    let N = 4;
    printAllFolds(N);
}

main();