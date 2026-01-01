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

router.post("/action", (req, res) => {
  const requestId = req.headers["x-request-id"];
  
  // Логируем для отладки
  console.log(`[${new Date().toISOString()}] Action Request ID: ${requestId}`);
  
  if (!req.body.payload || !req.body.payload.devices) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const responseDevices = req.body.payload.devices.map(device => {
    return {
      id: device.id,
      capabilities: device.capabilities.map(cap => ({
        type: cap.type,
        state: {
          instance: cap.state.instance,
          action_result: {
            status: "DONE"
          }
        }
      }))
    };
  });

  const responsePayload = {
    request_id: requestId,
    payload: {
      devices: responseDevices
    }
  };

  res.status(200).json(responsePayload);
});



export default router;