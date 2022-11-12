const express = require("express");
const app = express();
const http = require("http").createServer(app);
const path = require("path");
const port = process.env.PORT || 3000;
const io = require("socket.io")(http, {
  cors: { originF: "*" },
});

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index with bos copy socket.html");
});

class ConnectedUser {
  constructor(socket) {
    this.id = socket.id;
    this.pos = [
      Math.floor(Math.random() * 20),
      19,
      Math.floor(Math.random() * 20),
    ];
    this.socket = socket;
    this.socket.on("pos", (d) => {
      this.pos = [...d];
      this.spamEveryone();
    });
    this.spamEveryone();
  }
  spamEveryone() {
    this.socket.emit("pos", [this.id, this.pos]);

    USERS.forEach((e) => {
      e.socket.emit("pos", [this.id, this.pos]);
      this.socket.emit("pos", [e.id, e.pos]);
    });
  }
}

let USERS = [];

io.on("connection", (socket) => {
  console.log("login");
  socket.on("newPlayer", () => {
    USERS[socket.id]=new ConnectedUser(socket)
  });
  socket.on("disconnect", () => {
    console.log("disconnect");
    delete USERS[socket.id]
    USERS.forEach((e) => {
      e.socket.emit("deletePlayer", socket.id);
      //this.socket.emit("pos", [e.id, e.pos]);
    });
  });
});

http.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`);
});
