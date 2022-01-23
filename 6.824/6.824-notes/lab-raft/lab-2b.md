# lab 2B log replication

## recitation

part B主要完成日志同步。在各种情况下，raft保证，日志只要能够提交，那么就会被保存在大多数raft中。

test func()分别是以下8个测试函数
1. TestBasicAgree2B 向3个raft的集群中发送三次cmd，所有cmd都应当commit
2. TestRPCBytes2B 直接pass
3. TestFailAgree2B 3个raft的集群，leader宕机之后，向集群发送若干cmd（应当成功），恢复old leader，发送新的cmd，仍然应当成功
4. TestFailNoAgree2B 集群太多故障raft，5个raft有3个断开连接，cmd应该提交失败；全部恢复连接，再发送cmd，则应该成功
5. TestConCurrentStarts2B 直接pass
6. TestRejoin2B 3个raft的集群，leader断开连接后向Leader发送3个cmd，均未提交；向其余2个raft发送一个cmd，应该提交成功；恢复old leader，断开新leader，再次发送cmd，应该提交成功；恢复新leader，再次发送cmd，应该提交成功
7. TestBackup2B 5个raft的集群，50条cmd成功；断开3个raft，向其余2个raft发送50条，应该失败；断2，恢复3个raft，50条cmd应该提交成功；3个中断开一个raft，50条应该未提交成功；重新连接一个raft，组成新的3个raft，50条应该成功；全部恢复，50条应该成功。
8. TestCount2B 直接pass



## follower结构

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210707144845.png" alt="image-20210707144845001" style="zoom:80%;" />



## candidate结构

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210707145424.png" alt="image-20210707145424249" style="zoom:80%;" />



## leader结构

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210707145958.png" alt="image-20210707145958656" style="zoom:80%;" />





## 遇到的问题

- AppenLogRPC 重复追加日志，怎么解决？已有的进行覆盖，新增的进行添加（这个问题不仅在于日志的追加方式，还在于，leader进行心跳RPC的时候，sync()产生的线程应当是守护线程，从而避免对1个raft产生多次RPC）
- 日志同步之后，如何判断提交，怎么解决？leader运行守护线程，根据已同步的数量进行提交
- leader由于一些原因成为follower之后，sync()线程还没有结束，自己就已经赢得选票了，导致对于其他的一个raft，会有两个sync()存在，怎么解决？记录每个raft的数量，如果已经存在了sync()，那么就不创建对应的sync()线程
- 网络故障导致的raft分区，需要对sync()的检测是否为leader、准备RPC数据的这两个过程，加一个锁，也就是这儿两个过程必须是整体的，否则就会出现意想不到的错误
- AppendEntries RPC追加失败，并且没有发生身份转化的时候，需要将对应的nextIndex--即可



## lab-notes

### 第3-4个test发现的问题

down掉的机器，在重新连接这段时间，一直处于candidate状态，因为始终没有赢得major的选票，每次vote结束之后都认为vote split，等待一段时间然后就重新发起vote，导致term不断增加。
与此同时，leader和follower正常运行。

重新连接之后，candidate进行vote，会将leader的term进行更新。leader会
candidate始终无法赢得别人的选票，就始终进行下一轮vote，导致term不断增加。
candidate无论和follower进行vote还是和leader进行vote，都会因为自己的LastLogIndex和LastLogTerm输掉vote，等到超时一段时间之后，又开启下一轮vote。

candidate等待的时间 = follower转化成candidate的倒计时 （随机数可能不同）

leader进行sync()RPC，candidate会直接拒绝，leader收到reply之后，由于reply.term>rf.curTerm，并且reply.Suce = false，那么自己会转成reply.term对应的follower



### TestFailAgree2B遇到的问题 



#### 问题描述

同一个log会添加两次

即使lab 2b test-3func()可以通过，会存在这种情况
```
2021/05/23 20:05:26 [follower-0 term-0] become candidate
2021/05/23 20:05:26 [candidate-0 term-1] win 2 votes, become leader
2021/05/23 20:05:26 raft-2 loglen-1 previdx-0 appendlen-0
2021/05/23 20:05:26 raft-1 loglen-1 previdx-0 appendlen-0
2021/05/23 20:05:26 [leader-0 term-1 loglen-1, to raft-2 term-1 prevIdx-1] append len-0
2021/05/23 20:05:26 [leader-0 term-1 loglen-1, to raft-1 term-1 prevIdx-1] append len-0
2021/05/23 20:05:26 leader-0 len2 recv com-101
2021/05/23 20:05:26 raft-1 loglen-1 previdx-0 appendlen-1
2021/05/23 20:05:26 raft-2 loglen-1 previdx-0 appendlen-1
2021/05/23 20:05:26 check cmd-101 success
2021/05/23 20:05:26 raft-2 loglen-2 previdx-0 appendlen-1
2021/05/23 20:05:26 raft-1 loglen-2 previdx-0 appendlen-1
```
也就是leader接受了一个cmd，但是进行了**两次rpc，添加两次**，而且第一次rpc还没有结束的时候，next数组也没有更新就进行了第二次rpc，导致follower添加了两次 cmd 101



