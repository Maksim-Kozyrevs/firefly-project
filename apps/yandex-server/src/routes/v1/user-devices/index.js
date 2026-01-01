import express from "express";
import { bearerAuth } from "@project/middleware";



const router = express.Router();



router.use("/", bearerAuth, async (req, res) => {

  try {
    const bearerToken = req.bearer_token;

    const responseJson = {
      request_id: req.headers["x-request-id"],
      payload: {
        user_id: "fb9c1d8e-0a1d-4923-9bee-e2f4d5672f70",
        devices: [
          {
            id: "3547f5dc-bc55-497e-834b-88dab0b2cd09", 
            name: "Smart Dish",
            description: "Умная кормушка для домашних питомцев",
            type: "devices.types.other",
            capabilities: [
              {
                type: "devices.capabilities.on_off",
                retrievable: false,
                reportable: false
              },
              {
                type: "devices.capabilities.range",
                retrievable: false,
                reportable: false,
                parameters: {
                  instance: "volume",
                  range: {
                    min: 5,
                    max: 500,
                    precision: 5
                  }
                }
              }
            ],
            properties: [
              {
                type: "devices.properties.float",
                retrievable: false,
                reportable: false,
                parameters: {
                  instance: "food_level",
                  unit: "unit.percent"
                }
              }
            ]
          }
        ]
      }
    };

    res.json(responseJson);
  } catch (error) {
    res.json({
      status: false,
      code: 500,
      data: "server_error"
    });
  }

});

router.use("/action", (req, res) => {

  console.log(req.body);

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

})



export default router;