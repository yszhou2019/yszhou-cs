# cache lab

## before lab

lab recitation

>
>
><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210529213407.png" alt="image-20210529213400753" style="zoom:80%;" />
>
>——————
>
><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210529213636.png" alt="image-20210529213636394" style="zoom:80%;" />
>
>——————
>
>...
>
>——————
>
>



## lab-notes



### part-A

>
>
>/traces文件下的若干文件，是test文件，每个文件存放若干指令
>
>L load，从内存中读取数据，cache如果有数据那么hit cache没有对应地址的数据则miss
>S store，向内存写入数据，cache如果有数据则hit 没有对应地址的数据则miss
>M modify，=load+store，先从内存中读取数据，然后更新数据（比如i++） 如果数据在cache中，那么load会hit，store也会hit（两次都在cache中进行操作）；如果数据不在cache中，那么load会miss，store必然会hit（如果cache有空闲空间，那么不会eviction替换；如果cache没有空间，那么会发生一次替换）
>
>|        |                                     |      |
>| ------ | ----------------------------------- | ---- |
>| load   | 可能hit 可能miss                    |      |
>| store  | 可能hit 可能miss                    |      |
>| modify | 可能两次hit 可能miss+hit(+eviction) |      |
>
>
>
>用getopt()读取命令行参数
>
>用-v参数，支持中间过程的打印，过程类似于csim-ref
>
>其余参数用于cache大小的变化
>
>





### part-B

暂时搁置

https://zhuanlan.zhihu.com/p/28585726