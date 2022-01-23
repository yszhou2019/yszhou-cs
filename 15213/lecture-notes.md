# 视频进度

- [ ] P5 machine level basics
- [ ] P6 machine level control
- [ ] P7 machine level procedure
- [ ] P8 machine level data
- [x] P9 machine level program advanced topics
- [x] P10 program optimizations
- [x] P11 the memory hierarchy
- [x] P12 cache memories
- [x] P13 linking
- [x] P14 exceptions and processes
- [x] P15 signals and nonlocal jumps（理解的比较详细）
- [x] P16 system level IO
- [x] P17 virtual memory concepts
- [x] P18 virtual memory systems
- [x] P19 dynamic memory allocation
- [x] P20 dynamic memory allocation
- [x] P21 network programming I
- [x] P22 network programming II
- [ ] P23 concurrent programming
- [ ] P24 synchronization basics
- [ ] P25 synchronization advanced
- [ ] P26 thread level parallelism

# lecture 06 汇编级别的控制流语句



if语句的汇编表示



conditional-move优化

（有点类似于延时槽的概念，提前执行分支的代码，最后再进行分支判断）



switch的汇编表示

>
>
>首先，switch语句通过经过编译器生成的汇编代码中，大部分都是生成jump table，从而不是线性时间判断分支O(n)（多个if else 的时间复杂度），而是直接O(1)命中分支
>
>编译器会生成跳转表，case数据的最小项和最大项确定一个范围，范围之外的进入default分支，范围之内的创建若干跳转表项，然后根据值的不同，进入不同的分支中，执行对应的分支代码。
>
>如果**case 有负数**，那么会补齐，将所有数据+bias，保证最小的是0.
>
>如果case 范围很大，比如一个case 0 一个case 100000，编译器会编译生成if else的汇编代码，而不再是jump table.





gcc编译器推荐两个级别的优化

-O1 

-Og 汇编代码容易看懂，适合于debug



# lecture 07 machine level program III procedures



passing control
汇编语言中call 和 ret

>
>
>call : push 当前的rip，并且设置新的rip
>
>ret : ret假设stack top有当前要返回的地址，从stack中pop出要返回的地址，increment stack pointer，并且将弹出的地址设置给rip。这样程序就返回了调用前的地址。
>
>call : push下一条指令的地址，ret : 返回到应该恢复执行的地方
>
>call 和 ret仅仅完成了过程调用的控制流部分



passing data

>
>
>目前大多数情况下，函数调用的参数传递，是通过寄存器来完成的。不过也有少数情况，参数传递通过stack传递（stack是内存的一部分）call 的时候参数压栈，ret 的时候销毁stack
>
>通过一组寄存器，来完成函数调用时候的参数传递。
>
>前6个参数，%rdi %rsi %rdx %rcx %r8 %r9
>
>返回值，%rax
>
><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210527171225.png" alt="image-20210527171218822" style="zoom:80%;" />



stack frame

>
>
>函数调用的栈帧
>
>上面汇编语言call ret对应的“栈”，就是这里的栈帧
>
>比如call，会将返回地址 return addr存入新的栈帧，在执行新函数的函数体之前，会将所有需要的信息保存的栈帧中。
>
>调用函数的时候stack pointer很快减小，调用完毕，再增加回来。
>
>另外一点，函数的局部变量都保存在栈帧中（内存中），先分配内存（减小stack pointer）然后进行赋值。通常情况下，分配的字节数量会更多一些（为了进行内存对齐）
>
>
>
>lea汇编指令的作用，创建指针（内存地址通过算数运算得到)
>
>也就是说，汇编中，带有()的都是计算内存地址，然后**直接访问对应的内存**，将**数据写入到对应的内存中**或者**从对应内存中读取数据**
>
>只有lea指令，计算得到的内存地址，直接把**内存地址赋值给其他寄存器**或者内存
>
>|      | lea                            | mov（其他带有()的指令）            |
>| ---- | ------------------------------ | ---------------------------------- |
>| 相同 | 表达式计算得到内存地址         | 表达式计算得到内存地址             |
>| 不同 | 把内存**地址赋值给其他寄存器** | 把**对应内存地址中的数据**读取出来 |
>
><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210525002844.png" alt="image-20210525002836956" style="zoom:80%;" />
>
>
>
>ABI
>
>callee-saved register
>
>callee，被调用者函数体开始执行之前，会将可能用到的寄存器入栈，避免寄存器被数据覆盖，函数结束前，再恢复寄存器，之后函数ret



# lecture 08 汇编级别的数据表示



# lecture 09 linux内存布局





>
>
>缓冲区溢出攻击
>
>比如通过gets()函数，输入超出buffer的字符串，从而覆盖了跳转地址，从而执行hacker的代码



三种保护策略
1 栈随机化（每次运行程序的时候，在stack top的位置随机偏移，从而使得 local变量的位置是随机的，heap的位置也是随机的。text data仍然是固定的
2 将栈标记为不可执行，即使stack中被注入代码，也会被标记为不可执行
3 canary（canary是数据，位置紧邻输入缓冲区之后，原理是对比输入前后canary的数据是否发生变化，从而检测缓冲区是否溢出）

