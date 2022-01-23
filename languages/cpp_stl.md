# stl



无论是顺序容器，还是关联容器，关注的主要是下面几点
容器如何构造
添加元素
删除元素
底层存储
如何访问，如何迭代
对应容器的迭代器的原理
特例（比如vector<bool>）



## 顺序容器





### vector



构造

> 1 初始化列表
> 2 fill构造，vector<int> nums(size, val)
> 3 构造之后进行reserve(size)



底层实现机制

> vector有3个pointer，分别指向首个有效元素的首地址，最后一个有效元素的末尾字节，以及存储空间的末尾字节
>
> - _Myfirst 和 _Mylast 可以用来表示 vector 容器中目前已被使用的内存空间；
> - _Mylast 和 _Myend 可以用来表示 vector 容器目前空闲的内存空间；
> - _Myfirst 和 _Myend 可以用表示 vector 容器的容量。
>
> 





元素访问

> 1 下标访问
> 2 .at(index)访问
> 3 *迭代器





添加元素

> push_back与emplace_back
>
> emplace_back直接在容器末尾进行构造，相比push_back，少了拷贝构造或者移动构造
>
> 
>
> emplace(iterator, val)与insert(iterator, val)
>
> 都是在指定iterator位置添加元素，emplace也是更推荐的，相比insert少了拷贝构造或者移动构造



删除元素

> pop_back与erase remove clear
>
> pop_back，删除最后一个元素（删除 vector 容器中最后一个元素，该容器的大小（size）会减 1，但容量（capacity）不会发生改变。）
>
> erase(iterator pos)，参数为迭代器（可以是范围）（删除 vector 容器中 pos 迭代器指定位置处的元素，并返回指向被删除元素下一个位置元素的迭代器。该容器的大小（size）会减 1，但容量（capacity）不会发生改变。）
>
> erase(beg, end) 删除区间的元素，左闭右开，减少size，不减少容量
>
> clear，删除 vector 容器中所有的元素，使其变成空的 vector 容器。该函数会改变 vector 的大小（变为 0），但不是改变其容量。
>
> 
>
> remove，删除容器中所有和指定元素值相等的元素，并==返回指向最后一个元素下一个位置的迭代器==。值得一提的是，调用该函数不会改变容器的大小和容量。
>
> remove demo1
>
> ```cpp
> #include <vector>
> #include <iostream>
> #include <algorithm>
> using namespace std;
> int main()
> {
>     vector<int>demo{ 1,3,3,4,3,5 };
>     auto iter = std::remove(demo.begin(), demo.end(), 3);
>     for (auto first = demo.begin(); first < iter;++first) {
>         cout << *first << " ";
>     }
>     return 0;
> }
> ```
>
> 输出
>
> ```bash
> size is :6
> capacity is :6
> 1 4 5
> ```
>
> remove demo2
>
> ```cpp
> #include <vector>
> #include <iostream>
> #include <algorithm>
> using namespace std;
> int main()
> {
>     vector<int>demo{ 1,3,3,4,3,5 };
>     demo.clear();
>     cout << "size is :" << demo.size() << endl;
>     cout << "capacity is :" << demo.capacity() << endl;
>     return 0;
> }
> ```
>
> 删除
>
> ```bash
> size is :0
> capacity is :6
> ```
>
> 



容量相关

> size()
>
> capacity()
>
> resize(n) 容器必须存储刚好n个有效元素。如果 n 比 size() 的返回值小，则容器尾部多出的元素将会被析构（删除）；如果 n 比 size() 大，则 vector 会借助默认构造函数创建出更多的默认值元素，并将它们存储到容器末尾；如果 n 比 capacity() 的返回值还要大，则 vector 会先扩增，在添加一些默认值元素。
>
> reserve(n) 调整容量，调整capacity至少为n
>
> 



容量缩减

> swap
>
> shrink_to_fit
>
> ==TODO== http://c.biancheng.net/view/vip_7712.html



vector\<bool\>

