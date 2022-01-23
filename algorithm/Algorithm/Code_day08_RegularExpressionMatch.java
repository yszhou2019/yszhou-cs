package zuoshen.up.advanced_class_06;

public class Code_03_RegularExpressionMatch {

	public static boolean isValid(char[] s, char[] e) {
		for (int i = 0; i < s.length; i++) {
			if (s[i] == '*' || s[i] == '.') {
				return false;
			}
		}
		for (int i = 0; i < e.length; i++) {
			if (e[i] == '*' && (i == 0 || e[i - 1] == '*')) {
				return false;
			}
		}
		return true;
	}

	// 递归版
	public static boolean isMatch(String str, String exp) {
		if (str == null || exp == null) {
			return false;
		}
		char[] s = str.toCharArray();
		char[] e = exp.toCharArray();
		return isValid(s, e) ? process(s, e, 0, 0) : false;
	}

	public static boolean process(char[] str, char[] exp, int i, int j) {
		// 都到达末尾，才能返回true
		if (j == exp.length) {
			return i == str.length;
		}
		// 如果exp还有剩余字符，并且剩余字符不是*
		if (j + 1 == exp.length || exp[j + 1] != '*') {
			// 那么如果str到达末尾，直接false；如果str没有到达末尾，并且字符相等或者exp中.与str匹配，那么继续递归
			return i != str.length && (exp[j] == str[i] || exp[j] == '.')
					&& process(str, exp, i + 1, j + 1);
		}
		// exp的j+1位置，不仅有字符，而且字符是*
		while (i != str.length && (exp[j] == str[i] || exp[j] == '.')) {
			if (process(str, exp, i, j + 2)) {
				return true;
			}
			// 每次exp[j]+exp[j+1]变成一个str[i] 两个str[i]... 逐渐尝试
			i++;
		}
		// 否则c*则解释为0个c，然后继续递归
		return process(str, exp, i, j + 2);
	}

	// 改成动态规划
	public static boolean isMatchDP(String str, String exp) {
		if (str == null || exp == null) {
			return false;
		}
		char[] s = str.toCharArray();
		char[] e = exp.toCharArray();
		if (!isValid(s, e)) {
			return false;
		}
		// 单独填写好最后一排和最后两列
		boolean[][] dp = initDPMap(s, e);
		for (int i = s.length - 1; i > -1; i--) {
			for (int j = e.length - 2; j > -1; j--) {
				if (e[j + 1] != '*') {
					dp[i][j] = (s[i] == e[j] || e[j] == '.')
							&& dp[i + 1][j + 1];
				} else {
					int si = i;
					while (si != s.length && (s[si] == e[j] || e[j] == '.')) {
						if (dp[si][j + 2]) {
							dp[i][j] = true;
							break;
						}
						si++;
					}
					if (dp[i][j] != true) {
						dp[i][j] = dp[si][j + 2];
					}
				}
			}
		}
		return dp[0][0];
	}

	public static boolean[][] initDPMap(char[] s, char[] e) {
		int slen = s.length;
		int elen = e.length;
		boolean[][] dp = new boolean[slen + 1][elen + 1];
		dp[slen][elen] = true;
		for (int j = elen - 2; j > -1; j = j - 2) {
			if (e[j] != '*' && e[j + 1] == '*') {
				dp[slen][j] = true;
			} else {
				break;
			}
		}
		if (slen > 0 && elen > 0) {
			if ((e[elen - 1] == '.' || s[slen - 1] == e[elen - 1])) {
				dp[slen - 1][elen - 1] = true;
			}
		}
		return dp;
	}

	public static void main(String[] args) {
		String str = "abcccdefg";
		String exp = "ab.*d.*e.*";
		System.out.println(isMatch(str, exp));
		System.out.println(isMatchDP(str, exp));

	}

}
