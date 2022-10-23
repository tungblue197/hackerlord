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


let accountNumber = 10
class Account {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }
}

function genarateAccount(amount) {
  let accounts = []
  for (let i = 0; i < amount; i++) {
    accounts.push(new Account(i + 'xchangccck2' + i, i + 'changen2ick12'))
  }
  return accounts;
}

function execute() {
  let accounts = genarateAccount(accountNumber)
  console.log('processing current account: ', accountNumber * (runTime + 1))
  let prom = []
  accounts.forEach((account, index) => prom.push(login(account, index)))
  runTime++
  Promise.all(prom).then(data => {
    console.log('done: ', runTime)
    console.log('next =>', runTime + 1)
    io.emit('next', {runTime, next: runTime + 1 })
    setTimeout(() => {
      execute()
    }, 100)
  }).catch(() => {
    console.log('false : ', runTime)
    console.log('retry : ', runTime)
    io.emit('retry', {runTime, next: runTime - 1 })
    runTime > 0 ? runTime-- : null
  })
  return;
}

function login(account, id) {
  return new Promise(async (res, rej) => {
    let data = await axios(`https://lienminh-membervip.com/api/login?account=${account.username + runTime}&password=${account.password}&format=json&id=166653316066${id}&app_id=10100`)
    res(data)
  })
}

server.listen(3000, () => {
    console.log('listening on *:3000');
    execute()
});