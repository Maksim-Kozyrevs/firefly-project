import appError from "@project/errors";
import axios from "axios";



const executeEventDevices = async (devicesArray) => {

  if (devicesArray.length === 0) {
    throw new appError("empty_user_devices", 400);
  }

  const requeryArray = [];

  devicesArray.map( async (deviceObj) => {
    const deviceId = deviceObj.id;

    const commandsObjArray = deviceObj.capabilities.map((capability) => {
      return {
        instance: capability.state.instance,
        value: capability.state.value,
      }
    });

    requeryArray.push({
      deviceId: deviceId,
      data: {
        type: "yandex-commands",
        commands: commandsObjArray,
      }
    });
  });

  let response = await axios.post("https://api.ai-firefly.ru/v1/devices/action", requeryArray);
  response = response.data;

  if (!response.status) {
    throw new appError(response.data, response.code);
  }
  
  const executedEventsDevices = response.data;

  executedEventsDevices.forEach((eventResult, index) => {
    const actionResultObj = {};
    if (eventResult.status) {
      actionResultObj.status = "DONE";
    } else {
      actionResultObj.status = "ERROR";
      actionResultObj.error_code = eventResult.yandex_error_code || "INTERNAL_ERROR";
      actionResultObj.error_message = eventResult.data;
    }

    devicesArray[index].capabilities.forEach(capability => {
      const specialCommandObj = eventResult.specialCommandsErrors.find((commandObj) => commandObj.instance === capability.state.instance);
      if (specialCommandObj) {
        capability.state.action_result = {
          status: "ERROR",
          error_code: specialCommandObj.error_code || "INTERNAL_ERROR",
          error_message: specialCommandObj.error_message || "Ошибка на сервере, попробуйте снова."
        }
      } else {
        capability.state.action_result = actionResultObj;
      }
    });
  });

  return devicesArray;

};



export default executeEventDevices;