#### 分析与解决

原做法：检查previdx和prevterm是否冲突，如果冲突才删除，不冲突则直接追加

问题根源：两次RPC，并且第一次RPC中，master还没有收到回复，那么就导致raft接收到两次相同的RPC，两次都不冲突，直接追加两次

解决：

即使previdx和prevterm不冲突，也不能直接追加，否则会重复追加相同的log

正确的做法是逐一比对，从prevIdx开始，**已有的数据进行更新和覆盖，新增的数据直接添加**
```go
	if rf.log[prevIdx].Term != args.PrevLogTerm {
		rf.log = rf.log[:prevIdx]
	}
	// append
	if len(args.Entries) > 0 {
		rf.mu.Lock()
		prevIdx = args.PrevLogIndex
		rf.log = append(rf.log, args.Entries...)
		rf.mu.Unlock()
	}

```



### TestFailNoAgree2B 发现的问题



#### 预期结果

期待的情况应该是什么样的？
首先创建5个raft，添加cmd 100，应该提交成功，并且5个raft(4个follower 1个leader)都会通过applyCh进行回复

然后，检查leader之后，断掉后面3个raft，此时raft只剩下(1个follower 1个leader)。这种情况下，发送cmd给leader，leader虽然会将cmd同步到剩余的1个raft中，follower会进行applyCh，但是Leader不会进行applyCh。

发送cmd 20给这两个raft，那么这两个raft都不应该进行commit。也就是说，期待的情况下，nCommitted应当返回0，代表这两个raft没有进行commit。也就是说，两个raft都不应当进行commit，rf.commitIndex不应当发生变化。

问题描述，一开始就出现问题，某一个raft成为leader之后，赢得3票，与此同时，



#### 思考问题

什么时间才算commit成功？正确的逻辑应该是什么样？
对于leader而言，只有当major数量的raft对于都commit成功之后，leader才能进行commit。那么leader应当如何判断major raft提交成功呢？
follower又应该在什么时间提交成功呢？是直接在AppendEntries RPC中直接提交成功吗？



#### 解决

无论是leader还是follower，**commitIndex更新之后，改变条件变量，每个raft都具有的守护线程waitApply自动将(lastApplied, commitIndex]之间的数据通过applyCh，发送到状态机中**。
1. 首先leader通过RPC同步日志
2. leader收到RPC回复，在适当的时候更新自己的commitIndex
3. 之后的AppendEntries RPC中，其余follower也会由于args.leaderCommit的变动，而更新自己的commitIndex
4. 各自raft触发apply



而leader如何判断更新commit？
leader单独开一个线程，从最新的log到上一次的commitIndex之前，不断向前，如果某个位置idx上，超出Majority数量的matchIndex>=idx，那么就可以更新commitIndex了
其余raft接收到AppendEntries之后，检查commitIndex，尝试进行更新





**lab-test的检测机制**

lab-test的检测，就是通过状态机进行检测。也就是说，当raft集群发生网络分区，并且leader处于少的区域时，client发送的cmd并不会首先通过leader进行AppendEntries RPC，leader进行RPC之后，发现数量没有达到major，所以leader不会进行commit，不会改变自己的commitIndex，同样的，raft接收到RPC之后，由于leader的commitIndex没有发生改变，自己虽然会append log，但是并不会将log设置成commit状态，不会更新自己的commitIndex。 

commit和apply，可以说是一体的，只要rf的commitIndex>lastApplied，必然会发生apply，从而二者再次相等。并且lab-test机制收到相应的信息。

所以我们要保证的是，
leader收到cmd之后将cmd增加到log当中，并进行Append RPC，将log同步到连接的上的raft实例中，leader收到reply并且改变相应的matchIndex和nextIndex。
follower接收到AppendEntries RPC之后，进行log同步，并且判断，只有当leaderCommit发生改变（也就是leader提交之后）自己才提交，才会applyCh改变状态机。

leader的另外一条线程，就是用于改变leader.commitIndex，具体逻辑是：当matchIndex

