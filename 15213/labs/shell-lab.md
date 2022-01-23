# sh-lab



## 实验介绍



### tsh对于信号的处理

#### sig-int sig-stop

对于信号INT，信号STOP，`tsh`就像是一个proxy，也就是信号中转站，捕获信号之后，向fg-running进程转发信号即可（注意，**在这两个sig-handler中不需要delete任务队列或者change任务队列，这两个handler功能仅仅是转发信号**）



#### sig-child

需要根据子进程的退出原因，进行不同的操作：
1 子进程正常运行结束，那么delete任务即可
2 子进程由于信号而结束，那么delete任务+打印提示信息
3 子进程接收到STOP而停止，那么改变对应的job state+打印提示信息



### 外部命令

fork进程并exec即可，唯一需要注意的是，判断一下fg还是bg



### 内置命令

内置命令主要用于任务队列的管理，比如打印队列，以及队列任务的前后台切换

**tsh内置命令**很简单，内置命令主要用来管理任务队列（running队列的前后台切换），以及shell的退出，打印任务队列。
fg+ id，向指定的job发送CONT信号，改变队列对应任务的状态，并waitfg()等待进程结束在前台运行
bg+ id，向指定的job发送CONT信号，改变队列对应任务的状态

```
– The bg <job> command restarts <job> by sending it a SIGCONT signal, and then runs it in
the background. The <job> argument can be either a PID or a JID.
– The fg <job> command restarts <job> by sending it a SIGCONT signal, and then runs it in
the foreground. The <job> argument can be either a PID or a JID
```





函数`waitfg`纯粹只是为了阻塞一下，直到pid对应的任务不再是fg-running为止

```cpp
/* Here are the functions that you will implement */
void eval(char *cmdline);
int builtin_cmd(char **argv);
void do_bgfg(char **argv);
void waitfg(pid_t pid);

void sigchld_handler(int sig);
void sigtstp_handler(int sig);
void sigint_handler(int sig);
```





## 举个例子

### tsh执行外部命令

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210614152234.png" alt="image-20210614152227693" style="zoom:80%;" />



### tsh执行内置命令

```
fg jobid : change job->state, and waitfg()
bg jobid : change job->state.
jobs : print job list.
quit : exit
```





### tsh接收到SIG-INT

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210614152629.png" alt="image-20210614152629257" style="zoom:80%;" />

### tsh接收到SIG-STOP

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210614152948.png" alt="image-20210614152948431" style="zoom:80%;" />

### tsh接收到SIG-CHILD

根据上面两个图，sig-int和sig-stop对应的handler功能很简单

```
从jobs中获取前台job，然后向对应的进程发送INT信号或者STOP信号
```

sig-child的handler相对麻烦

```
SIG_CHILD_HANDLER:
   pid = waitpid(... &status ...)
   如果子进程status是正常退出
   		那么删除job即可
   子进程是接收到信号退出
   		删除job，打印一下某个job接收到xx信号
   子进程接收到STOP信号
   		将对应的job更改状态为STOP即可
```





## recitation 

略过



