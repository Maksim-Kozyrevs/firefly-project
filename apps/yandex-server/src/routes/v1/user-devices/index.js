import express from "express";
import { bearerAuth, asyncAPI } from "@project/middlewares";
import getUserId from "./services/get_user_id.js";
import { getUserDevices } from "@project/user-devices";
import getUserDevicesResponse from "./services/get_user_devices_response.js";



const router = express.Router();



router.use("/action", (req, res) => {

  console.log(req.body.payload.devices[0].capabilities[0].state.value);

  res.json({
    "request_id": req.headers["x-request-id"],
      "payload": {
        "devices": [
          {
            "id": "3547f5dc-bc55-497e-834b-88dab0b2cd09",
            "capabilities": [
              {
                "type": "devices.capabilities.range",
                "state": {
                  "instance": "volume",
                  "action_result": {
                    "status": "DONE"
                  }
                }
              }
            ]
          }
        ]
      }
  });

});


//Получение устройств пользователя
router.use("/", bearerAuth, asyncAPI(async (req, res) => {

  const bearerToken = req.bearer_token;

  const userId = await getUserId(bearerToken);
  const userDevices = await getUserDevices(userId);
  const response = await getUserDevicesResponse(userDevices, req.headers["x-request-id"], userId);
  console.log(response);

  res.status(200).json(response);

}));



export default router;