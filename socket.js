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
    //this.id = socket.id;
    this.id = socket.id;
    this.pos = [
      Math.floor(Math.random() * 20),
      19,
      Math.floor(Math.random() * 20),
    ];
    this.socket = socket;
    this.anim = "Idle"
    this.room = Object.keys(io.sockets.adapter.sids[socket.id])[1];
    //console.log(this.room);
    this.structure = [];

    this.socket.on("pos", (d) => {
     this.rotation = d.rotation
      this.pos = [...d.pos]
      this.spamEveryone();
    });
    this.socket.on("action",(e)=>{
      this.anim = e
    })
    this.socket.on("structure", (e) => {
      if (!STRUCTURE[this.room]) {
        STRUCTURE[this.room] = [];
        STRUCTURE[this.room].push(JSON.parse(JSON.stringify(e)));
      } else STRUCTURE[this.room].push(JSON.parse(JSON.stringify(e)));
      this.buildStructure(e);
    });
    this.spamEveryone();
    this.buildAllStructure();
  }
  spamEveryone() {
    this.socket.emit("pos", [this.id, this.anim,this.rotation,this.pos]);

    USERS.forEach((e) => {
      if (!io.sockets.adapter.sids[e.socket.id]) return;
      if (
        Object.keys(io.sockets.adapter.sids[e.socket.id])[1] ==
        Object.keys(io.sockets.adapter.sids[this.socket.id])[1]
      ) {
        e.socket.emit("pos", [this.id,this.anim, this.rotation,this.pos]);
        this.socket.emit("pos", [e.id,e.anim,e.rotation, e.pos]);
      }
    });
  }
  buildStructure(d) {
    USERS.forEach((e) => {
      if (!io.sockets.adapter.sids[e.socket.id]) return;
      if (
        Object.keys(io.sockets.adapter.sids[e.socket.id])[1] ==
        Object.keys(io.sockets.adapter.sids[this.socket.id])[1]
      ) {
        e.socket.emit("structure", d);
        //this.socket.emit("pos", [e.id, e.pos]);
      }
    });
  }
  buildAllStructure() {
    if (STRUCTURE[this.room]) {
      STRUCTURE[this.room].forEach((e)=>{
        this.socket.emit("structure", e);
      })
    }
  }
}

let USERS = [];
let USERSID = [];
let STRUCTURE = [];

io.on("connection", (socket) => {
  console.log(
    Object.keys(io.sockets.adapter.rooms).filter(
      (e) => e.startsWith("party/") === true
    )
  );
  socket.emit(
    "partyList",
    Object.keys(io.sockets.adapter.rooms).filter(
      (e) => e.startsWith("party/") === true
    )
  );
  console.log("login");
  socket.on("joinParty", (e) => {
    socket.join("party/" + e);
  });
  socket.on("newPlayer", () => {
    //USERS[socket.id] = new ConnectedUser(socket);
    USERS.push(new ConnectedUser(socket));
    USERSID[socket.id] = USERS.length - 1;
  });
  socket.on("disconnect", () => {
    console.log("disconnect");
    let index = USERSID[socket.id];
    delete USERS[index];
    USERS.forEach((e) => {
      e.socket.emit("deletePlayer", socket.id);
      //this.socket.emit("pos", [e.id, e.pos]);
    });
  });
  //socket.on("joinParty", (e)=>{
  //  socket.join(e)
  //})
});

http.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`);
});
