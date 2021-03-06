## 参考

https://github.com/CyC2018/CS-Notes/blob/master/notes/%E8%AE%A1%E7%AE%97%E6%9C%BA%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%20-%20%E7%9B%AE%E5%BD%95.md

https://github.com/wolverinn/Waking-Up/blob/master/Operating%20Systems.md



---

## 操作系统概述

### 基本特征

---

#### 1. 并发与并行

并发是指宏观上在一段时间内能同时运行多个程序，而并行则指同一时刻能运行多个指令

并发（concurrency）：并发是==单核CPU跑多任务，宏观上看多个进程同时运行==。实际上分配到时间片的进程，才能被CPU执行该进程的指令。这种==并发并不能提高计算机的性能==

并行（parallelism）：==并行是多个程序的同时执行，需要多核CPU==。两个进程在不同的核上执行。并行的确提高了计算机的效率



#### **2. 共享**

共享是指系统中的资源可以被多个并发进程共同使用。

有两种共享方式：互斥共享和同时共享。

**互斥共享的资源称为临界资源**，例如打印机等，在**同一时刻只允许一个进程访问**

需要用同步机制来实现互斥访问。**操作临界资源的代码段成为临界区**。



#### **3. 虚拟**

虚拟技术把一个物理实体转换为多个逻辑实体。

主要有两种虚拟技术：时（时间）分复用技术和空（空间）分复用技术。

多个进程能在同一个处理器上并发执行使用了时分复用技术，让每个进程轮流占用处理器，每次只执行一小个时间片并快速切换。进程、线程的调度，时分复用。

虚拟内存使用了空分复用技术，它将物理内存抽象为地址空间，每个进程都有各自的地址空间。地址空间的页被映射到物理内存，地址空间的页并不需要全部在物理内存中，当使用到一个没有在物理内存的页时，执行页面置换算法，将该页置换到内存中。



### 基本功能

进程管理

>  什么是进程，进程都有哪些状态，多个进程如何调度，IPC，死锁产生的原理，如何避免，处理



内存管理

> 内存分配、地址映射、内存保护与共享、虚拟内存等。
>
> 内存分配：可执行文件的内存分配，BSS，data，text段的分配。





文件管理

> 文件存储空间的管理、目录管理、文件读写管理和保护等。
>
> 课设内容：实现的简单的文件系统。
>
> UNIXV6++的文件存储空间分布，diskinode和inode，文件表的关系，Unix的inode管理



设备管理

> 完成用户的 I/O 请求，方便用户使用各种设备，并提高设备的利用率。
>
> 主要包括缓冲管理、设备分配、设备处理、虛拟设备等。
>
> 缓冲管理：缓冲队列，自由队列





### 系统调用

进程在用户态使用内核功能时，转换为内核态，操作系统负责完成。



### 中断

外设备中断：由 CPU 执行指令以外的事件引起，如 I/O 完成中断，表示设备输入/输出处理已经完成，处理器能够发送下一个输入/输出请求。此外还有时钟中断、控制台中断等
异常：由 CPU 执行指令的内部事件引起，如非法操作码、地址越界、算术溢出等
系统调用：用户程序中使用系统调用
时钟中断：时钟中断会引发一系列操作，时钟计数，进程的调度，进程优先级的重新计算等



### 宏内核与微内核

> 宏内核

宏内核是将操作系统功能作为一个紧密结合的整体放到内核。

由于各模块共享信息，因此有很高的性能。



> 微内核

由于操作系统不断复杂，因此将一部分操作系统功能移出内核，从而降低内核的复杂性。移出的部分根据分层的原则划分成若干服务，相互独立。

在微内核结构下，操作系统被划分成小的、定义良好的模块，只有微内核这一个模块运行在内核态，其余模块运行在用户态。

因为需要频繁地在用户态和核心态之间进行切换，所以会有一定的性能损失。



## 一、进程部分



### 进程与线程



线程基本概念

>每个线程都独自占用一个虚拟处理器：CPU-state（一组寄存器，其中重要的两个是stack pointer和pc），stack



### 什么是进程？什么是程序（可执行文件）？

可执行文件，是一个文本，指令的集合（静态的文本）
单独的程序是无法运行的，只有将程序载入内存，系统为程序分配资源，才能被分配CPU执行
进程就是指令集合的一次执行过程（动态的过程）



### 有了进程为什么还要线程？

进程可以使多个程序能并发执行，以提高资源的利用率和系统的吞吐量；但是其具有一些缺点
1 ==（无论CPU几个核）一个进程只能在一个核上执行==
2 进程执行过程中如果被阻塞，进程就会被操作系统挂起，而进程中其他不依赖这个资源的工作，也没办法执行

有了线程，就可以解决这些问题
1、==提高单个进程的执行速度，不同的线程运行于不同的CPU上==。
2、改善程序结构。一个既长又复杂的进程可以考虑分为多个线程，成为几个独立或半独立的运行部分，这样的程序才会利于理解和修改。

>有效利用多核CPU，提高了单个进程的执行速度（对于多线程进程而言）
>（如果没有线程这个概念，那么多核CPU虽然可以同时跑多个进程，但是单个进程的执行速度并没有得到提高
>有了线程，就可以将一个进程分解为若干线程，不同的线程运行在不同的核上，从而提高了单个进程的执行速度）



### 进程相比，线程的优势

1 ==创建角度==上，linux创建新的进程，需要分配独立的内存空间，载入.text .data .bss之后，还需要建立页目录 页表来维护进程的地址映射
2 ==切换开销==上，同一个进程的多个线程，使用的相同地址空间，线程切换时间要少于进程切换时间
3 ==通信角度==上，同一个进程的多个线程，使用相同的地址空间，一个线程的数据很容易被其他线程访问。而对于不同的进程，内存是独立的，要通信就需要通过IPC等系统调用，开销大。






### 进程与线程的区别

1 概念：**进程，资源分配的最小单位，线程，CPU调度的最小单位**
2 内存独立与否：进程之间，内存彼此独立；同一个进程的线程，共享进程的内存
线程==共享的内存资源==包括：==代码段（代码和常量），数据段（全局变量和静态变量），**扩展段（堆存储）**==
线程彼此之间==独立的部分==，每个线程==拥有自己的stack==，用来存放所有局部变量和临时变量
线程独占的部分有程序计数器,一组寄存器和栈
3 从属关系：线程属于进程，一个进程至少有一个线程，可以有多个线程，线程依赖于进程存在
4 开销：创建/销毁进程的开销远高于创建/销毁线程的开销，进程切换调度的开销也高于线程切换调度的开销
创建/销毁进程，操作系统需要分配或者回收内存资源以及其他系统资源，高于==线程的创建和销毁所需要的资源==
进程切换，操作系统需要==保存当前CPU的整个环境==，恢复上台的进程的整个CPU环境
线程切换，只需要保存、恢复==少量寄存器==即可
5 通信：进程需要通过IPC，线程由于同属于一个进程，==内存空间相同，通信可以直接读写进程数据段（如全局变量）来通信==，当然需要线程的同步和互斥等方式，来保证线程的同步
6 稳定性：多进程之间彼此不会受到影响；多线程，一个线程有问题，整个进程挂掉
7 调试难易程度：多进程，调试简单，可靠性高，但是创建销毁的开销大；多线程，开销低，切换速度快，但是不容易编码调试

