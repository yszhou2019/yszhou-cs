

phase_1

>
>
>strings_not_equal的函数调用，调用string_length函数，string_length应该是单个参数。
>
>phase_1通关的思路
>string_length函数需要一个参数，也就是字符串的地址，应该在$rdi上。
>第一次调用，求的是自己输入的字符串的长度
>第二次调用，求的是程序预设的字符串长度
>
>只需要打印内存$rbp即可
>
>```
>x /s $rbp
>```
>
>

```assembly
  40133c:	48 89 fb             	mov    %rdi,%rbx
  40133f:	48 89 f5             	mov    %rsi,%rbp
  401342:	e8 d4 ff ff ff       	callq  40131b <string_length>
  401347:	41 89 c4             	mov    %eax,%r12d                       # $eax求出自己输入字符串
  40134a:	48 89 ef             	mov    %rbp,%rdi                        # 函数调用的时候，$rdi是第一个参数，$rbp就是程序中的需要求的字符串
  40134d:	e8 c9 ff ff ff       	callq  40131b <string_length>      
```



phase_2

>
>
>读入6个局部变量，首个是1，之后的*2



phase_3

>
>
>读入两个整数，case 整数1，然后将整数2和预设的数字进行比对即可





phase_4

>
>
>读入两个参数，进行递归
>第一个参数范围有限，直接暴力尝试



phase_5

>
>
>读入size=6的字符串（用于加密），然后将str_a经过自己的字符串加密之后，如果和str_b匹配，即可通过



phase_6

>
>
>有点长
>暂时不做了
>先做后面的
>这个有空再做
>可以参考这个
>首先要把汇编翻译成可以理解的C代码，然后再下手
>https://blog.csdn.net/qq_38537503/article/details/117199006