> http://c.biancheng.net/view/vip_7713.html
>
> c++中为什么不提倡使用vector<bool>？ - 张昭的回答 - 知乎 https://www.zhihu.com/question/23367698/answer/148258487
>
> ```cpp
> vector<bool> c{ false, true, false, true, false }; 
> bool b = c[0]; 
> auto d = c[0]; 
> d = true;
> for(auto i:c)
>     cout<<i<<" ";
> cout<<endl;
> //上式会输出1 1 0 1 0
> ```
>
> 1 d的类型不是bool，而是vector<bool>的member type
> 2 修改d的值，那么vector<bool>对应的值也会被修改
> 3 如果c被销毁，d就会变成一个悬垂指针，再对d操作就属于未定义行为
>
> 为什么说vector< bool>不是一个标准容器，就是因为它不能支持一些容器该有的基本操作，诸如取地址给指针初始化操作
>
> 
>
> bool类型sizeof至少是一个字节，但是vector<bool>是c++98，用bit来存储，是无法取地址的
> 对于指针来说，其指向的最小单位是字节，无法另其指向单个比特位，下面的写法就无法通过编译
>
> ```cpp
> //创建一个 vector<bool> 容器
> vector<bool>cont{0,1};
> //试图将指针 p 指向 cont 容器中第一个元素
> bool *p = &cont[0];
> ```





构造

