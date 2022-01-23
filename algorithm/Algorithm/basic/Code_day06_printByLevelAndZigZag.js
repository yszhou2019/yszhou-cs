
/**
 * 分层遍历
 * [[1],
 * [2,3],
 * [4,5,6,7]]
 */
function printByLevel(head) {
    if (head == null) {
        return;
    }
    let q = [head];
    let last = head, nLast = null; // last标记的是当前一行广度优先队列的最后一个节点，nLast标记的是下一行的结尾
    let res = [];
    let curLevel = [];
    while (q.length > 0) {
        let temp = q.shift();
        curLevel.push(temp.val);
        let left = temp.left, right = temp.right;
        if (left) {
            q.push(left);
            nLast = left; // 不断更新下一行的结尾
        }
        if (right) {
            q.push(right);
            nLast = right; // 不断更新下一行的结尾
        }
        if (temp == last) { // 本行遍历完毕，记录本行的遍历结果
            res.push(curLevel);
            curLevel = [];
            if (q.length > 0) { // 如果广度优先队列中仍然有数据，说明要开始遍历下一行了，更新本行的结尾节点
                last = nLast;
            }
        }
    }
    return res;
}

/**
 * 分层遍历
 * [[1],
 * [3,2],
 * [4,5,6,7]]
 * method one 不好理解，而且操作容易出错！不建议！
 */
function printByZigZag1(head) {
    if (head == null) {
        return [];
    }
    let res = [];
    let cur = [];
    let q = [head];
    let l2r = true;
    let last = head, nlast = null;
    let temp = null;
    while (q.length > 0) {
        if (l2r) {
            temp = q.shift();
            let { left, right, val } = temp;
            cur.push(val);
            if (left) {
                q.push(left);
                nlast = nlast == null ? left : nlast;
            }
            if (right) {
                q.push(right);
                nlast = nlast == null ? right : nlast;
            }
        } else {
            temp = q.pop();
            let { left, right, val } = temp;
            cur.push(val);
            if (right) {
                q.unshift(right);
                nlast = nlast == null ? right : nlast;
            }
            if (left) {
                q.unshift(left);
                nlast = nlast == null ? left : nlast;
            }
        }
        if (temp == last) {
            l2r = !l2r;
            res.push(cur);
            cur = [];
            if (q.length > 0) {
                last = nlast;
                nlast = null;
            }
        }
    }
    return res;
}

/**
 * 仍然按照分层遍历
 * Much more easier than method one
 * 用一个双端队列来记录每层的结果
 * 只不过偶数层，队列尾插保存val
 * 奇数层，队列头插保存val
 * 
 * method one 不好理解，而且操作容易出错！不建议！
 */
function printByZigZag2(head) {
    if (head == null) {
        return [];
    }
    let res = [];
    let cur = [];
    let level = 0;
    let q = [head];
    let last = head, nlast = null;
    while (q.length > 0) {
        let temp = q.shift();
        let { left, right, val } = temp;
        if (level % 2 == 0) {
            cur.push(val); // 偶数层，队列尾插
        } else {
            cur.unshift(val); // 奇数层，队列头插
        }
        if (left) {
            q.push(left);
            nlast = left;
        }
        if (right) {
            q.push(right);
            nlast = right;
        }
        if (temp == last) {
            res.push(cur);
            cur = [];
            level++;
            if (q.length > 0) {
                last = nlast;
            }
        }
    }
    return res;
}