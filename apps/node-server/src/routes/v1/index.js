import express from 'express';

//API
import timeSheetRouter from "./timesheet/index.js";
import manageDevicesRouter from "./manage-devices/index.js";
import testRouter from "./test/index.js";



const router = express.Router();



router.use("/", timeSheetRouter); //Управление timesheet устройств
router.use("/", manageDevicesRouter); //Управление устройствами
router.use("/", testRouter); //Тестовый API



export default router;