静态指针 的好处是 使用的时候才创建，但也有多线程问题

为什么用c++实现单例模式时，类中要定义一个静态指针而不是静态对象？
可不可以把静态指针换成静态对象？
> 链接：https://www.zhihu.com/question/34850977/answer/60092579

```cpp
Singleton& Singleton::getInstance() {
    static Singleton instance;
    return instance;
}
```
https://preshing.com/20130930/double-checked-locking-is-fixed-in-cpp11/

Double-Checked Locking is Fixed In C++11
If control enters the declaration concurrently while the variable is being initialized, the concurrent execution shall wait for completion of the initialization.所以，静态类成员(也就是静态局部变量)也是可以的，只不过在程序开始即构造，而不是第一次用到时。(使用静态变量的方式实现singleton，带来的问题是不能lazy allocate)

相比静态对象，静态指针更省空间，二进制文件相对小。但缺点也很明显，第一次分配的时候存在多线程竞争问题。

使用static object完成singleton的注意点
1. 私有构造
2. getInstance()必须返回引用
3. getInstance()内部是静态局部变量

单例模式的线程安全
指的是getInstance()是线程安全的，假如多个线程都获取类A的对象，如果只是只读操作，完全OK，但是如果有线程要修改，有线程要读取，那么类A自身的函数需要自己加锁防护，不是说线程安全的单例也能保证修改和读取该对象自身的资源也是线程安全的。

为什么不能直接加lock->getInstance()效率
为什么不直接一开始构造，之后用的时候就可以避免了->lazy allocate(懒汉模式)


https://zhuanlan.zhihu.com/p/37469260

懒汉模式 也就是lazy allocate
饿汉模式 也就是立即初始化

> 教学版，即懒汉版（Lazy Singleton）：单例实例在第一次被使用时才进行初始化，这叫做延迟初始化。



> C++11规定了local static在多线程条件下的初始化行为，要求编译器保证了内部静态变量的线程安全性。在C++11标准下，《Effective C++》提出了一种更优雅的单例模式实现，使用函数内的 local static 对象。这样，只有当第一次访问getInstance()方法时才创建实例。这种方法也被称为Meyers' Singleton。C++0x之后该实现是线程安全的，C++0x之前仍需加锁。

> 饿汉版（Eager Singleton）：指单例实例在程序运行时被立即执行初始化

