import express from 'express';
import { Server } from 'socket.io';
import http from "http"
import { CollabCore } from "@collabjs/core"
const app = express();
const server = http.createServer(app);

app.get('/', (req, res) => {
  res.send('Application works!');
});

const io = new Server(server);
const collab = new CollabCore(io, {
  authenticate: () => {
    return new Promise(resolve => {
      resolve("edit");
    })
  }
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