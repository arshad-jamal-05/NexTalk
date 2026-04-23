import express from "express";
import { createServer } from "node:http";

import { Server } from "socket.io";
import { connectToSocket } from "./controllers/socketManager.js";

import mongoose from "mongoose";

import cors from "cors";
import userRoutes from "./routes/users.routes.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 8000);
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({limit: "40kb", extended:true}));

app.use("/api/v1/users", userRoutes);

const start = async () => {
  const connectionDb = await mongoose.connect(
    "mongodb+srv://bharatamir4321_db_user:SArwZ0L5jvJsT2to@cluster0.tmz4g64.mongodb.net/"
  );
  // console.log(`DB is connected successfully ${connectionDb.connection.host}`);
  console.log(`DB is connected successfully ✅`);

  server.listen(app.get("port"), () => {
    console.log("Server is listening on port 8000");
  });
};

start();