总结
多线程之间共享同一个进程的地址空间，线程间通信简单，同步复杂，线程创建、销毁和切换简单，速度快，占用内存少，但是线程间会相互影响，一个线程意外终止会导致同一个进程的其他线程也终止，程序可靠性弱
而多进程间拥有各自独立的运行地址空间，进程间不会相互影响，程序可靠性强，但是进程创建、销毁和切换复杂，速度慢，占用内存多，进程间通信复杂，但是同步简单





### 多进程和多线程的使用场景

多进程模型的优势是CPU，适用于CPU密集型。同时，多进程模型也适用于多机分布式场景中，易于多机扩展。

==I/O密集型的工作场景经常会由于I/O阻塞导致频繁的切换线程==，多线程模型主要优势为==线程间切换代价较小==，因此适用于I/O密集型的工作场景。同时，多线程模型也适用于单机多核分布式场景。



>因为要并发，我们发明了进程，又进一步发明了线程。只不过进程和线程的并发层次不同：进程属于在处理器这一层上提供的抽象；线程则属于在进程这个层 次上再提供了一层并发的抽象。如果我们进入计算机体系结构里，就会发现，流水线提供的也是一种并发，不过是指令级的并发。这样，流水线、线程、进程就从低 到高在三个层次上提供我们所迫切需要的并发！
>
>https://www.cnblogs.com/Berryxiong/p/6429723.html







### 进程状态的切换

进程有三种基本的状态：

* 就绪状态：所有资源均满足，等待被调度分配CPU
* 运行状态：（正在占用CPU的进程，正在被CPU执行的进程），处于此状态的进程数小于等于CPU数
* 阻塞状态： 等待资源

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/202201171502943.png" alt="img" style="zoom:67%;" />





### 进程调度

> 进程调度？本质上就是一种CPU的分配
>
> 饥饿？某进程处于就绪状态，一直在等待，得不到处理
>
> 非抢占式调度：当前进程被分配CPU之后，进程一直运行，操作系统只能等待进程归还CPU，要么执行完毕进程结束，要么进程主动放弃CPU
> 抢占式调度：操作系统暂停正在执行的进程，将CPU分配其他进程



批处理系统

批处理系统没有太多的用户操作，在该系统中，调度算法目标是保证吞吐量和周转时间（从提交到终止的时间）。

>**1 先来先服务 first-come first-serverd（FCFS）**
>
>（操作系统）逐一分配CPU给就绪队列中的进程，非抢占式调度
>
>pros：先来先去服务比较适合于常作业（进程），而不利于段作业（进程）
>
>cons：短进程的等待时间过长
>
>
>
>**2 短作业优先 shortest job first（SJF）**
>
>（操作系统）在就绪队列中选择预估运行时间最短的进程，分配CPU执行。非抢占式调度
>
>cons:
>就绪队列中的长进程饥饿
>
>
>
>**3 最短剩余时间优先 shortest remaining time next（SRTN）**
>
>在SJF基础上增加抢占机制
>
>当一个进程加入到就绪队列时，如果比当前运行的进程具有更短的剩余时间，操作系统则挂起当前进程，运行新的进程
>
>cons: 
>就绪队列中的长进程饥饿
>
>
>
>**4 最高响应比优先 Highest Response Ratio Next（HRRN）**
>
>在每次进行作业调度时，先计算后备作业队列中每个作业的响应比，从中选出响应比最高的作业投入运行。
>
>高响应比优先调度算法主要用于作业调度，该算法是对 先来先服务调度算法和短作业优先调度算法的一种综合平衡，同时考虑每个作业的等待时间和估计的运行时间。
>
>响应比 = 1+ 等待时间/处理时间。同时考虑了等待时间的长短和估计需要的执行时间长短
>
>非抢占，吞吐量高，开销可能较大，提供好的响应时间，无饥饿问题



交互式系统

交互式系统有大量的用户交互操作，在该系统中调度算法的目标是快速地进行响应。

>**1 时间片轮转**
>
>抢占式，不会饿死
>
>操作系统总是选择就绪队列中第一个进程执行，即先来先服务的原则，但仅能运行一个时间片
>
>当时间片用完时，时钟中断，操作系统便停止该进程的执行，并将它送往就绪队列的末尾
>
>
>
>时间片轮转算法的效率和时间片的大小有很大关系：
>
>因为进程切换都要保存进程的信息并且载入新进程的信息，如果时间片太小，会导致进程切换得太频繁，在进程切换上就会花过多时间。
>而如果时间片过长，那么实时性就不能得到保证。
>
>
>
>**2 动态优先级调度**
>
>抢占式，不会饿死
>
>进程结构：
>每个进程分配一个优先级，操作系统按照进程的优先级进行调度（进程的优先级需要根据时间进行改变）
>
>调度：
>操作系统每次从就绪队列中选择优先级最高的进程，分配CPU
>
>
>
>**3 多级反馈队列**
>
>- 设置多个就绪队列，每个队列的进程按照先来先服务排队，然后按照时间片轮转分配时间片，不同队列的时间片大小不同
>- 进程在一个队列没执行完，就会被移到下一个队列
>- 每个队列优先权也不同，最上面的优先权最高。因此只有上一个队列没有进程在排队，才能调度当前队列上的进程
>
>- 抢占式，可能会饥饿
>
>一个进程需要执行 100 个时间片，如果采用时间片轮转调度算法，那么需要交换 100 次。
>
>设置了多个队列，每个队列时间片大小都不同，例如 1,2,4,8,..。这种方式下，之前的进程只需要交换 7 次。



作业调度和进程调度区别

> 1、作业调度
>
> 将作业后备队列中的作业，调入内存，创建进程、分配资源（进程创建完毕之后处于就绪状态，转入进程就绪队列）
>
> 2、进程调度
>
> 从就绪队列中选进程，分配CPU执行
>
> 3、区别
> 前者是为作业**建立进程**的过程，是将作业由**外存调入内存**的过程；
> 而后者整个过程并没有跑出内存的范围，是将**就绪态**的进程变为**运行态**的过程
>
> 
>
> 作业后备队列：
> 进程尚未创建，需要将作业调入内存，分配资源；进程创建完毕后进入就绪队列
>
> 进程就绪队列：
> 就绪队列中的进程，所有资源已经就绪，但是还没有执行，进程处于就绪状态，等待分配CPU
>
> 
>
> 作业调度算法：1.先来先服务算法.2.短作业优先算法.3.高响应比优先算法.
>
> 进程调度算法：1.时间片轮转算法 2.优先级调度算法 3.多级反馈队列算法



