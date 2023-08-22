import express from 'express';
import { Request, Response } from 'express';
import { Server } from 'socket.io';
import http from "http"
import {PocketbaseProvider,CollabCore} from "@collabjs/core";

const app = express();
const server = http.createServer(app);


app.get('/', (req: Request, res: Response) => {
  res.send('Application works!');
});
// const db = new LevelDbProvider('./level-storage');
const pbDb = new PocketbaseProvider({
  url: "http://127.0.0.1:8090",
  admin: {
    email: "",
    password: ""
  }
});

const io = new Server(server);
const collab = new CollabCore(io, {
  db: pbDb,
  authenticate: (handshake) => {
    return new Promise(resolve => {
      // console.log('authenticate', handshake.auth);
      resolve("edit")
    })
  },
  // gcEnabled: true,
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