import pool from "@project/main-db";
import appError from "@project/errors";
import { WSManager } from "@project/web-sockets";



const assignMode = async (deviceId, mode) => {

  if (!deviceId || !mode) {
    throw new appError("invalid_data", 400);
  }

  const response = await pool.query("UPDATE smart_devices SET settings_data = settings_data || $1::jsonb WHERE device_id=$2", [
    JSON.stringify({currentMode: mode}),
    deviceId
  ]);

  if (response.rowCount == 0) {
    throw new appError("device_not_found", 404);
  }

  WSManager.sendData(deviceId, {
    data: {
      type: "assign-mode",
      mode: mode
    }
  });

  return {
    status: true,
    code: 200
  };

}



export default assignMode;