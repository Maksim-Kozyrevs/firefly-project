import express from 'express';
import pool from "../../../utils/connectDB.js";


const router = express.Router();



router.get("/test", async (req, res) => {

  try{
    const timesheet = await pool.query("SELECT timesheet FROM smart_devices WHERE device_id=$1", ["3547f5dc-bc55-497e-834b-88dab0b2cd09"]);

    if (timesheet.rows.length === 0) {
      res.json({
        status: false,
        httpCode: 400
      });
    }

    res.json({
      status: true,
      data: timesheet.rows[0].timesheet
    });
  } catch (error) {
    res.json({
      status: false,
      httpCode: 500,
      data: error
    });
  }

});



export default router;