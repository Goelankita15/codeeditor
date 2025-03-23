const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
const server = http.createServer(app);

const rooms = [];
app.use(cors({ origin: "http://localhost:3001", methods: ["GET", "POST"] }));
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3001", // Allow frontend origin
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true,
    },
});
io.on("connection", (socket) => {
   

    socket.on("join-room", ({roomid}) => {
        if(!roomid) {
            return;
        }
        console.log(roomid);
        socket.join(roomid);
        if (rooms[roomid]) {
            rooms[roomid].users.push(socket.id);
        } else  {
            rooms[roomid] = {
                users: [],
                code: "",
            }
            rooms[roomid].users.push(socket.id);  
        }
        io.to(roomid).emit("joined user", {users: rooms[roomid].users});
    });

    socket.on("code-change", ({code, roomid}) => {
        rooms[roomid].code = code;
        console.log(roomid, code);
        socket.to(roomid).emit("code recieved", {code: code});
    });
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