leader首先进行log同步，同步之后根据matchIndex改变的数量是否到达major，来改变自己的commitIndex。只有当leaderCommit发生改变的时候，其余raft才会改变自己的commitIndex。相继各个raft才会进行waitApply

通过applyCh进行回复的问题不用担心了，那么剩下的就是上面的两个问题。leader什么时间更改commitIndex？follower是不是直接在AppendEntries RPC中更改commitIndex？

还有一个问题，syncCond不太会用。能否用chan进行替代？等效替代的话，应该采用无缓冲区的chan还是有缓冲区的chan？



### TestFailNoAgree2B 另外的问题



#### 预期结果

预期的检测情况应该是怎样的？
5个raft成功添加cmd 10 ( idx应当为1 )
3个raft断开连接
再向集群中添加cmd 20，此时添加成功，但是不应当发生leader commit，follower commit，也不应当发生任何apply ( idx应当为2 )
此时检测idx=1上的已提交的log数量，应当0个raft进行提交
恢复其余3个raft的连接，检查新的leader
向新Leader添加cmd 30 ( idx应当为3 )
	如果old leader成为了新的leader，那么应当添加的位置是3
添加cmd 1000，这个时候应当一致 ( idx应当为4 )



问题来了
```
2021/05/24 22:13:01 *** reconnect ***
2021/05/24 22:13:01 leader-0 append raft-2 len-1 timeout 
2021/05/24 22:13:01 raft-0 开始执行leader任务 raft-2 next is 2, loglen 3
2021/05/24 22:13:01 raft-0 开始执行leader任务 raft-4 next is 3, loglen 3
2021/05/24 22:13:01 raft-0 开始执行leader任务 raft-3 next is 2, loglen 3
2021/05/24 22:13:01 raft-4 loglen-3 previdx-2 appendlen-0, log-3 is 20, log-2 is 10, 
2021/05/24 22:13:01 raft-2 status-3 term-2不承认leader-0 term-1
2021/05/24 22:13:01 raft-3 status-3 term-2不承认leader-0 term-1
2021/05/24 22:13:01 [leader-0 term-1 loglen-3, to raft-4 term-1 prevIdx-3] append len-0
2021/05/24 22:13:01 leader-0 term-1 由于raft-2 term-2 ，自己状态即将变成follwer
2021/05/24 22:13:01 [follower-0 term-2] become candidate
2021/05/24 22:13:01 raft-0 开始执行leader任务 raft-1 next is 2, loglen 3
2021/05/24 22:13:01 raft-2 给raft-0 投票
2021/05/24 22:13:01 raft-1 给raft-0 投票
2021/05/24 22:13:01 raft-4 给raft-0 投票
2021/05/24 22:13:01 raft-3 给raft-0 投票
2021/05/24 22:13:01 raft-1 loglen-2 previdx-1 appendlen-1
2021/05/24 22:13:01 [candidate-0 term-3] win 3 votes, become leader
2021/05/24 22:13:01 raft-0 开始执行leader任务 raft-4 next is 3, loglen 3
2021/05/24 22:13:01 raft-0 开始执行leader任务 raft-1 next is 2, loglen 3
2021/05/24 22:13:01 [leader-0 term-3 loglen-3, to raft-1 term-3 prevIdx-2] append len-1
2021/05/24 22:13:01 raft-0 开始执行leader任务 raft-3 next is 2, loglen 3
2021/05/24 22:13:01 raft-4 loglen-3 previdx-2 appendlen-0, log-3 is 20, log-2 is 10, 
2021/05/24 22:13:01 raft-1 loglen-3 previdx-1 appendlen-1, log-3 is 20, log-2 is 10, 
2021/05/24 22:13:01 raft-3 loglen-2 previdx-1 appendlen-1
2021/05/24 22:13:01 [leader-0 term-3 loglen-3, to raft-4 term-3 prevIdx-3] append len-0
2021/05/24 22:13:01 raft-0 开始执行leader任务 raft-2 next is 2, loglen 3
2021/05/24 22:13:01 [leader-0 term-3 loglen-3, to raft-1 term-3 prevIdx-2] append len-1
2021/05/24 22:13:01 [leader-0 term-3 loglen-3, to raft-3 term-3 prevIdx-2] append len-1
2021/05/24 22:13:01 raft-2 loglen-2 previdx-1 appendlen-1
2021/05/24 22:13:01 [leader-0 term-3 loglen-3, to raft-2 term-3 prevIdx-2] append len-1
2021/05/24 22:13:01 leader-0 append raft-1 len-1 timeout 
2021/05/24 22:13:01 leader-0 append raft-3 len-1 timeout 
2021/05/24 22:13:01 raft-0 开始执行leader任务 raft-2 next is 3, loglen 3
2021/05/24 22:13:01 raft-0 开始执行leader任务 raft-1 next is 4, loglen 3
panic: runtime error: index out of range [3] with length 3
```

