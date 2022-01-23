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



## goroutine

each goroutine, contains of { one `$pc` , one set of registers, one stack}



golang closure

比如parent routine开了child routine，传递给child routine一个变量。但是在child routine开始执行之前，parent routine已经return。

> 传递给child routine的变量并不会保存在stack中，编译器会分配heap内存用于保存这个变量的当前值。编译器发现这个变量在closure function中使用，就会把变量移动到heap内存中。
>
> 外部函数return的时候，内部函数仍然可以访问heap中的变量。
>
> gc会负责最后引用heap内存的这个函数return时，进行内存释放



下面的代码有个不太好的地方，就是对于线程的数量没有进行控制
毕竟线程也是有开销的，如果stack大小1kb，开100w个线程就是1GB的内存占用
比较好的方案是，采用thread-pool方式进行线程复用

```go
// concurrency web crawler
func ConcurrentMutex(url string, fetcher Fetcher, f *fetchState) {
	f.mu.Lock()
	already := f.fetched[url]
	f.fetched[url] = true
	f.mu.Unlock()

	if already {
		return
	}

	urls, err := fetcher.Fetch(url)
	if err != nil {
		return
	}
	var done sync.WaitGroup
	for _, u := range urls {
		done.Add(1)
        u2 := u
		go func() {
			defer done.Done()
			ConcurrentMutex(u2, fetcher, f)
		}()
		//go func(u string) {
		//	defer done.Done()
		//	ConcurrentMutex(u, fetcher, f)
		//}(u)
	}
	done.Wait()
	return
}
```







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

主从备份

>
>
>replica
>相同的服务部署到集群中
>
>要不要进行replica？为什么要进行replica？
>这种复制方案会消耗比如2倍 3倍的资源（计算机 CPU RAM等等），每个block保存多个副本，这样值不值？为什么要这么做？
>取决于服务的价值
>如果服务器故障，无法给客户提供服务带来的损失远超replica的成本，那么就应该进行备份。
>replication值不值，取决于故障会带来的损失



paper vm-fault tolerance

>
>
>paper中提供了两种备份的思路
>1 state transfer =>将master的内存整个打包，通过网络发送给backup（备机）
>2 replicated state machine =>将操作从master备份到备机（instruction, in same order)
>
>简言之，方案1，将整个状态进行同步 方案2，将client发送的操作进行同步
>
>大多数情况下，倾向于采用 replicated state machine这种方案（更小的网络IO，而不是整个内存打包传送），但是有一个缺点，这种方案只能适用于单核机器，多核会带来指令的不确定性，从而相同的多个命令，在多个多核机器上执行，执行结果可能不一致
>
>简言之，state transfer ，**代价高**，但是对于多核并行的备机而言，state transfer可以很好的完成replica
>replicated state machine，代价低，不适于多核并行的机器
>
>如何在多核机器上进行replica？
>vm-ft提供的方案，state transfer 这种方案可以适用于多核和并行
>
>应用程序级别
>
>machine level，适用于任何程序的replica，可以让任何软件都能完整replica 状态



VMware FT

>
>
>首先，VM ft是一种分布式 高可用的硬件系统，而不是软件系统。why？因为VM ft可以保证任何运行在系统上的应用程序都可以完成 replica
>
>talks about VM ft
>
>primary 主机/ backup 备机
>
>p b 都会从client接收到输入，只有 p 会生成应答数据包，并通过NIC（网卡）发送给client； b 虽然会生成数据包，但是由于 p 的存在， b 的数据包会被 VMM监视器（VMware monitor）扔掉。也即，只有master会对client的cmd进行回复，slave并不会对client进行回复。
>关于这一点，还有一个问题，master崩溃的时候，slave应当成为master并响应客户端，这就要求VM ft的集群的MAC地址，是一致的（slave会继承master的以太网MAC地址作为自己的MAC地址）
>
>VMft 机器之间如何传递信息？master接收请求，然后forward请求，然后等到slave应当之后，自己才会进行处理，并且回复client。
>否则，如果先回复client，然后再forward，会有一种情况导致容错能力崩溃。
>比如，master接收请求，然后自己处理之后，回复client崩溃，forward也崩溃。那么其他backup上台的时候，就会出现状态不一致。
>
>但是呢，这种容错方案会带来性能上的限制。
>直到backup处理完log record，并且回复primary之后，primary才会回复client。
>在响应之前，primary是停顿的，这就带来性能上的损失。
>
>另外一点，
>log channel中，数据包绝大多数都是确定型指令，极少极少是非确定型指令。
>
>

