import pool from "../utils/connectDB.js";



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
      chipID: response.rows[0].device_id
    }
  } catch (error) {
    return {
      status: false,
      error: error
    };
  }

}