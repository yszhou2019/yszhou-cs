# Python

------

## 列表推导

使用列表推导，将会一次产生所有结果：返回一个列表对象

```python
squares = [x**2 for x in range(5)]
```



列表推导的中括号，替换成圆括号，就是一个生成器表达式：

```python
squares = (x**2 for x in range(5))
next(squares) # 0
list(squares) # [1, 4, 9, 16]
```



## range

Python3 range() 返回的是一个不可变的可迭代对象（类型是对象），而不是列表类型

range()，类似于list，都是==可迭代对象==，通过`__iter__()`返回迭代器，再对迭代器不断调用`__next__()`即可获取value

可让您迭代它们，它不会生成列表，并且它们==不会将范围内的所有元素存储在内存中==，而是会动态生成元素(当您迭代它们时) , 而 `list(range(0,3))`生成一个列表(通过迭代所有元素并在内部附加到列表)。
如果您只想迭代该范围的值，`range(0,3)`会比 `(list(range(0,3))` 快因为后者在您==开始迭代之前具有生成列表的开销==。



## 可迭代对象、迭代器、生成器

https://kelepython.readthedocs.io/zh/latest/c01/c01_11.html



### 可迭代对象

list dict tuple 都可以调用`__iter__()`，返回一个迭代器
对迭代器不断调用`__next__()`方法，即可完成迭代



可迭代对象，定义：定义了`__iter__`方法的对象，都是可迭代对象



```python
ls=[] # 可迭代
it=ls.__iter__() # 获取迭代器
it.__next__() # 对迭代器不断调用，获取value，直到 StopIteration
it.__next__()
it.__next__()

name="abc"
it=name.__iter__()
it.__next__()
it.__next__()
it.__next__()
```





使用 `isinstance()函数` 判断对象是否是可迭代对象，本质上是在判断class是否存在`__iter__`方法

```python
# 没有定义 __iter__ 方法则是不可迭代对象
>>> from collections import Iterable
>>> class IsIterable:
        pass
>>> isinstance(IsIterable(), Iterable)
False

# 定义 __iter__ 方法则是可迭代对象
>>> class IsIterable:
        def __iter__(self):
            pass
>>> isinstance(IsIterable(), Iterable)
True


# True
'__iter__' in dir(list)
```

```python
# 导入 collections 模块的 Iterable 对比对象
>>> from collections import Iterable
>>> isinstance("kele", Iterable) # 字符串是可迭代对象
True
>>> isinstance(["kele"], Iterable)
True
>>> isinstance({"name":"kele"}, Iterable)
True
>>> isinstance({1,2}, Iterable) # 集合是可迭代对象
True
>>> isinstance(18, Iterable) # 数字不是可迭代对象
False
```



### 迭代器

```python
>>> str_iterator = "kele".__iter__() # 返回迭代器
>>> str_iterator.__next__()
'k'
>>> str_iterator.__next__()
'e'
>>> str_iterator.__next__()
'l'
>>> str_iterator.__next__()
'e'
>>> str_iterator.__next__()
# 终止迭代则会抛出 StopIteration 异常
Traceback (most recent call last):
  File "<input>", line 1, in <module>
StopIteration
```



在上一步中，对`list dict`等类型，调用`__iter__`方法，得到对应的迭代器

对迭代器不断调用`__next__`方法，或者不断调用`next(it)`，即可不断获取数据，知道返回`StopIteration`



 for 循环底层实现的方式，当迭代一个迭代器时，for 循环通过 `__next__` 方法返回后续的项
迭代完毕之后，捕获到 `StopIteration` 异常便退出循环

`迭代器（Iterator）` 是同时实现`__iter__() 与 __next__()` 方法的对象。



迭代器本质上一个object，可以不断调用`__next__()`来获取value

```python
class Fib:
    def __init__(self, n):
        self.prev = 0
        self.cur = 1
        self.n = n

    def __iter__(self):
        return self

    def __next__(self):
        if self.n > 0:
            value = self.cur
            self.cur = self.cur + self.prev
            self.prev = value
            self.n -= 1
            return value
        else:
            raise StopIteration()
    # 兼容python2
    def __next__(self):
        return self.next()

f = Fib(10) # f是一个object
print([i for i in f])
# [1, 1, 2, 3, 5, 8, 13, 21, 34, 55]

from collections import Iterator
print(isinstance(f, Iterator)) # True
```



迭代器的优势
迭代器在一定程度上节省了内存，需要时才去获取对应的数据