# lecture 05 go thread and raft



## closure

Finally a equals 'hello world'

goroutine访问了函数之外的变量

```go
package main
import "sync"
func main(){
  var a string
  var wg sync.WaitGroup
  wg.Add(1)
  go func(){
    a="hello world"
    wg.Done()
  }
  wg.Wait()
  println(a)
}
```



### **用loop开多线程**

closure 捕获变量

sync.WaitGroup

```go
package main
import "sync"
func main(){
  var wg sync.WaigGroup
  for i:=0;i<5;i++ {
    wg.Add(1)
    go func(){
      sendRPC(i)
      wg.Done()
    }()
  }
  wg.Wait()
}
// print 4,5,5,5,5 wrong!

func main(){
  var wg sync.WaitGroup
  for i:=0;i<5;i++ {
    wg.Add(1)
    go func(x){
      sendRPC(x)
      wg.Done()
    }(i)
  }
  wg.Wait()
}
// print 0,1,2,3,4 right
```



### **定时任务**

```go
func main(){
  go periodic()
  time.Sleep(5 * time.Second)
}

// timer
func periodic(){
  for {
    println("tick")
    time.Sleep(1 * time.Second)
  }
}
```



## go synchronization primitives



### sync.Mutex



### **定时任务一直执行，直到something happen**

```go
var done bool
var mu sync.Mutex

func main(){
  time.Sleep(1 * time.Second)
  println("started")
  go periodic()
  time.Sleep(5 * time.Second)
  mu.Lock()
  done = true
  mu.Unlock()
  println("cancelled")
  time.Sleep(3 * time.Second)
}

func periodic(){
  for {
    println("tick")
    time.Sleep(1 * time.Second)
    mu.Lock()
    if done {
      mu.Unlock()
      return
    }
    mu.Unlock()
  }
}

// equals
func periodic(){
  for !rf.killed() {
    println("tick")
    time.Sleep(1 * time.Second)
  }
}
```





Lock + global variable  or channel?

go中, **main goroutine结束**，其余的goroutine也都**全部结束**



golang的同步primitives `sync.Mutex sync.WaitGroup`



### bank example

rule 1通常情况下我们说lock是为了保护global variable
rule 2但是更多情况下，我们用lock并不是具体保护某个特定的变量，而是保证invariant，来保证不变量（比如这里的alice + bob）

lock protect invariants

lock make region atomic

```go
package main

import "sync"
import "time"
import "fmt"

func main(){
  alice:=10000
  bob:=10000
  var mu sync.Mutex
  total:=alice+bob
  
  go func(){
    for i:=0;i<10000{
      mu.Lock()
      alice-=1
      mu.Unlock()
      mu.Lock()
      bob+=1
      mu.Unlock()
    }
  }()
  
  go func(){
    for i:=0;i<10000{
      mu.Lock()
      bob-=1
      mu.Unlock()
      mu.Lock()
      alice+=1
      mu.Unlock()
    }
  }()
  
  // judge routine, total count should never change
  start:=time.Now()
  for time.Since(start) < 1*time.Second {
    mu.Lock()
    if alice+bob!=total{
      fmt.Printf("observed violation\n")
    }
    mu.Unlock()
  }
}
```





### sync.NewCond



condvar-example-2

spin loop until condition finished -> right but bad!

Although code-2 is right, but main goroutine will cost one core 100%. Its a waste, may it cause program slow down.



sleep loop until condition finished -> right but not clear!

Right way is, main goroutine should wait or sleep a certain time. its ok.

but `magic constants`, sleep a **certain** time? what value should it be?



Condition variable

适用场景，有多个并发运行的线程，它们对某个共享变量进行更新
另外有一个线程，等待直到共享变量的某个属性或者某个条件为true

That's condition variable



condvar associated with locks ( lock protect shared data )

当共享数据满足特定条件的时候，通过condvar进行



多个线程对数据进行修改的时候，有可能会让条件变成true -> 每次调用`cond.Broadcast()`

> whenever we change the shared data, we call `cond.Broadcast()` (only when we hold the lock)



另外main routine等待该条件变成true -> `cond.Wait()`

