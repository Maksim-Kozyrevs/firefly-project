import express from "express";
import { createServer } from "http";
import cors from "cors";

import { initWS } from "./ws/init-ws.js";

import routerV1 from "./routes/v1/index.js";



const server = express();
const httpServer = createServer(server);



function startServer() {

  try {
    //Настройка сервера
    server.use(cors());
    server.use(express.json());

    //Инициализация API
    server.use("/v1", routerV1);

    //Инициализация WS
    initWS(httpServer);

    //Запуск сервера
    httpServer.listen(8000, () => {
      console.log("Server is starting.");
    });

  } catch (error) {
    console.log("Error when starting server.\n\r", error);
  }

}



startServer();