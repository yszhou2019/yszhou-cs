# Lecture 01 Introduction

- Storage: 使用、构建存储系统，构建具有复制和容错的高性能分布式存储系统
- 计算系统：MapReduce就是一种计算系统
- 通信：基于通讯来构建分布式系统



大型网站的构建，小网站的时候，性能瓶颈在于web server而不是DB server；当web server不断扩充，瓶颈就来到了DB server。
这个时间就该考虑考虑分布式存储系统了。相对于web server集群而言，分布式存储系统更加困难。



分布式系统的特点（实际上就是下面要打造的分布式系统的要求）：

- Fault tollerance 容错
- availability
- recoverability 可恢复，Log写入硬盘中，从而恢复电力的时候读取硬盘

但是另外一点，保证可恢复，同时读写硬盘代价很高。因此，构建高性能的容错系统需要很多优化，来降低硬盘读写。



使用copy也可以实现容错，但是需要考虑的就是一致性问题。出于性能和容错的考虑，通常不止有一个数据副本。分布式系统中，某一对KV可能有多个副本。

考虑一种情况，两台server，都有一张KV表的副本。更新某一对KV的时候，一个server更新完毕，另外一个server由于网络原因等等，没有更新。这个时候出现数据不一致。
如果有人get这对KV，这个时候就体现出容错系统的意义了。

容错系统的一条规则，始终访问主服务器。当和主服务器通讯失败的时候，访问备用服务器。总有一天，可能会暴露出旧数据副本



对于强一致性系统，get通常可以获得最新的put数据。弱一致性系统则做不到这一点。
但是维护强一致性系统代价高昂。比如，如果数据有多个副本，可能客户端崩溃导致一个副本更新，另外一个没有更新。这种情况下要实现强一致性系统，比如，读取数据的时候，如果存在多个副本，就读取所有副本，并使用最新写入的val。但是在取值耗时上，读取一个值的性能会非常低。如果真的采用多个副本来保证容错，实现强一致性系统，性能就很低了。
这个时候就体现出弱一致性的优势了。弱一致性的研究，对于实际应用而言很有用处，并且可以根据弱一致性来获取高性能。



**MapReduce**

G家2004年的大型分布式计算系统。

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210410011312.png" alt="image-20210410011305686" style="zoom:80%;" />

Input File -> Map : 
InputFile存储到GFS中（google file sys，分布式存储），然后通过网络传递到MapReduce worker服务器中，以便进行Map操作。
worker服务器是MapReduce框架的一部分；对于Map输出结果中的每一个Key，MR Framework会安排单独的一个Reduce函数去处理。

因此，输入阶段，File到GFS会有大量的网络通讯。网络吞吐量可能是MapReduce系统的最大瓶颈。

**技巧1**

2004年论文中解决方案是，让服务器集群中，每台服务器都运行GFS和MR。
master将任务进行划分，分配给不同的worker
当需要对输入文件1进行map操作，master从GFS中找出保存了文件1所在的服务器
然后在该服务器上使用MapReduce软件来执行对应输入文件的map操作

这样一来，input file到网络就是直接从本地硬盘读取，不会涉及到网络操作。从而避免了等待网络来传输数据。

同样，map的执行结果也可以直接保存到本地硬盘上，来避免网络通信。



Reduce过程中，需要将多个worker中的KV表中，给定的key对应的所有val组合到一块，以供后续使用。Reduce过程就离不开网络了。（将整个网络中的所有数据，从生成数据的map服务器转移到reduce服务器）是MR整个过程中非常消耗性能的部分。



现在而言，G已经停止使用MR了。在停止使用之前，现代的MR实际上不会将map任务和存储任务放到同一台机器上运行了。

# Lecture 02 RPC和多线程



如果说单核CPU，两个完全相同的CPU计算进程，那么就没有必要采用多线程，用一个线程进行计算即可。
如果说单核CPU为了不同的服务，比如IO服务 网络服务 CPU服务，那么就有必要多线程。