三种策略都可以保护，只不过前两种策略可以被攻克

>
>
>栈随机化（顾名思义，每次执行同一个程序，栈的位置并不固定）
>
>地址空间布局随机化
>address space layout randomization
>
>
>
>栈随机化，标记为不可执行，采用canary。这三种保护方式都可以通过GCC默认产生，当然也可以显式声明，不采用保护方案。
>
>如果没有任何保护缓冲区的方案，那么直接缓冲区攻击即可。
>
>如果采用了前两种保护方案，那么就需要 **面向返回编程** 来进行攻击，攻克栈随机化和栈不可执行
>
>gadgets到底是如何执行的？





# lecture 10 program optimization



>
>
>optimize your code, to make it compiler-friendly,  to make it run faster
>通用的优化方式，使得src代码对编译器更友好，编译得到的可执行文件运行更快



别名检测

>
>
>例子，数组b[i]=二维数组第i行的求和
>问题，编译器会假设函数的a* b*有可能指向同一个内存，也就是，有可能发生 **多个指针指向同一个内存**，这种情况下，编译器为了得到正确执行结果，必须从内存读取数据，累加之后存入内存，不断重复
>
>问题在于，内循环中，不断读内存，写内存，是不必要的
>
>优化，内循环**引入一个局部变量，**这样可以告诉编译器，不用进行别名检查，从而**采用寄存器进行中间结果累加**，累加之后直接存入内存，而不是在计算过程中不断写入内存。



超标量

>
>
>通过流水线并行，从而单周期执行多条指令
>
>一组**寄存器可以看做是可读可写的一段内存**
>
>
>
>循环展开

浮点寄存器 + SIMD 运算（向量运算）

>
>
>利用浮点寄存器的向量指令进行运算
>
>像这样的优化，优化后的程序只能适用于某一类机器上。不同的机器上，需要编译器的优化选项



branch prediction & register renaming

>
>
>keep track of all registers
>在分支预测进行的过程中，不断备份寄存器，以便在分支预测失败的时候进行回退，得到正确的寄存器结果



条件传送和条件分支的区别（书P145）

>
>
>条件传送可以在流水线中进行
>条件分支（也就是可能预测错误）预测错误的情况下会执行大量无用功，并且需要返回重新执行



# lecture 11 the memory hierarchy

存储器层次结构

>
>
>overall
>
>- CPU内部
>  包括register file, ALU（寄存器和ALU非常接近，因此通过寄存器运算的时候速度很快）
>
>- CPU外部
>  内存，距离CPU很远，需要通过addr bus以及data bus访问main memory
>
>
>
>load data from memory to CPU register 
>load data from disk to CPU register
>
>
>
>RAM
>
>- DRAM 比如内存
>- SRAM 比如cache，存储1bit的价格比DRAM更贵，也更快（内部的晶体管数量比DRAM要多，因此成本高，性能好）
>
>ROM
>
>- 比如用于boot，开机之后加载OS到内存中
>
>
>
>外存（磁盘）
>磁盘系统，速度更慢
>内存相比于寄存器，速度慢了大概100倍
>磁盘相比内存，速度慢了大概1万倍
>
>因此，从磁盘读取数据的时候，CPU并不会停下来，而是说，磁盘读取数据到内存，读取完毕之后发送中断信号，通知CPU数据读取完毕，等待发落。与此同时，CPU仍然在执行其他指令。
>如果需要从磁盘读取数据，CPU并不会因此等待，10ms，CPU可以执行上百万的指令。因此，CPU和IO并行，避免了磁盘系统减慢整个系统的速度
>
>
>
>速度比对
>
>- DRAM和SRAM（内存和cache）
>  DRAM速度比SRAM慢了250倍
>- 磁盘和内存比对
>  由于磁盘需要旋转+寻道，机械性质决定了磁盘比内存慢更多
>
><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210529155021.png" alt="image-20210529155021241" style="zoom:80%;" />
>
>



时间局部性和空间局部性

>
>
>见PPT
>比如，二维数组，三维数组的遍历方式不同，速度截然不同（原因在于空间局部性，将附近的数据都加载到了cache中）
>
>通过将内存中的数据加载到cache中，并且由于局部性原理
>从而可以加速数据的读取
>
>良好的局部性可以保证性能



CPU获得更多性能

>
>
>并不能一味地提高CPU时钟频率（功耗太高）
>从2003年之后的CPU，并不在CPU频率上进行更多提升，而是说，增加独立核心的数量，也就是多处理器（多线程）
>未来的趋势，时钟频率基本稳定下来

# lecture 12 cache memories



>
>
>cache memories 
>实际上就是SRAM，由硬件来管理，位于CPU芯片内部，紧邻register file，用来存储内存中频繁被访问的数据（局部性保证了cache的高命中率，只需要几个时钟周期即可读取cache数据）
>
>关键在于，硬件逻辑如何查找cache中的数据块？如何判断cache是否包含想要的内存块的数据？
>1 查找逻辑
>2 写入逻辑



cache直接映射
2-way set associative cache simulation（二路组相连cache）

