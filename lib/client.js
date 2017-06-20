'use strict';

class Client {
  constructor(socket, dispatchCallback, requestQuit) {
    this.socket = socket;
    this.username = `Guest${Math.floor(Math.random() * 10000)}`;
    socket.on('data', buffer => {
      const message = buffer.toString().trim();
      console.log(message);
      if(/\/\S/.test(message)) {
        const command = /\/\S+/.exec(message)[0].trim();
        const matches = /\/\S+\s(\S+)/.exec(message);
        if(command === '/nick') {
          const oldname = this.username;
          this.username = matches[1];
          dispatchCallback(`${oldname} is now known as ${this.username}`, 'Server');
          return;
        } else if(command === '/dm') {
          const whisper = /\/\S+\s(.+?\s)(.+)/.exec(message)[2];
          console.log(`whisper: ${whisper}`);
          return dispatchCallback(whisper, this.username, matches[1]);
        } else if(command === '/troll') {
          const text = /\/\S+\s(.+?\s)(.+)/.exec(message)[2];
          console.log(`troll text: ${text}`);
          for(let i = 0; i < Number.parseInt(matches[1]); i++) {
            dispatchCallback(text, this.username);
          }
          return;
        } else if(command === '/quit') {
          this.socket.end();
          console.log(`user ${this.username} should quit`);
          return requestQuit();
        }
      }
      dispatchCallback(message, this.username, null);
    });
  }

  sendMessage(string) {
    this.socket.write(`\n${string}\n${this.username}>`);
  }

}

module.exports = Client;
