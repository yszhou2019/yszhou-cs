# online book

Python 进阶
https://docs.pythontab.com/interpy/func_caching/README/

装饰器的正确理解

https://docs.pythontab.com/interpy/decorators/your_first_decorator/



Python并行编程
https://python-parallel-programmning-cookbook.readthedocs.io/zh_CN/latest/index.html



# python中进行下载，解压

wget是一个从网络上自动下载文件的自由工具。它支持HTTP，HTTPS和FTP协议，可以使用HTTP代理。

```
pip install wget
```



```python
import wget
import tarfile

URL='xxx'
out_fname='abc.tar.gz'

wget.download(URL, out=out_fname)
tar = tarfile.open(out_fname)
tar.extractall()
tar.close()
```





# gevent

## 原理

user space 下保存不同coroutine的ctx和stack，通过汇编直接切换stack和上下文，避免了user space 和 kernel space的进入/退出的开销

cons: 适合io密集，不适合cpu密集



user-level threading

create threads and save/restore registers to switch between threads

执行yield的时候，调度器选择合适的线程，将当前线程的ctx写入内存；从内存中加载选中的线程

```assembly
	.text

	/*
         * save the old thread's registers,
         * restore the new thread's registers.
         */

	.globl thread_switch
thread_switch:
	/* YOUR CODE HERE */
	# a0 is the old thread's address
	# save old
	sd ra, 0(a0)
	sd sp, 8(a0)
	sd s0, 16(a0)
	sd s1, 24(a0)
	sd s2, 32(a0)
	sd s3, 40(a0)
	sd s4, 48(a0)
	sd s5, 56(a0)
	sd s6, 64(a0)
	sd s7, 72(a0)
	sd s8, 80(a0)
	sd s9, 88(a0)
	sd s10, 96(a0)
	sd s11, 104(a0)

	# a1 is the new thread's address
	# restore new
	ld ra, 0(a1)
	ld sp, 8(a1)
	ld s0, 16(a1)
	ld s1, 24(a1)
	ld s2, 32(a1)
	ld s3, 40(a1)
	ld s4, 48(a1)
	ld s5, 56(a1)
	ld s6, 64(a1)
	ld s7, 72(a1)
	ld s8, 80(a1)
	ld s9, 88(a1)
	ld s10, 96(a1)
	ld s11, 104(a1)

	ret    /* return to ra */

```





```c
#include "kernel/types.h"
#include "kernel/stat.h"
#include "user/user.h"

/* Possible states of a thread: */
#define FREE        0x0
#define RUNNING     0x1
#define RUNNABLE    0x2

#define STACK_SIZE  8192
#define MAX_THREAD  4


struct thread {
  uint64     ra;
  uint64     sp;
  uint64     s0;
  uint64     s1;
  uint64     s2;
  uint64     s3;
  uint64     s4;
  uint64     s5;
  uint64     s6;
  uint64     s7;
  uint64     s8;
  uint64     s9;
  uint64     s10;
  uint64     s11;
  char       stack[STACK_SIZE]; /* the thread's stack */
  int        state;             /* FREE, RUNNING, RUNNABLE */
};
struct thread all_thread[MAX_THREAD];
struct thread *current_thread;
extern void thread_switch(uint64, uint64);
              
void 
thread_init(void)
{
  // main() is thread 0, which will make the first invocation to
  // thread_schedule().  it needs a stack so that the first thread_switch() can
  // save thread 0's state.  thread_schedule() won't run the main thread ever
  // again, because its state is set to RUNNING, and thread_schedule() selects
  // a RUNNABLE thread.
  current_thread = &all_thread[0];
  current_thread->state = RUNNING;
}

void 
thread_schedule(void)
{
  struct thread *t, *next_thread;

  /* Find another runnable thread. */
  next_thread = 0;
  t = current_thread + 1;
  for(int i = 0; i < MAX_THREAD; i++){
    if(t >= all_thread + MAX_THREAD)
      t = all_thread;
    if(t->state == RUNNABLE) {
      next_thread = t;
      break;
    }
    t = t + 1;
  }

  if (next_thread == 0) {
    printf("thread_schedule: no runnable threads\n");
    exit(-1);
  }

  if (current_thread != next_thread) {         /* switch threads?  */
    next_thread->state = RUNNING;
    t = current_thread;
    current_thread = next_thread;
    /* YOUR CODE HERE
     * Invoke thread_switch to switch from t to next_thread:
     * thread_switch(??, ??);
     */
    thread_switch((uint64)t, (uint64)next_thread);
  } else
    next_thread = 0;
}

void 
thread_create(void (*func)())
{
  struct thread *t;

  for (t = all_thread; t < all_thread + MAX_THREAD; t++) {
    if (t->state == FREE) break;
  }
  t->state = RUNNABLE;
  // YOUR CODE HERE
  t->ra = (uint64)func;
  t->sp = (uint64)t->stack + STACK_SIZE;
}

void 
thread_yield(void)
{
  current_thread->state = RUNNABLE;
  thread_schedule();
}

volatile int a_started, b_started, c_started;
volatile int a_n, b_n, c_n;

void 
thread_a(void)
{
  int i;
  printf("thread_a started\n");
  a_started = 1;
  while(b_started == 0 || c_started == 0)
    thread_yield();
  
  for (i = 0; i < 100; i++) {
    printf("thread_a %d\n", i);
    a_n += 1;
    thread_yield();
  }
  printf("thread_a: exit after %d\n", a_n);

  current_thread->state = FREE;
  thread_schedule();
}

void 
thread_b(void)
{
  int i;
  printf("thread_b started\n");
  b_started = 1;
  while(a_started == 0 || c_started == 0)
    thread_yield();
  
  for (i = 0; i < 100; i++) {
    printf("thread_b %d\n", i);
    b_n += 1;
    thread_yield();
  }
  printf("thread_b: exit after %d\n", b_n);

  current_thread->state = FREE;
  thread_schedule();
}

void 
thread_c(void)
{
  int i;
  printf("thread_c started\n");
  c_started = 1;
  while(a_started == 0 || b_started == 0)
    thread_yield();
  
  for (i = 0; i < 100; i++) {
    printf("thread_c %d\n", i);
    c_n += 1;
    thread_yield();
  }
  printf("thread_c: exit after %d\n", c_n);

  current_thread->state = FREE;
  thread_schedule();
}

int 
main(int argc, char *argv[]) 
{
  a_started = b_started = c_started = 0;
  a_n = b_n = c_n = 0;
  thread_init();
  thread_create(thread_a);
  thread_create(thread_b);
  thread_create(thread_c);
  thread_schedule();
  exit(0);
}
```



