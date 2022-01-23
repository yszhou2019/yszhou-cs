package main

import "fmt"

func main() {
   
   messages := make(chan string)

   go func() {
   fmt.Println("goroutine")
   messages <- "ping"
 }()

   msg := <-messages
	fmt.Println("main routine")
   fmt.Println(msg)
}
