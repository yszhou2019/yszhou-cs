package main

import (
	"time"
	"fmt"
)

func main(){
	ch:=time.Tick(time.Duration(1)*time.Second)
	for{
		<-ch
		fmt.Println("second")
	}
}
