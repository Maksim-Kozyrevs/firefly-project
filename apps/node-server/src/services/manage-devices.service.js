import pool from "@project/main-db";
import appError from "@project/errors";



export async function checkTgLogin(userName) {

  if (!userName) {
    throw new appError("empty_user_name", 400);
  }

  const response = await pool.query("SELECT * FROM smart_devices WHERE tg_user_names @> $1", [JSON.stringify([userName])]);

  if (response.rows.length == 0) {
    throw new appError("devices_not_found", 404);
  }

  return {
    status: true,
    deviceId: response.rows[0].device_id
  }

}