> c++14
> https://www.cplusplus.com/reference/vector/vector/vector/
>
> ```c++
> # default (1)	
> explicit vector (const allocator_type& alloc = allocator_type());
> 
> # fill (2)	
> explicit vector (size_type n);
>          vector (size_type n, const value_type& val,
>                  const allocator_type& alloc = allocator_type());
> # range (3)	
> template <class InputIterator>
>   vector (InputIterator first, InputIterator last,
>           const allocator_type& alloc = allocator_type());
> # copy (4)	
> vector (const vector& x);
> vector (const vector& x, const allocator_type& alloc);
> 
> # move (5)	
> vector (vector&& x);
> vector (vector&& x, const allocator_type& alloc);
> 
> # initializer list (6)	
> vector (initializer_list<value_type> il,
>        const allocator_type& alloc = allocator_type());
> ```
>
> (1) empty container constructor (default constructor)
>
> Constructs an [empty](https://www.cplusplus.com/vector::empty) container, with no elements.
>
> (2) fill constructor
>
> Constructs a container with *n* elements. Each element is a copy of *val* (if provided).
>
> (3) range constructor
>
> Constructs a container with as many elements as the range `[first,last)`, with each element *emplace-constructed* from its corresponding element in that range, in the same order.
>
> (4) copy constructor (and copying with allocator)
>
> Constructs a container with a copy of each of the elements in *x*, in the same order.
>
> (5) move constructor (and moving with allocator)
>
> Constructs a container that acquires the elements of *x*.
> If *alloc* is specified and is different from *x*'s allocator, the elements are moved. Otherwise, no elements are constructed (their ownership is directly transferred).
> *x* is left in an unspecified but valid state.
>
> (6) initializer list constructor
>
> Constructs a container with a copy of each of the elements in *il*, in the same order.
>
> 
>
> 



push_back与emplace_back

> http://c.biancheng.net/view/6826.html
>
> 区别在于底层实现的机制不同。
> push_back() 向容器尾部添加元素时，首先会创建这个元素，然后再将这个元素拷贝或者移动到容器中（如果是拷贝的话，事后会自行销毁先前创建的这个元素）；
> emplace_back() 在实现时，则是直接在容器尾部创建这个元素，省去了拷贝或移动元素的过程。



emplace_back

```c++
template <class... Args>
  void emplace_back (Args&&... args);
```

> https://www.cplusplus.com/reference/vector/vector/emplace_back/
>
> Construct and insert element at the end
>
> Inserts a new element at the end of the [vector](https://www.cplusplus.com/vector), right after its current last element. This new element is constructed in place using *args* as the arguments for its constructor.
>
> This effectively increases the container [size](https://www.cplusplus.com/vector::size) by one, which causes an automatic reallocation of the allocated storage space if -and only if- the new vector [size](https://www.cplusplus.com/vector::size) surpasses the current vector [capacity](https://www.cplusplus.com/vector::capacity).
>
> The element is ==constructed in-place by== calling [allocator_traits::construct](https://www.cplusplus.com/allocator_traits::construct) with *args* forwarded.
>
> A similar member function exists, [push_back](https://www.cplusplus.com/vector::push_back), which ==either copies or moves an existing object into the container==.



push_back

```c++
void push_back (const value_type& val);
void push_back (value_type&& val);
```

> Adds a new element at the end of the [vector](https://www.cplusplus.com/vector), after its current last element. The content of *val* is copied (or moved) to the new element.



> http://c.biancheng.net/view/6826.html
>
> push_back() 在底层实现时，会优先选择调用移动构造函数，如果没有才会调用拷贝构造函数





operator []

```c++
      reference operator[] (size_type n);
const_reference operator[] (size_type n) const;
```





### deque



区别于vector

> vector:
> 1 擅长在序列==尾部==添加或删除元素（时间复杂度为`O(1)`）
> 2 元素存储在==连续内存==空间中
> 
>deque:
> 1 ==头部/尾部==均可O(1)添加/删除元素
> 2 ==不能保证==所有元素都存储到连续的内存空间中
> 
> 



deque API

> 没有capacity()
>
> 没有reserve()



构造

> 1 deque<int>q
> 2 fill构造，(size, val)



容器迭代器

> begin() end()
> cbegin() cend()
> rbegin() rend()



底层存储

> 内部维护一个指针数组，每个指针指向一段连续的内存
> 双端队列本身是若干个连续内存（分段连续内存）
>
> 
>
> 当 deque 容器需要在头部或尾部增加存储空间时，它会申请一段新的连续空间，同时在 map 数组的开头或结尾添加指向该空间的指针，由此该空间就串接到了 deque 容器的头部或尾部。
>
> > 如果 map 数组满了怎么办？很简单，再申请一块更大的连续空间供 map 数组使用，将原有数据（很多指针）拷贝到新的 map 数组中，然后释放旧的空间。
>
> deque 容器的分段存储结构，提高了在序列两端添加或删除元素的效率
>
> 
>
> 底层实现
> deque容器的数据成员
>
> ```cpp
> //_Alloc为内存分配器
> template<class _Ty,
>     class _Alloc = allocator<_Ty>>
> class deque{
>     ...
> protected:
>     iterator start; // begin()的返回值, start的cur指向首个元素的地址
>     iterator finish; // end()的返回值, finish的cur指向最后一个有效元素的下一个地址
>     map_pointer map;
> ...
> }
> ```
>
> 成员函数
>
> ```cpp
> iterator begin() {return start;}
> iterator end() { return finish;}
> reference front(){return *start;}
> reference back(){
>     iterator tmp = finish;
>     --tmp;
>     return *tmp;
> }
> size_type size() const{return finish - start;}//deque迭代器重载了 - 运算符
> bool empty() const{return finish == start;}
> ```
>
> 



容器迭代器底层实现

> iterator的数据成员
>
> 迭代器内部包含 4 个指针，它们各自的作用为：
>
> ```cpp
> template<class T,...>
> struct __deque_iterator{
>     ...
>     T* cur; // 指向当前正在遍历的元素
>     T* first; // 指向当前连续空间的首地址
>     T* last; // 指向当前连续空间的末尾地址
>     map_pointer node; // map_pointer 等价于 T**，二级指针，表示当前处于map数组的哪个地址
> }
> ```
>
> ![deque容器的底层实现](https://yszhou.oss-cn-beijing.aliyuncs.com/img/2-19121316430U40.gif)
>
> iterator的成员方法
>
> ```cpp
> //当迭代器处于当前连续空间边缘的位置时，如果继续遍历，就需要跳跃到其它的连续空间中，该函数可用来实现此功能
> void set_node(map_pointer new_node){
>     node = new_node;
>     first = *new_node;
>     last = first + difference_type(buffer_size()); // difference_type(buffer_size())表示每段连续空间的长度
> }
> reference operator*() const{return *cur;}
> pointer operator->() const{return &(operator *());}
> //重载前置 ++ 运算符
> self & operator++(){
>     ++cur;
>     //处理 cur 处于连续空间边缘的特殊情况
>     if(cur == last){
>         //调用该函数，将迭代器跳跃到下一个连续空间中
>         set_node(node+1);
>         cur = first;
>     }
>     return *this;
> }
> //重置前置 -- 运算符
> self& operator--(){
>     //如果 cur 位于连续空间边缘，则先将迭代器跳跃到前一个连续空间中
>     if(cur == first){
>         set_node(node-1);
>         cur == last;
>     }
>     --cur;
>     return *this;
> }
> ```
>
> 



内存

> http://c.biancheng.net/view/vip_7714.html
>
> 分段的连续空间就能实现“整体连续”的效果。换句话说，当 deque 容器需要在头部或尾部增加存储空间时，它会申请一段新的连续空间，同时在 map 数组的开头或结尾添加指向该空间的指针，由此该空间就串接到了 deque 容器的头部或尾部。
>
> 有读者可能会问，如果 map 数组满了怎么办？很简单，再申请一块更大的连续空间供 map 数组使用，将原有数据（很多指针）拷贝到新的 map 数组中，然后释放旧的空间。



添加元素

>push_front push_back
>
>emplace_front emplace_back
>
>
>
>emplace(pos, val)
>insert(pos, val)



删除元素

> pop_front()
> pop_back()
>
> erase(pos)
> erase(pos beg, pos end)
> clear()



### list





容器的begin() end()分别返回容器的迭代器，对迭代器进行++，从而遍历容器

容器的front() back()分别返回首个元素 最后一个元素

容器的insert(iterator, val)是在迭代器之后添加一个元素，需要指定iterator



构造

> 1 default构造
> 2 fill构造，(size, val)
> 3 copy构造



容器迭代器

> begin() end()
> cbegin() cend()
> rbegin() rend()



迭代器底层实现


>list节点定义
>
>```cpp
>template<typename T,...>
>struct __List_node{
>    //...
>    __list_node<T>* prev;
>    __list_node<T>* next;
>    T myval;
>    //...
>}
>```
>
>
>
>迭代器底层实现
>
>```cpp
>
>template<tyepname T,...>
>struct __list_iterator{
>__list_node<T>* node;
>//...
>bool operator==(const __list_iterator& x){return node == x.node;}
>bool operator!=(const __list_iterator& x){return node != x.node;}
>//重载 * 运算符，返回引用类型
>T* operator *() const {return *(node).myval;}
>//重载前置 ++ 运算符
>__list_iterator<T>& operator ++(){
> node = (*node).next;
> return *this;
>}
>__list_iterator<T>& operator ++(int){
> __list_iterator<T> tmp = *this;
> ++(*this);
> return tmp;
>}
>__list_iterator<T>& operator--(){
> node = (*node).prev;
> return *this;
>}
>__list_iterator<T> operator--(int){
> __list_iterator<T> tmp = *this;
> --(*this);
> return tmp;
>}
>//...
>}
>```
>
>



底层存储

> 双向链表（或者双向循环链表，SGI的是双向循环）
>
> 不同版本的 STL 标准库中，list 容器的底层实现并不完全一致，但原理基本相同。这里以 SGI STL 中的 list 容器为例，讲解该容器的具体实现过程。
>
> SGI STL 标准库中，list 容器的底层实现为双向循环链表，相比双向链表结构的好处是在构建 list 容器时，只需借助一个指针即可轻松表示 list 容器的首尾元素（使用双向链表实现的 list 容器，其内部通常包含 2 个指针，并分别指向链表中头部的空白节点和尾部的空白节点（也就是说，其包含 2 个空白节点））
>
> 
>
> 容器底层成员变量
>
> ```cpp
> template <class T,...>
> class list
> {
>     //...
>     //指向链表的头节点，并不存放数据
>     __list_node<T>* node;
> }
> ```
>
> 
>
> 成员函数
>
> ```cpp
> // 默认构造
> list() { empty_initialize(); }
> // 用于空链表的建立
> void empty_initialize()
> {
>     node = get_node();//初始化节点
>     node->next = node; // 前置节点指向自己
>     node->prev = node; // 后置节点指向自己
> }
> __list_iterator<T> begin(){return (*node).next;}
> __list_iterator<T> end(){return node;}
> bool empty() const{return (*node).next == node;}
> T& front() {return *begin();}
> T& back() {return *(--end();)}
> //...
> ```
>
> 



元素的遍历访问

>  list容器不支持随机访问，未提供下标操作符 [] 和 at() 成员函数，也没有提供 data() 成员函数。
>  要么front() back()返回首尾两个元素
>  要么begin() end()返回两个迭代器，然后再手动遍历



元素的添加

> push_front() push_back()
> emplace_front() emplace_back()
>
> insert(pos, val) emplace(pos, val)
>
> splice()





元素的删除

> pop_front() pop_back()
>
> erase(pos)
> remove(val)
> clear()





| remove(val) | 删除容器中所有等于 val 的元素。        |
| ----------- | -------------------------------------- |
| unique()    | 删除容器中相邻的重复元素，只保留一份。 |
| remove_if() | 删除容器中满足条件的元素。             |



判断为空

>  empty() 和size()==0
>
> 总是使用empty()，此方法对于所有容器都可以O(1)完成判断
> 但是对于size()，list这个容器需要O(n)来完成判断







==TODO== forward_list 单链表



### 小结

顺序容器的适合场景

高效查询 vector（尾部增删）
高效增删 list（任意增删，迭代查询）
兼顾增删和查询 deque（首尾增删，任意查询）




## 关联容器



### pair

> c++11 头文件<utility>
>
> https://www.cplusplus.com/reference/utility/pair/pair/
>
> 构造函数如下：
>
> ```c++
> # default (1)	
> constexpr pair();
> 
> # copy / move (2)	
> template<class U, class V> pair (const pair<U,V>& pr); # 拷贝构造
> 
> template<class U, class V> pair (pair<U,V>&& pr); # 移动构造
> 
> pair (const pair& pr) = default; # 拷贝赋值
> 
> pair (pair&& pr) = default; # 移动赋值
> 
> # initialization (3)	
> pair (const first_type& a, const second_type& b);
> template<class U, class V> pair (U&& a, V&& b);
> ```
>
> 
>
> demo
> 在创建 pair4 对象时，调用了 make_pair() 函数，它也是 <utility> 头文件提供的，其功能是生成一个 pair 对象。因此，当我们将 make_pair() 函数的返回值（是一个临时对象）作为参数传递给 pair() 构造函数时，其调用的是移动构造函数，而不是拷贝构造函数。
>
> ```c++
> pair <string, string> pair4(make_pair("C++教程", "http://c.biancheng.net/cplus/"));
> 
> ```
>
> 





### map

> 构造函数
> ```c++
> template < class Key,                                     // 指定键（key）的类型
>         class T,                                       // 指定值（value）的类型
>         class Compare = less<Key>,                     // 指定排序规则
>         class Alloc = allocator<pair<const Key,T> >    // 指定分配器对象的类型
>            > class map;
> ```
>
> ```
> begin()         返回指向map头部的迭代器     
> end()           返回指向map末尾的迭代器     
> 
> count()         返回指定元素出现的次数     
> empty()         如果map为空则返回true 
> size()          返回map中元素的个数     
> 
> erase()         删除一个元素     
> clear(）        删除所有元素         
> 
> find()          查找一个元素     
> 
> equal_range()   返回特殊条目的迭代器对     
> get_allocator() 返回map的配置器     
> insert()        插入元素     
> key_comp()      返回比较元素key的函数     
> lower_bound()   返回键值>=给定元素的第一个位置     
> max_size()      返回可以容纳的最大元素个数     
> rbegin()        返回一个指向map尾部的逆向迭代器     
> rend()          返回一个指向map头部的逆向迭代器     
> swap()           交换两个map     
> upper_bound()    返回键值>给定元素的第一个位置     
> value_comp()     返回比较元素value的函数
> ```



构造

> 1 默认构造
> 2 初始化列表{{k1, v1}, {k2, v3}}
> 3 初始化列表{make_pair(k, v), make_pair(k, v)}
> 4 移动构造，拷贝构造
> 5 修改容器默认排序规则
>
> 
>
> 默认情况下，map 容器调用 std::less<T> 规则，根据容器内各键值对的键的大小，对所有键值对做升序排序。
>
> ```cpp
> std::map<std::string, int>myMap{ {"C语言教程",10},{"STL教程",20} };
> std::map<std::string, int, std::less<std::string> >myMap{ {"C语言教程",10},{"STL教程",20} };
> ```
>
> 



底层存储

> 存储类型pair<const K, T> 



容器迭代器

> begin() end()
>
> find(key)返回iterator



访问元素（键值对）

> 1 下标访问，返回val
> 2 at(key)，返回val



添加元素

> 1 通过下标设置kv
> 2 insert({k, v})，返回对应的迭代器
> 3 emplace(k, v)
> 4 emplace_hint(pos, k, v)
>
> ```cpp
> template <class... Args>
>   pair<iterator,bool> emplace (Args&&... args);
> 
> template <class... Args>
>   iterator emplace_hint (const_iterator position, Args&&... args);
> http://c.biancheng.net/view/7182.html
> ```
>
> 



效率比对

> 效率比对
>
> 结论：
> 当实现“向 map 容器中添加新键值对元素”的操作时，insert() 成员方法的执行效率更高；
> 而在实现“更新 map 容器指定键值对的值”的操作时，operator[ ] 的效率更高。
>
> 
>
> **添加元素**
>
> operator [] 添加元素
> 等效于
>
> ```cpp
> typedef map<string, string> mstr;
> //创建要添加的默认键值对元素
> pair<mstr::iterator, bool>res = mymap.insert(mstr::value_type("STL教程", string()));
> //将新键值对的值赋值为指定的值
> res.first->second = "http://c.biancheng.net/java/";
> ```
>
> 使用 operator[ ] 添加新键值对元素的流程是，先构造一个有默认值的键值对，然后再为其 value 赋值
>
> insert省略了创建临时 string 对象构造与析构，以及拷贝赋值。由于可见，同样是完成向 map 容器添加新键值对，insert() 方法比 operator[ ] 的执行效率更高
>
> **更新元素**
>
> ```cpp
> //operator[]
> mymap["STL教程"] = "http://c.biancheng.net/stl/";
> //insert()
> std::pair<string, string> STL = { "Java教程","http://c.biancheng.net/python/" };
> mymap.insert(STL).first->second = "http://c.biancheng.net/java/";
> ```
>
>  insert() 方法相比，operator[ ] 就不需要使用 pair 对象，自然不需要构造（并析构）任何 pair 对象或者 string 对象
>
> 



在实现向 map 容器中插入键值对时，应优先考虑使用 emplace() 或者 emplace_hint()







### unordered_map

冲突处理方案
1 线性探测，不可行。因为会导致聚集
2 二次探测，不行
3 拉链，冲突则用链表存储



构造

> 





底层存储





容器迭代器

> 



添加元素



删除元素





访问

> http://c.biancheng.net/view/7237.html
>
> 1 采用下标\[\]，有个缺点，下标访问是 access or construct，会构造一个kv pair，且k为key；不存在则构造
> 2 采用.at(key)，不存在则抛出异常



emplace

> http://c.biancheng.net/view/7241.html
>
> ```cpp
> template <class... Args>
>  pair<iterator, bool> emplace ( Args&&... args );
> ```
>
> 
>
> 如何正确构造
>
> http://blog.guorongfei.com/2016/03/16/cppx-stdlib-empalce/
>
> ```c++
> map<string, complex<double>> scp;
> scp.emplace(piecewise_construct,
>          forward_as_tuple("hello"),
>          forward_as_tuple(1, 2));
> ```
>
> 使用了 `C++11` 的两个新特性 `变参模板` 和 `完美转发`。
> ”变参模板”使得 `emplace` 可以接受任意参数，这样就可以适用于任意对象的构建。
> ”完美转发”使得接收下来的参数 能够原样的传递给对象的构造函数，这带来另一个方便性就是即使是构造函数声明为 `explicit` 它还是可以正常工作，因为它不存在临时变量和隐式转换。
>
> 除了上面这种比较复杂的emplace之外，也可以采用key -> share_ptr方式来快速访问
> 如下，从而直接将右侧得到的shared_ptr赋值给map对应的下标即可
>
> ```c++
> std::shared_ptr<int> foo = std::make_shared<int> (10);
> // same as:
> std::shared_ptr<int> foo2 (new int(10));
> ```
>
> 





erase与clear

http://c.biancheng.net/view/7247.html

> erase()：删除 unordered_map 容器中指定的键值对；
> clear()：删除 unordered_map 容器中所有的键值对，即清空容器。
>
> 重载
>
> 1: `iterator erase ( const_iterator position );` 传入it
> 2: `size_type erase ( const key_type& k );` 传入key
> 3: `iterator erase ( const_iterator first, const_iterator last );`范围删除it



遍历

> 1 begin; end
> 2 range based for loop
> 3 c++17结构化绑定
>
> 1 迭代器 begin	
>
> ```c++
> typedef std::map<std::string, std::map<std::string, std::string>>::iterator it_type;
> for(it_type iterator = m.begin(); iterator != m.end(); iterator++) {
>  // iterator->first = key
>  // iterator->second = value
>  // Repeat if you also want to iterate through the second map.
> }
> ```
>
> 2 c++11, range based for loop
>
> 比以前的版本简洁，并且避免了不必要的拷贝
>
> ```c++
> std::map<std::string, std::map<std::string, std::string>> mymap;
> 
> for(auto const &ent1 : mymap) {
> // ent1.first is the first key
> for(auto const &ent2 : ent1.second) {
>  // ent2.first is the second key
>  // ent2.second is the data
> }
> }
> ```
>
> 
>
> 3 c++17
> 在c++ 17中，你能够使用“结构化绑定”特性，它允许使用单个元组/对定义多个变量，使用不同的名称:
>
> ```javascript
> for (const auto& [name, description] : planet_descriptions) {
>  std::cout << "Planet " << name << ":\n" << description << "\n\n";
> }
> ```
>
> 



==TODO== 自定义hash_function与equal

http://c.biancheng.net/view/vip_7724.html



## 容器适配器

stack 栈适配器、queue 队列适配器以及 priority_queue 优先权队列适配器

http://c.biancheng.net/view/6967.html

stack底层容器默认为deque
queue底层容器默认为deque
priority_queue底层容器默认为vector

| 容器适配器     | 基础容器筛选条件                                             | 默认使用的基础容器 |
| -------------- | ------------------------------------------------------------ | ------------------ |
| stack          | 基础容器需包含以下成员函数：empty()size()back()push_back()pop_back()满足条件的基础容器有 vector、deque、list。 | ==deque==          |
| queue          | 基础容器需包含以下成员函数：empty()size()front()back()push_back()pop_front()满足条件的基础容器有 deque、list。 | ==deque==          |
| priority_queue | 基础容器需包含以下成员函数：empty()size()front()push_back()pop_back()满足条件的基础容器有vector、deque。 | ==vector==         |



### stack



### queue



### priority_queue



## 常用算法



### make_shared ==TODO==

头文件<memory>

```c++
  std::shared_ptr<int> foo = std::make_shared<int> (10);
  // same as:
  std::shared_ptr<int> foo2 (new int(10));
```

https://www.jianshu.com/p/03eea8262c11

为什么要用make_shared，而不是shared_ptr<T> ptr( new int (10) );



### 自定义排序函数对象与函数的执行效率差别

http://c.biancheng.net/view/vip_7735.html

comp 参数用于接收用户自定义的函数
可以是普通函数
可以是函数对象



即使普通函数定义为更高效的内联函数，其执行效率也无法和函数对象相比。

执行效率差异原因

> 函数对象(functor)作为cmp，mycomp2::operator() 也是一个内联函数，编译器在对 sort() 函数进行实例化时会将该函数直接展开，展开后的 sort() 函数内部不包含任何函数调用
>
> 

如果使用 mycomp 作为参数来调用 sort() 函数，情形则大不相同。要知道，C++ 并不能真正地将一个函数作为参数传递给另一个函数，换句话说，如果我们试图将一个函数作为参数进行传递，编译器会隐式地将它转换成一个指向该函数的指针，并将该指针传递过去。

也就是说，上面程序中的如下代码：

```
std::sort(myvector.begin(), myvector.end(), mycomp);
```

并不是真正地将 mycomp 传递给 sort() 函数，它传递的仅是一个指向 mycomp() 函数的指针。当 sort() 函数被实例化时，编译器生成的函数声明如下所示：

```
std::sort(vector<int>::iterator first,
          vector<int>::iterator last,
          bool (*comp)(int, int));
```

可以看到，参数 comp 只是一个指向函数的指针，所以 sort() 函数内部每次调用 comp 时，编译器都会通过指针产生一个间接的函数调用。



函数对象比函数具有效率优势。
当调用带有 comp 参数的 STL 算法时，除非调用 STL 标准库自带的比较函数，否则应优先以函数对象的方式自定义规则。优先级：STL自带比较=自定义functor>自定义函数

