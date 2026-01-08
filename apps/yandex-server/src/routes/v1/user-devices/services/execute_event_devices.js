import appError from "@project/errors";
import axios from "axios";



const executeEventDevices = async (devicesArray) => {

  if (devicesArray.length === 0) {
    throw new appError("empty_user_devices", 400);
  }

  const responseArray = [];

  devicesArray.map( async (deviceObj) => {
    const deviceId = deviceObj.id;

    const commandsObjArray = deviceObj.capabilities.map((capability) => {
      return {
        instance: capability.state.instance,
        value: capability.state.value,
      }
    });

    responseArray.push({
      deviceId: deviceId,
      data: {
        type: "yandex-commands",
        commands: commandsObjArray,
      }
    });
  });

  let response = await axios.post("https://api.ai-firefly.ru/v1/devices/action", responseArray);
  response = response.data;

  if (!response.status) {
    throw new appError(response.data, response.code);
  }

  const executedEventsDevices = response.data;
  console.log(executeEventDevices);

  executedEventsDevices.forEach((eventResult, index) => {
    const actionResultObj = {};
    if (eventResult.status) {
      actionResultObj.status = "DONE";
    } else {
      actionResultObj.status = "ERROR";
      actionResultObj.error_code = "INVALID_ACTION",
      actionResultObj.error_message = eventResult.data 
    }

    devicesArray[index].capabilities.forEach(capability => {
      capability.state.action_result = actionResultObj;
    });
  });

  return devicesArray;

};



export default executeEventDevices;