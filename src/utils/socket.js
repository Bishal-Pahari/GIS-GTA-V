const socket = io.connect("http://localhost:8000");

socket.on("connect", () => {
  console.log("Connected to the Socket.IO server");
});

socket.on("connect_error", (error) => {
  console.error("Error connecting to the Socket.IO server:", error.message);
});

socket.on("disconnect", () => {
  console.log("Disconnected from the Socket.IO server");
});