>
>
>cache具体细节以及映射方式，这段视频略过...



how about write?

>
>
>写入逻辑，略过...



cache performance metrics

>
>
>cache性能评价
>
>- 失效率 miss rate
>- hit time
>- 未命中惩罚
>
>





memory mountain

>
>
>该怎么理解？
>
>x轴代表stride步长，步长越大，空间局部性越容易失效
>y轴代表整个数组的size，也就是working set size（数组比较小，在32K以下的时候，会把整个数组存入L1 cache；32K到256K之间，存入L2 cache；不超过4M，存入L3 cache；更大的数组，只能直接从内存读取，此时cache完全无法发挥作用）（数据量越大，时间局部性越容易失效，数据多->未来访问特定的数据的频率就降低）
>
>启发
>数据量比较小的时候，32K以下，可以全部存入L1cache，这个时候stride随便折腾，数据读取速度基本不变
>大于L1 cache的数据量，都需要到L2 cache中，这个时候需要用到空间局部性，尽量保证小步长。大步长会降低数据吞吐率。
>更大的数据量，也是要尽量发挥空间局部性，尽量小步长。
>
>___
>
>局部性
>时间局部性：访问同一个地址空间的时间越短局部性越好。
>空间局部性：连续访问的地址越近局部性越好。
>一般而已，我们需要更多的关注空间局部性，这个对程序员来讲比较重要，尽量让程序访问连续的地址空间或距离最近的地址空间。
>另外缓存的命中率对程序性能影响很大，某些时候需具体分析对于某个数据结构的定义是否会导致命中率下降，从而影响性能下降，这块内容虽然大致理解，但实际应用还不是很清楚，待继续深入研究。
>
>存储器山
>说白了，就是注意两点，空间局部性--尽量使用小步长；时间局部性--**数据量尽量小，至少控制在L1cache或L2cache大小内**。
>
>
>
>[简书上挺详细的](https://www.jianshu.com/p/88c889e4fef3)
>
>___
>
>[参考csdn](https://blog.csdn.net/Niya0515/article/details/109865359)
>
>（1）本地存储器山
>保持步长为常数4，取出一个片段来观察高速缓存大小和时间局部性对性能的影响，本地配置L1缓存没有直接显示，但是根据实验结果可知，大小最大为32KB情况的吞吐量为20MB/s左右，上升到64KB时明显下降，由此可知32KB的工作集完全能放进L1缓存中，即其容量。对照缓存容量配置，理论上，大小最大为256KB的工作集完全能放进统一的L2高速缓存中，最大为4MB的工作集完全能放进统一的L3高速缓存中，具体分析后面会继续展开。
>
>本地存储器山与Core i7山的最大区别是：
>Core i7山是在高速缓存区域最左边的边缘上读吞吐量才出现下降，并且保持步长不变时，读吞吐量随着数据规模的上升保持下降的趋势。
>而本地存储器山出现很多条沟壑，步长为1时，数据规模为64k、256k、1024k的读吞吐量出现了明显的下陷，导致很多山峰的出现，64k出现下降很容易想明白是由于用到了L2高速缓存；在步长为2、3时，256k～2m的读吞吐量基本保持不变，说明在实际运行情况下，256k的工作集并不能刚好放进统一的L2高速缓存中；而1024k的下降并不完全清楚原因，也只有出现在步长为1时，可能由于程序运行过程中的某些特殊原因造成。
>
>同样，保持工作集大小为常数16k或32k，观察空间局部性对性能的影响，随着步长的上升，读吞吐量并非随之下降，出现了小幅度的起伏（云主机山也有类似情况出现），但是读吞吐量都保持在20MB/s以上，说明这时候的空间局部性对性能的影响较小，而分析原因可能是其他进程也在运行，用到了L1高速缓存，而此时工作集又完全在L1高速缓存中，所以容易受到影响，出现波动（云主机上有其他用户在某个时间点共享处理器）。除此之外，其他工作集由于需要用到除L1之外的存储器层，读吞吐量都保持了平稳的下降。
>
>（2）云主机山
>保持步长为常数，当数据规模从1024k上升到2m的时候，读吞吐量（时间局部性）骤降，虽然由于主机配置是保密的，被拒绝查看，不能得到确切云主机的存储配置，我们可以容易猜测出是由于需要访问主存所致，而且可以得出主存和高速缓存层的访问速度差距较大，即使空间局部性较好也无法补救。而高速缓存各层的访问速度差异不明显。所以在云主机上，根据实验结果，时间局部性比空间局部性更重要。
>此外，依据时间局部性山脊，我们观察出大小最大为64KB的工作集完全能放进统一的L1高速缓存中，最大为256KB的工作集完全能放进统一的L2高速缓存中。
>
>保持工作集大小不变，和Core i7山类似的是，它有平坦的山脊线，例如，对于步长1垂直于步长轴，读吞吐量为28GB/s，说明云主机的系统中也采用硬件预取机制，试图在一些块被访问之前，将它们取到高速缓存中；与Core i7山又有所区别的是，它出现了很多条这样的山脊线，说明云主机系统中的该机制对多个步长都适用。
>————————————————
>



>
>
>一个简单的矩阵乘法，三种不同的迭代方式，每种方式的单次循环的时钟周期差别很大，100倍=>**整体性能差距100倍！！！**
>
>**cache失效率分析**
>
>简单说一下怎么计算的每次迭代的失效率
>
>假设cache size=4，容纳4个数据，矩阵的size也是4*4
>以ijk方式遍历
>
>```
>内层循环中，a[i][k]，每4次之后，cache失效，需要进行1次内存访问
>			b[k][j] 每次都会cache失效，每次都是访问内存
>			=>内层循环，a平均失效1/4次，b平均失效1次
>			=>内层循环，总体失效1.25次，也就是需要访问1.25次内存
>```
>
>
>
><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210529175017.png" alt="image-20210529175017741" style="zoom:80%;" />





# lecture 13 linking

链接的时候，只会把用到的函数链接到最终可执行文件

>
>
>源代码->编译器编译，得到汇编语言->汇编器处理汇编语言，生成目标代码->linker将目标代码进行link，得到可执行文件
>
>编译器compiler，进行源代码的符号识别，语法解析，最终生成汇编语言（高级语言，也就是源代码是可移植的）
>
>汇编器assember，将汇编语言生成目标代码 object code（也就是二进制代码）（汇编器生成的目标代码，在机器之间不可移植）
>
>linker，将目标代码进行link，生成可执行代码

static link

>
>
>可执行文件包含了实际用到的库代码

dynamic link

>
>
>可执行文件中不包含库代码
>每次执行可执行文件，会在进程中共享对应的库代码

linker的功能

>
>
>1 符号解析 symbol resolution
>同一个符号在多个文件中，可能会定义多次
>汇编语言的符号定义，存储在符号表中，包含了每个符号的信息，比如name, location, size（也就是变量的名称，变量所在的位置，变量占用的内存大小）
>
>linker会进行符号识别，将目标代码中的符号（比如变量名）替换成具体的引用
>
>2 relocation重定位
>
>简单来说，将偏移地址替换成内存的绝对地址
>
>将多个文件的code section和data section进行合并
>在重定向之前，目标代码中的函数地址，变量地址，数据地址，仅仅是偏移地址
>找出每个变量的具体内存地址，然后逐一更新
>update symbols from their relative locations in the .o files to their final absolute memory locations in the executable.

3种object files

>
>
>PDF P10
>
>也就是说，.o 目标文件和.out可执行文件，对于单模块而言，.o中的内存地址是偏移地址，.out文件中的内存地址是绝对内存地址（二者不同之处主要就是内存地址 相对or绝对）





executable and linkable format (ELF)

>
>
>可执行文件，.so文件，.o文件的统一格式
>
>注意P12的 
>
>.segment header table（存储了下面各个section的内存地址）
>.text secion （code）
>.rodata section（各种const数据 switch语句中的jump table） 
>.data section（已经初始化了的global变量 ）
>.bss section（未初始化的global变量）
>.symtab section（符号表，存储了比如全局函数的位置，global变量，static变量）
>
>local symbol，不是说局部变量，而是说static 声明的变量，都是local symbol；static声明的变量会被Linker当做local symbol（局部变量存在于stack，被compiler管理，linker不认识局部变量）`Local linker symbols are not local program variables`
>
>local symbol见PDF P16

尽量避免global var，因为在多文件link中，如果存在多个定义，很可能导致bug，一个文件中的global var可能被替换成其他文件中定义的global var



static library



dynmic library



...



# lecture 14 exceptions and processes

异常

>
>
>异常，实际上是将low level的控制权转移给操作系统内核



内核

>
>
>内核是操作系统的内存驻留部分
>操作系统提供各种程序，比如列出文件，更改目录，列出当前进程。所有这些程序构成操作系统。
>
>内核是操作系统中始终驻留在内存中的一部分
>
>内核的作用是提供API给应用程序

缺页

>
>
>访问数组的时候，可能某个下标对应的数据并不在内存中，而需要从磁盘加载到内存中
>然后重新执行缺页前的指令，正常工作
>
>这就是所谓的页缺失
>由于这个地址的内存不可用，会触发页缺失



虚拟化

>
>
>对于所有的程序而言，**看起来**是程序**单独占用了CPU和寄存器**，并且**单独占用了内存空间**（**实际上并不是**）
>
>操作系统提供的虚拟化，让每个运行的程序都有自己的代码 数据 堆栈，可以拥有所有的内存以及处理器的独占访问权限



上下文切换

>
>
>地址空间和寄存器值，就是上下文
>上下文切换就是地址空间和寄存器的变化
>
>如果没有足够的核心来同时运行进程，那么就会上下文切换
>
>每个进程代表一个逻辑控制流



fork

>
>
>父进程一直运行，子进程早已运行完毕=>子进程处于僵尸defunc，占用内核资源
>kill父进程，那么子进程成为孤儿进程，被1#进程回收
>
>子进程一直运行，父进程早已运行完毕=>子进程是孤儿进程，kill子进程之后，子进程的占用的内核资源被回收

wait waitpid

>
>
>synchronize with child process(or specific child process)



execv

>
>
>与fork结合，fork出来的子进程执行某个脚本之类的
>（实际上会覆盖掉子进程虚拟地址空间，子进程的栈空间会变化）

# lecture 15 signals and nonlocal jumps



how to send signal to process?
1 with kill program, impl by /bin/kill 
2 from keyboard(ctrl-c: send SIGINT, terminate a process; ctrl-z : send SIGSTP, suspend/stop a process)
3 with kill function



process default actions to signal
1 terminate
2 suspend util SIGCONT signal
3 ignores the signal



信号接收的详细机制（pending & ~blocked)
PPT P40



specific signal handler
1 handler (SIG_IGN) : just ignore
2 SIG_DFL : recover to the default handler
3 otherwise, handler is user-level



signal handler can be nested（信号处理函数，可被其他信号处理函数中断）



blocking / unblocking signals
设置block signal之后，进程可以不被设定的信号中断
(bitwise，对于特定的signal, pnb = pending & ~blocked，也就是说，只有当信号没有被屏蔽的时候才能接收到)



guidelines for writing safe handlers



信号安全的函数（**执行这些函数的时候不会被信号中断**，避免可能发生死锁）
考虑死锁情况：main中运行loop，执行printf进行打印（printf不会屏蔽信号，printf持有lock）接收到信号之后，handler中也有printf，那么handler就会阻塞，永远不会返回到main routine中，导致死锁



为什么说直接在SIGCHILD handler中，直接对子进程进行计数不正确？
为什么把wait system-call**放到循环中可以正确计数**？不用循环则不正确？

>
>
>父进程接收到SIGCHILD，表明至少有一个子进程已经结束。
>wait()函数返回非负，代表成功回收一个子进程。一个SIGCHILD可能有多个子进程结束，因此需要调用wait多次，每次成功调用，就计数器++。因此能够成功计数所有的子进程

```cpp
// 对子进程进行计数
// 错误
void child_handler(int sig)
{
    int olderrno = errno;
    pid_t pid;
    if ((pid = wait(NULL)) < 0)
        Sio_error("wait error");
    ccount--;
    Sio_puts("Handler reaped child ");
    Sio_putl((long)pid);
    Sio_puts(" \n");
    sleep(1);
    errno = olderrno;
}

// 对子进程进行计数
// 正确
void child_handler2(int sig)
{
    int olderrno = errno;
    pid_t pid;
    while ((pid = wait(NULL)) > 0) {
	ccount--;
        Sio_puts("Handler reaped child ");
        Sio_putl((long)pid);
        Sio_puts(" \n");
    }
    if (errno != ECHILD)
        Sio_error("wait error");
    errno = olderrno;
}
```





信号并发问题

`procmask1`逻辑描述
main routine向队列中添加任务，添加前后屏蔽信号
SIGCHILD handler从队列中删除任务，删除前后屏蔽信号

为什么要屏蔽信号？并发安全
比如main routine中，添加到队列前后，屏蔽了SIGCHILD信号。如果不屏蔽，可能出现任务先删除，再添加。
屏蔽之后，添加

```cpp
        Sigprocmask(SIG_BLOCK, &mask_all, &prev_all); /* Parent process */  
        addjob(pid);  /* Add the child to the job list */
        Sigprocmask(SIG_SETMASK, &prev_all, NULL);  
```



**procmask1中存在的问题**
子进程可能比parent进程更早执行完毕，从而，**父进程还没有添加子进程到队列中，子进程就已经退出**。~~父进程永远不会收到子进程的SIGCHILD信号~~。子进程结束之后，父进程在addjob之前，收到了SIGCHILD信号=>先删除，再添加，从而任务在队列中永远不会被删除。

**分析**
任务队列中任务不会被删除的原因在于，某个任务，**先删除，再添加**



**解决**
我们并不要求父进程先执行，子进程再执行。
而是说，fork前后，先屏蔽掉SIGCHILD信号（即使子进程先退出，仍然会发送SIGCHILD信号给父进程，只不过pnb = pending &~ block，当我们将任务添加到队列中之后，我们才解除SIGCHILD的屏蔽，这个时候，**即使子进程先退出，我们也能保证，先执行add再执行delete**）

```cpp
    while (n--) {
        Sigprocmask(SIG_BLOCK, &mask_one, &prev_one); /* Block SIGCHLD 先屏蔽SIGCHILD，即使子进程退出，也不会执行delete任务 */
        if ((pid = Fork()) == 0) { /* Child process */
            Sigprocmask(SIG_SETMASK, &prev_one, NULL); /* Unblock SIGCHLD */
            Execve("/bin/date", argv, NULL);
        }
        Sigprocmask(SIG_BLOCK, &mask_all, NULL); /* Parent process */  
        addjob(pid);  /* Add the child to the job list */
        Sigprocmask(SIG_SETMASK, &prev_one, NULL);  /* Unblock SIGCHLD 添加任务之后，解除屏蔽SIGCHILD */
    }
```





```cpp
// 存在问题的procmask1
/* $begin procmask1 */
/* WARNING: This code is buggy! */
void handler(int sig)
{
    int olderrno = errno;
    sigset_t mask_all, prev_all;
    pid_t pid;

    Sigfillset(&mask_all);
    while ((pid = waitpid(-1, NULL, 0)) > 0) { /* Reap a zombie child */
        Sigprocmask(SIG_BLOCK, &mask_all, &prev_all);
        deletejob(pid); /* Delete the child from the job list */
        Sigprocmask(SIG_SETMASK, &prev_all, NULL);
    }
    if (errno != ECHILD)
        Sio_error("waitpid error");
    errno = olderrno;
}

#define N 5
int main(int argc, char **argv)
{
    int pid;
    sigset_t mask_all, prev_all;
    int n = N;

    Sigfillset(&mask_all);
    Signal(SIGCHLD, handler);
    initjobs(); /* Initialize the job list */

    while (n--) {
        if ((pid = Fork()) == 0) { /* Child process */
            Execve("/bin/date", argv, NULL);
        }
        Sigprocmask(SIG_BLOCK, &mask_all, &prev_all); /* Parent process */  
        addjob(pid);  /* Add the child to the job list */
        Sigprocmask(SIG_SETMASK, &prev_all, NULL);    
    }
    exit(0);
}
/* $end procmask1 */

```



<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210613184525.png" alt="image-20210613184517928" style="zoom:80%;" />

P61页，描述，父进程fork子进程，等待子进程运行结束，不允许在main routine中使用wait，只能在signal handler中等待子进程。只会fork1个子进程，子进程fork之后会结束。

问题，如何有效的在父进程等待子进程运行的结束？

采用pause()的原本意图：

>
>
>正常情况下：
>执行pause()，等待child退出之后，pause()结束，执行handler，修改pid，从而父进程打破循环，结束等待
>
>可能存在的race：
>父进程pid仍然=0，在进行pause()之前，接收到了SIGCHILD，执行handler，然后改变pid，然后handler执行完毕，执行pause()。但是由于只有一个子进程， 只会收到一次信号。因此会一直停在pause()中



正确的方案

>
>
>使用sigsuspend
>
>为什么正确？
>即使pause()由于其他信号的handler被打断，handler处理完毕之后，pid仍然=0，仍然会回到循环
>
>每次循环体开始执行前，想要处理的信号都是被屏蔽的，**不会发生**pid检查成功，然后handler修改pid，然后pause()，信号已经处理过，不会再接收到新的信号
>**会发生什么？**
>pid检查成功，信号被屏蔽，**信号解除屏蔽，等待pause()(suspend这两个语句是原子的，因此不会发生进入pause之前被SIGCHILD的handler调用这种情况)**，信号屏蔽=>下次循环
>pause()期间，可能是SIGCHILD的handler，这样下次循环就可以结束
>可能是其他信号的handler，这样下次仍然会继续循环

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210613185358.png" alt="image-20210613185358017" style="zoom: 67%;" />

```cpp
int main(int argc, char **argv) 
{
    sigset_t mask, prev;
    int n = N; /* 10 */
    Signal(SIGCHLD, sigchld_handler);
    Signal(SIGINT, sigint_handler);
    Sigemptyset(&mask);
    Sigaddset(&mask, SIGCHLD);

    while (n--) {
        Sigprocmask(SIG_BLOCK, &mask, &prev); /* Block SIGCHLD */
        if (Fork() == 0) /* Child */
            exit(0);

        /* Wait for SIGCHLD to be received */
        pid = 0;
        while (!pid) 
            Sigsuspend(&prev);

        /* Optionally unblock SIGCHLD */
        Sigprocmask(SIG_SETMASK, &prev, NULL); 

        /* Do some work after receiving SIGCHLD */
        printf(".");
    }
    printf("\n");
    exit(0);
}
```



# lecture 16 system level IO

buffered IO

>最大的优点，可以**避免频繁调用system call**
>比如读取一个大文件，如果不采用buffed IO，可能就需要多次调用read（read本身是个system call，因此造成的系统调用开销很大）
>但是采用buffered IO，就不需要频繁的system call，只需要一次，然后kernel将大量数据存储到指定的buffer中，之后再次调用 buffered_IO()函数时，由于缓冲区中还有数据没有读取完毕，因此不会进行系统调用，而是直接从buffer中读取数据

下面这个demo，调用6次printf，打印hello，实际上进行了**1次**系统调用，说明**printf也是bufferd IO**，因此buffered IO通常都会更有效率（减少了system call的次数）

linux下如何观察某个可执行文件的系统调用情况？

```bash
strace -e trace=write ./可执行文件名
# 比如
strace -e trace=write,read ./cpfile # 观察./cpfile这个文件中进行write和read的系统调用的次数
```



<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210601195719.png" alt="image-20210601195712813" style="zoom:80%;" />



dup

>
>
>dup最常见的用途，IO重定向



文件IO需要特别注意的点

>
>
>对于普通的文本文件，可以采用std IO（这些 IO实际上都是基于行的IO操作）
>什么叫基于行的IO？实际上就是把回车换行符当做interrupt，遇到这些字符的时候会停止读入
>
>同样的，strlen strcpy这些函数也会在遇到`\0`的时候停止操作
>
>而对于其他格式的文件，比如二进制文件或者jpeg图片，这些文件中完全有可能存在回车换行符或者`\0`，不能采用基于行的IO函数对这些文件进行操作

# lecture 17 virtual memory concepts







# lecture 18 virtual memory systems





# lecture 19 dynamic memeory allocation

Explicit allocator: like c, cpp

Implicit acllocator: like java, python



how to impl malloc and free:

malloc一旦把内存分配给了应用程序，那么分配出去的内存就属于这个应用程序，malloc不能再使用这个内存



写一个分配qps高，但是内存使用率低的malloc -> easy

分配吞吐率高，内存使用率高->hard



## 内部碎片

internal fragmentation

现象：block的实际大小比payload要大
原因：
1 block中需要用header footer来维护
2 block内存对齐

feature:
内部随便造成的内存浪费很容易评估



## 外部碎片

external fragmentation

现象：当空闲heap内存合计起来足够满足一个分配请求，但是没有一个单独的空闲块足够大可以来处理这个请求时发生的
原因：外部碎片导致的内存浪费，完全取决于未来的request的顺序



## 如何得知要free的空间多大

`free(p)`

`block{size of payload, unused bit, payload, padding, (footer: size of payload, unused bit)}`

p指向payload的地址
header记录整个block的大小
footer用于内存对齐（padding for alignment）



## 如何记录free blocks

1 隐式链表：把所有的block连起来，不管是否unused（header记录{当前block的length，当前block是否被使用}）
2 显式链表：用pointer连接起来free block（每个block需要额外的空间记录pointer）
3 分类链表：不同size的block，各自一个free list



## 隐式freelist

### find a free block 分配策略



#### first fit

> how:从开始扫freelist，找到满足大小的block就返回
>
> cons:
> 1 平均扫描时间O(n)
> 2 导致beginning of list 存在外部碎片



#### next fit

> 相比first fit，加速了扫描



#### best fit

> how:
> 扫描整个list，选择满足size的最小block返回
>
> pros:
> 提高了heap内存利用率
>
> cons:
> 1 运行速度比first fit更慢，绝对意义上的O(n)
> 2 导致外部碎片





### alloca a block

> 1 找到合适大小的block
> 2 split成两个block，返回





### free a block

> 1 清除对应block的bit位
> 2 考虑**合并**紧邻block的前后block
>
> 如果相邻的block都是free block，IXUS合并
> 如果不合并，导致问题：外部碎片



只用header信息记录当前block的size，合并block的时候只能合并后面的block，不能合并前面的block

关键在于如何得知前面紧邻的block的size？

> block中，在footer记录当前block的size，以及unused bit
> 从而合并前面block





### 隐式freelist的优劣和改进

> pros:
> 简单
>
> cons:
> 1 分配速度慢，O(n)时间查找，搜索所有block（包括in-used block和unused block）
> 2 header和footer带来的内部碎片
>
> 改进:
> header用2个bit，分别记录前一个block的used，以及当前block的used情况（详见PPT）





## 总结



mem allocator的关键策略

> 如何找free block？
> 首次匹配，最佳匹配，下次匹配
> 三者，要么搜索速度慢，要么带来内部碎片
> 更优方案：不同size的freelist，一方面速度O(1)，一方面不会导致内部碎片
>
> 什么情况下找到一个free block之后还需要分裂block？
> 找到合适大小的block之后，size向上取整16字节，如果block仍然有剩余空间就需要分裂
>
> 如何合并block？



![image-20220101165045224](https://yszhou.oss-cn-beijing.aliyuncs.com/img/image-20220101165045224.png)







# lecture 20 dynamic memory allocation



Mem related perils

- Allocating the (possibly) wrong sized object，这个例子，32bit可以正常工作；64位的话，int*的size是8Byte，因此存在可移植问题
- Misunderstanding pointer arithmetic（实际上等价于p+=4，相当于4次p++）



## ==TODO== 显式free list

>    隐式空闲列表提供了一些基本的分配器概念的方法。然而，因为块分配与堆块的总数呈线性关系，所以对于通用的分配器，隐式空闲列表是不合适（尽管对于堆块数量预先就知道是很小的特殊的分配器来说它是可以的）。
>
>    一种更好的方法是将空闲块组织为某种形式的显式数据结构，因为根据定义，程序不需要一个空闲块的主体，所以实现这个数据结构的指针可以存放在这些空闲块的主体里面，例如，堆可以组织成一个双向空闲列表，在每个空闲块中，都包含一个pred（前驱）和succ(后继)指针，
>
>    使用双向列表而不是隐式空闲列表（逻辑抽象上的列表），使首次适配的分配时间从块的总数的线性时间减少到了空闲块数量的线性时间，不过，释放一个块的时间可以是线性的，也可能是个常数，这取决于我们所选择的空闲列表中块的排序策略：
>
>    一种方法是用后进先出（LIFO）的顺序维护列表，将新释放的块放置在列表的开始处，。使用LIFO的顺序和首次适配的放置策略，分配器就会最先检测最近使用过的块，在这种情况下，释放一个块可以在常数时间内完成，如果使用是边界标志，那么合并也可以在常数时间内完成。
>
>    另一种方法是按照地址顺序来维护列表，其中列表中每个块的地址都小于他后继的地址，在这种情况下，释放一个块需要线性时间的搜索来定位合适的前缀。平衡点在于，按照地址排序的首次适配比LIFO排序的首次适配有更高的存储器的利用率，接近最佳适配的利用率。
>
>  
>
> 小结： 显式列表的缺点是空闲块必须足够大，以包含所有需要的指针，以及头部和可能的尾部（用边界标志来进行常数时间内合并的就得需要），这就导致了更大的最小块的大小（32位4bytes指针），也潜在的提高了内部碎片的程度；
>
> https://www.cnblogs.com/onlysun/p/4529661.html
>
> cons
> header和footer以及指针，导致block的内部碎片更大





## 简单分离存储

> 概念
> 类似于下面的seglist
>
> 不同在于
> 分配时，在对应的链表找到，则直接返回，==不再分割==
> 释放时，直接放到对应的链表头部，==不再合并==
>
> pros
> 分配、释放更快
>
> cons
> 分配带来的内部碎片更多（由于分配的时候没有切割）
> 释放带来的外部碎片更多（由于释放的时候没有合并）



## segregated free list

> basic idea
> 维护多个链表
>
> 不同的链表大致范围不同，每个==链表内部的block大小大致相等==
> 比如1，2，3~4，5~8，9~16这样
>
> malloc分配
> 1 先找合适大小的链表
> 2 找到合适的block，分割，返回，并将小的block放到对应的链表中
> 3 如果当前链表找不到，则到更大的链表中找
> 4 如果所有链表都找不到，就sbrk申请额外的内存空间
>
> free释放
> 1 **找到前后相邻的free block，合并（这个相邻，是指地址的相邻，根据block的meta信息直接计算出来前后block的地址，进行合并）**
> 2 放到对应的链表中
>
> 例子
> 分配17，在32中找
> 找到32，切割出来17，留下15（17和15的地址是连续的）
>
> 释放17
> 根据17的meta信息，计算出来前后两个Block，发现15这个block是free的，直接取出，合并，再放回32中
>
> pros
> 由于搜索被限制在堆的某个部分而不是整个堆，所以搜索时间减少了。内存利用率也得到了改善，避免大量内部碎片和外部碎片(https://imageslr.com/2020/malloc.html)
>
> 



## buddy system

每个freelist的block==大小相同，且都是2的幂==，比如1 2 4 8 16 32 64

> init
> 最初，全局只有一个free block，大小2^m，也就是堆的大小
>
> malloc分配
> 分配
> 1 找对应的 freelist：对size进行==取整2的幂==（返回给用户的一定是2的幂），找对应的freelist
> 2 如果对应的链表找到，就直接返回（可能导致内部碎片）
> 3 如果对应链表刚好没有，就到更大的链表去找，找到之后，递归分割，每次分割成分块，直到返回2^m，剩余的再放回到合适的链表
> 
>例子1
> 分配大小为10的block，在16中找到
> 1 size=16的block，==直接返回16给用户==
> 
>例子2
> 分配大小为16的block，16的链表为空，到32的链表中找
> 1 切割出来16，返回给用户
> 2 剩下的16大小的block，放到16的链表中
> 
>free释放
> 1 到对应的链表中找
> 2 如果地址连续，则合并，放到更大的链表中
> 3 否则，就直接放置到对应的链表中
> 
>pros
> 搜索速度快，合并快
> 
>cons
> 适用场景有限，block的大小如果不是2的幂，则会导致内部（很多小的block无法合并），不适合用作通用内存分配器





## tcmalloc

tcmalloc 是 Google 开发的内存分配器，全称 Thread-Caching Malloc，即线程缓存的 malloc，实现了高效的多线程内存管理。

tcmalloc 主要利用了池化思想来管理内存分配。对于每个线程，都有自己的私有缓存池，内部包含若干个不同大小的内存块。对于一些小容量的内存申请，可以使用线程的私有缓存；私有缓存不足或大容量内存申请时再从全局缓存中进行申请。在线程内分配时不需要加锁，因此在多线程的情况下可以大大提高分配效率。





## GC

1 引用计数
2 标记清除
3 分代收集



# lecture 21 network programming I

# lecture 22 network programming II



>
>
>这两个lecture比较重要的部分
>
>1 tiny httpserver
>2 telnet
>
>```bash
>telnet www.cs.cmu.edu 80
>GET /~bryant/test.html HTTP/1.1
>Host: www.cs.cmu.edu
># 输入之后就会回显对应的http内容
>```
>
>





# lec 23 concurrent programming



视频没看完，里面重要的地方是

迭代server，处理一个client的io，另外一个client竟然可以连接成功，并且可以write成功，只是在read的时候会阻塞？神奇，需要验证验证



# lec 24 sync basic





# lec 25 sync advanced





# lec 26 thread level parallelism



