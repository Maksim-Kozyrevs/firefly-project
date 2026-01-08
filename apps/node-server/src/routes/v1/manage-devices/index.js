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

router.all("/devices/action", async (req, res) => {

  try {
    const devicesArray = req.body;

    if (!devicesArray) {
      res.status(404).json({
        status: false,
        code: 400,
        data: "devices_not_found"
      });
    }


    const executedEventsDevices = await devicesArray.map(async (device) => {
      const response = await WSManager.sendData(device.deviceId, device.data);
      console.log(response);
      response.deviceId = device.deviceId;

      return response;
    });

    res.json({
      status: true,
      code: 200,
      data: executedEventsDevices
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      data: "server_error"
    });
  }

});



export default router;