获取迭代器
遵循迭代器协议，定义迭代器类的`__next__`才可以获取迭代器，**写法比较麻烦**

```python
class MyIterator:
    def __init__(self):
        self.num = 0
    def __next__(self):
        return_num = self.num
        # 只要值大于等于6，就停止迭代
        if return_num >= 6:
            raise StopIteration
        self.num += 2
        return return_num

my_iterator = MyIterator()

while True:
        try:
            my_num = next(my_iterator)
        except StopIteration:
            break
        print(my_num) # 打印 0 2 4
```



### 生成器



```python
# 生成器函数
>>> def func(n):
...     yield n*2
...
>>> func
<function func at 0x00000000029F6EB8>
>>> g = func(5)
>>> g
<generator object func at 0x0000000002908630>
>>>
>>> g = func(5)
# 1 直接用next调用生成器
>>> next(g)
10

>>> g = func(5)
# 2 直接用for loop调用遍历生成器
>>> for i in g:
...     print(i)
...
10
```

func 就是一个生成器函数，调用该函数时==返回生成器==，这个生成器对象的行为和迭代器是非常相似的，可以用在 for 循环等场景中。

注意 yield 对应的值在函数被调用时不会立刻返回，而是==当调用next方法==，或者说==返回的生成器被for 循环的时候==（本质上 for 循环也是调用 next 方法）才返回

```python
# 生成器函数
def fib(n):
    prev, curr = 0, 1
    while n > 0:
        n -= 1
        yield curr
        prev, curr = curr, curr + prev

print([i for i in fib(10)]) # [1, 1, 2, 3, 5, 8, 13, 21, 34, 55]
```



### 如何产生生成器



Python 中，提供了两种 `生成器（Generator）` ，一种是`生成器函数`，另一种是`生成器表达式`。

普通函数用 return 返回一个值

**生成器函数**，定义与常规函数相同，区别在于，它使用关键字 yield 来返回值，函数返回值是一个==生成器对象==，生成器==本质上还是一个迭代器，也是用在迭代操作中，因此它有和迭代器一样的特性，唯一的区别更加简洁== 
yield 语句一次返回一个结果，在每个结果中间，会暂停并保存当前所有的运行信息，以便下一次执行 next() 方法时从当前位置继续运行。

**生成器表达式**，与列表推导式类似，区别在于，它使用小括号 - `()` 包裹，而不是中括号，生成器返回按需产生结果的一个对象，而不是一次构建完整的列表。





### 生成器比迭代器的优点

为什么要使用生成器？原因生成器和迭代器性能上一样高效，生成器比迭代器简洁，没有那么多冗长代码

```python
# 1 生成器表达式
>>> g = (x*2 for x in range(10))
>>> type(g)
<type 'generator'>
>>> l = [x*2 for x in range(10)]
>>> type(l)
<type 'list'>

# 2 包含yield关键字的函数
def fib(max):
    n, a, b = 0, 0, 1
    while n < max:
        yield b
        a, b = b, a + b
        n = n + 1
    return 'done'

g2 = fib(8)
```





## Python 中使用多线程可以达到多核CPU一起使用吗？

不可以，GIL会限制线程，实际上线程轮流执行



## GIL(Global Interpreter Lock)
全局解释器锁

全局解释器锁(Global Interpreter Lock)是计算机程序设计语言解释器用于同步线程的一种机制，它使得任何时刻仅有一个线程在执行。即便在多核处理器上，使用 GIL 的解释器也只允许同一时间执行一个线程，常见的使用 GIL 的解释器有CPython与Ruby MRI。可以看到GIL并不是Python独有的特性，是解释型语言处理多线程问题的一种机制而非语言特性。



> 首先说下GIL是干什么的。
>
> 由于Python是需要经过解释器编译成字节码后再执行的，所以有例如CPython、PyPy等解释器，提到GIL时，一般指CPython，CPython设置GIL的主要原因是为了保证不让多个线程同时执行同一条字节码，这就避免了可能多个线程同时对某个对象进行操作。
>
> GIL为啥存在？
> 由于==CPython实现的内存管理不是线程安全的，因此需要GIL保证线程安全==。比如修改一个字典的值，如果不是线程安全，就可能导致错误，所以需要加锁。
>
> GIL的坏处
> 由于GIL的存在，每个线程执行的时候必须先获得GIL锁，用完释放，所以导致==一个Python进程同一时间只能执行一个线程==，那么对于计算密集型的任务，可能导致多线程慢于单线程。
>
> GIL为啥还存在？
> 我觉得可能因为Python发展这么多年，完全替换掉CPython是不太可能的，需要性能比它好，还要兼容所有依赖于CPython的库。
>
> 执行原理
> cpython解释器只允许拥有GIL全局解析器锁的线程才可以使用CPU，也就保证了同一个时刻只一个线程可以使用cpu。
>
> GIL释放：
> 1 当前线程==执行超时==（Python计时器）会自动释放
> 2 如果当前线程没有超时但==执行结束==也会释放
> 3 当前线程执行==IO操作==时也会自动释放



