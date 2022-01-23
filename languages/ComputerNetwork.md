

## 网络与TCP/IP

- [TCP与UDP之间的区别](https://link.zhihu.com/?target=http%3A//blog.csdn.net/shanghairuoxiao/article/details/68927070) 
  (1) IP首部，TCP首部，UDP首部 
  (2) TCP和UDP区别 
  (3) TCP和UDP应用场景 
  (4) 如何实现可靠的UDP



- [详细说明TCP状态迁移过程](https://link.zhihu.com/?target=http%3A//blog.csdn.net/shanghairuoxiao/article/details/68927100) 
  (1) 三次握手和四次挥手状态变化； 
  (2) 2MSL是什么状态？作用是什么？ 



- [TCP客户与服务器模型，用到哪些函数](https://link.zhihu.com/?target=http%3A//blog.csdn.net/shanghairuoxiao/article/details/69803044)
- [UDP客户与服务器模型，用到哪些函数](https://link.zhihu.com/?target=http%3A//blog.csdn.net/shanghairuoxiao/article/details/69951345)
- [域名解析过程，ARP的机制，RARP的实现](https://link.zhihu.com/?target=http%3A//blog.csdn.net/shanghairuoxiao/article/details/68926923)





### 安全相关

至少了解攻击的原理和基本的防御方法，常见的攻击方法有一下几种

- SQL注入
- XSS
- CSRF
- SYN洪水攻击
- APR欺骗





## 参考

主要参考

图解tcpip 图解http

sj计网课件

帅地https://www.iamshuaidi.com/704.html （问题列表）



https://github.com/CyC2018/CS-Notes/blob/master/notes/HTTP.md

掘金问题列表（https://juejin.cn/post/6988794419910541348#heading-1）

帅地和掘金还有下面github的两个，面试的过程中都可以翻一翻哪些问题自己不会



其余参考

https://github.com/wolverinn/Waking-Up/blob/master/Computer%20Network.md



https://github.com/CyC2018/CS-Notes/blob/master/notes/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C%20-%20%E7%9B%AE%E5%BD%95.md





---

## 计算机网络概述部分，有待补充

### OSI七层协议模型

* 七层协议模型主要是：应用层（Application）、表示层（Presentation）、会话层（Session）、传输层（Transport）、网络层（Network）、数据链路层（Data Link）、物理层（Physical）。
* 五层体系结构包括： 应用层，运输层，网络层，数据链路层和物理层。五层知识OSI和TCP/IP 的综合，实际应用还是TCP/IP的四层结构，为了方便可以把下两层称为网络接口
* 四层TCP/IP模型： 应用层（Telent，FTP等），传输层（TCP和UDP），网络层（IP，ICMP,IGMP），链路层



应用层：DNS域名解析（域名->ip地址），HTTP协议，HTTPS协议，FTP协议

传输层：TCP协议，UDP协议

网络层：IP协议，ARP协议（ip地址->MAC地址），ICMP（ping的原理）

链路层：

物理层：



### 五层协议

五层协议由上到下

* **应用层** ：为特定应用程序提供数据传输服务。应用层的协议有很多，HTTP HTTPS DNS FTP。数据单位为报文。
* **传输层** ：传输层的任务就是**负责主机中两个进程之间的通信**。因特网的传输层可使用两种不同协议：即面向连接的传输控制协议TCP，和无连接的用户数据报协议UDP。TCP协议，提供面向连接、可靠的数据传输服务，UDP协议提供无连接、尽最大努力的数据传输服务。
* **网络层** ：**不同链路介质之间的主机的数据传输**。常见协议：IP,ICMP,IGMP,ARP,RARP。主要包括两个任务：（1）负责为分组交换网上的不同主机提供通信服务。在发送数据时，网络层把运输层产生的报文段或用户数据报封装成分组或包进行传送。在TCP/IP体系中，由于网络层使用IP协议，因此分组也叫做IP数据报，或简称为数据报。（2）选中合适的路由，使源主机运输层所传下来的分组，能够通过网络中的路由器找到目的主机。
* **数据链路层** ：常简称为链路层。网络层针对的还是主机之间的数据传输服务，而主机之间可以有很多链路，链路层协议就是为同一链路的主机提供数据传输服务。数据链路层把网络层传下来的分组封装成帧。
* **物理层** ：考虑的是怎样在传输媒体上传输数据比特流，而不是指具体的传输媒体。物理层的作用是尽可能屏蔽传输媒体和通信手段的差异，使数据链路层感觉不到这些差异。**透明的传输比特流**





> 3、IP协议，ARP协议属于网络层
>
> 网络层负责为分组交换网上的**不同主机提供通信**。在发送数据时，网络层将运输层产生的报文段或用户数据报封装成分组或包进行传送。在TCP/IP体系中，分组也叫作IP数据报，或简称为数据报。网络层的另一个任务就是要选择合适的路由，使源主机运输层所传下来的分组能够交付到目的主机。
>
> 4、数据链路层
>
> 当发送数据时，数据链路层的任务是将在网络层交下来的IP数据报组装成帧，在两个相邻结点间的链路上传送以帧为单位的数据。每一帧包括数据和必要的控制信息（如同步信息、地址信息、差错控制、以及流量控制信息等）。控制信息使接收端能够知道—个帧从哪个比特开始和到哪个比特结束。控制信息还使接收端能够检测到所收到的帧中有无差错。
>
> 5、物理层
>
> 物理层的任务就是透明地传送比特流。在物理层上所传数据的单位是比特。传递信息所利用的一些物理媒体，如双绞线、同轴电缆、光缆等，并不在物理层之内而是在物理层的下面。因此也有人把物理媒体当做第0层。





## 链路层

链路层是干啥的

数据包在同一个链路层的传输

依靠MAC地址进行识别





## 网络层

网络层是干啥的

数据包在不同的链路层之间的传输，**把数据包从主机送到目标主机**

依靠IP地址进行识别



路由器在这一层，路由寻址算法





包括哪些协议

IP协议，ICMP协议（ping命令），ARP协议（ip->MAC）



### IP协议

internet protocol

ip地址分类

> https://www.iamshuaidi.com/704.html
>
> ![image-20210430143132215](https://yszhou.oss-cn-beijing.aliyuncs.com/img/202201181113067.jpg)
>
> ![image-20210430143157173](https://yszhou.oss-cn-beijing.aliyuncs.com/img/202201181113799.jpg)
>
> A类，前8bit是网络号，其余24bit主机号，0开头，网络最多
> B类，前16bit网络号，其余16bit主机号，10开头
> C类，前24bit网络号，8bit主机号，110开头
> D类，1110开头
>
> ABC都是一对一
>
> 



ipv4地址不够，如何解决

> https://www.iamshuaidi.com/4128.html
> NAT协议，ipv6



ip地址和mac地址的区别，各自的应用

> https://www.iamshuaidi.com/4126.html
>
> IP 地址主要用来网络寻址用的，就是大致定位你在哪里
> MAC 地址，则是身份的唯一象征，通过 MAC 来唯一确认这人是不是就是你，MAC 地址不具备寻址的功能





### ICMP协议与ping命令

internet control message protocol，因特网信报控制协议



ICMP协议，干啥用的
用来检测网络是否通畅



ping命令

> ping属于哪一层？ping命令使用的tcp报文还是udp报文呢？
> **ping命令本身属于应用层，只不过是应用层直接使用网络层ICMP协议，没有经过传输层的TCP或者UDP**
>
> ping命令的原理
> ping命令发送ICMP报文，目标机器接收到之后返回resp。
> 它的原理是：利用网络上机器IP地址的唯一性，给目标IP地址发送一个数据包，通过对方回复的数据包来确定两台网络机器是否连接相通，时延是多少。
>
> 参考下面，有python代码具体实现ping命令
>
> https://www.jianshu.com/p/14113212cd18
> https://www.cnblogs.com/xiaolincoding/p/12571184.html 小林





### ARP协议

address resolution protocol，地址解析协议
ARP协议是干什么的



为什么要有ARP协议？为什么必须要依赖MAC地址，不能直接用IP地址吗？



每个主机都会有ARP缓存（一张表，保存ip->MAC的映射）
进行包转发的时候，只知道包的IP地址，需要动态的查找MAC地址。
如果本机ARP没有对应IP的MAC，就会进行广播。（广播的时候带上本机的IP和MAC，所有收到的机器会直接保存到自己的ARP中）
目标IP的机器收到之后，进行回应。
而本机收到回应之后，先添加对应的IP->MAC的映射到本机ARP中，再进行转发。



如果源主机一直没有收到响应，表示ARP查询失败。

如果所要找的主机和源主机不在同一个局域网上，那么就要通过 ARP 找到一个位于本局域网上的某个路由器的硬件地址，然后把分组发送给这个路由器，让这个路由器把分组转发给下一个网络。剩下的工作就由下一个网络来做。





## 传输层

==传输层提供了进程间的逻辑通信==，把数据包从主机的进程送到目标主机的进程

==网络层只把分组发送到目的主机==



重要的是TCP的三次握手、四次挥手，可靠传输的原理，滑动窗口的理解



### UDP和TCP

* 传输控制协议 TCP（Transmission Control Protocol）是面向连接的，==提供可靠交付==，有流量控制，拥塞控制，提供全双工通信，面向字节流（把应用层传下来的报文看成字节流，把字节流组织成大小不等的数据块），每一条 TCP 连接只能是点对点的（一对一）。
* 用户数据报协议 UDP（User Datagram Protocol）是无连接的，==尽最大可能交付==，没有拥塞控制，面向报文（对于应用程序传下来的报文不合并也不拆分，只是添加 UDP 首部），支持一对一、一对多、多对一和多对多的交互通信。



### UDP 和 TCP 的首部格式

https://www.jianshu.com/p/cb94b0ee1584



TCP首部结构

> ![img](https://upload-images.jianshu.io/upload_images/22751020-61f7187ed07cbbe4.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)
>
> 源port 2字节
> 目的port 2字节
> 序列号 4字节
> 应答号 4字节



UDP首部结构

> ![img](https://upload-images.jianshu.io/upload_images/22751020-8fb24b507cd4c0ca.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)
>
> 首部长度8字节
>
> 源端口号：发送方的端口号
> 目的端口号： 接收者的端口号
> 长度：表示UDP报文段的长度(包括首部和数据)
> 校验和：接收方用于校验该报文段中是否存在了差错
> 应用数据：报文实体数据。

首部格式中重要的是序列号seq，确认号ack，以及标志位

* 序列号seq：占4个字节，用来标记数据段的顺序，TCP把连接中发送的所有数据字节都编上一个序号，第一个字节的编号由本地随机产生；给字节编上序号后，就给每一个报文段指派一个序号；序列号seq就是这个报文段中的第一个字节的数据编号。
* 确认号ack：占4个字节，期待收到对方下一个报文段的第一个数据字节的序号；序列号表示报文段携带数据的第一个字节的编号；而确认号指的是期望接收到下一个字节的编号；因此当前报文段最后一个字节的编号+1即为确认号。

| 字段 |                             含义                             |
| ---- | :----------------------------------------------------------: |
| URG  |       紧急指针是否有效。为1，表示某一位需要被优先处理        |
| ACK  |                 确认号是否有效，一般置为1。                  |
| PSH  |        提示接收端应用程序立即从TCP缓冲区把数据读走。         |
| RST  |                 对方要求重新建立连接，复位。                 |
| SYN  | 请求建立连接，并在其序列号的字段进行序列号的初始值设定。建立连接，设置为1 |
| FIN  |                        希望断开连接。                        |







### TCP建立连接三次握手

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210708180832.png" alt="image-20210708180831975" style="zoom:80%;" />

谁发送了报文，比特位如何设置，序列号/应答号如何，进入什么状态

* 第一次握手：Client将SYN置1，随机产生一个初始序列号seq=x，发送请求连接报文给给Server，进入==SYN_SENT状态==；
<br>
* 第二次握手：Server收到Client的SYN=1之后，知道客户端请求建立连接，将自己的SYN置1，ACK置1，产生一个acknowledge number（确认号ack）=x+1，并随机产生一个自己的初始序列号seq=y，发送给客户端；进入==SYN_RCVD状态==；
<br>
* 第三次握手：客户端检查，检查是否有ACK，ACK序号是否为x+1；
  客户端检查正确之后，设置ACK=1，ack序号=服务器的y+1，发送给服务器，进入==ESTABLISHED状态==；
  服务器接收之后，检验ACK，以及ack是否=y+1；
  检验正确，服务器进入==ESTABLISHED状态==；
  连接建立。



### TCP断开连接四次挥手

<img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210708182806.png" alt="image-20210708182806757" style="zoom:80%;" />





- 第一次挥手：客户端，置位FIN，发送seq=x给server，进入FIN-wait1（客户端已经没有需要发送的数据了）
- 第二次挥手：服务器，接受之后，置位ACK，确认序号=x+1，进入==close-wait==状态
- 第三次挥手：服务器，直到等到服务器没有需要发送的数据之后，置位FIN，seq=y，确认序号=x+1，进入last-ack状态
- 第四次挥手：客户端，接收到服务器的FIN之后，置位ACK，seq=x+1, 确认序号=y+1，进入==time-wait==状态。
  此后，客户端等待2个MSL（报文段最长寿命）之后，如果没有收到任何FIN，就断开连接；
  服务器收到ACK之后，也断开连接



### 握手

#### 为什么建立需要三次握手

TCP建立连接，实质上就是建立一个可靠的双向信道，一个方向一个来回，**每一边都自带超时重传来确保可靠性**(而不是靠握手的次数)。
==握手的过程告知对方自己的初始序列号，以及确认对方接收到了序列号。也就是说，建立连接的本质，是为了同步双方的初始化序列号==。

TCP连接的建立，实际上应该是4次握手，3次握手是优化的结果，是将来自服务器的ACK和SYN进行合并的结果。



#### 为什么不能两次

如果只是两次握手， 至多只有连接发起方的起始序列号能被确认， 另一方选择的序列号则得不到确认。



#### 为什么不建议四次握手

三次握手是优化的结果，没必要进行四次握手

四次握手指的是
TCP第二次握手拆成两部分，第一部分，服务器只发送ACK和确认序号；第二部分，服务器再进行SYN和初始序列号
原本协议中的第三次握手，成了第四次握手

四次握手降低了数据传输效率，服务器的二三部分可以放在一个包里进行合并
可以四次握手，可以但没必要



#### 三次握手中客户端的ACK未送达服务器，会怎样？

服务器==超时重发ACK+SYN，如果重发5次仍然没有连接成功，就关闭连接==
客户端收到之后，也是重发ACK给服务器，==服务器如果收到，那么回应RST==



#### 如果建立完成，但是客户端出现了故障，如何处理?

服务器每次收到请求，都会重置对应的计时器，一般为2个小时。
如果2个小时内服务器没有收到客户端的请求，就会以75秒为周期，发送探测报文，连续发送10次之后，如果没有回应，服务器就会关闭连接



### ==挥手==

####  为什么断开需要四次挥手

对称释放
断开并确保收到回复，每个方向需要一个来回
合并，三次
但是第二次和第三次不能合并



#### 第二次挥手和第三次挥手不能合并的原因

客户端发送FIN，代表客户端已经没有数据需要发送。
服务器接收到之后可以回复ACK，进入close-wait状态。（==这个状态就是为了让服务器将没有发送完毕的数据发送完毕==）
但是服务器可能还有数据没有传输完毕
传输完毕之后，服务器会发送FIN，表明服务器没有数据需要发送，可以断开连接



#### 客户端TIME_WAIT状态的意义

第四次挥手，客户端回复的ACK有可能丢失
一旦服务器超出一定时间没有收到ACK，就会重发FIN
如果客户端在TIME_WAIT状态下收到FIN，就代表之前的ACK丢失，需要重新发送ACK，再次等待2\*MSL
直到超时没有收到FIN，则认为连接断开完毕

==假如说没有这个状态， 客户端收到FIN之后立即回复ACK并断开连接，一旦ACK丢包，那么服务器就不会释放资源，不断超时重发FIN==

TIME_WAIT这个状态，是为了重发可能丢失的ACK报文，从而确保服务器可以断开连接，避免服务器不断发送FIN



MSL(Maximum Segment Lifetime)，指一个片段在网络中最大的存活时间，2MSL就是一个发送和一个回复所需的最大时间。如果直到2MSL，Client都没有再次收到FIN，那么Client推断ACK已经被成功接收，则结束TCP连接。





### ==TCP可靠传输==

TCP 通过：方式来保证传输的可靠性

> 1 序列号、应答号、超时重传
> 发送方在一定时间内没有收到回复，就会认为丢包，超时重传。(这个时间一般是 报文段往返时间 +一个偏差值)
> 接收方回复的应答号代表下次需要收到的序列号。
>
> 2 滑动窗口和快速重传（重复确认应答）
> 不采用窗口，那么每个包就需要等待对应的回复。
> TCP采用窗口，来提高数据传输速度。窗口内的数据，不需要等到上一个数据的回复，就可以立即发送。
>
> 采用窗口，如果某个包丢失，接收方立即告知发送方丢失的包的序列号。
> 发送方重复3次接收到序列号之后，立刻重发这个数据包，而不再等超时重发
>
> 3 拥塞控制





### TCP滑动窗口

内核空间中内存的一部分，包括发送缓冲区，接收缓冲区
用于暂存数据



窗口大小如何调节

>  双方各有一个BUFFER，接收方建立连接的时候，告知发送方，自己的窗口大小，从而发送方可以选择合适的值设置自己的窗口大小。



窗口如何滑动

>  发送缓冲区的左侧数据已经得到确认，就可以向右移动，直到最左侧数据不再是"已经发送但是还没有收到数据"这个阶段
> 接收缓冲区，一旦左侧数据交付给进程，就可以向右移动窗口



### 流量控制和拥塞控制的区别

流量控制是点对点，目的在于调节发送方的窗口大小，避免发送太快，导致接收方窗口大小不足或者处理速度过慢
拥塞控制是针对整个网络，对窗口的大小进行动态的调整，目的在于避免一开始的时候将大量数据包发送到网络中，导致网络阻塞，或者网络崩溃，降低网络性能





### TCP拥塞控制的算法

https://www.zhihu.com/question/264518499

为什么要有拥塞控制？
==在网络拥塞的情况下，发包会丢失，继续重传，会导致网络拥堵情况更严重。所以需要拥塞控制==

拥塞控制的四个算法：慢启动、拥塞避免、快重传、快恢复



#### 慢启动

刚开始发送数据，拥塞窗口大小为1，每一轮传输，窗口大小增加一倍

> 刚开始发送数据时，先把拥塞窗口（congestion window）设置为一个最大报文段MSS的数值，每收到一个新的确认报文之后，就把拥塞窗口加1个MSS。这样每经过一个传输轮次（或者说是每经过一个往返时间RTT），拥塞窗口的大小就会加倍（慢启动，说的是拥塞窗口，窗口大小从1逐渐增大，吞吐量逐渐增大）



#### 拥塞避免

当窗口大小达到慢启动阈值之后，窗口大小就不能指数增加，而是线性增加）

> 当拥塞窗口的大小达到慢启动阈值(slow start threshold)时，开始执行拥塞避免算法，拥塞窗口大小不再指数增加，而是线性增加，即每经过一个传输轮次只增加1MSS



无论在慢开始阶段还是在拥塞避免阶段，只要发送方判断网络出现拥塞（其根据就是==没有收到确认，触发超时重传==），就要把慢启动阈值设置为，出现拥塞时发送方窗口值的一半（但不能小于2）。然后把==拥塞窗口重新设置为1，重新慢启动==。（这是不使用快重传的情况）

---



#### ==快重传==

接收方接收到失序的数据包之后，==**立刻发出重复确认**==（为的是使发送方及早知道有报文段没有到达对方）==而**不要等到自己发送数据时捎带确认**==。
发送方连续收到三个重复确认之后，立即重传丢失的报文，而不是等待超期重传



#### 快恢复

当发送方连续收到三个重复确认时，就把==慢启动阈值减半（新窗口=新阈值=旧窗口的1/2）==，然后==执行拥塞避免==算法。

为什么不进行慢启动？
发送方能够连续收到三个重复确认，代表网络没有堵塞（如果网络堵塞，那么不会收到3个重复确认，）既然网络状况良好，就没有必要慢启动



>（快重传，快恢复，参照https://blog.csdn.net/wdscq1234/article/details/52529994）
>
>（超时重传，参照https://blog.csdn.net/wdscq1234/article/details/52476231）
>（SACK，参照https://blog.csdn.net/wdscq1234/article/details/52503315）
>
>（也有的快重传是把开始时的拥塞窗口cwnd值再增大一点，即等于 ssthresh + 3*MSS 。这样做的理由是：既然发送方收到三个重复的确认，就表明有三个分组已经离开了网络。这三个分组不再消耗网络的资源而是停留在接收方的缓存中。可见现在网络中减少了三个分组。因此可以适当把拥塞窗口扩大些。）
>





### TCP与UDP小结

面向连接：TCP面向连接，UDP无连接（发送数据之前<u>不需要建立连接</u>
可靠性：TCP可靠，UDP不可靠（收到之后<u>不会返回确认</u>
传输：TCP字节流，UDP报文（TCP发送的时候以字节为单位，一个数据包可能拆成多个组进行发送；UDP一次只能发一个完整的报文
拥塞控制：TCP有，UDP无
开销：TCP header20字节，UDP header 8字节（端口2B+端口2B+大小2B+校验和2B=8B 不需要seq和ack，因此节省了8B
传输：TCP点对点，UDP支持一对一，一对多，多对一，多对多
UDP不需要维护复杂的连接状态

一些应用实时性要求较高的，选择UDP，比如游戏，媒体通信，实时视频流（直播），这些即使出现传输错误也是可以容忍的。其他大部分情况下，HTTP都用TCP，因为要求传输的内容可靠（UDP是不可靠的），不出现丢失。





## 应用层



### DNS协议

DNS干啥的？是哪个层的协议？
域名解析，域名转化到IP地址。应用层协议



DNS使用的是TCP还是UDP协议？端口号？什么情况下使用TCP？

> DNS 可以使用 UDP 或者 TCP 进行传输，使用的端口号都为 53。大多数情况下 DNS 使用 UDP 进行传输，这就要求域名解析器和域名服务器都必须自己处理超时和重传从而保证可靠性。在两种情况下会使用 TCP 进行传输：
>
> * 如果返回的响应超过的 512 字节（UDP 最大只支持 512 字节的数据）。
> * 区域传送（区域传送是主域名服务器向辅助域名服务器传送变化的那部分数据）。
>
> https://www.cnblogs.com/wuyepeng/p/9835839.html



DNS解析过程

> 首先查浏览器DNS缓存
> 再查本机host文件
> 再询问DNS服务器，具体的询问过程如下：
>
> 本机向本地DNS服务器询问（递归询问），本地DNS服务器向上询问（迭代询问）：
> https://www.iamshuaidi.com/1322.html
> 本机问本地DNS，问对应的IP地址，
> 如果本地服务器知道，就返回对应的IP；
> 如果本地服务器不知道，就替代本机进行下一步询问（询问根域名服务器），而不是让主机去询问根域名服务器。最后要么找到对应的IP，要么没有找到。
>
> 而本地服务器先问根域名服务器，得知顶级域名服务器之后，本地服务器再去询问顶级域名服务器。
>
> https://juejin.cn/post/6988794419910541348#heading-62



web页面请求过程

> 1.浏览器查询 DNS，获取域名对应的IP地址:
> （依次是浏览器的DNS缓存，本地的HOST文件，本地DNS服务器进行查询）对于向本地DNS服务器进行查询
> 首先查找本地DNS缓存，命中则返回；
> 如果没有，则向上发起查询(递归查询或者迭代查询），获取对应的DNS服务器地址，本地DNS向目标DNS服务器发起询问，获取域名到IP的映射关系，返回给客户端；
>
> 2.浏览器获得域名对应的IP地址以后，本地端口随机，对方默认端口80，浏览器发起三次握手，==建立连接==；
>
> 3.TCP/IP链接建立起来后，浏览器生成HTTP报文，并发送给服务器；
>
> 4.服务器接收到这个请求，解析请求，进行处理完毕，生成数据，返回给客户端；
>
> 5.浏览器接收到数据后，==释放连接==
>
> 6.解析并渲染视图，若遇到对js文件、css文件及图片等静态资源的引用，则重复上述步骤并向服务器请求这些资源；
>
> 6.浏览器根据其请求到的资源、数据渲染页面，最终向用户呈现一个完整的页面。



DNS劫持？
帅地https://www.iamshuaidi.com/4112.html



### HTTP协议



参考博客

<https:github.com/CyC2018/CS-Notes/blob/master/notes/HTTP.md>

<https://github.com/wolverinn/Waking-Up/blob/master/Computer%20Network.md>



HTTP方法

> https://www.iamshuaidi.com/1318.html



Get和POST的区别

> 简单区别
>
> GET主要用来获取资源
> POST主要用来发送数据
>
> 
>
> 详细比较
>
> https://www.iamshuaidi.com/683.html
>
> 携带参数的方法不同：
> GET是在URL中携带参数，POST是在body中添加参数
> 参数的字符不同：
> GET只能ASCII字符，对于中文字符需要转义，POST则不需要
>
> 安全性不同：
> 什么是HTTP请求的安全性？定义：安全的HTTP请求，不会改变服务器的状态。
> GET是安全的，只读服务器数据
> POST不安全，会改变服务器的状态
>
> 幂等：什么是幂等：幂等的HTTP请求，同一个请求执行一次的结果，和重复执行若干次的结果，应当一致
> GET幂等；POST不幂等
>
> 缓存：
> GET的数据可以缓存，POST数据大多情况不可缓存
>
> 
>
> https://juejin.cn/post/6988794419910541348#heading-7
>
> **请求参数**：GET 把参数包含在 URL 中，用&连接起来；POST 通过 request body 传递参数。
>
> **请求缓存**：GET请求会被主动Cache，而POST请求不会，除非手动设置。
>
> **收藏为书签**：GET请求支持收藏为书签，POST请求不支持。
>
> **安全性**：POST比GET安全，GET请求在浏览器回退时是无害的，而POST会再次请求。
>
> **历史记录**：GET请求参数会被完整保留在浏览历史记录里，而POST中的参数不会被保留。
>
> **编码方式**：GET请求只能进行url编码，而POST支持多种编码方式。
>
> **参数数据类型**：GET只接受ASCII字符，而POST没有限制数据类型。



HTTP状态码

> https://www.iamshuaidi.com/693.html
>
> 分类：
> 2xx 请求成功
> 3xx 需要重定向，需要客户端重发请求
> 4xx 客户端的请求报文错误
> 5xx 服务器内部错误
>
> 常见状态码
> 404 客户端要求的资源不存在
> 400 客户端请求错误
> 403 服务器禁止访问
>
> 500 服务器内部错误
> 503 服务器繁忙
>
> 200 请求成功，返回resp
>
> 301 永久重定向，客户端会进行缓存
> 302 临时重定向，不会缓存
> **304 协商缓存命中？？？**
>
> 状态码 重定向301和302的详细区别
> https://www.iamshuaidi.com/695.html



http报文header

> 





cookie和session

> https://www.iamshuaidi.com/1998.html
>
> 
>
> https://github.com/CyC2018/CS-Notes/blob/master/notes/HTTP.md
>
> session
>
> 除了可以将用户信息通过 Cookie 存储在用户浏览器中，也可以利用 Session 存储在服务器端，存储在服务器端的信息更加安全。
>
> Session 可以存储在服务器上的文件、数据库或者内存中。也可以将 Session 存储在 Redis 这种内存型数据库中，效率会更高。
>
> 使用 Session 维护用户登录状态的过程如下：
>
> - 用户进行登录时，用户提交包含用户名和密码的表单，放入 HTTP 请求报文中；
> - 服务器验证该用户名和密码，如果正确则把用户信息存储到 Redis 中，它在 Redis 中的 Key 称为 Session ID；
> - 服务器返回的响应报文的 Set-Cookie 首部字段包含了这个 Session ID，客户端收到响应报文之后将该 Cookie 值存入浏览器中；
> - 客户端之后对同一个服务器进行请求时会包含该 Cookie 值，服务器收到之后提取出 Session ID，从 Redis 中取出用户信息，继续之前的业务操作。
>
> 应该注意 Session ID 的安全性问题，不能让它被恶意攻击者轻易获取，那么就不能产生一个容易被猜到的 Session ID 值。此外，还需要经常重新生成 Session ID。在对安全性要求极高的场景下，例如转账等操作，除了使用 Session 管理用户状态之外，还需要对用户进行重新验证，比如重新输入密码，或者使用短信验证码等方式。
>
> 
>
> cookie与session的选择
>
> - Cookie 只能存储 ASCII 码字符串，而 Session 则可以存储任何类型的数据，因此在考虑数据复杂性时首选 Session；
> - Cookie 存储在浏览器中，容易被恶意查看。如果非要将一些隐私数据存在 Cookie 中，可以将 Cookie 值进行加密，然后在服务器进行解密；
> - 对于大型网站，如果用户所有的信息都存储在 Session 中，那么开销是非常大的，因此不建议将所有的用户信息都存储到 Session 中。





http 1.0 1.1 2.0的特点和区别

> https://www.iamshuaidi.com/681.html



http长连接 短链接

> 长连接和短连接的理解 应用场景？
>
> https://www.iamshuaidi.com/1326.html
>
> http1.0默认使用短连接。客户端每进行一次HTTP操作，就会重新三次握手建立连接，得到响应之后就会断开连接。
>
> http1.1默认使用长连接。使用长连接的情况下，浏览器已经接收到一个网页的响应之后，不会断开TCP连接，再次访问服务器时，会继续使用这个连接。
>
> 
>
> 如何实现长连接？长连接什么情况会超时断开？
>
> https://www.iamshuaidi.com/700.html
>
> 在req header和resp header中设置`connection: keep-alive`
> http1.0支持，但是默认关闭
> http1.1默认开启
>
> linux通过设置tcp连接的三个参数，以检测连接超时断开。
> 建立TCP连接之后，每次收到响应，会重置对应的timer；如果过了2个小时，没有收到，就会以75s为间隔最多重复5次发送探测报文，如果有响应则keep，否则断开连接。
>
> （1）tcp_keepalive_time = 7200（timer2小时）
> （2）tcp_keepalive_intvl = 75（15s间隔发送探测包）
> （3）tcp_keepalive_probes = 5（最多尝试5次）
>
> https://www.cnblogs.com/kevingrace/p/6656095.html
>
> 





- **http 协议头相关**

http数据由请求行，首部字段，空行，报文主体四个部分组成 
首部字段分为：通用首部字段，请求首部字段，响应首部字段，实体首部字段



- **浏览器中输入一个URL发生什么，用到哪些协议？**

>加密与否：明文，安全性
>包的数量：前者3次握手，3个包即可；后者SSL需要9个包，一共12个
>端口号：
>响应速度：
>
>- HTTP 明文传输，数据都是未加密的，安全性较差，HTTPS（SSL+HTTP） 数据传输过程是加密的，安全性较好。
>- 使用 HTTPS 协议需要到 CA（Certificate Authority，数字证书认证机构） 申请证书，一般免费证书较少，因而需要一定费用。证书颁发机构如：Symantec、Comodo、GoDaddy 和 GlobalSign 等。
>- HTTP 页面响应速度比 HTTPS 快，主要是因为 HTTP 使用 TCP 三次握手建立连接，客户端和服务器需要交换 3 个包，而 HTTPS除了 TCP 的三个包，还要加上 ssl 握手需要的 9 个包，所以一共是 12 个包。
>- http 和 https 使用的是完全不同的连接方式，用的端口也不一样，前者是 80，后者是 443。
>- HTTPS 其实就是建构在 SSL/TLS 之上的 HTTP 协议，所以，要比较 HTTPS 比 HTTP 要更耗费服务器资源。





### HTTP与HTTPS



https的工作过程

> https://blog.51cto.com/u_15290941/3047577#2_7
>
> HTTPS=HTTP+SSL(secure socket layer)，中文名安全套接字层，标准化之后TLS 传输层安全（transport layer security）
>
> ![HTTPS(一) -- 基础知识（密钥、对称加密、非对称加密、数字签名、数字证书）_网络_11](https://yszhou.oss-cn-beijing.aliyuncs.com/img/202201180954443.png)
>
> HTTPS是否每次请求都需要在TLS进行密钥传输：
> 不是，每次都传输密钥，耗时
> 如何解决：
> sessionID，引入SSL的最终目的是为了双方共用同一个对称密钥
> 由于HTTP无状态，后续浏览器发送给服务器的数据，加密之后需要告知服务器用哪个对称密钥进行解密。因此服务器将sessionID和对应的对称密钥进行保存，并转发给浏览器。
> 之后浏览器只需要携带sessionID，即可让服务器根据sessionID，找到对应的对称密钥，从而正常解密。
>
> HTTPS的过程：
> ![HTTPS(一) -- 基础知识（密钥、对称加密、非对称加密、数字签名、数字证书）_网络_12](https://yszhou.oss-cn-beijing.aliyuncs.com/img/202201180945979.png)
>
> ![img](https://yszhou.oss-cn-beijing.aliyuncs.com/img/202201181019432.png)
>
> 详细过程：
>
> 0. 服务端必须要有一套数字证书，可以自己制作，也可以向组织申请。区别就是自己颁发的证书需要客户端验证通过，才可以继续访问，而使用受信任的公司申请的证书则不会弹出提示页面，这套证书其实就是一对公钥和私钥。
>
> 1. client 向 server 发送请求 https://baidu.com，然后连接到 server 的 443 端口。
> 2. 服务器传送证书
>    这个证书其实就是公钥，只是包含了很多信息，如证书的颁发机构，过期时间、服务端的公钥，第三方证书认证机构(CA)的签名，服务端的域名信息等内容。
> 3. 客户端解析证书
>    这部分工作是由客户端的 TLS 来完成的，首先会验证公钥是否有效，比如颁发机构，过期时间等等，如果发现异常，则会弹出一个警告框，提示证书存在问题。如果证书没有问题，那么就生成一个随机值（对称密钥）。然后用证书对该随机值进行加密。
> 4. 传送加密信息
>    浏览器传递用证书加密后的对称密钥，以后客户端和服务端的通信就可以对称密钥来进行加密解密了。
> 5. 服务端加密信息
>    服务端用私钥解密，得到了客户端传过来的对称密钥，然后把内容通过该值进行对称加密。



https的优缺点

> https://www.iamshuaidi.com/1332.html
>
> **优点：**
>
> 1. 使用 HTTPS 协议可认证用户和服务器，确保数据发送到正确的客户机和服务器；
> 2. HTTPS 协议是由 SSL + HTTP 协议构建的可进行加密传输、身份认证的网络协议，要比 HTTP 协议安全，可防止数据在传输过程中不被窃取、改变，确保数据的完整性；
> 3. HTTPS 是现行架构下最安全的解决方案，虽然不是绝对安全，但它大幅增加了中间人攻击的成本。
>
> **缺点：**
>
> 1. HTTPS 协议握手阶段比较费时，会使页面的加载时间延长近 50%，增加 10% 到 20% 的耗电；
> 2. HTTPS 连接缓存不如 HTTP 高效，会增加数据开销和功耗，甚至已有的安全措施也会因此而受到影响；
> 3. SSL 证书需要钱，功能越强大的证书费用越高，个人网站、小网站没有必要一般不会用；
> 4. SSL 证书通常需要绑定 IP，不能在同一 IP 上绑定多个域名，IPv4 资源不可能支撑这个消耗；
> 5. HTTPS 协议的加密范围也比较有限，在黑客攻击、拒绝服务攻击、服务器劫持等方面几乎起不到什么作用。最关键的，SSL 证书的信用链体系并不安全，特别是在某些国家可以控制 CA 根证书的情况下，中间人攻击一样可行。





http与https的区别

> https://www.iamshuaidi.com/725.html
>
> https://www.iamshuaidi.com/1330.html
>
> Http协议运行在TCP之上，明文传输，客户端与服务器端都无法验证对方的身份；
>Https是身披SSL(Secure Socket Layer)外壳的Http，运行于SSL上，SSL运行于TCP之上，是添加了加密和认证机制的HTTP。二者之间存在如下不同：
> 
>1、端口不同：前者是80，后者是443；
> 2、资源消耗：和HTTP通信相比，Https通信会由于加减密处理消耗更多的CPU和内存资源；
>3、开销：Https通信需要证书，而证书一般需要向认证机构购买；





### 对称加密与非对称加密

> https://zhuanlan.zhihu.com/p/43789231
>
> 为什么要加密：避免信息泄露
>
> 对称加密：速度快，但是需要明文转发密钥
> 非对称加密：安全性强，计算速度慢
>
> 
>
> 如何加密
>
> sln-1
> 最根本的想法，对称加密，服务器把密钥明文告知浏览器之后，双方通讯都先用密钥加密，收到的数据包用密钥进行解密
> 缺点：密钥是明文发送给客户端的
>
> sln-2
> 服务器有自己的公钥私钥A，浏览器有自己的公钥私钥B
> 服务器明文转发公钥A，浏览器明文转发公钥B
> 之后，服务器发送给客户端的报文用公钥B进行加密，客户端收到之后用私钥B进行解密
> 客户端发送给服务器的报文用公钥A进行加密，服务器用密钥A解密
> 缺陷：只用非对称加密，计算开销大
>
> sln-3 对称加密+非对称加密
> 服务器明文转发公钥A，浏览器用公钥A将对称加密的密钥进行加密后转发给服务器
> 服务器用私钥A进行解密，得到对称密钥
> 之后双方用对称加密，速度快，安全
> 缺陷：中间人攻击
>
> 中间人攻击：
> 原理，服务器有公钥A，黑客有公钥B
> 服务器转发公钥A给黑客，黑客转发公钥B给浏览器
> 浏览器用公钥B对对称密钥进行加密后，转发给黑客，黑客收到之后用私有密钥B进行解密，得到对称密钥
> 黑客再把得到的对称密钥用公钥A加密，转发给浏览器
> 之后浏览器和黑客直接用对称密钥通信，黑客和服务器也用相同的对称密钥通信，导致数据泄露
>
> 解决中间人攻击：
> 根本原因，浏览器无法得知接收到的公钥是来自服务器还是黑客的
> 如何解决，证明浏览器收到的公钥一定是服务器的公钥而不是黑客的公钥
>
> 
>
> 数字证书如何证明公钥来自于请求的服务器而不是来自于黑客？（浏览器收到数字证书之后如何验证）
>
> 数字签名的制作（CA来完成的步骤）：
> 1 CA机构有公钥私钥
> 2 对证书明文进行哈希
> 3 对哈希结果进行私钥加密，作为数字签名
>
> 数字签名的验证过程（由浏览器完成的步骤）
> 1 用CA公钥，对数字签名进行解密，得到hash val1
> 2 对证书明文用哈希函数计算，得到hash val2
> 3 两者相等， 说明证书可信
>
> 为什么制作数字签名的时候需要hash一次：
> 非对称加密效率慢，hash之后得到固定长度，加快了加密解密的速度
>
> 



https的其他两个可以参考的连接

https://www.jianshu.com/p/29e0ba31fb8d

https://juejin.cn/post/6942671833304924197#heading-29









### FTP协议

文件传送协议

常见的有FTP协议，SFTP协议等。

FTP 使用 TCP 进行连接，它需要两个连接来传送一个文件：

* 控制连接：服务器打开端口号 21 等待客户端的连接，客户端主动建立连接后，使用这个连接将客户端的命令传送给服务器，并传回服务器的应答。
* 数据连接：用来传送一个文件数据。

根据数据连接是否是服务器端主动建立，FTP 有主动和被动两种模式：

* 主动模式：服务器端主动建立数据连接，其中服务器端的端口号为 20，客户端的端口号随机，但是必须大于 1024，因为 0~1023 是熟知端口号。
* 被动模式：客户端主动建立数据连接，其中客户端的端口号由客户端自己指定，服务器端的端口号随机。

主动模式要求客户端开放端口号给服务器端，需要去配置客户端的防火墙。被动模式只需要服务器端开放端口号即可，无需客户端配置防火墙。但是被动模式会导致服务器端的安全性减弱，因为开放了过多的端口号。





### DHCP协议

动态主机配置协议

DHCP (Dynamic Host Configuration Protocol) 提供了即插即用的连网方式，用户不再需要手动配置 IP 地址等信息。

DHCP 配置的内容不仅是 IP 地址，还包括子网掩码、网关 IP 地址。





>#### 远程登陆协议
>
>TELNET 用于登录到远程主机上，并且远程主机上的输出也会返回。
>
>TELNET 可以适应许多计算机和操作系统的差异，例如不同操作系统系统的换行符定义。
>
>
>
>#### 电子邮件协议
>
>一个电子邮件系统由三部分组成：用户代理、邮件服务器以及邮件协议。
>
>邮件协议包含发送协议和读取协议，发送协议常用 SMTP，读取协议常用 POP3 和 IMAP。
>
>









# 相关基础知识

大小端问题

[大小端及网络字节序--CSDN](https://blog.csdn.net/z_ryan/article/details/79134980)





交换机和路由器的区别

路由器是网络层，根据ip地址进行寻址，使用IPv4或者IPv6协议

交换机是在数据链路层，根据mac地址进行寻址，使用mac寻址



转发表（MAC）、ARP表、路由表总结参考博客：

[转发表(MAC表)、ARP表、路由表总结](https://cloud.tencent.com/developer/article/1173761)





MSS MTU

**MTU**： Maximum Transmit Unit，最大传输单元，即物理接口（数据链路层）提供给其上层（通常是IP层）最大一次传输数据的大小；以普遍使用的以太网接口为例，缺省MTU=1500 Byte，这是以太网接口对IP层的约束，如果IP层有<=1500 byte 需要发送，只需要一个IP包就可以完成发送任务；如果IP层有> 1500 byte 数据需要发送，需要分片才能完成发送，这些分片有一个共同点，即IP Header ID相同。

**MSS**：Maximum Segment Size ，TCP提交给IP层最大分段大小，不包含TCP Header和 TCP Option，只包含TCP Payload ，MSS是TCP用来限制application层最大的发送字节数。如果底层物理接口MTU= 1500 byte，则 MSS = 1500- 20(IP Header) -20 (TCP Header) = 1460 byte，如果application 有2000 byte发送，需要两个segment才可以完成发送，第一个TCP segment = 1460，第二个TCP segment = 540。



## 粘包问题与解决

什么是粘包和拆包

> https://www.iamshuaidi.com/1310.html
>
> 如果客户端连续不断的向服务端发送数据包时，服务端接收的数据会出现两个数据包粘在一起的情况。
>
> 1. TCP 是基于字节流的，把数据块仅仅看成一连串无结构的字节流，没有边界；
> 2. 在 TCP 的首部没有表示数据长度的字段。
>
> 基于上面两点，在使用 TCP 传输数据时，才有粘包或者拆包现象发生的可能。一个数据包中包含了发送端发送的两个数据包的信息，这种现象即为粘包。
>
> 接收端收到了两个数据包，但是这两个数据包要么是不完整的，要么就是多出来一块，这种情况即发生了拆包和粘包。拆包和粘包的问题导致接收端在处理的时候会非常困难，因为无法区分一个完整的数据包。



TCP粘包是怎么产生的

> https://www.iamshuaidi.com/1312.html
>
> 发送方粘包
> 采用 TCP 协议传输数据的客户端与服务器经常是保持一个长连接的状态（一次连接发一次数据不存在粘包），双方在连接不断开的情况下，可以一直传输数据。但当发送的数据包过于的小时，那么 TCP 协议默认的会启用 Nagle 算法，将这些较小的数据包进行合并发送（缓冲区数据发送是一个堆压的过程）；这个合并过程就是在发送缓冲区中进行的，也就是说数据发送出来它已经是粘包的状态了。
>
> 
>
> 接收方粘包
>
> 接收方采用 TCP 协议接收数据的过程：
> 数据到接收方，从网络模型的下方传递至传输层，传输层的 TCP 协议处理是将其放置接收缓冲区，然后由应用层来主动获取（C 语言用 recv、read 等函数）；
>
> 如果程序中调用的读取数据函数不能及时的把缓冲区中的数据拿出来，而下一个数据又到来并有一部分放入的缓冲区末尾，等我们读取数据时就是一个粘包。（放数据的速度 > 应用层拿数据速度）



怎么解决粘包和拆包

> https://www.iamshuaidi.com/1314.html
>
> 分包机制一般有两个通用的解决方法：
>
> 1 特殊字符控制
> 2 应用层报文首部，记录数据包的长度
>
> tips：UDP 没有粘包问题，但是有丢包和乱序。不完整的包是不会有的，收到的都是完全正确的包。传送的数据单位协议是 UDP 报文或用户数据报，发送的时候既不合并，也不拆分。



## 网络安全 TODO



sql注入

> https://www.iamshuaidi.com/708.html
>
> 概念
> 浏览器嵌入恶意代码，从而攻击服务器数据库
>
> 示例
>
> 原理
>
> 应对方法



XSS跨站脚本攻击

> https://www.iamshuaidi.com/721.html
>
> 攻击对象：攻击用户，窃取用户信息
>
> 原理：留言板场景，恶意用户用恶意的XSS代码作为留言内容进行提交，服务器不经处理直接写入数据库。后续正常用户访问留言板时，恶意脚本就会被浏览器解析，用户一旦点击，就会触发恶意脚本。
>
> 原因：根本原因在于服务器过于相信用户提交的数据，对用户所提交的数据过滤不足
>
> 应对手段：
>
> 1 对于html标签或者js标签进行过滤或者转义
> 2 将重要的cookie标记为http only, 这样的话Javascript 中的document.cookie语句就不能获取到cookie了（如果在cookie中设置了HttpOnly属性，那么通过js脚本将无法读取到cookie信息，这样能有效的防止XSS攻击）；



SYN泛洪攻击

> https://www.iamshuaidi.com/4120.html
>
> SYN泛洪，属于DDOS攻击的一种
>
> 
>
> 攻击对象：服务器，让服务器宕机，不能为用户提供正常的服务
>
> 
>
> 原理
>
> 为了创建拒绝服务，攻击者利用的正是TCP协议的安全缺陷。在接收到初始SYN数据包之后，服务器用一个或多个SYN / ACK数据包进行响应，并等待握手中的最后一步。这是它的工作原理。
>
> 此种攻击是攻击者向目标服务器发送大量的SYN数据包，服务器会响应每一个请求然后返回ACK确认包，并且等待客户端的最终响应。
>
> 因为攻击者通常会采用虚拟ip，所以也就意味着服务器永远不可能接收到最终的确认包。这种情况下当服务器未接收到最终ACK数据包的时候，服务端一般会重试（再次发送SYN+ACK给客户端）并等待一段时间后丢弃这个未完成的连接。
>
> 这段时间的长度我们称为SYN Timeout，一般来说这个时间是分钟的数量级（大约为30秒-2分钟）；一个用户出现异常导致服务器的一个线程等待1分钟并不是什么很大的问题，但如果有一个恶意的攻击者大量模拟这种情况（伪造IP地址），那么服务器端将为了维护一个非常大的半连接列表而消耗非常多的资源。从而造成服务器的崩溃，即使你的服务器系统资源够强大，服务端也将忙于处理攻击者伪造的TCP连接请求而无暇理睬客户的正常请求（毕竟客户端的正常请求比率非常之小）。
>
> 此时，正常用户就会觉得服务器失去响应，这种情况就叫做，服务端收到了SYN Flood攻击（SYN 洪水攻击）。
>
> 
>
> 防范手段
>
> 
