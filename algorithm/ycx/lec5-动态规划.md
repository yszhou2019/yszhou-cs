# 背包问题

## 01背包



基本做法，转移方程，2重循环

```cpp
    for(int i=1;i<=n;i++)//i=0，前0件中挑选，最大价值都是0
    for(int j=0;j<=m;j++)
    {
        f[i][j]=f[i-1][j];
        if(j>=v[i])
        f[i][j]=max(f[i][j], f[i-1][j-v[i]]+w[i]);
    }
```



改进，`f[i][j]依赖的都是f[i-1]的数据`，采用滚动数组，需要注意的一点是，对体积遍历的时候，需要从大到小

```cpp
    for(int i=1;i<=n;i++)
    for(int j=m;j>=v[i];j--)
    {
        f[j]=max(f[j], f[j-v[i]]+w[i]);
    }
```





## 完全背包



3重循环，集合划分，划分依据，第i个物品的数量

```cpp
    for(int i=1;i<=n;i++)
    for(int j=0;j<=m;j++)
    for(int k=0;k*v[i]<=j;k++)
        f[i][j]=max(f[i][j], f[i-1][j-k*v[i]]+k*w[i]);
```



优化状态方程，`f[i][j]=max{  f[i-1][j], f[i][j-v[i]] + w[i]     }`

```cpp
    for(int i=1;i<=n;i++)
    for(int j=0;j<=m;j++)
    {
        f[i][j]=f[i-1][j];
        if(j>=v[i]){
            f[i][j]=max(f[i][j], f[i][j-v[i]]+w[i]);
        }
    }
```



滚动数组

```cpp
    for(int i=1;i<=n;i++)
    for(int j=v[i];j<=m;j++)
    {
        f[j]=max(f[j], f[j-v[i]]+w[i]);
    }
```



# 线性DP

## 数字三角形

状态表示，`f[i][j]`从起点到`点 i,j`的所有路径，值，代表路径和的max
状态计算，

集合划分，`f[i][j]=max(左上，上)+f[i][j] (如果i==j)那么f[i][j]=左上+自己`

```cpp
    for(int i=0;i<=n;i++)
    for(int j=0;j<=i+1;j++)f[i][j]=-INF;
    for(int i=1;i<=n;i++)
    for(int j=1;j<=i;j++)cin>>f[i][j];
    
    for(int i=2;i<=n;i++)
    for(int j=1;j<=i;j++)
    {
        int leftup=f[i-1][j-1];
        int up=-1e9;
        if(i!=j)
            up=f[i-1][j];
        f[i][j]+=max(leftup,up);
    }
    
    int res=0;
    for(int i=1;i<=n;i++)
    res=max(res,f[n][i]);
    cout<<res<<endl;
```



把边界条件去掉，把非法数据填充成-INF，那么就不用再判断

```cpp
    // 等价变形，不需要再判断对角线的情况，因为非有效元素，都是-INF
    for(int i=2;i<=n;i++){
        for(int j=1;j<=i;j++){
            f[i][j]=max(f[i-1][j],f[i-1][j-1])+f[i][j];
        }
    }
```





## 最长上升子序列

状态表示，`f[i]`表示以第i个字符结尾，所有子序列的集合，属性，子序列的最长长度
状态划分，暴力遍历即可

```cpp
    for(int i=2;i<=n;i++)
    for(int j=1;j<i;j++)
        if(w[i]>w[j])
        f[i]=max(f[i],f[j]+1);
    int res=0;
    for(int i=1;i<=n;i++)res=max(res,f[i]);
    cout<<res<<endl;
```



## 最长公共子序列

状态表示，`f[i][j]`表示字符串1的前i个字符和字符串2的前j个字符的所有的公共子序列，属性，最长长度
状态划分，`s1[i]== s2[j]`以及`s1[i]!=s2[j]`
https://www.acwing.com/solution/content/8111/

```cpp
    for(int i=1;i<=n;i++)cin>>s1[i];
    for(int i=1;i<=m;i++)cin>>s2[i];
    for(int i=1;i<=n;i++)
    for(int j=1;j<=m;j++)
    if(s1[i]==s2[j])
        f[i][j]=1+f[i-1][j-1];
    else
        f[i][j]=max(f[i-1][j], f[i][j-1]);
    cout<<f[n][m]<<endl;
```



## 最短编辑距离

`f[i][j]`表示的是让串a的前i个字符与串b的前j个字符变得相等的，所有方案
属性，值代表每种方案的变化次数的min

https://www.acwing.com/solution/content/10499/

```cpp
    int n,m;
    cin>>n;
    for(int i=1;i<=n;i++)cin>>s1[i];
    cin>>m;
    for(int i=1;i<=m;i++)cin>>s2[i];
    for(int i=0;i<=n;i++)f[i][0]=i;
    for(int i=0;i<=m;i++)f[0][i]=i;
    for(int i=1;i<=n;i++)
    for(int j=1;j<=m;j++)
    {
        f[i][j]=1+min(f[i-1][j], f[i][j-1]);
        f[i][j]=min(f[i][j], f[i-1][j-1]+(s1[i]==s2[j]?0:1));
    }
    
    cout<<f[n][m]<<endl;
```



## 编辑距离



```cpp
#include <iostream>
#include <string.h>
#include <algorithm>

using namespace std;

const int N=1010;
const int M=15;
char str[N][M];
int f[N][N];
const int INF=1e9;

int edit_distance(char s1[],char s2[])
{
    int la=strlen(s1+1);
    int lb=strlen(s2+1);
    for(int i=0;i<=la;i++)f[i][0]=i;
    for(int i=0;i<=lb;i++)f[0][i]=i;
    for(int i=1;i<=la;i++)
    for(int j=1;j<=lb;j++)
    {
        f[i][j]=min(f[i-1][j]+1,f[i][j-1]+1);
        f[i][j]=min(f[i][j], f[i-1][j-1]+(s1[i]==s2[j]?0:1));
    }
    return f[la][lb];
}

int main()
{
    int n,m;
    cin>>n>>m;
    for(int i=0;i<n;i++) scanf("%s",str[i]+1);
    
    while(m--){
        char s[M];
        int limit;
        scanf("%s%d",s+1,&limit);
        
        int res=0;
        for(int i=0;i<n;i++)
            if(edit_distance(str[i],s)<=limit)
                res++;
        cout<<res<<endl;
    }
    return 0;
}
```



# 区间DP

## 石子合并

```cpp
    for(int i=n-1;i>=1;i--)
    for(int j=i+1;j<=n;j++)
    {
        f[i][j]=1e9;
        for(int k=i;k<j;k++){
            f[i][j]=min(f[i][j], f[i][k]+f[k+1][j]+s[j]-s[i-1]);
        }
    }
    cout<<f[1][n]<<endl;
```

