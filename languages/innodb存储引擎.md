# 第一章 MySQL体系结构和存储引擎

## 1.1 定义数据库和实例

**数据库** ：物理操作系统文件或其他形式类型文件的集合

**实例** ： MySQL数据库由后台线程以及一个共享内存区组成。

Mysql数据库实例在系统上的表现就是一个进程

## 1.2 Mysql体系接口

- 连接池组件
- 管理服务和工具组件
- SQL接口组件
- 查询分析器组件
- 优化器组件
- 缓冲组件
- 插件时存储引擎
- 物理文件

## 1.3 InnoBD存储引擎

InnoDB存储引擎支持事务，其设计目标主要是面向在线事务处理OLTP，特点是行锁设计、支持外键并支持类似于Oracle的非锁定读
通过使用MVCC（多版本并发控制）实现了高并发行，并且实现了SQL标准的4中隔离级别
默认为Repeatable级别，同时适应next-key locking的策略来避免幻读

## 1.5 链接MySQL

连接MySQL操作是一个连接进程和MySQL数据库实例进行通信，从程序设计的角度来说，本质上是进程通信。

- 管道
- 命名管道
- 命名字
- TCP/IP套接字
- UNIX套接字

# 第二章 INnoDB存储引擎

## 2.1 InnoDB存储引擎概述

特点：行锁、支持MVCC、支持外键、提供一致性非锁定读，CPU和内存的使用效率高
OLTP核心表的首选引擎

## 2.3 InnoDB体系结构

Innodb存储引擎有多个内存块，组成了一个大的内存池

- 维护所有进程/线程需要访问的多个**内部数据结构**
- 对磁盘上的**数据进行缓存**，方便快速读取和写入
- 重做日志（Redo log）进行缓冲

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210415233301.png" alt="image.png" style="zoom:80%;" />



### 2.3.1 后台线程

INNODB是多线程模型

作用：
1 刷新内存池（一方面，保证缓存冲中的缓存是最新的数据，另一方面，将内存页刷到磁盘文件中）
2 数据库异常的时候，可以进行恢复



#### 1 Master Thread

**核心线程**

主要负责：
缓冲池中的数据异步刷回磁盘，从而保证数据一致性（也就是**脏页的刷新**）
将insert buffer进行合并
回收undo 页

#### 2 IO Thread

进行磁盘文件的异步IO

#### 3 Purge Thread

Purge Thread 来回收已经使用并分配的undo页

#### 4 Page Cleaner Thread

**刷脏页操作单独放入到一个线程中来完成**，减轻Master Thread 的工作，降低用户查询线程的阻塞



### 2.3.2 内存

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210411225524.png" alt="image.png"  />

#### 1 缓冲池（innodb_buffer_pool）

对磁盘的数据页进行缓存，从而加速IO；
对于数据库中页的修改，先修改在缓冲池中的页，然后以一定的频率刷脏页。刷脏页的频率不是每次写操作都触发，而是按照CheckPoint的机制刷脏页，从而提高整体性能。

buffer_pool中，**大部分保存的是 索引页，数据页**。还有undo 页，insert buffer，lock information等

![image.png](https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210411225538.png)



#### 2 LRU list /Free List / FLush List

缓冲池采用LRU进行管理（不是传统的LRU，而是添加到中间，**避免了扫描操作导致的大量LRU热点数据失效**。原因：扫描这种操作，会读取了多页，会导致大量LRU热点数据失效，放到中间的话，就不会导致全部失效）
缓冲池中的页，默认大小16KB

**Flush list中的页就是脏页**（脏页在LRU和Flush list中都存在）

LRU list 用来管理缓冲池中页的可用性
FLush list 用来管理将页刷新回磁盘



#### 3 重做日志缓冲

先写到redo log buffer中，然后按照一定策略和频率刷到redo log 文件中。

- Master Thread 每秒会将重做日志缓冲刷新到重做日志文件
- 每个事务提交时会将重做日志缓冲刷新到重做日志文件中
- 重做日志缓冲池剩余1/2时，重做日志缓冲会刷新到日志文件中

#### 

## 2.4 Checkpoint

**数据丢失问题**：
刷脏页的时候宕机，重启之后内存中的数据已经丢失了，数据不能恢复了

解决：
采用了 Write Ahead Log策略，即当事务提交时，**先写重做日志，再修改内存页**（然后按照频率刷脏页）。
**即使发生宕机，也可以通过重做日志来完成数据恢复**
这就是事务ACID要求中的D，持久性



问题：
redo log不能无限大，而且如果redo log很长，宕机之后恢复起来需要的时间很长

解决：
checkpoint技术（检查点），宕机之后**只需要对redo log中checkpoint之后的操作进行redo，就能够恢复数据库**
**redo log**不是无限大的，**需要循环使用**

**checkpoint技术，实际上是刷脏页的策略**，按照某种策略刷脏页，刷过的脏页就在checkpoint之前了，因此就不需要恢复了

CheckPoint技术的目的：

- 缩短数据库的恢复时间
- 缓冲池不够用时，将脏页刷新到磁盘
- 重做日志不可用时，刷新脏页

```
Sharp Checkpoint 发生在数据库关闭时，将所有的脏页都刷新回磁盘，默认的工作方式 innodb_fast_shutdown=1
Fuzzy Checkpoint 即只刷新一部分脏页，而不是刷新所有的脏页
```



## 2.5 Master Thread工作方式

InnoDB存储引擎的主要工作都是在一个单独的后台线程Master Thread
具有最高的线程优先级，其内部由多个循环组成

（刷脏页，合并insert buffer，刷日志buffer，删除无用的undo页）



## 2.6 InnoDB关键特性

- 插入缓冲
- 两次写
- 自适应哈希索引
- 异步I/O
- 刷新邻接页



### 2.6.1 Insert Buffer

