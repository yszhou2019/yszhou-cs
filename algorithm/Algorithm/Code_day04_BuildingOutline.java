
package zuoshen.up.advanced_class_04;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Map.Entry;
import java.util.TreeMap;

public class Code_01_Building_Outline {

    public static class Node {
         public boolean isUp;
         public int posi;
         public int h;
 
         public Node(boolean bORe, int position, int height) {
        isUp = bORe;
        posi = position;
        h = height;
    }
}

public static class NodeComparator implements Comparator<Node> {
    @Override
    public int compare(Node o1, Node o2) {
        if (o1.posi != o2.posi) {
            return o1.posi - o2.posi;
        }
        if (o1.isUp != o2.isUp) {
            return o1.isUp ? -1 : 1;
        }
        return 0;
    }
}

/**
 * 大楼轮廓线
 * 如果已经知道了每个idx上的最大高度，就很容求出来最后的轮廓线
 * 
 * 所以首先要求出每个位置上的最大高度，也就是这里的pmMap(idx，最大高度)
 * 求法：
 * 每个大楼有2个边界，分别是上/下
 * 产生边界数组之后，按照pos进行升序排序，位置相同那么先up后down
 * 排序完毕，遍历产生的边界数组，用treemap记录(高度，高度出现的次数)，up则次数+1，down则次数-1
 * 同时，遍历的时候，记录边界数组的pos和treemap中的最大key，也就是pos和pos上的最大高度=>形成(pos,MaxHeight)的map
 * 之后，遍历map，如果最大高度发生变化，那么形成一次轮廓线
 *      高度不发生变化，进入下一次循环，直到遍历完毕
 *      另外curHeight=0说明是高楼的左轮廓线
 */
	public static List<List<Integer>> buildingOutline(int[][] buildings) {
		Node[] nodes = new Node[buildings.length * 2];
		for (int i = 0; i < buildings.length; i++) {
			nodes[i * 2] = new Node(true, buildings[i][0], buildings[i][2]);
			nodes[i * 2 + 1] = new Node(false, buildings[i][1], buildings[i][2]);
		}
		Arrays.sort(nodes, new NodeComparator());
		TreeMap<Integer, Integer> htMap = new TreeMap<>();
		TreeMap<Integer, Integer> pmMap = new TreeMap<>();
		for (int i = 0; i < nodes.length; i++) {
			if (nodes[i].isUp) {
				if (!htMap.containsKey(nodes[i].h)) {
					htMap.put(nodes[i].h, 1);
				} else {
					htMap.put(nodes[i].h, htMap.get(nodes[i].h) + 1);
				}
			} else {
				if (htMap.containsKey(nodes[i].h)) {
					if (htMap.get(nodes[i].h) == 1) {
						htMap.remove(nodes[i].h);
					} else {
						htMap.put(nodes[i].h, htMap.get(nodes[i].h) - 1);
					}
				}
			}
			if (htMap.isEmpty()) {
				pmMap.put(nodes[i].posi, 0);
			} else {
				pmMap.put(nodes[i].posi, htMap.lastKey());
			}
		}
		List<List<Integer>> res = new ArrayList<>();
		int start = 0;
		int height = 0;
		for (Entry<Integer, Integer> entry : pmMap.entrySet()) {
			int curPosition = entry.getKey();
			int curMaxHeight = entry.getValue();
			if (height != curMaxHeight) {
				if (height != 0) {
					List<Integer> newRecord = new ArrayList<Integer>();
					newRecord.add(start);
					newRecord.add(curPosition);
					newRecord.add(height);
					res.add(newRecord);
				}
				start = curPosition;
				height = curMaxHeight;
			}
		}
		return res;
	}

}