此时3个raft刚刚恢复连接，没有cmd-20，log中只有cmd-10。leader还没有接收到新的cmd-30，leader-0向raft-1添加了cmd-20之后，nextIndex[1]对应的值应该是3，这里是4，发生了越界。哪里发生了越界，不是RPC handler越界。而是leader进行AppendEntries发生越界，nextIdx=4，自己的log只有3条。
为什么raft-1恢复连接之后，一开始只有cmd-10，next为2，接收一条log，怎么就成了next=4？

```

2021/05/24 22:13:01 raft-4 loglen-3 previdx-2 appendlen-0, log-3 is 20, log-2 is 10, 
2021/05/24 22:13:01 raft-2 status-3 term-2不承认leader-0 term-1
2021/05/24 22:13:01 raft-3 status-3 term-2不承认leader-0 term-1
2021/05/24 22:13:01 [leader-0 term-1 loglen-3, to raft-4 term-1 prevIdx-3] append len-0
2021/05/24 22:13:01 leader-0 term-1 由于raft-2 term-2 ，自己状态即将变成follwer
2021/05/24 22:13:01 [follower-0 term-2] become candidate
2021/05/24 22:13:01 raft-0 开始执行leader任务 raft-1 next is 2, loglen 3
2021/05/24 22:13:01 raft-2 给raft-0 投票
2021/05/24 22:13:01 raft-1 给raft-0 投票
2021/05/24 22:13:01 raft-4 给raft-0 投票
2021/05/24 22:13:01 raft-3 给raft-0 投票
2021/05/24 22:13:01 raft-1 loglen-2 previdx-1 appendlen-1
2021/05/24 22:13:01 [candidate-0 term-3] win 3 votes, become leader
2021/05/24 22:13:01 raft-0 开始执行leader任务 raft-4 next is 3, loglen 3
2021/05/24 22:13:01 raft-0 开始执行leader任务 raft-1 next is 2, loglen 3
2021/05/24 22:13:01 [leader-0 term-3 loglen-3, to raft-1 term-3 prevIdx-2] append len-1
2021/05/24 22:13:01 raft-0 开始执行leader任务 raft-3 next is 2, loglen 3
2021/05/24 22:13:01 raft-4 loglen-3 previdx-2 appendlen-0, log-3 is 20, log-2 is 10, 
2021/05/24 22:13:01 raft-1 loglen-3 previdx-1 appendlen-1, log-3 is 20, log-2 is 10, 
```

参考这里的log，raft-1实际上接收了两次RPC，一个应该是leader期间，进行了两次RPC，第一次RPC期间，Leader的term由于其他的RPC，被修改为term=2（和刚刚恢复的raft相同）因此，这次RPC导致了reply返回成功，leader接收到success之后，会更新raft-1的nextIndex；另外一点是AppendEntries RPC没有进行线程复用，而是一个线程进行RPC之后直接结束，或者一个RPC还没有结果，另外一个RPC就开始了。同时发生了另外一次RPC，这个RPC，自己已经重新当选leader，对于follower，日志的添加是覆盖形式的，因此两次reply都会成功。但是leader的nextIndex是+=的形式。

也就是说，对于raft-1，同时发生了两次RPC，第一次RPC还没收到reply的时候（此时的next也没有更新），已经开始了第二次RPC，（由于第一次RPC还没有更新next数组，此时会继续向raft-1添加cmd-20这个日志）这就导致raft-1进行了cmd-20的添加操作1次，cmd-20的覆盖操作一次。两次覆盖日志式RPC都成功响应。但是leader只要reply.Succ=true，就会进行对应nextIndex+=操作，从而导致下次AppendEntries RPC时，leader这边发生数组越界。



#### 解决

解决，线程复用，leader上台之后，创建多个线程，一个线程单独针对一个raft实例的心跳。只有本次RPC结束(要么接收到reply，要么RPC超时)之后，才进行下一次RPC。**决不允许对于同一个raft，同时发生多次RPC**

代码改造之后，又出现了新的问题，将3个raft进行reconnect之后，可能发生：old leader转化成candidate，快速赢得vote之后又回到leader状态。在此期间，leaderCommit()函数，sync()函数，heartBeat()函数，都有可能由于身份转化太快，导致线程还没来得及退出，就又转化到了leader状态，并且又开启了新的线程来完成同样的工作。



