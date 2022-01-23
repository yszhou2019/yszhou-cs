package main

import (
	"fmt"
	"time"
)

func main()  {
	msgchan:=make(chan string)
	go func() {
		for s := range msgchan {
			fmt.Println(s)
		}
	}()
	msgchan<-"123"
	time.Sleep(time.Second)
	msgchan<-"321"
	time.Sleep(time.Second)
}