[参考自](https://www.cnblogs.com/chenpingzhao/p/4883884.html)


Insert buffer 的使用需要同时满足以下条件

- 索引是辅助索引
- 索引不是唯一的

原因：
如果辅助索引要求唯一，那么添加新数据的时候，就需要检查辅助索引是否唯一，就需要首先读取索引页进行检查，造成了额外IO开销

原理：
比如添加数据的时候，辅助索引的值也会随之增加
对于为非唯一索引，辅助索引的修改操作并非实时更新索引的叶子页，而是把**若干对同一页面的更新缓存起来做，合并为一次性更新操作**，**减少IO，转随机IO为顺序IO,这样可以避免随机IO带来性能损耗**，提高数据库的写性能



### 2.6.2 两次写 double write

insert buffer提升innodb性能
double write技术，提升数据页的可靠性

![image.png](https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210411225555.png)

之前的问题：
刷脏页的时候宕机
解决：
通过redo log，先写到redo log中，然后再刷脏页

新问题：
**redo log受损**，无法读取redo log进行恢复

解决：
double write技术，即redo log如果受损，那么首**先恢复redo log，然后再重做**。
（先从共享表空间中的doublewrite中找到该redo log页的一个副本，将其复制到表空间文件，在应用重做日志）



```
doublewrite由两部分组成，一部分时内存中的 doublewrite buffer ，大小为2MB，另一部分时物理磁盘空间上的连续128个页，即2个区。大小同为2MB
对缓冲池的脏页进行刷新时，并不直接写到磁盘上，而时会通过memcpy函数将脏页先复制到内存中的doublewrite buffer，之后通过doublewrite buffer再分两次，每次1MB的顺序写入共享表空间的物理磁盘上，然后马上调用fsync函数，同步磁盘。
```



### 2.6.3 自适应哈希

实际上就是哈希索引，O(1)时间可以完成等值查询，不适用于范围查询
InnoDb根据访问频率和模式来**自动为某些热点页建立哈希索引**。



### 2.6.4 异步IO

异步IO来完成刷脏页操作



### 2.6.4 刷新邻接页

刷脏页的时候，顺便检查相邻的页是否脏页，如果脏页，都刷到磁盘上

# ~~第三章 文件（暂时跳过，未来有需要再看）~~

## 3.1 参数文件

## 3.2 日志文件

- 错误日志
- 二进制日志
- 慢查询日志
- 查询日志

## 3.2.1 错误日志

```
show variables like 'log_error'
```

### 3.2.2 慢查询日志

long_query_time 设置慢查询阈值

```
可以通过 long_query_time 设置慢查询时间
SHOW VARIABLES LIKE 'long_query_time'\G
```

### 3.2.3 查询日志

### 3.2.4 二进制日志

binlog
记录了对mysql数据库执行的所有更新操作 -----------databus 监听 binlog

二进制日志主要的作用是：

- 恢复
- 复制
- 审计

二进制日志配置相关参数

- max_binlog_size
- binlog_cache_size
- sync_binlog
- binlog_do_db
- binlog_ignore_db
- log_slave-update
- binlog_format

sync_binlog : 控制写入到磁盘的频率

- 0 ： sync_binlog 默认位0，表
- 1 ： 表示采用同步方写磁盘的方式来写二进制日志，不使用缓冲来写二进制日志

即使将sync_binlog设为1，还是会有一种情况导致问题发生。 当使用InnoDB存储引擎是，在一个事务发出commit动作之前，由于sync_binlog位1，因此会将二进制日志立即写入磁盘。如果这是已经写入了二进制日志，但是提交还没有发生，并且此时发生了宕机，那么再MySQL数据库下次启动时，由于COMMIT操作并没有发生，这个事务会被回滚掉。但是二进制日志已经记录了该事务信息，不能被回滚。这个问题可以通过将参数innodb_support_xa设为1来解决。

```
innodb_support_xa可以开关InnoDB的xa两段式事务提交。
innodb_support_xa可以开关InnoDB的xa两段式事务提交。

如何开启？
innodb_support_xa=true，支持xa两段式事务提交。

默认为true，值为on,多线程并发执行提交事务，按照事务的先后顺序写入binlog,如果关闭则binlog记录事务的顺序可能与实际不符，造成slave不一致

mysql> show global variables like 'innodb_support_xa';
+-------------------+-------+
| Variable_name     | Value |
+-------------------+-------+
| innodb_support_xa | ON    |
+-------------------+-------+
1 row in set (0.01 sec)


内部XA
现在mysql内部一个处理流程大概是这样：
1. prepare ，然后将redo log持久化到磁盘
2. 如果前面prepare成功，那么再继续将事务日志持久化到binlog
3. 如果前面成功，那么在redo log里面写上一个commit记录


那么假如在进行着三步时有任何一步失败，crash recovery是怎么进行的呢?
此时会先从redo log将最近一个检查点开始的事务读出来，然后参考binlog里面的事务进行恢复。
如果是在1 crash，那么自然整个事务都回滚；
如果是在2 crash，那么也会整个事务回滚；


如果是在3 crash（仅仅是commit记录没写成功），那么没有关系因为2中已经记录了此次事务的binlog，所以将这个进行commit。所以总结起来就是redo log里凡是prepare成功，但commit失败的事务都会先去binlog查找判断其是否存在（通过XID进行判断，是不是经常在binlog里面看到Xid=xxxx？这就是xa事务id），如果有则将这个事务commit，否则rollback。
```

## 3.3 套接字文件

## 3.4 pid文件

## 3.5 表结构定义文件

## 3.6 InnoDB存储引擎文件

### 3.6.1 表空间文件

InnoDB采用将存储的数据按表空间进行存放的设计，再默认配置下会有一个初始大小位10MB，ibdata1的文件。

```
可通过 innodb_data_file_pate进行设置

例如：
innodb_data_file_path = /db/ibdata1:2000M;/dr2/db/idata2:2000M:autoextend
```

单独表空间进存储每个表的数据、索引和插入缓冲BITMAP等信息，其余信息还是存放在默认的表空间中

### 3.6.2 重做日志文件

重做日志记录了InnoDB存储引擎的事务日志

当实例或介质失败，使用重做日志可以恢复到掉电前的时刻。

影响重做日志的属性

- innodb_log_file_size
- innodb_log_files_in_group
- innodb_mirrored_log_groups
- innodb_log_group_home_dir

**二进制日志和重做日志的区别**

- Innodb 二进制日志文件记录的是该日志的逻辑日志
  重做日志记录的是每个页更改的物理情况

- 写入时间不同， 二进制日志文件仅再事务提交前进行提交，即只写磁盘一次

  而再事务进行过程中，却不断有重做日志条目写入

  重做日志文件的写入不是直接写，而时先写入一个日志缓冲，然后按一定的条件顺序写入日志文件

  重做日志缓冲往磁盘写入时，时按照512字节，也就是一个扇区的大小，是写入的最小单位，因此可以保证写入必定是成功的。

已知道主线程会每秒将重做日志缓冲写入磁盘。
另一个出发写磁盘的参数 innodb_flush_log_at_trx_commit

- 0：事务提交时并不写入，等待主线程刷新
- 1：表示再执行commit时将重做日志缓冲同步写入到磁盘即版友fsync调用
- 2：表示将重做日志一部写道磁盘，即写到文件系统。不能完全保证再执行commit时肯定会写入重做日志

# ~~第四章 表（暂时跳过，未来有需要再看）~~

![image.png](https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210411225610.png)



## 4.1 索引组织表

InnoDB存储引擎中，表都是根据主键顺序组织存放的，这种存储方式的表成为索引组织表

## 4.2 InnoDB逻辑存储结构

所有数据逻辑的存放在表空间中，表由段(SEGMENT)\区（extet）页（page）组成

### 4.2.1 表空间

如果启用了 innodb_file_per_table，每张表的表空间只存放的是数据、索引和插入缓冲Bitmap页，其他数据，如回滚信息、插入缓冲、索引页、系统事务信息、二次写缓冲还是存放在原来的共享表中

### 4.2.2 段

- 数据段
- 索引段
- 回滚段

数据段即B+树的叶子节点，索引段即索引节点

#### 4.3.2 区

区是连续的页组成的，每个区大小都为1MB，默认情况InnoDB存储引擎页大小位16KB，一个区由64个连续的页

#### 4.2.4 页

页是InnoDB磁盘管理的最小单位

- 数据页(B tree node)
- undo 页
- 系统页
- 事务数据页
- 插入缓冲位图页
- 插入缓冲空闲列表页
- 未压缩的二进制大对象页
- 压缩的二进制大对象页

#### 4.2.5 行

## 4.4 InnoDB数据页结构

- File Header
- Page Header
- Infimun /Supremum Records
- User Recored
- Free Space
- Page Directory
- File Trailer

## **4.6 约束（可以看看）**

InnoDB数据完整性的约束

- Primary Key
- Unique Key
- Foreign Key
- Default
- Not Null

**约束与索引的区别**: 约束更多是一个逻辑概念，用来保证数据的完整性。索引是一个数据结构，也有逻辑上的概念，在数据库中还代表着物理存储的方式

#### 外键

虽然外键能起到很好的约束作用，但是数据导入的操作，外键往往导致再外键约束上花费大量时间。



## **4.7 视图（可以看看）**

视图实际上就是对base table的一层抽象

# 第五章 索引与算法



索引的理解：索引，存在于内存中，为了提升查询性能和效率
索引如果太多，会占用程序中的大量内存，会导致整体应用程序的性能降低
索引太少，查询效率堪忧

B+树索引并不能直接定位具体行，通过B+树索引**只能找到所在的数据页**。然后通过IO将**数据页读入内存**，在**内存的数据页中检索**该行数据



## 聚集索引和主键的关系和区别

每个表只能有一个聚集索引，因为数据行本身只能按一个顺序存储。

每个表几乎都对列定义聚集索引来实现下列功能：

- 可用于经常使用的查询。
- 提供高度唯一性。



## 5.3 B+树

**B+树的数据结构**

磁盘中的平衡二叉树，所有记录节点内部的，都是按键值大小顺序进行存放

B+树的**根节点一般直接存放在内存**中，中间节点和叶子节点都是存放在磁盘中的，需要通过IO读入到内存中

**添加节点**
可能导致leaf page（叶子节点）以及index page（中间节点）的分裂（中间节点和叶子节点的分裂，实际上磁盘中的页的拆分），也就是磁盘操作
为了尽可能避免磁盘IO，如何应对？
拆分页的操作尽量延迟。如果当前节点容量满了，但是左右兄弟节点容量不满。那么就会**进行旋转**操作，减少拆分的操作

添加节点的时候，为了**尽量避免split操作**，提供了类似于平衡二叉树的旋转功能：
旋转发生在leaf page已经满了， 但是其左右兄弟节点没有满的情况下。
从而，树的高度不发生变化，数据也已经成功添加，而且减少了一次页分裂操作



**删除节点**
fill factor装填因子，代表节点的容量使用率
删除掉某个键值对之后，首先在leaf page中删除记录，如果装填因子低于50%，就需要进行合并操作



### 5.3.1 B+树插入操作

| leaf page 满 | index page 满 | 操作                                                         |
| ------------ | ------------- | ------------------------------------------------------------ |
| No           | No            | 直接将记录插入到叶子节点                                     |
| yes          | no            | 1）拆分leaf page<br />2）将**中间节点放到Indexpage**<br />3）小于中间节点的记录放在左边<br />4）大于或等于中间节点的记录放在右边 |
| yes          | yes           | 1）拆分leaf page <br />2）小于中间节点的记录放在左边 <br />3）大于或等于中间节点的记录放在右边 <br />4）拆分index page <br />5）小于中间节点的记录放在左边 <br />6）大于中间节点的记录放在右边 <br />7）中间节点放入上一层index page |



### 5.3.2 B+树的删除操作

| 叶子节点小于填充因子 | 中间节点小于填充因子 | 操作                                                         |
| -------------------- | -------------------- | ------------------------------------------------------------ |
| No                   | No                   | 直接将记录从叶子节点删除，如果该节点还是Index page节点，用该节点右节点代替 |
| Yes                  | No                   | 合并叶子节点和它的兄弟节点，同时更新Index page               |
| Yes                  | Yes                  | 1）合并叶子节点和它的兄弟节点 2）更新Index Page 3）合并Indexpage 和他的兄弟节点 |





## 5.4 B+树索引

B+树在数据库中的特点是**高扇出性**。 高度一般在2-3层
分为聚集索引/辅助索引 区别是：叶子节点存放着的是不是一整行信息



**B+树索引**

B+树索引的特点，高扇出性，也就是每个节点的容量比较大，查找某个键值对的时候，最多需要2~4次IO，一次IO的时间大概0.01秒

B+树索引包括**聚集索引**(clustered index) 和 **辅助索引**(secondary index)
两者都是B+树索引，叶子节点存放数据，**区别**在于，**聚集索引叶子节点存储的是完整的行记录**，辅助索引存储的是**主键（可以根据主键来在聚集索引树上再次查找）**





### 5.4.1 聚集索引

聚集索引就是按照每张表的**主键**构造一棵B+树，同时叶子节点中存放的即位整张表的**行记录**数据。也将聚集索引的叶子节点成为数据页。聚集索引是连续的。



**聚集索引的特点**
对于主键的某一条的查找，主键的排序查找，范围查找都很快，不需要进行排序操作即可完成
物理上的数据页之间通过双向链表勾连，每个页中的记录也是通过双向链表进行维护的



### 5.4.2 辅助索引（二级索引）

叶子节点并不包含行记录的全部数据。叶子节点除了包含辅助索引外，每个节点中的索引行还包含了一个书签，也就是主键，从而告诉存储引擎哪里可以找到与辅助索引相对应的数据行。



**辅助索引的特点**

叶子节点存储的是相应的主键

举例，高度为3的辅助索引树，遍历3层得到指定的主键；二次回表，遍历聚集索引树（如果也是3层），那么就是一共进行6次IO最终获得了所在的数据页。



### 5.4.3 B+树索引的分裂

```
P1：1、2、3、4   P2：5、6、7、8、9、10
```

然而由于插入是顺序的，P1这个页中将不会再有记录被插入，从而导致空间的浪费。而P2又会再次进行分裂。

存储引擎的Page Header中有以下几个部分用来保存插入的顺序信息：

❑PAGE_LAST_INSERT

❑PAGE_DIRECTION

❑PAGE_N_DIRECTION

通过这些信息，InnoDB存储引擎可以决定是向左还是向右进行分裂，同时决定将分裂点记录为哪一个



### 5.4.4 B+树索引的管理

1、 创建索引 删除索引的语法

- Alter table
- create/ Drop Index

```mysql
-- 对字段b的前100字符创建索引
ALTER TABLE t
ADD KEY idx_b (b(100));
-- 或者
ADD INDEX idx_b (b(100));
-- 创建联合索引
ADD KEY idx_a_c (a,c);

-- 查看某个table的所有索引信息
SHOW INDEX FROM tableName\G;
```

```
mysql> show index from goods\G;
*************************** 1. row ***************************
        Table: goods
   Non_unique: 0
     Key_name: PRIMARY
 Seq_in_index: 1
  Column_name: goods_id
    Collation: A
  Cardinality: 213
     Sub_part: NULL
       Packed: NULL
         Null: 
   Index_type: BTREE
      Comment: 
Index_comment: 
      Visible: YES
   Expression: NULL
*************************** 2. row ***************************
        Table: goods
   Non_unique: 1
     Key_name: goods_FK
 Seq_in_index: 1
  Column_name: goods_user_id
    Collation: A
  Cardinality: 139
     Sub_part: NULL
       Packed: NULL
         Null: 
   Index_type: BTREE
      Comment: 
Index_comment: 
      Visible: YES
   Expression: NULL
2 rows in set (0.01 sec)

```



Cardinality值非常关键，**优化器会根据这个值来判断是否使用这个索引**。但是这个值并**不是实时更新的，即并非每次索引的更新都会更新该值**，因为这样代价太大了。因此这个值是不太准确的，只是一个大概的值。上面显示的结果主键的Cardinality为2，但是很显然我们的表中有4条记录，这个值应该是4。如果**需要更新索引Cardinality的信息，可以使用ANALYZE TABLE**

```mysql
AYALYZE TABLE t\G;
```



在一个非高峰时间，对应用程序下的几张核心表做ANALYZE TABLE操作，这能使优化器和索引更好地为你工作



## 5.5 cardinality



### 5.5.1 cardinality值

**什么情况下该创建索引？**
什么情况下创建索引才能够加速查询的同时，又不会影响程序的性能

并不是在所有的查询条件中出现的列都需要添加索引。对于什么时候添加B+树索引，一般的经验是，在访问表中很少一部分时使用B+树索引才有意义。对于性别字段、地区字段、类型字段，它们可取值的范围很小，称为低选择性

怎样查看索引是否是高选择性的呢？可以通过SHOW INDEX结果中的列Cardinality来观察。Cardinality值非常关键，表示索引中不重复记录数量的预估值。同时需要注意的是，Cardinality是一个预估值，而不是一个准确值，基本上用户也不可能得到一个准确的值



Cardinality/n_rows_in_table应尽可能地接近1。如果非常小，那么用户需要考虑是否还有必要创建这个索引。故在访问高选择性属性的字段并从表中取出很少一部分数据时，对这个字段添加B+树索引是非常有必要的



**Cardinality** 表示索引中为唯一值数目的估计值， Cardinality/表的行数应该尽可能接近1
优化器会根据这个值来判断是否使用这个索引。但是并不是实时更新的。



### 5.5.2 如何对cardinality进行统计

建立索引的前提是列中的数据是高选择性的，这对数据库来说才具有实际意义。然而数据库是怎样来统计Cardinality信息的呢？因为MySQL数据库中有各种不同的存储引擎，而每种存储引擎对于B+树索引的实现又各不相同，所以对Cardinality的统计是放在存储引擎层进行的

此外需要考虑到的是，在生产环境中，索引的更新操作可能是非常频繁的。如果每次索引在发生操作时就对其进行Cardinality的统计，那么将会给数据库带来很大的负担。另外需要考虑的是，如果一张表的数据非常大，如一张表有50G的数据，那么统计一次Cardinality信息所需要的时间可能非常长。这在生产环境下，也是不能接受的。因此，数据库对于Cardinality的统计都是通过采样（Sample）的方法来完成的。

在InnoDB存储引擎中，Cardinality统计信息的更新发生在两个操作中：INSERT和UPDATE。根据前面的叙述，不可能在每次发生INSERT和UPDATE时就去更新Cardinality信息，这样会增加数据库系统的负荷，同时对于大表的统计，时间上也不允许数据库这样去操作。因此，InnoDB存储引擎内部对更新Cardinality信息的策略为：

❑表中1/16的数据已发生过变化。

❑stat_modified_counter＞2 000 000 000。

引擎内部是怎样来进行Cardinality信息的统计和更新操作的呢？同样是通过采样的方法。默认InnoDB存储引擎对8个叶子节点（Leaf　Page）进行采用。采样的过程如下：

❑取得B+树索引中叶子节点的数量，记为A。

❑随机取得B+树索引中的8个叶子节点。统计每个页不同记录的个数，即为P1，P2，…，P8。

❑根据采样信息给出Cardinality的预估值：Cardinality=（P1+P2+…+P8）*A/8。



## 5.6 B+树索引的使用

### 5.6.1 如何正确的使用B+树索引

B+树索引的使用场景
数据库的两类应用

OLTP online transaction processing 在线事务处理应用（联机事务处理）：特点，查询操作大多根据主键获取一条记录，根据B+树索引获取指定的一条记录，**SQL简单**
OLAP online analytical processing 在线分析处理应用 （联机分析处理）：**访问表中的大量数据**，并由这些数据产生查询结果，面向分析查询，以提供决策支持。复杂的OLAP查询，**会涉及多张表的连接操作**。通常OLAP应用，会选择时间字段作为索引（根据时间维度进行数据分析）



### 5.6.2 联合索引

**联合索引**
就是**将多个字段整合成一个索引，是辅助索引**，本质上也是B+树索引，
至少包括两个字段，字段一是有序的；字段一相同，那么字段二是有序的
因此，联合索引的特点就相当于已经对字段一进行**GROUP BY之后对字段二进行了排序**

```mysql
CREATE TABLE t(
    a INT,
    b INT,
    PRIMARY KEY(a),
    KEY idx_a_b(a,b) -- 对ab建立联合索引
)
```



联合索引的好处在于，假设用n个字段作为联合索引，那么**前面k-1个字段确定的情况下，获取k字段排序的结果**，通过联合索引获取到的结果就是有序的，**不需要查询之后再进行排序**

可以直接query前面的字段
可以前面字段确认之后query后面的字段
不可以前面的字段未知的情况下，查询后面的字段（这样联合索引失效）

```mysql
-- 如下语句，如果已经建立联合索引idx_a_b，那么下面语句的执行结果就可以直接通过联合索引得到结果
SELECT ... FROM TABLE WHERE a=XXX ORDER BY b
-- 根据联合索引idx_a_b_c直接获取结果
SELECT ... FROM TABLE WHERE a=XXX ORDER BY b
SELECT ... FROM TABLE WHERE a=XXX AND b=XXX ORDER BY c
-- 下面的语句，联合索引不能直接得到结果，还需要进行一次filesort，因为(a,c)并没有排序
SELECT ... FROM TABLE WHERE a=XXX ORDER BY c
SELECT ... FROM TABLE WHERE b=XXX -- 联合索引失效
```



### 5.6.3 覆盖索引

**覆盖索引 covering index**

**从辅助索引中就可得到查询的记录**，而不需要回表查询聚集索引，辅助索引叶子节点数据只包含辅助索引和primary key，可以容纳的数量多，从而**减少了IO操作**
实际上是一类特殊的场景，**已知辅助索引，要获取相应的主键**
这种情况下，使用辅助索引的叶节点数据就是我们**需要查询的数据**，不需要再由聚集索引进行查询。

```mysql
SELECT primary_key, key2 FROM TABLE WHERE key2=XXX;;
```





### 5.6.4 不适用索引的情况

**优化器在查询中对于索引的选择**

要获取整行数据（假如说是**范围查找**）
如果访问的数据量比较少，那么优化器会选择辅助索引，进行回表查找
**如果量比较大**，20%左右，那么就**选择聚集索引进行查找**（聚集索引是顺序存放的）

```
用户查询整行的数据，但是辅助索引不能够覆盖所要查询的信息。辅助索引查询到指定数据后，还需要一次书签访问来查找整行信息。虽然辅助索引的数据是顺序存放的，凡是进行书签查找的顺序是离散的。变成了磁盘上的离散读操作。如果访问量很大的时候，会选择通过聚集索引查找（表扫描）
```

全表扫描的本质
扫描聚集索引（主键）



### 5.6.6 MRR优化

辅助索引读取之后，暂存到一块，然后对primary key 进行排序，统一查询（化离散为顺序，从而加速查询）



Multi-Range Read优化的目的就是为了减少磁盘的随机访问，并且将随机访问转化为较为顺序的数据访问，这对于IO-bound类型的SQL查询语句可带来性能极大的提升。Multi-Range Read优化可适用于range，ref，eq_ref类型的查询。

MRR优化有以下几个好处：

❑MRR使数据访问变得较为顺序。在查询辅助索引时，首先根据得到的查询结果，按照主键进行排序，并按照主键排序的顺序进行书签查找。

❑减少缓冲池中页被替换的次数。

❑批量处理对键值的查询操作。

对于InnoDB和MyISAM存储引擎的范围查询和JOIN查询操作，MRR的工作方式如下：

❑将查询得到的辅助索引键值存放于一个缓存中，这时缓存中的数据是根据辅助索引键值排序的。

❑将缓存中的键值根据RowID进行排序。

❑根据RowID的排序顺序来访问实际的数据文件。



上述两句语句的执行时间相差10倍之多。可见Multi-Range Read将访问数据转化为顺序后查询性能得到提高。

注意　上述测试都是在MySQL数据库启动后直接执行SQL查询语句，此时需确保缓冲池中没有被预热，以及需要查询的数据并不包含在缓冲池中。



### 5.6.7 ICP优化

取出索引的时候进行WHERE条件过滤，然后再获取记录，而不是读取记录之后再用WHERE过滤

在支持Index Condition Pushdown后，MySQL数据库会在取出索引的同时，判断是否可以进行WHERE条件的过滤，也就是将WHERE的部分过滤操作放在了存储引擎层。在某些查询下，可以大大减少上层SQL层对记录的索取（fetch），从而提高数据库的整体性能。



## 5.7 哈希索引

数据库自动创建并使用
只能用来搜索**等值查询**，对于**字典类型**的查询非常快

```mysql
-- 哈希索引的例子
SELECT * FROM table WHERE index_col='xxx'
```



## 5.8 **全文检索**

### 5.8.1 概念

**什么是全文检索**

简单来说，就是**查找某个关键词出现的位置**
本地有多个文档，在多个文档中**查找某个关键词是否存在，是否包含某个关键词**
从而进行各种统计和分析（full-text search)
**InnoDB引擎的全文检索不支持没有delimiter（单词界定符）的语言**，比如中文日文韩文



