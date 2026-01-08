import devicesMap from "@project/devices-map";
import appError from "@project/errors";



const executeEventDevices = (devicesArray) => {

  if (devicesArray.length === 0) {
    throw new appError("empty_user_devices", 400);
  }

  devicesArray.map((deviceObj) => {
    const ws = devicesMap.get(deviceObj.id);

    if (!ws) {
      throw new appError("devices_is_disabled", 499);
    }

    const commandsObjArray = deviceObj.capabilities.map((capability) => {
      return {
        type: capability.type,
        instance: capability.state.instance,
        value: capability.state.value,
      }
    });

    ws.send(JSON.stringify(commandsObjArray));
  });

};