
/**
 * 给一个字符串，求出最长的回文子串的长度
 * p[i]为回文半径数组，返回max(p[i])-1即可
 * 时间O(N) 空间O(N)
 * - i在R外部，初始化p[i]=1，暴力对比左右，考虑更新C和R
 * - i在R内部，i的关于C的对称点的左边界pL
 *   1. 对称点的左边界被中心的左边界覆盖，取p[i]=p[对称点]，考虑更新C和R
 *   2. 对称点的左边界超出了中心的左边界，取p[i]=R-i，考虑更新C和R
 *   3. 对称点的边界刚好和中心的边界重合，p[i]初始值=min(p[对称点],R-i)，然后继续暴力对比，考虑更新C和R
 */
function maxLcpsLength(str) {
    if (str == null || str.length == 0) {
        return 0;
    }
    let char = manacherString(str);
    let p = new Array(char.length);
    let C = -1; // 最右回文右边界的中心
    let R = -1; // 最右回文右边界
    let res = 0;
    for (let i = 0; i < char.length; i++) {
        // 2022-01-03: 如果把p[i]全部初始化为1 则退化成O(n^2)算法
        // manacher核心在于p[i]如何更快的初始化(想办法利用之前的信息来加速初始化 而不是无脑从1开始向两边扩)
        p[i] = i < R ? Math.min(p[2 * C - i], R - i) : 1; // i在R内部，包含了三种情况，都在math.min中
        // 如果不在内部，那么对应的回文半径初始值设置成1，暴力扩
        // i在R的内部的三种情况中，边界被覆盖或者超出边界，会进入while的else分支，直接break
        // 如果边界刚好重合，会继续扩充
        // 如果i不在R内部，就会继续扩充
        while (i + p[i] < char.length && i - p[i] >= 0) { // 保证左右边界不越界
            if (char[i + p[i]] == char[i - p[i]]) {
                p[i]++;
            } else { // 无法继续扩，退出循环
                break;
            }
        }
        if (i + p[i] > R) { // 如果当前右边界超出了最大回文右边界，那么更新右边界和中心
            R = i + p[i]; // 更新最大回文右边界
            C = i; // 更新回文中心
        }
        res = Math.max(res, p[i]); // 记录最大的回文半径
    }
    return res - 1;
}

function manacherString(str) {
    let res = new Array(str.length * 2 + 1);
    let idx = 0;
    for (let i = 0; i < res.length; i++){
        res[i] = (i & 1) ? str[idx++] : '#';
    }
    return res;
}

// for test
function main() {
    let str1 = "abc1234321ab";
    console.log(maxLcpsLength(str1));
}

main();