output

```
$ ./uthread
thread_a started
thread_b started
thread_c started
thread_c 0
thread_a 0
thread_b 0
thread_c 1
thread_a 1
thread_b 1
...
thread_c 99
thread_a 99
thread_b 99
thread_c: exit after 100
thread_a: exit after 100
thread_b: exit after 100
thread_schedule: no runnable threads
```





## 比较常用的函数

### `__init__`

### `spawn`

### `kill`

### `join`

### `joinall`

### `get`





# with

http://blog.kissdata.com/2014/05/23/python-with.html

with自动调用\_\_enter\_\_

离开的时候自动调用\_\_exit\_\_

```
1.通过 with 语句可以得到一个上下文管理器

2.执行对象

3.加载 __enter__ 方法

4.加载 __exit__ 方法

5.执行 __enter__

6.as 可以得到 enter 的返回值

7.拿到对象执行相关操作

8.执行完了之后调用 __exit__ 方法

9.如果遇到异常，__exit__ 可以获取到异常信息

10.在 __exit__ 中处理异常，返回 True

11.继续执行 with 后面的语句。
```





# multithread

适用于`threading multiprocessing gevent.greenlet`三种thread



## 创建thread的两种方法

两种方法

1 直接创建thread对象，通过参数中传递想要执行的target function以及args

> main thread用.join()来等待child thread运行完毕

```python
t = Thread(target = run, args = ("this is a", "thread"))
#这句只是创建了一个线程，并未执行这个线程，此时线程处于新建状态。
t.start()#启动线程
#启动线程，此时线程扔为运行，只是处于准备状态。
```



2 继承thread类，进行overwrite，重写对应的`__init()__` 以及`__run()`



## 线程同步

`thread.join()`，等待某线程执行完毕





## 多进程还是多线程

`mp`多进程适用于CPU密集型，会有额外的内存开销（vm table）

`threaing gevent.Greenlet`多线程适用于IO密集型

> 为什么是这样呢？其实也不难理解。对于IO密集型操作，大部分消耗时间其实是等待时间，在等待时间中CPU是不需要工作的，那你在此期间提供双CPU资源也是利用不上的，相反对于CPU密集型代码，2个CPU干活肯定比一个CPU快很多。那么为什么多线程会对IO密集型代码有用呢？这时因为python碰到等待会释放GIL供新的线程使用，实现了线程间的切换。
>
> https://zhuanlan.zhihu.com/p/46368084



## threadpool和processpool

```python
# mp模块的线程池
from multiprocessing.dummy import Pool as ThreadPool
#给线程池取一个别名ThreadPool
cnt=0
def run(fn):
    global cnt
    cnt+=1
    print(cnt)

if __name__ == '__main__':
  testFL = [i for i in range(100)]
  pool = ThreadPool(100)#创建10个容量的线程池并发执行
  pool.map(run, testFL)
  pool.close()
  pool.join()
```





