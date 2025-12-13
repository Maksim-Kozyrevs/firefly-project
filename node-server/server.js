import express from "express";
import { createServer } from "http";

import { initWS } from "./modules/init-ws.js";

import testApiRouter from "./routes/test-router/test-router.js";
import manageChipsRouter from "./routes/manage-chips/manage-chips.js";
import timesheetRouter from "./routes/timesheet/timesheet.js";



const server = express();
const httpServer = createServer(server);

const chipsWSMap = new Map();



function startServer() {

  try {
    //Инициализация API
    server.use("/api", testApiRouter);
    server.use("/api", manageChipsRouter(chipsWSMap));
    server.use("/api", timesheetRouter);

    //Инициализация WS
    initWS(httpServer, chipsWSMap);

    //Запуск сервера
    httpServer.listen(8000, () => {
      console.log("Server is starting.");
    });

  } catch (error) {
    console.log("Error when starting server.\n\r", error);
  }

}



startServer();