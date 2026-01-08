import appError from "@project/errors";
import { WSManager } from "@project/web-sockets";



const executeEventDevices = async (devicesArray) => {

  if (devicesArray.length === 0) {
    throw new appError("empty_user_devices", 400);
  }

  devicesArray.map( async (deviceObj) => {
    const deviceId = deviceObj.id;

    const commandsObjArray = deviceObj.capabilities.map((capability) => {
      return {
        type: capability.type,
        instance: capability.state.instance,
        value: capability.state.value,
      }
    });

    const response = await WSManager.sendData(deviceId, {
      type: "yandex-commands",
      commands: commandsObjArray,
    });    
  });

};



export default executeEventDevices;