**全文检索和B+树的关系**
**B+树不支持全文检索**
但是支持简单的查询，以XX开头的内容

```mysql
-- B+树支持的全文检索
SELECT * FROM blog WHERE content like "xxx%";
-- B+树不支持的全文检索
SELECT * FROM blog WHERE content like "%xxx%";
```



### 5.8.2 倒排索引

inverted file index : 倒排索引表，存放 {单词，单词所在文档id}
full inverted index : 也是一张表，存放 {单词，单词所在文档id以及在文档中出现的位置}

表1：

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210415005522.png" alt="image-20210415005522046" style="zoom:33%;" />

表2：

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210415005502.png" alt="image-20210415005455322" style="zoom: 33%;" />



**全文检索的原理**

全文检索采用**倒排索引**
建立索引表之后，简单遍历索引表就能完成任务，所以**问题是，如何建立索引表**
有了两个倒排索引表之后，查询关键词，就很容易了，比如统计出现的次数，或者出现在哪些文档中，**简单遍历一下倒排索引表即可获取，而不必再读文档**
也就是说，为了加速检索，必须首先**对文档进行分析，分析之后，形成了索引**，从而**以后的检索就不必遍历原数据**，而是**很快就得到了检索结果**



**InnoDB如何建立索引表？**

innodb采用的是full inverted index方式构建的倒排索引表
表中有两个字段，字段一 word（建立索引），字段二ilist字段{ documentID, Potision}（链表形式）

