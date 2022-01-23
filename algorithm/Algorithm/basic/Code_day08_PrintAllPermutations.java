package class_08;

import java.util.HashSet;

public class Code_04_Print_All_Permutations {

	public static void printAllPermutations1(String str) {
		char[] chs = str.toCharArray();
		process1(chs, 0);
	}

	// process1打印字符串全排列，允许重复，会产生n!种情况
	// 比如acc的全排列，会产生3!=6个字符串
	public static void process1(char[] chs, int i) { // 可选元素的范围：下标从i到之后的所有元素中 放置位置：选择元素放到位置i上
		if (i == chs.length) {
			System.out.println(String.valueOf(chs));
		}
		for (int j = i; j < chs.length; j++) {
			swap(chs, i, j);
			process1(chs, i + 1); // 继续递归
			swap(chs, i, j);
		}
	}

	public static void printAllPermutations2(String str) {
		char[] chs = str.toCharArray();
		process2(chs, 0);
	}

	// process2打印字符串全排列，不允许重复
	// 比如求acc的全排列，会产生acc cac cca 三个字符串
	// hashset用于同层去重
	public static void process2(char[] chs, int i) { // 放置位置：i 可选元素范围：i以及之后的下标对应元素
		if (i == chs.length) {
			System.out.println(String.valueOf(chs));
		}
		// 每次调用process2都会产生一个新的hashset->hashset用于同一层上的去重
		HashSet<Character> set = new HashSet<>(); // hashset并不存储结果，而是去除掉已经重复的子串
		for (int j = i; j < chs.length; j++) {
			if (!set.contains(chs[j])) { // hashset中已经有的
				set.add(chs[j]);
				swap(chs, i, j); // 选择元素放到位置i上
				process2(chs, i + 1);
				swap(chs, i, j);
			}
		}
	}

	public static void swap(char[] chs, int i, int j) {
		char tmp = chs[i];
		chs[i] = chs[j];
		chs[j] = tmp;
	}

	public static void main(String[] args) {
		String test1 = "abc";
		printAllPermutations1(test1);
		System.out.println("======");
		printAllPermutations2(test1);
		System.out.println("======");

		String test2 = "acc";
		printAllPermutations1(test2);
		System.out.println("======");
		printAllPermutations2(test2);
		System.out.println("======");
	}

}
