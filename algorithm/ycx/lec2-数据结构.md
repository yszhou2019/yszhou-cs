# 数据结构

## 单链表

采用的实际上是头插法，静态链表

## 双链表

## 栈

## 队列

## 单调栈

最常见应用场景，对于每个数，找到左边或者右边距离最近的（更大者 更小者），如果不存在那么返回-1

**最关键的一点，对于数组中的每个数，在单调栈中找完临近数字之后，都需要入栈**

入栈逻辑：每个数直接入栈
出栈逻辑：栈中有数据并且不满足大小关系，不断出栈

栈里面存的是什么？数据 还是 下标？
存的是数据

每个数都需要不断出栈，找最邻近的数
每个数都需要入栈一次

```cpp
常见模型：找出每个数左边离它最近的比它大/小的数
int tt = 0;
int stk[N];
for (int i = 1; i <= n; i ++ )
{
    while (tt && check(stk[tt], i)) tt -- ;
    stk[ ++ tt] = i; // 最重要的一点，对于数组的每个数，找完最邻近的更小者之后，数组中的每个数都需要入栈
}
```







```cpp
#include <iostream>

using namespace std;
const int N = 1e5+10;

int n;
int st[N]; // 单调栈 内部数据逐渐递增
int tt;

int main()
{
    cin>>n;
    int x;
    while(n--){
        cin>>x;
        while(tt!=0&&st[tt]>=x)tt--; // 退出循环的时候，表明已经找到了栈中的距离最近的更小者
        if(tt==0)cout<<-1<<" ";
        else cout<<st[tt]<<" ";
        st[++tt]=x;
    }
    
    return 0;
}
```





## 单调队列

求一下滑动窗口里面的最大值 和最小值



队列里面存的是什么？是数据 还是 下标？

假设这里的单调队列从head到tail，从大到小（为了求每个滑动窗口的最大值）



遍历数组，数组的每个数，**都必须添加到队列中**

数据进队列逻辑：从q中不断pop即将违背单调性的数据，然后push本数据
（数据要进入队列，必须进入前后仍然满足从大到小的单调性）因此，进队列之前，需要将队列中<=自己的数据不断Pop，然后将当前数据push（数组的每个数据都必须push）
数据出队列逻辑：只有当队列满的时候，才弹出数据，并收集打印（队列不满，不弹出）

一开始，窗口大小没有达到最大：
入队列逻辑：
出队列逻辑：

窗口大小达到最大之后：
入队列逻辑：和之前一样，本数字要入栈，需要将违背单调性的数据全部弹出，然后push本数据
出队列逻辑：队首被pop

```cpp
常见模型：找出滑动窗口中的最大值/最小值
int hh = 0, tt = -1;
for (int i = 0; i < n; i ++ )
{
    while (hh <= tt && check_out(q[hh])) hh ++ ;  // 判断队头是否滑出窗口
    while (hh <= tt && check(q[tt], i)) tt -- ;
    q[ ++ tt] = i;
}
```



```cpp
#include <iostream>

using namespace std;

const int N=1e6+10;

int hh,tt=-1;
int a[N],q[N];

int main()
{
    int n,k;
    cin>>n>>k;
    for(int i=0;i<n;i++) 
    cin>>a[i];
    for(int i=0;i<n;i++)
    {
        while(hh<=tt && a[q[tt]]>=a[i])
        tt--;
        q[++tt]=i;
        if(hh<=tt && i-q[hh]+1>k) 
        hh++;
        if(i+1>=k) 
        cout<<a[q[hh]]<<' ';
    }
    cout<<endl;
    hh=0;
    tt=-1;
    for(int i=0;i<n;i++)
    {
        while(hh<=tt && a[q[tt]]<=a[i]) 
        tt--;
        q[++tt]=i;
        if(hh<=tt && i-q[hh]+1>k) 
        hh++;
        if(i+1>=k)
        cout<<a[q[hh]]<<' ';
    }
    return 0;
}
```







