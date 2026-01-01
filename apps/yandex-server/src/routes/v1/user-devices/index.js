import express from "express";
import { bearerAuth } from "@project/middleware";



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
            type: "devices.types.pet_feeder",
            capabilities: [
              {
                type: "devices.capabilities.mode",
                retrievable: false,
                reportable: false,
                parameters: {
                  instance: "program",
                  modes: [
                    {
                      value: "one", name: "Маленькая",
                    },
                    {
                      value: "two", name: "Средняя"
                    },
                    {
                      value: "three", name: "Большая"
                    },
                  ],
                },
              },
            ],
            properties: [
              {
                type: "devices.properties.float",
                retrievable: false,
                reportable: false,
                parameters: {
                  instance: "food_level",
                  unit: "unit.percent"
                },
              },
            ],
          }

        ],
      },
    };

    res.status(200).json(responseJson);
  } catch (error) {
    res.json({
      status: false,
      code: 500,
      data: "server_error"
    });
  }

});



export default router;