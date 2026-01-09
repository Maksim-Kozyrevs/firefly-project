import express from 'express';
import { getTimesheet } from "../../../services/timesheet.service.js";



const router = express.Router();



import { asyncAPI } from "@project/middlewares";
import appError from "@project/errors";

router.all("/get-timesheet", asyncAPI(async (req, res) => {

  const chipId = req.query.chipid;

  if (!chipId) {
    throw new appError("ChipId is empty.", 400);
  }

  const response = await getTimesheet(chipId);

  res.json(response);

}));



export default router;