## loop创建线程还是线程池

> 很多时候系统都需要创建多个进程以提高CPU的利用率，当数量较少时，可以手动生成一个个Process实例。当**进程数量很多时，或许可以利用循环，但是这需要程序员手动管理系统中并发进程的数量，有时会很麻烦。这时进程池Pool就可以发挥其功效了。可以通过传递参数限制并发进程的数量，默认值为CPU的核数**。
>
> Pool类可以提供指定数量的进程供用户调用，当有新的请求提交到Pool中时，如果进程池还没有满，就会创建一个新的进程来执行请求。如果池满，请求就会告知先等待，直到池中有进程结束，才会创建新的进程来执行这些请求。
>
> https://zhuanlan.zhihu.com/p/46368084
>
> 
>
> 当我们需要执行的并发任务大于cpu的核数时，我们需要知道一个操作系统不能无限的开启进程和线程，通常有几个核就开几个进程，如果进程开启过多，就无法充分利用cpu多核的优势，效率反而会下降。这个时候就引入了进程池线程池的概念。
>
> 池的功能就是限制启动的进程数或线程数
>
> https://developer.aliyun.com/article/642649
>
> https://blog.csdn.net/weixin_42486603/article/details/108267992





## multiprocessing & concurrent.futures



> I wouldn't call `concurrent.futures` more "advanced"

实际上，mp的两个pool和concurrent的两个pool一样

只不过，mp的api可能随着版本变动比较大；而concurrent.futures的api变动比较小，接口稳定



两个进程池的使用demo

mp.pool



### `Pool.map() Pool.map_async() Pool.imap() Pool.imap_unordered()`

```python
from multiprocessing import Pool as ProcessPool

num=5
pool=ProcessPool(num)
# workload是一个list或者是个queue，里面是需要完成的workload
# map_func是对single_val进行操作，然后返回操作结果
result=pool.map(map_func, workload)
# map()默认是阻塞的，是等待所有workload执行完成

pool.close()
pool.join()
```



> `Pool.map()` 阻塞执行，等待所有workload运行完毕
>
> `Pool.map_async()` 非阻塞执行，需要手动调用`Pool.wait()`等待执行完毕
>
> 
>
> |                         | 阻塞与否                                | Partial result? 是否有序？                           |
> | ----------------------- | --------------------------------------- | ---------------------------------------------------- |
> | `Pool.map()`            | 阻塞                                    | 顺序结果，只能得到整体的result                       |
> | `Pool.map_async()`      | 非阻塞<br />可以调用`Pool.wait()`来等待 | 顺序结果<br />`Pool.map_async().get()`只能整体result |
> | `Pool.imap()`           | **阻塞**                                | 迭代，顺序结果                                       |
> | `Pool.imap_unordered()` | **阻塞**                                | 迭代，乱序结果                                       |
>
> 
>
> With `map_async`, an `AsyncResult` is returned right away, but you can't actually retrieve results from that object until all of them have been processed, at which points it returns the same list that `map` does (`map` is actually implemented internally as `map_async(...).get()`). There's no way to get partial results; you either have the entire result, or nothing.
>
> `Pool.map()` **得到的结果必然是顺序的**
>
> `Pool.imap_unordered()` 好处，大数据的情况下，可以节省内存
>
> 
>
> ```python
> import multiprocessing
> import time
> 
> def func(x):
>  time.sleep(x)
>  return x + 2
> 
> if __name__ == "__main__":    
>  p = multiprocessing.Pool()
>  start = time.time()
>  for x in p.imap(func, [1,5,3]):
>      print("{} (Time elapsed: {}s)".format(x, int(time.time() - start)))
>  p.close() # 必须退出，否则进程不会退出
> ```
>
> the primary reasons to use `imap`/`imap_unordered` over `map_async` are:
>
> 1. Your iterable is large enough that converting it to a list would cause you to run out of/use too much memory.
> 2. You want to be able to start processing the results before *all* of them are completed.
>
> https://stackoverflow.com/questions/26520781/multiprocessing-pool-whats-the-difference-between-map-async-and-imap
>
> 
>
> https://stackoverflow.com/questions/35908987/multiprocessing-map-vs-map-async
>
> ```python
> # processPool执行任务的几种方式
> pool.map(map_func, workload) # 默认阻塞，等待所有任务执行完成
> 
> pool.map_async(map_func, workload) # 异步执行，只有调用pool.wait()的时候才会阻塞，等待所有任务执行完毕
> ```
>
> 



mp类的pool方法

https://zhuanlan.zhihu.com/p/46368084







