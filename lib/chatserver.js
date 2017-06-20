'use strict';

class ChatServer {
  constructor(netServer, clientPool) {
    this.server = netServer;
    this.clientPool = clientPool;
  }

  start({port, callback}) {
    this.server.on('connection', (socket) => {
      this.clientPool.add(socket);
    });
    this.server.listen(port, callback);
  }
}

module.exports = ChatServer;
