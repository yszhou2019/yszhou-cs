

### [进程与线程](https://blog.csdn.net/shanghairuoxiao/article/details/74012512)

(1) 进程与线程区别？ 
(2) 线程比进程具有哪些优势？ 
(3) 什么时候用多进程？什么时候用多线程？ 
(4) LINUX中进程和线程使用的几个函数？ 
(5) 线程同步？ 
在Linux下线程同步的方式有：互斥锁，自旋锁，读写锁，屏障(并发完成同一项任务时，屏障的作用特别好使) 知道这些锁之间的区别，使用场景？





### 进程调度

1. Linux进程分为两种，实时进程和非实时进程；
2. 优先级分为静态优先级和动态优先级，优先级的范围；
3. 调度策略
4. 交互进程通过平均睡眠时间而被奖励；





### [进程间通讯方式](https://www.cnblogs.com/CheeseZH/p/5264465.html)

1. **匿名管道与命名管道的区别**：匿名管道只能在具有公共祖先的两个进程间使用。
2. **共享文件映射mmap** 
   进程读写一个文件，读取文件到内核之后，为了避免kernel <-> user之间的内存拷贝，通过VMA直接把va->映射到对应文件在内核缓冲区的pa。
   mmap建立进程空间到文件的映射，在建立的时候并不直接将文件拷贝到物理内存，同样采用缺页终端。mmap映射一个具体的文件可以实现任意进程间共享内存，映射一个匿名文件，可以实现父子进程间共享内存。
3. **常见的信号有哪些？**：SIGINT，SIGKILL(不能被捕获)，SIGTERM(可以被捕获)，SIGSEGV，SIGCHLD，SIGALRM



### [内存管理](https://blog.csdn.net/shanghairuoxiao/article/details/70256247)

