const ChatServer = require('../lib/chatserver.js');
const ClientPool = require('../lib/clientpool.js');
const expect = require('expect');
const net = require('net');

describe('chat server', () => {

  it('should be constructed', () => {
    const testServer = new ChatServer(null, null);
    expect(testServer).toExist();
  });

  it('should launch server when started', (done) => {

    const netServerListenHandler = {
      apply(target, context, [port, callback]) {
        expect(port).toEqual(3000);
        expect(callback).toBeA('function');
        done();
      },
    };

    const netServerOnHandler = {
      apply(target, context, [evt, callback]) {
        expect(evt).toEqual('connection');
        expect(callback).toBeA('function');
      },
    };

    const netServerHandler = {};


    const mockNetServer = new Proxy(net.createServer(), netServerHandler);
    mockNetServer.listen = new Proxy(net.createServer().listen, netServerListenHandler);
    mockNetServer.on = new Proxy(net.createServer().on, netServerOnHandler);
    const testServer = new ChatServer(mockNetServer, new ClientPool());
    testServer.start({ port: 3000, callback: () => {}});
  });

});
