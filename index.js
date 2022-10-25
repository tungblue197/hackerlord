const axios = require('axios')
const express = require('express')
const http = require('http');
const { Server } = require("socket.io");

const app = express()
let runTime = 0;

const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/time', (req, res) => res.json({ r: runTime}))


io.on('connection', (socket) => {
    console.log('a user connected', socket);
});

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}



let accountNumber = 10
class Account {
  constructor(i) {
    const fakeAccount = makeid(10)
    this.username = i+ fakeAccount + i;
    this.password = i+ fakeAccount + i;
  }
}

function genarateAccount(amount) {
  let accounts = []
  for (let i = 0; i < amount; i++) {
    accounts.push(new Account(i))
  }
  return accounts;
}

function execute() {
    try{
         let accounts = genarateAccount(accountNumber)
          console.log('processing current account: ', accountNumber * (runTime + 1))
          let prom = []
          accounts.forEach((account, index) => prom.push(login(account, index)))
          runTime++
          Promise.all(prom).then(data => {
            console.log('done: ', runTime)
            console.log('next =>', runTime + 1)
            io.emit('next', runTime)
             setTimeout(execute, 3000)
          }).catch(() => {
            console.log('false : ', runTime)
            console.log('retry : ', runTime)
            io.emit('retry', runTime)
            runTime > 0 ? runTime-- : null
  })
    }catch(e){
        console.log('error...')
        return;
    }
 
  return;
}

function login(account, id) {
  return new Promise(async (res, rej) => {
    let data = await axios(`https://lienminh-membervip.com/api/login?account=${account.username + runTime}&password=${account.password}&format=json&id=166653316066${id}&app_id=10100`)
    res(data)
  })
}

server.listen(process.env.PORT || 3000, () => {
    console.log('listening on *:3000');
    execute()
});
