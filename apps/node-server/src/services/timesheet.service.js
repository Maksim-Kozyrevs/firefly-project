import pool from "@project/main-db";



export async function getTimesheet(chipId) {

  try{
    const timesheet = await pool.query("SELECT timesheet FROM smart_devices WHERE device_id=$1", [chipId]);

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