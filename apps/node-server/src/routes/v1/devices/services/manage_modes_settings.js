import appError from "@project/errors";
import pool from "@project/main-db";
import { WSManager } from "@project/web-sockets";



const manageModesSettings = async (deviceId, newModesSettings) => {

  if (!deviceId || !newModesSettings) {
    throw new appError("invalid_data", 400);
  }

  const response = await pool.query("UPDATE smart_devices SET settings_data = COALESCE(settings_data, '{}'::jsonb) || $1::jsonb WHERE device_id=$2", [JSON.stringify({
    modesSettings: newModesSettings
  }), deviceId]);

  if (response.rowCount == 0) {
    throw new appError("device_not_found", 404);
  }

  const reqDeviceData = {
    data: {
      type: "update-modes-settings",
      modesSettings: newModesSettings
    }
  };

  WSManager.sendData(deviceId, reqDeviceData);

  return {
    status: true,
    code: 200
  };

}



export default manageModesSettings;