### 进程间通信

无名管道（父子进程、兄弟进程之间的IPC）
具名管道（单机任意进程之间的IPC）
其他IPC（信号，消息队列，共享内存）
UNIX域套接字（单机的进程之间的通信）
网络套接字（多机之间的进程的通信）



无名管道PIPE

>如何使用管道？
>父子进程这里采用是先创建int数组，先pipe再fork
>fork之后，父子进程都会有保存了管道的局部变量。
>
>管道是通过调用 pipe 函数创建的，fd[0] 用于读，fd[1] 用于写。
>
>```cpp
>#include <unistd.h>
>int pipe(int fd[2]);
>```
>
>![img](https://yszhou.oss-cn-beijing.aliyuncs.com/img/68747470733a2f2f63732d6e6f7465732d313235363130393739362e636f732e61702d6775616e677a686f752e6d7971636c6f75642e636f6d2f35336364396164652d623061362d343339392d623464652d3766316662643036636466622e706e67.png)
>
>pipe缺陷：
>1 只支持半双工通信（单向交替传输）
>2 只能在父子进程或者兄弟进程
>
>pipe特点：
>
>1 读写使用普通的read、write等函数。但是它不是普通的文件，并不属于其他任何文件系统，并且**只存在于内存中**。
>2 传输的数据类型：字符串



具名管道FIFO

>特点
>1 半双工
>2 可以用于独立进程之间的通信
>3 FIFO有路径名与之相关联，它以一种特殊设备文件形式存在于文件系统中
>4 传输的数据类型：也是字节流（字符串）
>
>使用：
>
>```cpp
>#include <sys/stat.h>
>int mkfifo(const char *path, mode_t mode);
>int mkfifoat(int fd, const char *path, mode_t mode);
>
>// 先调用mkfifo创建管道，然后按照正常的文件进行读写即可，最后unlink删除管道
>   char file[] = "temp";
>   mkfifo(file, S_IRWXU); // 创建管道
>			...
>       int fd = open(file, O_RDWR); // 打开文件进行读写
>       write(fd, msg_child, sizeof(msg_child));
>			 close(fd); 
>			...
>   unlink(file); // delete temp FIFO file
>```
>
>





消息队列

>消息队列，是消息的链接表，存放在内核中。一个消息队列由一个标识符（即队列ID）来标记。 (消息队列克服了信号传递信息少，管道只能承载无格式字节流以及缓冲区大小受限等特点)
>
>特点：
>
>1)消息具有特定的格式（结构体，而不是字节流）
>2)消息队列==独立于发送与接收进程。进程终止如果没有销毁消息队列，消息队列及其内容并不会被删除==。
>3)消息队列可以实现消息的随机查询,消息不一定要以先进先出的次序读取。
>
>
>
>相比于其他：
>信号：传递的信息少，消息队列传递的信息多
>管道：只能传送字节流，不具有格式，并且缓冲区大小有限制，消息队列则可以传递特定结构体
>
>使用
>
>```cpp
>// 先自定义队列id创建消息队列，然后收发即可
>msg_id = msgget(123, IPC_CREAT | 0666); // 自定义id
>msgrcv();
>msgsnd();
>```
>





共享内存

>它使得多个进程可以访问同一块内存空间，不同进程可以及时看到对方进程中对共享内存中数据得更新。这种方式需要依靠某种同步操作，如互斥锁和信号量等
>
>特点：
>
>1)共享内存是最快的一种IPC，因为进程是（比如直接strcpy）
>2)因为多个进程可以同时操作，所以需要进行同步，避免多个进程同时对内存进行写入操作 [参考](https://blog.csdn.net/weixin_44344462/article/details/97180648)
>3)信号量+共享内存通常结合在一起使用，信号量用来同步对共享内存的访问



套接字SOCKET

>网络socket 可以不同主机之间的进程通信，也可以本机通信。
>unix socket 可以用于本机进程之间的通信，原理与网络socket类似。
>
>相同点：
>两类套接字的使用类似，有微小的差别，unix socket需要设置类型AF_UNIX，网络套接字 tcp socket类型为PF_INET或者AF_INET(代表采用IPv4的底层协议族)
>
>不同点：
>unix域套接字单机多进程传输效率更高，网络套接字适用于多机多进程数据传输
>
>Unix域套接字只能用于在同一个计算机的进程间进行通信。
>
>单机IPC更推荐unix套接字，而不是网络套接字：
>虽然网络套接字也可以用于**单机进程间的通信，但是使用Unix域套接字效率会更高，因为Unix域套接字仅仅进行数据复制，不会执行在网络协议栈中添加删除header、计算校验和，因而在单机的进程间通信中，更加推荐使用Unix域套接字**
>
>



参考

