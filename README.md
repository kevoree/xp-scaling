## Test Kevoree JS scaling using Docker

### Install
```
npm i
```

### Create the necessary scripts
```
node create-script.js
```

> You can also specify a number of nodes in the command-line arguments (to override the default of 5)
> `node create-script.js 15`

### Install modules locally
```
npm i kevoree-node-javascript kevoree-group-centralizedws --prefix=$HOME/.kevoree
```

> Containers will mount `$HOME/.kevoree` in order to save some time


### Run
```
docker-compose up
```
