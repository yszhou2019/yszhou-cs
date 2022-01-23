


# `std::thread::detach`

创建thread之后，要么join（直接等待这个线程结束），要么detach（放到后台运行，不再管这个线程），二者必选其中一个，否则导致fatal error

https://stackoverflow.com/questions/22803600/when-should-i-use-stdthreaddetach



# `std::function`

https://www.zhihu.com/question/41684177/answer/91952216

std::function，说白了，就是**把函数对象化**了。



usage

https://zhuanlan.zhihu.com/p/390883475

https://blog.csdn.net/wangshubo1989/article/details/49134235





# `std::thread`



usage

https://blog.csdn.net/guotianqing/article/details/115013546



# `std::async`

https://zhuanlan.zhihu.com/p/39757902



# multi-threading



## `<thread>`



### template class:thread

member type

> std::thread::id，线程id



member function

> thread()
> ~thread()
>
> get_id() 返回当前线程的id
>
> join() 主线程等待当前线程运行结束
>
> detach() 当前线程后台运行
>
> joinable() 判断当前线程是否可以调用join()



多线程增加全局atomic示例 https://www.cplusplus.com/reference/thread/thread/thread/







## `<atomic>`



### template class: atomic



https://www.cplusplus.com/reference/atomic/atomic/



为什么atomic比mtuex性能更高？https://www.zhihu.com/question/302472384



### namespace:this_thread

std::this_thread是个namespace， groups a set of functions that access the current thread.



为当前线程提供以下4个函数

get_id()，返回类型是std::thread::id

sleep_for()

sleep_until()

yield()



## `<mutex>`



### 

### class:mutex



互斥锁mutex的底层原理是什么，OS如何实现的？https://www.zhihu.com/question/332113890



### template class:lock_guard



## `<future>`





## `<condition_variable>`





# other



## `<functional>`





### global functions

> ref
>
> cref
>
> bind

function ref https://www.cplusplus.com/reference/functional/ref/?kw=ref

std::ref()的使用和std::cref()的使用 https://zhuanlan.zhihu.com/p/412220759



## `<utility>`

https://www.cplusplus.com/reference/utility/



### template class:pair

std::pair



### global functions

std::move https://zhuanlan.zhihu.com/p/335994370
std::forward

std::make_pair

std::swap



## `<memory>`



### template class:shared_ptr



### template class:unique_ptr



### template class:weak_ptr





### global functions

> make_shared
>
> 
>
> make_unique <- C++14才支持
>
> 



## `<new>`





## `<regex>`