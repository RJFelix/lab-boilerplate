'use strict';

const Client = require('./client.js');

//TODO: probably just get rid of this entire thing, it's tightly coupled with Client anyways

class ClientPool {
  constructor() {
    this.clients = [];
    this.dispatchMessage = this.dispatchMessage.bind(this);
    this.requestQuit = this.requestQuit.bind(this);
  }

  dispatchMessage(message, sender, receiver) {
    console.log(`new message. from ${sender}. content: ${message}`);
    if(receiver && receiver.length > 0) {
      this.clients.filter((client) => client.username === receiver)[0].sendMessage(`${sender} whispers: ${message}`);
    } else {
      this.send(`${sender}: ${message}`);
    }
  }

  requestQuit(clientID) {
    return () => this.removeClient(clientID);
  }

  add(socket) {
    const clientID = this.clients.push(new Client(socket, this.dispatchMessage, this.requestQuit(this.clients.length))) - 1;
    this.clients[clientID].sendMessage('welcome to the chat server!');
    this.send('a new user connected');
    socket.on('error', (err) => {
      console.log(err);
      this.removeClient(clientID);
    }
    );
    socket.on('close', () => this.removeClient(clientID));
  }

  send(data, clientID = -1) {
    data = data.trim();
    if(clientID >= 0) {
      this.clients[clientID].sendMessage(data);
    } else {
      this.clients.forEach((client) => client.sendMessage(data));
    }
  }

  removeClient(clientID) {
    console.log(`client #${clientID} requested quit`);
    this.clients.splice(clientID, 1);
    this.send('a user disconnected');
  }

}

module.exports = ClientPool;
