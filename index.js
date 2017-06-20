const net = require('net');
const ChatServer = require('./lib/chatserver.js');
const ClientPool = require('./lib/clientpool.js');

const chatServer = new ChatServer(net.createServer(), new ClientPool());

chatServer.start({ port: 3000,
  callback: () => console.log('Chat server started on port 3000.'),
});