> we call cond.Wait() (在wait前后也需要获取lock)



what `cond.Broadcast()` and `cond.Wait()` does?

> 每个线程call `cond.Broadcast()`， 就会唤醒正在等待这个condWait的线程
>
> 一旦当前线程释放lock，被唤醒的线程就会重新获取lock，进行条件检查
>
> 
>
> `cond.Wait()`会将当前线程添加到唤醒队列中



经典问题 lost wake-up



right pattern in golang

> main routine永远都是，先获取lock，然后for loop检查是否满足条件
>
> 条件不满足，调用`cond.Wait()`，释放lock，将自身thread添加到唤醒队列中，然后sleep；被唤醒之后，自动获取lock，然后再次检查是否满足条件
>
> 条件满足，就退出循环，仍然持有lock



different between `cond.Broadcast()` and `cond.signal()`

> `cond.Broadcast()` 唤醒所有等待的thread
> `cond.signal()`唤醒一个等待的thread



Right pattern example

```go
func main(){
  rand.Seed(time.Now().UnixNano())
  
  cout:=0
  finished:=0
  var mu sync.Mutex
  cond:=sync.NewCond(&mu) // condvar
  
  for i:=0;i<10;i++{
    go func(){
      vote:=requestVote()
      mu.Lock()
      defer mu.Unlock()
      if vote{
        coute++
      }
      finished++
      cond.Broadcast()
    }()
  }
  
  // !!!
  mu.Lock()
  for count < 5 && finished != 10{
    cond.Wait() // if wakeup, re-acquire lock, and check for condition
  }
  // if condition == true, then still hold the lock
  if count >=5 {
    println("recv 5+ votes!")
  }else{
    println("lost")
  }
  mu.Unlock() // free the lock!!!
}

func requestVote() bool {
  time.Sleep(time.Duration(rand.Intn(100)) * time.Millisecond)
  return rand.Int() % 2 == 0
}
```





### sync.WaitGroup



`wg.Wait()`一直等待直到wg.Add()次数和wg.Done()次数一样多



下面代码line:4很重要，是在main routine中首先`wg.Add(1)`然后才会创建goroutine

如果不这么做，而是直接for loop中go func()，然后func开始和结束分别进行`wg.Add(1)`和`wg.Done()`，那么就有可能导致main routine直接结束（比如所有for loop中的goroutine都没有开始执行，此时 `wg.Add()`和`wg.Done()`一样多，main routine可以不会阻塞在`wg.Wait()`）

```go
func main(){
  var wg sync.WaitGroup
  for i:=0;i<5;i++{
    wg.Add(1) // ! 注意这里
    go func(x int){
      sendRPC(x)
      wg.Done()
    }
  }
  
  wg.Wait()
}
```







## go concurrency primitives



### unbuffered channel



unbuffered channel

no buffer

> 直觉来看 channel 近似于 带有sync primitives的queue
>
> but channel 实际上**没有存储空间**



channels are synchronized

> two goroutine, if no one recv, then the thread sending will block until someone try to recv from channel
>
> 同理，如果没有send线程，那么recv线程也会block
>
> 所以说channel的收发是同时进行的 synchronously



所以说，channel是一种同步communication，并且不带存储空间
使用如果不注意，容易造成deadlock，all threads都阻塞了



### buffered channel

实际中基本没什么问题需要用buffered channel来解决



于buffered channel而言，
在内部存储空间塞满之前，所有的send都是non-block；塞满之后，就和unbuffered channel一样了





### channel的常见使用场景

producer/consumer生产者消费者队列（当然，也可以用thread-safy FIFO queue）



实现类似于waitGroup的功能，效果可以和waitGroup一样



使用建议
buffered channel基本用不到

甚至unbuffered channel都不要用，除非你明白自己要干啥



## golang建议

尽可能少用channel

只使用shared memory，mutex，条件变量和Set



### go memory model

https://golang.org/ref/mem



# lec 06 fault tolerance raft



# lec 07 fault tolerance raft



# lec 08 zookeeper



# Lab 1 MapReduce



# Lab 2 Raft

Raft这种技术用来管理复制以及服务器故障时，备机进行主从自动切换的管理



# Lab 3 K/V server

构建容错的KV服务器，并且要求可以被复制和容错

# Lab 4 Shared K/V service

将已经实现的具有复制能力的主备KV服务器克隆