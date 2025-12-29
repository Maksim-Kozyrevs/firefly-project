import express from 'express';

import { checkTgLogin } from "../../../services/manage-devices.service.js";



export default function manageChipsRouter(chipsWSMap) {

  const router = express.Router();

  router.all("/command", express.json(), async (req, res) => {

    const command = req.body.command;
    const userName = req.body.userName;
    
    //Проверка привязки логина к Smart Dish
    const checkResponse = await checkTgLogin(userName);

    if (!checkResponse.status) {
      res.status(404).json({
        status: false
      });
      return;
    }

    //Получение и проверка WS соединения платы
    const ws = chipsWSMap.get(checkResponse.chipID);

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      res.status(499).json({
        status: false,
        data: "Connection with ESP32 closed."
      });
      return;
    }

    ws.send(JSON.stringify({
      type: "command",
      command: command
    }));

    res.json({
      status: true
    });

  });

  router.all("/update-timesheet", express.json(), async (req, res) => {

    try {
      const userName = req.body.userName;

      const checkResponse = await checkTgLogin(userName);

      if (!checkResponse.status) {
        res.status(404).json({
          status: false
        });
      }

      //Получение и проверка WS соединения платы
      const ws = chipsWSMap.get(checkResponse.chipID);

      if (!ws || ws.readyState !== WebSocket.OPEN) {
        res.status(499).json({
          status: false,
          data: "Connection with ESP32 closed."
        });
        return;
      }

      ws.send(JSON.stringify({
        type: "update-timesheet"
      }));

      res.json({
        status: true
      });
    } catch (error) {
      res.status(500).json({
        status: false
      });
    }

  });

  return router;
}