
/**
 * 
 * @param {Array} strs 
 */
function lowestString(strs) {
    if (strs == null || strs.length == 0) {
        return "";
    }
    strs.sort((a, b) => (a + b) > (b + a));
    let res = "";
    for (let i = 0; i < strs.length; i++) {
        res += strs[i];
    }
    return res;
}

function compare(a, b) {
    if (a + b > b + a) // 这种情况应该a前
        return -1; // 返回负数
    else
        return 1;
}

// for test
function main() {
    let strs1 = ["jibw", "ji", "jp", "bw", "jibw"];
    console.log(lowestString(strs1));
    let strs2 = ["ba", "b"];
    console.log(lowestString(strs2));
}

main();