### GIL的设计初衷?

单核时代高效利用CPU, 针对解释器级别的数据安全(不是thread-safe 线程安全)。
首先需要明确的是GIL并不是Python的特性，它是在实现Python解析器(CPython)时所引入的一个概念。当Python虚拟机的线程想要调用C的原生线程需要知道线程的上下文，因为没有办法控制C的原生线程的执行，所以只能把上下文关系传给原生线程，同理获取结果也是线
程在python虚拟机这边等待。那么要执行一次计算操作，就必须让执行程序的线程组串行执行。



### 为什么要加在解释器,而不是在其他层?

![img](https://yszhou.oss-cn-beijing.aliyuncs.com/img/20211226133622.png)

GIL锁加在解释器一层，也就是说Python调用的Cython解释器上加了GIL锁
cpython解释器往下依赖的是C语言，对应的线程不受python控制，而是C语言控制,只能加在Python解释器这一层。



## 什么是装饰器？

https://docs.pythontab.com/interpy/decorators/your_first_decorator/



工作原理，装饰器接收一个函数作为参数，并返回装饰之后的新函数

```python
def a_new_decorator(a_func):
    def wrapTheFunction():
        print("I am doing some boring work before executing a_func()")
        a_func()
        print("I am doing some boring work after executing a_func()")
    return wrapTheFunction

def a_function_requiring_decoration():
    print("I am the function which needs some decoration to remove my foul smell")

a_function_requiring_decoration()
# outputs: "I am the function which needs some decoration to remove my foul smell"

a_function_requiring_decoration = a_new_decorator(a_function_requiring_decoration)
# 右侧的返回值，实际上是wrapTheFunction
# now a_function_requiring_decoration is wrapped by wrapTheFunction()
```



问题，上述装饰器重写了我们函数的名字和注释文档(docstring)

```python
print(a_function_requiring_decoration.__name__)
# Output: wrapTheFunction
```

```python
from functools import wraps

def a_new_decorator(a_func):
    @wraps(a_func)
    def wrapTheFunction():
        print("I am doing some boring work before executing a_func()")
        a_func()
        print("I am doing some boring work after executing a_func()")
    return wrapTheFunction

@a_new_decorator
def a_function_requiring_decoration():
    """Hey yo! Decorate me!"""
    print("I am the function which needs some decoration to "
          "remove my foul smell")

print(a_function_requiring_decoration.__name__)
# Output: a_function_requiring_decoration
```



蓝本
@wraps接受一个函数来进行装饰，并加入了复制函数名称、注释文档、参数列表等等的功能。这可以让我们在装饰器里面访问在装饰之前的函数的属性。

```python
from functools import wraps
def decorator_name(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not can_run:
            return "Function will not run"
        return f(*args, **kwargs)
    return decorated

@decorator_name
def func():
    return("Function is running")
```





## Python 中的垃圾回收机制？

[Python垃圾回收机制--完美讲解!](https://www.jianshu.com/p/1e375fb40506)

https://juejin.cn/post/6856235545220415496

python采用的是`引用计数`机制为主，`标记-清除`和`分代收集`两种机制为辅的策略

主：引用计数
辅助策略：标记-清除  和 分代收集



### 引用计数

python里每一个东西都是对象，它们的核心就是一个结构体：`PyObject`

```c++
 typedef struct_object {
 int ob_refcnt;
 struct_typeobject *ob_type;
} PyObject;
```

PyObject是每个对象必有的内容，其中`ob_refcnt`就是做为引用计数。
当一个对象有新的引用时，它的`ob_refcnt`就会增加
当引用它的对象被删除，它的`ob_refcnt`就会减少



```c++
#define Py_INCREF(op)   ((op)->ob_refcnt++) //增加计数
#define Py_DECREF(op) \ //减少计数
    if (--(op)->ob_refcnt != 0) \
        ; \
    else \
        __Py_Dealloc((PyObject *)(op))
```

当引用计数为0时，该对象生命就结束了。

引用计数机制的

引用计数优点：

> 1 简单
> 2 实时，一旦没有引用，内存就直接释放了，不用等到特定时机（处理回收内存的时间分摊到了平时）

引用计数缺点：

> 1 维护引用计数消耗资源
> 2 循环引用导致内存泄漏



```python
list1 = []
list2 = []
list1.append(list2)
list2.append(list1)
```

list1与list2相互引用，如果不存在其他对象对它们的引用，list1与list2的引用计数也仍然为1，所占用的内存永远无法被回收，这将是致命的。



### 标记清除

循环引用只有在容器对象才会产生，比如字典，元组，列表等。

标记-清除用来解决引用计数机制产生的循环引用，进而导致内存泄漏的问题 。 

顾名思义，该机制在进行垃圾回收时分成了两步，分别是：

- 标记阶段，从根结点出发，也就是可以直接访问的局部变量，采用图的遍历算法，比如 `DFS`，将所有可达对象的标记位设置为 `1`（`True`）
- 清除阶段，线性扫描堆内存，将不可达对象直接释放，将可达对象的标记位重新设置为 `0`，为下一次标记清除做准备

```
>>> a=[1,2]
>>> b=[3,4]
>>> sys.getrefcount(a)
2
>>> sys.getrefcount(b)
2
>>> a.append(b)
>>> sys.getrefcount(b)
3
>>> b.append(a)
>>> sys.getrefcount(a)
3
>>> del a
>>> del b
```

> 上面描述的==垃圾回收的阶段，会暂停整个应用程序==，等待标记清除结束后才会恢复应用程序的运行。**为了减少应用程序暂停的时间，Python 通过“分代回收”(Generational Collection)以空间换时间的方法提高垃圾回收效率。**



### 分代回收

> 分代回收是基于这样的一个统计事实，对于程序，存在一定比例的内存块的生存周期比较短；而剩下的内存块，生存周期会比较长，甚至会从程序开始一直持续到程序结束。生存期较短对象的比例通常在 80%～90%之间。 因此，简单地认为：对象存在时间越长，越可能不是垃圾，应该越少去收集。这样相比执行标记-清除算法，==分代回收可以有效减小遍历的对象数，从而提高垃圾回收的速度==，**是一种以空间换时间的方法策略**。

Python将所有的对象分为年轻代（第0代）、中年代（第1代）、老年代（第2代）三代。所有的新建对象默认是 第0代对象。当在第0代的gc扫描中存活下来的对象将被移至第1代，在第1代的gc扫描中存活下来的对象将被移至第2代。

> gc扫描次数（第0代>第1代>第2代）

当某一代中被分配的对象与被释放的对象之差达到某一阈值时，就会触发当前一代的gc扫描。当某一代被扫描时，比它年轻的一代也会被扫描，因此，第2代的gc扫描发生时，第0，1代的gc扫描也会发生，即为全代扫描。

```
>>> import gc 
>>> gc.get_threshold() ## 分代回收机制的参数阈值设置
(700, 10, 10)
```

- 700=新分配的对象数量-释放的对象数量，第0代gc扫描被触发
- 第一个10：第0代gc扫描发生10次，则第1代的gc扫描被触发
- 第二个10：第1代的gc扫描发生10次，则第2代的gc扫描被触发



### 总结

总体而言，python通过内存池来减少内存碎片化，提高执行效率。主要通过引用计数来完成垃圾回收，通过标记-清除解决容器对象循环引用造成的问题，通过分代回收提高垃圾回收的效率。




## 直接赋值 浅拷贝 深拷贝

- **直接赋值：**其实就是对象的引用（别名），修改其中任意一个变量都会影响到另一个。 id相同
- **浅拷贝(copy)：**创建一个新的对象，但它包含的是对原始对象中包含项的引用（如果用引用的方式修改其中一个对象，另外一个也会修改改变）。 id不同
- **深拷贝(deepcopy)：** （修改其中一个，另外一个不会改变）copy 模块的 deepcopy 方法，创建一个新的对象，并且递归的复制它所包含的对象。 id不同

```python
def wrap(func):
    def after_wrap():
        print(f'{func.__name__} begin')
        func()
        print(f'{func.__name__} end')
        print()
    return after_wrap

@wrap
def test_assign():
    a = {1: [1,2,3]}
    b = a
    print(a is b)
    print(id(a) == id(b))

@wrap
def test_copy():
    a = {1: [1,2,3]}
    b = a.copy()
    a[1].append(4)
    print(a)
    print(b)
    print(a is b)

@wrap
def test_deepcopy():
    import copy
    a = {1: [1,2,3]}
    c = copy.deepcopy(a)
    print(a)
    print(c)
    a[1].append(4)
    print(a)
    print(c)
    print(a is c)

test_assign()
test_copy()
test_deepcopy()
```



```bash
test_assign begin
True
True
test_assign end

test_copy begin
{1: [1, 2, 3, 4]}
{1: [1, 2, 3, 4]}
False
test_copy end

test_deepcopy begin
{1: [1, 2, 3]}
{1: [1, 2, 3]}
{1: [1, 2, 3, 4]}
{1: [1, 2, 3]}
False
test_deepcopy end
```



## 双等于和 is 有什么区别？

```==```比较的是两个变量的 value，只要值相等就会返回True

```is```比较的是两个变量的 id，即```id(a) == id(b)```，只有两个变量指向同一个对象的时候，才会返回True

但是需要注意的是，比如以下代码：

```
a = 2
b = 2
print(a is b)
```

按照上面的解释，应该会输出False，但是事实上会输出True，这是因为Python中对小数据有缓存机制，-5~256之间的数据都会被缓存。





## 什么是 lambda 表达式？

简单来说，lambda表达式通常是当你需要使用一个函数，但是又不想费脑袋去命名一个函数的时候使用，也就是通常所说的匿名函数。

lambda表达式一般的形式是：关键词lambda后面紧接一个或多个参数，紧接一个冒号“：”，紧接一个表达式

```python
add = lambda x, y: x + y
add(2,3)
```





------



## 其它 Python 知识点





## Python中list和tuple的区别

- list 长度可变，tuple不可变；
- list 中元素的值可以改变，tuple 不能改变；（==tuple内部的对象的属性可变，但是tuple本身存储的对象不能变==）
- list 支持```append```; ```insert```; ```remove```; ```pop```等方法，tuple 都不支持

```python
# dict内部可以发生变化
def test_mutable_tuple():
    dc={'hello':'world'}
    ls=[1,2,3]
    tu=(dc, ls)
    print(tu)
    tu[0]['name']='student'
    tu[1].append(4)
    print(tu)

test_mutable_tuple()
# ({'hello': 'world'}, [1, 2, 3])
# ({'hello': 'world', 'name': 'student'}, [1, 2, 3, 4])
```





## Python 中的 list、tuple、set、dict的底层实现的理解

List 本质是顺序表，只不过每次表的扩容都是指数级，所以动态增删数据时，表并不会频繁改变物理结构，同时受益于顺序表遍历的高效性（通过角标配合表头物理地址，计算目标元素的位置），使得python的list综合性能比较优秀；

tuple 只读的顺序表，不可修改不可扩容；

dict：顺序表+哈希
所以dict的查询时间复杂度是o（1）；
因此，dict的==key只能为可hash的对象，即不可变类型==；

set 实现列表去重：
本质上是通过__hash__和__eq__来实现对每个元素的hash散列，判断hash值是否一致；
一致的话，==判断对象是否具有一模一样的方法和属性，如果都一致，则去重==；
因此，set元素也必须是可hash的；

深入一点去理解set：set本质也是dict，只不过其键值都一样；实现去重其实就是这么个过程：首先对key进行hash，在dict中这一步是为了获取value的索引，这里也一样；
如果索引相同，说明要么数据重复了，要么key发生了hash碰撞，这时候就去比较两个key对应的value是否相同，
如果数据也相同，确认是数据重复，则去重（保留最新的那个）；
如果数据不同，说明只是在当前hash算法中，两个key刚好发生了hash碰撞（概率相当低），此时不会发生去重；



### 类型转换

- list(x)
- str(x)
- set(x)
- int(x)
- tuple(x)



### try...except



### list

- ```lst[a:b]```：左闭右开
- ```lst.append(value)```：在末尾添加元素，复杂度O(1)
- ```lst.pop()```：弹出列表末尾元素，复杂度O(1)
- ```lst.pop(index)```：弹出任意位置元素，将后面的元素前移，复杂度O(n)
- ```lst.insert(index, value)```：插入元素，后面的元素后移，复杂度O(n)
- ```lst.remove(value)```：移除等于value的第一个元素，后面的元素前移，复杂度O(n)
- ```lst.count(value)```：计数值为value的元素个数
- ```lst.sort(reverse = False)```：排序，默认升序

