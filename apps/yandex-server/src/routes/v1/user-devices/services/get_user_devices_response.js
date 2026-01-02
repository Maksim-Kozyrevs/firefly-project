import pool from '@project/main-db';
import appError from '@project/errors';



/**
 * 
 * @param {Array} userDevices
 * @param {String} requestId
 * @param {String} userId
 * @returns {Array}
 */
const getUserDevicesResponse = async (userDevices, requestId, userId) => {

  if (!userDevices) {
    throw new appError("empty_user_devices", 400);
  }

  const device_types = [...new Set(userDevices.map((device) => device.type_device))];

  const { rowCount, rows: deviceConfigs } = await pool.query("SELECT * FROM devices_config WHERE type_device = ANY($1)", [device_types]);

  if (rowCount === 0) {
    throw new appError("devices_config_not_found", 404);
  }

  const devicesArray = [];
  userDevices.forEach((device) => {
    const deviceConfig = deviceConfigs.find((config) => config.type_device === device.type_device).config_data;
    deviceConfig.id = device.device_id;

    devicesArray.push(deviceConfig);
  });
  
  return {
    request_id: requestId,
    payload: {
      user_id: userId,
      devices: devicesArray
    }
  }

};



export default getUserDevicesResponse;