const expect = require('expect');
const Client = require('../lib/client.js');

const emptyCallback = () => {};

describe('client', () => {

  it('should construct a new client', () => {
    const mockSocket = { on: emptyCallback };
    const testClient = new Client(mockSocket, emptyCallback, emptyCallback);
    expect(testClient).toExist();
    expect(testClient.username).toMatch(/^Guest/);
  });

  it('should send a message', () => {
    const message = 'test';
    const testForMessage = `^${message}`;
    const mockSocket = {
      on: emptyCallback,
      write: (sentMessage) => {
        expect(sentMessage.trim()).toMatch(new RegExp(testForMessage, 'g'));
      },
    };
    const testClient = new Client(mockSocket, emptyCallback, emptyCallback);
    testClient.sendMessage(message);
  });

});
