import express from 'express';
import pool from "../../modules/connectDB.js";
import getTimesheet from './services/getTimesheet.js';


const router = express.Router();



router.all("/get-timesheet", async (req, res) => {

  try {
    const chipId = req.query.chipid;

    if (!chipId) {
      res.status(400).json({
        status: false,
        data: "ChipId is empty.",
      });
      return;
    }

    const response = await getTimesheet(chipId);

    res.json(response);
  } catch (error) {
    res.status(500).json({
      status: false
    });
  }

});



export default router;