
/**
 * 打印所有的子序列
 * 子串和子序列的区别
 * - 子串，要求连续
 * - 子序列，不要求连续
 */
function printAllSubsquence(str) {
    process(str, "", 0);
}

function process(str, path, i) {
    if (i == str.length) {
        console.log(path);
        return;
    }
    process(str, path.slice(), i + 1);
    path += str[i];
    process(str, path.slice(), i + 1);
}



// for test
function main() {
    let test = "abc";
    printAllSubsquence(test);
}

main();