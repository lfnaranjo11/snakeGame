# snakeGame

this is a snakegame

## Used technologies:

* cockroachDB distribted database https://www.cockroachlabs.com/
* upper/db data access layer for go https://upper.io/v4/
* golang
* axios: http requests library https://github.com/axios/axios
* vue: front-end framewwork https://vuejs.org/
* phaser: html5 https://phaser.io/
* ion-phaser/core: vue and phaser adapter https://github.com/proyecto26/ion-phaser
* vuetify: material design for vue


## how to run it locally?

deploy locally
1)follow the guide in https://www.cockroachlabs.com/docs/stable/secure-a-cluster.html to create a local cockroachdb cluster

1a) run the creation-db.sql commands in the client of cockroachDB(cockroach sql --insecure --host=localhost:26257)

2)go to the backend folder and run the server.
```
cd back-snake/end-points-chi-go/
go run.

```


3)create a new terminal to turn on the front end server
```
cd front-vue/snake-front
 npm install
 npm run serve

```
4)  run the websockect server
```

 cd  back-snake/new-web-socket-server
 go run *.go

```
