package zuoshen.up.advanced_class_03;

import java.util.ArrayList;
import java.util.Iterator;

public class Code_02_SkipList {

	public static class SkipListNode {
		public Integer value;
		public ArrayList<SkipListNode> nextNodes; // 保存的是不同层的索引，每个指针都指向下个节点

		public SkipListNode(Integer value) {
			this.value = value;
			nextNodes = new ArrayList<SkipListNode>();
		}
	}

	public static class SkipListIterator implements Iterator<Integer> {
		SkipList list;
		SkipListNode current;

		public SkipListIterator(SkipList list) {
			this.list = list;
			this.current = list.getHead();
		}

		public boolean hasNext() {
			return current.nextNodes.get(0) != null;
		}

		public Integer next() {
			current = current.nextNodes.get(0);
			return current.value;
		}
	}

	public static class SkipList {
		private SkipListNode head;
		private int maxLevel;
		private int size;
		private static final double PROBABILITY = 0.5;

		public SkipList() {
			size = 0;
			maxLevel = 0;
			head = new SkipListNode(null); // 表头节点的value设置成null
			head.nextNodes.add(null); // head这个链表代表的是最高的层数，从链表表头到表尾，依次是第0层，第1层，第2层...
		}

		public SkipListNode getHead() {
			return head;
		}

		// 向跳表中添加数据
		public void add(Integer newValue) {
			if (!contains(newValue)) { // 首先确定跳表中不存在该value
				size++;
				int level = 0;
				while (Math.random() < PROBABILITY) { // 随机生成新节点的层数，也就是需要建立几级索引
					level++;
				}
				while (level > maxLevel) { // 如果新节点的层数比之前所有层数都高，那么更新跳表的最大高度
					head.nextNodes.add(null); // 表头需要更新最高索引的指针
					maxLevel++;
				}
				SkipListNode newNode = new SkipListNode(newValue); // 将新数据封装成节点
				SkipListNode current = head;
				do {
					current = findNext(newValue, current, level); // 新节点有level个指针，需要添加level次
					newNode.nextNodes.add(0, current.nextNodes.get(level)); // 添加到从小到大合适的位置 JAVA ArrayList.add([idx,] Ele) 头插法，从最高级索引开始进行头插，索引设置完毕，刚好ArrayList.get(idx)就是第idx级索引
					current.nextNodes.set(level, newNode); // JAVA ArrayList.set(idx, Ele)
				} while (level-- > 0); // 对新数据建立k级索引
			}
		}

		// 在跳表中删除指定数据
		public void delete(Integer deleteValue) {
			if (contains(deleteValue)) {
				SkipListNode deleteNode = find(deleteValue);
				size--;
				int level = maxLevel; // 从最高层逐级下降删除
				SkipListNode current = head;
				do {
					current = findNext(deleteNode.value, current, level); // cur节点->del节点->del的next节点
					if (deleteNode.nextNodes.size() > level) {
						current.nextNodes.set(level, deleteNode.nextNodes.get(level)); // 在cur节点上insert level级索引
					}
				} while (level-- > 0);
			}
		}

		// Returns the skiplist node with greatest value <= e
		// 在小于等于给定值的所有节点中，返回 值最大的节点
		private SkipListNode find(Integer e) {
			return find(e, head, maxLevel);
		}

		// Returns the skiplist node with greatest value <= e
		// Starts at node start and level
		// 按索引的层级进行查找，从最高级索引向低级索引进行查找，直到找到节点并返回
		private SkipListNode find(Integer e, SkipListNode current, int level) {
			do {
				current = findNext(e, current, level);
			} while (level-- > 0);
			return current;
		}

		// Returns the node at a given level with highest value less than e
		// 在指定level级的索引中，从小到大顺序查找，在所有比e小的节点中，返回值最大的节点
		private SkipListNode findNext(Integer e, SkipListNode current, int level) {
			SkipListNode next = current.nextNodes.get(level); // 当前节点的level级索引指向下一个元素
			while (next != null) {
				Integer value = next.value;
				if (lessThan(e, value)) { // e < value
					break;
				}
				current = next;
				next = current.nextNodes.get(level); // 在level级索引中不停遍历直到停止
			}
			return current;
		}

		public int size() {
			return size;
		}

		public boolean contains(Integer value) {
			SkipListNode node = find(value);
			return node != null && node.value != null && equalTo(node.value, value);
		}

		public Iterator<Integer> iterator() {
			return new SkipListIterator(this);
		}

		/******************************************************************************
		 * Utility Functions *
		 ******************************************************************************/

		private boolean lessThan(Integer a, Integer b) {
			return a.compareTo(b) < 0;
		}

		private boolean equalTo(Integer a, Integer b) {
			return a.compareTo(b) == 0;
		}

	}

	public static void main(String[] args) {

	}

}
