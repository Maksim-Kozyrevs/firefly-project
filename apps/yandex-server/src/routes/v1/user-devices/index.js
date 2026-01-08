import express from "express";
import { bearerAuth, asyncAPI } from "@project/middlewares";
import getUserId from "./services/get_user_id.js";
import { getUserDevices } from "@project/user-devices";
import getUserDevicesResponse from "./services/get_user_devices_response.js";
import executeEventDevices from "./services/execute_event_devices.js";



const router = express.Router();



//Изменение состояние устройств
router.use("/action", asyncAPI(async (req, res) => {

  const bearerToken = req.bearer_token;
  const devicesArray = req.body.payload.devices;

  const response = await executeEventDevices(devicesArray);

}));


//Получение устройств пользователя
router.use("/", bearerAuth, asyncAPI(async (req, res) => {

  const bearerToken = req.bearer_token;

  const userId = await getUserId(bearerToken);
  const userDevices = await getUserDevices(userId);
  const response = await getUserDevicesResponse(userDevices, req.headers["x-request-id"], userId);

  res.status(200).json(response);

}));



export default router;