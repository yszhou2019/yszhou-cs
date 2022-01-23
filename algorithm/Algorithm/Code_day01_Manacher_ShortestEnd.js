
/**
 * 字符串只能在尾部添加字符，求添加最短的字符串，使得整个字符串为回文串
 * 有manacher，当最右回文右边界首次达到字符串右端的时候，C有了，R有了，L有了，(L,C,R)就是包含原str最后一个字符情况下的最长的回文串，只需要L之前的逆序即可
 * 更新最右回文右边界的中心的时候，回文中心一定是当前的i
 * 
 */
function shortestEnd(str) {
    if (str == null || str.length == 0) {
        return 0;
    }
    let char = manacherString(str);
    let p = new Array(char.length);
    let C = -1; // 最右回文右边界的中心
    let R = -1; // 最右回文右边界
    let len = -1;
    for (let i = 0; i < char.length; i++) {
        p[i] = i < R ? Math.min(p[2 * C - i], R - i) : 1; // i在R内部，包含了三种情况，都在math.min中
        while (i + p[i] < char.length && i - p[i] >= 0) { // while保证边界合法
            if (char[i + p[i]] == char[i - p[i]]) { // if保证左右匹配
                p[i]++;
            } else { // i在R内部的，边界不重合的两种情况会直接命中else，退出循环
                break;
            }
        }
        if (i + p[i] > R) { // 更新最右回文右边界的中心的时候，回文中心一定是当前的i
            R = i + p[i];
            C = i;
        }
        if (R == char.length) { // 回文右边界到达末尾，退出循环，此时p[i]就是i对应的左右两个边界内部的回文串的长度，是将来所求的回文串的公共部分，只需要前面的字符串逆序即可，前面字符串的长度=str.len-p[i]+1
            len = p[i];
            break;
        }
    }
    let res = str.slice(0, str.length - len + 1);
    return res.split('').reverse().join('');
    // let res = new Array(str.length - len + 1);
    // for (let i = 0; i < res.length; i++) {
    //     res[res.length - 1 - i] = char[2 * i + 1];
    // }
    // return res.join('');
}

function manacherString(str) {
    let res = new Array(str.length * 2 + 1);
    let idx = 0;
    for (let i = 0; i < res.length; i++) {
        res[i] = (i & 1) ? str[idx++] : '#';
    }
    return res;
}

// for test
function main() {
    let str2 = "abcd123321";
    console.log(shortestEnd(str2));
}

main();