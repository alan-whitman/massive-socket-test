const app = require('express')();
const masssive = require('massive');
const io = require('socket.io')();
require('dotenv').config();
const { CONNECTION_STRING: cs } = process.env;
const sc = require('./controllers/socketController');
const mc = require('./controllers/messageController');

masssive(cs).then(db => {
    app.set('db', db);
    console.log('db connected');
})


// app.get('/', (req, res) => {
//     res.send('hi');
// })

app.get('/messages/get_messages', mc.getMessages);


app.listen(3500, () => console.log('3500'));


io.on('connection', client => {
    console.log('client connected: ', client.id);
    client.join('default-room');
    const db = app.get('db');
    client.on('send message', (message) => sc.relayMsg(io, client, db, message));
})

io.listen(3600);