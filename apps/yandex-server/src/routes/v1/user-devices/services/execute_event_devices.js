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
        type: capability.type,
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

  const response = await axios.post("https://api.ai-firefly.ru/v1/devices/action", responseArray);

};



export default executeEventDevices;