#### 新问题的根源

原因，太快赢得所有的vote。可以对于每个raft都设置一个数组，来存储sync()函数的执行数量，如果数量=0，并且身份合法，那么就执行sync()；如果数量>0，那么就不执行sync()。用来保证old sync()函数会正常退出。

另外一点，sync()函数中创建了多个go func()，都会执行到下面的函数语句，go rf.waitForElect()实际上是错误的，有可能导致产生多个waitForElect()
这一点绝对是错误的。但是该怎么改动？增加了个syncCounts，用来记录正在运行的sync-raft%v()的数量


```go
				if reply.Success == false {
					if reply.Term > rf.currentTerm {
						DPrintf("[leader-%v term-%v] heartbeat %v, failed, become follower", rf.me, rf.currentTerm, server)
						log.Printf("leader-%v term-%v 由于raft-%v term-%v ，自己状态即将变成follwer", rf.me, rf.currentTerm, server, reply.Term)
						rf.becomeFollower(reply.Term, NONE)
						rf.resetTimer()
						go rf.waitForElect()
						return
					}
```



### TestRejoin2B遇到的问题

这里牵涉到old leader中的 uncommit 日志应该如何处理。raft并不保证所有的cmd都会提交成功，**如果没有提交成功，那么raft系统应当告诉client**，本次cmd未提交成功。也就是说，未提交的log不应当保存。

因此，TestRejoin2B的逻辑应当如下：

1. 3个raft，首先cmd-101提交成功，然后leader宕机。
2. 向old leader 依次发送cmd-102 103 104（都应当未提交，并告知client，本次操作失败）
3. 向new leader 发送cmd-103，应当提交成功。此时，new leader和唯一的follower保存并且提交的log是cmd-101 103
4. 此时，new leader宕机，old leader重新连接，并向集群中发送cmd-104，此时应当follower选举成功，然后将cmd-103同步，和cmd-104同步。并提交。
5. 恢复new leader的连接，同步cmd-104。
6. 向集群中发送cmd-105，完成提交后，3个raft都应当是 101 103 104 105



#### 问题描述

问题，最后的leader没有向所有raft发送心跳，导致有新的candidate产生。为什么没有向其余所有的raft发送心跳呢？
这一点其实很简单，因为RPC设置的超时时间为1s，而leader的心跳周期是100ms，相当于长期阻塞了心跳。因此会转化成candidate。这并不会导致错误的结果。



#### 问题分析
但是绝对不该发生的是什么？另外一个follower绝对不应该向candidate进行投票。因为lastTerm应当>candidate的lastTerm。follower连接上来之后，应该对103进行同步，然后同步104。既然已经同步，那么此时lastTerm绝对>candidate的lastTerm。也就是绝对不应该投票的。

old leader的后面的日志忘记删除了！日志term是1！



#### 问题解决

sync()的检测是否为leader，以及准备RPC的数据，这两个过程，**必须当做一个过程，过程必须是原子的**



### TestBackup2B遇到的问题

TestBackup2B预期的结果

5个raft，分成两个集群，2+3

step 0. 向5台raft发送1条cmd
step 1. 断掉3台，向剩余2台raft发送50条指令，应当全部都是未提交
step 2. 断掉刚才的2台，连上3台，发送50条指令，全部应当提交
step 3. 断掉一个follower，再发送50条，应当全部未提交
step 4. 全部断开，再恢复2+1个follower，再发送50条，应当全部提交
step 5. 全部连接，再发送一条指令，应当全部提交



#### 遇到的问题

遇到的问题，全部统一起来之后，还剩下唯一一个**term很高的节点**（由于之前不断follower<->candidate，导致term很高）导致集群状态不可用。



#### 分析

正常集群遇到term很高的节点，会整体失效，然后更新term至最新（此时正常集群中的所有raft都是等效的）。此后会有两种情况，
1 刚刚加入集群的节点首先发起vote，但是由于vote RPC会检查candidate的lastLogTerm和lastLogIndex，因此**必然不会赢得选举**，再次follower。并且在vote()过程中，自己已经将自己的term更新给了整个集群。 
2 集群中的任意一个首先发起选举，赢得投票，然后这个集群开始正常运行。



#### 解决

解决，需要在sync()中补充，如果reply.Succ=false && reply.Term <= rf.curTerm，那么就将**nextIndex[raft]--**（当然，要注意避免越界）

这样，就能够通过lab 2B的所有test了！


