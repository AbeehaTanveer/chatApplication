const http = require('http');
const express = require("express");
const cors = require('cors');
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

const URL_S=""
const io  = socketIO(server, {
  cors: {
    origin: `${URL_S}`,
    methods: ["GET", "POST"],
  }
});

// Middleware setup
app.use(cors());

// Handle new socket connections
io.on("connection", (socket) => {
  console.log("New Connection");

  // Handle 'foo' event from client
  socket.on('foo', (data) => {
    console.log(data);

    // Broadcast a message to other clients except the sender
    socket.broadcast.emit("Anonymous", { data: `${data.name} joined the chat` });

    // Send a welcome message to the sender
    socket.emit("welcome", { data: `Welcome ${data.name} to the chat` });
  });

  // Handle 'message' event from client
  socket.on("message", ({ message, name, avatarUrl }) => {
    const msgData = { message, sender: name, avatarUrl };
    io.emit("newMessage", msgData); // Emit the message to all clients
  });

  // Handle socket disconnection
  socket.on('disconnect', () => {
    console.log("User Disconnected");
  });
});

// Default route for server testing
app.get('/', (req, res) => {
  res.send("Hello World");
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