[进程间通信IPC (InterProcess Communication)--简书](https://www.jianshu.com/p/c1015f5ffa74)

[进程间通信--管道](http://blog.chinaunix.net/uid-26833883-id-3227144.html)

[进程间通信---共享内存](http://blog.chinaunix.net/uid-26833883-id-3230564.html)

[进程间通信——共享内存（Shared Memory）--CSDN](https://blog.csdn.net/ypt523/article/details/79958188?depth_1-utm_source=distribute.pc_relevant.none-task&utm_source=distribute.pc_relevant.none-task)

[进程间同步---system v ipc 对象信号灯集--PV信号量操作](http://blog.chinaunix.net/uid-26833883-id-3230813.html)



### 进程同步经典问题

同步与互斥

> 同步：多个进程因为合作产生的直接制约关系，使得==进程有一定的先后执行==关系。
>
> 互斥：多个进程在同一时刻只有一个进程能进入临界区。



信号量

> 信号量（Semaphore）是一个整型变量，也就是常见的 P 和 V 操作 
>
> P 执行 -1 操作；如果--之后的信号量< 0，进程睡眠，等待信号量>= 0；
> V 对信号量执行 +1 操作；如果++之后的信号量<0，唤醒睡眠的进程
>
> down 和 up 操作需要被设计成原语，不可分割，通常的做法是在执行这些操作的时候屏蔽中断。
>
> 如果信号量的取值只能为 0 或者 1，那么就成为了 **互斥量（Mutex）** ，0 表示临界区已经加锁，1 表示临界区解锁。



生产者消费者例子

> 问题描述：
> 使用一个缓冲区来存放数据，只有缓冲区没有满，生产者才可以写入数据；只有缓冲区不为空，消费者才可以读出数据
>
> 因为缓冲区属于临界资源，因此需要使用一个互斥量 mutex 来控制对缓冲区的互斥访问。
>
> 为了同步生产者和消费者的行为，需要记录缓冲区中物品的数量。数量可以使用信号量来进行统计，这里需要使用两个信号量：empty 记录空缓冲区的数量，full 记录满缓冲区的数量。其中，empty 信号量是在生产者进程中使用，当 empty 不为 0 时，生产者才可以放入物品；full 信号量是在消费者进程中使用，当 full 信号量不为 0 时，消费者才可以取走物品。
>
> 注意，不能先对缓冲区进行加锁，再测试信号量。也就是说，不能先执行 down(mutex) 再执行 down(empty)。如果这么做了，那么可能会出现这种情况：生产者对缓冲区加锁后，执行 down(empty) 操作，发现 empty = 0，此时生产者睡眠。消费者不能进入临界区，因为生产者对缓冲区加锁了，消费者就无法执行 up(empty) 操作，empty 永远都为 0，导致生产者永远等待下，不会释放锁，消费者因此也会永远等待下去。
>
> mutex用于保护队列，保证队列的操作是线程安全的：设置互斥量mutex=1
> 生产者进行操作的前提是有空位，减少空位数量（没有则休眠），操作完毕增加商品数量：设置empty=12
> 消费者进行操作的前提是队列有元素，减少商品数量（没有则休眠），操作完毕增加空位数量：设置互斥量full=0

```cpp
#define N 100
typedef int semaphore;

// 定义信号量 full记录缓冲区物品数量 empty代表缓冲区空位数量
semaphore mutex = 1; // 互斥访问queue
semaphore empty = N;
semaphore full = 0;

void producer() {
    while(TRUE) {
        int item = produce_item(); // 生产者进行生产
        down(&empty);
      
        down(&mutex);
        insert_item(item);
        up(&mutex);
      
        up(&full);
    }
}

void consumer() {
    while(TRUE) {
        down(&full);
      
        down(&mutex);
        int item = remove_item(); // 消费者进行消费
        consume_item(item);
        up(&mutex);
      
        up(&empty);
    }
}
```





哲学家进餐例子

> 问题表述：五只筷子，五个人
>
> 【问题代码】
>
> ```cpp
> while(1)
> {
> 	p(筷子i)
> 	p(筷子(i+1)%5)
> 	吃饭
> 	v(筷子i)
> 	v(筷子(i+1)%5)
> 	随机思考
> }
> ```
>
> 存在问题：同时都拿起右手的筷子，全部死锁
>
> 参考https://blog.csdn.net/qq_28602957/article/details/53538329
>
> 【解决方案1】
> 至多4位允许进入代码，也就是资源量=4 在一开始
> 【原理】
> 至多只允许四个哲学家同时进餐，以保证至少有一个哲学家能够进餐，最终总会释放出他所使用过的两支筷子，从而可使更多的哲学家进餐。
>
> ```cpp
> cnt=4
> while(1)
> {
> 	p(cnt)
> 	p(筷子i)
> 	p(筷子(i+1)%5)
> 	吃饭
> 	v(筷子(i+1)%5)
> 	v(筷子i)
> 	v(cnt)
> 	随机思考
> }
> ```
>
> 
>
> 【解决方案2】
> 奇数则优先拿左手边，偶数则优先拿右手边
>
> ```cpp
> while(1)
> {
> 	if(i%2)
> 	{
> 		p(筷子i)
> 		p(筷子i+1 % 5)
> 	}
> 	else{
> 		p(筷子i+1 %5)
> 		p(筷子i)
> 	}
> 	吃饭
> 	释放两只筷子
> 	随机思考
> }
> ```
>
> 



读者写者例子

> 如何实现读者并发，读写互斥，写写互斥
> 最基本的思路，一个互斥量，让所有读/写操作全部互斥
>
> 【读者优先版本】
>
> 什么是读者优先？
> 读者优先就是，只有当所有的读者都完成了读文件的操作后，才能让写进程访问文件
>
> 如何让读者并发？==读者优先版本==
> 用到了一个计数器，计数器readcnt，初始值0，记录当前读者的数量
> 当有读者的时候写者是无法写文件的，此时读者会一直占用文件，当没有读者的时候写者才可以写文件
> 所有读者排队，第一个读者开始请求的时候就申请文件的lock，之后的读者进行请求的时候不再申请文件的lock
> 最后一个读者读完毕的时候释放文件的lock，之前的读者读完毕的时候不需要释放文件的lock
>
> 另外需要一个reader_mutex，用于readcnt的互斥读写
>
> 
>
> 整体思路：
> 全局读者计数器readcnt=0，互斥量r=1，用于保护readcnt的互斥修改
> 互斥量mutex=1，用于文件的互斥访问
>
> 缺点: 写进程饿死，这种方案是读者优先的方案
>
> ```cpp
> void read(){
>   read_cnt_lock.lock(); // 用于保护readcnt
>   readcnt++;
>   if(readcnt==1)file_lock.lock();// 如果是众多读者的首个读者，就为读者群体获取文件的lock
>   read_cnt_lock.unlock();
>   
>   read_file();
>   
>   read_cnt_lock.lock();
>   readcnt--;
>   if(readcnt==0)file_lock.unlock();// 如果是最后一个读者，就为读者群体释放文件的lock
>   read_cnt_lock.unlock();
> }
> void write(){
>   file_lock.lock();
>   write_file();
>   file_lock.unlock();
> }
> ```
>
> 
>
> 【写者优先版本】
>
> 如何实现写者优先？
> 思路: 
> 【写者部分】
> 写者群体维护一个计数器，命名write_cnt，初始值=0，代表当前写者队列的写进程数量
> 首个写进程，为写者群体申请互斥量priority=1
> 最后一个写进程，为写者群体释放互斥量priority
> 同时，对于write_cnt的读写需要线程安全，用writecnt_lock保证
>
> 【读者部分】
> 开始部分需要用mutex限制reader的并发量，不允许reader并发
> 然后读者进程先获取priority，再进行后续操作
>
> 
>
> 在读者优先版本基础上
> 添加变量writecnt=0，记录writer数量
> writecnt_lock=1，保护writecnt线程安全
> 互斥量priority=1，用于writer群体和reader的竞争
> mutex3，用于限制读者并发
>
> 如何保证写者可以插队？
> 增加一个互斥量，mutex3，只允许一个reader在等待priority，其他的reader在等待mutex3
> 在priority上，不允许多个reader等待，否则写进程将不能跳过这个队列
> 只允许一个读进程在priority上排队，而所有其他读进程在等待priority之前，在信号量mutex3上排队
>
> ```cpp
> void reader(){
>   p(mutex3); // 限制reader并发
>   p(priority); // 读者 与 写者群体 进行竞争
>     read_cnt_lock.lock();
>     readcnt++;
>     if(readcnt==1)p(file_lock);
>     read_cnt_lock.unlock();
>   v(priority);
>   v(mutex3);
>   
>   read();
>   
>   read_cnt_lock.lock();
>   readcnt--;
>   if(readcnt==0)v(file_lock);
>   read_cnt_lock.unlock();
>   
> }
> void writer(){
>   write_cnt_lock.lock();
>   writecnt++;
>   if(writecnt==1) p(priority) // writer群体获取lock
>   write_cnt_lock.unlock();
>   
>   file_lock.lock();
>   write_file;
>   file_lock.unlock();
>   
>   write_cnt_lock.lock();
>   writecnt--;
>   if(writecnt==0) v(priority); // writer群体释放lock
>   write_cnt_lock.unlock();
> }
> ```
>
> 
>
> 
>
> ```cpp
> reader()
> {
> 	while(1)
> 	{
> 		p(mutex3)// 只有一个reader可以申请priority，其他的reader都在排队
> 		p(priority) // 只有所有的writer运行完毕，才会申请到优先级
>       p(read_cnt_lock)//用于保护readcnt
>       readcnt++
>       if(readcnt==1) p(file_lock)// 所有的读 与write互斥
>       v(read_cnt_lock)
> 		v(priority)
> 		v(mutex3)
> 			
> 		read()
> 		
> 		p(read_cnt_lock)//用于保护readcnt
> 		readcnt--
> 		if(readcnt==0) v(file_lock)
> 		v(read_cnt_lock)
> 	}
> }
> 
> writer()
> {
> 	while(1)
> 	{
> 		lock
> 		cnt++
> 		if(cnt==1)p(priority)
> 		unlock
> 		
> 		p(mutex) // 所有的读者 任意一个写者 都互斥
> 		write()
> 		v(mutex)
> 		
> 		lock
> 		cnt--
> 		if(cnt==0)v(priority)
> 		unlock
> 		
> 	}
> }
> ```
>
> 
>
> 读写公平版本
>
> https://chenchenxiaojian.github.io/%E8%AF%BB%E8%80%85%E5%86%99%E8%80%85%E9%97%AE%E9%A2%98-%E8%AF%BB%E8%80%85%E4%BC%98%E5%85%88/
>
> https://blog.csdn.net/william_munch/article/details/84256690



理发师例子

> 问题表述
> 资源: waiting=0 代表正在等待的顾客数量
> 互斥量:  mu 保护waiting
> 同步量: barber=0 guest=0 用于唤醒理发师 唤醒顾客
>
> 思考问题: 
>
> v(barber) v(guest)可以不可放在v(mu)之后呢？可以，因为mu仅仅是为了保护waiting
>
> 顾客而言，p(barber)可以不可放在v(mu)之前？绝对不行，造成死锁
>
> 代码
>
> ```cpp
> 
> barber()
> {
> 	while(1)
> 	{
> 		p(guest) // 有顾客来了，唤醒理发师
> 		
> 		p(mu)
> 		waiting--
> 		v(barber) // 理发师来了！！！
> 		v(mu)
> 		
> 		cut() // 理发 理发师理发并不妨碍客人进店查看
> 	}
> }
> 
> 
> guest()
> {
> 	p(mu) // 保护waiting
> 	if(waiting<CHAIRS)
> 	{
> 		waiting++
> 		v(guest) // 顾客来了！！！唤醒理发师！！！
> 		v(mu)
> 		p(barber) // 顾客等待理发师！必须放在v(mu)之后！！！否则导致死锁！！！！！！！！！
> 				  // 多个顾客竞争理发师
> 		
> 		get_cut() // 竞争到的顾客开始理发
> 	}
> 	else v(mu) // 不等了，直接走
> }
> ```
>
> 【多理发师】似乎可以直接使用，同步量barber仍然是0
>
> ？？？多个理发师都睡觉？？？



和尚喝水问题

> 问题表述
>
> 若干小和尚，若干老和尚，4个水桶，一口水井，一个水缸（容量12）
> 老和尚喝水: 水缸有水->有空闲的水桶->从水缸取水->喝水->释放水桶->释放空位 v(empty)
> 小和尚打水: 水缸有空位->有空闲的水桶->从水井取水->倒入水缸->释放水桶->释放有水 v(full)
>
> 代码
>
> ```cpp
> 	   // 4个水桶 12个空位 0个有水
> 资源量 bucket=4 empty=12 full=0
> 互斥量 mutex_well=1 mutex_vat=1
> 
> get_water()
> {
> 	while(1)
> 	{
> 		p(empty) // 水缸有空位
> 		p(bucket) // 有空闲的水桶
> 		
> 		p(mutex_well)
> 		从水井取水到水桶
> 		v(mutex_well)
> 		
> 		p(mutex_vat)
> 		倒入水缸
> 		v(mutex_vat)
> 		
> 		v(bucket)//释放水桶
> 		v(full)// 现在有水了
> 		
> 	}
> }
> 
> drink_water()
> {
> 	while(1)
> 	{
> 		p(full) // 水缸有水
> 		p(bucket)
> 		
> 		p(mutex_well)
> 		从水缸取水
> 		v(mutex_well)
> 		
> 		喝水
> 		v(bucket) // 归还水桶
> 		v(empty) // 现在有空位了
> 		
> 	}
> }
> ```
>
> 



### 线程同步

#### 互斥锁

当进入临界区时，需要获得互斥锁并且加锁；当离开临界区时，需要对互斥锁解锁，以唤醒其他等待该互斥锁的线程
大多数互斥锁的实现，都是自旋锁版本的（也就是说，互斥锁默认=自旋锁，也就是忙等锁），也就是没有成功获取锁就忙等，直到成功获取锁，进入临界区



自旋锁与互斥锁的区别：线程在申请自旋锁的时候，线程不会被挂起，而是处于忙等的状态。

自旋锁是一种互斥锁的实现方式而已，相比一般的互斥锁会在等待期间放弃cpu，自旋锁（spinlock）则是不断循环并测试锁的状态，这样就一直占着cpu。



系统调用如下：

```txt
pthread_mutex_init:初始化互斥锁
pthread_mutex_destroy：销毁互斥锁
pthread_mutex_lock：以原子操作的方式给一个互斥锁加锁，如果目标互斥锁已经被上锁，pthread_mutex_lock调用将阻塞，直到该互斥锁的占有者将其解锁。
pthread_mutex_unlock:以一个原子操作的方式给一个互斥锁解锁
```

>#### 互斥锁和自旋锁的区别
>
>互斥锁，用于临界区的保护，为了实现临界资源的互斥访问
>
>不同实现版本
>spinlock，自旋锁（忙等锁）：加锁失败，忙等
>sleeplock：加锁失败，sleep进行线程切换
>
>spinlock适用于临界区执行时间少于线程切换调度时间的情况
>sleeplock适用于临界区执行时间长的情况
>
>如果说，==临界区代码的执行时间很短，小于线程切换的代价，应该选择自旋锁==
>
>>互斥锁使用的开销，也是有开销的
>>这个开销就是线程切换时候的开销
>>假设两个线程属于同一个进程，因为虚拟内存是共享的，所以在切换时，虚拟内存这些资源就保持不动，只需要切换线程的私有数据、寄存器等不共享的数据
>>CPU执行上下切换的耗时大概在几十纳秒到几微秒之间，如果锁住的代码执行时间比较短，可能上下文切换的时间比锁住的代码执行时间还要长
>
>>https://blog.csdn.net/qq_37935909/article/details/108625508
>>https://www.jianshu.com/p/a7f349ddcf82
>
>



>
>
>#### 读写锁与互斥锁的区别
>
>对临界资源进一步细化，划分成读资源、写资源
>如果说都是并发的读取数据，数据不会发生变化，那么就没有必要对资源加锁
>
>读写锁和互斥锁都可以用于对资源的并发访问
>读写锁更适合于读多写少的情况
>互斥锁适用于写多读少的情况
>
>https://www.cnblogs.com/xiaomotong/p/14878726.html
>
>
>
>**适用场景：**
>
>读写锁最适用于对数据结构的毒操作次数多于写操作次数的场合。
>
>**读写锁有两种常见的策略：**
>
>读者优先
>
> 总是给读者更高的优先权，只要没有写操作，读者就可以获取访问权，比如图书馆查询系统采用强读者同步策略；
>
>写者优先
>
> 写者有更高的优先级，读者只能等到写者结束之后才能执行，比如航班订票系统，要求看到最新的信息记录，会使用强写者同步策略；
>
>https://www.cnblogs.com/sherlock-lin/p/14538083.html





#### 条件变量与互斥锁的区别

条件变量，用于线程之间的同步（也就是线程完成了一阶段的任务，唤醒另外的线程来继续完成下一阶段的任务），而互斥锁，是用于线程的互斥（对临界资源的保护）

mutex体现的是一种竞争，我离开了，通知你进来。
cond体现的是一种协作，我准备好了，通知你开始吧。(主动唤醒其他进程)

>
>
>```txt
>条件变量，又称条件锁，用于在线程之间同步共享数据的值。条件变量提供一种线程间通信机制：当某个共享数据达到某个值时，唤醒等待这个共享数据的一个/多个线程。即，当某个共享变量等于某个值时，调用 signal/broadcast。此时操作共享变量时需要加锁。其主要的系统调用如下：
>pthread_cond_init:初始化条件变量
>
>pthread_cond_destroy：销毁条件变量
>
>pthread_cond_signal：唤醒一个等待目标条件变量的线程。哪个线程被唤醒取决于调度策略和优先级。
>
>pthread_cond_wait：等待目标条件变量。需要一个加锁的互斥锁确保操作的原子性。该函数中在进入wait状态前首先进行解锁，然后接收到信号后会再加锁，保证该线程对共享资源正确访问。
>```
>
>
>



#### 信号量和互斥锁的区别

两者区别在于：互斥锁==只允许一个线程==进入临界区，==信号量允许有限个线程==同时进入临界区
以下代码模拟某个营业厅两个窗口处理业务的场景，有10个客户进入营业厅，当发现窗口已满，则等待，当有可用的窗口时，就接受服务

信号量是特殊的变量，也是用于线程同步。它只取自然数值，并且只支持两种操作：

```txt
P(SV): 
 sem--
 if sem<0 wait
 else return

V(SV)
	sem++
	if sem<=0 wakeup one
	else return # 代表如果有其他进程因为等待SV而挂起，则唤醒

其系统调用为：
sem_wait（sem_t *sem）
sem_post（sem_t *sem)
```







### 僵尸进程

僵尸进程的概念

概念：
父进程fork子进程之后，子进程比父进程先结束（子进程正常运行完毕或者执行系统调用exit()或者接收到了KILL -9信号，子进程运行结束，但也仅仅限于将一个正常的进程变成一个僵尸进程，并不能将其完全销毁），（子进程退出的时候会向父进程发送SIG_CHILD信号，但是==父进程没有注册信号处理函数，没有通过系统wait和waitpid来回收子进程占据的proc内存，释放子进程占用的资源，此时子进程将成为一个僵尸进程==。
也就是说，子进程虽然不运行，但是占据了内存资源

（子进程先结束，但是父进程没有通过wait或者waitpid来回收子进程，导致子进程占据内存资源）



产生原因：
子进程终止执行之后，内存已经销毁，p_stat变成了SZOMB，但是PCB仍然占据空间，等待父进程收集PCB的信息；**父进程没有执行wait或者Waitpid来回收子进程的内存资源**，因此子进程PCB一直没有释放，占用一个pid和PCB



僵尸进程的危害：
不同版本的linux虽然进程创建上限不同，但是都有==最大进程号的上限==。
僵尸进程，占用内存，占用进程号。如果==存在大量僵尸进程，那么导致系统无法创建新进程==。



杀死僵尸进程的方法（如何避免产生僵尸进程）

> 1 父进程注册信号处理函数，收到SIG-CHID信号，（代表至少有一个子进程已经停止运行，需要回收子进程的资源），循环体中调用waitpid，回收所有的子进程
> wait()回收任意一个子进程，并且会阻塞，直到回收成功为止
> waitpid()可以通过参数指定特定的子进程/任意的子进程（waitpid加入参数WNOHANG参数wait-no-hang，如果没有子进程可回收，那么立即返回，不会阻塞）
>
> 2 杀父进程或者父进程运行结束。（每个进程运行结束，会扫描是否存在子进程，如果有子进程，那么==由init进程来接管，成为孤儿进程==，并且**init进程会自动执行wait()调用来回收子进程，init进程会自动回收所有的结束的子进程**）
>
> 3 用signal(SIGCLD, SIG_IGN)通知内核，表示**忽略SIGCHLD信号，那么子进程结束后，内核会进行回收**。



```cpp
#include <unistd.h>
int main()
{
    int pid=fork();
    if(pid==0){
        // 子进程先结束，但是父进程没有wait()或者waitpid()回收子进程 -> 子进程成为僵尸进程
		return 0; // 或者exit(0);
    }else{
        sleep(10);
	}
    return 0;
}
```



### 孤儿进程

概念

> （父进程先结束，子进程还在运行）
>
> 一个父进程已经结束了，但是它的子进程还在运行，那么这些子进程将成为孤儿进程。孤儿进程会被Init（进程ID为1）接管，当这些**孤儿进程结束时由Init进程来调用wait，回收子进程占据的内存资源**。

```cpp
#include <unistd.h>
int main()
{
    int pid=fork();
    if(pid==0){
        sleep(10); // 子进程正常运行结束后，相应的内核结构被init进程回收
    }else{
        exit(0); // 父进程先结束，子进程成为孤儿进程
    }
    return 0;
}
```





### 守护进程

概念

> 在后台运行，且不受用户控制的进程
>
> 脱离终端控制之后，会忽略掉终端的一些信号，从而不受用户终端信号的影响
> 工作目录为root目录
> 关闭打开的文件描述符



守护进程与后台进程的区别

> 1 终端退出时：守护进程不会退出，后台进程会退出
> 2 受终端控制：守护进程的print不会打印到终端，后台进程会往终端打印结果
> 3 本质：守护进程是独立于终端；后台进程是终端执行了一次fork和exec，让进程在后台运行



## 二、死锁



### 概念

> 在两个或者多个并发**进程**中，每个进程持有某种资源而又等待其它进程释放它们现在保持着的资源，在未改变这种状态之前都不能向前推进，称**这一组进程产生了死锁**(deadlock)。



### 产生前提

> 1 （资源角度）资源互斥访问
> 2 （进程角度）进程**已经申请到了**资源，并且申请新的资源；对于已经申请到的资源，除非进程主动释放，否则资源不会被剥夺
> 3 （多个进程角度）多个进程形成环路，每个进程都在等待下个进程释放资源



<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210719205645.png" alt="image-20210719205645344" style="zoom:80%;" />



https://github.com/CyC2018/CS-Notes/blob/master/notes/%E8%AE%A1%E7%AE%97%E6%9C%BA%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%20-%20%E6%AD%BB%E9%94%81.md

### 处理方法

> 1 鸵鸟策略：忽略死锁
> 2 死锁检测与死锁恢复：不试图阻止死锁，而是当检测（检测有向图是否成环）到死锁发生时，采取措施进行恢复。如何检测：（具体算法在上面cyc2018链接里）如何恢复：杀进程，或者回滚
> 3 死锁预防：破坏4个必要条件
> 4 死锁避免



死锁预防

> 1 破坏互斥：资源可共享访问
> 2 破坏请求保持：进程在开始执行前请求所需要的全部资源
> 3 破坏不剥夺：如果申请失败，进程就主动放弃已经获得的资源
> 4 破坏环路等待：给资源统一编号，进程只能按编号顺序来请求资源



死锁避免

> https://zh.wikipedia.org/wiki/%E9%93%B6%E8%A1%8C%E5%AE%B6%E7%AE%97%E6%B3%95
>
> 银行家算法：在所有资源分配方案中，找出一种可以满足所有进程对于资源的需求，并且不会产生死锁的方案
>
> 安全与不安全
>
> 如果资源分配顺序可以满足所有进程的需求
> 并且不产生死锁，就是安全的





## 三、内存管理

https://github.com/CyC2018/CS-Notes/blob/master/notes/%E8%AE%A1%E7%AE%97%E6%9C%BA%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%20-%20%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86.md





### 进程的内存结构

一个程序的本质是由BSS段，data段（数据），text段（代码段）组成的
一个可执行程序没有调入内存之前，分为代码段，数据，未初始化数据区三个部分。

- 可执行文件，不是进程，包括三部分，.bss .data .text

数据段包括（全局变量和静态局部变量）
.bss 没有被初始化的变量，包括全局变量和static局部变量
.data 已经被初始化的变量，包括全局变量和static局部变量
代码段包括：（只允许读，不允许写）
.text 可执行代码
.rodata ==只读数据，比如字符串常量，类的虚函数表==



- 进程的内存图像，内存中由低地址到高地址依次为： 代码段，数据段{已初始化数据段，未初始化数据段(BBS)}，堆（heap，向高地址增长），栈（stack，向低地址增长）



>  **BSS段** :（bss segment）通常是指用来存放程序中未初始化的全局变量的一块内存区域。BSS是英文Block Started by Symbol的简称。BSS段属于静态内存分配。
>  **数据段** ：数据段（data segment）通常是指用来存放程序中 已初始化 的 全局变量 的一块内存区域。数据段属于静态内存分配。
>  **代码段**： 代码段（code segment/text segment）通常是指用来存放 程序执行代码 的一块内存区域。这部分区域的大小在程序运行前就已经确定，并且内存区域通常属于 只读 , 某些架构也允许代码段为可写，即允许修改程序。在代码段中，也有可能包含一些 只读的常数变量 ，例如字符串常量等。程序段为程序代码在内存中的映射.一个程序可以在内存中多有个副本.
>  **堆（heap）** ：堆是用于存放进程运行中被动态分配的内存段，它的大小并不固定，可动态扩张或缩减。当进程调用malloc/free等函数分配内存时，新分配的内存就被动态添加到堆上（堆被扩张）/释放的内存从堆中被剔除（堆被缩减）
>  **栈(stack)** ：存放程序的 局部变量 （但不包括static声明的变量， static 意味着 在数据段中 存放变量）。除此以外，在函数被调用时，栈用来传递参数和返回值。由于栈的先进先出特点，所以栈特别方便用来保存/恢复调用现场。动态内存分配,需要程序员手工分配,手工释放
>
>  
>
>  * 参考博客：
>    <https://www.cnblogs.com/zafu/p/7399859.html>
>    <https://blog.csdn.net/yangcunbiao/article/details/83020443>





### 虚拟内存

概念

> 在每个进程创建加载时，内核只是为进程“创建”了虚拟内存的布局，具体就是创建页表（地址映射单位），然后进程的PCB保存了页表的地址，==实际上并不立即就把虚拟内存对应位置的程序数据和代码（比如.text .data段）拷贝到物理内存中，只是建立好虚拟内存和磁盘文件之间的映射就好（叫做存储器映射），等到运行到对应的程序时，才会通过缺页异常，分配page，读入数据，安装映射到pgtbl==。
>
> 这样，对于程序来说，逻辑上似乎有很大的内存空间，只是实际上有一部分是存储在磁盘上，因此叫做虚拟内存。
>
> 
>
> 虚拟内存技术使得不同进程在运行过程中，它所看到的是自己独自占有了当前系统的4G内存。所有进程共享同一物理内存，每个==进程只把自己目前需要的虚拟内存空间映射并存储到物理内存==上。 



pros:

> 方便实现进程隔离，实现进程的内存保护：
> 每个进程运行在各自的虚拟内存地址空间，互相不能干扰对方。虚存还对特定的内存地址提供写保护，可以防止代码或数据被恶意篡改。
>
> 方便进程间共享内存：
> 当不同的进程使用同样的代码时，比如库文件中的代码，物理内存中可以只存储一份这样的代码，不同的进程只需要把自己的虚拟内存映射过去就可以了，节省内存
>
> 提高内存使用率：
> 连续空间会导致外部碎片，在程序需要分配连续的内存空间的时候，只需要在虚拟内存空间分配连续空间，而不需要实际物理内存的连续空间，可以利用碎片



cons:

> 1.虚存的管理需要建立很多数据结构，这些数据结构要占用额外的内存
>
> 2.虚拟地址到物理地址的转换，增加了指令的执行时间。
>
> 3.页面的换入换出需要磁盘I/O，这是很耗时的



MMU(pgtbl)

（由OS来完成va->pa的映射，用户进程根本不需要管理：OS获取对应proc的pgtbl，然后完成va->pa）

**内存管理单元（MMU）**管理着逻辑地址和物理地址的转换
页表（Page table）存储着页（逻辑地址）和页框（物理内存空间）的映射表
页表中还包含包含有效位（是在内存还是磁盘）、访问位（是否被访问过）、修改位（内存中是否被修改过）、保护位（只读还是可读写）。



进程内存划分的不同视角

> 用户进程先按段划分，段内按页分配
>
> 逻辑上，分段，用户进程的内存按照逻辑划分不同段，比如代码段，数据段
> 物理上，分页，page不一定连续



逻辑分段和物理分页的比对：

> 目的不同：分页，实现虚拟内存，获得更大的内存空间；分段，逻辑划分
> 内存碎片：分页，内部碎片



内部碎片与外部碎片

> https://blog.csdn.net/haiross/article/details/38704945
>
> 内部碎片：内部碎片就是已经被分配出去（能明确指出属于哪个进程）却不能被利用的内存空间；
> 外部碎片：外部碎片指的是还没有被分配出去（不属于任何进程），但由于太小了无法分配给申请内存空间的新进程的内存空闲区域。





### 页面置换算法

缺页中断的时候发生了什么

> 在用户程序运行中，如果要访问的页面不在内存中，就发生缺页中断，OS将该页调入内存中。
> 如果OS有空余内存，直接分配page，进行读入，安装映射到pgtbl即可；
> 如果OS无空余内存，OS需要选择一页内存page逐出到磁盘交换区，腾出内存page，再进行读入。



缺页中断的成本

> 没有空余内存的情况：发生2次内存与磁盘的IO
> 有空余内存的情况：发生1次内存与磁盘的IO



页面置换算法的主要目标是使页面置换频率最低（也可以说缺页率最低）。

不同的页面置换算法，策略都是在内存满了的情况下，按照不同的原则，进行选取victim。

> 最佳页面置换算法OPT（Optimal replacement algorithm）
>置换以后不需要或者最远的将来才需要的页面，是一种理论上的算法，是最优策略；实现上来说不知道不知道哪一个页面是将来不需要或者很久之后才需要的页面，因此实际无法操作
> 
>先进先出FIFO
> 置换在内存中驻留时间最长的页面。缺点：有可能将那些经常被访问的页面也被换出，从而使缺页率升高；先进先出策略，将cache作为栈看作，需要记录页面进入时间。
>
> 时钟算法 Clock
>SCR中需要将页面在链表中移动（第二次机会的时候要将这个页面从链表头移到链表尾），时钟算法使用环形链表，再使用一个指针指向最老的页面，避免了移动页面的开销；
> 
>最近最少使用算法LRU（Least Recently Used）
> 置换出未使用时间最长的一页；实现方式：维护时间戳，或者维护一个所有页面的链表。当一个页面被访问时，将这个页面移到链表表头。这样就能保证链表表尾的页面是最近最久未访问的。
>
> 最不经常使用算法LFU
>置换出访问次数最少的页面



### 颠簸现象

本质：内存不足导致的频繁page-fault（本质上一句话，缺页率太高）
具体：进程触发page-fault，其他page都已经在使用，不得不选择某个page写入disk，腾出空间给当前进程。但是立刻又触发新的page-fault，不断产生page-fault，导致整个系统的效率急剧下降，这种现象称为颠簸



内存颠簸的解决策略包括：

* 选择合适的页面置换算法（比如LRU，将最近不频繁的页置换到硬盘中，留出足够的内存空间给当前进程）
* 降低同时运行的程序的数量（给进程数量设置上限，避免消耗过多内存）
* 终止该进程或增加物理内存容量（杀进程，扩内存，限制进程数量）



### 内存管理

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210719204403.png" alt="image-20210719204356609" style="zoom:80%;" />

__

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210719204419.png" alt="image-20210719204419695" style="zoom:80%;" />

__

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210719204429.png" alt="image-20210719204428881" style="zoom:80%;" />





## 四、设备管理

磁道请求调度算法

1. FCFS，概念，按照IO请求顺序逐一处理；优点，简单，缺点，平均寻道时间长
2. 最短寻道时间优先，概念，优先处理与当前磁头距离最近的磁道请求；优点，平均寻道时间短，缺点，两端的磁道请求容易出现饥饿
3. 电梯算法，概念，往返扫描，直到该方向没有请求，转向；优点，所有请求都会处理，不会出现饥饿



https://github.com/CyC2018/CS-Notes/blob/master/notes/%E8%AE%A1%E7%AE%97%E6%9C%BA%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%20-%20%E8%AE%BE%E5%A4%87%E7%AE%A1%E7%90%86.md



## 五、文件系统

详见操作系统课程讲义



---

#### ./ source sh 三个命令执行shell文件的区别

source

> Linux source命令：
>  通常用法：source filepath
>
> 它的功能：使当前shell读入路径为filepath的文件并依次执行文件中的所有语句，通常用于重新执行刚修改的初始化文件，使之立即生效，而不必注销并重新登录。例如，当我们修改了/etc/profile文件，并想让它立刻生效，而不用重新登录，就可以使用source命令，如source /etc/profile。
>
> source命令是bash shell的内置命令
>
> 使用这个命令执行脚本即使没有执行权限也可以运行。



sh

> 运行sh xxx.sh，表示我使用sh来解释这个脚本,sh和source命令一样，没有执行权限也可以运行脚本。
> 但是这两者还是有些区别的，在鸟哥的书中有下图:
>
> ![img](https://yszhou.oss-cn-beijing.aliyuncs.com/img/20211226231924.webp)



./xx

> ./xxxx
> 使用这个命令需要先将文件提升为可执行的文件才可以进行命令的使用
>
> 如何提升权限，请看这篇总结——————[linux用户组以及权限总结](http://blog.csdn.net/s740556472/article/details/78077453)
>
> 如果我直接运行./xxx.sh，首先你会查找脚本第一行是否指定了解释器，如果没指定，那么就用当前系统默认的shell(大多数linux默认是bash)，如果指定了解释器，那么就将该脚本交给指定的解释器。例如我下面的代码中，我指定了这是一个python脚本，而不是shell脚本：
>
> ```python
> #!/usr/bin/python
> print("This is Python script")
> ```
>
>
> 那么你如果运行./a.run，结果就是输出一行文字，但是如果你运行sh a.run，会报错:
>
> 