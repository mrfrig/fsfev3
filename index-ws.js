const express = require('express');
const server = require('http').createServer();
const app = express();
const port = 3000;

app.get('/', (req, res) => {
	res.sendFile('index.html', {root: __dirname});	
});

server.on('request', app);

server.listen(port, () => {
	console.log(`Server running at port ${port}`);
});

/** Begin websocket */
const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({server: server});

wss.broadcast = function broadcast(msg) {
  wss.clients.forEach(function each(client) {
    client.send(msg);
  });
}

wss.on('connection', (ws) => {
  const numClients = wss.clients.size;
  console.log('Clients connected', numClients);

  wss.broadcast(`Current visitors: ${numClients}`);

  if (ws.readyState === ws.OPEN) {
    ws.send("Welcome to my server");
  }

  ws.on('close', () => {
    wss.broadcast(`Current visitors: ${numClients}`);
    console.log('A client disconnected');
  });
});

