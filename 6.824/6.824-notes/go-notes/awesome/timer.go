package main

import (
	"log"
	"time"
)

func main(){
	t:=time.NewTimer(time.Second*time.Duration(1))

	log.Println("倒计时开始")
	time.Sleep(time.Second*time.Duration(3))
	select {
	case <-t.C:
		log.Printf("hello")
	}
	log.Printf("world")

}