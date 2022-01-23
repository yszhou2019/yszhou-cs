

[参考](https://www.zhihu.com/question/34574154/answer/253165162)



[答案](https://blog.csdn.net/shanghairuoxiao/article/details/72876248)



# C和C++语言基础







## 程序的编译

### 源码到可执行程序的过程

#### 1）预编译

主要处理源代码文件中的以“#”开头的预编译指令。处理规则见下

* 1、删除所有的#define，展开所有的宏定义。
* 2、处理所有的条件预编译指令，如“#if”、“#endif”、“#ifdef”、“#elif”和“#else”。
* 3、处理“#include”预编译指令，将文件内容替换到它的位置，这个过程是递归进行的，文件中包含其他文件。
* 4、删除所有的注释，“//”和“/**/”。
* 5、保留所有的#pragma 编译器指令，编译器需要用到他们，如：#pragma once 是为了防止有文件被重复引用。
* 6、添加行号和文件标识，便于编译时编译器产生调试用的行号信息，和编译时产生编译错误或警告是能够显示行号。



#### 2）编译

把预编译之后生成的xxx.i或xxx.ii文件，进行一系列词法分析、语法分析、语义分析及优化后，生成相应的汇编代码文件。

* 1、词法分析：利用类似于“有限状态机”的算法，将源代码程序输入到扫描机中，将其中的字符序列分割成一系列的记号。
* 2、语法分析：语法分析器对由扫描器产生的记号，进行语法分析，产生语法树。由语法分析器输出的语法树是一种以表达式为节点的树。
* 3、语义分析：语法分析器只是完成了对表达式语法层面的分析，语义分析器则对表达式是否有意义进行判断，其分析的语义是静态语义——在编译期能分期的语义，相对应的动态语义是在运行期才能确定的语义。
* 4、优化：源代码级别的一个优化过程。
* 5、目标代码生成：由代码生成器将中间代码转换成目标机器代码，生成一系列的代码序列——汇编语言表示。
* 6、目标代码优化：目标代码优化器对上述的目标机器代码进行优化：寻找合适的寻址方式、使用位移来替代乘法运算、删除多余的指令等。



#### 3）汇编

将汇编代码转变成机器可以执行的指令(机器码文件)。 汇编器的汇编过程相对于编译器来说更简单，没有复杂的语法，也没有语义，更不需要做指令优化，只是根据汇编指令和机器指令的对照表一一翻译过来，汇编过程有汇编器as完成。经汇编之后，产生目标文件(与可执行文件格式几乎一样)xxx.o(Windows下)、xxx.obj(Linux下)。



#### 4）链接

将不同的源文件产生的目标文件进行链接，从而形成一个可以执行的程序。链接分为静态链接和动态链接



#### 静态链接

函数和数据被编译进一个二进制文件。

使用静态库链接可执行文件时，链接器从库中复制这些函数和数据并把它们和应用程序的其它模块组合起来创建最终的可执行文件。

> 空间浪费：因为==每个可执行程序==中对所有需要的目标文件都要有一份副本，所以如果**多个程序对同一个目标文件都有依赖，会出现同一个目标文件都在内存存在多个副本**；
>
> 更新困难：**每当库函数的代码修改了，这个时候就需要重新进行编译链接**形成可执行程序。
>
> 运行速度快：但是静态链接的优点就是，在可执行程序中已经具备了所有执行程序所需要的任何东西，在==执行的时候运行速度快==。





#### 动态链接

动态链接的基本思想是把程序按照模块拆分成各个相对独立部分，在**程序运行时才将它们链接**在一起形成一个完整的程序，而不是像静态链接一样把所有程序模块都链接成一个单独的可执行文件。

> 共享库：就是即使需要每个程序都依赖同一个库，但是该库不会像静态链接那样在内存中存在多分副本，而是这多个程序在执行时共享同一份副本；
>
> 更新方便：更新时只需要替换原来的目标文件，而无需将所有的程序再重新链接一遍。当程序下一次运行时，新版本的目标文件会被自动加载到内存并且链接起来，程序就完成了升级的目标。
>
> 性能损耗：因为把**链接推迟到了程序运行时，所以每次执行程序都需要进行链接，所以性能会有一定损失**。





## 内存模型



进程的内存模型

1、栈（stack）— 由编译器自动分配释放 ，存放函数的参数值，局部变量的值等。其操作方式类似于数据结构中的栈。 
2、堆（heap） — 一般由程序员分配释放， 若程序员不释放(就会造成内存泄漏的问题)，程序结束时由OS回收 。
3、全局区（包括 .bss ==.data==）
全局变量和静态变量的存储是放在一块的
初始化的全局变量和静态变量在一块区域(.data)
未初始化的全局变量和未初始化的静态变量在相邻的另一块区域（BSS，Block Started by Symbol）。 
程序结束后有系统释放(在整个程序的执行过程中都是有效的) 
4、.rodata —常量字符串，==类的虚函数表==。 程序结束后由系统释放
5、代码段(.text)—存放==代码==



> 全局变量和静态变量在编译完成后，就存在于程序中
> 进程运行时，对应的内存在整个运行期间都会存在。
>
> 
>
> 关于C++中自由存储区的解释，参考
>
> [C++ 自由存储区是否等价于堆？](https://www.cnblogs.com/QG-whz/p/5060894.html)

![这里写图片描述](https://yszhou.oss-cn-beijing.aliyuncs.com/img/20211227015052.png)

程序的分段模型
.text .bss .data



### 内存对齐的原则

首先获取对齐单位，如果没有手动设置，那么对齐单位=结构体中，最长的基本类型的字节个数

1 每个==数据成员存储的==起始位置==要从该min{该成员类型，对齐单位}大小的整数倍开始==,基本类型==不包括==struct/class/uinon ==（比如{int a; double b;short c}）sizeof结果为24，double必须放在8的倍数上==
2 结构体的总大小,也就是sizeof的结果，必须是其内部最大成员的"最宽==基本类型==成员"的整数倍.不足的要补齐，如下sizeof结果是24，而不是16
3 ==最后的数据成员为什么也需要对齐？==考虑结构体{double a; int b}。两个紧邻的栈对象，如果不对齐，64位机器，那么第二个对象访问double就需要访存两次。==总的来说，还是保证访存的性能==。
4 sizeof(union)，以结构里面size最大元素为union的size,因为在某一时刻，union只有一个成员真正存储于该地址

在C++中规定了空结构体和空类的内存所占大小为1字节，因为c++中规定，任何不同的对象不能拥有相同的内存地址。



### 为什么需要内存对齐

首先，内存对齐，本身是拿空间换时间
==访存性能==，以32位机器为例，数据总线宽度32位，CPU在访问栈上的数据，如果没有内存对齐，那么一个int，就需要访存两次；内存对齐之后，只需要访存一次即可，==减少CPU访存次数==



结构体内部包含char数组，那么基本类型是char，而不是char数组！

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210721224908.png" alt="image-20210721224908132" style="zoom:80%;" />这个图运行结果是，7,14。说明基本对齐单位是char

```cpp
struct T{
    char s[3]; 
    double c;
    int a;
};
// sizeof 结果为24
```





### struct and union

> 内存对齐规则：选择min(编译器对界方式, 自身基本数据类型最大者)的一个，作为基本的对齐单位
> 基本数据类型对齐：所有的固有类型的对界方式可以认为就是类型自身的大小
> 编译器对齐：使用#pragma pack(x)宏可以改变编译器的对界方式，默认是8
>
> union：对齐之后的最大数据类型作为sizeof的结果
> struct：对齐之后的全部类型之和作为sizeof的结果

[Struct 和 Union区别--CSDN](https://blog.csdn.net/firefly_2002/article/details/7954458)

```cpp
#include <iostream>
using namespace std;

union u
{
    double a;
    int b;
};

union u2
{
    char a[13];
    int b;
};

union u3
{
    char a[13];
    char b;
};

int main()
{
    cout<<sizeof(u)<<endl; // 8 编译器8，最大类型8->按照8对齐->8
    cout<<sizeof(u2)<<endl; // 16 编译器8，最大4->按照4对齐->16
    cout<<sizeof(u3)<<endl; // 13 编译器8,最大1->按照1对齐->13
    return 0;
}
```





```cpp
#include <iostream>
using namespace std;

#pragma pack(2)
union u2
{
	char a[13];
	int b;
};

union u3
{
	char a[13];
	char b;
};

int main()
{
	cout << sizeof(u2) << endl; // 14, 编译器对齐单位2，自己基本类型为4->min(2, 4) 按照2对齐
	cout << sizeof(u3) << endl; // 13  编译器对齐单位2，自己基本类型1->按照1对齐
	return 0;
}
```





### C++内存管理

1 C++内存包括 stack heap .bss .data .rodata(全局const变量，字符串字面量，虚函数表) .text
其他说法（堆区，栈区，常量区，静态和全局区）

https://blog.csdn.net/shanghairuoxiao/article/details/70337890



1. 每块存储哪些变量？
2. ==学会迁移，可以说到malloc，从malloc说到操作系统的内存管理，说道内核态和用户态，然后就什么高端内存，slab层，伙伴算法，VMA可以巴拉巴拉了，接着可以迁移到fork()==。



### malloc的实现

GNU glibc的malloc和free对于heap内存的管理

大致是seglist，每个freelist内部的block，size大致相同

https://www.cnblogs.com/shihuvini/p/10132288.html





### new和malloc的区别

区别：
1 本质，new和delete是C++关键字，需要编译器支持；malloc和free是库函数，需要引入头文件
2 参数，new申请内存不需要指出内存的大小，编译器自己计算；malloc需要显式计算出内存大小
3 返回类型，new返回对应类型的指针，不需要类型转换；malloc返回void*指针，需要类型转换
4 分类失败，new抛出异常bad_alloc；malloc返回NULL
5 过程，new关键字，首先会调用operator new，申请内存（operator new一般是调用malloc来申请指定大小的内存）
在调用placement new（也就是调用对应的构造函数，将申请的内存进行构造），然后返回对应类型的指针
delete关键字，首先调用析构函数，然后调用operator delete，释放内存（也就是调用free来释放内存）
malloc和free就是直接申请内存和释放内存，没有构造和析构对象的过程
6 重载，new关键字，支持重载operator new和operator delete

new对象+delete对象= operator new分配堆空间+placement new构造+析构+operator delete释放堆空间
栈对象=编译器分配栈空间+构造+析构+编译器释放栈空间



### stack and heap

管理方式不同：堆中资源由程序员控制（通过malloc/free、new/delete，容易产生memory leak），栈资源由编译器自动管理
空间大小不同：堆的大小受限于计算机系统中有效的虚拟内存（32位机器上理论上是4G大小）栈的空间是有限的，linux `ulimit -s`可查看栈空间为8M；
生长方向不同：堆生长方向是向上的，也就是向着内存地址增加的方向，栈刚好相反，向着内存减小的方向生长。
能否产生碎片：栈和数据结构中的栈原理相同，在弹出一个元素之前，上一个已经弹出了，不会产生碎片，如果不停地调用malloc、free对造成内存碎片很多；
分配效率不同：栈的效率比堆高很多。栈是机器系统提供的数据结构，计算机在底层提供栈的支持，分配专门的寄存器来存放栈的地址，压栈出栈都有相应的指令，因此比较快。堆是由库函数提供的，机制很复杂，库函数会按照一定的算法进行搜索内存，因此比较慢。





### 浅拷贝与深拷贝

简单的说：浅拷贝就是使用同一块内存，拷贝后实际上还是指向同一块内存；

深拷贝之后，每个对象都有自己的内存，而不是指向相同一块内存

[C++面试题之浅拷贝和深拷贝的区别](https://blog.csdn.net/caoshangpa/article/details/79226270)

> 执行结果：调用一次构造函数，一次自定义拷贝构造函数，两次析构函数。两个对象的指针成员所指内存不同。
> 总结：浅拷贝只是对指针的拷贝，拷贝后两个指针指向同一个内存空间，深拷贝不但对指针进行拷贝，而且对指针指向的内容进行拷贝，深拷贝后的指针是指向两个不同地址的指针。
>
> 当**对象中存在指针成员**时，需要自定义拷贝构造，拷贝构造的调用情形如下
> 1 复制对象
> 2 当函数的参数为对象时，实参传递给形参的实际上是实参的一个拷贝对象，系统自动通过拷贝构造函数实现
> 3 当函数的返回值为一个对象时，该对象实际上是函数内对象的一个拷贝，用于返回函数调用处
>
> 浅拷贝带来问题的本质在于析构函数释放多次堆内存，使用std::shared_ptr，可以完美解决这个问题。

```cpp
class String
{
public:
	String(const char *str = NULL);// 普通构造函数  
	String(const String &other);// 拷贝构造函数  
	~String(void);// 析构函数  
	String & operator = (const String &other);// 赋值函数  
private:
	char *m_data;// 用于保存字符串  
};

//普通构造函数  
String::String(const char *str)
{
	if (str == NULL)
	{
		m_data = new char[1];// 得分点：对空字符串自动申请存放结束标志'\0'的，加分点：对m_data加NULL判断  
		*m_data = '\0';
	}
	else
	{
		int length = strlen(str);
		m_data = new char[length + 1];// 若能加 NULL 判断则更好
		strcpy(m_data, str);
	}
}
 
 
// String的析构函数  
String::~String(void)
{
	delete[] m_data; // 或delete m_data;  
}
 
 
//拷贝构造函数  
String::String(const String &other)
{		 
	int length = strlen(other.m_data);
	m_data = new char[length + 1];
	strcpy(m_data, other.m_data);
}
 
 
//拷贝赋值函数  
String & String::operator = (const String &other) 
{
	if (this == &other)//得分点：检查自赋值  
		return *this; 
	if (m_data)
	    delete[] m_data;//得分点：释放原有的内存资源  
	int length = strlen(other.m_data);
	m_data = new char[length + 1]; 
	strcpy(m_data, other.m_data);
	return *this;//得分点：返回本对象的引用    
}
```







## 类型修饰符



### static修饰符

https://mp.weixin.qq.com/s?__biz=MzkwNzMwNzI1Ng==&mid=2247483674&idx=2&sn=130b204c3be323a592fd8c0f4c34df6d&chksm=c0da708df7adf99b233e22ad57ce18d75b3bfaa3abf3b4d03f04580bdbc230bfba6670d262f4&token=2107487666&lang=zh_CN#rd



全局变量/全局函数
局部变量
类内变量/类内函数

全局静态变量，限制范围，仅限于当前文件，存储空间 .data(或者.bss)
static限制了其链接属性。被static修饰的全局变量只能被该包含该定义的文件访问

==局部静态变量，对应的存储空间从stack->.data==
生命周期与程序相同，==在main函数之前初始化，在程序退出时销毁==

静态函数，限制了函数的范围，仅限于当前文件，避免了冲突

>类内的statc数据
>
>类内的static函数
>
>静态全局变量、全局变量区别
>（1）静态全局变量和全局变量都属于常量区
>（2）静态全局区只在本文件中有效，别的文件想调用该变量，是调不了的，而全局变量在别的文件中可以调用
>（3）如果别的文件中定义了一个该全局变量相同的变量名，是会出错的。
>
>静态局部变量、局部变量的区别
>（1）静态局部变量是属于常量区的，而函数内部的局部变量属于栈区；
>（2）静态局部变量在该函数调用结束时，不会销毁，而是随整个程序结束而结束，但是别的函数调用不了该变量，局部变量随该函数的结束而结束；
>（3）如果定义这两个变量的时候没有初始值时，静态局部变量会自动定义为0，而局部变量就是一个随机值；
>（4）静态局部变量在编译期间只赋值一次，以后每次函数调用时，不在赋值，调用上次的函数调用结束时的值。局部变量在调用期间，每调用一次，赋一次值。
>
>



### volatile

类型修饰符，编译器编译时，访问该变量的代码就不再进行优化，总是==读取内存，不会尝试从寄存器中读取数据，从而可以提供对特殊地址的稳定访问==

>一个参数可以即是const又是volatile的吗？可以，一个例子是只读状态寄存器，是volatile是因为它可能被意想不到的被改变，是const告诉程序不应该试图去修改他。



### const

作用：

const修饰全局变量-> .rodata
const修饰局部变量；
const修饰指针，const int *->指向常量的指针
const修饰指针指向的对象, int * const->常指针
const修饰引用做形参->引用对象不可修改
const修饰成员变量，必须在==构造函数列表中初始化==；
const修饰成员函数，说明==该函数不应该修改非静态成员==



### const和define的区别

编译器处理方式不同
const对应的是编译阶段，define是在编译预处理的时候进行简单的字符串替换

类型安全检查不同
const声明的变量有数据类型，在编译阶段进行类型检查；define没有类型，不进行安全检查

存储方式不同
const定义的全局变量，存储在.rodata中
const局部变量，在stack中
define仅仅展开，不会分配内存（给出的是立即数）

效率
编译器可以将const变量存入符号表，而不是读写内存，进一步提升效率



### 类型转换 ==TODO==

https://www.cnblogs.com/bruce1992/p/14322678.html

const_cast用于==将const变量转为非const==
static_cast用的最多，实现C++==内置基本数据类型之间的相互转换==，不能用于两个不相关类型进行转换。
dynamic_cast用于将一个父类对象的指针/引用转换为子类对象的指针或引用
reinterpret_cast几乎什么都可以转，比如将int转指针，可能会出问题，尽量少用；
为什么不使用C的强制转换？C的强制转换表面上看起来功能强大什么都能转，但是转化不够明确，不能进行错误检查，容易出错。



### 内联函数与宏定义的区别？内联函数的优点？

https://blog.csdn.net/leo115/article/details/7906102

无论是宏还是内联函数，根本目的是用预处理过程，或者编译过程，从而降低程序的运行时开销（保存现场，恢复现场）



什么是宏？为什么要使用宏？

> 宏，字符串替换，在编译预处理过程完成字符串替换，程序运行时不存在额外的空间和时间方面的开销
>
> 简单来说，就是==用预处理（字符串替换）降低程序的运行时开销==（函数调用带来的时间和空间方面的开销（保存现场，恢复现场）

宏的缺点
1 使用起来需要小心，给所有单元都加上括号
2 不可以访问C++类中的私有或者受保护的成员

什么是内联函数

>  对于任何内联函数，编译器在符号表里放入函数的声明（包括==名字、参数类型、返回值类型==）。 
>  如果编译器没有发现内联函数存在错误，那么该函数的代码也被放入符号表里。 
>  在调用一个内联函数时，编译器首先检查调用是否正确 
>  （进行类型安全检查，或者进行自动类型转换，当然对所有的函数都一样）。 
>  如果==正确，内联函数的代码就会直接替换函数调用==，于是省去了函数调用的开销。
>  这个过程与预处理有显著的不同，因为预处理器不能进行类型安全检查，或者进行自动类型转换。 
>  假如内联函数是成员函数，对象的地址（this）会被放在合适的地方，这也是预处理器办不到的。 

优点

> 1 函数类型检查
> 2 降低程序的运行时开销
> 3 可访问私有成员
>
> 用==编译的开销（编译后，内联函数直接展开）来降低程序运行时的开销（函数调用开销）==，同时避免了宏的使用缺陷（类型检查）





## 指针

### 指针和引用的区别

1 指针保存的是对象的地址，引用是对象的别名
2 指针需要解引用来访问对象，引用可以直接访问
3 指针初始化之后可以赋值，引用只能初始化，不能赋值

引用的底层实现

> 引用变量在功能上等于一个指针常量，即一旦指向某一个单元就不能在指向别处。
>
> 在底层，引用变量由指针按照常指针的方式实现。



### 指针和数组之间的关系

1 一维int数组，类型为 int* const
2 二维int数组，类型为 int(*const p)[n];
3 数组作为参数，传递的实际上是地址，也就是指针



### 智能指针是怎么实现的？什么时候改变引用计数？

1. 构造函数中计数初始化为1；
2. 拷贝构造函数中计数值加1；
3. 赋值运算符中，左边的对象引用计数减一，右边的对象引用计数加一；
4. 析构函数中引用计数减一；
5. 在赋值运算符和析构函数中，如果减一后为0，则调用delete释放对象。
6. share_prt与weak_ptr的区别？（是一种弱引用指针，其存在不会影响引用计数，从而解决循环引用的问题

循环引用

```cpp
#include <iostream>
#include <memory>
using namespace std;
class A;
class B;

//shared_ptr可能出现循环引用，从而导致内存泄露
class A
{
public:
    shared_ptr<B> p;
    ~A()
    {
        cout << "A deconstruct" << endl;
    }
};

class B
{
public:
    shared_ptr<A> p;
    ~B()
    {
        cout << "B deconstruct" << endl;
    }
};

int main()
{
    while(true)
    {
        shared_ptr<A> pa(new A()); //pa的引用计数初始化为1
        shared_ptr<B> pb(new B()); //pb的引用计数初始化为1
        pa->p = pb; //pb的引用计数变为2
        pb->p = pa; //pa的引用计数变为2
    }
    //假设pa先离开，引用计数减一变为1，不为0因此不会调用class A的析构函数，因此其成员p也不会被析构，pb的引用计数仍然为2；
    //同理pb离开的时候，引用计数也不能减到0
    return 0;
}

/*
** weak_ptr是一种弱引用指针，其存在不会影响引用计数，从而解决循环引用的问题
*/
```





实现的时候，需要注意几点
1 refcnt是个指针，refcnt在构造shared_ptr的时候再进行new
2 构造shared_ptr时，外部已经调用了new obj，也就是shared_ptr<T>(new int(1))
3 ++和--不必须是前缀，可以用后缀
4 ==赋值的时候，必须先rhs.refcnt++，再lhs.refcnt--，否则，自身赋值就会释放对象==

```cpp
#include <iostream>
using namespace std;

template<class T>
class SmartPtr
{
public:
    SmartPtr(T *p);
    ~SmartPtr();
    SmartPtr(const SmartPtr<T> &orig);                // 浅拷贝
    SmartPtr<T>& operator=(const SmartPtr<T> &rhs);    // 浅拷贝
private:
    T *ptr;
    // 将use_count声明成指针是为了方便对其的递增或递减操作
    int *use_count;
};

template<class T>
SmartPtr<T>::SmartPtr(T *p) : ptr(p)
{
    try
    {
        // 外部对象在shared_ptr<T>(new int(1))，也就是new对象之后，才传递给shared_ptr的构造函数
        use_count = new int(1);
    }
    catch (...)
    {
        // new refcnt失败，那么会释放obj
        delete ptr;
        ptr = nullptr;
        use_count = nullptr;
        cout << "Allocate memory for use_count fails." << endl;
        exit(1);
    }

    cout << "Constructor is called!" << endl;
}

template<class T>
SmartPtr<T>::~SmartPtr()
{
    // 只在最后一个对象引用ptr时才释放内存
    if (--(*use_count) == 0)
    {
        delete ptr;
        delete use_count;
        ptr = nullptr;
        use_count = nullptr;
        cout << "Destructor is called!" << endl;
    }
}

template<class T>
SmartPtr<T>::SmartPtr(const SmartPtr<T> &orig)
{
    ptr = orig.ptr;
    use_count = orig.use_count;
    ++(*use_count);
    cout << "Copy constructor is called!" << endl;
}

// 重载等号函数不同于复制构造函数，即等号左边的对象可能已经指向某块内存。
// 这样，我们就得先判断左边对象指向的内存已经被引用的次数。如果次数为1，
// 表明我们可以释放这块内存；反之则不释放，由其他对象来释放。
template<class T>
SmartPtr<T>& SmartPtr<T>::operator=(const SmartPtr<T> &rhs)
{
    // TODO《C++ primer》：“这个赋值操作符在减少左操作数的使用计数之前使rhs的使用计数加1，
    // TODO 从而防止自身赋值”而导致的提早释放内存
    ++(*rhs.use_count);

    // 将左操作数对象的使用计数减1，若该对象的使用计数减至0，则删除该对象
    if (--(*use_count) == 0)
    {
        delete ptr;
        delete use_count;
        cout << "Left side object is deleted!" << endl;
    }

    ptr = rhs.ptr;
    use_count = rhs.use_count;

    cout << "Assignment operator overloaded is called!" << endl;
    return *this;
}

int main()
{
    // Test Constructor and Assignment Operator Overloaded
    SmartPtr<int> p1(new int(0));
    p1 = p1;
    // Test Copy Constructor
    SmartPtr<int> p2(p1);
    // Test Assignment Operator Overloaded
    SmartPtr<int> p3(new int(1));
    p3 = p1;

    return 0;
}
```







## C++多态与虚函数表





### 为什么需要虚函数？

>虚函数的一个重要作用是向后兼容(不对现有的代码进行修改就可以实现新添加的功能)。



既然C++的非virtual的函数可以重定义，virtual函数相比非virtual的有什么优势？ - nkaifang的回答 - 知乎 https://www.zhihu.com/question/55479365/answer/144858815

>如果父类的fly不声明为virtual，那么vector<base*>遍历调用fly的时候，都会调用父类的fly，不会调用基类的fly
>只有当父类的fly设置成虚函数，各自的指针指向自己的class的虚函数表，从而实现多态
>
>我们直观上认为，如果指针指向了派生类对象，那么就应该使用派生类的成员变量和成员函数，这符合人们的思维习惯。但是本例的运行结果却告诉我们，当基类指针 Pointer指向派生类 Sphere 的对象时，虽然使用了 Sphere 的成员变量，但是却没有使用它的成员函数，导致输出结果不伦不类（当半径都一样时，球体的表面积和圆的面积肯定不一样），不符合我们的预期。
>**换句话说，通过==基类指针只能访问派生类的成员变量，但是不能访问派生类的成员函数==。**
>为了消除这种尴尬，让基类指针能够访问派生类的成员函数，C++ 增加了虚函数（Virtual Function）。使用虚函数非常简单，只需要在函数声明前面增加 **virtual** 关键字。
>
>
>
>作者：鲁班七号
>链接：https://www.zhihu.com/question/55479365/answer/145169423
>问题：既然C++的非virtual的函数可以重定义，virtual函数相比非virtual的有什么优势？





### 必须在构造函数初始化列表中初始化的数据成员有哪些？

1 常量成员，因为常量只允许初始化不允许赋值，不能放到函数体进行赋值
2 引用成员，必须初始化
3 没有默认构造函数的类对象，没有默认构造，那么必须调用有参构造函数，那么就必须用初始化列表来调用带参的构造函数



### 如何理解虚函数和多态

多态的实现主要分为静态多态和动态多态
静态多态是通过函数重载和模板技术实现，在编译的时候确定。
**动态多态是用虚函数机制实现的，在运行的时候确定所要执行的函数。**



虚函数的实现：

(1) 类要有虚函数；
(2) 基类的指针或引用指向派生类的对象；

1 定义了虚函数的类，每个类都有一个虚函数表，表中放了虚函数的地址，实际的虚函数在代码段(.text)中
2 当子类继承了父类的时候也会继承其虚函数表，当子类重写父类中虚函数时候，会将其继承到的虚函数表中的地址替换为重新写的函数地址。
3 通过基类指针调用派生类对象的虚函数（用到了虚函数，会查找该对象的虚函数表。虚函数表的地址在每个对象的首地址，会增加访问内存开销，降低效率。），具体通过指针访问类对象的虚函数表指针，从而访问虚函数表，根据虚函数表获取对应的虚函数的地址，最后在进行虚函数的调用



### 为什么构造函数不能是虚函数

调用虚函数的前提是，对象已经创建好了，对象有虚函数表指针，才能访问虚函数表，调用虚函数
调用构造函数，是因为对象还没有构造出来，也就是不存在虚函数表指针。如果构造函数是虚函数，这就是一个死循环了



### 为什么析构函数可以是虚函数

**将可能会被继承的父类的析构函数设置为虚函数，可以保证当我们new一个子类，然后使用==基类指针指向该子类对象，释放基类指针时可以释放掉子类的空间，防止内存泄漏==。**



>https://zhuanlan.zhihu.com/p/255274039
>
>基类指针new一个子类对象，会依次调用父类、子类的构造函数
>如果没有delete指针，那么不会调用任何析构函数，无论是否虚析构
>
>如果虚析构，并且delete指针
>先调用基类的虚析构，再调用父类的虚析构
>如果不是虚析构，仅仅释放基类
>
>若析构函数是虚函数，delete 时，基类和子类都会被释放；
>若析构函数不是虚函数，delete 时，只有基类会被释放，而子类没有释放，存在内存泄漏的隐患。



栈对象，

基类和派生类的析构不是虚函数 => 正常两次析构
基类和派生类的析构是虚函数 => 也是两次正常的析构



当new对象的时候，

如果基类的析构函数不是虚函数，在==特定情况下会导致派生类无法被析构==。

情况1：用派生类类型指针绑定派生类实例，析构的时候，不管基类析构函数是不是虚函数，都会正常析构

情况2：用基类类型指针绑定派生类实例，
如果==基类析构函数不是虚函数，那么就只根据指针的类型，执行基类的析构函数，不会析构派生类对象，造成资源泄漏==
如果基类析构函数是虚函数，那么调用析构函数，会根据虚函数表调用派生类的析构函数

对象的构造顺序
1 基类构造
2 成员构造
3 派生类构造

对象的析构函数调用顺序
1）派生类本身的析构函数
2）对象成员析构函数
3）基类析构函数

```cpp
// 全部都是栈对象，无论析构函数是否虚函数，都会正常的析构
#include <iostream>
using namespace std;
class AA
{
public:
    AA() {
        cout << "Base construct" << endl;
    };
    virtual ~AA() { 
        cout << "Base destruct" << endl;
    };
};

class BB : public AA {
public:
    BB() { 
        cout << "Derive construct" << endl;
    }
    virtual ~BB() { 
        cout << "Derive destruct" << endl;
    };
};

int main()
{
    AA a;
    // BB b;
    return 0;
}
```



https://blog.csdn.net/ENSHADOWER/article/details/96481661



### 为什么C++默认的析构函数不是虚函数

1 对于类而言，类会有虚函数表，导致额外的内存开销
2 对于对象，每个对象需要额外的虚表指针，导致额外的内存开销
3 基类指针调用派生类对象的虚函数，导致额外的运行开销

总之，额外的虚函数表和虚表指针，占用额外的内存。而对于不会被继承的类来说，其析构函数如果是虚函数，就会浪费内存。因此C++默认的析构函数不是虚函数，而是只有当需要当作父类时，设置为虚函数。



### 析构函数能否抛出异常

从语法上来说，析构函数可以抛出异常
但从逻辑上和风险控制上，析构函数中不要抛出异常，因为栈展开容易导致资源泄露和程序崩溃

1）如果析构函数抛出异常，则异常点之后的代码不会执行，如果说这些代码是在释放必要的资源，那么抛出异常会导致资源泄漏
2）对象在运行期间出现了异常，C++异常处理是为了处理这些对象，调用析构函数来释放对象的资源。析构函数已经变成了异常处理的一部分



### 纯虚函数如何定义

>```cpp
>virtual void func() = 0;
>```
>
>
>
>注意：
>（1）纯虚函数没有函数体；
>（2）最后面的“=0”并不表示函数返回值为0，它只起形式上的作用，告诉编译系统“这是虚函数”；
>（3）这是一个声明语句，最后有分号。
>纯虚函数只有函数的名字而不具备函数的功能，不能被调用。
>纯虚函数的作用是==在基类中为其派生类保留一个函数的名字，以便派生类根据需要对他进行定义。如果在基类中没有保留函数名字，则无法实现多态性==。
>如果在一个类中声明了纯虚函数，在其派生类中没有对其函数进行定义，则该虚函数在派生类中仍然为纯虚函数。
>————————————————
>原文链接：https://blog.csdn.net/qq_36221862/article/details/61413619
>
>





## 重写 重定义

> 重定义：也叫做隐藏，子类重新定义父类中有相同名称的非虚函数 ( 参数列表可以不同 ) ，指派生类的函数屏蔽了与其同名的基类函数。可以理解成发生在继承中的重载。
>
> 重写：也叫做覆盖，一般发生在子类和父类继承关系之间。子类重新定义父类中有相同名称和参数的虚函数。(override)
>
> 重定义规则如下：
> a 、如果派生类的函数和基类的函数同名，但是参数不同，此时，不管有无virtual，基类的函数被隐藏。
> b 、如果派生类的函数与基类的函数同名，并且参数也相同，但是基类函数没有vitual关键字，此时，基类的函数被隐藏（如果相同有Virtual就是重写覆盖了）。
>
> 
>
> 重写与重定义的区别
>
> 如果一个派生类，存在重定义的函数，那么，这个类将会隐藏其父类的方法，除非你在调用的时候，强制转换为父类类型，才能调用到父类方法。否则试图对子类和父类做类似重载的调用是不能成功的。 重写需要注意：
>
> 1、 被重写的函数不能是static的。必须是virtual的
> 2 、重写函数必须有相同的类型，名称和参数列表
> 3 、重写函数的访问修饰符可以不同。
>
> 





多态、继承情况下的函数调用
1 直接通过相同类型的对象、对象指针、对象引用，访问的都是自身class的函数



### 支配规则、赋值兼容、虚函数的区别

**支配规则**： 通过自身对象、指针、引用访问（**自身的**）虚函数、普通函数

**赋值兼容规则**：通过基类指针、对象、引用访问（**派生类中基类部分的**）的普通函数

**虚函数**：通过基类指针、引用访问（**基类和派生类的同名**）虚函数





## 右值引用



### lvalue rvalue

lvalue 是赋值符号左边的值，也就是变量，==对应内存存在于stack或者heap上，可寻址==

rvalue 右边的值，是指表达式结束后就不再存在的临时对象。

包括
1 **字面量**（也就是没有标识符，比如"hello" 10 true，对应.text中的立即数，不能取地址）
2 **将亡值**（比如==函数的返回值，即将被销毁，但是可以被移动的值==）



在 C++11 之后，编译器为我们做了一些工作，此处的左值`temp`会被进行此隐式右值转换， 等价于`static_cast<std::vector<int> &&>(temp)`，进而此处的`v`会将`foo`局部返回的值进行move



### lvalue ref rvalue ref

lvalue ref不能ref字面量
const lvalue ref 可以ref字面量
rvalue ref可以ref字面量

```cpp
    int& a=3; // 报错
    const int& b=3; // ok
    int&& c=3; // ok
```



### move

原理

实际上进行了类型转化，去除原type的所有引用之后，转化成&&

接受一个万能引用，对返回值类型进行强制转化，转化为对应数据类型的右值引用

接受的如果是左值，那么_Tp



https://www.jianshu.com/p/1d5fe80222be

```cpp
  template<typename _Tp>
    constexpr typename std::remove_reference<_Tp>::type&&
    move(_Tp&& __t) noexcept
    { return static_cast<typename std::remove_reference<_Tp>::type&&>(__t); }
// move接受的__t实参，是万能引用
// 传递的如果是lvalue，比如0，那么__t的类型就是int&&
//           rvalue，                     int&

// 返回类型强制转化成int&&
```



转化之后的返回值类型，可以正确的被移动构造/移动赋值识别，而不是调用拷贝构造/拷贝赋值



### 引用折叠

传递参数的时候，由于存在T&&这种未定的引用类型，当它作为参数时，有可能被一个左值引用或右值引用的参数初始化，这是经过类型推导的T&&类型，相比右值引用(&&)会发生类型的变化，这种变化就称为引用折叠

只有右值引用的右值引用才是右值引用；否则就变成了左值引用

这就是引用折叠



A& & 变成 A&

A& && 变成 A&

A&& & 变成 A&

A&& && 变成 A&&



### 万能引用

https://zhuanlan.zhihu.com/p/99524127

（万能引用，unniversal ref）

```cpp
template<typename T>
void f(T&& param); // “&&” might mean rvalue reference
int a;
f(a);// lvalue,那么上述的T&& 就是lvalue reference
f(1);// rvalue,那么上述的T&& 就是rvalue reference

```



到底 “`&&`” 什么时候才意味着一个universal reference呢(即，代码当中的“`&&`”实际上可能是 “`&`”)，具体细节还挺棘手的，所以这些细节我推迟到后面再讲。现在，我们还是先集中精力研究下下面的经验原则，因为你在日常的编程工作当中需要牢记它：

> If a variable or parameter is declared to have type **T&&** for some **deduced type** `T`, that variable or parameter is a *universal reference*.
> 如果一个变量或者参数被声明为**T&&**，其中T是**被推导**的类型，那这个变量或者参数就是一个*universal reference*。

**"T需要是一个被推导类型"**这个要求限制了universal references的出现范围。



*只有在发生类型推导*的时候 “`&&`” 才代表 universal reference 吗。如果没有类型推导，就没有universal reference。这种时候，类型声明当中的“`&&`”总是代表着rvalue reference

```cpp
template<typename T>
void f(T&& param); // deduced parameter type ⇒ type deduction;
                   // && ≡ universal reference
 
template<typename T>
class Widget {
    Widget(Widget&& rhs); // fully specified parameter type ⇒ no type deduction;
    ...                   // && ≡ rvalue reference
};
 
template<typename T1>
class Gadget {
    template<typename T2>
    Gadget(T2&& rhs); // deduced parameter type ⇒ type deduction;
    ...               // && ≡ universal reference
};
 
void f(Widget&& param); // fully specified parameter type ⇒ no type deduction;
                        // && ≡ rvalue reference
```



````cpp
```
同时有类型推导和一个带“&&”的参数，但是参数确不具有 “T&&” 的形式，而是 “std::vector<t>&&”。其结果就是，参数就只是一个普通的rvalue reference，而不是universal reference。 Universal references只以 “T&&”的形式出现！即便是仅仅加一个const限定符都会使得“&&”不再被解释为universal reference:
```
template<typename T>
void f(std::vector<T>&& param);     // “&&” means rvalue reference

template<typename T>
void f(const T&& param);            // “&&” means rvalue reference

template<typename MyTemplateParamType>
void f(MyTemplateParamType&& param); // “&&” means universal reference
````





有的时候你可以在函数模板的声明中看到`T&&`，但却没有发生类型推导。

```cpp
template <class T, class Allocator = allocator<T> >
class vector {
public:
    ...
    void push_back(T&& x);       // fully specified parameter type ⇒ no type deduction;
    ...                          // && ≡ rvalue reference
};
```

看看`push_back在类外部是如何声明的，这个问题的答案就很清楚了。`我会假装`std::vector`的 `Allocator` 参数不存在，因为它和我们的讨论无关。我们来看看没Allocator参数的`std::vector::push_back`:

```cpp
template <class T>
void vector<T>::push_back(T&& x);
```

`push_back`不能离开`std::vector<T>`这个类而独立存在。

但如果我们有了一个叫做`std::vector<T>`的类，我们就已经知道了T是什么东西，那就没必要推导T。

```cpp
template <class T>
void vector<T>::push_back(T&& x);
```



```cpp
Widget makeWidget();             // factory function for Widget
std::vector<Widget> vw;
...
Widget w;
vw.push_back(makeWidget());      // create Widget from factory, add it to vw
```

代码中对 `push_back` 的使用会让编译器实例化类 `std::vector<Widget>` 相应的函数。这个`push_back` 的声明看起来像这样:

```cpp
void std::vector<Widget>::push_back(Widget&& x);
```

看到了没? 一旦我们知道了类是 `std::vector<Widget>`，`push_back`的参数类型就完全确定了: 就是`Widget&&`。这里完全不需要进行任何的类型推导，所以是**右值引用**。



对比下 `std::vector` 的`emplace_back`，它看起来是这样的:

```cpp
template <class T, class Allocator = allocator<T> >
class vector {
public:
    template <class... Args>
    void emplace_back(Args&&... args); // deduced parameter types ⇒ type deduction;
    ...                                // && ≡ universal references
};
```

`emplace_back` 看起来需要多个参数(Args和args的声明当中都有...)，但重点是每一个参数的类型都需要进行推导。函数的模板参数 `Args` 和类的模板参数`T`无关，所以**即使我知道这个类具体是什么**，比如说，`std::vector<Widget>`，但我们**还是不知道`emplace_back`的参数类型是什么，所以说万能引用**。

我们看下在类`std::vector<Widget>`外面声明的 `emplace_back`会更清楚的表明这一点 (我会继续忽略 `Allocator` 参数):

```cpp
template<class... Args>
void std::vector<Widget>::emplace_back(Args&&... args);
```



### forward

所谓完美转发，就是为了让我们在传递参数的时候，保持原来 的参数类型（左引用保持左引用，右引用保持右引用）

std::forward 和 std::move 一样，没有做任何事情，std::move 单纯的将左值转化为右值， std::forward 也只是单纯的将参数做了一个类型的转换，从现象上来看，std::forward(v) 和 static_cast(v) 是完全一样的。

万能引用+完美转发

<utility>

```cpp
// 如果传入的是左值引用，比如T是int&，那么返回static<int& &&>也就是左值引用
// 也就是返回 int&
template <typename T>
T&& forward(typename std::remove_reference<T>::type& param)
{
    return static_cast<T&&>(param);
}
// 如果传入右值引用，比如T是int&&，那么返回static<int&& &&>也就是int&&
template <typename T>
T&& forward(typename std::remove_reference<T>::type&& param)
{
    return static_cast<T&&>(param);
}

// typename std::remove_reference<T>::type
含义就是获得去掉引用的参数类型。所以上面的两上模板函数中，第一个是左值引用模板函数，第二个是右值引用模板函数。

紧接着std::forward模板函数对传入的参数进行强制类型转换，转换的目标类型符合引用折叠规则，因此左值参数最终转换后仍为左值，右值参数最终转成右值。
```



https://www.yuanguohuo.com/2018/05/25/cpp11-perfect-forward/

对比[C++11中的通用引用](http://www.yuanguohuo.com/2018/05/25/cpp11-universal-ref/)中*std::move的工作原理*一节，我们发现，std::forward和std::move还是有一些相似之处的：

1. 它们都使用static_cast()来完成任务；
2. 它们都使用通用引用(及背后的类型推导和引用折叠机制)；

所不同的是：

1. `std::forward`参数是左值引用，返回的是通用引用；`std::move`参数是通用引用，返回的是右值引用；
2. 这很好理解：

- `std::forward`根据函数实参是左值引用还是右值引用，分别调用对应版本的forward，然后返回对应类型的引用即可
- `std::move`拿到的可能是左值也可能是右值(所以参数是通用引用)，但一定返回右值(所以返回值是右值引用)；



**自己的疑问，forward的返回类型，到底是通过引用折叠，还是通过万能引用来实现的？**



### make_shared

参考https://zsmj2017.tech/post/7447a461.html

这个连接有专栏effective modern cpp https://zsmj2017.tech/categories/Effective-Modern-C/

https://blog.csdn.net/CPriLuke/article/details/79462791



是个template function

make_shared的原理
利用forward function，对参数进行转发，调用对应类型的构造函数，返回shared_ptr



make function相比于直接new的优点
new需要显式声明ptr的类型，make function可以用auto推导



## STL

### STL的内存池 ==TODO==

https://blog.csdn.net/fengbingchun/article/details/78943527

头文件<memory>

https://zhuanlan.zhihu.com/p/34725232

https://blog.csdn.net/weixin_39640298/article/details/88766223

STL内存分配分为一级分配器和二级分配器，一级分配器就是采用malloc分配内存，二级分配器采用内存池。

二级分配器设计的非常巧妙，分别给8，16,…, 128等比较小的内存片都维持一个空闲链表
每个链表的头结点存储在数组中

需要分配内存时从合适大小的链表中取一块下来。

需要分配内存的时候，如果内存大于128，那么一级分配器直接malloc分配内存
否则，内存在128及以下，找对应合适的大小的内存块（8的倍数），访问对应的链表，从对应的链表中取出内存块。
使用完毕后，将对应的节点归还给对应的链表即可



调用二级allocator
1 从对应的freelist获取，有空余内存则直接返回
2 没有则从内存池获取，并补充到freelist
3 内存池也没有，则malloc
4 malloc失败，抛出异常

> 为了节省维持链表的开销，采用了一个union结构体，分配器使用union里的next指针来指向下一个节点，而用户使用的时候，指向实际的内存
>
> https://blog.csdn.net/dalleny/article/details/38981421





### STL的set map unordered_map的底层实现

map底层是基于红黑树实现的，因此map内部元素排列是有序的。
而unordered_map底层则是基于哈希表实现的，因此其元素的排列顺序是杂乱无序的。

红黑树
优点：
1 有序性，支持范围查找，最前面若干个，最后面若干个
2 map的查找、删除、增加等一系列操作时间复杂度稳定，都为logn
缺点如下：
1 查找、删除、增加等操作平均时间复杂度较慢，都为logn



对于unordered_map来说，其底层是一个哈希表
优点如下：
1 查找、删除、添加的速度快，时间复杂度为常数级O(1)
缺点如下：
1 hash占用内存多
2 查找、删除、添加的时间复杂度不稳定，平均为O(1)，取决于哈希函数。极端情况下可能为O(n)
3 只支持精确匹配



什么是红黑树？

红黑树是一种平衡二叉查找树，与AVL树的区别是什么？其插入和删除的效率都是N(logN)，AVL树是完全平衡的（任意一个节点的两个子节点，高度差不超过1），红黑树对平衡性进行了削弱。

- AVL，严格平衡，任何子树左右高度差不超过1
- 红黑树，对平衡性进行了阉割，根黑叶黑，任何链上（路径，从根节点到叶节点）的红色不能相邻，任何链上的黑色节点要求数量一样=>从而最长的链不超过最短的链的长度2倍

为什么选用红黑树呢？
AVL 树是高度平衡的，频繁的插入和删除，会引起频繁的rebalance，导致效率下降；==红黑树不是高度平衡的，算是一种折中，插入最多两次旋转，删除最多三次旋转==。

红黑树的定义：
1 节点要么黑要么红
2 根节点必须黑，空间点视作黑
3 父节点红，那么子节点必须黑
4 根节点到所有叶子节点路径上的黑节点数量相同



### vector

https://www.cnblogs.com/q1076452761/p/14654494.html



### 手写strcpy memcpy strcat strcmp

* memcpy :不判断是否重叠问题，从头开始复制（memcpy的问题在于，拷贝的目的地在原地址的后面，并且有重叠区域）

* memmove: 会判断是否有内存重叠问题。若内存重叠，则从后往前复制，避免内存重叠

* strcpy主要是字符串的拷贝
* mencpy是内存的拷贝，可以是字符串，也可以是结构体，针对的是内存

#### strcpy

```cpp
char* strcpy(char* dst, const char* src)
{
    assert(dst);
    assert(src);
    char* ret = dst;
    while((*dst++ = *src++) != '\0');
    return ret;
}
//该函数是没有考虑重叠的


char* strcpy(char* dst, const char* src)
{
    assert((dst != NULL) && (src != NULL));
    char* res = dst;
    int size = strlen(src) + 1; // 把尾零也算上
    if(dst > src && dst < src + len) // 有交叉，那么就倒着拷贝
    {
        dst = dst + size - 1;
        src = src + size - 1;
        while(size!=0)
        {
            size--;
            *dst-- = *src--;
        }
    }
    else
    {
        while(size!=0) // 没有交叉，就正向拷贝
        {
            size--;
            *dst++ = *src++;
        }
    }
    return res;
}

```


#### memcpy

```cpp
void* memcpy(void* dst, const void* src, size_t size)
{
    if(dst == NULL || src == NULL)
    {
        return NULL;
    }
    void* res = dst;
    if(dst > src && dst < src + size) // dst落在src~size之间，有重叠，倒着拷贝(dst如果在src之前，即使有重叠，正向拷贝也不会出错)
    {
        dst = dst + size - 1;
        src = src + size - 1;
        while(size!=0)
        {
            size--;
            *dst-- = *src--;
        }
    }
    else // 没有重叠，正向拷贝
    {
        while(size!=0)
        {
            size--;
            *dst++ = *src++;
        }
    }
    return res;
}
```



#### strcat

```cpp
char* strcat(char* dst, const char* src)
{
    char* res = dst;
    while(*dst != '\0')
        ++dst;
    while((*dst++ = *src++) != '\0'); // 尾零也会拷贝
    return res;
}
```



#### strcmp


```cpp
int strcmp(const char* str1, const char* str2)
{
    while(*str1 == *str2 && *str1 != '\0')
    {
        ++str1;
        ++str2;
    }
    int res = *str1 - *str2;
    if( res < 0 )return -1;
    else if( res == 0 )return 0;
    else return 1;
}
```



>- **[模板特化](https://link.zhihu.com/?target=http%3A//blog.csdn.net/thefutureisour/article/details/7964682/)** 
>- **[定位内存泄露](https://link.zhihu.com/?target=http%3A//www.cnblogs.com/skynet/archive/2011/02/20/1959162.html)** 
>  (1)在windows平台下通过CRT中的库函数进行检测； 
>   (2)在可能泄漏的调用前后生成块的快照，比较前后的状态，定位泄漏的位置 
>   (3)Linux下通过工具valgrind检测



## 数据结构与算法

### Hash表

- [Hash表实现](https://blog.csdn.net/shanghairuoxiao/article/details/73693458)（拉链和分散地址）
- Hash主要两点，哈希函数（关注冲突率和哈希的计算速度）和哈希策略（如何处理冲突）
- STL中hash_map扩容发生什么？ 
  (1) 创建一个新桶，该桶是原来桶两倍大最接近的质数(判断n是不是质数的方法：用n除2到sqrt(n)范围内的数) ； 
  (2) 将原来桶里的数通过指针的转换，插入到新桶中(注意STL这里做的很精细，没有直接将数据从旧桶遍历拷贝数据插入到新桶，而是通过指针转换) 
  (3) 通过swap函数将新桶和旧桶交换，销毁新桶。



### 树

- 树的各种常见算法题([http://blog.csdn.net/xiajun07061225/article/details/12760493](https://link.zhihu.com/?target=http%3A//blog.csdn.net/xiajun07061225/article/details/12760493))；
- **[Trie树(字典树)](https://link.zhihu.com/?target=http%3A//blog.csdn.net/hackbuteer1/article/details/7964147)**



### 海量数据问题

- 十亿整数（随机生成，可重复）中前K最大的数 
- **十亿整数（随机生成，可重复）中出现频率最高的一千个**



### [排序算法](https://link.zhihu.com/?target=http%3A//blog.csdn.net/shanghairuoxiao/article/details/74063684)

- 排序算法当然是基础内容了，必须至少能快速写出，快排，建堆，和归并
- 每种算法的时间空间复杂度，最好最差平均情况



### [位运算](https://link.zhihu.com/?target=http%3A//blog.csdn.net/shanghairuoxiao/article/details/75386508)



