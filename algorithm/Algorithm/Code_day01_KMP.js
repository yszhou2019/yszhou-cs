
/**
 * KMP求解字符串首次出现的位置
 * KMP有两个模板
 * getNext也有两个模板
 */
 function getIndexOf(txt, pat) {
    if (txt == null || pat == null || pat.length < 1 || txt.length < pat.length) {
        return -1;
    }
    let i = 0, j = 0;
    let next = getNextArray2(pat);
    while (i < txt.length && j < pat.length) {
        if (txt[i] == pat[j]) { // 如果匹配，则各进一步
            i++;
            j++;
        } else if (next[j] == -1) { // 第一个位置发生失配，直接把txt右移1位
            i++;
        } else { // 不是第一个位置之后的位置发生失配，说明中间过程发生失配，那么按照next数组移动pat
            j = next[j];
        }
    }
    return j == pat.length ? i - j : -1;
}

function KMP2(txt, pat) {
    if (txt == null || pat == null || pat.length < 1 || txt.length < pat.length) {
        return -1;
    }
    let i = 0, j = 0;
    let next = getNextArray2(pat);
    while (i < txt.length && j < pat.length) {
        if (j == -1 || txt[i] == pat[j]) { // 匹配则向右移动
            i++;
            j++;
        } else { // 不匹配则不停移动pat，如果一直不匹配，那么j=next[0]=-1
            j = next[j];
        }
    }
    return j == pat.length ? i - j : -1;
}

/**
 * 求txt中pat一共出现的次数
 */
function KMP3(txt, pat) {
    if (txt == null || pat == null || pat.length < 1 || txt.length < pat.length) {
        return 0;
    }
    let res = 0;
    let i = 0, j = 0;
    let next = getNextArray2(pat);
    while (i < txt.length && j < pat.length) {
        if (j == -1 || txt[i] == pat[j]) {
            i++;
            j++;
        } else {
            j = next[j];
        }
        if (j == pat.length) {
            res++;
            i--;
            j = next[j - 1];
        }
    }
    return res;
}

/**
 * next[i]表示从pat[0]到pat[i-1]，前缀集合和后缀集合的交集的最长字符串的长度，前缀 后缀不包括自身
 */
function getNextArray(pat) {
    if (pat.length == 1) {
        return new Array(1).fill(0);
    }
    let next = new Array(pat.length).fill(0);
    next[0] = -1; // next[0]=-1 next[1]=0 从i=2开始计算next
    let i = 2, j = 0;
    // j表示的是 i前一个位置的最长前后缀长度
    while (i < next.length) {
        if (pat[i - 1] == pat[j]) { // 匹配
            next[i] = ++j;
            i++;
        } else if (j > 0) { // 不匹配，就需要继续找最长前后缀，直到匹配或者j=0
            j = next[j];
        } else { // j=0，说明pat[i]前面的位置不存在相等的最长前后缀
            next[i++] = 0;
        }
    }
    return next;
}

function getNextArray2(pat) {
    if (pat == null || pat.length == 1) {
        return new Array(1).fill(-1);
    }
    let next = new Array(pat.length).fill(0);
    next[0] = -1;
    let i = 2, j = 0; // 开始计算next[2]，j代表的是idx=1位置上的最长前后缀长度
    while (i < pat.length) {
        if (pat[j] == pat[i - 1]) {
            next[i] = ++j;
            i++;
        } else if (j > 0) {
            j = next[j];
        } else {
            next[i++] = 0;
        }
    }
    return next;
}

// for test
function main() {
    let txt = "abcabcababaccc";
    let pat = "ababac";
    console.log(KMP2(txt, pat));
    txt = "aaaaa";
    pat = "aaaa";
    console.log(KMP3(txt, pat));
}

main();