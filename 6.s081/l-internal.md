ref https://pdos.csail.mit.edu/6.S081/2021/lec/l-internal.txt



how syscall entry? how syscall exit and return?



Focus on:
transition from use to kernel

Ignore:
What the syscall's function

When?
syscall, faults, interrupts.In which case, we enter kernel.



what need to do during transition( in user program)?

- CPU resources for user like registers, be saved to this process's memory ( 32 registers, sp, pc, priviledge mode, satp, stvec, sepc ... )
- switch to supervisor mode
- switch to kernel pagetable
- switch to kernel stack
- jump to kernel C code

We don't execute user code in supervisor mode, and don't let user code interfere with the transition. thus, tranparent to user code.



supervisor mode's priviledge?

- can use CPU control register:
  `$satp`  -> stores process's pagetable pa
  `$stvec` -> `ecall` will jumps here; this reg points to `trampoline page`
  `$sepc` -> `ecall` will save user pc
  `$ssctatch` -> address of trapframe
- use PTEs without PTE_U bit(but still only access address in pagetable)





details in transition

1. `write()`
2. `uservec()` in `trampoline.S` -> Kernel state
3. `usertrap()` in `trap.c`
4. `syscall()` in `syscall.c`
5. `sys_write()` in `sysfile.c`
6. `usertrapret()` in `trap.c`
7. `userret()` in `trampoline.S`
8. `write()` returns -> User state



`ecall` in `usys.S`, triggers the user/kernel transition



```asm
.global write
write:
 li a7, SYS_write
 ecall # -> begin transition to kernel state
 ret
```



ecall -> value of $pc is `0000003ffffff000`, `the trampoline page`( the last page )

> thus, now $pc is in page with no PTE_U bit -> in supervisor mode



now, reg `$stvec` is `0x3ffffff000`



**Ecall do 3 things:**

> 1 change mode -> kernel
> 2 save $pc -> $sepc (`p/x $sepc` -> `0xdea`)
> 3 Jump to $stvec( set $pc <- $stvec)

finally, let user code -> supervisor mode



now needs to do( **ecall didn't do these** )

> save 32 user regs
> switch to kernel page
> Set up stack for kernel C
> Jump to kernel C code



Where to save 32 user regs?	

> each process has page at 0x3fffffb000, `trapfram` page( page before the trampoline page);
> this page has space to hold 32 user regs

where to save `trapfram's address` ?

> reg $sscratch



All kinds of register -> p.trapframe

所有user regs存储到了trapframe里面，是哪个进程的trapframe？是用户进程，还是kernel？应该是存储到了用户进程的trapframe里面。

trapframe是个结构体，我们需要用地址来访问trapframe从而存储regs，地址就是存储在 $sscratch的value

用户进程的trapframe里面还保存了this process's kernel stack top

然后转入C code `usertrap()`，加载当前进程的trapframe里面的kernel pagetable， 存入$satp（当前进程的pagetable）

从而用kernel pagetable，执行kernel functions和data



由`usertrap()`调用`syscall()`
执行真正的系统调用，最终的syscall返回值存入p->trapframe->a0



由`syscall()`返回`usertrap()`，执行`usertrapret()`
`usertrapret()`，执行返回到user program的任务，完成以下操作：

```
  stvec = uservec (the trampoline), for the next ecall 重设寄存器，保存trampoline
  traframe satp = kernel page table, for next uservec 恢复kernel pagetable
  traframe sp = top of kernel stack
  trapframe trap = usertrap
  trapframe hartid = hartid (in tp)
```

最终调用汇编函数`userret(TRAPFRAME, pagetable)`, switch from kernel to user



Trampoline page, exists in both user pagetable and kernel pagetable
