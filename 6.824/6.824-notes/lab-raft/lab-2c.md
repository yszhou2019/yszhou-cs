# lab 2C

## recitation

这个lab是关于持久化的，每个raft state中有3个field需要进行持久化，分别是 curTerm votedFor log，把rf.persist()的两个函数照着example中的进行改动就可以了。

这样就通过了2C中的绝大多数test，只有两个test不会通过，分别是TestFigure82C TestUnreliableAgree82C

## lab-notes

lab 2C之前的test，顶多就是网络断开连接，但是raft的断开连接 恢复连接前后是一致的，不会发生变化，test 2C的不同之处在于不是断开连接，而是清除状态。也就是模拟宕机。

补充了rf.persist()和rf.restore()之后，restore()函数只需要在Make()里面调用一次即可。persist()函数需要在leader.Start()中调用；
        在两个RPC handler中，改变状态的时候调用；
        在vote()函数和sync()函数接收到回复后改变状态的时候调用。即可
        
修改过后，2C test()的结果
前3个test都是100次没问题
Figure82C时间测试时间太长了，单个test接近120s，合适的处理时间应该在35s左右
Figure8Unreliable2C会出错
TestUnreliableAgree2C()没有问题
TestReliableChurn2C()出错概率在1/100左右
TestUnreliableChurn2C()100次没有测出来问题

主要问题
- TestFigure82C()耗时110s
- TestFigure8Unreliable2C()会有数组越界问题
- TestReliableChurn2C()有小概率出错


```
Test (2C): Figure 8 (unreliable) ...
panic: runtime error: index out of range [415] with length 347

goroutine 74 [running]:
_/Users/yszhou/Projects/6.824/src/raft.(*Raft).sync.func1(0xc0000d21e0, 0x1)
	/Users/yszhou/Projects/6.824/src/raft/raft.go:303 +0x8f8
created by _/Users/yszhou/Projects/6.824/src/raft.(*Raft).sync
	/Users/yszhou/Projects/6.824/src/raft/raft.go:268 +0xa6
exit status 2
FAIL	_/Users/yszhou/Projects/6.824/src/raft	36.398s
```

AppendEntries RPC handler返回失败，有两种情况
1. raft缺少log => 此时返回自己的len(log)即可 => leader接收到之后，将nextIndex[server]修改为log(len)
2. raft的log不缺少，但是term冲突 => 此时返回这个term的首个log-index => leader查找自己log中，对应term的最后一个index 赋值给nextIndex[server] => 为什么要这么做？为什么不直接nextIndex[serveer]=ConfIndex? 


```
Test (2C): Figure 8 (unreliable) ...
panic: runtime error: index out of range [434] with length 383

goroutine 49739 [running]:
_/Users/yszhou/Projects/6.824/src/raft.(*Raft).updateCommitIndex(0xc000262e10)
	/Users/yszhou/Projects/6.824/src/raft/raft.go:408 +0x182
```

错误代码
```go
	// TODO
	if mid > rf.commitIndex && mid < len(rf.log) && rf.log[mid].Term == rf.currentTerm {
		rf.commitIndex = mid
		rf.checkApply()
	}
```

### 关于持久化

持久化的时候，应该将本机的log全部持久化，还是将本机的已经提交的log持久化？
回答，应当全部持久化
为什么？
首先考虑一点，raft对于commited的日志，保证日志会被持久化，保证日志会被状态机执行
假设，leader已经将日志同步给了majority的raft，但是leader在发送applyCh的时候宕机。此时这个log没有被commitIndex覆盖，但是由于已经同步给了大部分raft，所以说这个log应当被提交。但是宕机导致了没有被提交，因此有必要保存将log保存下来，当自己再次上线的时候，无论自己是不是leader，这个日志都可以提交成功。

关键是搞清楚lab 2c的两个figure8_test都是在干什么，预期的结果应该是什么，自己的raft与预期结果有哪些出入

TestFigure82C **网络可靠**

这个test，5个raft，一开始全部添加一个log，最后也是全部添加一个log
中间的过程中，会有一些问题

1000次迭代中，绝大多数迭代只有3个raft在线，选举出Leader之后（真的有leader选举出来吗？）
然后有多种可能性：
1. leader可能本机都没有添加log就宕机了 => log提交失败
2. 可能本机添加log之后就直接宕机，此时leader还没有将日志同步给其他raft => log提交失败
3. 还有可能包括自己，只有2个raft同步成功 => log提交失败
4. 还有可能3个raft都同步成功 => log提交成功

目前而言，都是sync()的数组越界造成的，nextIndex大了，导致log[next-1]越界

TestUnreliableFigure8C **网络不可靠** 
