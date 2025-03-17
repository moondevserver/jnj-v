## install

> `package.json`

```sh
# npm timeout 설정
npm config set fetch-timeout 300000

```


## docker

```sh
docker-compose down
docker-compose build --no-cache
docker-compose up -d

docker exec -it nextjs-dev /bin/bash

npm config set fetch-timeout 300000
```


## github

```sh
npm i -g jna-cli

# 설치 디렉토리 검색색
sudo ls -la /usr/local/lib/node_modules/ | grep jna-cli

# 권한 설정
sudo chmod -R 755 /usr/local/lib/node_modules/jna-cli

# create remote repo & local -> remote
xgit -e make -n jnj-v -u moondevserver -d "JnJ-Video in nextjs at HSN(Home Synolgy Nas)"



xgit -e delete -n jnj-v -u moondevserver 
```




===




## jnj-cli 수정 필요


cd /app/sites/jnj-v && git init
cd /app/sites/jnj-v && git branch -m master main
fatal: detected dubious ownership in repository at '/app/sites/jnj-v'
To add an exception for this directory, call:

        git config --global --add safe.directory /app/sites/jnj-v
####@@@@@===== error:  Error: Command failed: cd /app/sites/jnj-v && git branch -m master main
fatal: detected dubious ownership in repository at '/app/sites/jnj-v'
To add an exception for this directory, call:

        git config --global --add safe.directory /app/sites/jnj-v

    at genericNodeError (node:internal/errors:983:15)
    at wrappedFn (node:internal/errors:537:14)
    at checkExecSyncError (node:child_process:882:11)
    at execSync (node:child_process:954:15)
    at m (/usr/local/lib/node_modules/jna-cli/cjs/git.js:1:1969)
    at h (/usr/local/lib/node_modules/jna-cli/cjs/git.js:1:3459)
    at /usr/local/lib/node_modules/jna-cli/cjs/xgit.js:2:2426
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5) {

```sh
xgit -e make 

# !! 추가 필요
git config --global --add safe.directory /app/sites/jnj-v
```