> Here is an overview in a table format in order to show the differences between `Pool.apply`, `Pool.apply_async`, `Pool.map` and `Pool.map_async`. When choosing one, you have to take multi-args, concurrency, blocking, and ordering into account:
>
> ```py
>                   | Multi-args   Concurrence    Blocking     Ordered-results
> ---------------------------------------------------------------------
> Pool.map          | no           yes            yes          yes
> Pool.map_async    | no           yes            no           yes
> Pool.apply        | yes          no             yes          no
> Pool.apply_async  | yes          yes            no           no
> Pool.starmap      | yes          yes            yes          yes
> Pool.starmap_async| yes          yes            no           no
> ```
> 
> https://stackoverflow.com/questions/8533318/multiprocessing-pool-when-to-use-apply-apply-async-or-map
>





```python
from functools import reduce

result = p.imap_unordered(map_func, data)
final_result = reduce(reduce_func, result)

# Three different runs:
# [0, 1, 4, 5, 2, 6, 8, 9, 7, 3]
# [0, 1, 4, 5, 2, 3, 8, 7, 6, 9]
# [0, 1, 2, 5, 6, 7, 8, 4, 3, 9]
```

https://stackoverflow.com/questions/38362198/map-reduce-with-multiprocessing



### Concurrent.Pool TODO





https://stackoverflow.com/questions/20776189/concurrent-futures-vs-multiprocessing-in-python-3









## benchmark

```
Line cpu 74.81034088134766 -> 平均一个任务需要7.48s
Line IO 10.53583312034607 -> 1.05s
Line Http Request 1.3474907875061035 -> 0.13s
Multithread cpu 75.31130194664001 -> 10线程parallel，并没有并行：并行结果应该在7.48s左右
Multithread IO 46.91295909881592 -> 没有并行，并行结果应该在1.05s
Multithread Http Request 2.8091483116149902 -> 没有并行，并行结果应该在0.13s
Multiprocess cpu 10.522237062454224 -> 单process耗时10.5s
Multiprocess IO 3.7678110599517822 -> 单process耗时3.76s
Multiprocess Http Request 0.5583229064941406 -> 单process耗时0.55s
Gevent Http Request 0.15353822708129883 -> 单let耗时0.15s
```



benchmark的解释

> python中有一个全局锁（GIL），在使用**多进程(Thread)的情况下，不能发挥多核的优势**。而使用多进程(Multiprocess)，则可以发挥多核的优势真正地提高效率。
>
> https://www.runoob.com/w3cnote/python-single-thread-multi-thread-and-multi-process.html



在Python中,为什么多线程I/O密集程序, 反而比单线程I/O密集程序速度慢? https://www.zhihu.com/question/22506808

为什么有人说 Python 的多线程是鸡肋呢？https://www.zhihu.com/question/23474039



## py多线程鸡肋的原因



单py进程执行多线程的原理

> 在多线程环境中，Python虚拟机按照以下方式执行。
>
> 1.设置GIL。
>
> 2.切换到一个线程去执行。
>
> 3.运行。
>
> 4.把线程设置为睡眠状态。
>
> 5.解锁GIL。
>
> 6.再次重复以上步骤。



py使用多线程，唯一能够想到的优点就是网络io

**但是**线程终究是由OS来调度的，我们可以用自主控制调度的协程来替换，获取更好的执行效果。就算是io密集型任务，为什么要用OS调度不可控制的线程呢？

线程在py3里面就是个鸡肋

cpu密集型任务->mp

io密集型任务->coroutine/greenlet





一个python进程，里面开若干线程，也只是由解释器线性执行不同的thread，只可能对io密集型任务有加速，对于cpu密集型任务没啥加速的。

但是多个python进程，就由多个解释器来执行，这时候就真的可以加速了。



## asyncio TODO









## conclusion

`threading` or `gevent` or `multiprocessing.dummy ipmort Pool as ThreadPool` -> 加速网络io



对于cpu密集型任务，可选择：
`Multiprocssing.Process` or `multiprocessing import Pool` or ` concurrent.ProcessPoolExecutor`





```python
# threadpool same as concurrent.futures.ThreadPoolExector
from multiprocessing.dummy import Pool
from concurrent.futures import ThreadPoolExecutor

# mp的进程pool和futures里面的进程pool差不多
from multiprocessing import Pool
from concurrent.futures import ProcessPoolExecutor
```







ref: 

https://www.jianshu.com/p/2dc3673b9919

https://blog.csdn.net/waple_0820/article/details/93026922

https://developer.aliyun.com/article/642649

https://blog.csdn.net/weixin_42486603/article/details/108267992





# 命令行工具类

## 格式化

autopep8

```bash
autopep8 demo.py --in-place # 格式化后就地替换
```





## Py2->py3

2to3

```bash
2to3 demo.py -w # 转化后就地替换
```

