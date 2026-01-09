import express from "express";
import { createServer } from "http";
import cors from "cors";
import envConfig from "@project/env";

import { initWS } from "@project/web-sockets";
import routerV1 from "./routes/v1/index.js";



const server = express();
const httpServer = createServer(server);

//Инициализация .env
envConfig();



function startServer() {

  try {
    //Настройка сервера
    server.use(cors());
    server.use(express.json());

    //Инициализация API
    server.use("/v1", routerV1);

    //Инициализация WS
    initWS(httpServer);

    //Errors middleware
    server.use((error, req, res, next) => {

      const statusCode = error.statusCode || 500;
      const data = error.message || "Ошибка на сервере, попробуйте снова.";

      console.error(`Error:\n\r${error.stack}`);

      res.status(statusCode).json({
        status: error.status,
        code: statusCode,
        data: data,
      });

    });

    //Запуск сервера
    httpServer.listen(process.env.FIREFLY_SERVER_PORT, () => {
      console.log("Server is starting.");
    });

  } catch (error) {
    console.log("Error when starting server.\n\r", error);
  }

}



startServer();