1. 虚拟内存的作用？
2. 虚拟内存的实现？
3. 操作系统层面对内存的管理？
4. 内存池的作用？STL里[内存池如何实现](https://link.zhihu.com/?target=https%3A//github.com/oscarwin/MemoryPool)？
5. 进程空间和内核空间对内存的管理不同？
6. Linux的slab层，VAM？
7. 伙伴算法



### [死锁](https://link.zhihu.com/?target=http%3A//blog.csdn.net/shanghairuoxiao/article/details/70444940)

(1) 死锁产生的条件； 
(2) 死锁的避免；



### 命令行

1. Linux命令 在一个文件中，倒序打印第二行前100个大写字母

```text
cat filename | head -n 2 | tail -n 1 | grep '[[:upper:]]' -o | tr -d '\n'| cut -c 1-100 | rev 
```

1. 与CPU，内存，磁盘相关的命令(top，free, df, fdisk)
2. 网络相关的命令netstat，tcpdump等
3. sed, awk, grep三个超强大的命名，分别用与格式化修改，统计，和正则查找
4. ipcs和ipcrm命令
5. 查找当前目录以及字母下以.c结尾的文件，且文件中包含”hello world”的文件的路径
6. 创建定时任务



___



### Linux的API

- **fork与vfork区别** 

fork采用写时拷贝技术，子进程和父进程的页表指向相同的页框（写数据的时候才会真正进行拷贝）

>fork和vfork都用于创建子进程。但是vfork创建子进程后，父进程阻塞，直到子进程调用exit()或者excle()。 
>对于内核中过程fork通过调用clone函数，然后clone函数调用do_fork()。do_fork()中调用copy_process()函数先复制task_struct结构体，然后复制其他关于内存，文件，寄存器等信息。fork采用写时拷贝技术，因此子进程和父进程的页表指向相同的页框。但是vfork不需要拷贝页表，因为父进程会一直阻塞，直接使用父进程页表。
>
>



- **exit()与_exit()区别** 
  exit()清理后进入内核，_exit()直接陷入内核。



- **Linux是如何避免内存碎片的**

1. 伙伴算法，用于管理物理内存，避免内存碎片;
2. 高速缓存Slab层用于管理内核分配内存，避免碎片。

https://blog.csdn.net/aurorayqz/article/details/79671785





- **共享内存的实现原理？** 
- 系统调用与库函数(open, close, create, lseek, write, read)
- 同步方法有哪些？



1. 互斥锁，自旋锁，信号量，读写锁，屏障
2. 互斥锁与自旋锁的区别：互斥锁得不到资源的时候阻塞，不占用cpu资源。自旋锁得不到资源的时候，不停的查询，而然占用cpu资源。
3. 死锁



- ++i是否是原子操作 ？
  明显不是，++i主要有三个步骤，把数据从内存放在寄存器上，在寄存器上进行自增，把数据从寄存器拷贝会内存，每个步骤都可能被中断。



- 判断大小端

> 如何判断
> 给一个int，获取对应地址，转化成char*，每次打印一个char，十六进制方式打印
>
> 如果低地址存放的是low bit位，那么就是little endian
>
> 





## 设计模式

- [单例模式线程安全的写法](https://link.zhihu.com/?target=http%3A//www.jellythink.com/archives/82)
- STL里的迭代器模式，适配器模式



# 网络IO



## C10k TODO

epoll怎么解决io效率问题的？内核和用户空间之间消息传递方式，比较细节（）

随着互联网的普及，应用的用户群体几何倍增长，此时服务器性能问题就出现。最初的服务器是基于进程/线程模型。新到来一个TCP连接，就需要分配一个进程。假如有C10K，就需要创建1W个进程，可想而知单机是无法承受的。那么如何突破单机性能是高性能网络编程必须要面对的问题，进而这些局限和问题就统称为C10K问题



C10k问题



问题本质



解决方案



https://zhuanlan.zhihu.com/p/339079330





## 重新认知IO多路复用、同步异步IO、阻塞IO

https://mp.weixin.qq.com/s/YdIdoZ_yusVWza1PU7lWaw

- epoll 这个系统调用，是同步的，也就是必须等待操作系统返回值。
- 底层用了 epoll 的封装后的网络框架，可以是异步的，只要你暴露给外部的接口，无需等待你的返回值即可。
- epoll 这个系统调用的底层内核设计里，每个 IO 事件的通知等待，是异步的
- epoll 这个系统调用对外部来说，是一个同步的接口



阻塞IO，比如read，两阶段阻塞

> 1 拷贝网卡的buffer到kernel buffer
> 2 拷贝kernel buffer到user buffer
> 两步均完成，read才返回
>
> 弊端
> server进行read之后，如果client不发送任何数据，导致server进程阻塞，无法响应其他客户端的连接





非阻塞IO

> server进程accept(listen_fd)（listen_fd仍然是阻塞的）连接之后，创建一个进程/线程去执行read(conn_fd)
>
> 执行阶段：
> 1 如果对应的数据没有到达网卡，或者数据还没有从网卡拷贝到内核，read直接返回-1（这个阶段非阻塞）
> 2 数据已经到kernel space，需要拷贝到user space（这一阶段read阻塞）
>
> 如何使用
> 一个client对应一个子进程/线程，服务器资源很快耗尽



用户捏一个概念上的IO多路复用

> 用数组存储fd，每个fd都是非阻塞，for loop遍历，如果read返回值不是-1，则执行业务逻辑
>
> ```cpp
> for fd in fdlist:
> 	if read(fd)!=-1:
> 		doWork()
> ```
>
> 
>
> 弊端
> 这种遍历方式也只是我们用户自己想出的小把戏，每次遍历遇到 read 返回 -1 时仍然是一次浪费资源的系统调用。
> 1 for循环直接read fd，浪费CPU，导致CPU使用率升高
> 2 for循环+sleep，导致吞吐不行



select

> 基本思想
> 用户程序调用 select，将这批文件描述符 list 交给操作系统去遍历
> 当 select 函数返回后，用户依然需要遍历刚刚提交给操作系统的 list（操作系统会将准备就绪的文件描述符做上标识，用户层将不会再有无意义的系统调用开销）
>
> 弊端：
> 1 select 调用需要传入 fd 数组，需要拷贝一份到内核，高并发场景下这样的拷贝消耗的资源是惊人的。（可优化为不复制）
> 2 select 在内核层仍然是通过遍历的方式检查文件描述符的就绪状态，是个同步过程，只不过无系统调用切换上下文的开销。（内核层可优化为异步事件通知）
> 3 select 仅仅返回可读文件描述符的个数，具体哪个可读还是要用户自己遍历。（可优化为只返回给用户就绪的文件描述符，无需用户做无效的遍历）
>
> 



poll

> 它和 select 的主要区别就是，去掉了 select 只能监听 1024 个文件描述符的限制。



epoll

>  epoll 主要就是针对select三个弊端进行了改进。
> 1 内核中保存一份文件描述符集合，无需用户每次都重新传入，只需告诉内核修改的部分即可。
> 2 内核不再通过轮询的方式找到就绪的文件描述符，而是通过异步 IO 事件唤醒。
> 3 内核仅会将有 IO 事件的文件描述符返回给用户，用户也无需遍历整个文件描述符集合。



多路复用之所以效率高，是因为用一个线程就可以监控多个文件描述符。

这显然是知其然而不知其所以然，多路复用产生的效果，完全可以由用户态去遍历文件描述符并调用其非阻塞的 read 函数实现。而多路复用快的原因在于，操作系统提供了这样的系统调用，使得原来的 while 循环里多次系统调用，变成了一次系统调用 + 内核层遍历这些文件描述符。



### 多路复用与同步

多路复用只是操作系统提供的更高效的批处理遍历判断fd是否就绪的手段，业务代码即使非阻塞socket，读写操作仍然是同步的（用户空间和内核空间的拷贝是阻塞的）



### 小结

三个都是syscall，每次syscall，由操作系统来完成对于所有fd的状态判断，返回给用户
不同在于：
1 三个syscall可监控的fd数量（select监听1024个）
2 若干fd的内核与用户态之间的拷贝开销
3 OS内核对于fd的状态的监控方案（select在内核下遍历，epoll通过回调机制）
4 用户态是否需要遍历监听结果（select需要用户程序对于返回结果暴力遍历，epoll返回的结果，每个fd都是已经触发的）

这就是为什么同样每次syscall遍历若干fd，epoll更快的原因

epoll遍历效率更高，原因：
1 内核空间创建epollfd，避免拷贝，且避免了fd数量
2 内核遍历fd，通过异步回调机制
3 epoll的返回结果，都是就绪的fd



epoll原理深入

> 基本概念
> epoll_fd代表对应的epoll池子，可以向池子里面增删改查fd
>
> **第一个跟高效相关的问题来了，添加 fd 进池子也就算了，如果是修改、删除呢？怎么做到时间快？**
> 红黑树。Linux 内核对于 epoll 池的内部实现就是用红黑树的结构体来管理这些注册进程来的句柄 fd。
>
> 
>
> fd对应的数据就绪，如何感知
>
> **现在思考第二个高效的秘密：怎么才能保证数据准备好之后，立马感知呢？**
>
> 中断+回调机制。网络包到达网卡缓冲区，通过中断执行回调函数，将就绪fd对应的结构体放入就绪队列。
>
> 
>
> **划重点：这个 poll 事件回调机制则是 epoll 池高效最核心原理。**
>
> **第二个问题：poll 怎么设置？**
>
> 在 `epoll_ctl` 下来的实现中，有一步是调用 `vfs_poll` 这个里面就会有个判断，如果 fd 所在的文件系统的 `file_operations` 实现了 poll ，那么就会直接调用，如果没有，那么就会报告响应的错误码。
>
> ```c
> static inline __poll_t vfs_poll(struct file *file, struct poll_table_struct *pt)
> {
>     if (unlikely(!file->f_op->poll))
>         return DEFAULT_POLLMASK;
>     return file->f_op->poll(file, pt);
> }
> ```
>
> 



https://www.qiyacloud.cn/2021/07/2021-07-05/



## IO多路复用

### 概念

IO多路复用（IO Multiplexing）是指单个进程/线程就可以同时处理多个IO请求

基本使用：用户将想要监视的文件描述符（File Descriptor）添加到select/poll/epoll函数中，由内核监视，函数阻塞。一旦有文件描述符就绪（读就绪或写就绪），或者超时（设置timeout），函数就会返回，然后该进程可以进行相应的读/写操作。



### select

>解决了什么问题？
>
>如果不用select，而是while循环内部单独判断每个fd是否可读，那么就相当于不断进行system call，每个fd都通过内核进行判断
>
>采用select，则是用内核判断fd_set，用一次系统调用来判断多个fd是否就绪，而不是多次system call逐一判断
>
>(将文件描述符放入一个集合中，调用select时，将这个集合从用户空间拷贝到内核空间，由内核根据就绪状态修改该集合的内容。集合大小有限制，128字节，也就是1024个fd；采用水平触发机制)
>
>返回值
>==成功调用返回结果大于 0，出错返回结果为 -1，超时返回结果为 0==

缺点

1 fd_set大小128字节，==监控的fd数量有限==
2 由于FD_SET不可重用，==每轮循环都需要重新设置FD_SET==
3 用户态，内核态的==拷贝存在开销==（fd_set的复制）：user->kernel，syscall传递参数需要拷贝一次；kernel->user，需要再次拷贝
4 select返回的时候，虽然知道==有fd被置位，但是仍然需要O(n)遍历==




### poll

> ```c++
> struct pollfd{
>     int fd;
>     short events;
>     short revents; // 可重用
> };
> ```

有数据，poll.revents被置位

解决了select的1,2两点缺点

1 使用结构体，==不会被1024大小的fds限制==
2 传递的是==结构体数组==（解决了select的1,2两点缺点），置位revents字段，==poll_fds可重用==



### epoll

解决select的1，2，3，4

1 fd数量不受限制
2 不需要每次epoll重新设置事件
3 epfd内核和用户空间共享内存，而不是数据拷贝（用户空间操作的是epoll_fd，对应的数据结构存在于内核空间，因此不需要拷贝）
4 有数据的fd_events排序到最前面，不需要轮询，时间复杂度为O(1)

> epoll_create  返回epoll_fd， 存放fd_events
> epoll_ctl 用于向内核注册新的描述符或者是改变某个文件描述符的状态。==已注册的描述符在内核中会被维护在一棵红黑树上==
> epoll_wait ==通过回调函数内核会将 I/O 准备好的描述符加入到一个链表中管理==，进程调用 epoll_wait() 便可以得到事件完成的描述符



IO多路复用的过程中，采用了硬件的优势，比如DMA

### 应用场景

很容易产生一种错觉认为只要用 epoll 就可以了，select 和 poll 都已经过时了，其实它们都有各自的使用场景。

>#### 1. select 应用场景
>
>1 实时性更好，精确度微秒
>2 可移植性更好
>
>select 的 timeout 参数精度为微秒，而 poll 和 epoll 为毫秒，因此 select 更加适用于实时性要求比较高的场景，比如核反应堆的控制。
>
>select 可移植性更好，几乎被所有主流平台所支持。
>
>
>
>#### 2. poll 应用场景
>
>poll 没有最大描述符数量的限制，如果平台支持并且对实时性要求不高，应该使用 poll 而不是 select。
>
>
>
>#### 3. epoll 应用场景
>
>有linux支持，==有大量的描述符需要同时轮询，并且这些连接最好是长连接==。
>
>需要同时监控小于 1000 个描述符，就没有必要使用 epoll，因为这个应用场景下并不能体现 epoll 的优势。
>
>需要监控的描述符状态变化多，而且都是非常短暂的，也没有必要使用 epoll。因为 epoll 中的所有描述符都存储在内核中，造成每次需要对描述符的状态改变都需要通过 epoll_ctl() 进行系统调用，频繁系统调用降低效率。
>并且 epoll 的描述符存储在内核，不容易调试。



### select/poll/epoll小结

* 线程能连接的最大数量
* 文件描述符的传递方式
* 水平触发 or 边缘触发
* 表面上看epoll的性能最好，但是在连接数量较少的并且十分都活跃的情况下，select和poll的性能可能要高与epoll，因为epoll设计到函数的回调。三种方式的效率需要根据实际情况来考虑。



### 水平触发和边缘触发

* 水平触发（LT，Level Trigger）模式下，只要一个文件描述符就绪，就会触发通知，如果用户程序没有一次性把数据读写完，下次还会通知；
* 边缘触发（ET，Edge Trigger）模式下，和 LT 模式不同的是，==通知之后进程必须立即处理事件==
  当描述符从未就绪变为就绪时通知一次，之后不会再通知，直到再次从未就绪变为就绪（缓冲区从不可读/写变为可读/写）。用户需要判断数据是否读完，否则需要等待下一次文件描述符变就绪状态才能接收到通知。
* 区别：==边缘触发效率更高，减少了epoll_wait被重复触发的次数==
* 为什么边缘触发只支持 No-Blocking：避免由于一个描述符的==阻塞IO会让处理其它描述符的任务无法进行==

> EPOLLOUT主要用于传送大量数据时，如果一次无法将数据全部发送出去就需要将剩下的数据缓存起来，然后等待内核发送缓冲区可写时再继续发送。内核发送缓冲区可写，就是通过触发EPOLLOUT事件来告知用户的。
>
> EPOLL的本质就是一个状态机 它的条件关联了读写缓冲区
>
> **电平触发:**
>
> **EPOLLIN**的触发条件是 **读缓冲区非空 && 事件带有EPOLLIN状态**
>
> **EPOLLOUT**的触发条件是 **写缓冲区非满 && 事件带有EPOLLOUT状态**
>
> **边沿触发:**
>
> **EPOLLIN**的触发条件是 **读缓冲区 空=>非空 发生切换 && 事件带有EPOLLIN状态**
>
> **EPOLLOUT**的触发条件是 **写缓冲区 满=>非满 发生切换 && 事件带有EPOLLOUT状态**
>
> 



### epoll实现原理

https://zhuanlan.zhihu.com/p/361750240



Linux epoll机制是通过红黑树和双向链表实现的。 
1 首先通过epoll_create()系统调用在内核中创建一个eventpoll类型的句柄，其中包括红黑树根节点和双向链表头节点（就绪队列）。
2 然后通过epoll_ctl()系统调用，向epoll对象的红黑树结构中添加对应的fd和事件类型，返回0标识成功，返回-1表示失败。
3 最后通过epoll_wait()系统调用判断双向链表（就绪队列）是否为空，如果为空则阻塞，放弃CPU。
什么时间就绪队列非空？当文件描述符状态改变，fd上的回调函数被调用，通过回调函数将fd加入到双向链表（就绪队列）中，此时epoll_wait函数被唤醒，返回就绪好的事件。

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20211226201213.jpeg" alt="preview" style="zoom: 80%;" />





## 基本使用

客户端调用connect发起连接，进行三次握手

服务端调用accept接收连接

基于TCP的socket，同一时间Server只能处理一个Client请求：在使用当前连接的socket和client进行交互的时候，不能够accept新的连接请求。为了使Server能够处理多个Client请求，常见的方法

1 多进程
2 while loop + 非阻塞socket
3 select + 非阻塞socket



多进程

> feature:
> 在每个accept成功之后，使用fork创建一个子进程专门处理该client的connection，父进程(server)本身可以继续accept其他新的client的连接请求。
>
> pros:
> 1 功能独立，server只accept新连接，fork出来的子进程只处理业务逻辑
> 2 服务稳健，一个client挂了不会影响server
>
> cons:
> 1 fork子进程，资源开销大，不适合高qps的请求
> 2 一个子进程只处理一个client，不能有效发挥作用



### 阻塞socket与非阻塞socket

阻塞socket
默认情况下socket是blocking的，即函数accept(), recv/recvfrom, send/sendto，connect等，需等待函数执行结束之后才能够返回(此时操作系统切换到其他进程执行)。
accpet()等待到有client连接请求并接受成功之后，recv/recvfrom需要读取完client发送的数据之后才能够返回。

非阻塞socket
设置socket为non-blocking模式，即调用函数立即返回，而不是必须等待满足一定条件才返回



### 如何设置非阻塞socket

函数socket()创建的socket(file descriptor)，默认阻塞
函数fcntl()(file control)可设置创建的socket为非阻塞

```cpp
 sock = socket(PF_INET, SOCK_STREAM, 0); // #include <unistd.h>
 int flags = fcntl(sock, F_GETFL, 0); //  #include <fcntl.h>
 fcntl(sock, F_SETFL, flags | O_NONBLOCK); 
```



### 非阻塞IO的返回值



非阻塞模式下，函数可以理解获取返回值，通过返回值以及errno可以判断状态

> accept():
> 在non-blocking模式下，如果 accept返回值为-1，且errno == EAGAIN或errno == EWOULDBLOCK表示no connections**没有新连接请求**；
>
> recv()/recvfrom():
> 在non-blocking模式下，如果 recv返回值为-1，且errno == EAGAIN表示没有可接受的数据或很在接受尚未完成；
>
> send()/sendto():
> 在non-blocking模式下，如果 send返回值为-1，且errno == EAGAIN或errno == EWOULDBLOCK表示没有可发送数据或数据发送正在进行没有完成。
>
> read/write:
> 在non-blocking模式下，如果返回-1，且errno == EAGAIN表示没有可读写数据或可读写正在进行尚未完成。
>
> connect():
> 在non-bloking模式下，如果返回-1，且errno = EINPROGRESS表示正在连接。



### while loop + non-block demo

```cpp
 int main(int argc, char *argv[]) {

        int sock;
        if ( (sock = socket(PF_INET, SOCK_STREAM, 0)) == -1 ) {
            perror("socket failed");
            return 1;
        }

        //set socket to be non-blocking
        int flags = fcntl(sock, F_GETFL, 0);
        fcntl(sock, F_SETFL, flags | O_NONBLOCK);

        //create socket address to bind
        struct sockaddr_in bind_addr
        ...

        //bind
        bind(...)
        ...

        //listen
        listen(...)
        ...

        //loop 
        int new_sock;
        while (1) {
            new_sock = accept(sock, NULL, NULL);
            if (new_sock == -1 && errno == EAGAIN) {
                fprintf(stderr, "no client connections yet\n");
                continue;
            } else if (new_sock == -1) {
                perror("accept failed");
                return 1;
            }

            //read and write
            ...

        }   

        ...
    } 
```





### select

```cpp
#include <sys/time.h>
#include <sys/types.h>
#include <unistd.h>

/*
*select返回total number of bits set in readfds, writefds and errorfds，当timeout的时候返回0，发生错误返回-1。
*另外select会更新readfds(保存ready to read的file descriptor), writefds(保存read to write的fd), errorfds(保存error的fd)，且更新timeout为距离超时时刻的剩余时间。 
*/
int select(int maxfd, //maxfd: 所有set中最大的file descriptor + 1
           fd_set* readfds, //readfds: 指定要侦听ready to read的file descriptor，可以为NULL
           fd_set* writefds, //writefds: 指定要侦听ready to write的file descriptor，可以为NULL
           fd_set* errorfds, //errorfds: 指定要侦听errors的file descriptor，可以为NULL
           struct timeval* timeout);//timeout: 指定侦听到期的时间长度，如果该struct timeval的各个域都为0，则相当于完全的non-blocking模式；如果该参数为NULL，相当于block模式；
```



fd_set类型需要使用如下4个宏进行赋值

```cpp
FD_ZERO(fd_set *set);      	    //Clear all entries from the set.
FD_SET(int fd, fd_set *set);    //Add fd to the set.
FD_CLR(int fd, fd_set *set);    //Remove fd from the set.
FD_ISSET(int fd, fd_set *set);  //Return true if fd is in the set. 
```



如下代码可以把要侦听的file descriptor/socket添加到响应的fd_set中

```cpp
fd_set readfds;		//创建
FD_ZERO(&readfds);	//归零

int sock;
sock = socket(PF_INET, SOCK_STREAM, 0);

FD_SET(sock, &readfds);     //将新创建的socket添加到readfds中
FD_SET(stdin, &readfds);    //将stdin添加到readfds中 
```



struct timeval类型

```cpp
struct timeval {
    int tv_sec;     //seconds
    int tv_usec;    //microseconds，注意这里是微秒不是毫秒，1秒 = 1000, 000微秒
}; 
```



使用select函数可以希望侦听的file descriptor/socket添加到read_set, write_set或error_set中(如果对某一项不感兴趣，可以设置为NULL)，并设置每次侦听的timeout时间

如果设置timeout为：

```cpp
struct timeval timeout;
timeout.tv_sec = 0;
timeout.tv_usec = 0; 
```

相当于每次select立即返回相当于纯non-blocking模式；

如果设置timeout参数为NULL，则每次select持续等待到有变化则相当于blocking模式。



### select + non-block demo

```cpp
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <arpa/inet.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <unistd.h>
#include <fcntl.h>
#include <errno.h>
#include <sys/time.h>

#define DEFAULT_PORT    1984    //默认端口
#define BUFF_SIZE       1024    //buffer大小
#define SELECT_TIMEOUT  5       //select的timeout seconds

//函数：设置sock为non-blocking mode
void setSockNonBlock(int sock) {
    int flags;
    flags = fcntl(sock, F_GETFL, 0);
    if (flags < 0) {
        perror("fcntl(F_GETFL) failed");
        exit(EXIT_FAILURE);
    }
    if (fcntl(sock, F_SETFL, flags | O_NONBLOCK) < 0) {
        perror("fcntl(F_SETFL) failed");
        exit(EXIT_FAILURE);
    }
}

//函数：更新maxfd
int updateMaxfd(fd_set fds, int maxfd) {
    int i;
    int new_maxfd = 0;
    for (i = 0; i <= maxfd; i++) {
        if (FD_ISSET(i, &fds) && i > new_maxfd) {
            new_maxfd = i;
        }
    }
    return new_maxfd;
}

int main(int argc, char *argv[]) {
    unsigned short int port;

    //获取自定义端口
    if (argc == 2) {
        port = atoi(argv[1]);
    } else if (argc < 2) {
        port = DEFAULT_PORT;
    } else {
        fprintf(stderr, "USAGE: %s [port]\n", argv[0]);
        exit(EXIT_FAILURE);
    }

    //创建socket
    int sock;
    if ( (sock = socket(PF_INET, SOCK_STREAM, 0)) == -1 ) {
        perror("socket failed, ");
        exit(EXIT_FAILURE);
    }
    printf("socket done\n");

    //in case of 'address already in use' error message
    int yes = 1;
    if (setsockopt(sock, SOL_SOCKET, SO_REUSEADDR, &yes, sizeof(int))) {
        perror("setsockopt failed");
        exit(EXIT_FAILURE);
    }

    //设置sock为non-blocking
    setSockNonBlock(sock);

    //创建要bind的socket address
    struct sockaddr_in bind_addr;
    memset(&bind_addr, 0, sizeof(bind_addr));
    bind_addr.sin_family = AF_INET;
    bind_addr.sin_addr.s_addr = htonl(INADDR_ANY);  //设置接受任意地址
    bind_addr.sin_port = htons(port);               //将host byte order转换为network byte order

    //bind sock到创建的socket address上
    if ( bind(sock, (struct sockaddr *) &bind_addr, sizeof(bind_addr)) == -1 ) {
        perror("bind failed, ");
        exit(EXIT_FAILURE);
    }
    printf("bind done\n");

    //listen
    if ( listen(sock, 5) == -1) {
        perror("listen failed.");
        exit(EXIT_FAILURE);
    }
    printf("listen done\n");

    //创建并初始化select需要的参数(这里仅监视read)，并把sock添加到fd_set中
    fd_set readfds;
    fd_set readfds_bak; //backup for readfds(由于每次select之后会更新readfds，因此需要backup)
    struct timeval timeout;
    int maxfd;
    maxfd = sock;
    FD_ZERO(&readfds);
    FD_ZERO(&readfds_bak);
    FD_SET(sock, &readfds_bak);

    //循环接受client请求
    int new_sock;
    struct sockaddr_in client_addr;
    socklen_t client_addr_len;
    char client_ip_str[INET_ADDRSTRLEN];
    int res;
    int i;
    char buffer[BUFF_SIZE];
    int recv_size;

    while (1) {

        //注意select之后readfds和timeout的值都会被修改，因此每次都进行重置
        readfds = readfds_bak;
        maxfd = updateMaxfd(readfds, maxfd);        //更新maxfd
        timeout.tv_sec = SELECT_TIMEOUT;
        timeout.tv_usec = 0;
        printf("selecting maxfd=%d\n", maxfd);

        //select(这里没有设置writefds和errorfds，如有需要可以设置)
        res = select(maxfd + 1, &readfds, NULL, NULL, &timeout);
        if (res == -1) {
            perror("select failed");
            exit(EXIT_FAILURE);
        } else if (res == 0) {
            fprintf(stderr, "no socket ready for read within %d secs\n", SELECT_TIMEOUT);
            continue;
        }

        //检查每个socket，并进行读(如果是sock则accept)
        for (i = 0; i <= maxfd; i++) {
            if (!FD_ISSET(i, &readfds)) {
                continue;
            }
            //可读的socket
            if ( i == sock) {
                //当前是server的socket，不进行读写而是accept新连接
                client_addr_len = sizeof(client_addr);
                new_sock = accept(sock, (struct sockaddr *) &client_addr, &client_addr_len);
                if (new_sock == -1) {
                    perror("accept failed");
                    exit(EXIT_FAILURE);
                }
                if (!inet_ntop(AF_INET, &(client_addr.sin_addr), client_ip_str, sizeof(client_ip_str))) {
                    perror("inet_ntop failed");
                    exit(EXIT_FAILURE);
                }
                printf("accept a client from: %s\n", client_ip_str);
                //设置new_sock为non-blocking
                setSockNonBlock(new_sock);
                //把new_sock添加到select的侦听中
                if (new_sock > maxfd) {
                    maxfd = new_sock;
                }
                FD_SET(new_sock, &readfds_bak);
            } else {
                //当前是client连接的socket，可以写(read from client)
                memset(buffer, 0, sizeof(buffer));
                if ( (recv_size = recv(i, buffer, sizeof(buffer), 0)) == -1 ) {
                    perror("recv failed");
                    exit(EXIT_FAILURE);
                }
                printf("recved from new_sock=%d : %s(%d length string)\n", i, buffer, recv_size);
                //立即将收到的内容写回去，并关闭连接
                if ( send(i, buffer, recv_size, 0) == -1 ) {
                    perror("send failed");
                    exit(EXIT_FAILURE);
                }
                printf("send to new_sock=%d done\n", i);
                if ( close(i) == -1 ) {
                    perror("close failed");
                    exit(EXIT_FAILURE);
                }
                printf("close new_sock=%d done\n", i);
                //将当前的socket从select的侦听中移除
                FD_CLR(i, &readfds_bak);
            }
        }
    }

    return 0;
} 
```





## IO模型

<https://github.com/CyC2018/CS-Notes/blob/master/notes/Socket.md>





### 阻塞IO

进程执行syscall发起IO，进程阻塞，直到内核缓冲区接收到数据，并且数据从内核缓冲区拷贝到应用进程缓冲区中才返回，才可以处理数据
pros:
当前进程阻塞不意味着整个操作系统都被阻塞。其它应用进程还可以执行，所以这种模型的 CPU 利用率会比较高



### 非阻塞IO

执行非阻塞IO，如果内核缓冲区没有数据，内核会返回一个错误码，应用进程可以继续执行
应用程序不断的执行系统调用来获知 I/O 是否完成，直到内核数据就绪，这种方式称为轮询（polling）

缺点
while loop + 非阻塞IO，调用accept立即返回，浪费CPU，实际不会这么做
实际中，non-block + select等多路复用



### IO多路复用

select通过轮询，监视指定file descriptor(包括socket)的变化，知道哪些ready for reading, 哪些ready for writing，哪些发生了错误等。select和non-blocking结合使用可很好地实现socket的多client同步通信。

使用 select 或者 poll 等待多个套接字中的任何一个变为可读。这一过程会被阻塞，当某一个套接字可读时返回，之后再使用 recvfrom 把数据从内核复制到进程中。

通过一次syscall，监听一批fd的变化，降低了用户态程序通过read这些syscall来判断fd是否变化的次数。从而提高了CPU利用率和吞吐率。

优点
IO多路复用，相比于多进程和多线程技术，不需要进程线程创建和切换的开销，系统开销更小，也没有进程/线程的内存代价



### 异步IO

用户线程发出IO请求之后，继续执行，由内核进行数据的读取并放在用户指定的缓冲区内，在IO完成之后发送信号来通知用户线程直接使用

异步 I/O 与信号驱动 I/O 的区别在于
信号驱动 I/O 的信号是通知应用进程可以开始 I/O，异步 I/O 的信号是通知应用进程 I/O 已经完成



### 信号驱动IO

1 应用进程使用 sigaction 系统调用，内核立即返回，应用进程可以继续执行，也就是说等待数据阶段应用进程是非阻塞的
2 内核缓冲区数据就绪，内核会向应用进程发送 SIGIO 信号
3 应用进程收到之后在信号处理程序中调用 recvfrom 将数据从内核复制到应用进程中。

相比于非阻塞式 I/O 的轮询方式，信号驱动 I/O 的 CPU 利用率更高。



### 五大 I/O 模型比较

同步 I/O 包括阻塞式 I/O、非阻塞式 I/O、I/O 多路复用和信号驱动 I/O ，它们的主要区别在第一个阶段
非阻塞式 I/O 、信号驱动 I/O 和异步 I/O 在第一阶段不会阻塞，阻塞IO会一直等到内核数据就绪

- 同步 I/O：将数据从内核缓冲区复制到应用进程缓冲区的阶段（第二阶段），应用进程会阻塞
- 异步 I/O：第二阶段应用进程不会阻塞





## 如何判断tcp socket断开连接

1 ==recv读取返回0，并且errno不是EINTR== （EINTER代表recv函数是由于进程收到信号返回，而不是recv执行完成了）
2 getsockopt获取tcp信息，如果tcpi_state\=\=TCP_ESTABLISHED，代表连接仍然存在；否则代表连接断开
3 IO多路复用，select或者epoll返回，并且==recv的返回值=0，并且errno不是EINTER，代表连接断开==



>
>
>作者：forHonor
>链接：https://www.zhihu.com/question/22840801/answer/101250537
>来源：知乎
>著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
>
>
>
>EPOLLOUT事件表示fd的发送缓冲区可写，在一次发送大量数据（超过发送缓冲区大小）的情况下很有用。要理解该事件的意义首先要清楚一下几个知识：
>1、多路分离器。多路分离器存在的意义在于可以同时监测多个fd的事件，便于单线程处理多个fd，epoll是众多多路分离器的一种，类似的还有select、poll等。服务器程序通常需要具备较高处理用户并发的能力，使用多路分离器意味着可以用一个线程同时处理多个用户并发请求。
>
>2、非阻塞套接字。
>2.1 阻塞。
>    在了解非阻塞之前先了解一下阻塞，阻塞指的是用户态程序调用系统api进入内核态后，如果条件不满足则被加入到对应的等待队列中，直到条件满足。比如：sleep 2s。在此期间线程得不到CPU调度，自然也就不会往下执行，表现的现象为线程卡在系统api不返回。
>2.2 非阻塞。
>    非阻塞则相反，不论条件是否满足都会立即返回到用户态，线程的CPU资源不会被剥夺，也就意味着程序可以继续往下执行。
>2.3、高性能。
>在一次发送大量数据（超过发送缓冲区大小）的情况下，如果使用阻塞方式，程序一直阻塞，直到所有的数据都写入到缓冲区中。例如，要发送M字节数据，套接字发送缓冲区大小为B字节，只有当对端向本机返回ack表明其接收到大于等于M-B字节时，才意味着所有的数据都写入到缓冲区中。很明显，如果一次发送的数据量非常大，比如M=10GB、B=64KB，则：
>1）一次发送过程中本机线程会在一个fd上阻塞相当长一段时间，其他fd得不到及时处理；
>2）如果出现发送失败，无从得知到底有多少数据发送成功，应用程序只能选择重新发送这10G数据，结合考虑网络的稳定性，只能呵呵；
>总之，上述两点都是无法接受的。因此，对性能有要求的服务器一般不采用阻塞而采用非阻塞。
>
>3、使用非阻塞套接字时的处理流程。
>采用非阻塞套接字一次发送大量数据的流程：
>1）使劲往发送缓冲区中写数据，直到返回不可写；
>2）等待下一次缓冲区可写；
>3）要发送的数据写完；
>其中2）可以有两种方式：
>a）查询式，程序不停地查询是否可写；
>b）程序去干其他的事情（多路分离器的优势所在），等出现可写事件后再接着写；很明显方式b）更加优雅。
>
>4、EPOLLOUT事件的用途。
>EPOLLOUT事件就是以事件的方式通知用户程序，可以继续往缓冲区写数据了。
>
>
>
>
>    
>     首先要理解send之后，数据只是去了缓冲区，而缓冲区满了会触发EAGAIN
>    EPOLLOUT说明缓冲区可写了
>     
>   假设一个这样的场景：
>你需要将一个10G大小的文件返回给用户，那么你简单send这个文件是不会成功的。
>这个场景下，你send 10G的数据，send返回值不会是10G，而是大约256k，表示你只成功写入了256k的数据。接着调用send，send就会返回EAGAIN，告诉你socket的缓冲区已经满了，此时无法继续send。
>此时异步程序的正确处理流程是调用epoll_wait，当socket缓冲区中的数据被对方接收之后，缓冲区就会有空闲空间可以继续接收数据，此时epoll_wait就会返回这个socket的EPOLLOUT事件，获得这个事件时，你就可以继续往socket中写出数据。
>
>    
>    
>作者：dong
>链接：https://www.zhihu.com/question/22840801/answer/89060779
>    来源：知乎
>著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
>
>
>
>处理EPOLLIN的时候,就可以往sockfd里写了(如果需要的话),只不过这时候,套接字如果是非阻塞的,缓冲区写满了,返回EAGAIN , 然而判断send(write/sendfile)返回值发现数据并没有发完,想要接着把数据发出去,这时候就需要暂时记录一下现场,包括fd,当前发送到buffer的哪个字节了,什么的(可以用一个结构记录下来). 然后注册EPOLLOUT事件,等待下一次触发写事件.这时要先删除这个fd注册的写事件,之后找到fd对应的buffer(这个可以用map保存起来,以fd做键去找对应的结构),从原来的没有发完的偏移处继续发数据,发完了就删掉这个map或者将struct里置空. 没有发完就再注册写事件,记录这次的位置到哪了.等待下一次触发写.
>
>
>
>作者：李通
>链接：https://www.zhihu.com/question/22840801/answer/61415304
>来源：知乎
>著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。