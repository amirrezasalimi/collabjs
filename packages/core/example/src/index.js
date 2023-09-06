import express from 'express';
import { Server } from 'socket.io';
import http from "http"
import { CollabCore, LevelDBProvider, PocketbaseProvider } from '../../dist';

const app = express();
const server = http.createServer(app);


app.get('/', (req, res) => {
  res.send('Application works!');
});
// const db = new LevelDbProvider('./level-storage');
const pbDb = new PocketbaseProvider({
  url: "http://127.0.0.1:8090",
  admin: {
    email: "amirrezasalimi0@gmail.com",
    password: "6EYdE9WmxjJN58B"
  }
});

const io = new Server(server);
const collab = new CollabCore(io, {
  db: new LevelDBProvider(),
  authenticate: (handshake) => {
    return new Promise(resolve => {
      resolve("edit")
    })
  },
})
collab.registerEvents({
  onClientJoined(roomName, doc, socket) {
    console.log(`Client ${socket.id} joined room ${roomName}`)
  },
  onClientLeft(roomName, doc, socket) {
    console.log(`Client ${socket.id} left room ${roomName}`)
  },
})

// Execute initialize method
collab.initialize()

server.listen(3000, () => {
  console.log('Application started on port 3000!');
});