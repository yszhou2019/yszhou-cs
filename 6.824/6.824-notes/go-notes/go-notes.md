





>[参考](https://segmentfault.com/a/1190000005064535)
>
>
>
>## 使用 go 关键字和 channel 实现非阻塞调用
>
>##### 阻塞的意思是调用方在被调用的代码返回之前必须一直等待，不能处理别的事情。而非阻塞调用则不用等待，调用之后立刻返回。那么返回值如何获取呢？Node.js 使用的是回调的方式，Golang 使用的是 channel。
>
>```
>/**
> * 每次调用方法会新建一个 channel : resultChan，
> * 同时新建一个 goroutine 来发起 http 请求并获取结果。
> * 获取到结果之后 goroutine 会将结果写入到 resultChan。
> */
>func UnblockGet(requestUrl string) chan string {
>    resultChan := make(chan string)
>    go func() {
>        request := httplib.Get(requestUrl)
>        content, err := request.String()
>        if err != nil {
>            content = "" + err.Error()
>        }
>        resultChan <- content
>    } ()
>    return resultChan
>}
>```
>
>由于**新建的 goroutine 不会阻塞函数主流程的执行**，所以**调用 UnblockGet 方法会立刻得到一个 resultChan 返回值**。一旦 goroutine 执行完毕拿到结果就会写入到 resultChan 中，这时外部就可以从 resultChan 中获取执行结果。





>
>
>Go语言中无缓冲的通道（unbuffered channel）是指在接收前没有能力保存任何值的通道。这种类型的通道要求发送 goroutine 和接收 goroutine 同时准备好，才能完成发送和接收操作。
>
>如果两个 goroutine 没有同时准备好，通道会导致先执行发送或接收操作的 goroutine 阻塞等待。这种对通道进行发送和接收的交互行为本身就是同步的。其中任意一个操作都无法离开另一个操作单独存在。
>
>阻塞指的是由于某种原因数据没有到达，当前协程（线程）持续处于等待状态，直到条件满足才解除阻塞。
>
>在无缓冲通道的基础上，为通道增加一个有限大小的存储空间形成**带缓冲通道**。带缓冲通道在发送时无需等待接收方接收即可完成发送过程，并且不会发生阻塞，只有当存储空间满时才会发生阻塞。同理，如果缓冲通道中有数据，接收时将不会发生阻塞，直到通道中没有数据可读时，通道将会再度阻塞。



无缓冲通道

写入会被阻塞，until有人取出数据

```
package main

import (
    "fmt"
)

func printer(c chan int) {

    // 开始无限循环等待数据
    for {

        // 从channel中获取一个数据
        data := <-c

        // 将0视为数据结束
        if data == 0 {
            break
        }

        // 打印数据
        fmt.Println(data)
    }

    // 通知main已经结束循环(我搞定了!)
    c <- 0

}

func main() {

    // 创建一个channel
    c := make(chan int)

    // 并发执行printer, 传入channel
    go printer(c)

    for i := 1; i <= 10; i++ {

        // 将数据通过channel投送给printer
        c <- i
    }

    // 通知并发的printer结束循环(没数据啦!)
    c <- 0

    // 等待printer结束(搞定喊我!)
    <-c

}
```

