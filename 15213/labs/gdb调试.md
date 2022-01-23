

>
>
>反汇编
>objdump 可执行文件名 > out
>
>gdb调试
>gdb 可执行文件名 -q
>
>图形界面
>layout regs
>
>调整图形界面大小
>winheight regs +5
>
>切换窗口
>fs next
>
>打断点
>b *0x地址
>
>打断点后继续执行
>cont
>
>反汇编，反汇编当前所在函数
>disas
>
>执行一遍之后会花屏，解决办法
>ctrl+L即可恢复
>或者ctrl+X+A
>https://blog.csdn.net/cp3alai/article/details/42107461
>
>
>
>函数调用，超出6个参数，其余参数在stack上
>前6个参数
>
><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210527171225.png" alt="image-20210527171218822" style="zoom:80%;" />
>
>
>
>避免gdb每次输入参数
>set args 输入文件名
>
>如果有其他需要的参数，那么就
>set args -i 输入文件名 -q（-q这里是例子）

