import pool from "../../../modules/connectDB.js";


async function getTimesheet(chipId) {

  try{
    const timesheet = await pool.query("SELECT timesheet FROM esp32_chips WHERE id=$1", [chipId]);

    if (timesheet.rows.length === 0) {
      return {
        status: false,
        httpCode: 400
      };
    }

    return {
      status: true,
      data: timesheet.rows[0].timesheet
    };
  } catch (error) {
    return {
      status: false,
      httpCode: 500,
      //data: error
    };
  }

}


export default getTimesheet;