import express from "express";
import { createServer } from "http";

import { initWS } from "./modules/init-ws.js";



const server = express();
const httpServer = createServer(server);

const chipsWSMap = new Map();



function startServer() {

  try {
    server.use("/test", (req, res) => {
      res.json({
        data: "Test is successful."
      });
    });

    server.use("/api/command", express.json(), (req, res) => {
      const command = req.body.command;
      const chipID = req.body.chipID;
      
      const ws = chipsWSMap.get(chipID);

      if (!ws || ws.readyState !== WebSocket.OPEN) {
        res.status(499).json({
          status: false,
          data: "Connection with ESP32 closed."
        });
        return;
      }

      ws.send(JSON.stringify({
        command: command
      }));

      res.json({
        status: true
      });
    });

    //Инициализация WS
    initWS(httpServer, chipsWSMap);

    httpServer.listen(8000, () => {
      console.log("Server is starting.");
    });

  } catch (error) {
    console.log("Error when starting server.\n\r", error);
  }

}



startServer();