## KMP

## Trie

## 并查集

## 堆

## 哈希表

拉链法
复杂，需要用到3个数组，h数组，e数组，ne数组

需要根据题目的数据量，求出稍大一点的临近的素数作为数组的大小
insert ： 计算hash，然后链表头插
has :  计算hash，然后遍历对应的链表，判断是否存在
delete : （计算hash，然后将对应的数据打标记）



开放寻址法
简单，需要用到的只有一个h数组
数组大小，需要大一点，设置成2-3倍题目数据量稍大一点的素数作为数组的大小，尽量降低冲突可能
insert : 计算hash，然后不断向后，直到找到空位
has : 计算hash，然后遍历，在遍历到空之前，找到就说明存在
delete : （也是计算hash然后打标记）

```cpp
#include <cstring>
#include <iostream>

using namespace std;

const int N=200003, null=0x3f3f3f3f; // null这个数超出题目数据的范围，因此可以当做边界

int h[N];

int find(int x)
{
    int k=(x%N+N)%N;
    while(h[k]!=null && h[k]!=x){
        k++;
    }
    return k;
}

int main()
{
    memset(h,0x3f,sizeof(h)); // memset只能字节赋值，-1实际上是0xff
    int n;
    cin>>n;
    while(n--){
        char ch[2];
        int x;
        scanf("%s%d",ch,&x);
        int k=find(x);
        if(*ch=='I')
        {
            h[k]=x;
        }else{
            if(h[k]==x)
            puts("Yes");
            else
            puts("No");
        }
    }
    return 0;
}
```







```cpp
#include <cstring>
#include <iostream>

using namespace std;

// 这个值是自己设计的哈希，需要根据数据量，取数据量临近的大一点的素数
const int N=100003;

int e[N],ne[N],h[N],idx;

void insert(int x)
{
    int k=((x%N)+N)%N;
    e[idx]=x; // 构造新节点
    ne[idx]=h[k]; // 新节点next-> 原来的头结点
    h[k]=idx; // 更新对应表头节点
    idx++;
}

bool has(int x)
{
    int k=((x%N)+N)%N;
    for(int i=h[k];i!=-1;i=ne[i]){
        if(e[i]==x)
        return true;
    }
    return false;
}

int main()
{
    int n;
    cin>>n;
    memset(h,-1,sizeof(h));
    while(n--){
        char ch[2];
        int x;
        scanf("%s%d",ch,&x);
        if(*ch=='I')
        {
            insert(x);
        }else{
            if(has(x))
            puts("Yes");
            else
            puts("No");
        }
    }
    return 0;
}
```



## 字符串哈希

字符串哈希的例题：给一个特别长的字符串，然后进行若干次询问，每次询问指定两个区间，判断两个区间的字符串是否相同

（本质上是字符串匹配，采用KMP的话运算量很大）

如果采用暴力计算，后面非常多次的询问会导致超时，因此必须要在qeury上减少计算时间



字符串哈希类似于数组的前缀和，计算出来每个位置的前缀和之后，就可以直接计算得到任意子串的哈希值



```cpp
#include <iostream>
#include <string>

using namespace std;

typedef unsigned long long ULL;
const int N=1e5+10,P=131;
char s[N];
ULL h[N],p[N];


ULL get(int l, int r)
{
    return h[r]-h[l-1]*p[r-l+1];
}

int main()
{
    int n,m;
    cin>>n>>m;
    scanf("%s",s+1); // 注意这里
    
    p[0]=1;
    h[0]=0;
    for(int i=1;i<=n;i++){
        h[i]=h[i-1]*P+s[i];
        p[i]=p[i-1]*P;
    }
    
    int a,b,c,d;
    while(m--){
        cin>>a>>b>>c>>d;
        if(get(a,b) != get(c,d))
        puts("No");
        else
        puts("Yes");
    }
    
    return 0;
}
```