倒排索引表，是。为了**提升全文检索的性能**，Innodb设置的有
innoDB为了提高全文检索的并行性能，构建6个辅助表，全部持久化到磁盘上的。
**在word上建立红黑树索引**，也就是FTS index cache，根据word进行排序



**添加文档**
需要更新倒排索引表（概念就是，**先写缓存，然后刷脏页**）
分词的统计结果，先写缓存，然后批量异步更新到辅助表（磁盘）上
最后查询的时候直接查询倒排索引表即可

简言之，INNODB通过缓存，来完成延时、批量的写入，来提高数据库性能



**删除文档**
不会删除倒排索引表中的分词信息，会在 DELETED 倒排索引表中添加数据
因此倒排索引表就会越来越大



比如删除了`test.fts_a`表中的7号ID的文档
通过如下指令，可以**彻底删除倒排索引中该文档的分词信息**

```mysql
OPTIMIZE TABLE test.fts_a;
```



**小概念**
stopword list，里面的词汇不会在倒排索引表中创建索引，比如一些没有具体意义的单词，the



### 5.8.4 全文检索的使用

全文检索是在**WHERE条件中使用MATCH函数进行匹配，返回结果根据相关性进行降序排列**（0~1之间）
相关性计算的依据：
1 关键词在文档中出现的次数
2 关键词在索引列中的数量
3 包含关键词的文档的数量

