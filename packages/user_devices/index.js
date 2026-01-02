import pool from "@project/main-db";
import appError from "@project/errors";



/**
 * @param {String} userId
 * @returns {Promise<Array>}
 */
export async function getUserDevices(userId) {

    if (!userId) {
      throw new appError("empty_user_id", 400);
    }

    const { rowCount, rows } = await pool.query("SELECT * FROM smart_devices WHERE user_id = $1", [userId]);

    if (rowCount === 0) {
      throw new appError("devices_not_found", 404);
    }

    return rows;

}