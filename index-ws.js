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

process.on('SIGINT', () => {
  console.log('Received SIGINT');
  wss.clients.forEach(function each(client) {
    client.close();
  }
  );
  server.close(()=> shutdownDB());
});


/** begin websocket */
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

  ws.on("open", () => { 
    ws.send("Welcome to my server");
  });

  db.run(`INSERT INTO visitors VALUES (${numClients}, datetime('now'))`);

  ws.on('close', () => {
    wss.broadcast(`Current visitors: ${numClients}`);
    console.log('A client disconnected');
  });
});


/** end websocket */

/** begin database */
const sqlite = require('sqlite3');
const db = new sqlite.Database(':memory:');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS visitors (
    count INTEGER,
    time TEXT
  )`);
});

function getCounts() {
  db.each('SELECT * FROM visitors', (err, row) => {
    console.log(row);
  });
}

function shutdownDB() {
  getCounts();
  console.log('Shutting down database');
  db.close();
  
}
/** end database */