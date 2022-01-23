package zuoshen.up.advanced_class_04;

import java.util.HashMap;

public class Code_02_LRU {

	public static class Node<V> {
		public V value;
		public Node<V> last;
		public Node<V> next;

		public Node(V value) {
			this.value = value;
		}
	}

	public static class NodeDoubleLinkedList<V> {
		private Node<V> head;
		private Node<V> tail;

		public NodeDoubleLinkedList() {
			this.head = null;
			this.tail = null;
		}

		public void addNode(Node<V> newNode) {
			if (newNode == null) {
				return;
			}
			if (this.head == null) {
				this.head = newNode;
				this.tail = newNode;
			} else {
				this.tail.next = newNode;
				newNode.last = this.tail;
				this.tail = newNode;
			}
		}

		public void moveNodeToTail(Node<V> node) {
			if (this.tail == node) {
				return;
			}
			if (this.head == node) {
				this.head = node.next;
				this.head.last = null;
			} else {
				node.last.next = node.next;
				node.next.last = node.last;
			}
			node.last = this.tail;
			node.next = null;
			this.tail.next = node;
			this.tail = node;
		}

		public Node<V> removeHead() {
			if (this.head == null) {
				return null;
			}
			Node<V> res = this.head;
			if (this.head == this.tail) {
				this.head = null;
				this.tail = null;
			} else {
				this.head = res.next;
				res.next = null;
				this.head.last = null;
			}
			return res;
		}

	}

	public static class MyCache<K, V> {
		private HashMap<K, Node<V>> keyNodeMap; // 为什么需要两个map? <key, val> 是必须的，这个map在get和set的时候，根据key快速O(1)得到对应的双向链表中的节点
		private HashMap<Node<V>, K> nodeKeyMap; // <val, k> map只有在移除头部节点的时候才会用到，根据双向链表中的头结点，获取到对应的key
		private NodeDoubleLinkedList<V> nodeList; // LRU实际上只用双向链表保存Node<val>
		private int capacity;

		public MyCache(int capacity) {
			if (capacity < 1) {
				throw new RuntimeException("should be more than 0.");
			}
			this.keyNodeMap = new HashMap<K, Node<V>>();
			this.nodeKeyMap = new HashMap<Node<V>, K>();
			this.nodeList = new NodeDoubleLinkedList<V>();
			this.capacity = capacity;
		}

		// 这里的LRU的get和set时间都是严格O(1)
		public V get(K key) {
			if (this.keyNodeMap.containsKey(key)) {
				Node<V> res = this.keyNodeMap.get(key); // key, Node<V>是为了O(1)时间将Node移动到最后
				this.nodeList.moveNodeToTail(res);
				return res.value;
			}
			return null;
		}

		// O(1)
		public void set(K key, V value) {
			if (this.keyNodeMap.containsKey(key)) {
				Node<V> node = this.keyNodeMap.get(key); // 如果已有，就获取相应的Node，修改val，然后O(1)移动到队尾
				node.value = value;
				this.nodeList.moveNodeToTail(node);
			} else {
				Node<V> newNode = new Node<V>(value); // 如果没有，就先添加，再根据是否容量超限进行移除
				this.keyNodeMap.put(key, newNode);
				this.nodeKeyMap.put(newNode, key);
				this.nodeList.addNode(newNode); // 添加Node
				if (this.keyNodeMap.size() == this.capacity + 1) {
					this.removeMostUnusedCache();
				}
			}
		}

		private void removeMostUnusedCache() {
			Node<V> removeNode = this.nodeList.removeHead(); // 链表移除头部并返回头部节点
			K removeKey = this.nodeKeyMap.get(removeNode); // 删除掉对应的key
			this.nodeKeyMap.remove(removeNode);
			this.keyNodeMap.remove(removeKey);
		}

	}

	public static void main(String[] args) {
		MyCache<String, Integer> testCache = new MyCache<String, Integer>(3);
		testCache.set("A", 1);
		testCache.set("B", 2);
		testCache.set("C", 3);
		System.out.println(testCache.get("B"));
		System.out.println(testCache.get("A"));
		testCache.set("D", 4);
		System.out.println(testCache.get("D"));
		System.out.println(testCache.get("C"));

	}

}
