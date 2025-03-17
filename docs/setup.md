## install

> `package.json`

```
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


## jnj-cli 수정 필요


```sh
xgit -e make 

git config --global --add safe.directory /app/sites/jnj-v
```