```mysql
-- natural language模式进行全文检索
SELECT * FROM fts_a WHERE MATCH(body) AGAINST ('Porridge');
-- 观察语句的执行计划
EXPLAIN SELECT * FROM fts_a WHERE MATCH(body) AGAINST ('Porridge') \G;
-- /G 的作用是将查到的结构旋转90度变成纵向
```



```mysql
-- 筛选结果中增加相关性一列
SELECT fts_doc_id, body, MATCH(body) AGAINST ('like >pot' IN BOOLEAN MODE) AS Relevance
FROM fts_a;

# +表示单词必须存在
# -表示word必须排除
# 单独的单词表示可有可无
AGAINTS ('+Pease -hot' IN BOOLEAN MODE);

# *表示以单词开头的单词
AGAINTS ('lik*' IN BOOLEAN MODE);

# @distance 表示单词之间的距离
AGAINTS (' "Pease pot" @30' IN BOOLEAN MODE);

# ""表示短语
AGAINTS ('"Some word"' IN BOOLEAN MODE);
```



**全文检索的扩展查询**
如果关键词太短，用户可以进行扩展查询，包括两阶段
第一阶段：根据关键词进行全文检索
第二阶段：根据第一阶段产生的分词再次进行全文检索



# 第六章 锁

事务隔离界别测试，表test.parent，唯一字段id
查看隔离级别
mysql默认的事务隔离级别是 可重复度 

