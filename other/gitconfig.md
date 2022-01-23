

~/.gitconfig

```bash
  [user]
    email = 987912102@qq.com
    name = yszhou
  [alias]
    ck = checkout
    br = branch
    cm = commit
  [core]
    excludesFile = /Users/yszhou/.gitignore_global
    editor = vim
  [includeIf "gitdir:~/mine/"]
    path=.gitconfig-mine
  [includeIf "gitdir:~/open-source/"]
    path=.gitconfig-mine
```





~/.gitignore_global

```bash
.DS_Store
*/.DS_Store
/build
/.vscode

```



~/.gitconfig-mine

```
[user]
	name=yszhou
	email=987912102@qq.com
```

