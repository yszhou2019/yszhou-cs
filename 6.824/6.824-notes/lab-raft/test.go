type Raft struct {
	mu        sync.Mutex          // Lock to protect shared access to this peer's state
	peers     []*labrpc.ClientEnd // RPC end points of all peers
	persister *Persister          // Object to hold this peer's persisted state
	me        int                 // this peer's index into peers[]

	// persistent states
	curTerm  int        // latest term server has seen(initialized to 0 on first boot, increases monotonically)
	votedFor int        // candidateId that received vote in current term(or null if none)
	logs     []LogEntry // log entries; each entry contains command for state machine, and term when entry was received by leader(first index is 1)

	// implementation
	state     PeerState
	timer     *RaftTimer
	syncConds []*sync.Cond  // every Raft peer has a condition, use for trigger AppendEntries RPC
}

func (rf *Raft) Make(){
	go func() {
		for {
			select {
			case <-rf.timer.t.C: // election timeout
			// TODO
			// 已经到达timer之后，开始成为候选者发起投票，这里为什么要reset timer?
				rf.resetElectTimer() // this reset is necessary, reset it when timeout
				rf.vote()
			}
		}
	}()
}

// start vote
// leader can start vote repeatedly, such as 2 nodes are crashed in 3 nodes cluster
// leader should reset election timeout when heartbeat to prevent this
func (rf *Raft) vote() {
	pr("Vote|Timeout|%v", rf)
	rf.curTerm++
	rf.state = Candidate
	rf.votedFor = rf.me

	args := RequestVoteArgs{
		Term:        rf.curTerm,
		CandidateID: rf.me,
	}
	// 开1000个goroutine并行RPC，并且最晚1s之后shutdown
	replyCh := make(chan RequestVoteReply, len(rf.peers))
	var wg sync.WaitGroup
	for i := range rf.peers {
		if i == rf.me {
			rf.resetElectTimer() // other followers will reset when receive valid RPC, leader same
			continue
		}

		wg.Add(1)
		go func(server int) {
			defer wg.Done()
			var reply RequestVoteReply
			respCh := make(chan struct{})
			go func() {
				rf.sendRequestVote(server, &args, &reply)
				respCh <- struct{}{}
			}()
			select {
			case <-time.After(RPC_CALL_TIMEOUT): // 1s
				return
			case <-respCh:
				replyCh <- reply
			}
		}(i)
	}
	// 释放channel，channel不可写，但仍然可以读
	go func() {
		wg.Wait()
		close(replyCh) // avoid goroutine leak
	}()

	votes := 1
	majority := len(rf.peers)/2 + 1
	// 结果统计
	for reply := range replyCh {
		if reply.Term > rf.curTerm { // higher term leader
			pr("Vote|Higher Term:%d|%v", reply.Term, rf)
			rf.back2Follower(reply.Term, VOTE_NIL)
			return
		}
		if reply.VoteGranted {
			votes++
		}

		if votes >= majority { // if reach majority earlier, shouldn't wait crashed peer for timeout
			rf.state = Leader
			go rf.heartbeat()
			go rf.sync()

			pr("Vote|Win|%v", rf)
			return
		}
	}

	// split vote
	pr("Vote|Split|%v", rf)
	rf.back2Follower(rf.curTerm, VOTE_NIL)
}

type RequestVoteArgs struct {
	Term        int
	CandidateID int
}

type RequestVoteReply struct {
	Term        int
	VoteGranted bool
}

func (rf *Raft) RequestVote(args *RequestVoteArgs, reply *RequestVoteReply) {
	reply.Term = rf.curTerm
	reply.VoteGranted = false

	if args.Term < rf.curTerm {
		return // candidate expired
	}
	if args.Term > rf.curTerm {
		rf.back2Follower(args.Term, VOTE_NIL)
	}
	// now the term are same

	if rf.votedFor == VOTE_NIL || rf.votedFor == args.CandidateID {
		reply.VoteGranted = true
		rf.back2Follower(args.Term, args.CandidateID)
	}
}

type LogEntry struct {
	Term    int
	Command interface{}
}

// leader sync logs to followers
// leader 独立线程运行
func (rf *Raft) sync() {
	for i := range rf.peers {
		if i == rf.me {
			continue
		}

		go func(server int) {
			for {
				rf.mu.Lock()
				rf.syncConds[server].Wait() // wait for trigger

				args := AppendEntriesArgs{
					Term:         rf.curTerm,
					LeaderID:     rf.me,
					PrevLogIndex: 0,
					PrevLogTerm:  0,
					Entries:      nil, // heartbeat entries are empty
				}
				rf.mu.Unlock()

				// do not depend on labrpc to call timeout(it may more bigger than heartbeat), so should be check manually
				var reply AppendEntriesReply
				respCh := make(chan struct{})
				go func() {
					rf.sendAppendEntries(server, &args, &reply)
					respCh <- struct{}{}
				}()
				select {
				case <-time.After(RPC_CALL_TIMEOUT): // After() with currency may be inefficient
					continue
				case <-respCh: // response succ
				}

				if reply.Term > rf.curTerm { // higher term
					rf.back2Follower(reply.Term, VOTE_NIL)
					return
				}
			}
		}(i)
	}
}

// send heartbeat
// leader 独立线程运行
func (rf *Raft) heartbeat() {
	// time.Tick 
	ch := time.Tick(HEARTBEAT_INTERVAL)
	for {
		if !rf.isLeader() {
			return
		}

		for i := range rf.peers {
			if i == rf.me {
				continue
			}

			rf.syncConds[i].Broadcast()
		}
		<-ch
	}
}

func (rf *Raft) AppendEntries(args *AppendEntriesArgs, reply *AppendEntriesReply) {
	reply.Term = rf.curTerm
	reply.Succ = false

	if rf.curTerm > args.Term {
		return // leader expired
	}

	rf.back2Follower(args.Term, VOTE_NIL)
	reply.Succ = true
}