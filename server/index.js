const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes.js");
const messageRoute = require("./routes/messageRoute.js");
const socket = require("socket.io");
const path = require("path");

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth",userRoutes);
app.use("/api/messages",messageRoute);

// ------------ Code For Deployment -------------

if(process.env.NODE_ENV === "production") {
  const dirpath = path.resolve();
  app.use(express.static('./public/dist'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(dirpath, './public/dist', 'index.html'));
  });
}

mongoose.connect(process.env.MONGO_URL).then(()=>{
  console.log("DB connection successfully");
}).catch((err)=>{
  console.log(err.message);
});
PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});

// socket.io 

const io = socket(server,{
  cors:{
    origin:"https://chat-app-1a3d.onrender.com",
    credentials:true
  },
})

global.onlineUsers = new Map();

io.on("connection",(socket)=>{
  global.chatSocket = socket;
  socket.on("add-user",(userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg",(data)=>{
    const sendUserSocket = onlineUsers.get(data.to);
    if(sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve",data.message);
    }
  });
});
