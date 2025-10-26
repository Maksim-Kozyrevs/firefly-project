import express from "express";
import { createServer } from "http";

import { initWS } from "./modules/init-ws.js";



const server = express();
const httpServer = createServer(server);



function startServer() {

  try {
    server.use("/test", (req, res) => {
      res.json({
        data: "Test is successful."
      });
    });

    //Инициализация WS
    initWS(httpServer);

    httpServer.listen(8000, () => {
      console.log("Server is starting.");
    });

  } catch (error) {
    console.log("Error when starting server.\n\r", error);
  }

}



startServer();