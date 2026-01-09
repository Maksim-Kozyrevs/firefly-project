import express from 'express';

//API
import timeSheetRouter from "./timesheet/index.js";
import devicesRouter from "./devices/index.js";
import testRouter from "./test/index.js";



const router = express.Router();



router.use("/devices", devicesRouter); //Управление устройствами
router.use("/", timeSheetRouter); //Управление Timesheet устройств
router.use("/", testRouter); //Тестовый API



export default router;