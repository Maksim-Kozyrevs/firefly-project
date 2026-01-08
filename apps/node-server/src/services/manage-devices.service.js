import pool from "@project/main-db";



export async function checkTgLogin(userName) {

  try {
    const response = await pool.query("SELECT * FROM smart_devices WHERE tg_user_names @> $1", [JSON.stringify([userName])]);

    if (response.rows.length == 0) {
      return {
        status: false
      };
    }

    return {
      status: true,
      deviceId: response.rows[0].device_id
    }
  } catch (error) {
    return {
      status: false,
      error: error
    };
  }

}