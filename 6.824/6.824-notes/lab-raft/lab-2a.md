# lab 2a

## recitation
lab 2a主要完成leader election，test func()只有两个，也比较简单。
1. `TestInitialElection2A` 正常运行下，检测只有一个leader，并且前后两次检测term不变
2. `TestReElection2A` 3个raft，其中一个网络故障，检测leader（此时应当有leader选举出来）；再次断开一个raft，那么不应当有leader；恢复一个raft，那么应当有一个leader

## lab-notes

