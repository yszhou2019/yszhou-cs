package zuoshen.up.advanced_class_04;

import java.util.LinkedList;

public class Code_07_ExpressionCompute {

	public static int getValue(String str) {
		return value(str.toCharArray(), 0)[0];
	}

// 返回值为len=2的arr
// arr[0]代表子表达式的计算结果
// arr[1]代表子表达式计算结尾的idx
	public static int[] value(char[] str, int i) {
		LinkedList<String> que = new LinkedList<String>();
		int pre = 0;
		int[] bra = null;
		while (i < str.length && str[i] != ')') { // 没有到达结尾且不是右括号
			if (str[i] >= '0' && str[i] <= '9') {
				pre = pre * 10 + str[i++] - '0';
			} else if (str[i] != '(') { // 遇到加减乘除
				addNum(que, pre);
				que.addLast(String.valueOf(str[i++]));
				pre = 0;
			} else { // 遇到左括号
				bra = value(str, i + 1);
				pre = bra[0]; // 子表达式的计算结果
				i = bra[1] + 1; // 子表达式的结束idx+1
			}
		}
		addNum(que, pre);
		return new int[] { getNum(que), i };
	}

	public static void addNum(LinkedList<String> que, int num) { // [... num opr] <- num
		if (!que.isEmpty()) {
			int cur = 0;
			String top = que.pollLast(); // get opr
			if (top.equals("+") || top.equals("-")) {  // 加减直接无视，push num
				que.addLast(top);
			} else { // */则弹出num进行运算后push
				cur = Integer.valueOf(que.pollLast());
				num = top.equals("*") ? (cur * num) : (cur / num);
			}
		}
		que.addLast(String.valueOf(num));
	}

	public static int getNum(LinkedList<String> que) {
		int res = 0;
		boolean add = true;
		String cur = null;
		int num = 0;
		while (!que.isEmpty()) {
			cur = que.pollFirst();
			if (cur.equals("+")) {
				add = true;
			} else if (cur.equals("-")) {
				add = false;
			} else {
				num = Integer.valueOf(cur);
				res += add ? num : (-num);
			}
		}
		return res;
	}

	public static void main(String[] args) {
		String exp = "48*((70-65)-43)+8*1";
		System.out.println(getValue(exp));

		exp = "4*(6+78)+53-9/2+45*8";
		System.out.println(getValue(exp));

		exp = "10-5*3";
		System.out.println(getValue(exp));

		exp = "-3*4";
		System.out.println(getValue(exp));

		exp = "3+1*4";
		System.out.println(getValue(exp));

	}

}
