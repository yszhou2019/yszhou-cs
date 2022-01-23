# lab mr

## recitation

master结构

![image-20210707102822589](https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210707102829.png)



worker的结构

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210707103040.png" alt="image-20210707103040767" style="zoom:67%;" />



## lab-notes

### master

管理四个任务队列，分别是map-wait-list map-running-list reduce-wait-list reduce-running-list，负责任务的分配，阶段的管理，以及任务未完成时候的重新分配任务（单独开启一个goroutine，不断观察四个队列中是否存在超时的任务，比如某个正在执行map的worker突然宕机，这个时候就把任务重新放回waiting-list中）

不断对worker发出的请求做出响应，主要是askTask RPC

**askTask RPC**
首先判断队列中的元素数量，可能处于map阶段或者reduce阶段或者全部完成。
1. map阶段（mapWaiting中有元素）：分配map任务
2. map阶段（Waiting中没有但是mapRunning中有元素）：此时所有的map任务都已经分配，等待都完成之后开启reduce阶段，此时让worker进行sleep
3. reduce阶段（有任务）：分配
4. reduce阶段（没有任务）：等待，让worker进行sleep
5. 全部完成：让worker退出

**taskDone RPC**
worker完成了map或者reduce之后会告诉master
1. 完成map任务：将任务从mapRunning中删除，如果len(mapRunning)=0，那么就开启reduce阶段
2. 完成reduce任务：将任务从reduceRunning中删除，如果len(reduceRunning)=0，那么就进入isDone状态

### worker

启动一个worker之后，就进入一个无限循环，不断向master发送 **askTask RPC**，并执行分配的任务。

可以被分配的任务有：
1. map
2. reduce
3. sleep(比如map阶段任务已经分配完毕，但是部分worker还没有完成map，同理reduce，这个时候就需要worker 进行sleep等待）（reduce阶段任务分配完毕，一定不能直接将worker退出，因为其他正在执行reduce的worker有可能宕机）
4. exit 全部任务完成，worker程序结束

map任务：（**处理和分散**）
master将一个input file交给某个worker，worker遍历一遍文件，执行mapfunc()（具体的map任务），并且用hash将结果分散到不同的输出文件中。

reduce任务：（**整合**）
合并hash值相同的文件，然后sort之后进行合并，整合信息，每次整合出来一项之后执行reducefunc()，然后将整合后的结果输出即可。


### 其他需要注意的点

RPC需要将结构体内部的所有 filed name 都定义成首字母大写

下面是之前做的时候的草稿

过程

1. master接受m个infile的名称，initialize map waitling list，监听端口
2. 启动woker进程，worker进程，一直循环，直到发送任务完成

```go
for{
    taskInfo :=AskTask()
    swtich{
        Map:
        	PerformMap()
        Reduce:
        	PerformReduce()
        Waiting:
        	Sleep
        Done:
        	return
    }
}
```

3. master接收到AskTask之后（master处理完askTask之后，**worker接收信号，执行相应操作，map / reduce / sleep / return** ）

   首先检查是否处于ISDONE状态，如果已经ISDONE，那么直接让worker进程结束即可
   考虑处于Map阶段：
   如果waiting非空，就取出一个任务进行分配，并存入到running list中；
   如果waiting为空，MapRunning非空（为了容错），那么就让Worker等待；
   如果waiting为空，running为空，那么说明map阶段执行完毕，继续考虑reduce
   考虑处于Reduce阶段：
   如果wating非空，取出，分配，返回，存入running list；
   如果waiting为空，running 非空（由于有可能某个running reduce的worker宕机，因此需要让请求reduce的worker等待），就sleep；
   如果双空，那么任务Done，让worker结束进程即可

4. worker执行完毕任务之后，提交taskDone

5. master接收到taskDone信号之后，**改变的是自身状态，维护更新自身的队列，不改变worker状态**，**不反馈给worker任何信息**
   如果map任务Done
   从running中删除掉对应的item，检查waitling list和runninglist是否双空，如果双空，就初始化reduce waiting队列；如果不是双空，**比如running中还有，或者waiting中还有，那么啥也不干**
   如果reduce任务Done
   从runninglist中删除掉对应的item；检查waiting和running是否双空，**如果双空，改变自身状态ISDONE**

mrmaster不断sleep，检查master是否ISDONE，如果ISDONE，就完成了工作

基本结构的设计

worker的设计

结构体的设计

某个map任务或者某个reduce任务执行完毕的时候，需要考虑
从map running中移map task，需要fileName, fileIdx（为了生成临时文件），不需要reduceIdx ()
从reduce running中移除reduce task，需要reduceIdx即可