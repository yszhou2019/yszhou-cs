[toc]



# 第一讲

## Part 1  时间复杂度

### 简单的例子理解时间复杂度

一个有序数组A，另一个无序数组B，打印B数组中不在A数组中的数，假设A长度N，B长度M

三种方法：

1. 遍历B数组，每遍历一次B，直接遍历一次A数组看看有没有**（暴力法  O(MN)）**

2. 遍历B数组，每遍历一次B，二分遍历一次A数组看看有没有**（二分查找  O(MlogN)）**

3. 先把B排序，这时两个数组均有序，然后利用双指针思想，开始均指向数组的头。A中的值==小于==B中的值，A指针自增（**说明当前B值在A值后方，有没有不知道**），A中的值==等于==B中的值，B指针自增（**说明当前B值在A中不输出，则直接找下一个，因为数组均排序，下一个数一定大，所以不存在漏找的情况**），中的值==大于==B中的值，输出B元素，B指针自增（**说明A中没有当前的B元素直接输出**） （**排序最好O(MlogM)+输出O(MN)   不一定比方法2好，分析N的值**）。合并有序数组merge

   ~~~c++
   void printUnionAWithoutUnionB(int a[], int b[], int m, int n) {
   	int a1 = 0, b1 = 0;
   	while (a1 < m && b1 < n) {
   		if (a[a1] < b[b1])
   			++a1;
   		else if (a[a1] == b[b1])
   			++b1;
   		else
   			cout << b[b1++] << " ";
   	}
   	while (b1 < n)
   		cout << b[b1++] << " ";
   }
   ~~~



## Part 2  对数器

对数器：比赛中debug用，样例过了，测试过不去

1. 有一个要测的方法a
2. 实现一个绝对正确复杂度无所谓的方法b，可以用自带的库等等暴力方法
3. 测试样本随机产生器，产生大量样本
4. ab方法结果比对，不对的样本打印一下看结果

**其实就是自己造样本测试**



## Part 3  归并排序

### 递归复杂度分析

下来介绍递归的复杂度，master公式：master公式仅仅适用于子问题规模相同的问题，不适用于子问题规模不同，比如不适用于$O(n)=O(\frac{n}{3})+O(\frac{2n}{3})+O(n)$

如果递归方程可以写成如下形式   $O(n)=a*O(\frac{n}{b})+O(n^{d})$，O(n^d)是在T(n)内部剩下操作的时间复杂度，a是发生的次数

1. $\log_b a>d$  ->  $O(n^{\log_b a})$ ：子问题数量多的时候，总复杂度取决于子问题数量
2. $\log_b a=d$  ->  $O(n^{d}*\log n)$   
3. $\log_b a<d$  ->  $O(n^{d}) $ ：剩余操作复杂度高的时候，总复杂度取决于剩余操作



### 各种排序

冒泡：从头到尾遍历，两两比较，每一次把最大的数放到最后，每次遍历的次数减一    **O(n^2)**

直接插入：遍历每个数，往前找第一个比他小的数，把他放在前面   **O(n^2)** ：扑克牌排序

选择：从后n个数中选择最小的放在当前遍历位置上    **O(n^2)**

归并排序：把数组分两半，左边排好序，右边排好序，然后用两个指针分别指示左右数组，两个有序数组进行合并，合并到另外一个size=n的数组中，合并完毕之后拷贝覆盖到原数组即可得到整体有序（填辅助数组，填完拷贝回去覆盖原数组）

​                   复杂度分析，size=n的数组进行排序，时间复杂度T(n)，两个子数组排序$2*T(n/2)$， 合并两个有序数组需要将指针滑过所有的元素，时间为O(n)，得到$O(n)=2*O(n/2)+O(n)$        复杂度为**O(nlogn)**，额外空间O(n)

```js
function MergeSort(arr) {
    if (arr == null || arr.length < 2) {
        return;
    }
    mergeSort(arr, 0, arr.length - 1);
}

function mergeSort(arr, left, right) {
    if (left == right) {
        return;
    }
    let mid = left + ((right - left) >> 1); //JS运算符优先级是个坑！加减乘除高于移位运算!
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}

function merge(arr, left, mid, right) {
    let helper = new Array(right - left + 1);
    let p1 = left, p2 = mid + 1;
    let i = 0;
    while (p1 <= mid && p2 <= right) {
        if (arr[p1] < arr[p2]) {
            helper[i++] = arr[p1++];
        } else if (arr[p1] > arr[p2]) {
            helper[i++] = arr[p2++];
        } else {
            helper[i++] = arr[p1++];//或者=arr[p2++] 取决于具体问题 例简单的例子思考即可
        }
    }
    while (p1 <= mid) {
        helper[i++] = arr[p1++];
    }
    while (p2 <= right) {
        helper[i++] = arr[p2++];
    }
    for (i = 0; i < helper.length; i++){
        arr[left + i] = helper[i]; // 这里需要拷贝到arr[left+i]中
    }
}
```









### 利用归并排序快速解决一个问题小和问题和逆序对问题

**小和问题**：一个数组中，当前数的小和是，数组左边所有比当前数要小的元素的和，对每个元素求小和，就是数组的小和，求数组小和

​                   输入：1，3，4，2，5

​                   输出：1+1+3+1+1+3+4+2=16

1. 暴力遍历，每个数都向左边遍历一次，求和     **O(n^2)  求数组每个数左边比它小的数的和**
2. 最小和概念 等价于 数组右侧大于number的元素个数 * number。归并排序**求每个数右边比它大的数的个数，乘这个数求和就完成了O(nlogn)**，归并排序的过程巧妙的契合这个过程。归并排序的核心就是合并操作，在两个半长数组合并时，首先两边的数组都排过序，当左边的数小于右边的数，就出现了小和，由于右边的数组排过序，所以右边有多少个数比左边大也知道，小和可计算，而且再进行合并的时候右边的数组和之前的不一样，所以不存在重复的情况。：merge过程中求小和？



**merge()过程中，arr[i]=arr[j]的情况，该将helper[i++]=arr[p1++]还是arr[p2++]中?**

merge()过程中的while，在统计过程中：

- 仅仅归并排序，哪个都行，因为while之后还有两个for
- 如果计算左侧的剩余长度(mid-p1+1)，那么合并到arr[p1++] (也就是移动左侧指针，否则，移动右侧数组指针，可能直接导致右侧数组越界，退出while循环)（比如计算mid-p1+1，那么）；
- 如果计算右侧剩余长度(right-p2+1)，那么合并到arr[p2++] 



**不要去记结论**，每道题利用merge()进行一些数据的统计的时候，需要**单独举个简单的例子思考思考当arr[i]==arr[j]的时候，helper[k++]=arr[i++]还是helper[k++]=arr[j++]**

~~~c++
void Merge(int a[], int l, int mid, int r, int& count) {
	int h = l, b = mid + 1, i = 0;
	int* help=new int[r - l + 1];//构造辅助数组
	while (h <= mid && b <= r) {
		if (a[h] <= a[b]) {
			help[i++] = a[h];
			count += a[h++] * (r - b + 1);//出现小和，计数
		}
		else 
			help[i++] = a[b++]; 
	}
	while (h <= mid)
		help[i++] = a[h++];
	while (b <= r)
		help[i++] = a[b++];
	for (int i = 0; i < r - l + 1; i++)
		a[l + i] = help[i];
	delete[]help;
}

void MergeSort(int a[], int l,int r,int &count) {
	if (l == r)
		return;
	int mid1 = l + ((r - l) >> 1);//防止mid溢出
	MergeSort(a, l, mid1, count);
	MergeSort(a, mid1 + 1, r, count);
	Merge(a, l, mid1, r, count);
}
~~~



### 逆序对问题

**逆序对问题**：一个数组中，左边的数比右边的数大，这两个数构成一个逆序对，打印所有逆序对。

1. 暴力遍历，每个数都向左边遍历一次，符合条件打印    **O(n^2)  **
2. 问题转化，**左边数比右边大，右边的数的右边打印即可    O(nlogn) **  归并排序

~~~c++
void Merge(int a[], int l, int mid, int r) {
	int h = l, b = mid + 1, i = 0;
	int* help=new int[r - l + 1];
	while (h <= mid && b <= r) {
		if (a[h] > a[b]) {
			for (int j = b; j <= r; ++j)
				cout << "(" << a[h] << "," << a[j] << ")" << endl;
			help[i++] = a[h++];
		}
		else 
			help[i++] = a[b++]; 
	}
	while (h <= mid)
		help[i++] = a[h++];
	while (b <= r)
		help[i++] = a[b++];
	for (int i = 0; i < r - l + 1; i++)
		a[l + i] = help[i];
	delete[]help;
}

void MergeSort(int a[], int l,int r) {
	if (l == r)
		return;
	int mid1 = l + ((r - l) >> 1);
	MergeSort(a, l, mid1);
	MergeSort(a, mid1 + 1, r);
	Merge(a, l, mid1, r);
}
~~~



纵观这两道利用mergeSort()的题目，思想都是，两个有序数组a和b，如果数组a中的一个数小于另外b的某元素`b[j]`时，那么这个a中的数，小于b中`b[j]`以及之后的所有数。

smallSum()，数组小和的定义，“左侧小于该值的所有元素的和” 等价于 “右侧大于该值的元素个数*该元素的值”。

逆序对，大的数出现在小的数的前面，逆序对数量=(mid-p1+1)。

这两道题的特点都是基于比较，利用归并排序的合并阶段，两个有序数组发生合并，如果前面的>后面的，那么前面的>后面所有的。



mergeSort为什么比冒泡 选择 插入要快？三者都是n^2，在比较的过程中，没有利用到之前比较的信息，**每趟扫描仅仅让一个元素正确归位**。归并排序，在归并的过程中，**利用了之前排序两个子数组得到的结果**，然后问题**转化成了合并两个有序数组**。

# 第二讲

## Part 1  改进快排

### 荷兰国旗问题

给定一个数组和一个数num，数组中小于num的数放在左边，等于num的数放在中间，大于num的数放在右边。要求**空间复杂度O(1)，时间复杂度O(n)**

有大有小要用**双指针，遍历数组一次**，当前数记为cur，小于区域指针low，大于区域指针high，low high指针全部指向小于区域和大于区域的最后一个元素

1. cur=num，cur++，low high不变
2. cur<num，首先交换low的下一个位置和cur，low++，cur++。这里分两种情况，1)没有等于区域，那么low++和cur是一个数，此时low++，cur++，小于区域扩充一个，遍历下一个。2)有等于区域，此时low++的元素=num，这时候交换到cur位置的元素=num，low++，cur++，小于区域扩充一个，cur位置元素=num，继续往前便利。
3. cur>num，首先交换high的下一个位置(与遍历的方向相反)，high++，cur**不变**。这里大于区域的前一个元素是待定的，所以换到cur的元素不确定大小，不能动，high扩充一个。
4. cur=high，遍历结束。

~~~c++
void Swap(int a[], int i, int j) {
	int temp = a[i];
	a[i] = a[j];
	a[j] = temp;
}

void Netherland(int a[], int L, int R, int num) {
	int cur = L, low = L - 1, high = R + 1;
	while (cur != high) {
		if (a[cur] == num)
			++cur;
		else if (a[cur] > num)
			Swap(a, cur, --high);
		else
			Swap(a, cur++, ++low);
	}
}
~~~



---

### 经典快排存在的问题

1. 每次只解决了一个位置的数，利用荷兰国旗问题就可以将数组中和每次指定的数相同的数位置全部确定，这样就加速了快排。由于荷兰国旗问题从low开始遍历，所以标志选择为数组最后一个数。
2. 考虑最差的情况，指定的标志是数组最大的数或者最小的数，排一次所有数都在标志的左边或者右边，这样快排的复杂度退化到了**O(n^2)**，所以我们每次不要取最后一个数或者第一个数作为标志，随机选一个。
3. 快排不稳定。

经典快排，partition选择数组最后一个元素，划分成【小于等于区域】【大于区域】（小于等于区域要求最后一个元素必须是x，也就是必须是pivot），然后对两个区域(小于等于区域不包括最后一个pivot)继续进行划分。**partition 时间O(n)，空间O(1)，但是做不到稳定性**



荷兰国旗，partition选择数组最后一个元素，划分【小于区域】【等于区域】【大于区域】，对【小于区域】【大于区域】继续进行划分。

**为什么比经典快排要快？**经典快排partition对【小于等于区域-最后一个pivot】【大于区域】进行划分；荷兰国旗对【小于区域】【大于区域】进行划分。两个划分子任务，**减少了小于区域的范围，也就是减少了划分的工作量**。

经典快排总拿最后一个数做pivot进行划分，考虑特殊情况比如有序数组，每次需要一个O(n)划分，仅划分出来最后一个元素，其他元素都在前面。整体数组需要O(n^2)。经典快排的效率和数据状况有关系。好的情况下，pivot在中间，【小于区域】【大于区域】都是n/2的长度，排序T(n)=2T(n/2)+划分partition的代价O(n)，根据master公式，总时间O(nlogn)



继续改进，pivot，随机快排，**随机选一个数[L, R]和最后一个数交换，用随机选择的数作为pivot**。

为什么快排是三个O(nlogn)中最快的？代码简单，意味着虽然O(nlogn)一样，但是常数项很小，因此随机快排最常用。

快排**额外空间O(logn)**,partition返回的左右边界用临时变量进行记录，二叉树的高度logn。最坏情况下，额外空间O(n)。也涉及到概率，长期期望额外空间是O(logn)

```js
// 荷兰国旗+随机选取pivot的快排
function QuickSort(arr) {
    if (arr == null || arr.length < 2) {
        return;
    }
    quickSort(arr, 0, arr.length - 1);
}


function quickSort(arr, L, R) {
    if (L < R) { // 如果partition划分之后没有小于区域，或者没有大于区域，那么不会进入if分支
        swap(arr, L + parseInt(Math.random() * (R - L + 1), R)); // 随机快排，随机选择作为pivot
        let p = partition(arr, L, R);
        quickSort(arr, L, p[0] - 1);
        quickSort(arr, p[1] + 1, R);
    }
}

/**
 * 
 * 根据荷兰国旗改进的partition算法，仍然默认选择最后一个元素作为num，将数组划分为三部分
 * 大于区域直接more=R，包括了最后一个元素X，X不参与遍历，最后直接归为，放入到等于区域的最后一个位置即可
 */
function partition(arr, L, R) {
    let less = L - 1;
    let more = R;
  	let cur = L;
    while (cur < more) {
        if (arr[cur] < arr[R]) {
            swap(arr, ++less, cur++);
        }
        else if (arr[cur] > arr[R]) {
            swap(arr, --more, cur);
        }
        else {
            cur++;
        }
    }
    swap(arr, more, R); // 注意这里，最后直接将X放入等于区域最后一个位置
    return [less + 1, more]; // 返回代表等于区域的边界
}
```





排序算法的稳定性，对于值相同的元素，排序后的相对顺序是否和排序前的相对顺序保持不变。（相同的值，相对次数会不会因为某个排序算法而被打乱）

O(n^2)的排序

- 冒泡排序，可以实现成稳定的（值相同，后边的值继续往下冒泡）
- 插入排序，可以实现成稳定的（前面形成有序区域，遇到值相同的元素，停下来，就是稳定的，继续向前放到前面，就是不稳定的）
- 选择排序，**做不成稳定的**（反例，[5,5,5,5,5,4,0,1]）

O(nlogn)的排序

- 归并排序，可以实现成稳定的（[3,3,4,6,5],[3,5,6,7,9]，**相同的元素优先拷贝左边的**，就能实现稳定性）
- **快速排序，做不到稳定性**（因为partition**随机选取pivot，不满足稳定性**，且和**左边区域或者右边区域交换，也不满足稳定性**）
- 堆排序，做不到稳定性（建堆的过程中会破坏稳定性，比如[4,4,4,5]建立大根堆，heapInsert添加5的时候，会和第二个4进行交换，破坏稳定性，其他操作可能也会）

剩下的还有桶排序，计数排序，基数排序

**稳定性的意义**

实际业务通常会要求稳定性，多个列名按照优先顺序进行排序，都希望上个步骤的排序信息能够留下来，这就是要求排序稳定性的意义。



## Part 2  快排与归并排序的一些异同

1. 数据量巨大，快排比归并快，快在常数项，归并的常数操作更多，常数时间长。
2. 归并稳定，快排不稳。
3. 归并空间复杂度**O(n)**，改进快排空间复杂度**O(logn)**，改进快排需要记录每次Partition的相等区域首尾地址，这是一个二分记录的过程，所以额外空间复杂度 logn
4. 工程中不用递归，递归需要记录大量的递归信息，所以复杂度太高



## Part 3  堆排序

堆调整算法：从根结点开始，直到叶子结点，看左右孩子和根是不是满足大/小顶堆，满足即可结束堆调整。不满足则交换根和左右孩子里面最大/最小的孩子，继续以左右孩子里面最大/最小的孩子为根重复以上过程。：**下滤**

建立堆：从最后一个非叶结点开始倒退遍历到整个树的根，从该结点为根进行堆调整：时间复杂度，log1+log2+...+logn=**O(n)，建堆线性时间**，建堆完毕，只保证了堆顶元素最大，不能保证数组有序

堆排序：建大根堆完毕之后，不断调整（堆顶和堆的最后一个元素交换，然后堆size-1，从堆顶进行一次下滤，直到堆size=0）取出堆顶放入后面

时间复杂度O(nlogn)，额外空间O(1)

- 堆结构建堆，添加heapInsert()，下滤heapify()
- 建堆过程时间O(n)
- 优先级队列，就是堆



优先队列的push pop

https://blog.csdn.net/weixin_43784288/article/details/91058358

push，在vector末尾追加元素，然后进行上滤

pop，从vector开头不断进行下滤（首先用最后的元素覆盖head）



基本概念：
满二叉树：最后一层都是叶节点，上一层的节点都有左右孩子
完全二叉树：最后一层的叶子节点从左到右，可能没有铺满最后一层



节点之间的关系：
任意一个节点i，父节点（在不越界的前提下）为$(i-1)/2$；左子节点（前提不越界）为$2*i+1$，右节点为$2*i+2$
大堆/小堆：树中，**任何一个子树的根**节点，都是该子树的最大/最小的节点

~~~c++
void HeapAdjust(int a[], int root, int length) {
	int temp = a[root];
	for (int i = 2 * root; i <= length; i *= 2) {
		if (i < length && a[i] < a[i + 1])//i<length保证当前根节点该有右孩子，2*i在左孩子
			++i;
		if (a[root] > a[i])//构成大顶就退出
			break;
		a[root] = a[i];
		root = i;
	}
	a[root] = temp;
}

void HeapSort(int a[], int length) {
	for (int i = length / 2; i > 0; --i)
		HeapAdjust(a, i, length);
	for (int i = length; i > 1; i--) {
		Swap(a, 1, i);
		HeapAdjust(a, 1, i - 1);
	}
}
~~~



**堆结构很重要**，调整堆**O(logn)**

O(n)时间数据流，中位数，

数组，较大的部分建立小根堆，较小的部分建立大根堆，两个堆顶之和/2就是中位数

添加一个元素，元素大于等于大根堆堆顶，添加到小根堆中；反之亦然。两个堆的长度相差超过1的时候，更长的堆弹出堆顶放入另外一个堆中。





## Part 4  工程中的排序方法

1. 大数据量元素类型为**基础类型，快排**，不需要考虑稳定性。元素类型为**自定义类型，需要稳定性，归并**；基础类型，相同值没有差异，区分不出来，不需要稳定性，所以用快排。
2. 数据量很小，直接用插入排序，速度更快。**常数项小**

"给定一个数组，奇数放左边，偶数放右边，且**要求原始相对次序不变**，能否给出时间O(n)，空间O(1)的算法"

01 stable sort，和快排的partition如出一辙，本身快排是**做不到保持稳定性**的，01 stable sort论文很难，是超纲内容，我虚心求教一下，面试官你是咋做到的



## Part 5  桶排序

### 桶排序(元素类型int)，不同于之前的各种排序(比较排序)

1. 桶的size给定，确定桶的个数，桶编号  $loc=(num-min)/bucketSize)$
2. 每个桶里面排序
3. 输出各个桶中元素



~~~c++
int BucketNum(int max, int min, int num, int length) {
	return (num - min) / length;
}

void BucketSort(int a[], const int length) {
	int  low = a[0], high = a[0], index = 0;
	vector<vector<int>> v(length + 1);
	for (int i = 1; i < length; ++i) {
		low = min(low, a[i]);
		high = max(high, a[i]);
	}
	for (int i = 0; i < length; ++i) {
		int num = BucketNum(high, low, a[i], length);//确定桶号
		v[num].push_back(a[i]);//进桶
	}
	for (int i = 0; i <= length; ++i) {//桶里面排序
		sort(v[i].begin(), v[i].end());
	}
	for (int i = 0; i <= length; ++i) {
		if (!v[i].empty()) {
			for (vector<int>::iterator it = v[i].begin(); it != v[i].end(); ++it) {
				a[index++] = *it;
			}
		}
	}
}
~~~



桶排序时间复杂度期望**O(n)**，尽量选更多的桶，桶里面元素尽量少。