```mysql
-- 查看当前事务的隔离级别
SELECT @@transaction_isolation;
```



<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210415194440.png" alt="image-20210415194433780" style="zoom:80%;" />



```mysql
CREATE TABLE t( a INT PRIMARY KEY);
INSERT INTO t SELECT 1;
INSERT INTO t SELECT 2;
INSERT INTO t SELECT 5;
```



InnoDB存储引擎不需要锁升级，因为一个锁和多个锁的开销是相同的



## 6.1 什么是锁

数据库通过锁，在**保证数据的一致性**的前提下，尽可能提高临界资源的并发访问

Innodb提供了一致性的非锁定读和行级锁支持

## 6.2 lock 与latch

latch 闩锁， 在InnoDB中，Latch又可分为mutex和rwLock， 目的是用来保证并发线程操作临界资源的正确性，并且通产没有死锁检测

lock提供给谁？事务
lock用来锁定什么资源？数据库中的某个表，表中的某些数据页，数据页中的某些行
lock什么时间释放？事务commit或rollback后释放。且有死锁机制

|          | lock                                              | latch                                                        |
| -------- | ------------------------------------------------- | ------------------------------------------------------------ |
| 对象     | 事务                                              | 线程                                                         |
| 保护     | 数据库内容                                        | 内存数据结构                                                 |
| 持续时间 | 整个事务过程                                      | 临界资源                                                     |
| 模式     | 行锁、表锁、意向锁                                | 读写锁、互斥量                                               |
| 死锁     | 通过 wait-for grouph、time out 等级制进行死锁检测 | 五死锁检测机制，仅通过应用程序加锁的顺序（lock leveling）保证无死锁 |
| 存在于   | Lock Manager的哈希表中                            | 在每个数据结构的对象中                                       |



## 6.3 InnoDB存储引擎中的锁

### 6.3.1 锁的类型

①在**mysql中有表锁**
LOCK TABLE my_tabl_name READ;  用读锁锁表，会阻塞其他事务修改表数据。
LOCK TABLE my_table_name WRITe; 用写锁锁表，会阻塞其他事务读和写。

②**Innodb引擎支持行锁**，行锁分为
共享锁，一个事务对一行的共享只读锁。
排它锁，一个事务对一行的排他读写锁。

innodb中的行锁
对于UPDATE、DELETE和INSERT语句，InnoDB自动加行锁
对于普通SELECT语句，InnoDB不会加锁；可以人为显式的加锁`in share mode`或者`for update`：

innodb中的意向锁
`意向锁是有innodb引擎自己维护的，用户无法手动操作意向锁`，在**事务添加行锁之前**，innodb 自动**申请表的对应意向锁**

判断冲突
1 检测表**是否存在表锁**
2 检测表**是否存在互斥的意向锁**，而不是逐行检查是否存在行锁

表锁：包括write lock和read lock
行锁：包括X lock和S lock

**意向锁之间是相互兼容**的
意向锁和表级别的锁的兼容性：

|                 | 意向共享锁（IS） | 意向排他锁（IX） |
| --------------- | ---------------- | ---------------- |
| **共享锁（S）** | 兼容             | 互斥             |
| **排他锁（X）** | 互斥             | 互斥             |

这里的共享锁 互斥锁 指的都是表级别锁，意向锁与行级别的锁不互斥不会与行级的共享 / 排他锁互斥
也就是说
如果某行被加了行锁，那么表会被添加IX
再添加一个行锁的时候，IX和IX之间兼容，因此进一步检查行锁是否兼容



