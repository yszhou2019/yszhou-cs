 struct node
{
    int key,value,num;
    node(int k,int v,int n)
    {
        key=k;
        value=v;
        num=n;
    }
 
};
 
class LFU_Cache
{
    private:
    int capacity;//缓存容量
    int min_num;//最小的set get操作数
    map<int,list<node>::iterator> mp;//存放key对应的(key,value,num)所在的链表位置
 
    map<int,list<node>> num_node;//存放num次操作数目对应的 （key,value,num）键值对
     
    //方便 获取对应操作数目的 键值对  如num_node[1] 将快速定位到只进行一次set get操作的(key,value)
     
    public:
    LFU_Cache(int k)
    {
        capacity=k;  //构造函数
        min_num=0;
    }
    void set(int key,int value)
    {
        if(capacity==0)
            return;
        if(mp.find(key)==mp.end())  //之前缓存中不存在
        { 
            if(mp.size()==capacity) //已经满了  //那么需要删除
            {
                mp.erase(num_node[min_num].back().key);//首先删除在map中的对应的key
                num_node[min_num].pop_back();//list末尾删除该key
                if(num_node[min_num].size()==0)  //如果删除后该被删除
                {
                    num_node.erase(min_num);
                }
            }
             //新加入到拉链[1]位置
            num_node[1].push_front(node(key,value,1));
            mp[key]=num_node[1].begin();
            min_num=1;//最少set get次数一定是1 
        }
        else  //之前缓存中存在   那么更新key对应的num数量
        {
            int num=mp[key]->num;//该(key,value)之前的操作数量
            num_node[num].erase(mp[key]);
            //在拉链处[num]删除该节点
            if(num_node[num].size()==0)  //被删光了
            {
                num_node.erase(num);
                if(num==min_num)
                    min_num++;  //如果删光的是最少的那一条  那么最少值增加
            }
            //同时增加到  [num+1]拉链处 头部
            num_node[num+1].push_front(node(key,value,num+1));
            mp[key]=num_node[num+1].begin();
        }
    }
    int get(int key)
    {
        if(capacity==0)
            return -1;
        if(mp.find(key)==mp.end())
            return -1;//没有该元素
        int value=mp[key]->value;//获取到value
        int num=mp[key]->num;
        //同时由于get  将增加get数目
        num_node[num].erase(mp[key]);//删除该key-value
        if(num_node[num].size()==0)  //若删除后为 该拉链Node数量为0 
        {
            num_node.erase(num);
            if(num==min_num)  //如果删除的是最后一个最小值  那么最小值+1
                min_num++; 
        }
        //放入num+1  拉链处   
        num_node[num+1].push_front(node(key,value,num+1));
        mp[key]=num_node[num+1].begin();  
        return value;
    }
 
};
 
class Solution {
public:
    /**
     * lfu design
     * @param operators int整型vector<vector<>> ops
     * @param k int整型 the k
     * @return int整型vector
     */
    vector<int> LFU(vector<vector<int> >& operators, int k) {
        // write code here
         
        vector<int> res;
        LFU_Cache cache(k);
        for(int i=0;i<operators.size();i++)
        {
            if(operators[i].size()==3 && operators[i][0]==1)
            {
                 
                cache.set(operators[i][1], operators[i][2]);
                 
            }
            else if(operators[i].size()==2 && operators[i][0]==2)
            {
                res.push_back(cache.get(operators[i][1]));
            }
             
        }
         
        return res;
    }
};