桶排序，[给出例子](https://www.runoob.com/w3cnote/bucket-sort.html)，每个桶的size看情况，需要题目给出



桶排序是一个思想，计数排序，基数排序都是桶排序。桶排序，非基于比较的排序，和被排序的样本的实际数据状况有关，所以不常采用。

**桶排序的一个具体的例子就是计数排序**，精确到每个数用一个计数器，也就是一个桶（一个桶对应一个数）。

桶排序时间O(n)，额外空间O(n)，桶排序是稳定的排序（重塑原数组之后元素的相对次序没有发生变化）

---

### 利用桶排序的思想解决一个问题

给定一个无序数组，求排序后数组中相邻两个数的最大差值，要求时间复杂度**O(n)，**且不能使用{桶排序，计数排序，基数排序}

分析：如果用比较排序的话时间不可能这么快，采用桶的思想，求出最大值最小值，如果max=min直接返回0，否则，根据$loc=\frac{(num-min)}{(max-min)}*len$  准备length+1个桶，由于最小值在0号桶，最大值在max号桶，所以肯定有一个1~length-1号桶肯定有一个空桶。这样最大差值肯定不是一个桶内不同数的差值，因为空桶相邻的两个桶差值最小大于单个桶内差值的最大值。数据进每个桶，用max和min分别记录每个桶的最大值最小值，遍历每个桶更新桶间差值最大值，遍历一次即可求出答案

要做到O(n)的时间复杂度，考虑利用桶排序的思想，不过不是直接进行排序。
 假设arr的长度为n，我们准备n+1个桶，桶号 0 ~ n。对于arr中的任意一个数num，利用映射函数`(num - min) * n / (max - min)`将其映射到对应的桶中。通过这种映射，min会单独占据0号桶，max会单独占据n号桶，当把所有的n个数放进n+1个桶中，至少存在一个空桶。因此，**排序后的最大差值只可能来自某个非空桶中的最小值减去前一个非空桶中的最大值**。**否定了最大差值来自一个桶**，但是可不是说答案一定来自空桶两侧，最大差值可能是在空桶两侧，也可能是相邻的两个有数据的桶（**必然存在空桶，举个例子，桶的size=10，空桶两侧的最大差值至少是11，而一个桶内部的最大差值=9，因此，最大差值不可能来自一个桶内部**）（抽屉原理）

~~~c++
struct Bucket {
	int max;
	int min;
	bool isempty;
};

int BucketNum(int max, int min, int num, int length) {
	return ((num - min) * length) / (max - min);
}

int BucketFind(int a[], const int length) {
	int  low = a[0], high = a[0];
	for (int i = 1; i < length; ++i) {
		low = min(low, a[i]);
		high = max(high, a[i]);
	}
	if (high == low)
		return 0;
	else {
		vector<Bucket> v(length + 1);
		for (int i = 0; i <= length; ++i) {
			v[i].isempty = true;
		}
		for (int i = 0; i < length; ++i) {
			int num = BucketNum(high, low, a[i], length);
			if (v[num].isempty) {
				v[num].isempty = false;
				v[num].max = a[i];
				v[num].min = a[i];
			}
			else {
				v[num].max = max(v[num].max, a[i]);
				v[num].min = min(v[num].min, a[i]);
			}
		}
		int ans = 0, lastmax=v[0].max;
		for (int i = 1; i <= length; ++i) {
			if (!v[i].isempty) {
				ans = max(ans, v[i].min - lastmax);
				lastmax = v[i].max;
			}
		}
		return ans;
	}
}
~~~





# 第三讲

## Part 1  栈与队列

### 设计特殊的栈，push、pop、getmin操作全部O(1)

利用两个普通栈实现。除了数据栈还需要一个最小值栈保持和数组一样的高度，数据栈pop最小值栈pop，数据栈push最小值栈取出栈顶元素和进栈元素比较，较小的值进栈。这样不管何时**最小值栈的栈顶都是数据栈的最小值**

getmin()实际上就是辅助栈的peek()



---

### 仅用栈结构实现队列结构

用两个栈，一个a一个b，进队列就往a里面push，出队列就把a里面的数据全部倒入到b中，取stackB的栈顶就得到了出队列的数据，结束。

push()的实现，stack1仅负责push，直接push即可

pop()的实现，stack2仅负责pop，如果stack2空，那么将stack1中的所有倒入到2中，然后stack2执行一次pop即可

___



### 仅用队列机构实现栈结构

使用两个队列分别为help和data，进栈把数据push进data队列，退栈把data队列除队尾以外的数据出队列进help队列，最后一个数据出队列即为所求，之后交换help和data队列即可满足，每次进栈都进data队列

push的实现，直接push到data中即可

pop的实现，data中不断队首出队，进入help中，直到data剩余一个元素，出队并返回即可，然后data和help互换





## Part 3  矩阵问题

### 转圈打印矩阵

样例矩阵 **额外空间O(1)**

1 2 3 4
4 5 6 7                          打印：1 2 3 4 7 11 10 9 8 4 5 6
8 9 10 11

一次打印外边的一层数，递归往里面。处理边界即可。

注意细节，打印一圈时的退化情况，只打印一行，或者只打印一列。主循环，计算好边界的坐标，然后调用函数打印一次，然后重新计算坐标。只需要保证a<=c&&b<=d即可。两个都相等，可以视作一行或者一列，直接调用函数打印；一个相等一个不等，一行或者一列打印；两个不等，打印一圈。

~~~c++
void PrintNum(int** a, int uR, int uC, int dR, int dC) {
	if (uR == dR) {//只有一行
		for (int i = uC; i <= dC; ++i)
			cout << a[uR][i] << " ";
	}
	else if (uC == dC) {//只有一列
		for (int i = uR; i <= dR; ++i)
			cout << a[i][uC] << " ";
	}
	else {//打印四条边
		for (int i = uC; i < dC; ++i)
			cout << a[uR][i] << " ";
		for (int i = uR; i < dR; ++i)
			cout << a[i][dC] << " ";
		for (int i = dC; i > uC; --i)
			cout << a[dR][i] << " ";
		for (int i = dR; i > uR; --i)
			cout << a[i][uC] << " ";
	}
}

void LoopPrint(int** a, int height, int width) {
	int uR = 0, uC = 0, dR = height - 1, dC = width - 1;
	while (uR <= dR && uC <= dC) 
		PrintNum(a, uR++, uC++, dR--, dC--);
}

~~~

---

### 正方形矩阵旋转90度 额外空间O(1)

样例矩阵

输入    1 2 3                     输出     7 4 1
​            4 5 6                                 8 5 2
​            7 8 9                                 9 6 3

用转圈打印的方法，一次处理外边的一层，每次交换每条边上的四个数，递归进去。

注意细节，如果最后是2\*2矩阵，那么仍然需要旋转；如果最后是1\*1矩阵，也就是中间只有一个数，那么不需要旋转。主循环，计算好边界的坐标，然后调用函数打印一次，然后重新计算坐标。

~~~c++
void SwapLoop(int** a, int uR, int dR) {
	for (int i = uR; i < dR; ++i) {
		int temp = a[uR][i];
		a[uR][i] = a[dR + uR - i][uR];
		a[dR + uR - i][uR] = a[dR][dR + uR - i];
		a[dR][dR + uR - i] = a[i][dR];
		a[i][dR] = temp;//交换四条边上对应位置的四个数
	}
}

void rotateMatrix(int** a, int length) {
	int uR = 0, dR = length - 1;
	while (uR <= dR)
		SwapLoop(a, uR++, dR--);
}
~~~

---

### 蛇形打印矩阵    额外空间O(1)

输入    1 2 3                     输出    1 2 4 7 5 3 6 8 9 
​            4 5 6                                 
​            7 8 9                    

斜着一列一列打印，用bool变量表示从左下开始打印还是从右上开始打印。             

无视掉zigzag的时候从上到下还是从下到上，可以用bool控制方向，这个时候zigzag就成了一列一列打印。



---

### 矩阵找数  时间O(M+N)

给定一个矩阵行列均有序，线性时间内找数，找到返回true，否则返回false

输入    1 2 3          4              输出    true
​            4 5 6                                 
​            7 8 9          

从矩阵右上角开始倒着找，(i, j)<K，那么左边的一行就直接跳过，(i, j)>K，那么下面的一列就直接跳过。直到下标越界，返回false。或者找到返回true

O(M+N)的时间，额外空间O(1)，在有序矩阵中判断是否存在K。一道题目的最优解来自于题目给出的数据状况或者题目的问法

~~~c++
bool findmin(int** a, int height, int width, int num) {
	for (int j = width - 1; j >= 0; --j) {
		if (a[0][j] == num)
			return true;
		else if (a[0][j] > num)
			continue;
		else {
			for (int i = 1; i < height; ++i) {
				if (a[i][j] == num)
					return true;
				else if (a[i][j] < num)
					continue;
				else
					break;
			}
		}
	}
	return false;
}
~~~



## Part 4  链表问题

笔试过程中，链表问题直接做掉就行；面试过程中，需要根据面试官，时间复杂度仍然维持在O(n)，**空间最低**的要求来做

### 单链表回文

1. 用一个辅助栈，遍历一个链表，每个数进栈，之后再遍历一次链表，把栈倒出来比对。时间O(N)，空间O(N)

2. 要判断是不是回文，不用全部比较，只需要比较前半段和后半段。首先通过快慢指针，一个指针一次遍历一个结点，一个结点一次遍历两个结点，**通过慢指针确定链表中间结点**。将中间结点之后链表逆置，然后两边都向中间遍历，判断回文。判断结束，恢复逆置链表。时间O(N)，空间O(1)

快慢指针**确认中点，需要扣细节，区分奇数或者偶数个节点**。偶数个节点，慢指针刚好来到前一个1-2-2-1，来到第一个2这个位置，然后后面的逆序；奇数个节点，刚好来到中间。

这道题没办法，因为要节省空间，必须要修改原来的数据，最后恢复

```js

class Solution {
public:
    bool isPalindrome(ListNode* head) {
        if(head==nullptr||head->next==nullptr)return true;
        auto p=head;
        auto q=head;
        // 快慢找中点
        while(q&&q->next){
            p=p->next;
            q=q->next->next;
        }
        // [1,2,1] 则p是中点
        // [1,2,2,1] 则p是靠右的2
        // 2 反转p
        p=reverse(p);
        // 3 比对
        q=head;
        // 这里只需要考虑后半部分，根本不需要管head开始的情况，因为后半部分截止，循环就截止了
        while(p){
            if(p->val!=q->val)return false;
            p=p->next;
            q=q->next;
        }
        return true;
    }
    
    ListNode* reverse(ListNode* head){
        ListNode* prev=nullptr;
        while(head){
            auto next=head->next;
            head->next=prev;
            prev=head;
            head=next;
        }
        return prev;
    }
};
```



---

### 链表荷兰国旗

单链表给值，小于放左边，等于放中间，大于放右边。要求小于等于大于部分均和原链表中的数据顺序保持一致（**保持稳定性，且时间O(n)额外空间O(1)**）。eg.9->0->4->5->1，num=3，输出，0->1->9->4->5。其次空间O(1)，时间O(N)，不能把数据倒进数组然后荷兰国旗，没有稳定性。

分析：建6个变量，分别为小于等于大于区域的头尾，遍历链表，小于就连到小于区域，等于大于同理，最后把小于等于大于区域连起来即可。

一个大链表，拆成3个小链表，最后3个小链表首尾相连（注意可能某个链表或者某两个链表为空的情况）

~~~c++
void NetherlandLinkList(node* &head, int num) {
	node* lessStart = NULL, * moreStart = NULL, * equalStart = NULL;
	node* lessEnd = NULL, * moreEnd = NULL, * equalEnd = NULL;
	node* temp;
	while (head != NULL) {//把当前链表拆成三段
		temp = head->next;
		head->next = NULL;
		if (head->data == num) {//等于区域
			if (equalStart == NULL) {
				equalStart = head;
				equalEnd = head;
			}
			else {
				equalEnd->next = head;
				equalEnd = head;
			}
		}
		else if (head->data < num) {//小于区域
			if (lessStart == NULL) {
				lessStart = head;
				lessEnd = head;
			}
			else {
				lessEnd->next = head;
				lessEnd = head;
			}
		}
		else {
			if (moreStart == NULL) {//大于区域
				moreStart = head;
				moreEnd = head;
			}
			else {
				moreEnd->next = head;
				moreEnd = head;
			}
		}
		head = temp;
	}
	if (lessEnd == NULL) 
		head = equalStart;
	else {
		head = lessStart;
		lessEnd->next = equalStart;
	}
	if (equalEnd == NULL)
		lessEnd->next = moreStart;
	else
		equalEnd->next = moreStart;
}
~~~

```js
// 最后的连接逻辑
    // 考虑第一段是否存在
    if (lessTail == null) {
        // 第二段如果不存在，head=第二段
        head = equalHead;
    } else {
        // 如果存在，连接上第二段
        head = lessHead;
        lessTail.next = equalHead;
    }
    // 考虑第二段是否存在
    if (equalTail == null) {
        // 第二段如果不存在，需要考虑第一段是否存在
        if (head == null) {
            // 第一段如果不存在，head=第三段
            head = moreHead;
        } else {
            // 第一段如果存在，连接后面的
            lessTail.next = moreHead;
        }
    } else {
        // 第二段如果存在，直接连接后面的
        equalTail.next = moreHead;
    }
    return head;
```





### 带有rand指针的链表拷贝

1. 采用哈希表，**时间O(n)，额外空间O(n)**。哈希表中存放当前节点的内存<->新节点的内存。先遍历一遍，建立各个节点，存入哈希表中，第二遍遍历，勾连各个节点的next和rand，最后返回拷贝链表的head即可。

笔试过程中，给出这个程度的解法就够了

```js
var copyRandomList = function (head) {
    let map = new Map();
    map.set(null, null);
    let cur = head;
    while (cur != null) {
        map.set(cur, new Node(cur.val, null, null));
        cur = cur.next;
    }
    // cp random
    cur = head;
    while (cur != null) {
        map.get(cur).next = map.get(cur.next);
        map.get(cur).random = map.get(cur.random);
        cur = cur.next;
    }
    return map.get(head);
};
```



2. 不用哈希表。时间O(n)，额外空间O(1)的方法。比如1-2-3-null，创建为1-1'-2-2'-3-3'-null，也就是哈希表中原节点和拷贝节点之间的对应关系，这里通过原节点以及next来体现。第一遍建立，第二遍勾连（两个链表之间的rand不会互相干扰，但是此时老链表的next被修改，新链表的next也被修改），第三遍将整个链表分离成新老两个链表（将两个链表的next分开）即可。

```js
var copyRandomList = function (head) {
    // 时间O(n) 空间O(1)
    let cur = head;
    while (cur != null) {
        let next = cur.next;
        cur.next = new Node(cur.val, cur.next, null);
        cur = next;
    }
    // copy random
    cur = head;
    while (cur != null) {
        let next = cur.next.next;
        let cp = cur.next;
        cp.random = cur.random == null ? null : cur.random.next;
        cur = next;
    }
    // split
    cur = head;
    let res = cur == null ? null : head.next;
    while (cur != null) {
        let next = cur.next.next;
        let cp = cur.next;
        cp.next = next == null ? null : next.next;
        cur.next = next;
        cur = next;
    }
    return res;
};
```





---

### ==单链表相交==

两个单链表长度M,N是否相交，相交返回表交点。链表可有环可无环。要求时间O(M+N)，空间O(1)

1. 检查两个链表是否含有环，有的话返回入环结点，没有返回NULL。这里有两种办法
   1）从头遍历，每个节点放进hashset里面，之后每个结点进之前看看hashset里面有没有当前结点，有说明有环，返回第一个重复的结点；如果遍历到了NULL说明没有环。空间O(n)
   2）快慢指针，如果快指针走到NULL，无环；如果快慢指针相遇，有环。
   此时，快指针从头开始，慢指针从相遇位置开始，步调一致一次一个结点，再次**相遇地点即为入环结点**。
   证明：假设快指针每单位时间走2，慢指针每单位时间走1，非环部分长度R，环部分长度L，则快慢指针相遇，快指针比满指针多走k圈，慢指针在环上走的路程为kL-R，说明距离第k圈还差R距离，这时候每次一个结点，快慢指针会在入环结点相遇。
   
   
   
   
   
```js
// 获取一个单链表的入环节点，如果无环，返回null
function getLoopNode(head) {
    if (head == null || head.next == null || head.next.next == null) { // [这里需要特别注意！]至少要有两个节点才能构成环
        return null;
    }
    let n1 = head.next; // [一开始的位置需要注意] [这里需要特别注意！]
    let n2 = head.next.next;
    while (n1 != n2) {
        if (n2.next == null || n2.next.next == null) { // [这里需要特别注意！]
            return null; // 快指针到达null 直接返回false
        }
        n1 = n1.next;
        n2 = n2.next.next;
    }
    n2 = head; // 相遇之后，快指针回到开头，再次相遇，就是入环节点
    while (n1 != n2) {
        n1 = n1.next;
        n2 = n2.next;
    }
    return n1;
}
```

___


$$
2t  =t+kL\\
   t  =kL\\
   s=t-R=kL-R
$$

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210317223926.png" alt="20200215144853543" style="zoom: 67%;" />
    

2. 如果一个有环，一个无环，不相交。如果两个都无环，两个都遍历到底，看看最后一个结点是否相同，相同即相交，不同不相交。如果两个都有环，看两个链表入环结点是否相同，相同就是有环1，等同于无环2，终点为入环节点；入环接待你不同，在1的环里面循环一圈有没有2的入环结点，没有就是有环3，有就是有环2



第一个问题，怎么**判断单链表有环无环**（如果有环，返回第一个入环的节点）
第二个，怎么找到两个无环单链表的第一个相交的节点
第三个，怎么找到两个有环单链表的第一个相交的节点

第一个问题，

1. 采用**哈希set判断重复**，**空间O(n)**（hashset只包含key，hashmap包含了key和value，两个结构的增删改查都是O(1)）实际上就是用hashset判断是否有重复节点，如果最后到达null，那么就无环
2. 方法二，不用哈希表，**采用快慢指针，空间O(1)**，如果快指针遇到null，那么就无环；如果有环，快慢指针一定会在环上相遇。相遇的时候，快指针回到链表开头，两个指针每次都走一步，两者一定会在入环节点处相遇。（这是个**结论**）

第二个问题，**两个无环链表的第一个相交节点**

1. 采**用hashmap，查字典**，**空间O(n)**。第一个链表节点全部放入hashmap中，遍历第二个链表过程中，每个节点查找hashmap，如果查到，就说明这是第一个相交的节点
2. 方法二，分别遍历链表1和链表2，**获取两个链表的长度和尾节点**，**空间O(1)**。
   如果两个尾节点的内存地址不相等，两个链表不可能相交（单链表一个节点只有一个next后继，两个链表相交，交点后边的剩余链表必然完全重合，不可能两个单链表岔开）；
   如果相等，比如表1长度100，表2长度80，表1先走20步，然后表1表2一起走，一定会在首节点处相交。

第三个问题，链表有环，分情况

1. 一个链表有环，一个链表无环，不可能相交（单链表）
2. 两个链表都有环，有三种拓扑结构如下图，分别用case1（两个链表各自成环） case2 case3表示。用head1，loop1表示链表1的头结点和入环节点。head2，loop2.

	1. 如果loop1=loop2，也就是case2对应的情况，入环节点一样，转化成两个无环单链表相交，求首个相交的节点。
	2. 如果loop1!=loop2，包括case1 case3两种情况。让loop1旋转一圈直到回到loop1，如果旋转过程中发现节点=loop2，（遍历loop1判断环中是否存在节点=loop2）说明是case3，此时，相交节点可以是loop1也可以是loop2，都对；如果直到回到loop1，仍然没有节点=loop2，说明是case1，两个链表独立成环，不存在相交节点，返回空。

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210206183905.png" alt="image-20210206183857893" style="zoom:60%;" />



# 第四讲

## Part 0 树的信息体设计和递归

对于树的考察，要么考察**遍历**，要么考察**递归信息体设计和处理**





## Part 1  树的非递归遍历

二叉树的递归遍历，每个节点都会进入三次，这个顺序不会发生变化，只不过改变打印时机，就分出了先序中序后序。先序，第一次访问节点的时候打印；中序，第二次访问节点的时候打印；后序，第三次访问节点的时候打印

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210207014354.png" alt="image-20210207014354455" style="zoom:80%;" />





### ==前序==

**用栈**存结点，存入头结点，非空情况下，弹出节点并访问，**右孩子先进栈，左孩子再进栈**，这样取出来才是先左后右。

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210207014801.png" alt="image-20210207014801708" style="zoom:80%;" />

~~~c++
    vector<int> preorderTraversal(TreeNode* root) {
        if(root==nullptr)return {};
        vector<int> res;
        stack<TreeNode*>ss;
        ss.push(root);
        while(!ss.empty()){
            auto tt=ss.top();
            ss.pop();
            res.push_back(tt->val);
            if(tt->right)ss.push(tt->right);
            if(tt->left)ss.push(tt->left);
        }
        return res;
    }
~~~



---

### ==中序==

用一个栈实现非递归的中序遍历：不断进入左子树，到达null的时候也就是到达了最左边，开始弹出节点并访问，然后进入右子树

循环的前提条件是，栈中有节点还没有打印或者当前指针非空。如果栈为空，并且，指针为空，说明全部打印完毕；反之，栈有数据，指针为空，说明要进入右子树；栈空，指针非空，说明要进入左子树。
如果指针为空，那么弹出节点并打印，然后进入右子树；
如果指针非空，那么入栈，进入左子树；
最后打印的结果就是中序遍历的结果。

==中序遍历，stack一开始为空！不需要push(root)！==

**非递归中序遍历需要形象化记忆，比其他两个难！！**

（节点入栈，弹出，实际上一个节点访问了两次）

~~~c++
void inOrderUnRecur(BiTree T) {
	if (T == NULL)
		return;
	stack<BiTNode> s;
	while (!s.empty() || T != NULL) {
		if (T != NULL) {
			s.push(*T);
			T = T->lchild;
		}
		else {
			BiTNode* temp = &(s.top());
			s.pop();
			cout << temp->data << " ";
			T = temp->rchild;
		}
	}
}
~~~



---

### 后序

后序为左右中，先序为中左右，先序改变左右孩子进栈顺序即可改为中右左，把先序即将输出的数据放进辅助栈，结束以后依次打印栈里面的内容即可。

先序为中左右，可以**改造先序，为中右左**，然后打印的时候，先不打印，存入到栈中，最后从**栈中打印即可完成左右中**。（栈，是一种顺序的逆序）一共**用两个栈**

~~~c++
void posOrderUnRecur(BiTree T) {
	if (T == NULL)
		return;
	stack<BiTNode> a, help;
	a.push(*T);
	while (!a.empty()) {
		BiTNode* temp = &(a.top());
		a.pop();
		help.push(*temp);//先放进辅助栈
		if (temp->lchild != NULL)//左子先进保证中右左
			a.push(*temp->lchild);
		if (temp->rchild != NULL)
			a.push(*temp->rchild);
	}
	while (!help.empty()) {
		cout << help.top().data << " ";
		help.pop();
	}
}
~~~



---

## Part 2  求后继节点

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210207022449.png" alt="image-20210207022449556" style="zoom:80%;" />

二叉树结构增加parent指针，求一个函数，可以返回任意一个节点的中序后继结点。

暴力做法，给定的节点，不断parent，到达根节点，然后中序，找到后续。需要遍历整个二叉树，时间O(n)，空间O(h)

1. 该结点**有右孩子，找右子树最左边的结点**，就是后继节点
2. 该结点x没有右孩子，通过parent指针往树的上边找，父节点为p，x如果是p的左孩子，那么p就是所求后继节点；如果x不是p的左孩子，那么x往上，p往上。也就是找某个结点，作为其父亲的左孩子，其父亲即为所求（如果该节点没有右子树，那么该节点是某一个节点的左子树的最后一个节点，这里的某个节点，就是我们所求的后继节点）



相应的，一个节点的中序前驱节点

1. 左子树非空，那么前驱节点是，左子树的最右边的节点
2. 左子树为空，当前节点x，父节点p，直到x是p的右子树，此时p就是前驱节点



~~~c++
BiTNode* getNextNode_InOrder(BiTree T, BiTNode n) {
	if (n.rchild == NULL) {
		BiTNode* parent = n.parent, * child = &n;
		while (child != parent->lchild && parent != NULL) {
            //parent==NULL 说明遍历到树顶，没找到作为左孩子的父亲，说明给节点没有后继返回NULL
			child = parent;
			parent = parent->parent;
		}
		return parent;
	}
	else {
		BiTNode* temp = n.rchild;
		while (temp->lchild != NULL)
			temp = temp->lchild;
		return temp;
	}
}
~~~



### 二叉树的序列化和反序列化（有难度！不容易理解！）

关电脑，内存中的二叉树如何保存下来，以文件的形式记录下来，也就是序列化（持久化）。反序列化，就是文件中的内容还原为内存的树结构。哈希表的序列化和反序列化很简单，就是一趟遍历。

这里主要是树的序列化和反序列化。比如先序序列化和反序列化。中序和后序类似。

**先序序列化和重构**

[参考](https://leetcode-cn.com/problems/xu-lie-hua-er-cha-shu-lcof/solution/shou-hua-tu-jie-dfshe-bfsliang-chong-jie-fa-er-cha/)

```js
/**
 * Encodes a tree to a single string.
 *
 * @param {TreeNode} root
 * @return {string}
 */
var serialize = function (root) {
    if (root == null) return '#!';
    let left = serialize(root.left);
    let right = serialize(root.right);
    return `${root.val}!` + left + right;
};

/**
 * Decodes your encoded data to tree.
 *
 * @param {string} data
 * @return {TreeNode}
 */
var deserialize = function (data) {
    let values = data.split('!');
    values.pop();
    return help(values);
};


function help(list) {
    let temp = list.shift();
    if (temp == '#') {
        return null;
    }
    let head = new TreeNode(temp);
    head.left = help(list);
    head.right = help(list);
    return head;
}
/**
 * Your functions will be called as such:
 * deserialize(serialize(root));
 */
```



**层次的序列化和重构**

[参考](https://leetcode-cn.com/problems/xu-lie-hua-er-cha-shu-lcof/solution/ceng-xu-bian-li-si-lu-jiang-jie-javascriptshi-xian/)

```js
/**
 * Encodes a tree to a single string.
 *
 * @param {TreeNode} root
 * @return {string}
 */
var serialize = function (root) {
    if (root == null) {
        return '#!';
    }
    let res = '';
    let q = [root];
    while (q.length > 0) {
        let temp = q.shift();
        res += temp == null ? '#!' : `${temp.val}!`;
        if (temp != null) {
            q.push(temp.left);
            q.push(temp.right);
        }
    }
    console.log(res);
    return res;
};

/**
 * Decodes your encoded data to tree.
 *
 * @param {string} data
 * @return {TreeNode}
 */
var deserialize = function (data) {
    let values = data.split('!');
    values.pop();
    let head = getNode(values[0]);
    if (head == null) return null;
    let q = [head];
    values.shift();
    while (q.length > 0) {
        let temp = q.shift();
        let left = values.shift();
        if (left != '#') {
            temp.left = getNode(left);
            q.push(temp.left);
        }
        let right = values.shift();
        if (right != '#') {
            temp.right = getNode(right);
            q.push(temp.right);
        }
    }
    return head;
};

function getNode(val) {
    if (val == '#') {
        return null;
    }
    return new TreeNode(Number.parseInt(val));
}
```





首先将字符串分割出各个节点，然后所有节点都还原成Node，

---

## Part 3  判断树的结构

### 判断平衡二叉树

递归左右孩子，递归返回两个值，一个是子树的高度，另一个是子树是否平衡，通过返回值判断平衡
对于树中的**任意一个节点，左右子树高度差均不超过1**，才是平衡二叉树，否则不是。
**设计所需要的信息，作为递归函数返回值的类型**，加上一个入口函数




---

### ==判断搜索二叉树==

通常来讲，BST（左子树小，右子树大）不包含重复节点，重复的节点信息可以用同一个节点的list来保存。

判断只需要确保中序遍历是升序的

解法一，递归中序遍历，用辅助栈保存遍历结果，然后二次遍历判断升序即可。时间O(n) 空间O(n) 每个节点遍历两边
解法二，递归设置信息体（是否是BST，当前树的最大val，当前树的最小val）
解法三，非递归中序遍历，时间O(n)，空间O(h)，每个节点遍历一遍，只要发现pre.val大于cur.val，直接false

1. **设置递归信息体**，**时间O(n)，空间O(h)**，两个孩子都是BST，并且~~root.val>left.val, root.val<right.val~~（纠正：root.val>左子树的maxval，root.val<右子树的minval），那么就是BST；否则不是

```js
// 错误写法 给出错误样例，比如左子树的最右节点大于根节点，错误sln仍然会判断是BST，实际上不是
// 递归版判断是不是搜索二叉树
function isBST1(head) {
    if (head == null) {
        return true;
    }
    let left = isBST1(head.left);
    let right = isBST1(head.right);
    if (left && right) {
        let ret1 = head.left == null ? true : head.value > head.left.value; // 错误！
        let ret2 = head.right == null ? true : head.value < head.right.value; // 错误！实际上应当判断root.val>left.max root.val<right.min
        return ret1 && ret2;
    }
    return false;
}

/**
 * 递归版本，判断BST的正确做法
 */
function isBST2(head) {
    return rec(head).isBST;
}

function rec(head) {
    if (head == null) {
        return new RET(true, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
    }
    let left = rec(head.left);
    let right = rec(head.right);
    if (left.isBST && right.isBST && head.value > left.max && head.value < right.min) { // root.val>left.max && root.val<right.min才能说明是BST
        return new RET(true, Math.max(head.value, left.max, right.max), Math.min(head.value, left.min, right.min));
    }
    return new RET(false, Math.max(head.value, left.max, right.max), Math.min(head.value, left.min, right.min));
}
```



2. **非递归中序遍历**，只要不是升序，返回错误 **时间O(n)，空间O(h)**

```js
// 非递归中序判断是不是BST
// 非递归中序：先进入最左边，如果cur非空，进入左子树并入栈；cur为空，弹出并访问，进入右子树
/**
 * 非递归版中序遍历
 * 时间O(n)，空间O(h)，每个节点只遍历一遍！
 * 左侧链方式打印，额外用到一个栈
 * - 当前节点的非空，当前节点入栈，进入lchild
 * - 当前节点的为空，栈中弹出节点并打印，然后当前节点进入弹出节点的rchild中
 */
function isBST3(head) {
    if (head == null) {
        return true;
    }
    let stack = [];
    let preVal = Number.MIN_SAFE_INTEGER;
    let cur = head;
    while (stack.length > 0 || cur != null) { // 不能仅仅是cur!=null，比如进入某个子树的右节点，为空，但是stack中仍然有数据 cur非空针对的是最后一个节点，此时lchild为空，栈空，但是应当继续判断当前节点是否为空
        if (cur != null) { // 当前节点非空，入栈，进入左侧链
            stack.push(cur);
            cur = cur.left;
        } else {
            let temp = stack.pop(); // 弹出并打印，进入右节点
            if (preVal > temp.value) {
                return false;
            }
            preVal = temp.value; // 记录前一个节点的val
            cur = temp.right;
        }
    }
    return true;
}
```





---

### 判断完全二叉树

判断逻辑，二叉树按层遍历

**层次遍历**，三种情况：1）左右孩子都有，继续遍历。2）左孩子没有，右孩子有，不是完全二叉树。3）左孩子有右孩子没有或者左右孩子都没有，则接下来遍历的结点都是叶子结点，否则不是。

```js

class Solution {
public:
    bool isCompleteTree(TreeNode* root) {
        if(root==nullptr)return true;
        queue<TreeNode*>qq; // 队列 层次遍历
        bool leaf=false;
        qq.push(root);
        while(!qq.empty()){
            auto tt=qq.front();
            qq.pop();
            auto l=tt->left;
            auto r=tt->right;
          // 开启叶子节点后只要非空 或者说l空r非空 一定不是CBT
            if((l==nullptr && r!=nullptr) || (leaf && (l||r)))return false;
          // r空则开启叶子节点验证
            if(r==nullptr)leaf=true;
            if(l)qq.push(l);
            if(r)qq.push(r);
        }
        return true;
    }
};
```

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210314195021.png" alt="image-20210314195021293" style="zoom:80%;" />



## Part 4  完全二叉树CBT求结点数

要求时间复杂度小于`O(N)`

利用：满二叉树高度为L，那么节点个数=2^L-1

根节点是x，左子树的高度l，右子树的高度h
如果h=l，说明左子树满，用公式计算左子树的个数+根节点+...，x=x.right
如果h>l，说明右子树满，计算右子树的个数+根节点+...，x=x.left

递归和非递归，总体时间复杂度都是(logn)^2
根据左侧链获取CBT的高度，代价logn

非递归中，while的cur一共循环logn次，每次内部的移动获取高度为logn，因此一共为(logn)^2（类比1累加到n，总和为n^2）

~~~c++

class Solution {
public:
    int countNodes(TreeNode* root) {
        if(root==nullptr)return 0;
        auto cur=root;
        int res=0;
        while(cur){
            auto l=countDepth(cur->left);
            auto r=countDepth(cur->right);
            if(l==r){
                res+=1<<l;
                cur=cur->right;
            }else{
                res+=1<<r;
                cur=cur->left;
            }
        }
        return res;
    }

    int countDepth(TreeNode* root) {
        if(root==nullptr)return 0;
        int depth=0;
        while(root){
            depth++;
            root=root->left;
        }
        return depth;
    }
};
~~~



### 二叉树分层遍历

用一个队列，保存广度优先队列
用两个引用，last标记本行的结束节点，nlast标记下一行的结束节点
nlast的更新逻辑：广度优先遍历中，弹出节点的子节点非空，则会入队列，入队列的时候记录nlast
last的更新逻辑：当temp=last，代表本行遍历结束，此时将curLevel数组保存到res中。如果队列中仍然有数据，说明没有遍历完毕，则更新last=nlast

```js
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
          // 更新本行的结尾节点
            last = nLast;
        }
    }
    return res;
}
```





### 二叉树ZigZag遍历



```js
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
```



### 求二叉树中的最大BST的大小

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210312214710.png" alt="image-20210312214709600" style="zoom:80%;" />



为什么需要收集子树的max和min？
原因在于BST，不是说root.val < **root.right.val** root.val > **root.left.val** 就是BST了，
而是说，root.val < **右子树的 min**，root.val > **左子树的max**，**这样才是BST**。

3种可能
1，两个child都空
2，一个child空
3，有两个child

为了应对3种可能，需要收集6个信息

信息1，左树的最大BST的size
信息2，右树的最大BST的size
信息3，左树的最大BST的根节点（为了应对第三种情况，整个树是BST）
信息4，右树的最大BST的根节点
信息5，左树的最大值
信息6，右树的最小值

整合出一个结构，左搜和右搜
信息1，无论左还是右，最大BST的size
信息2，最大BST的root
信息3，这个子树的max和min（不是最大BST的max和min）



1. **列举可能性**
2. 设计需要收集的信息
3. 在左树和右树收集信息，然后在当前节点对信息进行整理，返回给上层，**处理base case填写的信息**



### ==二叉树中的最大距离==

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210313001428.png" alt="image-20210313001428803" style="zoom:80%;" />

可能性：

1. 最大距离来自左子树
2. 来自右子树
3. 最大距离经过root，这种情况下的最大距离，左子树距离root最远的节点，也就是root到最底层的深度，右子树到最底层的深度（左树，右树和root的配合）

```js
class ReturnType{
    constructor(maxD, h) {
        this.maxD = maxD;
        this.h = h;
    }
}

// 情况1和情况2，maxD来自左or右
// 情况3，maxD=root+左最大深度+右最大深度
function process(head) {
    if (head == null) {
        return new ReturnType(0, 0);
    }
    let leftinfo = process(head.left);
    let rightinfo = process(head.right);
    let maxD = 1 + leftinfo.h + rightinfo.h;
    return new ReturnType(Math.max(maxD, leftinfo.maxD, rightinfo.maxD), 1 + Math.max(leftinfo.h, rightinfo.h));
}
```



### 公司气氛



<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210313003817.png" alt="image-20210313003817740" style="zoom: 50%;" />

```js
class Node{
    constructor(huo) {
        this.huo = huo;
        this.nexts = [];
    }
}

class ReturnType{
    constructor(l,b) {
        this.lai_huo = l;
        this.bulai_huo = b;
    }
}

function MaxHappy(head) {
    let ret = process(head);
    return Math.max(ret.lai_huo, ret.bulai_huo);
}

function process(head) {
    let lai_huo = head.huo;
    let bulai_huo = 0;
    for (let i = 0; i < head.nexts; i++){
        let ret = process(head.nexts[i]);
        // 所有的子树解决完了，搜集完子的信息，整理出父的信息交给上层
        lai_huo += ret.bulai_huo;
        bulai_huo += Math.max(ret.lai_huo, ret.bulai_huo);
    }
    return new ReturnType(lai_huo, bulai_huo);

}
```




# 第五讲

## Part 1  哈希函数与哈希表

经典哈希函数性质：

1. 输入域无穷，输出域有穷
2. 输入相同，输出一定相同
3. 不同输入可能对应相同输出
4. 输入量足够多时，输出会在值域内均匀分布，非常重要
5. 大样本经过哈希函数计算的值模m之后得到的值在[0-m]内仍然均匀分布
6. 哈希函数之间相互独立，线性组合后仍然为哈希函数。哈希函数得出的哈希值每一位相互独立

经典哈希表，表每个位置都是一个单链表，增删改查时间O(1)。给一个k,v，先根据k计算hashcode，然后hashcode%size，然后k,v存入对应的idx中

哈希表扩容，size发生变化，需要rehash



经典哈希的应用：处理**大数据问题**。分配多少台机器？用哈希函数来分流。**hashCode%机器的数量**。然后存入hashSet中。大数据的题，大多数都牵涉到哈希，大任务化小任务。**相同输入导致相同输出，不同输入均匀分布**。

现在有100TB字符串文件，把它输出所有重复，有m台机器来处理，这时候应该如何分配？利用哈希函数计算然后模m，值是多少就用哪台机器处理。因为哈希函数具有值域均匀分布的特点，所以m台机器的任务量基本相同保证了负载平衡。因为**输入相同，输出相同，所以相同的字符串哈希值一定相同，相同的字符串一定由同一台机器处理**，这样就解决了重复问题。如果每台机器任务量仍然过大，可以继续哈希，继续缩小任务量。

**小练习**：设计RandomPool结构，insert(key)，delete(key)，getRandom(key)，时间复杂度要求O(1)，getRandom等概率返回结构中的任何一个key
分析：这道题主要考虑如何等概率返回，insert的时候加一个时间戳，记录个数size，getRandom的时候利用产生随机数0-size，用hashmap，但是需要返回key，产生随机数是value，所以返回去找时间就不是O(1)了，所以要再建一个辅助表，size作为key，输入作为value，这样随机数之后，O(1)就能找到相应的key。接下来考虑delete，删除一个后，0-size中间会有洞，就不能等概率了，所以把最后一个key换到删除的key处，size--，保证结构稳定性。

连续的区间，删除的时候产生洞，等效于，将最后一个填回去，删除最后一个，并且区间连续性得以保证

~~~c++
class RandomPool {
private:
	unordered_map<string, int> mapMain;
	unordered_map<int, string> mapHelp;
	int size;
public:
	RandomPool() {
		size = 0;
	}

	void insert(string key) {
		mapMain.insert({ key, size });
		mapHelp.insert({ size, key });
		++size;
	}

	void deleteKey(string key) {
		if (size == 0)
			return;
		if (mapMain.find(key) != mapMain.end()) {
			int deleteIndex = mapMain.find(key)->second;
			string lastString = mapHelp.find(size - 1)->second;

			mapMain[lastString] = deleteIndex; 
			mapMain.erase(key);

			mapHelp[deleteIndex] = lastString;
			mapHelp.erase(--size);
		}
	}

	string getRandom() {
		if (size == 0)
			return "No string";
		int index = rand() % size;
		return mapHelp.find(index)->second;
	}

	void print() {
		unordered_map <string, int>::iterator it1 = mapMain.begin();
		unordered_map <int, string>::iterator it2 = mapHelp.begin();
		cout << "mapMain:" << endl;
		for (; it1 != mapMain.end(); ++it1)
			cout << "<" << it1->first << "," << it1->second << ">" << endl;
		cout << "mapHelp:" << endl;
		for (; it2 != mapHelp.end(); ++it2)
			cout << "<" << it2->first << "," << it2->second << ">" << endl;
		cout << size << endl;
	}
};
~~~



---

## Part 2  布隆过滤器

本质上布隆过滤器是一种数据结构，比较巧妙的概率型数据结构，特点是高效地插入和查询，可以用来告诉你 “某样东西一定不存在或者可能存在”。相比于传统的 List、Set、Map 等数据结构，它更高效、占用空间更少，但是缺点是其返回的结果是概率性的，而不是确切的。

布隆过滤器有失误率，黑名单上的一定会true，但是可能会非黑名单上的也返回true，这就是失误率

- 用哈希表分流到多台机器上
- 如果没有多台机器，那么，是否允许判断出现失误率。优点，**节省空间，可以在一台机器上处理大数据任务；查询速度O(1)**。

url经过k个hash函数得到多个hashcode，idx=hashcode%m，将对应的idx位置涂黑。全部的url填完之后，查询，新来一个url，多个hashcode对应的idx如果都是黑的，说明是黑名单中的（存在误判概率）；只要有一个不是黑的，必然不是黑名单中的。

数组开的越小，误判率越高，比如数组最后全黑，url判断结果都是黑名单。

数组大小，取决于预期失误率，hash函数的个数



**百亿黑名单的判断——百亿黑名单的设计系统**

举个例子，现在搜索引擎有100亿个url黑名单，总共640G空间，现在我们怎么存储黑名单，保证增删改查时间O(1)，哈希表符合但是需要的空间太大了。这时候布隆过滤器就出现了。
布隆过滤器是bit数组，每一位值为0/1，bit数组用int[1000]（表示32000个bit的bit数组），long long\[1000\]（表示64000000bit的bit数组，假设准备一个**长度m**的bit数组，初始值全为0。接下来准备k个哈希函数相互独立，每个url通过**k个哈希函数**计算哈希值模m，值是多少，bit数组相应位置置1。这样结束以后，得到的bit数组即为布隆过滤器，以后来一个url就k次哈希看看这些bit位上是不是已经置1了，有一个没有置1，说明它不是黑名单。当然全部k个哈希都置1，也不能说明这个url就是黑名单，只能说可能，这就是布隆过滤器的失误，有个**失误率即为p**。**宁可错杀一千也不放过一个**

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210317221247.jpg" alt="2785001-12449becdb038afd" style="zoom:80%;" />

__

![2785001-802577f6332d76b4](https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210317221256.jpg)

_

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210317221305.jpeg" style="zoom:80%;" />

**布隆过滤器参数的确定**

接下来介绍，m、p、k等值怎么选，n样本量，p预期失误率，m表示开多大的**bit数组**

- 公式一：布隆过滤器开多大bit，取决于样本量和预期失误率；除以8之后，得到所需字节
- 公式二：计算哈希函数的个数，最后向上取整。如果给了20GB的空间，我们只需要16GB的空间，那么我们可以调大我们的空间，调得越大，最后的失误率越低。
- 公式三：计算调整空间m和哈希函数个数对应的真实失误率。

$$
公式一：（确定bit数组的长度）m=-\frac{n*\ln p}{(\ln2)^2}\\
公式二：（确定hash函数的个数）k=\ln2\frac{m}{n}\\
公式三：（根据所开空间和hash函数的个数，计算真实失误率）p=(1-e^{-\frac{n*k}{m}})^k
$$
经过这样的计算，原来640G的空间现在只需要16G，布隆过滤器十分实用。

布隆过滤器 - 如何在100个亿URL中快速判断某URL是否存在？
哈希表空间不足，存储需要640G，考虑到装填因子，如果10%，那么就需要6400G的内存
如果面试官问你如何在海量数据中快速判断该 url 是否在黑名单中时，你应该回答使用布隆过滤器进行处理，然后说明一下为什么不使用 hash 和 bitmap，以及布隆过滤器的基本原理，最后你再谈谈它的使用场景那就更好了
**位图法的所占空间随集合内最大元素的增大而增大**。这就会带来一个问题，如果查找的元素数量少但其中某个元素的值很大，比如数字范围是 1 到 1000 亿，那消耗的空间不容乐观。这个就是位图的一个不容忽视的**缺点**：**空间复杂度随集合内最大元素增大而线性增大**。对于开头的题目而言，使用位图进行处理，实际上内存消耗也是不少的。bitmap占用空间不取决于数据的数量，而是取数据数据的范围（也就是数据的值的大小）**不是纯数字的，不建议采用位图法**
https://www.cnblogs.com/kyoner/p/11109536.html



bitmap-如何判断某个整数是否存在40亿个整数中？
bitmap，一个数对应一个bit，2^32次方个bit即可，大概500MB
https://www.cnblogs.com/kyoner/p/11129477.html



10亿个数中找出最大的10000个数（top K问题）
基本思路：
建立size=10000的小根堆，然后剩余所有的数字都遍历一遍。如果数值大于堆顶，那么弹出堆顶，添加并维护（数值小于等于堆顶，则跳过）。m=10000，n=10亿，m<<n，建堆时间O(m)，维护时间O(n\*logm)，整体时间O(n\*logm)，空间O(m)
分治：
分散到1000个文件中，每个文件数据量为10^6，从10^6个数据中找出前10000个最大的数值。然后再将这1000组TOPK合并起来，再次进行，也就是在10^7找TOPK，或者继续分治（也可以用快排的partition）
如果数字有重复，并且要求TOPK不重复，那么需要哈希到不同的文件中，然后再去重，然后分治。

十亿整数（随机生成，可重复）中出现频率最高的一千个



实际运行：
        实际上，最优的解决方案应该是最符合实际设计需求的方案，在时间应用中，可能有足够大的内存，那么直接将数据扔到内存中一次性处理即可，也可能机器有多个核，这样可以采用多线程处理整个数据集。

（1）单机+单核+足够大内存
        如果需要查找10亿个查询次（每个占8B）中出现频率最高的10个，考虑到每个查询词占8B，则10亿个查询次所需的内存大约是10^9 * 8B=8GB内存。如果有这么大内存，直接在内存中对查询次进行排序，顺序遍历找出10个出现频率最大的即可。这种方法简单快速，使用。然后，也可以先用HashMap求出每个词出现的频率，然后求出频率最大的10个词。

（2）单机+多核+足够大内存
        这时可以直接在内存总使用Hash方法将数据划分成n个partition，每个partition交给一个线程处理，线程的处理逻辑同（1）类似，最后一个线程将结果归并。

        该方法存在一个瓶颈会明显影响效率，即数据倾斜。每个线程的处理速度可能不同，快的线程需要等待慢的线程，最终的处理速度取决于慢的线程。而针对此问题，解决的方法是，将数据划分成c×n个partition（c>1），每个线程处理完当前partition后主动取下一个partition继续处理，知道所有数据处理完毕，最后由一个线程进行归并。

（3）单机+单核+受限内存
        这种情况下，需要将原数据文件切割成一个一个小文件，如次啊用hash(x)%M，将原文件中的数据切割成M小文件，如果小文件仍大于内存大小，继续采用Hash的方法对数据文件进行分割，知道每个小文件小于内存大小，这样每个文件可放到内存中处理。采用（1）的方法依次处理每个小文件。

（4）多机+受限内存
        这种情况，为了合理利用多台机器的资源，可将数据分发到多台机器上，每台机器采用（3）中的策略解决本地的数据。可采用hash+socket方法进行数据分发。


        从实际应用的角度考虑，（1）（2）（3）（4）方案并不可行，因为在大规模数据处理环境下，作业效率并不是首要考虑的问题，算法的扩展性和容错性才是首要考虑的。算法应该具有良好的扩展性，以便数据量进一步加大（随着业务的发展，数据量加大是必然的）时，在不修改算法框架的前提下，可达到近似的线性比；算法应该具有容错性，即当前某个文件处理失败后，能自动将其交给另外一个线程继续处理，而不是从头开始处理。
    
        top K问题很适合采用MapReduce框架解决，用户只需编写一个Map函数和两个Reduce 函数，然后提交到Hadoop（采用Mapchain和Reducechain）上即可解决该问题。具体而言，就是首先根据数据值或者把数据hash(MD5)后的值按照范围划分到不同的机器上，最好可以让数据划分后一次读入内存，这样不同的机器负责处理不同的数值范围，实际上就是Map。得到结果后，各个机器只需拿出各自出现次数最多的前N个数据，然后汇总，选出所有的数据中出现次数最多的前N个数据，这实际上就是Reduce过程。对于Map函数，采用Hash算法，将Hash值相同的数据交给同一个Reduce task；对于第一个Reduce函数，采用HashMap统计出每个词出现的频率，对于第二个Reduce 函数，统计所有Reduce task，输出数据中的top K即可。
    为什么要采用哈希来分散数据？直接暴力分散，无法保证多个相同的数值分散到同一台机器或者同一个文件上，而hash可以保证。

以下是一些经常被提及的该类问题。
（1）有10000000个记录，这些查询串的重复度比较高，如果除去重复后，不超过3000000个。一个查询串的重复度越高，说明查询它的用户越多，也就是越热门。请统计最热门的10个查询串，要求使用的内存不能超过1GB。

（2）有10个文件，每个文件1GB，每个文件的每一行存放的都是用户的query，每个文件的query都可能重复。按照query的频度排序。



频率最大的TOPK：

（3）有一个1GB大小的文件，里面的每一行是一个词，词的大小不超过16个字节，内存限制大小是1MB。返回频数最高的100个词。
（4）提取某日访问网站次数最多的那个IP。
（5）10亿个整数找出重复次数最多的100个整数。
（6）搜索的输入信息是一个字符串，统计300万条输入信息中最热门的前10条，每次输入的一个字符串为不超过255B，内存使用只有1GB。
（7）有1000万个身份证号以及他们对应的数据，身份证号可能重复，找出出现次数最多的身份证号。



重复问题（去重）
        在海量数据中查找出重复出现的元素或者去除重复出现的元素也是常考的问题。针对此类问题，一般可以通过位图法实现。例如，已知某个文件内包含一些电话号码，每个号码为8位数字，统计不同号码的个数。

```
    本题最好的解决方法是通过使用位图法来实现。8位整数可以表示的最大十进制数值为99999999。如果每个数字对应于位图中一个bit位，那么存储8位整数大约需要99MB。因为1B=8bit，所以99Mbit折合成内存为99/8=12.375MB的内存，即可以只用12.375MB的内存表示所有的8位数电话号码的内容。
```



是否存在（黑名单问题）
布隆过滤器


原文链接：https://blog.csdn.net/zyq522376829/article/details/47686867



---

## Part 3  一致性哈希

**经典服务器抗压结构**

一个url之类的key，经过hash函数得到hashcode，%服务器个数，然后存入到对应的服务器中。

经典服务器抗压的缺陷在于，**扩容/缩容难，加机器减机器代价太高**。需要全部rehash，所有数据都需要迁移



**一致性哈希**

若干服务器的ip经过hash放到一个环上，后续的请求经过hash得到hashcode，通过二分查找获取最近的>=请求hashcode的服务器hash(ip)（也就是顺时针查找），然后将添加key value或者查询key的请求发送到这台机器。

**顺时针查找的实际实现**

所有的后端服务器ip经过hash后，**升序排序得到数组**。每个前端服务器上，都保存这个数组。然后**二分查找大于hash(请求)的服务器， 然后将请求分配给对应的服务器**即可。

**一致性哈希解决了什么问题，还存在什么问题**

降低了加机器减机器导致的数据迁移的代价。但是**机器数量少的情况下，环可能不会均匀分配，导致机器的负载不均衡**。



一致性哈希解决了增加删除等工作负载平衡的问题。
首先一堆任务有m台机器处理，通过哈希函数我们能做到任务均匀分布到每台机器。但是这时候出现了一个问题，如果有一台机器坏了或者要增加一台机器，那么之前所有已经计算好的哈希值都要重新计算一次，这就增加了很多的工作量，所以引入一致性哈希。

引入**环形Hash空间**：按照常用的hash算法来将对应的key哈希到一个具有2^32次方个桶的空间中，即0~(2^32)-1的数字空间中。现在我们可以将这些数字头尾相连，想象成一个闭合的环形。如下图

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210317221122.png" alt="20140411000507734" style="zoom:80%;" />

**把数据通过一定的hash算法处理后映射到环上**：将object1、object2、object3、object4四个对象通过特定的Hash函数计算出对应的key值，然后散列到Hash环上。如下图：

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210317221148.png" alt="20140411000620656" style="zoom:80%;" />

**将机器通过hash算法映射到环上**：在采用一致性哈希算法的分布式集群中将新的机器加入，其原理是通过使用与对象存储一样的Hash算法将机器也映射到环中（一般情况下对机器的hash计算是采用机器的IP或者机器唯一的别名作为输入值）假设现在有NODE1，NODE2，NODE3三台机器，通过Hash算法得到对应的KEY值，映射到环中

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210317221203.png" alt="20140411000853609" style="zoom:80%;" />

接下来，每个任务的哈希值去找顺时针方向上最小第一个机器哈希值，就实现了任务分配，增加减少机器，只需要再哈希环上去掉相应机器的哈希值，任务仍然按照顺时针去找机器。但是这样的话还存在问题，由于哈希的随机性，负载平衡不能保证了。每台机器不能保证把哈希环均分，无法保证负载平衡。

![img](https://img-blog.csdn.net/20140411001033656?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvY3l3b3Nw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

**虚拟节点技术**

**为了解决什么问题**

解决一致性哈希中，**初期服务器少，服务器负载不均衡**的问题。

**如何实现**

每台服务器，分配1000个虚拟节点，虚拟节点有自己的ip，然后将虚拟ip放入到环中。用虚拟节点去分配请求。添加或者删除服务器的时候，添加1000个或者删除1000个对应的虚拟节点。这样就可以在**保持低代价数据迁移的基础上，保证了服务器数量少的情况下，实现了服务器的负载均衡**



集群抗压力的都进行了一致性哈希改造

一致性Hash算法引入了**虚拟节点机制**，即对每一个服务节点计算多个哈希，每个计算结果位置都放置一个此服务节点，称为虚拟节点。具体做法可以在服务器IP或主机名的后面增加编号来实现。例如上面的情况，可以为每台服务器计算三个虚拟节点，于是可以分别计算 “Node A#1”、“Node A#2”、“Node A#3”、“Node B#1”、“Node B#2”、“Node B#3”的哈希值，于是形成六个虚拟节点：任务哈希以后顺时针距离哪个虚拟节点近就根据虚拟节点的主机确定是哪个机器处理

<img src="https://upload-images.jianshu.io/upload_images/8926909-34654c5540eb38e2.png?imageMogr2/auto-orient/strip|imageView2/2/w/760/format/webp" alt="img" style="zoom:50%;" />

在实际应用中，通常将虚拟节点数设置为32甚至更大，因此即使很少的服务节点也能做到相对均匀的数据分布。



---

## Part 4  并查集

并查集 $Union-find Sets$ 是一种非常精巧而实用的数据结构，它主要用于处理一些**不相交集合**的合并问题。一些常见的用途有求连通子图、求最小生成树的 Kruskal 算法和求最近公共祖先 $Least Common Ancestors, LCA$等。

使用并查集时，首先会存在一组不相交的动态集合**S={S~1~,S~2,~⋯,S~k~}**，一般都会使用一个整数表示集合中的一个元素。每个集合可能包含一个或多个元素，并选出集合中的某个元素作为**代表**。每个集合中具体包含了哪些元素是不关心的，具体选择哪个元素作为代表一般也是不关心的。我们关心的是，对于给定的元素，可以很快的找到这个元素所在的集合（的代表），以及合并两个元素所在的集合，而且这些操作的时间复杂度都是**常数级**的。

并查集的基本操作有三个：

1. $makeSet(s)$：建立一个新的并查集，其中包含 s 个单元素集合。
2. $unionSet(x, y)$：把元素 x 和元素 y 所在的集合合并，要求 x 和 y 所在的集合不相交，如果相交则不合并。
3. $findHead(x)$：找到元素 x 所在的集合的代表，该操作也可以用于判断两个元素是否位于同一个集合，只要将它们各自的代表比较一下就可以了。

并查集的实现原理也比较简单，就是使用树来表示集合，树的每个节点就表示集合中的一个元素，**树根对应的元素就是该集合的代表**。

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210317221341.png" alt="12160744-00b6e27da65b4b48b903e768a97bf888" style="zoom:80%;" />

图中有两棵树，分别对应两个集合，其中第一个集合为 **{a,b,c,d}**，代表元素是**a**；第二个集合为 **{e,f,g}**，代表元素是**e**。树的节点表示集合中的元素，指针表示指向父节点的指针，根节点的指针指向自己，表示其没有父节点。沿着每个节点的父节点不断向上查找，最终就可以找到该树的根节点，即该集合的代表元素。

$makeSet$ 要做的就是构造出如图 2 的森林，其中每个元素都是一个单元素集合，即父节点是其自身。

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210317221354.png" alt="12160852-98560aa5c6764feeab476938d1bcfe24" style="zoom:80%;" />

$find$ 如果每次都沿着父节点向上查找，那时间复杂度就是树的高度，完全不可能达到常数级。这里需要应用一种非常简单而有效的策略——路径压缩。路径压缩，就是在每次查找时，令查找路径上的每个节点都直接指向根节点。

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210317221403.png" alt="12160922-bc21dc9e11d645519c158e4f5153e20d" style="zoom:80%;" />

合并操作 $unionSet$ ，并查集的合并也非常简单，就是将一个小的集合的树根指向大的集合的树根。

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210317221412.png" alt="12160946-86baa213cc204627af4ad9a4cef4a97a" style="zoom:80%;" />

并查集的空间复杂度是 $O(n)$ 的。find 和 unionSet 操作都可以看成是常数级的，或者准确来说，在一个包含n个元素的并查集中，进行m次查找或合并操作，最坏情况下所需的时间为**O(mα(n))**，这里的**α**是 [Ackerman 函数](http://zh.wikipedia.org/wiki/阿克曼函数)的某个反函数，在极大的范围内（比可观察到的宇宙中估计的原子数量还大很多）都可以认为是不大于 4 的。具体的时间复杂度分析，请参见《算法导论》的 21.4 节 带路径压缩的按秩合并的分析。



功能：

1. 可以理解为isSameSet(ele1, ele2)，即判断两个ele是否是属于同一个集合（两个节点的**代表节点**，如果相同，就属于一个集合）
2. 可以理解为union(ele1, ele2)，将两个ele所在的集合合成为一个集合（两个ele分别找到**代表节点**，然后元素少的集合挂载到元素多的集合上）

一开始，所有节点单独形成集合，各个节点的parent指针指向自己

合并的时候，节点不断合并，每个节点不断向上通过parent指针，即可获取当前集合的代表元素

每个节点查找自己的parent过程，可以进行优化。优化：向上查找完毕之后，整个路径上的节点，直接挂载到代表元素节点上，从而变得扁平。

查询次数和合并次数**整体接近O(n)**，那么**单次的查询或者合并的复杂度，都是O(1)**

~~~C++
class unionFindSet {
private:
	unordered_map<Node, Node> fathermap;//key:child,value:father
	unordered_map<Node, int> sizemap;//num of nodes in the set with the head of node
public:
	void makeSet(list<Node> l) {
		for (Node node : l) {
			fathermap.insert({ node,node });
			sizemap.insert({ node,1 });
		}
	}

	Node findHeadUnRecur(Node node) {
		stack<Node> help;
		Node father = fathermap.find(node)->second;
		while (father != node) {
			help.push(node);
			node = father;
			father = fathermap.find(node)->second;
		}
		while (!help.empty()) {
			Node temp = help.top();
			help.pop();
			fathermap[temp]=father;
		}
		return father;
	}

	Node findHeadRecur(Node node) {
		Node father = fathermap.find(node)->second;
		while (father != node) {
			father = findHeadRecur(father);
		}
		fathermap[node]=father;
		return father;
	}

	void unionSet(Node a, Node b) {
		Node fatherA = findHeadUnRecur(a);
		Node fatherB = findHeadUnRecur(b);
		if (fatherA != fatherB) {
			int aSize = sizemap.find(a)->second;
			int bSize = sizemap.find(b)->second;
			if (aSize>bSize) {
				fathermap[fatherA]=fatherB;
				sizemap[fatherB]=aSize + bSize;
			}
			else {
				fathermap[fatherB]=fatherA;
				sizemap[fatherA]=aSize + bSize;
			}
		}
	}

	bool isSameSet(Node a, Node b) {
		return (findHeadUnRecur(a) == findHeadUnRecur(b)) ? true : false;
	}
};
~~~



floodfill算法

- 最基本的问题，单CPU，单内存。一个01矩阵，求岛屿的个数

基本的解法，两层for遍历，如果是1，就岛屿数量+1，然后感染周围的1，将周围的1感染成2；如果是0就跳过，如果是2也跳过。最后返回岛屿个数即可

- 进阶一点的问题，多个CPU，01矩阵特别大，求岛屿的个数（**大数据问题**）

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210222103750.png" alt="image-20210222103743742" style="zoom:80%;" />



<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210222103854.png" alt="image-20210222103854820" style="zoom:80%;" />

解法，将矩阵划分，单个矩阵用CPU求解，最后以一定的合并逻辑进行合并。每个子矩阵需要统计出来各自的岛屿数量，以及四条边界上1的感染源。然后一个子矩阵和上下左右的矩阵进行合并。**边界信息并查集**存放在一个**分布式内存中，用spark**完成

1. 单个矩阵中，进行感染的时候需要标明感染源，也就是并查集中的代表元素。
2. 边界上，两个都是1，调用isSameSet查找是否在同一个集合当中，如果不在同一个集合当中，则进行合并Union，并且岛屿数量-1（说明岛屿连在了一起，重复计数了）；如果在同一个集合当中，那么跳过（对应已经连过的）；如果不是两个都是1，那么跳过

（以下图这个例子，边界上，第一行调用`过程2`，岛屿总数-1；第二行调用`过程2`，已经在同一个集合当中，岛屿数量不变；第三行边界一个0一个1，跳过；第四行两个1调用`过程2`，岛屿总数-1；第五行边界一个0一个1跳过。

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210222104132.png" alt="image-20210222104132903" style="zoom:80%;" />

其他的一些细节，比如子矩阵划分成多大，需要考虑给定的CPU 内存 运算时间。**最核心的问题是，两个子矩阵合并的过程，该怎么处理**

大数据问题都没有代码，但是需要给出来思路和过程。代码如果写起来的话，是特别多的

---

## Part 4  字典树 tri树 ==前缀树==

字典树是一个树状结构，用来存储字符串信息，每个树枝代表一个字符，每个节点拥有三个成员，path表示字符串加入树走过该结点的次数，end表示以该结点结尾的字符串数量，nexts表示26个孩子，按英文字符A-Z顺序表示，指针指向NULL表示没有字符。以下面的树为例，表示字符串inn,int,tea,ten,to。

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210317221438.png" alt="20180823221048359" style="zoom:80%;" />

- end主要解决查询字符串是否存在问题。比如给定abc和ab建的tri树是相同的，我们此时查ab是否存在就不得而知，所以加入end，遍历字符串，看看最后一个结点end值是否为0，就知道是否存在，如果存在还能知道存在几个。
- path主要解决前缀字符串问题，给定前缀str，查询字符串中有多少是以str为前缀的树，只要遍历返回最后一个结点的path值即为所求。



基本的前缀树，路径上是字母，节点记录的是以该前缀结尾的字符串的个数。从而完成功能：查询是否存在给定的字符串，而不仅仅是是否存在类似的前缀。

向前缀树中insert字符串，之后可以进行查询。

删除一个word，各个节点沿途path--，最后end--。沿途过程中如果path--之后path=0，说明之后的都可以直接一次性删除。

功能扩充：

1. 查询一个word出现过多少次。各节点加上一个数据项end，记录该前缀结束的字符串个数
2. 给一个字符串，查询有多少个字符串以给定的字符串作为前缀。各个节点再加上一个数据项path，前缀的词频统计



采用前缀树的方式存储字符串，用来完成有多少个字符串以某某字符串为前缀的功能，可以极大地节省存储字符串的空间。查某个字符串是否存在于前缀树中，查前缀的词频是多少，都可以用前缀树以及扩充数据项的方式实现出来，而且代价极低，添加每个字符串的代价就是字符串的长度，查找的代价和数据量n也没关系，仅仅和字符串长度有关。

字母放在边上，节点里面存放数据path和end



<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210215130415.png" alt="image-20210215130408865" style="zoom:80%;" />

~~~c++
class TriNode {
public:
	int path; //树经过该结点多少次
	int end; //以该结点结尾结点
	TriNode* nexts[26];
public:
	TriNode() {
		path = 0;
		end = 0;
		for (int i = 0; i < 26; i++)
			nexts[i] = NULL;
	}
};

class TriTree {
private:
	TriNode root;
public:	
	void insert(string word) {
		TriNode node = root;
		for (int i = 0; i < word.length(); ++i) {
			int index = word[i] - 'a';
			if (node.nexts[index] == NULL)
				node.nexts[index] = new TriNode();
			node = *node.nexts[index];
			node.path++;
		}
		node.end++;
	}

	void deleteWord(string word) {
		TriNode node = root;
		for (int i = 0; i < word.length(); ++i) {
			int index = word[i] - 'a';
			if (--node.nexts[index]->path == 0) {
				node.nexts[index] = NULL;
				break;
			}
			node = *node.nexts[index];
		}
		node.end--;
	}

	bool search(string word) {
		TriNode node = root;
		for (int i = 0; i < word.length(); ++i) {
			int index = word[i] - 'a';
			if (node.nexts[index] == NULL)
				return false;
			node = *node.nexts[index];
		}
		if (node.end != 0)
			return true;
		else
			return false;
	}

	int prefixNumber(string pre) {
		TriNode node = root;
		for (int i = 0; i < pre.length(); ++i) {
			int index = pre[i] - 'a';
			if (node.nexts[index] == NULL)
				return 0;
			node = *node.nexts[index];
		}
		return node.path;
	}
};
~~~





# 第六讲 贪心

贪心是一种策略，在对问题求解时，总是做出在当前看来是最好的选择。也就是说，不从整体最优上加以考虑，他所做出的是在某种意义上的局部最优解。这就存在一个问题，我的贪心策略不一定是对的，同时也存在很多的贪心策略，贪心策略很不容易证明，所以一般**用对数器验证贪心策略**是否正确，选择的贪心策略必须具备无后效性，选择这个以后不影响后面的结果。

## Part 1  合成最小字符串

给定字符串数组，要把他们全部合成一个完整的字符串，要求合成的字符串字典序最小。

**字典序的理解**：可以理解成26进制的数，同理如果是ascii，则可以理解成256进制的数。长度相等，直接当成某进制的数进行比较；如果长度不等，短的字符串后面补0（不同进制中对应的最小的数，比如26进制的a，256进制的\0x0）补齐，再按照字面值比较。

**谁作为前缀时的字典序更小，谁放前面**

分析：
**贪心策略1**：把所有子**串按字典序排序升序之后**，两两连接，就是最小的。这样其实是错误的，举例：ba和b，贪心之后为bba，可是实际上bab是最小的。

**贪心策略2**：两两比较字串a和b，比较策略不是两个字符串直接按字典序比较，而是a+b>b+a的话a放在b后面。为了证明这种贪心策略是否正确，首先证明这种排序是可传递的，即a<b且b<c推出a<c。我们把字符串看成k进制数，12 + 34=12\*10^2+34，字符串a+b记为a\*m(b)+a
$$
a+b \leq b+a=>a*m(b)+b \leq b*m(a)+a   =>   a*m(b)*c \leq b*m(a)*c+ac-bc\\
b+c \leq c+b=>b*m(c)+c \leq c*m(b)+b   =>   b*m(c)*a+ca-ba \leq c*m(a)*a\\
由上式可推出:\\
b*m(c)*a-ba \leq b*m(a)*c-bc   =>    a*m(c)+c \leq c*m(a)+a=> a+c \leq c+a
$$

接下来证明经过这种规则排序后合成的字符串是最小的，我们任意交换两个子串的位置，得到的字符串一定比原来的大。比如现有已经排好序的字符串 am~1~m~2~......m~k~b，交换ab子串得到的bm~1~m~2~......m~k~a 一定大于原来的。因为以前已经排好序了，a+m~i~<=m~i~+a ，m~i~+b<=b+m~i~

$$
...am_{1} m_{2}......m_{k}b... \leq ...m_{1}am_{2}......m_{k}b...\\
...am_{1} m_{2}......m_{k}b... \leq ...m_{1}m_{2}......m_{k}ba...\\
...m_{1}m_{2}......m_{k}ba... \leq ...m_{1}m_{2}......bm_{k}a...\\
...m_{1}m_{2}......m_{k}ba... \leq ...bm_{1}m_{2}......m_{k}a...
$$


首先要证明排序策略的传递性，说明这个排序策略是对的排序策略；其次要证明排序之后的字符串序列是字典序最小的，即排序之后的字符串序列，调换任意两个字符串，一定会形成更大的字典序

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210215143222.png" alt="image-20210215143221939" style="zoom:80%;" />

费了半天劲终于证明了贪心策略的正确性，所以一般贪心策略不用证明，直接用就行。

~~~c++
struct cmp {
	bool operator ()(string a, string b) {
		if (a + b < b + a)
			return false;
		else
			return true;
	}
};

string mixMinString(vector<string> arr) {
	priority_queue<string,vector<string>,cmp> help;//优先队列
	for (int i = 0; i < arr.size(); ++i)
		help.push(arr[i]);
	string ans = "";
	while (!help.empty()) {
		ans += help.top();
		help.pop();
	}
	return ans;
}
~~~





---

## Part 2  切金条

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210222163504.png" alt="image-20210222163504087" style="zoom:80%;" />



分析：哈夫曼树最小代价和即为所求。贪心策略：每次切出来的一段一定是最长的一段，另一段再找出最长的一段，保证后续切金条花费最少。我们**反着来，每次选最小的两个加起来，再放进数组，重复此操作直到合成的数字=给定长度即可**。

10,20,30作为3个叶子节点，构造成哈弗曼树，所有的非叶节点的代价之和就是最低代价。**堆结构通常都可以用来解决贪心**问题。**本问题建立小根堆，所有的数放在小根堆里，每次取出两个最小值，合成一个值，并累加到res中，直到小根堆中只有一个数字。此时返回res就是最小代价**。

计算过程是从叶子节点到根节点构建，切割的过程是自顶向下的。构建的过程中，本题目是将合并之后的(a+b)进行累加。可以发散，(a+b)*(c+d)或者(a\*b)+(c\*d)

~~~c++
struct cmp {
	bool operator ()(int a, int b) {
		if (a <= b)
			return false;
		else
			return true;
	}
};

int minCost(vector<int> arr) {
	priority_queue<int,vector<int>,cmp> help;
    int res = 0;
	for (int i = 0; i < arr.size(); ++i)
		help.push(arr[i]);
	while (help.size() != 1) {
		int temp = 0;
		temp += help.top();
		help.pop();
		temp += help.top();
		help.pop();
         res += temp;
		help.push(temp);
	}
	return res;
}
~~~





---

## Part 3  工程最大利润

输入cost和profit数组，表示各个项目的门槛和利润，一次只能做一个项目，收益为门槛加上利润，再次输入本金和最多做的项目数，输出最终的最大收益

分析：在做的项目数小于规定的前提下，在小于当前本金的所有项目中选出利润最大的做，直到本金小于现有所有项目门槛或者达到最大项目数

**两个优先队列**

初始，用小根堆存放所有的项目，**小根堆按照cost进行组织（花费低**），然后将成本小于等于W的所有项目从小根堆中弹出，存入大根堆，**大根堆按照profit进行组织（收益高）**。大根堆的堆顶项目完成，更新W。然后继续从小根堆中弹出项目，放入大根堆中。直到达到k次或者大根堆为空结束。

~~~c++
struct node {
	int weight;
	int value;
};

struct cmpMin {
	bool operator ()(node a, node b) {
		return a.weight > b.weight;
	}
};

struct cmpMax {
	bool operator ()(node a, node b) {
		return a.value <= b.value;
	}
};

int maxProfit(vector<int> weight, vector<int> value, int maxProject, int ownMoney) {
	priority_queue<node, vector<node>, cmpMin> minProj;
	priority_queue<node, vector<node>, cmpMax> maxProj;
	node* a = new node[weight.size()];
	for (int i = 0; i < weight.size(); ++i) {
		a[i].weight = weight[i];
		a[i].value = value[i];
	}
	for (int i = 0; i < weight.size(); ++i)
		minProj.push(a[i]);
	for (int i = 0; i < maxProject; ++i) {
		while (!minProj.empty() && minProj.top().weight <= ownMoney) {
			maxProj.push(minProj.top());
			minProj.pop();
		}
		if (maxProj.empty())
			return ownMoney;
		ownMoney += maxProj.top().value;
		maxProj.pop();
	}
	return ownMoney;
}
~~~





---

## Part 4  最大会议数

现有两数组存放会议开始时间和结束时间，只有一个会议室，会议室同一时间只能开一场会，现在输入开始时间，输出最多可以开多少场会

分析：**贪心**，每次选择最早结束的会议开。

- 最早开始的项目，不行。**反例**，6点开始的会议，持续全天。其余的所有项目都安排不了
- 持续时间最短的项目，不行。反例，一共3个会议，有两个会议，间隔一段时间，刚好有一个会议占据中间的空闲时间，而且该会议持续时间短。
- 结束时间最早的项目，行。对数器验证

贪心策略往往离不开优先队列，策略的验证可以采用举反例，以及对数器验证。

~~~js
class Program {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}

/**
 * 最多安排会议的数量
 * 贪心策略，最早结束时间进行排序
 */
function bestArrange(programs, start) {
    programs.sort((a, b) => a.end - b.end); // 按照结束时间最早进行升序排列
    let res = 0;
    for (let i = 0; i < programs.length; i++) {
        if (start <= programs[i].start) { // start记录的是上一个会议的结束时间
            res++;
            start = programs[i].end; // 如果能够召开，那么更新start
        }
    }
    return res;
}
~~~





# 第七讲 动态规划和递归

暴力递归：
1. 把问题转化为规模缩小的同类子问题
2. 由明确的中止递归条件
3. 由得到子问题结果之后的决策过程
4. 不记录每个子问题的解

动态规划：
1. 从暴力递归来
2. 将每个子问题的解记下来，避免重复运算，加速递归，以空间换时间
3. 把递归抽象为状态表达
4. 存在简化状态表达，使其更加简洁的可能



<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210215173227.png" alt="image-20210215173226830" style="zoom:80%;" />





- P类问题，**知道怎么算**，用计算机算，多项式时间。工程上，以及我们平时写的代码，都是**严格知道怎么算**。也就是我们平时学习的算法都是P类的。
- NP类问题，不知道怎么算，知道怎么**尝试**。这一块算法很容易被我们所忽略掉。



求n的阶乘

1. **知道怎么算**，就是直接i从1乘到n
2. 不知道怎么算，知道怎么尝试。递归版本，要想解决n!的问题，子问题是先解决(n-1)!的问题，然后乘以n。从n到n-1到n-2到...到2到1，n依赖于n-1，n-1依赖于n-2，...，2依赖于1,1不受依赖。**从不受依赖的状态开始，一直计算到n**，也就是**从不被依赖的状态开始，然后逆着计算就得到了**。



## Part 1  汉诺塔问题

三根柱子，把n个盘子从左边的一根移到右边的一根，中间过程小的必须在大的上面，一次只能动一根柱子最上面的一个盘子，输出步骤。
分析：实际是个递归过程，移动n个盘子，子任务有三个，第一个移动n-1个盘子到中间的一根，第二个把第n个盘子移到右边柱子，第三个把n-1个移到右边的柱子。递归终止条件：如果当前n-1等于1，直接输出移动过程就行。

~~~c++
void hanoiTower(int level, string from, string help, string to) {
	if (level == 1) {
		cout << "move " << level << " from " << from << " to " << to << endl;
		return;
	}	
	hanoiTower(level - 1, from, to, help);
	cout << "move " << level << " from " << from << " to " << to << endl;
	hanoiTower(level - 1, help, from, to);
}
~~~





---

## Part 2  输出所有子序列（实际上是回溯）

分析：每个位置只有选这个字符和不选这个字符两种情况。从0位置开始输出子序列氛围两个子任务，第一个选择0位置字符输出1位置开始的子序列，第二个不选择0位置输出1位置开始的子序列。递归终止，位置来到字符串长度，直接输出序列即可。

~~~c++
void PrintSubSequence(string str, int i) {
	if (i == str.length()) {
		cout << str << endl;
		return;
	}
	PrintSubSequence(str, i + 1);
	str[i] = '#';
	PrintSubSequence(str, i + 1);
}
~~~





___

## 概念区分（子串，子序列，全排列）

涉及到**子串，子序列，允许重复的全排列，不允许重复的全排列**，通常都是用递归进行求解



**字符串的子串，子序列，全排列的区别**：

- **子串，要求连续**。枚举左边界和右边界，一共n^2种情况。
- **子序列，不要求连续**，每个位置上的字符，要么取，要么不取，所以一共是2^n种情况。比如字符串`abc`的子序列，有8种
- **全排列，一个字符也不能少**，一共n!种情况。比如字符串`abc`的全排列，一共6种



**全排列也有区别**

允许重复的全排列，不允许重复的全排列



**数学角度：全排列n!的生成过程**
第一个位置，可选的字符有n个
第二个位置，可选的字符有n-1个
...
第n-1个位置，可选的字符有1个
一共产生的序列是n!种



**基于交换元素的递归解法**

**为什么要交换？**之后的元素种类实际上就是n种，**从当前位置开始（包括当前元素）之后的所有元素，整体是一个集合，我们可以从集合中选择任意字符放到当前位置**

i位置是我们从集合中选择元素，要放到的位置。可选集合的范围：从i位置开始包括i位置，到达末尾。都是可选元素的范围。

我们从元素可选集合中选择出元素，放到位置i上。然后，继续递归，从后面选择元素到i+1位置上。

**将当前元素i和之后的可选元素进行交换**，实际上就是对应了数学过程中，**从可选集合中选择元素，放到位置i上**，放**到位置i之后，i元素就选择完毕，继续递归选择下个位置的元素**。
**当i到达末尾的时候，所有元素的选择已经完毕，产生一种排列**。



在同层去重上，也可以用hashset来进行去重，并且代码简单易懂



___

## Part 3  输出字符串所有全排列（实际上是回溯）

分析：每个位置选择从该位置到字符串结尾所有字符中间的一个字符。

产生排列树，假设字符串长度为n，那么排列树的高度为n

本题实际上有两个题目，允许重复的全排列以及不允许重复的全排列



**允许重复的全排列**
基于交换元素的递归
放置位置：选择元素放到位置i上 可选元素的范围：下标从i开始到之后的下标对应的元素都可选择
整体思路：从下标0开始交换arr的元素，对于i位置的元素，依次选择所有的可选的元素放到位置i，然后再选择元素放到i+1位置。当i超过数组下标时，表明产生了全排列。

~~~java
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
~~~



**不允许重复的全排列**
基本思路和基于交换的递归一样
只不过同层不允许重复
sln-1 用hashset去重
sln-2 将arr排序之后，如果元素重复就跳过

```js
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
```









___

## 母牛生牛

兔子每年生一只兔子，新出生的兔子三年之后每年生一只，假设不会死亡。求n年后，兔子的数量

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210222192932.png" alt="image-20210222192932577" style="zoom:80%;" />

__

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210222192950.png" alt="image-20210222192950338" style="zoom:80%;" />

**顺序迭代计算，时间O(n)，不容易写！**

存在O(logn)的算法，用到线性代数的矩阵乘法

**递归版本，时间O(n)**，和斐波那契数列一样
非递归版本，有几种不同的做法：
**非递归，时间O(n)，空间O(n)**，直接从递归版本改过来，用额外的数组进行存储即可，顺序计算
**非递归，时间O(n)，空间O(1)**，用额外几个变量进行存储，存储上一样
非递归，时间O(logn)，利用线性代数的矩阵乘法

```js
// 这里给出的是非递归空间O(1)的算法
// 经过自己改进之后，更容易理解，需要画图，只需要思考：用变量存储当前的res
function cowNumber3(n) {
    if (n == 1 || n == 2 || n == 3) {
        return n;
    }
    let t = [1, 2, 3]; // t[0]存储3年前也就是f(n-3)，t[1]存储2年前也就是f(n-2)，t[2]存储1年前
    let res = 3;
    for (let i = 4; i <= n; i++){
        res += t[0];
        t[0] = t[1];
        t[1] = t[2];
        t[2] = res;
    }
    return res;
}
```



---

## Part 4  寻最小路

给定一个二维数组，每个数都是正数，要求从左上走到右下角，每一步都只能向右或者向下。经过的数字累加，返回最小值

分析：每一步两种选择，两个子任务的结果之中的最大值，终止条件位置到达数组右下角返回0，到了底边只能向右，到了右边只能向下。



**暴力尝试改写到动态规划**

汉诺塔问题只能暴力尝试，不存在动态规划，有些问题改不成动态规划，因为汉诺塔问题的所有解空间，是要打印所有的步骤，因此汉诺塔问题没有重复计算。也就是说，**带有重复计算的暴力尝试，可以改成动态规划；不存在重复计算的暴力尝试，无法改写成动态规划**。

也就是，递归展开过程中，发现有重复状态，而且状态与怎么到达该状态的路径无关，也就是说，**无后效性，而N皇后问题，汉诺塔问题，具有后效性，后效性的问题必须暴力dfs，可以考虑剪枝**。比如一个过程写成了函数，函数的参数给定，返回值一定是确定的，就是无后效性，一定可以改成动态规划。

比如递归版，计算从左上到右下的最小路径和

会存在重复计算right和down的坐标

比如3\*3的矩阵或者4\*4的矩阵，从(0,0)到(0,1)和(1,0)状态。计算(1,0)的时候，会计算(2,0)和(1,1)状态；计算(0,1)的时候，会计算(0,2)和(1,1)状态



---

## Part 5  数组累加

一个正整数数组，可任意选择数组中的数字，能不能累加得到aim，可以返回true，否则返回false

暴力递归思路：依次考虑每个位置的数字，累加或者不累加。终止条件：位置到达最后，或者加和大于aim

f(idx, curSum)

二叉树深度h，所有节点代表全部消耗的时间2^h，二叉树的最大深度代表了最大消耗的空间，空间O(h)
**暴力递归**，**时间O(2^h)，空间O(h)**
本题是无后效性的，也就是如何到达f(2,2) doesn't matter
最后的叶子节点，只要有一个true，整个f(0,0)就能返回true

```js
/**
 * 给一个数组和aim，可以从arr中任意挑选数字，能否累加得到aim，返回true或者false
 * 返回值表示数组中能否累加得到aim
 * 暴力版本，递归尝试出结果！是写出dp的基础！
 */
function Sum1(arr, aim) {
    function process(idx, curSum) {
        if (curSum == aim) {
            return true;
        }
        if (idx == arr.length) {
            return curSum == aim;
        }
        let res1 = process(idx + 1, curSum + arr[idx]);
        let res2 = process(idx + 1, curSum);
        return res1 || res2;
    }
    return process(0, 0);
}
```





## 暴力递归改写动态规划的统一套路

**先写出暴力递归函数**

首先**明确递归函数的意义**
比如说f(i,j)代表的是从i开始到结束，j代表的是之前的累加和=>这种递归函数的意义是**从(i,j)开始计算到默认目标**
另外一种递归函数计算顺序是**从起始位置(0,0)开始走到(i,j)的**
f(idx,curSum)表示从idx开始往后进行累加，能否得到aim
分析一下**递归函数的边界：也就是不被依赖的状态 base case**

- 当curSum==aim的时候，直接返回true
- 当idx==arr.length时，返回`curSum == aim`
- `否则 return f(idx+1,curSum)||f(idx+1,curSum+arr[i])` 状态之间的依赖关系



**无后效性**

比如arr=[2,3,5],aim=5，f(3,5)
只要函数的**参数固定**，**不管如何到达**f(3,5)这个**状态**，f(3,5)的**返回值不会发生变化**，这就说明**具有无后效性**
可以2+3=5，也可以直接取arr[2]=5，都可以到达f(3,5)这个状态，但是f(3,5)的返回值都相同
本题**无后效性**，因此可以改写为DP



**改写DP**

1. 确认有两个参数，变化范围 下标从0到arr.len，curSum从0到aim用二维矩阵
2. 最终状态`dp[0][0]`
3. **根据base case**，计算出**不被依赖的状态**，**也就是初始状态**，**`dp[arr.len][0]=F dp[arr.len][1]=F ... dp[arr.len][aim]=T`**
4. 分析普遍位置的依赖关系，`dp[i][j]=dp[i+1][j]||dp[i+1][j+arr[i]]`





**暴力递归改写成DP的统一套路**

1. 先**写出暴力递归版本**
2. 判断能不能改写成动态规划（判断是否具有**无后效性**）
3. **分析递归函数的可变参数以及相应的变化范围**，比如2个，状态用2个参数来表示，用二维矩阵存储状态
4. 把**最终需要求解的位置**点出来
5. 回到**base case，直接计算出来不被依赖的状态的值**
6. **分析普遍状态的值是怎么依赖其他状态的**

最重要的是第一步，写出暴力递归版本，然后就是**用dp，用存储空间存储状态，以空间换时间**



---

## Part 6  背包问题

重量，价值，重量不超过限度的情况下，返回挑选的最大价值。

暴力递归的思路，如果装不下，就直接考虑下一个物品；如果装得下，返回的最大价值=max(取这个物品的价值，不取这个物品的价值)

```js
/**
 * 暴力递归
 * process函数返回的是从idx开始以及之后的最大value
 * 返回结构体的设计，就是一个return value，代表最大价值
 */
 function base(weight, value, beg) {
    function process(idx, curWeight) {
        if (idx == weight.length) {
            return 0;
        }
        // 第idx个商品放进背包还是不放进背包取决于背包容量
        if (curWeight + weight[idx] > beg) {
            return process(idx + 1, curWeight);
        }
        return Math.max(process(idx + 1, curWeight), value[idx] + process(idx + 1, curWeight + weight[idx]));
    }
    return process(0, 0);
}
```




下面改DP


~~~js
/**
 * idx is from 0 to arr.len
 * curWeight is from 0 to beg
 * to get dp[0][0]
 * if j+weight[i]>beg
 *  dp[i][j]=dp[i+1][j]
 * else
 *  dp[i][j]=max(dp[i+1][j],value[i]+dp[i+1][j+weight[i]])
 * initial dp[arr.len][j]=0
 */
function basedp(weight, value, beg) {
    let m = weight.length;
    let dp = new Array(m + 1);
    for (let i = 0; i < dp.length; i++){
        dp[i] = new Array(beg + 1).fill(0);
    }
    for (let i = 0; i <= beg; i++) {
        dp[m][i] = 0;
    }
    for (let i = m - 1; i >= 0; i--){
        for (let j = 0; j <= beg; j++){
            dp[i][j] = dp[i + 1][j];
            if (j + weight[i] <= beg) {
                dp[i][j] = Math.max(dp[i][j], value[i] + dp[i + 1][j + weight[i]]);
            }
        }
    }
    return dp[0][0];
}
~~~





___

# 第八讲

## Part 1  ==KMP算法==

**字符串中找子串第一次出现的位置**。字符串长度m，子串长度n。

暴力匹配算法，时间O(m*n)，空间O(1)，m是字符串的长度，n是子串的长度
KMP算法，**时间复杂度O(m)**，（实际上是O(m+n)，但是通常m远大于n，因此KMP时间复杂度可以视为O(m)）**空间复杂度O(n)**，时间复杂度中，m为遍历查找的时间，n为计算next数组需要的时间，比一般的暴力算法加速很多

空间换时间，用next数组加速遍历，**KMP算法中，`i指针`永远不会回退**。而暴力法每次不匹配`i指针`都往回退到开始匹配的下一个位置，就很浪费时间，做了一些无意义的比较。KMP主要通过最长前缀解决不必要的回溯问题。



核心：

主串的i指针不回退，j指针每次回退到next[j]处

next[i]表示: ==以i结尾的后缀和从0开始的前缀，**两者的最长公共长度**==，但是**不包括整个pat[0~i]**
用处，当主串在i处， 子串在j处失配的时候，假设next[j]=k，那么也就是说，主串在失配地方的，前k个字符，和子串从开始位置开始的前k个字符，是匹配的。因此加速匹配。





当出现txt与pat不匹配时，需要回退，利用next数组避免无效比较。
求不匹配位置next值，利用前缀和后缀相同，i不动，j移动到`next[j]`，继续比对`txt[i]和pat[j]`



![image-20210621212028275](https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210621212035.png)



为什么说

![image-20210621212521264](https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210621212521.png)





求解整个子串的next值：
0位置之前没有字符串，next[0]记为-1；
1位置前只有一个字符，next[1]=0
之后的位置是一个递归过程。求解`next[i]`的值，首先看看`j = i-1, 考虑next[j]`的值，
如果`pat[j]=pat[i-1]`，则`next[i]=++j`
如果不等，那么`pat[i]实际上有两种情况，case 1 不存在前后缀，也就是next[i]=0; case 2 存在小一点的前后缀，需要进行递归`

```js
// next数组的构造过程
function getNextArray2(pat) {
    if (pat == null || pat.length == 1) {
        return new Array(1).fill(-1);
    }
    let next = new Array(pat.length).fill(0);
    next[0] = -1;
    let i = 2, j = 0; // 开始计算next[2]，j代表的是idx=1位置上的最长公共前后缀长度
    while (i < pat.length) { // j =next[i-1]
        if (pat[j] == pat[i - 1]) { // 如果pat[i-1] == pat[j] 匹配，那么next[i]= ++j
            next[i] = ++j;
            i++; // 计算下一个next[i]
        } else if (j > 0) { // 失配，但是还可能有小一点的前缀，j=next[j]
            j = next[j];
        } else { // 直到j=-1也没有，说明不存在前后缀，next[i]=0
            next[i++] = 0;
        }
    }
    return next;
}
```



1. 首先根据pat构造出next数组
2. 利用next数组，将txt和pat进行匹配

```js
// 匹配txt和pat的过程
function KMP2(txt, pat) {
    if (txt == null || pat == null || pat.length < 1 || txt.length < pat.length) {
        return -1;
    }
    let i = 0, j = 0;
    let next = getNextArray2(pat);
    while (i < txt.length && j < pat.length) {
        if (j == -1 || txt[i] == pat[j]) { // 匹配则向右移动 如果第一个字符就失配，也向后移动
            i++;
            j++;
        } else { // 不匹配则不停移动pat，如果一直不匹配，那么j=next[0]=-1
            j = next[j];
        }
    }
    return j == pat.length ? i - j : -1; // j到达末尾，代表找到；否则没找到
}
```





### KMP应用

### 相同前后缀

给定一字符串，在末尾添加一字符串使得新的大字符串包含两个原来的字符串，这两个字符串位置应该不同，输出最短的可能。比如：输入 aaaa，输出 aaaaa    输入 abcabc，输出 abcabcabc

分析：要包含两个原字符串，长度最短，那么利用相同的前后缀，利用了KMP中next数组，求得整个字符串的最大前后缀，在结尾补上缺少的即可。

~~~c++
string minTwoString(string str) {
	int* next = new int[str.length() + 1];
	next[0] = -1; next[1] = 0;
	int frontNext = next[1], i = 2;
	while (i <= str.length()) {
		if (str[i - 1] == str[frontNext])
			next[i++] = ++frontNext;
		else {
			if (frontNext > 0)
				frontNext = next[frontNext];
			else
				next[i++] = 0;
		}
	}
	str += str.substr(next[str.len], str.length() - 1); // 从next数组中的最后一个元素指定的idx开始截取，也就是idx=next[str.len]
	return str;
}
~~~



---

### 二叉树中删除某个子树

给定一个二叉树和一个子树，看这棵树中有没有子树，有的话删除，没有返回false

分析：二叉树序列化为字符串遍历顺序无所谓，子树序列化，KMP找子串，存在得话删除子串，补上一个空结点标志，完成。

~~~c++
#include <iostream>
#include <algorithm>
#include <vector>
#include <string>  
#include <sstream>
using namespace std;

typedef struct BiTNode {
	int data;
	BiTNode* lchild;
	BiTNode* rchild;
}BiTNode, * BiTree;

typedef struct Ans {
	bool isSubString;
	BiTree T;
};

void PreOrder(BiTree T) {
	if (T == NULL)
		return;
	cout << T->data << " ";
	PreOrder(T->lchild);
	PreOrder(T->rchild);
}

int* getNexts(string str) {
	int* next = new int[str.length()];
	next[0] = -1; next[1] = 0;
	int frontNext = next[1], i = 2;//frontNext记录前一个位置的next值用来比较
	while (i <= str.length()) {
		if (str[i - 1] == str[frontNext])
			next[i++] = ++frontNext;
		else {
			if (frontNext > 0)//frontNext<=0,说明已经没有相同前后缀，不用找了
				frontNext = next[frontNext];
			else
				next[i++] = 0;
		}
	}
	return next;
}

int KMP(string str, string subStr) {
	int i = 0, j = 0;
	int* next = getNexts(subStr);
	while (i < str.length() && j < subStr.length()) {
		if (str[i] == subStr[j]) {
			++i; ++j;
		}
		else {
			if (j == 0)//第一个位置都没匹配，没有相同前后缀可用，直接比较下一个
				i++;
			else
				j = next[j];
		}
	}
	return (j == subStr.length()) ? i - j : -1;
}

string BiTreeSquence(BiTree T) {
	if (T == NULL)
		return "# ";//留空格是为了复原树
	string str = to_string(T->data) + " ";
	str += BiTreeSquence(T->lchild);
	str += BiTreeSquence(T->rchild);
	return str;
}

BiTree BiTreeUnSquence(vector<string> &tree, BiTree& T) {
	string temp = tree.front();
	tree.erase(tree.begin());
	if (temp == "#")
		T = NULL;
	else {
		T = new BiTNode;
		T->data = atoi(temp.c_str());//string 转 int
		BiTreeUnSquence(tree, T->lchild);
		BiTreeUnSquence(tree, T->rchild);
	}
	return T;
}

vector<string> processStream(string str) {//把全部节点值加入向量中
	string temp;
	vector<string> help;
	istringstream stream(str);
	while (stream >> temp)
		help.push_back(temp);
	return help;
}

Ans findSubBiTree(BiTree& T, BiTree subTree) {
	Ans ans;
	string tree = BiTreeSquence(T);
	string subtree = BiTreeSquence(subTree);
	int loc = KMP(tree, subtree);
	if (loc == -1) {
		ans.isSubString = false;
		ans.T = T;
		return ans;
	}
	tree.insert(loc, "# ");
	tree.erase(loc + 2, subtree.length());//删除子树
	vector<string> treeNum;
	treeNum = processStream(tree);
	ans.isSubString = BiTreeUnSquence(treeNum, ans.T);
	return ans;
}


int main() {
	BiTNode a, b, c, d, e, f;
	a.data = 1; b.data = 2; c.data = 3;
	d.data = 4; e.data = 2; f.data = 4;
	a.lchild = &b; a.rchild = &c;
	b.lchild = NULL; b.rchild = &d;
	c.lchild = NULL; c.rchild = NULL;
	d.lchild = NULL; d.rchild = NULL;
	e.lchild = NULL; e.rchild = &f;
	f.lchild = NULL; f.rchild = NULL;
	BiTree t = &a, subt = &e;
	cout << findSubBiTree(t, subt).isSubString << endl;
	PreOrder(findSubBiTree(t, subt).T);
	return 0;
}
~~~



---

## Part 2  ==manacher算法==

给定一个字符串，求出其**最长回文子串**。例如：

1. s="abcd"，最长回文长度为 1；
2. s="ababa"，最长回文长度为 5；
3. s="abccb"，最长回文长度为 4，即 bccb

以上问题的传统思路大概是，遍历每一个字符，以该字符为中心向两边查找。其时间复杂度为 `O(n^2)`，效率很差。Manacher 算法，该算法可以把时间复杂度提升到 `O(n)`。下面来看看马拉车算法是如何工作的。

由于回文分为偶回文（比如 bccb）和奇回文（比如 bcacb），而在处理奇偶问题上会比较繁琐，所以在字符串首尾，及各字符间各插入一个字符（前提这个字符未出现在串里）。举个例子：`s="abbahopxpo"`，转换为`s_new="#a#b#b#a#h#o#p#x#p#o#"`，如此，s 里起初有一个偶回文`abba`和一个奇回文`opxpo`，被转换为`#a#b#b#a#`和`#o#p#x#p#o#`，长度都转换成了**奇数**。这样奇数回文就可以从中间向两边展开。

manacher同样是空间换时间，用`int p[]`数组记录每个位置的回文半径，传统manacher算法中数组`p`中的每个位置都要从中心向两边展开，manacher利用回文半径数组，利用前面位置的值加速后面位置值的求解。

|    i     |  0   |  1   |  2   |  3   |  4   |  5   |  6   |  7   |  8   |  9   |  10  |  11  |  12  |  13  |  14  |  15  |  16  |  17  | 18   |
| :------: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | ---- |
| s_new[i] |  #   |  a   |  #   |  b   |  #   |  b   |  #   |  a   |  #   |  h   |  #   |  o   |  #   |  p   |  #   |  x   |  #   |  p   | #    |
|   p[i]   |  1   |  2   |  1   |  2   |  5   |  2   |  1   |  2   |  1   |  2   |  1   |  2   |  1   |  2   |  1   |  4   |  1   |  2   | 1    |

这样我们就可以看出，最大回文长度为`max(p[i])-1`注意这里数组`p`存的是半径，我们要求的是直径，因为空隙中加了一个字符，所以半径-1刚好等于所求。接下来还需要两个变量mx 和 id 。mx 代表以 id 为中心的最长回文的右边界(只有当前位置回文中心加上最大回文半径大于当前有边界时，右边界才会更新)，也就是mx = id + p[id]。我们利用`p[j]`来加快查找。

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210324170858.png" alt="image-20210324170858002" style="zoom:80%;" />

根据回文的性质，`p[i]`的值基于以下四种情况得出：

(1):**j 的回文串有一部分在回文右边界的之外**，如下图：

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210324170819.png" alt="image-20210324170812444" style="zoom:80%;" />

上图中的`p[i]=R-i`，并且`p[i]`不可能更大
假设更大，那么id的回文半径应该会比现在要大，而id之所以是现在的大小，就是因为左右两端的边界不匹配，所以`p[i]=R-i`

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210324170828.png" alt="image-20210324170828120" style="zoom:80%;" />

假设右侧新增的紫色部分是`p[i]`可以增加的部分，那么根据回文右边界的性质，a 不等于 d ，根据j的回文性质，`a=b,c=d`，根据id内回文的性质`b=c`，综上`a!=d`，所以i位置最大回文长度为`R - i`

(2):**j 回文串全部在 id 的内部**，如下图：

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210324170836.png" alt="image-20210324170836772" style="zoom:80%;" />

此时i的回文半径=j的回文半径，而且不能更大。利用(1)方式容易证明不能再扩大了

(3):**j 回文串左端正好与 id 的回文串左端重合**，见下图：

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210324170843.png" style="zoom:80%;" />

此时i位置的回文半径p[i]初始值=R-i，还需要向外边扩看看回文半径会不会增加。

(4):**i位置不在最右回文边界内**：

此时**不存在已知信息，不能利用已知信息加速p[i]初始值的确定**，只能暴力向两边扩

回文边界R一直向右移动，i一直向右移动，没有回溯的过程所以时间复杂度`O(N)`

~~~c++
struct maxPalindromicString {
	int length;
	int PalindromicMiddle;
};

maxPalindromicString Manacher(string str) {
	string strNew = "#";
	for (int i = 0; i < str.length(); ++i) {
		strNew += str[i];
		strNew += "#";
	}
	int* p = new int[strNew.length()];
	int R = -1, C = -1, i = 0;
	maxPalindromicString ans;
	ans.length = -1; ans.PalindromicMiddle = 0;
	for (int i = 0; i < strNew.length(); ++i) {
		p[i] = (i < R) ? min(p[2 * C - i], R - i) : 1;
		while (i + p[i] < strNew.length() && i - p[i] >= 0) {
			if (strNew[i + p[i]] == strNew[i - p[i]])
				++p[i];
			else
				break;
		}
		if (i + p[i] > R) {//更新回文右边界和回文中心
			R = i + p[i];
			C = i;
		}
		if (ans.length < p[i]) {//处理返回值信息
			ans.length = p[i];
			ans.PalindromicMiddle = i;
		}
	}
	ans.length -= 1;
	return ans;
}

int main() {
	string s = "taabbbaak";
	maxPalindromicString ans = Manacher(s);
	cout << ans.length << endl << s.substr(ans.PalindromicMiddle / 2 - ans.length / 2, ans.length) << endl;
	return 0;
}
~~~



`p[i] = (i < R) ? min(p[2 * C - i], R - i) : 1;`  这行代码的由来：

可能性1中`p[i]应为R-i，这时候R-i<p[2 * C - i]`
可能性2中`p[i]应为p[2 * C - i]，此时R-i>p[2 * C - i]`
可能性3中`R-i=p[2 * C - i]，取最小值都一样`
所以当`(i<R)`时`p[i]`取值正常，当`i>=R`时，`p[i]`得取值1刚好可以作为接下来扩展遍历得位置记录



https://www.jianshu.com/p/116aa58b7d81

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210301194013.png" alt="image-20210301194006630" style="zoom:80%;" />



### Manacer的意义和应用

其实，根据manacher算法，得到回文半径数组之后，**每个位置上的回文半径的长度**，实际上就是**以该位置为中心的最长回文子串的长度**。



### 添加最少的字符串，得到回文串

给定一字符串，结尾添加字符串使整个新字符串回文，要求新字符串最短。

回文右边界到达末尾，退出循环，**此时p[i]**就是i对应的左右两个边界内部的回文串的长度，是**将来所求的回文串的公共部分的长度**，**只需要前面的字符串逆序即可**，前面字符串的长度=str.len-p[i]+1

**时间O(n)，空间O(n)**

~~~c++
string minPalindromicString(string str) {
	string strNew = "#";
	for (int i = 0; i < str.length(); ++i) {
		strNew += str[i];
		strNew += "#";
	}
	int* p = new int[strNew.length()];
	int R = -1, C = -1, i = 0;
	for (int i = 0; i < strNew.length(); ++i) {
		p[i] = (i < R) ? min(p[2 * C - i], R - i) : 1;
		while (i + p[i] < strNew.length() && i - p[i] >= 0) {
			if (strNew[i + p[i]] == strNew[i - p[i]])
				++p[i];
			else
				break;
		}
		if (i + p[i] > R) {
			R = i + p[i];
			C = i;
		}
		if (R == strNew.length())
			break;
	}
	string temp = str.substr(0, (2 * C - R) / 2 + 1);
	reverse(temp.begin(), temp.end());
	return str + temp;
}
~~~



### 统计给定字符串中有多少个回文串

力扣647

实际上就是求每个字符的最大回文半径长度/2，得到了每个字符的回文串数量，累加就是结果

```js
var countSubstrings = function(s) {
    if(s==null){
        return 0;
    }
    let res=0;
    let char=getchar(s);
    let p=new Array(char.length).fill(0);
    let C=-1,R=-1;
    for(let i=0;i<char.length;i++){
        p[i]=i<R?Math.min(p[2*C-i],R-i):1;
        while(i+p[i]<char.length&&i-p[i]>=0){
            if(char[i+p[i]]==char[i-p[i]]){
                p[i]++;
            }else{
                break;
            }
        }
        if(i+p[i]>R){
            R=i+p[i];
            C=i;
        }
        res+=Math.floor(p[i]/2);
    }
    return res;
};

function getchar(s){
    let res=new Array(s.length*2+1);
    let idx=0;
    for(let i=0;i<res.length;i++){
        res[i]=i%2==0?'#':s[idx++];
    }
    return res;
}
```



___

# 第九讲

## Part 1  BFPRT算法 TOP-K问题

在一大堆数中求其前k大或前k小的问题，简称TOP-K问题。而目前解决TOP-K问题最有效的算法即是BFPRT算法，其又称为**中位数的中位数算法**，**最坏时间复杂度为`O(N)`**

排序算法解决TOP-K，时间复杂度O(nlogn)
堆解决TOP-K，时间复杂度O(nlogk) 推荐
BFPRT算法， **时间复杂度O(n)** 不推荐
改进快排解决TOPK，时间O(n) **推荐**



### 改进快排解决TOP-K

回顾快排思路

1. 进行Partition获取两个边界
2. 依次对小于区域和大于区域进行Partition，从而让左右两个区域内部有序
3. 最后的数组是整体从小到大



TOP-K问题，不需要前K个数组内部有序，**只需要找到所求的第k个数，用它作为pivot划分，就能将小于等于该数字的放在左侧**，只需要数组中前K个小于等于pivot的数字放到下标k之前即可。

1. 随机选择pivot和最后进行交换
2. 进行partition，得到两个边界
3. ==当k位于边界中间时，可以结束；如果k位于左边，对左边进行partition；位于右边对右边进行Partition==
4. 将前k个数据返回即可

```js
var smallestK = function (arr, k) {
    let res = new Array(k);
    process(arr, 0, arr.length - 1, k);
    for (let i = 0; i < k; i++) {
        res[i] = arr[i];
    }
    return res;
};

function process(arr, L, R, k) {
    if (L < R) {
        let idx = L + Math.floor(Math.random() * (R - L + 1));
        swap(arr, idx, R);
        let res = partition(arr, L, R);
        if (k < res[0]) { // 如果k不在范围之内，就将左边或者右边递归partition部分有序即可
            process(arr, L, res[0] - 1, k);
        } else if (k > res[1]) {
            process(arr, res[1] + 1, R, k);
        }
        return;
    }
}

function partition(arr, L, R) {
    let cur = L, small = L - 1, big = R;
    let pivot = arr[R];
    while (cur < big) {
        if (arr[cur] < pivot) {
            swap(arr, ++small, cur++);
        } else if (arr[cur] > pivot) {
            swap(arr, --big, cur);
        } else {
            cur++;
        }
    }
    swap(arr, big, R);
    return [small + 1, big];
}
```



### 对比快排和TOP-k

快排会对左右两个区域进行递归排序
TOP-K只对一个区域进行递归

前K个最大 最小问题，解答方式和第K个最大 最小问题，解答方式，完全一样

```js
// 快排
function quicksort(arr, L, R) {
    if (L < R) {
        let idx = L + Math.floor(Math.random() * (R - L + 1));
        swap(arr, idx, R);
        let res = partition(arr, L, R);
        quicksort(arr, L, res[0] - 1); // 左边区域排序
        quicksort(arr, res[1] + 1, R); // 右边区域排序
    }
}
// TOP-K
function process(arr, L, R, k) {
    if (L < R) {
        let idx = L + Math.floor(Math.random() * (R - L + 1));
        swap(arr, idx, R);
        let res = partition(arr, L, R);
        if (k < res[0]) { // 如果k不在范围之内，就将左边或者右边递归partition部分有序即可
            process(arr, L, res[0] - 1, k);
        } else if (k > res[1]) {
            process(arr, res[1] + 1, R, k);
        }
        return;
    }
}
```





### BFPRT

BFPRT算法步骤如下： 
（1）：根据策略，选择一个值作为划分点； 
  （1.1）：将n个元素划分为⌊n/5⌋个组，每组5个元素，若有剩余，自成一组；
  （1.2）：使用插入排序获取每一组的中位数；
  （1.3）：对于（1.2）中找到的所有中位数，调用BFPRT算法求出它们的中位数，作为主元； 
（2）：以（1.3）选取的主元为分界点，根据pivot，划分成三部分
（3）：判断主元的位置与k的大小，要么直接在等于区域直接找到，要么有选择的对左边或右边递归。

下面分析为什么时间复杂度`O(N)`：
设整个任务时间复杂度`T(N)`，我们分析最坏情况，分组找到每个组得中位数,总共`N/5`个组找5个数中找中位数时间复杂度`O(1)`，总体时间复杂度`O(N)`，接下来找中位数数组得中位数，时间复杂度`T(N/5)`，比较影响效果得就是partition过程，我们看看为什么这样选择分界值就能很好。我们选出得中位数数组长度`N/5`的中位数作为分界值，那么就有`N/5/2=N/10`个中位数比他大，在这些中位数5个数的数组中至少有2个数比他们还大，因为他们也是5个数数组的中位数，那么总共至少存在`N/10+2*N/10=3*N/10`个数比分界值大，这样整个数组至多有`7*N/10`个数比分界值小，最坏的情况，我们接下来就要在这`7*N/10`个数中找答案。综上所述，我们得到：
$$
T(N)=T(\frac{N}{5})+T(\frac{7N}{10})+O(N)
$$
通过时间复杂度递归式，可证明最坏情况时间复杂度`T(N)=O(N)`

1. 分组 O(1)
2. 组内排序 O(n/5 * 1)= O(n)
3. 各组取出中位数组成N/5大小的新数组 O(n)
4. 递归BFPRT(新数组，新数组.length/2)得到新数组的中位数pivot T(n/5)
5. 根据pivot，划分三部分 = O(n)
6. 找到top-k，返回；没找到，左部分或者右部分递归 = 最坏T(7/10*N)

T(n)=T(n/5)+T(7/10*n)+O(n)

步骤1-4选择pivot的策略，限定了划分之后左部分或者右部分的最坏size=7/10*n而不是n-1，从而严格保证整体的最坏复杂度



荷兰国旗解决TOP-K问题，概率期望上的时间复杂度为O(N)；BFPRT时间复杂度严格O(N)

荷兰国旗解决TOP-K，随机选一个，数组划分为左中右三部分，然后递归左部分或者右部分或者返回等于区域，概率期望上的时间复杂度为O(N)；BFPRT算法解决TOP-K，唯一不同的是，选的划分值不是随机选择的，算法剩余部分完全一样


~~~c++
void swap(int a[], int i, int j) {
	int temp = a[i];
	a[i] = a[j];
	a[j] = temp;
}

int* partition(int a[], int start, int end, int target) {
	int less = start - 1, more = end + 1, cur = start;
	while (cur != more) {
		if (a[cur] == target)
			++cur;
		else if (a[cur] < target)
			swap(a, ++less, cur++);
		else
			swap(a, --more, cur);
	}
	int* equal = new int[2];
	equal[0] = less + 1;
	equal[1]=more - 1;
	return equal;
}

int findMiddleNum(int a[], int start, int end) {
	sort(a + start, a + end);
	return a[(start + end) / 2];
}

int BFPRT(int a[], int k, int start,int end) {//k从1开始
	if (end == start)
		return a[end];
	int length = ((end - start + 1) % 5 == 0) ? 0 : 1;
	length += (end - start + 1) / 5;
	int* newArr = new int[length];
	for (int i = 0; i < length; ++i) //min为最后一组不满5个准备
		newArr[i] = findMiddleNum(a, start + i * 5, min((start + i * 5 + 4), end));
	int key = BFPRT(newArr, length / 2, 0, length - 1);
	int* equal = partition(a, start, end, key);
	delete[]newArr;
	if (equal[0] <= k - 1 && equal[1] >= k - 1)
		return a[k - 1];
	else if (equal[0] > k - 1)
		return BFPRT(a, k, start, equal[0] - 1);
	else
		return BFPRT(a, k, equal[1] + 1, end);
}
~~~



----

## Part 2  ==单调队列==

滑动窗口实际上是双指针

- R只进不退，对应窗口添加数据
- L只进不退，对应窗口减数据
- 并且L始终在R的左侧，即L<R

**窗口添加数据的逻辑**

从L到R，从大到小并且不能相等，如果违背，就在右侧弹出，直到不会违背。

如果`右侧value<=arr[i]`，那么将右侧数据不断弹出，直到`右侧value>arr[i]`，直接将`arr[i]`添加到右侧即可



**窗口减数的逻辑**

L向右移动后，需要检查窗口头部的数据是否过期



### 单调队列范式

```js
单调队列，只是为了O(1)时间快速获取窗口内的最大值和最小值qmax[0] qmin[0]，需要和其他条件搭配使用，比如两层循环枚举边界
也就是，O(1)时间获取子数组的最大值，最小值

通用时间O(n) 通用空间O(n)
问题1，单调队列添加数据的逻辑
问题2，单调队列退出数据的逻辑->什么时间单调队列需要退出数据?相应的实际窗口容量超限的时候，单调队列需要退出数据->退出那个数据?退出单调队列的队首

通用形式
1. qmax=[]; // 假设求窗口内的最大值 相应的单调队列，单调性为从大到小
2. 遍历数组{
	while(qmax.length>0&&arr[qmax[qmax.length-1]]<=arr[j]){ // 违背单调性，不断弹出；值相同，只保存最新的下标
		qmax.pop();
	}
	qmax.push(j); // 队列添加数据 每一个arr[j]都必须要添加进入，当然可能造成对应的实际窗口容量超限
}
3. 什么时间单调队列减少数据取决于题目，单调队列对应的实际窗口的最大容量是多少?什么情况代表着容量超限?什么情况代表数据过期?
比如每个窗口的最大值，当容量超出的时候；// 怎么判断容量超限?由于单调队列的数据量和实际窗口中的数据量并不相等，因此只有当实际窗口中的数据量超限，就代表容量超限。不过单调队列qmax[0]保存的是最久远的数据的下标，因此实际窗口的当前容量=i-qmax[0]+1
qmax.shift(); // 容量超限的时候，为什么要弹出第一个?为什么说容量超限的情况下，第一个元素一定是过期的? 这里的单调队列有两个性质，一个单调性，越前面的数据越大；一个队列本身的性质，越前面的数据越旧。因此超限的时候，一定是要清除掉最旧的数据。
差值小于aim，qmax[0]==i的时候，pop_front()
```

简单总结一下

单调队列
性质，本身是队列，越前面的数据越旧；单调性，q[0]是最大或者最小
为了O(1)获取实际窗口的最大值 最小值
添加数据（实际上是为了看看有没有可能，更新一下最大值），所有数据都必须添加到单调队列中，遵循单调性直接添加，不遵循就一直弹出直到遵循
移出数据（实际上是，对应的窗口容量过期了，可能需要更新一下最大值）->什么情况代表对应窗口超限？该移除哪个数据？



~~~c++
void slidingwindows(vector<int> nums,int k){
    先预处理
    然后进行滑动窗的循环，一般是个while循环，同时实现定义好滑动窗的起点和终点，同时还有一个是记录当前状态的数或者数组，比如count
    int begin = 0, end = 0;
    int count = 0;
    while(end<nums.size()){
        1.在循环里先是当前end到达的时候，更新count
        2.判断更新完后是否满足条件，比如count<k
        3.如果满足的话，可以进行一些处理，如果是求最小长度之类的，会在满足时进行操作
        4.如果不满足的话，也需要进行一些处理，比如求最大长度之类的，会在此时进行操作
     以上3,4条常见的操作就是一个while循环，进行左边界begin的收缩处理，一直到收缩到满足/不满足条件为止
    }
}

~~~





### 滑动窗口最大值

给定一个数组和一个大小w的窗口，窗口从数组左边滑到右边，每次滑一个位置记录当前窗口的最大值，如果数组长度n，则返回一个n-w+1的数组记录窗口各个位置的最大值。
输入 4 3 5 4 3 3 6 7   输出 5 5 5 4 6 7

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210302123556.png" alt="image-20210302123549025" style="zoom:80%;" />



用单调队列，时间O(n)，空间O(n)

单调队列什么时候需要pop？单调队列的队首保存的是最old的元素的下标，而i表明的是当前访问的元素的下标。所以说，当前i-q[0]==窗口size+1的时候，说明单调队列中的队首元素已经过期了，需要pop    不是根据窗口的size(即使窗口满了，但也可能max是刚刚加进去的)，也不是根据队列的size
什么时间需要产生窗口的max？下标超出一定范围之后，每个下标都需要

~~~js
var maxSlidingWindow = function (nums, k) {
    let res = [];
    let q = []; // 单调队列，从大到小
    for (let i = 0; i < nums.length; i++) {
        while (q.length > 0 && nums[q[q.length - 1]] <= nums[i]) {
            q.pop();
        }
        q.push(i); // 每个元素必须添加到队列中
        if (i - q[0] + 1 == k + 1) { // 当此时的容量=最大容量+1的时候 需要退出数据 此时的容量怎么判断?当前最新的数据下标-最旧的数据下标+1，就是容量
            q.shift(); // 判断窗口的容量超限不能根据单调队列的size来判断，q中的数据量不能反映出窗口中的数据量
        }
        if (i >= k - 1) { // 当下标在[k-1, ...，每次移动就需要保存一项
            res.push(nums[q[0]]);
        }
    }
    return res;
};
~~~



---

### 差值小于aim的子数组数量



<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210302125536.png" alt="image-20210302125536101" style="zoom:80%;" />



暴力枚举，一共有O(n^2)个数组，每个数组求极差，一共时间O(n^3)
要求时间O(N)

快速求子数组的最大值，最小值，**用两个单调队列**
利用结论
1 小数组的极差超限，大数组的极差一定超限
2 大数组的极差不超限，小数组的极差一定不超限

思路
i=0，j从0不停地向右扩，对应子数组下标从i到j，直到子数组的极差超过aim，统计累加(j-i)，就是所有从0开始的满足条件的子数组的个数
i=1，i=2，...

```js
/**
 * 整体思路和暴力算法一样，枚举左边界和右边界，不停向右扩，扩的同时用滑动窗口求解max和min，直到无法扩
 * 无法扩右边界的时候说明此时以i开头的满足条件的数组已经统计完毕；进行i++即将开始下个位置的统计，需要提前看看qmax和qmin[0]是不是i，如果是就需要pop i
 */
function GetNum3(arr, num) {
    if (arr.length == 0 || arr == null) {
        return 0;
    }
    let res = 0;
    let j = 0;
    let qmax = []; // 两个单调队列
    let qmin = [];
    for (let i = 0; i < arr.length; i++) {
        while (j < arr.length) { // R不停的向右扩，直到扩不动，统计以i开头，j结尾的数组的子数组的个数
            while (qmax.length > 0 && arr[qmax[qmax.length - 1]] <= arr[j]) { // CNM！ 这两个是while循环！ 不是if！
                qmax.pop(); // qmax和qmin虽然不允许数值重复，但是保存的永远是最新的
            }
            qmax.push(j);
            while (qmin.length > 0 && arr[qmin[qmin.length - 1]] >= arr[j]) { // CNM！ 这两个是while循环！ 不是if！
                qmin.pop();
            }
            qmin.push(j);
            if (arr[qmax[0]] - arr[qmin[0]] > num) {
                break;
            }
            j++; // 扩的前提是max-min<=num
        }
        // j不能再扩的时候进行统计
        res += j - i; // 由于j推出循环的时候刚好不满足扩充条件，所以j-i刚好就是子数组的个数
        if (qmax[0] == i) { // 当qmax[0]==i，由于我们下一步要求解 i++ 后 以i开始的数组，因此数据过期，将过期数据退出
            qmax.shift();
        }
        if (qmin[0] == i) {
            qmin.shift();
        }
    }
    return res;
}
```



---



### 和至少为K的最短子数组

[LC 862](https://leetcode-cn.com/problems/shortest-subarray-with-sum-at-least-k/)

给定数组和边界值aim，找出和大于等于aim的最短子数组

题目中的数据正负均可

这道题不存在类似规律：
累加和满足条件的子数组，外扩之后未必满足条件（arr[i]正负均可）
累加和不满足条件，内缩之后仍然未必满足条件



如果题目的数据都是正数，用双指针O(n)时间，O(1)空间就能求解

更加简洁的解法

~~~c++
int minSubArrayLen(int s, vector<int>& nums) {
    int sum = 0;
    int begin = 0,end = 0;
    int res = INT_MAX;
    while(end<nums.size()){
        sum += nums[end++];
        while(sum>= s){//更新左边界
            res = min(res,end-begin);
            sum -= nums[begin++];
        }
    }
    return (res==INT_MAX)?0:res;
}
~~~



### ==无重复字符的最长子串==

给定一字符串求无重复字符的最长子串的长度

输入 abcdae         输出 5

解法一，双指针+hashset，时间O(n)，空间O(size)
解法二，双指针+hashmap，时间O(n)，空间O(size) 实际上会比解法一要快，用hashmap存储对应字符最新出现的位置，从而加速i的遍历 [参考解法三](https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/solution/zi-jie-leetcode3wu-zhong-fu-zi-fu-de-zui-chang-zi-/)

关键一点，遍历的终止条件是什么，==j每次递增，到头就退出循环==
指针i，全靠mp来进行移动，==i不允许回退！i代表的是不包含重复字符的起始位置==

```js
// 解法一 双指针+hashset
var lengthOfLongestSubstring = function (s) {
    let map = new Set();
    let j = 0;
    let i = 0;
    let res = 0;
    while (i < s.length) { // 双指针+hashset，时间O(n) 空间O(size)
        while (j < s.length && !map.has(s[j])) {
            map.add(s[j]);
            j++;
        }
        res = Math.max(res, j - i);
        if (j == s.length) {
            break;
        }
        while (map.has(s[j])) {
            map.delete(s[i]);
            i++;
        }
    }
    return res;
};
// 解法二 双指针+hashmap
var lengthOfLongestSubstring = function (s) {
    let map = new Map();
    let res = 0;
    for (let i = 0, j = 0; j < s.length; j++) {
        if (map.has(s[j])) {
            i = Math.max(map.get(s[j]) + 1, i); // 这里有难度，如果仅仅i=map.get(s[j])+1，会有错误样例 只有找到的字符下一个位置在当前start后面才更新 例如abba
        }
        res = Math.max(res, j - i + 1);
        map.set(s[j], j); // 设置字符s[j] 出现的最新位置
    }
    return res;
};
```



~~~c++
int maxDiffString(string s) {
	int end = 0, ans = 0, start = 0;
	unordered_map<char,int> help;
	while (end < s.length()) {
		if (help.find(s[end]) == help.end()) 
			help.insert({ s[end], end });
		else {
			ans = max(ans, end - start);
			if (help[s[end]] + 1 >= start)//找到的字符下一个位置在当前start后面才更新 abba
				start = help[s[end]] + 1;
			help[s[end]] = end;
		}
		end++;
	}
	return max(ans, end - start);
}

~~~



----

## Part 3  ==单调栈==



简历和面试的项目

不要介绍项目的业务，而要介绍项目中的技术。技术的使用能力。

如果没有时间。知名的开源项目，spark（分布内存，用于大规模的分布式计算），hadoop，未必要用到项目中，而是“造”项目。项目不一定要写出来，用到。技术模块是重点。



面试算法的过程中

思考题目的解法，最好边思考边说出来自己的想法思路。而不是闷头想解法。



### 左右两边最邻近的大数下标

给定一个数组，求出每个位置离他左边最近和右边最近比他大的数，没有的话记为-1

输入：1 2 3     输出  左 -1 -1 -1  右 2 3 -1



暴力法遍历每个位置然后向两边扩，时间复杂度O(N^2)
单调栈，**时间O(N)，空间O(N)** 



**特殊情况的处理**

数组元素相等，(下标，下标)->元素，整体入栈



**原理的解释**

从左到右遍历数组，当前元素小于等于栈顶元素的时候**（遵循单调性的时候），当前元素入栈**
当前元素大于栈顶元素的时候，弹出栈顶，弹出元素的右边更大者就是当前遍历到的元素，左边更大者就是栈中下一个元素（如果栈里没东西，左就是空）**违背单调性的时候，弹出栈顶并处理，直接得到栈顶元素的左边更大者，右边更大者（更小者）**

数组遍历完了，栈中如果还有元素，那么对于这些元素而言，只有左边更大者，没有右边更大者。不断弹出，直到栈空即可。

单调栈实际上就是字面意思，一个普通栈，再加上单调性。每个数**出栈的时候求左右两边的更大者**。只不过利用栈的单调性直接就求出了每个元素的左边更大者的下标，也就是说不用单独计算左边更大者的下标；当违背单调性的时候，就直接得到了右边更大者的下标。





利用单调栈，保证从栈底到栈顶从大到小。遍历每个数每个数都要进栈，当即将进栈的元素小于等于栈顶元素时，直接进栈。当即将进栈元素大于栈顶元素时，为了保持单调栈栈顶元素出栈，这时候我们就可以发现，出栈元素右边最近的大数就是即将进栈元素，左边最近的大数就是栈里面它下面的数，它下面没有数说明左边没有大数。全部数据进栈完成后，如果栈不为空，那么没有元素再进栈了，就是说右边没有元素了，这时候单调栈里面的元素右边都没有大数，左边的大数就是自己底下的数，**每个数出栈时判断左右的大数**。这个过程每个元素进栈出栈各一次，**时间复杂度`O(N)`，空间复杂度`O(N)`**。

~~~c++
void nearBigNum(int a[], int length, int* &leftBigNum, int* &rightBigNum) {
	stack<int> help;
	leftBigNum = new int[length];
	rightBigNum = new int[length];
	for (int i = 0; i < length; ++i) {
		while (!help.empty() && a[i] > a[help.top()]) {
			int temp = help.top();
			help.pop();
			rightBigNum[temp] = a[i];
			leftBigNum[temp] = (help.empty()) ? -1 : a[help.top()];
		}
		help.push(i);
	}
	while (!help.empty()) {
		int temp = help.top();
		help.pop();
		rightBigNum[temp] = -1;
		leftBigNum[temp] = (help.empty()) ? -1 : a[help.top()];
	}
}
~~~





---

### 直方图找的最大矩形

用一个从小到大的单调栈，就可以解决了。

用**单调栈来求出每个元素左右临近的更小者的下标**，从而求出每个位置上的矩阵面积，从而求出最大矩阵的面积。

> https://leetcode-cn.com/problems/largest-rectangle-in-histogram/submissions/



### 最大矩形问题

给定一个矩阵数组，值只有0和1。只有1能组成矩形，求出包含的矩形中的最大面积，包含1个1，面积为1。

<img src="https://assets.leetcode.com/uploads/2020/09/14/maximal.jpg" style="zoom:67%;" >

思路，数组直方图解决最大矩形面积，时间O(N)
最大矩阵面积，不断累加，每次形成，那么就调用上述O(N)函数求解数组。重复m次，一共时间O(M*N)

关键一点

```
line[j + 1] = (matrix[i][j] == '0') ? 0 : line[j + 1] + 1;
```

>https://leetcode-cn.com/problems/maximal-rectangle/submissions/





>分析：解决这个问题先解决一个问题：给一个数组，每个位置代表这个位置的高度，求解这个数组所表示的最大矩形面积。以下图为例，最大矩形为3*3=9。这就是一个找最近小数的过程，找矩形面积重要的是看看每个位置能不能向两边扩展，如果左右两边比它高就可以扩展否则不能扩展。这就转化为求解距离他最近的比他小的数位置，利用单调栈`O(N)`时间内即可求出，左右位置，作差乘以当前位置高度即为矩形面积。
>
>那么接下来，我们对将给的矩阵按行分为一行一行的，求解以每一行为底的最大矩形面积，取最大值即为所求。这里第一行高度数据可以直接利用矩阵的第一行，从第二行开始就和它的上面一行有关系，如果它为0，不管他上面有没有，底为0表示的高度只能为0，底不为0，就加上上面位置的高度，这样就能求出以每一行为底的最大矩形面积，取最大值即为所求。**时间复杂度`O(M*N)`**，非常快，相当于遍历矩阵一次就出来了
>
>





---

### 环形山问题

给定一个数组，表示一个环形山峰，数值表示山峰高度。定义两条规则：1)相邻的位置可见  2)两位置之间没有比两位置高度最小值高的山峰可见，山峰高度可相同。不满足规则的都不可见，求可见山峰对数量(1,2)(2,1)算一对

**信息体（山峰的idx，相等高度山峰出现的次数）**，利用**单调栈求出的是左右两边更高山峰的idx和数量**

**入栈**：根据当前元素的高度 和 栈顶元素的高度

1. 高度相同，栈顶元素数量++
2. 符合从高到低，入栈
3. 违背从高到低，栈顶弹出，进行计数（ck2+2\*k）Ck2（同高度能够相互看见的数量）+2*k（左右两边更高者）

遍历完毕，栈中仍然有数据：

1. 栈数据量大于2（右边最高山峰是stack[0]，左边最高山峰不是stack[0]），弹出，正常计数
2. 数据量==2（左右两边最高山峰都是stack[0]，需要考虑stack[0]的数量），弹出，计数+ck2，如果栈底数量=1，那么计数+k；否则，计数+2k
3. 栈底，计数ck2



这次单调栈存一个特殊的结构，里面存**山峰位置和当前遍历的长度中相等山峰高度的数量**。我们计数时山峰对只记录第一个山峰小于等于第二个山峰的山峰对，否则会有重复
那么根据单调栈，栈底元素和最后的栈顶元素是没有左边或者右边的大数的，但是本题要求循环山峰，所以左边右边应该要找，那么从哪里开始遍历就需要考虑。

我们先把山峰高度最大值放进单调栈，这样保证了之后任何值左右两边都能找到大数。
那么现在**某个数出栈时，说明要计数(出栈逻辑仍然是遇到更大者，违背了单调栈的单调性时出栈)**了，已知**左右两边找到了两个大数**，假设这座山峰出现次数k，山峰对由两部分组成，一部分是k个相同的山峰之间的山峰对，那么就有`C(2,K)`对，第二部分是k个相同山峰都可以向左向右找到两边的大数，那么就有`2*K`对，一般情况就`C(2,K)+2*K`对。

当遍历数组一次后，依次出栈
首先由于循环，出栈的每个元素右边的大数都为stack[0]，当stack.length>=2的时候，左边更大者一定不会是stack[0]，正常计数这样还是`C(2,K)+2*K`对。
如果stack.length==2的时候，那么出栈元素的左右大数均为最高山峰，如果最高山峰次数=1，计数ck2+k；次数>1，正常计数
接下来最大值山峰出栈，它只能找和自身高度相等的山峰组成山峰对，所以直接`C(2,K)`即可。



如果**所有山的高度都不相同**，一共有n个山峰，那么一共有2*n-3对山，可以互相看见。

n=1,0对；n=2,1对；n=i，(2*i-3)对

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210304194014.png" alt="image-20210304194014419" style="zoom:80%;" />

证明

一定有最高和次高的两个山峰，对于剩余的(n-2)个山峰，每个山峰，到左边一定有一个山峰比自己高；到右边一定有一个山峰比自己高。于是(n-2)*2。另外对于最高和次高，又是一对。一共(2\*n-3)对。

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210304194040.png" alt="image-20210304194040767" style="zoom:80%;" />



如果**存在相同高度的山峰**

遍历数组的时候的逻辑：
比如，5,4,4,4,4,5 ，对于中间的4个高度为4的山峰，彼此之间都能够看见，有$C_4^2$对山峰，另外考虑高度为4的山峰和高度为5的山峰，高度为4的山峰个数4*2（左边一对，右边一对）一共8对。
如果只出现1次，那么就是左边+右边一共2对；否则就是$ C_{times}^2 + times \times 2$对

怎么使用单调栈？

一定要用最大值作为栈底，只有这样才能保证左边和右边都有比value大的。

数组遍历完毕的时候：

1. 如果栈中存在3条或者更多记录：
   当次数times>=2的时候，那么按照$C_{times}^2+times\times2$结算；times=1的时候，按照2结算。
2. 对于栈底的第2条记录(value,times)：需要考虑栈底，也就是最大值的数量，第二条记录出现的次数为k
   如果栈底(bottom,bot_times)的bot_times>1次，也就代表顺时针和逆时针都有两个不同的、高度为bottom的山峰。如果倒数(values,times)中的times>=2，按照 $C_k^2+k*2$ 计算；times=1，按照2对结算。
   如果栈底(bottom,bot_times)的bot_times=1，也就代表最高山峰只有一个，那么一共有$C_k^2+k*1$对；如果k=1，那么按照1对结算。
3. 栈底结算的时候，如果只有times=1，那么0对；如果times>1，那么按照$C_k^2$结算



# 第十讲		

## Part 1  Morris遍历



正常情况下遍历二叉树，无论递归还是迭代，时间O(N)，空间O(h)，N是节点个数，h是树的高度
而通过Morris遍历二叉树，时间复杂度`O(N)`，==空间复杂度`O(1)`==，N是二叉树节点的个数

Morris遍历规则 当前节点记作cur
1 cur无左子树，cur进入右子树，cur=cur.right
2 cur有左子树，找到cur左子树的最右边节点，记作mostright
	1) 如果mostright的right指针为空，指向cur，cur进入左子树cur=cur.left
	2) 如果mostright的right指针指向cur，恢复为空，cur进入右子树cur=cur.right

Morris遍历的本质
节点没有左子树，只能到达该节点一次(对应于递归遍历的前两次)
节点有左子树，那么能到达该节点两次，并且第二次到达该节点的时候，左子树所有节点全部遍历完毕；

递归先序/中序/后序遍历的本质
内存访问顺序都一样，每个节点都访问3次，区别在于：
先序，是第1次访问节点的时候打印
中序，是第2次访问节点的时候打印
后序，是第3次访问节点的时候打印

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210306173335.png" alt="image-20210306173328696" style="zoom:80%;" />

回顾一下递归的遍历
Pre: 当前 左 右
In: 左 当前 右
Pos: 左右 当前

如果当前节点没有left，那么pre和in都是 当前-右，说明什么？

如何根据递归遍历改写出Morris遍历？
先序，第1次访问打印当前节点。对于有left的节点，一共访问两次，第一次访问的时候打印即可；对于无left的节点，morris只会达到1次，但是类似于2次都

正常情况下，无视掉先序中序后序遍历，每个节点只要非空，都会到达三次。把打印行为放到第一次到达这个节点，就是先序；第二次到达这个节点的时候打印，中序；第三次到达这个节点的时候打印，后序。本质上都是上面的这个遍历过程。
Morris遍历，一个节点有左子树，可以到达当前节点两次；如果没有左子树，只能到达当前节点一次。无论如何不会第三次回到自己。利用左子树上的最右指针来决定是第一次来到cur节点还是第二次。最右指针为空，则第一次来到cur节点；最右指针指向cur，则第二次返回到cur节点。

Morris第一次到达的时候打印，就是先序；



Morris遍历规则： **本质上是二叉树的线索化，利用叶子的空指针指向后继，遍历过后恢复**

1. cur无左孩子，cur向右移动，`cur=cur->rchild`
2. cur有左孩子，找到cur左子树上的最右结点，即为MostRight。
3. 如果MostRight的右孩子指向空，让其指向cur，cur向左移动，`cur=cur->lchild`
4. 如果MostRight指向cur，让cur指向空，cur向右移动，`cur=cur->rchild`

根据Morris规则，有左孩子的结点会遍历两次，遍历左子树再顺着左子树的最右边结点的线索找回来，同时复原叶子结点，我们选择合适的时机打印cur的值就可以做到二叉树的前中后序遍历。

### 前序

~~~c++
void MorrisTraversePre(BiTree T) {
	if (T == NULL)
		return;
	BiTNode* cur = T, * mostRight;
	while (cur != NULL) {
		if (cur->lchild != NULL) { 
            //cur has left-child, traverse second times, print cur at the first time
			mostRight = cur->lchild;
			while (mostRight->rchild != NULL && mostRight->rchild != cur)
				mostRight = mostRight->rchild;
			if (mostRight->rchild == NULL) {
                //arrive at cur first time, mostRight point to NULL
				cout << cur->data << " "; 
				mostRight->rchild = cur;
				cur = cur->lchild;
				continue;
			}
			else //arrive at cur second times, mostRight point to cur
				mostRight->rchild = NULL; 
		}
		else //cur has not left-child, traverse only once, so print cur
			cout << cur->data << " "; 
		cur = cur->rchild;
	}
}
~~~



### 中序

~~~c++
void MorrisTraverseIn(BiTree T) {
	if (T == NULL)
		return;
	BiTNode* cur = T, * mostRight;
	while (cur != NULL) {
		if (cur->lchild != NULL) { 
		//cur has left-child, traverse second times, print cur at the second time
			mostRight = cur->lchild;
			while (mostRight->rchild != NULL && mostRight->rchild != cur)
				mostRight = mostRight->rchild;
			if (mostRight->rchild == NULL) {
				mostRight->rchild = cur;
				cur = cur->lchild;
				continue;
			}
			else //arrive at cur second times, mostRight point to cur
				mostRight->rchild = NULL; 
		}
        //cur has not left-child, traverse only once, so print cur
		cout << cur->data << " "; 
		cur = cur->rchild;
	}
}
~~~



### 后序

按右边界划分二叉树，第二次访问cur时打印左子树的右边界的逆序。我们结点是顺序的，不能用额外的空间比如栈去存，所以我们定制一个`printEdge()`先将右边界逆序，就是链表的逆置，然后正常打印，最后复原树。

**打印时机：只关注能够到达2次的节点（左子树非空的节点），逆序打印该节点的左子树的右边界。然后单独打印整棵树的右边界，从而实现Morris后序**

~~~c++
typedef struct BiTNode {
	int data;
	BiTNode* lchild;
	BiTNode* rchild;
}BiTNode, * BiTree;

void printEdge(BiTree T) {
	BiTNode* parent = T, * child, * grandParent = NULL;
	while (parent != NULL) { //先把右边界逆序
		child = parent->rchild;
		parent->rchild = grandParent;
		grandParent = parent;
		parent = child;
	}
	parent = grandParent;
	while (parent != NULL) { //逆序打印右边界
		cout << parent->data << " ";
		parent = parent->rchild;
	}
	parent = grandParent;
	grandParent = NULL;
	while (parent != NULL) { //恢复右边界
		child = parent->rchild;
		parent->rchild = grandParent;
		grandParent = parent;
		parent = child;
	}
}

void MorrisTraversePos(BiTree T) {
	if (T == NULL)
		return;
	BiTNode* cur = T, * mostRight;
	while (cur != NULL) {
		if (cur->lchild != NULL) {
			//cur has left-child, traverse second times, print cur at the second time
			mostRight = cur->lchild;
			while (mostRight->rchild != NULL && mostRight->rchild != cur)
				mostRight = mostRight->rchild;
			if (mostRight->rchild == NULL) {
				mostRight->rchild = cur;
				cur = cur->lchild;
				continue;
			}
			else {
                //arrive at cur second times, mostRight point to cur
				mostRight->rchild = NULL; 
				printEdge(cur->lchild);				
			}				
		}
		cur = cur->rchild;
	}
	printEdge(T);
}
~~~



### 用Morrs遍历解决重构搜索二叉树的判断

原来的搜索二叉树的判断是非递归版中序遍历，要用额外的空间，用Morris遍历来优化。

~~~c++
bool isBSTMorris(BiTree T) {
	if (T == NULL)
		return false;
	BiTNode* cur = T, * mostRight;
	int temp=-999;
	while (cur != NULL) {
		if (cur->lchild != NULL) {
			//cur has left-child, traverse second times, print cur at the second time
			mostRight = cur->lchild;
			while (mostRight->rchild != NULL && mostRight->rchild != cur)
				mostRight = mostRight->rchild;
			if (mostRight->rchild == NULL) {
				mostRight->rchild = cur;
				cur = cur->lchild;
				continue;
			}
			else 
				mostRight->rchild = NULL; //arrive at cur second times, mostRight point to cur			
		}
		if (temp > cur->data)
			return false;
		temp = cur->data;
		cur = cur->rchild;
	}
	return true;
}
~~~





---

### AVL树

搜索二叉树，每个节点的值不同，因为相同值，可以在同一个节点中用链表进行存储



hashmap中的key是不关注排序的，也就是key是散乱的。哈希表**增删改查都是O(1)**
treemap中的key是按照某个规则进行排序的，也就是红黑树组织的key。treemap的增删改查和树的高度有关，平衡的搜索二叉树，**增删改查是O(logn)**
增删改查实际上都是一回事
如果不维持搜索二叉树的平衡性，那么树的平衡程度取决于输入数据的规律

所有**平衡树**的增删改查都是O(logn)，下面是几个常见的平衡树：

- AVL，严格平衡，任何子树左右高度差不超过1
- 红黑树，对平衡性进行了阉割，头结点叶节点必为黑，任何链上（路径，从根节点到叶节点）的红色不能相邻，任何链上的黑色节点要求数量一样=>从而最长的链不超过最短的链的长度2倍
- SB树，对平衡性有单独的处理。

平衡性的处理，都是为了让左右子树的节点数量接近，从而保证增删改查的效率O(logn)而不是O(n)。平衡性的阉割，降低了平衡性调整的频率，不用频繁调整平衡树。



**不兼顾平衡性的BST**，增删改查相对容易。比较有难度的是deleteNode这个操作。

待**删除的节点**
普通情况，只有一个子节点，直接将子节点顶替待删除节点即可
特殊情况，**左右子节点双全**。
如果待删除节点的右子树只有一个节点，也就是右子树的最左节点的父节点就是待删除节点，这种情况下直接用这个节点顶替掉待删除节点即可；否则，将最左节点（记作successor）的right交托给successor的parent，然后顶替掉待删除节点，接管待删除节点的左右子树即可。（这个节点没有左子树，可能有右子树，如果有右子树，把右子树交由最左节点的父节点接管：该怎么理解？找到最左节点，是为了保证这个节点的左右指针至少有一个为空，待会顶替掉待删除节点之后，非空指针被接管即可）

```java
	protected Node delete(Node deleteNode) {
		if (deleteNode != null) {
			Node nodeToReturn = null;
			if (deleteNode != null) {
				if (deleteNode.left == null) {
					nodeToReturn = transplant(deleteNode, deleteNode.right);
				} else if (deleteNode.right == null) {
					nodeToReturn = transplant(deleteNode, deleteNode.left);
				} else { // 待删除节点有两个child
					Node successorNode = getMinimum(deleteNode.right);
					if (successorNode.parent != deleteNode) { // 待删除节点右子树有多个节点
						transplant(successorNode, successorNode.right);
						successorNode.right = deleteNode.right;
						successorNode.right.parent = successorNode;
					}
					transplant(deleteNode, successorNode); // 待删除节点右子树只有一个节点
					successorNode.left = deleteNode.left;
					successorNode.left.parent = successorNode;
					nodeToReturn = successorNode;
				}
				size--;
			}
			return nodeToReturn;
		}
		return null;
	}
```





**AVL树**

维持平衡性的基本动作，**右旋（顺时针旋）**

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210311170344.png" alt="image-20210311170337741" style="zoom: 50%;" />

维持平衡性的基本动作，**左旋（逆时针旋）**

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210311170413.png" alt="image-20210311170413292" style="zoom: 50%;" />

```java
    protected Node rotateLeft(Node node) {
        Node temp = node.right;
        temp.parent = node.parent;

        node.right = temp.left;
        if (node.right != null) {
            node.right.parent = node;
        }

        temp.left = node;
        node.parent = temp;

        // temp took over node's place so now its parent should point to temp
        if (temp.parent != null) {
            if (node == temp.parent.left) {
                temp.parent.left = temp;
            } else {
                temp.parent.right = temp;
            }
        } else {
            root = temp;
        }
        
        return temp;
    }
```



AVL，插入，删除，可能会产生不平衡，因此首先需要解决的是**怎么发现添加/删除过程中的不平衡？**。节点**记录（左树的高度和右树的高度）**，**当前节点的高度**。
如何发现不平衡？添加节点的时候，会向上回溯，更新每个祖先节点的相应子树高度，直到某层祖先节点发现左右子树的局部不平衡。这就发现了不平衡。**需要调整**

LL型和RR型，单一动作左旋或者右旋即可解决平衡。
LR型和RL型，左旋+右旋或者右旋+左旋即可。

LL型，左旋即可

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210311185914.png" alt="image-20210311185913990" style="zoom:80%;" />

LR，

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210311190137.png" alt="image-20210311190136945" style="zoom:80%;" />

平衡二叉树，考察的时候，不会考手撸，会考怎么使用这个结构

仅仅通过key得到value，没必要用treemap，用hashmap即可。
不仅需要k,v，还需**要key是有序组织**的，就需要用平衡BST，比如treemap，可以有序查找key，时间O(logn)，比如以下操作，如果用hashmap，需要O(n)

```java
treeMap.firstKey();
treeMap.lastKey();
treeMap.ceilingKey(12);
treeMap.floorKey(12);
```





## Part2 

### LRU

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210313113557.png" alt="image-20210313113556952" style="zoom:80%;" />

哈希表+双向链表

```cpp
class LRUCache {
private:
    int sz;
    list<pair<int,int>> l;
    unordered_map<int,list<pair<int,int>>::iterator>mp;
public:
    LRUCache(int capacity) {
        sz=capacity;
    }
    
    int get(int key) {
        // mp找不到迭代器 返回-1
        if(mp.count(key)==0)return -1;
        // mp找到迭代器，
        //  1 获取kv对
        pair<int,int> kv=*mp[key];
        //  2 从list中移除
        l.erase(mp[key]);
        //  3 添加到list表头
        l.push_front(kv);
        //  4 mp映射到表头
        mp[key]=l.begin();
        return kv.second;
    }
    
    void put(int key, int value) {
        // 已存在的kv
        //  1 获取mp对应的迭代器
        //  2 从list中移除
        //  3 添加到表头
        //  4 mp映射key到表头
        if(mp.count(key)==1)
        {
            l.erase(mp[key]);
            l.push_front({key,value});
            mp[key]=l.begin();
        }
        // 不存在的kv
        //  1 容量不够{ 获取list.back()对应的key，从mp中移除，从list中移除 }
        //  2 添加kv到list，mp映射key到表头
        else{
            if(l.size()==sz)
            {
                mp.erase(l.back().first);
                l.pop_back();
            }
            l.push_front({key,value});
            mp[key]=l.begin();
        }
    }
};
```



map或者set，如果是自定义的结构，一定不会把结构存放到map中，而是说把结构的引用存放到map中。对于基础数据类型，java会直接把value存放到map中。

```js
// JS LRU
function LFU( operators ,  k ) {
    let map=new Map();
    let len=0;
    let res=[];
    let sz=k;
    for(let i=0;i<operators.length;i++){
        if(operators[i][0]==1){
            set(operators[i][1],operators[i][2]);
        }else{
            res.push(get(operators[i][1]));
        }
    }
    function set(k,v){
        if(map.has(k)){
            map.delete(k);
        }else if(len>=sz){
            map.delete(map.keys().next().value);
        }else{
            len++;
        }
        map.set(k,v);
    }
    function get(k){
        if(!map.has(k)){
            return -1;
        }
        let v=map.get(k);
        map.delete(k);
        map.set(k,v);
        return v;
    }
    return res;
}
```





### LFU

要求**set和get的时间都是O(1)**

set get 如果都是操作已有的数据，那么对应数据的cnt++
get操作没有的数据，返回-1
set添加新的数据，如果容量不超限，直接添加数据，数据相应的cnt=1
set添加新数据，容量超限，优先移除cnt最小的数据，如果有多个cnt相同的数据，移除掉最久没有访问过的数据

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210313113043.png" alt="image-20210313113036048" style="zoom:80%;" />

如果操作次数都相同，那么就类似于LRU，移除掉最不经常访问的

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210313113816.png" alt="image-20210313113816544" style="zoom:80%;" />

结构设计，双向链表下面挂双向链表，横向的链表从head到tail，访问次数逐渐增加。每个节点挂了个链表，是按照LRU吗？如果set之后，新添加的放到tail中，如果超出容量需要移除，移除head即可。

如果采用数组结构的话，get和set都是O(N)的





### 字符串表达式求计算结果（难！没有完成）

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210313114958.png" alt="image-20210313114958208" style="zoom:80%;" />

可以考虑用栈

考虑两种情况，整个表达式中不包括()，以及，存在()

如果不包括()的表达式：那么运算只有加减乘除，用一个栈同时保存数字和运算符，如果当前要将加号入栈，同时第一个符号是乘除，那么就弹出两个数进行乘除运算之后，和加减号一块入栈。也就是说，用栈将所有的乘除处理完毕，然后统一计算加减。



表达式中存在括号的情况：从指定的idx开始，遇到右括号或者到达整个字符串的结束，计算这部分下标的元素结果

从0开始，遇到左括号，调用子过程f(idx)，返回值，遇到的右括号的位置，以及当前子表示的运算结果





### 跳表

跳表完成的功能类似于平衡BST，只存储key-value，key按序组织

常见的API比如，获取最大的key，获取最小的key，范围获取key，获取距离某个key最近的key等等

类似于平衡BST，代价也是O(logn)

https://www.jianshu.com/p/9d8296562806

这篇文章讲解的很详细，跳表实际上就是以空间换时间，对链表进行加速，链表添加删除O(1)，查找O(n)。跳表建立多级索引，添加，查找，删除，都是O(logn)。额外空间O(n)





# 第十二讲

## 动态规划进阶



### 换钱的方法数

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210315013922.png" alt="image-20210315013922290" style="zoom:80%;" />



即使是dfs，也是暴力搜索，存在太多重复计算了。

完全背包





### 排成一条线的纸牌博弈问题（非常难！）

贪心不出来就暴力求解，然后dp优化

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210315122618.png" alt="image-20210315122611228" style="zoom:80%;" />



### 机器人走路

1-N位置，机器人一开始在M位置，如果在1那么只能右走；如果在M那么只能左走；中间位置既可以向左又可以向右走。一开始在M位置，有多少种方法可以经过P步，到达K位置

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210315142533.png" alt="image-20210315142526450" style="zoom:80%;" />

从递归改出DP很容易，但是最重要的是先写出暴力尝试

```js

/**
 * 
 * @param {*} N 一共有1~N位置
 * @param {*} M 当前处于M位置
 * @param {*} P 还可以走P步
 * @param {*} K 最终目的地
 * 暴力递归
 */
function ways(N, M, P, K) {
    // 过滤无效情况
    if (N < 2 || M < 1 || M > N || P < 0 || K < 1 || K > N) {
        return 0;
    }
    if (P == 0) { // 最终达到K，返回1；否则返回0
        return M == K ? 1 : 0;
    }
    let res = 0;
    if (M == 1) { // 来到最左边，只能向右
        res += ways(N, M + 1, P - 1, K);
    } else if (M == N) { // 来到最右边，只能向左
        res += ways(N, M - 1, P - 1, K);
    } else { // 两边都能走
        res += ways(N, M + 1, P - 1, K) + ways(N, M - 1, P - 1, K);
    }
    return res;
}

/**
 * 可变参数，M，P
 * M范围1-N M表示当前所在的位置
 * P范围0-P
 * 初始化边界
 * dp[i][j]表示从j位置经过i步到达K的种类数
 */
function waysDP(N, M, P, K) {
    if (N < 2 || M < 1 || M > N || P < 0 || K < 1 || K > N) {
        return 0;
    }
    let dp = new Array(P + 1);
    for (let i = 0; i < dp.length; i++) {
        dp[i] = new Array(N + 1).fill(0);
    }
    // base case
    dp[0][K] = 1;
    for (let i = 0; i < P; i++) {
        for (let j = 1; j <= N; j++) {
            dp[i + 1][j - 1] += j > 1 ? dp[i][j] : 0;
            dp[i + 1][j + 1] += j < N ? dp[i][j] : 0;
        }
    }
    return dp[P][M];
}

// for test
function main() {
    console.log(ways(4, 2, 3, 3), waysDP(4, 2, 3, 3));
}

main();
```



# 第十三讲



## Part1 map

### 大楼轮廓

最大高度的变化，描绘了轮廓的产生和变化

https://www.jianshu.com/p/7fb9f87dbe45

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210311192722.png" alt="image-20210311192722216" style="zoom:80%;" />

其实也不是说非得用Treemap，**用hashmap然后每次遍历一下hashmap就行了**

```js
class Node {
	constructor(pos, height, up) {
		this.pos = pos;
		this.height = height;
		this.up = up;
	}
}

function compare(a, b) {
	if (a.pos != b.pos) {
		return a.pos - b.pos;
	}
	if (a.up != b.up) {
		return !a.up;
	}
	return 0;
}

Map.prototype.LastKey = function () {
	let maxKey = 0;
	this.forEach((v, k) => {
		maxKey = Math.max(maxKey, k);
	})
	return maxKey;
}

function buildingOutline(buildings) {
	let mapHeightCount = new Map(); // (高度，次数)
	let nodes = new Array(buildings.length * 2);
	for (let i = 0; i < buildings.length; i++) {
		nodes[2 * i] = new Node(buildings[i][0], buildings[i][2], true);
		nodes[2 * i + 1] = new Node(buildings[i][1], buildings[i][2], false);
	}
	nodes.sort(compare);
	// console.log(nodes)
	let mapPosMaxheight = new Map();
	for (let i = 0; i < nodes.length; i++) {
		// 用来更新高度的次数
		if (nodes[i].up) {
			if (mapHeightCount.has(nodes[i].height)) {
				mapHeightCount.set(nodes[i].height, mapHeightCount.get(nodes[i].pos) + 1);
			} else {
				mapHeightCount.set(nodes[i].height, 1);
			}
		} else {
			if (mapHeightCount.has(nodes[i].height)) {
				if (mapHeightCount.get(nodes[i].height) == 1) {
					mapHeightCount.delete(nodes[i].height);
				} else {
					mapHeightCount.set(nodes[i].height, mapHeightCount.get(nodes[i].height) - 1);
				}
			}
		}
		// 更新完毕之后，记录每个pos的MaxHeight
		if (mapHeightCount.size == 0) {
			mapPosMaxheight.set(nodes[i].pos, 0);
		} else {
			mapPosMaxheight.set(nodes[i].pos, mapHeightCount.LastKey()); // JS的语言限制，没有TreeMap，这里仅仅是描述一下
		}
	}
	// 至此，得到了mapPosMaxheight，处理一下就能得到最后结果
	let res = [];
	let height = 0;
	let start = 0;
	mapPosMaxheight.forEach((curheight, curPos) => {
		if (height != curheight) {
			if (height != 0) {
				res.push([start, curPos, height])
			}
			start = curPos;
			height = curheight;
		}
	})
	return res;
}

// for test
function main() {
	console.log(buildingOutline([[1, 3, 3], [2, 4, 4], [5, 6, 1]]))
}

main();
```



### <span id="jump1">==累加和为给定值的最长子数组==</span>

https://blog.csdn.net/GoSantiago/article/details/105057408

**数字可正可负可零**

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210311204435.png" alt="image-20210311204434881" style="zoom: 50%;" />

**以每个位置结尾的情况下，累加和=target，那么最长子数组一定在这几种情况之中**

暴力算法，O(n^3)
哈希表，遍历一遍，**时间O(n)，空间O(n)**

数组元素从 0 加到 i 的值为 sum，只需要求 i 之前的数组中，是否出现过和为 sum-num 的情况。例如，`arr = {9,8,3,2,1,1,7,7}，num=7`，当遍历到 i=5 的时候，sum=24，此时 sum-num=24-7=17。因为当 i=1 时，sum=17，所以下标从 2 到 5，数组元素之和肯定为 sum

```js
/**
 * 求累加和为给定值的最长子数组
 * 时间O(n) 空间O(n)，一张哈希表
 * map保存的是每个累加以及相应的位置
 */
function LongestSumSubArrayLength(arr, target) {
    let mapSumIdx = new Map();
    let sum = 0;
    let res = 0;
    mapSumIdx.set(0, -1); // 0这个累加和最早出现在idx=-1，举例比如[999,2,2]，target=999，最长子数组长度=1且为arr[0]的情况
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
        if (mapSumIdx.has(sum - target)) {
            res = Math.max(res, i - mapSumIdx.get(sum - target))
        }
        if (!mapSumIdx.has(sum)) { // 为什么这里只有首次出现的前缀和才进行set?(后续完全可能再次出现，只不过我们是为了求最长子数组，就因此希望，已经出现的前缀和，尽可能的长度短)
            mapSumIdx.set(sum, i);
        }
    }
    return res;
}
```





**题目变形**

### ==包含相同数量的奇数偶数的最长子数组==

求满足条件的最长子数组，要求数组中的偶数和奇数数量相等

思路，奇数记作+1，偶数记作-1，那么就是求最长的子数组，要求子数组累加和=0



关键一点，判断map中是否存在累加和=(sum-0)而不是(0-sum)

```js
/**
 * 包含相同数量的奇数偶数的最长子数组
 * 等价于累加和=0的最长子数组
 */
function sln(arr) {
    if (arr == null || arr.length == 0) {
        return 0;
    }
    let res = 0;e
    let sum = 0;
    let map = new Map();
    map.set(0, -1);
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i] % 2 == 0 ? -1 : 1; // 奇数+1 偶数-1
        if (map.has(sum - 0)) { // 注意这里是判断map中是否存在累加和=(sum-0)而不是(0-sum)
            res = Math.max(res, i - map.get(sum - 0));
        }
        if (!map.has(sum)) { // 同样，为了求**最长**子数组，在哈希表中记录的时候，只登记最先出现的下标（从而保证后续的满足条件的子数组长度尽可能长）
            map.set(sum, i);
        }
    }
    return res;
}
```





### ==子数组异或和为0的最多划分==

[参考](https://blog.csdn.net/MIC10086/article/details/110069535)

给定一个整型数组arr，其中可能有正有负有零。你可以随意把整个数组切成若干个不相容的子数组，求异或和为0的子数组最多可能有多少个？整数异或和定义：把数组中所有的数异或起来得到的值。

动态规划，设 f[i] 表示**在 a[0…i] 上作分割，异或和为0的子数组数量**。假设在 a[0…i] 上存在最优分割，并且最后一个分割数组一定包含 a[i] ，那么这个**最优分割的最后一个子数组只可能有以下两种情况**：

- 最优分割的最后一个子数组，异或和不等于0，此时 f[i]=f[i−1]；
- 最优分割的最后一个子数组，异或和等于0，假设 a[k…i] 是最优分割的最后一个子数组，并且异或和等于0，那么 f[i]=f[k−1]+1，问题变成**如何求 k** ？

假设 arr[0…i] 的异或和为 cur ，只需要知道上一个异或和=cur的位置，就是k的位置。需要用一个==哈希表记录每个异或和最后一次出现的位置==。

```js
/**
 * 子数组异或和为0的最多划分
 */
function mostEOR(arr) {
    let res = 0;
    let xor = 0;
    let mosts = new Array(arr.length).fill(0); // mosts[i] 代表[0-i]上最优划分的异或和=0的子数组数量
    let map = new Map();
    map.set(0, -1);
    for (let i = 0; o < arr.length; i++){
        xor ^= arr[i];
        if (map.has(xor)) {
            let pre = map.get(xor);
            mosts[i] = pre == -1 ? 1 : mosts[pre] + 1;
        }
        if (i > 0) {
            mosts[i] = Math.max(mosts[i - 1], mosts[i]); // 0-i的最优划分一定要优于0到i-1的最优划分
        }
        map.set(xor, i); // 记录当前异或和以及出现的位置
        res = Math.max(res, mosts[i]); // 记录最优划分的数量
    }
    return res;
}
```





### ==子数组的最大异或和==

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210314195357.png" alt="image-20210314195357535" style="zoom:80%;" />



1 暴力算法O(n^3)
2 前缀和数组，优化后，时间O(n^2)，空间O(n)
3 **前缀树**，又叫字典树，时间复杂度O(n)

优化思路是，idx从0到i的异或结果记作`EOR`，为了求解`从start到i`的异或结果`EOR1`，考虑`0到start-1`的异或结果为`EOR2`，实际上`EOR=EOR1^EOR2`，需要考虑异或运算的规律和作用，a^b=c，同时^a，可以得到b=c^a

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210314235438.png" alt="image-20210314235438544" style="zoom:80%;" />



知道这个原理，用数组记录0到i异或运算的结果，用额外的O(n)空间来降低时间复杂度到O(n^2)



## Part2 双指针



### 累加和=给定值的最长子数组

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210315145639.png" alt="image-20210315145639728" style="zoom:80%;" />

不同于之前[那道题](#jump1)，那道题对数字没有要求，可正可负可零，用哈希表记录累加和。
而本题要求数字**全部正数**，可以省去空间，不用map，用双指针，也就是滑动窗口，就可以了。

暴力解法，O(n^2)枚举数组 O(n)子数组求和，共O(n^3)
滑动窗口，时间O(n)，空间O(1)



关键一点，循环变量的起始值？循环变量什么时间退出循环？

>当前窗口内的sum<=target，那么R向右扩，添加数据到窗口内；（其实**等于的情况，L先扩还是R先扩，是等效的**）
>当前窗口内的sum>target，那么L向右扩，从窗口中移出数据。
>
>数组只要扩，累加和一定会增加；只要缩，累加和一定会减小。
>双指针的特点，是为了**省空间**。



```js
/**
 * 求正整数数组中，累加和=给定值的最长子数组的长度
 * 双指针构成滑动窗口，时间O(n)，空间O(1)
 */
function getMaxLength2(arr, k) {
    if (arr == null || arr.length == 0 || k <= 0) {
        return 0;
    }
    let L = 0;
    let R = 0;
    let sum = 0;
    let len = 0;
  // R代表的是下标，合法下标最多为arr.len-1
    while (R < arr.length) {
        if (sum == k) {
          len = Math.max(len, R - L);
          sum -= arr[L++];
        }else if (sum < k) {
            sum += arr[R++];
        } else {
            sum -= arr[L++];
        }
    }
    return len;
}
```





### 累加和>=给定值的最短子数组

LC209

```cpp
class Solution {
public:
    int minSubArrayLen(int target, vector<int>& nums) {
        int res=INT_MAX;
        int sum=0;
        int i=0;
        int j=0;
        while(j<nums.size()){
            sum+=nums[j++];
            while(sum>=target){
                res=min(res,j-i);
                sum-=nums[i++];
            }
        }
        return res==INT_MAX?0:res;
    }
};
```







## Part 3 前缀和





### ==累加和<=给定值的最长子数组==（非常难！）

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210315174333.png" alt="image-20210315174326693" style="zoom:80%;" />

值，**可正可负可零**。

暴力尝试，O(n^3)
而本题，数组扩，累加和未必增加；数组缩，累加和未必减小。

思路，比如中间某个位置i开始的子数组，这个位置上的最小累加和。
以idx=0开始的累加和的最小值，以及最小值对应的右边界
根据给定数组，生成两个辅助数组



fuzhu 

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210316134402.png" alt="image-20210316134355116" style="zoom: 67%;" />

是

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210316140421.png" alt="image-20210316140420984" style="zoom: 67%;" />

示例，arr=[100,200,7,-6,-3,300],aim=7，返回的符合条件的最长子数组的长度=3

```js
/**
 * 最优解，时间O(n)
 * min_sum[idx] 从idx开始投的所有子数组的累加和的最小者
 * min_sum_index[idx] 取得最小累加和的右边界
 */
function maxLengthAwesome(arr, aim) {
    if (arr == null || arr.length == 0) {
        return 0;
    }
    let sums = new Array(arr.length);
    let ends = new Array(arr.length);
    // 生成两个辅助数组
    sums[arr.length - 1] = arr[arr.length - 1];
    ends[arr.length - 1] = arr.length - 1;
    for (let i = arr.length - 2; i >= 0; i--) {
        if (sums[i + 1] < 0) {
            sums[i] = arr[i] + sums[i + 1];
            ends[i] = ends[i + 1];
        } else {
            sums[i] = arr[i];
            ends[i] = i;
        }
    }

    let R = 0;
    let sum = 0;
    let len = 0;
    for (let start = 0; start < arr.length; start++){
        // 数组没有越界，并且累加和<=aim的情况下，不断根据辅助数组，向右扩充
        while (R < arr.length && sum + sums[R] <= aim) {
            sum += sums[R];
            R = ends[R] + 1;
        }
        // 右边界不回退，直接减小左边界，从而加速 类似于双指针滑动窗口
        sum -= R > start ? arr[start] : 0;
        // [start, R-1] 一共R-1 - start +1=R-start
        len = Math.max(len, R - start);
        // 处理R没有向右扩的情况，比如一开始arr[0]就超过了aim
        R = Math.max(R, start + 1);
    }
    return len;
}
```



### 环形单链表的约瑟夫问题

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210316144551.png" alt="image-20210316144551508" style="zoom:80%;" />



这道题通过数学方式，来直接找到最后一个存活的人。



### 字符串匹配问题（非常难！）

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210316152917.png" alt="image-20210316152916959" style="zoom:80%;" />

递归改动态规划



### 异或运算的规律和作用

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210314234837.png" alt="image-20210314234830755" style="zoom:80%;" />