如果说，多核CPU，大部分情况下，单线程计算没有启动多核CPU，这个时候采用多线程，就能够有效利用多核CPU，从而加速整体任务的计算。

RPC，不同机器之间的通信
线程，线程的锁 同步
GC

**thread advantage**
share memory in process

**thread challenges**
 n = n + 1

**sln-1** 使用lock，保证每次只有一个线程访问临界区
to solve race, use lock, this shared data is only accessed when holding lock( mutex.lock unlock )
wait; do not race; otherwise will cause wrong
lock 和 lock中间出现的变量无关
**sln-2** 数据不要在线程之间共享

**deadlock**
两个线程各自持有锁，并申请对方的锁

**go tortual中的web craweler**
获取url对应的body（url中如果有urls需要继续爬）
另外需要避免死循环

为了加速爬取，因此需要多线程并行爬取页面，直到占满带宽

何时完成爬取？

```go
// Serial crawler
// 不具备并行爬取的能力
func Serial(url string, fetcher Fetcher, fetched map[string]bool) { // map is passed by ref
	if fetched[url] {
		return
	}
	fetched[url] = true // avoid repeat url
	urls, err := fetcher.Fetch(url)
	if err != nil {
		return
	}
	for _, u := range urls {
		Serial(u, fetcher, fetched)
	}
	return
}
```



并行爬取的两种实现方案
sln-1 共享数据，共享对象，共享lock
sln-2 通过channel，来协调不同线程

使用Goroutine创建多线程的时候，需要限制线程的最大数量，避免耗尽内存
sln-1 使用线程池，复用空闲线程，而不是一个url需要创建一个新线程

woker线程不共享任何对象，woker和master之间也不共享，因此不需要担心线程race，不需要用到lock

对ch进行for range循环，做的实际上是**读取ch，直到ch中有东西出现，或者ch被释放为止**



# Lecture 03 GFS

分布式KV存储系统

高一致性意味着高成本，比如占用大量通讯资源

构建一个强一致性或者良好一致性的系统，那么这个系统通过客户端使用的时候就像是和单个服务器进行交互

强一致性系统的直观模型
单机服务器容错能力很差

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210420152228.png" alt="image-20210420152221300" style="zoom:80%;" />



BAD replication design 糟糕的主从复制设计
client-1, client-2, server-1, server-2
C-1 write 1 to x
C-2 write 2 to x

根据网络报的接收顺序不同，server-1最终x可能x=1，server-2最终x可能=2，造成不一致



GFS模型

client把文件存储到GFS上，或者从GFS下载文件
master保存的是两张table：
一张table保存的是<文件名，array of chunk handlers> （nv 这张表必须持久化）
另一张table保存的是<handler，存放该chunkd的server的list>（v 这张表不需要持久化，即使master宕机，重启之后可以重新向所有的chunk server询问该server上保存的都有哪些文件
version(nv)，primary(v), lease expiration(v)

为了加速查询，两张table是放到内存中的

读操作，直接从内存读取即可
写操作，那么会将操作写到磁盘log中，即使宕机也能
master之下，有很多chunk server，用来保存chunk文件



read



write : 
primary's job : 接收client发出的write请求，然后将写请求分配到chunk server

为什么要使用版本号？master能够根据版本号，明确哪些chunk server包含了最新的chunk，从而指定包含最新chunk的server作为primary（比如，60s的时间，期间这个server就是primary
version number 只有在master不知道谁是primary的情况下才会增加（primary没有响应Master）

# Lecture 04 Primary-Backup Replication



# Lab 1 MapReduce



# Lab 2 Raft

Raft这种技术用来管理复制以及服务器故障时，备机进行主从自动切换的管理



# Lab 3 K/V server

构建容错的KV服务器，并且要求可以被复制和容错

# Lab 4 Shared K/V service

将已经实现的具有复制能力的主备KV服务器克隆