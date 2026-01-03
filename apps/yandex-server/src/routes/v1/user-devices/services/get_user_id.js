import pool from "@project/main-db";
import appError from "@project/errors";



/**
 * @param {String} access_token 
 * @returns {Promise<String>}
 */
async function getUserId(access_token) {

  if (!access_token) {
    throw new appError("empty_access_token", 400);
  }

  const response = await pool.query("SELECT user_id FROM yandex_tokens WHERE access_token=$1", [access_token]);

  if (response.rowCount === 0) {
    throw new appError("token_not_found", 404);
  }

  return response.rows[0].user_id;

};



export default getUserId;