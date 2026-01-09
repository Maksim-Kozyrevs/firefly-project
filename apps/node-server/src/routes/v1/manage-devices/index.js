import express from 'express';

import { checkTgLogin } from "../../../services/manage-devices.service.js";
import { WSManager } from '@project/web-sockets';



import { asyncAPI } from "@project/middlewares";
import appError from "@project/errors";

const router = express.Router();



router.all("/command", express.json(), asyncAPI(async (req, res) => {

  const command = req.body.command;
  const userName = req.body.userName;

  //Проверка привязки логина к Smart Dish
  const checkResponse = await checkTgLogin(userName);

  if (!checkResponse.status) {
    throw new appError("User not found", 404);
  }

  WSManager.sendData(checkResponse.deviceId, {
    type: "command",
    command: command
  });

  res.json({
    status: true
  });

}));

router.all("/update-timesheet", express.json(), asyncAPI(async (req, res) => {

  const userName = req.body.userName;

  const checkResponse = await checkTgLogin(userName);

  if (!checkResponse.status) {
    throw new appError("User not found", 404);
  }

  WSManager.sendData(checkResponse.deviceId, {
    type: "update-timesheet"
  });

  res.json({
    status: true
  });

}));

router.all("/devices/action", asyncAPI(async (req, res) => {

  const devicesArray = req.body;

  if (!devicesArray) {
    throw new appError("devices_not_found", 400);
  }


  const executedEventsDevices = await Promise.all(
    devicesArray.map(async (device) => {
      let response = await WSManager.sendData(device.deviceId, device.data);
      response.deviceId = device.deviceId;

      return response;
    })
  );

  res.json({
    status: true,
    code: 200,
    data: executedEventsDevices
  });

}));



export default router;