[参考自1](https://segmentfault.com/a/1190000012773157?utm_source=sf-similar-article)
[参考自2](https://segmentfault.com/a/1190000023662810)
[mysql中意向锁的作用](https://juejin.cn/post/6844903666332368909#comment)





### 6.3.2 一致性非锁定读

InnoDB存储引擎通过行多版本控制的方式读取当前执行时间数据库中行的数据
读取行数据的时候，**即使行数据持有X锁**，innodb不会等待锁释放，而是**读取行的快照数据**（之前版本的数据，通过undo段来完成）

innodb默认设置，**非锁定读是默认的读取方式**，读取不会等待表上的X锁。非锁定读提高了数据库的并发能力

但是在不同事务隔离级别下读取方式不同
**不是所有的隔离级别都采用非锁定读**
RC和RR这两个级别采用非锁定读，但是对快照的定义不同

在事务隔离级别Read Committed和**默认级别Repeateble Read**下，InnoDB会采用**非锁定一致性读**。但是对于快照的定义不同

- Read Committed事务隔离级别下：对于快照数据，非一致性读总是读取**被锁定行的最新一份快照数据**
- Repeateble Read事务隔离级别下：对于快照数据，非一致性读总是读取**事务开始时的行数据版本**



### 6.3.3 一致性锁定读

默认情况下，SELECT不会加锁，但是可以显式地对SELECT读取操作进行加锁

- select …… for update：加X锁
- select …… lock in share mode：加S锁

```mysql
事务的开始
BEGIN 或者 START TRANSACTION 或者 AUTOCOMMIT=0
```



### ~~6.3.4 自增长与锁~~





## 6.4 锁的算法



### **6.4.1 行锁的三种算法**

- Record Lock ： **通过索引给单行**记录上锁
- Gap Lock：间隙锁，锁范围，不锁行记录
- Next Key Lock： 为了加锁时的方便，**间隙锁和行锁的合集称为 next-key lock**

Next key Lock 算法是为了解决Phantom Problem

查询的时候，如果是**聚集索引并且只有一行数据**的时候，根据next-key lock，**锁会降级成行锁 record lock**，提高并发性
如果是**辅助索引**，则会**锁定前面的一个gap和后面的一个gap，从而避免幻读现象**



RR级别下进行**查询**：

只使用**唯一索引**查询，并且**只锁定一条记录**时，innoDB会使用**行锁**
只使用**唯一索引**查询，但是检索条件是**范围检索**，或者是唯一检索然而检索结果不存在（试图锁住不存在的数据）时，会产生 Next-Key Lock（范围锁）
使用**普通索引**检索时，不管是何种查询，只要加锁，都会产生**间隙锁** gap lock

[参考](https://www.jianshu.com/p/d5c2613cbb81)



gap Lock可以避免多个事务将数据添加到同一个范围中

```
用户可以通过以下方式显示关闭GapLock
- 将事务的隔离级别设置为Read Committed
- 将参数 innodb locks unsafe for binlog 设置为1

上述配置破坏了事务的隔离性， 并且对于replication 可能会导致主从数据不一致
```

在事务隔离级别是 Read Committed时仅采用Record Lock



## 6.5 锁问题



### 6.5.0 幻读

幻读， phantom problem，一个事务，前后执行两次相同的SQL查询，第二次SQL**返回的有之前不存在的行数据**

innodb默认隔离级别RR可重复读，本身就可以避免幻读问题

https://xie.infoq.cn/article/6abc55424169c68e89efed08d

具体原理
通过next-key locking算法避免幻读
next-key locking**对范围进行加锁**，其他**尝试添加数据的事务，会被阻塞**，直到next-key locking的事务提交或者回滚

```mysql
SET @@transaction_isolation='REPEATABLE-READ';
-- 对范围进行锁定
SELECT * FROM t WHERE a>2 FOR UPDATE;
```



### 6.5.1 脏读

**脏页和脏读的区别**
脏页：缓冲池中已经被修改的页但还没有刷新到磁盘中，是正常的而且非常常见
脏读：事务读取了（缓存中其他事务）**尚未提交的数据**，也就是读取了脏数据，违反了事务的**隔离性**要求

事务的隔离级别
如果是read committed或者往上，那么是不会存在脏读的现象的
只有read uncommitted的隔离级别，才会产生脏读



### 6.5.2 不可重复读

**不可重复读**
一个事务前后执行相同的SQL读取操作，（在事务没有结束的时候，另外一个事务对数据集合进行了update或者delete操作），导致两次获得的数据不一致
读取的是已经提交事务的数据，违反了的**一致性**

**解决**
加行锁即可

**问题**
加行锁可以避免数据被update或者delete，但是无法解决insert新数据，也就是幻读

隔离级别
read committed，会存在不可重复读
**RR级别不会存在不可重复读**

**为什么RR级别不存在不可重复读**（或者幻读）
next-key locking算法，对索引进行加锁，并且对范围进行加锁，从而数据不会被修改



### **不可重复读和幻读的区别**
相同点：都是一个事务，前后两次相同的sql，结果不一样

不同点：
不可重复读，两次sql读取中间，其他事务对数据进行update或者delete->应对：隔离级别可重复读即可，**行锁**
幻读，两次sql中间，其他事务进行了insert新数据->应对：选择隔离级别可重复读即可，无法通过行锁解决，MVCC或者**间隙锁或者next-key锁，或者锁表**

[参考](https://www.cnblogs.com/michael9/p/12358631.html)



### 6.5.3 丢失更新

简单来说就是一个事务的更新操作会被另一个事务的更新操作锁覆盖，从而导致数据的不一致

```
1） 事务T1将记录r更新为v1， 但是事务T1并未提交
2） 于此同时 事务T2将记录更新为v2，并未提交
3） T1提交
4） T2提交
```

数据库通过加X锁，能阻止丢失更新问题的产生



简单的`update`语句可以避免丢失更新（自带X锁）
实际业务中，通常采用的是将**事务进行串行化**
1 先`SELECT FOR UPDATE`对数据加X锁
2 进行其他业务操作
3 最后进行数据更新操作



## 6.7 死锁

**死锁**
多个事务在执行过程中，因争夺锁资源而造成的一种互相等待的现象。

解决超时的办法：

- 超时机制（超时之后将某些权重大的事务进行回滚）
- wait-for graph 等待图 来主动检测死锁（innodb采用的方案）
  - 锁的信息链表
  - 事务等待链表

**innodb中的死锁检测**
事务申请锁并且发生等待的时候，进行死锁检测判断是否存在回路，如果存在则说明死锁，对undo量最小的事务进行回滚，死锁解除之后就能正常进行操作了



## ~~6.8 锁升级~~

innodb，由于锁的内存代价并不高，一个事务，一页数据，锁1行的代价和锁n行的代价一样，因此不会将行锁升级成表锁

# 第七章 事务

## 7.1 概念

### 7.1.1 概念

事务，可以理解成若干条SQL语句的集合
引入事务，**保证数据库始终处于一致性状态**（提交时，要么都成功，要么都回滚）

严格的事务特性，必须满足ACID标准

A 原子性 atomic：
事务中的数据库操作，要么都成功，要么都失败（一旦失败进行回滚）
C 一致性 consistency：
完成事务之后，数据库的仍然处于一致性状态
比如唯一约束没有被破坏（一旦破坏约束，那就进行事务回滚，仍然处于一致性状态）
I 隔离性 isolation：
即，并发情况下，事务在提交之前，不会被其他事务所看到
又称，并发控制
D 持久性 durability：
一旦事务提交，就是永久性的，即使发生宕机故障，数据库也能将数据恢复
如何实现？redo log
持久性保证事务系统的高可靠性，而不是高可用性



### 7.1.2 事务的分类

- 扁平事务
- 带有保存点的扁平事务

保存点用来通知系统应该记住事务当前的状态，一边当之后发生错误时，事务能回到保存点当时的状态

```
SAVE WORK
```

- 链事务

提交一个事务时不需要释放数据对象，将必要的处理上下文隐式的传递给下一个要开始的事务。将提交事务操作和开始下一个事务操作合并成为一个原子操作。
与带有保存点的扁平事务相比，带有保存点的扁平事务能回滚到任意正确的保存点。
链事务的回滚仅限于当前事务，即只能恢复到最近一个保存点。对于锁的处理也不相同。链事务在COMMIT后即释放了当前事务的所有锁。
带有保存点的扁平事务不影响迄今为止锁持有的锁

- 嵌套事务
- 分布式事务



## 7.2 事务的实现

事务的**隔离性通过锁**来实现
**原子性，一致性，持久性**通过数据库的 redo log 和 undo log 实现

**redo log** 称为重做日志，用来保证事务的**原子性和持久性**
**undo log** 用来保证事务的**一致性**

redo 和 undo 都可以视为一种恢复操作
redo 用于重新执行提交事务修改的页操作：redo记录的是SQL操作
undo 回滚行记录到某个特定的版本：undo记录的是数据的变化情况



### 7.2.1 redo

**基本概念**

重做日志用来实现事物的持久性。
包括两部分，redo log buffer和redo log file
事务提交的时候，必须记录到重做日志文件中进行持久化（包括redo log和undo log）
redo log保证持久化
undo log保证事务的回滚和MVCC

正常情况下，事务提交的时候，由于`fsync设置=1`，每次提交都将 redo log buffer 写入到OS的文件系统缓存之后，进行一次`fsync`操作，**进行文件同步，从OS文件缓存写入硬盘**（否则，OS宕机，会导致文件系统缓存丢失）

参数innodb_flush_log_at_trx_commit用来控制重做日志刷新到磁盘的策略

- 0 表示事务提交时不进行写入重做日志
- 1 表示事务提交一次必须调用一次fsync
- 2 表示事务提交时，将重做日志写入文件系统缓存，不进行fsync



binlog 用于恢复和主从复制环境的建立

**binlog和redo log的区别**
相同点：两者都是记录数据库操作的日志
不同点：
redolog 产生于innoDB存储引擎层，二进制日志是MySQL数据库的上层产生的
binlog记录的是**逻辑修改**，记录的是**SQL语句**，**redo log记录的是对于数据页的修改**
binlog只有在事务提交的时候进行一次写入，**InnoDB存储引擎的重做日志 redo log在事务进行中不断写入**



~~**log block**~~

重做日志中 都是以512字节进行存储的。称为重做日志快

若一个页中产生的重做日志数量大于512字节，那么需要分割为多个重做日志块进行处理。
同时，由于重做日志块的大小和磁盘扇区大小一样，都是512字节。因此重做日志的写入可以保证原子性，不需要double write



~~**log group**~~



~~**LSN**~~

log sequence number 代表的是日志序列号
表示

- 重做日志写入的总量
- checkpoint的位置
- 页的版本

LSN 不仅记录在重做日志中，还存在于每个页中。 表示该页最后刷新时LSN的大小。
可以根据LSN判断是否需要进行恢复操作

~~**恢复**~~



### 7.2.1 undo

undo是**逻辑日志**，回滚的时候，将数据逻辑性的恢复到原来的数据，**所有修改都被逻辑的取消**了



**undo的作用**
事务回滚：innodb进行回滚的时候，执行的是相反的操作，比如一个insert对应一个delete，一个delete对应一个insert，update对应相反的update
MVCC：innodb存储引擎中的**MVCC通过undo来实现**。读取行记录的时候，如果被其他事务占用，那么通过undo来读取之前的行记录，**从而实现非锁定读**



```
当事务提交时，InnoDB存储引擎会做以下的事情
- 将undo log 放入列表中，以供之后的purge操作
- 判断undo log 所在的页是否可重用，若可以分配给下个事务使用
```



### 7.2.3 purge

delete 和 update 并不会直接删除原有的数据

真正删除行记录的操作被延时到purge操作

purge最终完成delete 和update操作，是因为 InnoDB存储引擎支持MVCC，所以记录不能在事务提交时立即进行处理。这时，其他事务可能正在引用这行。
能否删除行记录需要通过purge来判断，如果行记录不被其他事务引用，那么可以进行真正的delete操作



## 7.3 事务控制语句

```mysql
-- 开启事务
SET AUTOCOMMIT=0或者 BEGIN 或者 START TRANSACTION
-- 提交
COMMIT
-- 回滚
ROLLBACK
-- 在事务中创建保存点
SAVEPOINT identifier
-- 删除保存点
RELEASE SAVEPOINT identifier
-- 回滚到指定保存点
ROLLBACK TO [SAVEPOINT] IDENTIFIER
-- 设置事务隔离级别，有READ UNCOMMITTED; READ COMMITTED; REPREATABLE READ; SERIALIZABLE
SET TRANSACTION
```





## 7.6 事务隔离级别

- READ UNCOMMITTED
- READ COMMITTED
- REPEATABLE READ
- SERIALIZABLE

隔离级别越低，事务持有的锁的数量越少，持有时间越短，但是性能可能会更好

SERIALIZABLE 隔离级别主要用于innodb的**分布式事务**
对每个SELECT语句自动加上`LOCK IN SHARE MODE`，**串行化隔离级别下，不再支持非锁定读**。S锁是**两阶段的**



```mysql
-- 查看当前会话或者全局的事务隔离级别
SET [GLOBAL|SESSION] TRANSACTION ISOLATION LEVEL
{
	四个隔离级别
}
```



数据库启动的时候设置事务的默认隔离级别

```bash
[mysqld]
transaction-isolation = READ-COMMITTED
```







## 7.7 分布式事务

分布式事务是指允许多个独立的事务资源参与到一个全局的事务中。

分布式事务的事务隔离级别必须设置为SERIALIZABLE
分布式事务由

- 一个或多个资源管理器
- 一个事务管理器
- 一个应用程序组成



## 7.8 不好的事务习惯

### 7.8.1 在循环中提交

良好的习惯：
关闭自动提交之后，循环完毕，再进行COMMIT
原因：
每次commit都会写一次redo log，循环添加10000条数据，每次都提交则会写入10000次redo log，而循环完毕提交只需要1次



### 7.8.2 使用自动提交

开发的时候最好关闭自动提交，手动管理事务的控制权限



### 7.8.3 使用自动回滚



# 第八章 备份

冷备，热备（在线备份），全量备份增量备份，**快照**



**8.7 复制**

复制（replication）是MySQL数据库提供的一种高可用高性能的解决方案，一般用来建立大型的应用。总体来说，replication的工作原理分为以下3个步骤：
1）主服务器（master）把数据更改记录到二进制日志（binlog）中
2）从服务器（slave）把主服务器的二进制日志复制到自己的中继日志（relay log）中
3）从服务器重做中继日志中的日志，把更改应用到自己的数据库上，以达到数据的最终一致性。



[参考自](https://segmentfault.com/a/1190000037780097)