import express from 'express';
import { resolve } from 'path';
import { WebSocketServer } from 'ws';
import * as http from 'http';

class Server {
  constructor() {
    const app = express();
    const server = http.createServer(app);

    app.use(this.init);

    const connectedApps: any = {};
    const wss = new WebSocketServer({ server, path: '/ws' });
    wss.on('connection', cn => {
      console.log('gaga-------------------------------------connection', cn.protocol);
      Object.assign(connectedApps, { [cn.protocol]: cn });
      cn.on('message', (data, isBinary) => {
        const message = isBinary ? data : data.toString();
        if (connectedApps.client) {
          connectedApps.client.send(message);
        }
      });
    });

    server.listen(3000, '192.168.1.67', () => console.log(`Listening on ${3000}`));
  }

  init(req: any, res: any) {
    res.sendFile(resolve(__dirname, '..', 'index.html'));
  }
}

new Server();
