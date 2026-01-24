import express from 'express';
import { asyncAPI } from "@project/middlewares";
import appError from "@project/errors";
import { WSManager } from '@project/web-sockets';
import { checkTgLogin } from "../../../services/manage-devices.service.js";
import manageModesSettings from "./services/manage_modes_settings.js";
import assignMode from "./services/assign_mode.js";



const router = express.Router();



router.all("/command", asyncAPI(async (req, res) => {

  const command = req.body.command;
  const userName = req.body.userName;

  //Проверка привязки логина к Smart Dish
  const checkResponse = await checkTgLogin(userName);



  const response = await WSManager.sendData(checkResponse.deviceId, {
    type: "command",
    command: command
  });

  res.status(response.code).json(response);
  
}));

router.all("/update-timesheet", express.json(), asyncAPI(async (req, res) => {

  const userName = req.body.userName;

  const checkResponse = await checkTgLogin(userName);

  WSManager.sendData(checkResponse.deviceId, {
    type: "update-timesheet"
  });

  res.json({
    status: true,
    code: 200
  });

}));

router.post("/action", asyncAPI(async (req, res) => {

  const devicesArray = req.body;

  if (!devicesArray) {
    throw new appError("devices_not_found", 400);
  }


  const executedEventsDevices = await Promise.all(
    devicesArray.map(async (device) => {
      const commandsObjArray = device.data.commands;
      
      //Обработка специальных instance
      const specialCommandsArray = commandsObjArray.filter(commandObj => commandObj.instance == "program");
      const specialCommandsErrors = (await Promise.all(specialCommandsArray.map(async (commandObj) => {
        
        try {
          await assignMode(device.deviceId, commandObj.value);
          return null;
        } catch (error) {
          const errorCodeMap = {
            404: "DEVICE_NOT_FOUND"
          };

          return {
            status: false,
            instance: commandObj.instance,
            error_code: errorCodeMap[error.statusCode] || "INTERNAL_ERROR",
            error_message: error.message
          }
        }

      }))).filter(Boolean);

      let response = await WSManager.sendData(device.deviceId, device.data);
      response.specialCommandsErrors = specialCommandsErrors;

      return response;
    })
  );

  res.json({
    status: true,
    code: 200,
    data: executedEventsDevices
  });

}));



router.post("/manage-modes-settings", asyncAPI(async (req, res) => {
  
  const userName = req.body.userName;
  const newModesSettings = req.body.data;

  const response = await checkTgLogin(userName);
  const updateResponse = await manageModesSettings(response.deviceId, newModesSettings);

  return res.status(200).json({
    status: true,
    code: 200,
  });

}));

router.post("/assign-mode", asyncAPI(async (req, res) => {

  const deviceId = req.body.deviceId;
  const mode = req.body.mode;

  const updateResponse = await assignMode(deviceId, mode);

  res.status(200).json({
    status: true,
    code: 200
  });

}));



export default router;