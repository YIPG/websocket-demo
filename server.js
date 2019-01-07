const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();
app.use(index);
const server = http.createServer(app);
const io = socketIo(server);


io.on("connection", socket => {
    console.log("New client connected"), 
    socket.on('get position', (pos) => {
        console.log(`サーバー側で受け取った, 値は${pos}`)
        io.sockets.emit('get position', pos)
    })
    setInterval(
        () => getApiAndEmit(socket),
        10000
    );
    socket.on("disconnect", () => console.log("Client disconnected"));
});

// const getcurrentpos = async socket => {

// }

const getApiAndEmit = async socket => {
  try {
    const res = await axios.get(
      "https://api.darksky.net/forecast/63c90189edc9dff67808e77d862b41cd/35.691638,139.704616?units=si"
    );
    socket.emit("FromAPI", res.data.currently.temperature);
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};
server.listen(port, () => console.log(`Listening on port ${port}`));