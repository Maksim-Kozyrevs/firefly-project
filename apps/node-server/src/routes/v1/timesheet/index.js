import express from 'express';
import { asyncAPI } from "@project/middlewares";
import appError from "@project/errors";
import { getTimesheet } from "../../../services/timesheet.service.js";



const router = express.Router();



router.all("/get-timesheet", asyncAPI(async (req, res) => {

  const chipId = req.query.device_id;

  if (!chipId) {
    throw new appError("Device_id is empty.", 400);
  }

  const response = await getTimesheet(chipId);

  res.json(response);

}));



export default router;