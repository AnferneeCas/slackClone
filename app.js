const express = require("express");
const app = express();
const socketio = require("socket.io");

let namespaces = require("./data/namespaces");

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(process.env.PORT || 3000);
app.get("/", function (req, res) {
  res.sendFile("public/chat.html", { root: __dirname });
});

console.log("running");
const io = socketio(expressServer);

io.on("connection", function (socket) {
  let nsData = namespaces.map((ns) => {
    return {
      img: ns.img,
      endpoint: ns.endpoint,
    };
  });

  socket.emit("nslist", nsData);
});

namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on("connection", function (nsSocket) {
    const username = nsSocket.handshake.query.username;

    nsSocket.emit("nsRoomLoad", namespace.rooms);

    nsSocket.on("joinRoom", function (roomToJoin, numberOfUsersCallback) {
      const roomToLeave = Object.keys(nsSocket.rooms)[1];

      if (roomToJoin != roomToLeave) {
        nsSocket.leave(roomToLeave);
        updateUsersInRoom(namespace, roomToLeave);
        nsSocket.join(roomToJoin);
      }

      io.of(namespace.endpoint)
        .in(roomToJoin)
        .clients(function (error, clients) {
          numberOfUsersCallback(clients.length);
        });

      var nsRoom = namespace.rooms.find(function (room) {
        return room.roomtitle === roomToJoin;
      });
      nsSocket.emit("historyCatchUp", nsRoom.history);
      updateUsersInRoom(namespace, roomToJoin);

      nsSocket.on("disconnect", function () {
        io.of(namespace.endpoint)
          .in(roomToJoin)
          .clients(function (error, clients) {
            io.of(namespace.endpoint)
              .in(roomToJoin)
              .emit("updateMembers", clients.length);
          });
      });
    });
    nsSocket.on("newMessageToServer", function (msg) {
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        username: username,
        avatar: "https://via.placeholder.com/30",
      };
      const roomTitle = Object.keys(nsSocket.rooms)[1];

      var nsRoom = namespace.rooms.find(function (room) {
        return room.roomtitle === roomTitle;
      });

      nsRoom.addMessage(fullMsg);
      io.of(namespace.endpoint).to(roomTitle).emit("messageToClients", fullMsg);
    });
  });
});

setInterval(() => {
  namespaces.forEach((namespace) => {
    namespace.rooms.forEach((room) => {
      room.clearHistory();
    });
  });
}, 86400000);

function updateUsersInRoom(namespace, roomToJoin) {
  io.of(namespace.endpoint)
    .in(roomToJoin)
    .clients(function (error, clients) {
      io.of(namespace.endpoint)
        .in(roomToJoin)
        .emit("updateMembers", clients.length);
    });
}
