
/**
 * 打印字符串的全排列
 * 允许重复
 */
function printAllPermutations1(str) {
    function process1(i) {
        if (i == str.length) {
            console.log(arr.join());
            return;
        }
        for (let j = i; j < arr.length; j++) {
            swap(arr, i, j);
            process1(i + 1);
            swap(arr, i, j);
        }
    }
    let arr = str.split('');
    process1(0);
}

/**
 * 打印全排列，不允许重复
 * 这里可以用hashset去重
 */
function printAllPermutations2(str) {
    function process2(i) {
        if (i == arr.length) {
            console.log(arr.join());
            return;
        }
        let set = new Set();
        for (let j = i; j < arr.length; j++) {
            if (!set.has(arr[j])) {
                set.add(arr[j]);
                swap(arr, i, j);
                process2(i + 1);
                swap(arr, i, j);
            }
        }
    }
    let arr = str.split('');
    process2(0);
}

function swap(arr, i, j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}


// for test
function main() {
    let test1 = "abc";
    printAllPermutations1(test1);
    console.log("======");
    printAllPermutations2(test1);
    console.log("======");

    let test2 = "acc";
    printAllPermutations1(test2);
    console.log("======");
    printAllPermutations2(test2);
    console.log("======");
}

main();