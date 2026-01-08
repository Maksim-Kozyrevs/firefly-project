import express from 'express';

import { checkTgLogin } from "../../../services/manage-devices.service.js";
import { WSManager } from '@project/web-sockets';



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

  WSManager.sendData(checkResponse.deviceId, {
    type: "command",
    command: command
  });

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
      return;
    }

    WSManager.sendData(checkResponse.deviceId, {
      type: "update-timesheet"
    });

    res.json({
      status: true
    });
  } catch (error) {
    res.status(500).json({
      status: false
    });
  }

});



export default router;