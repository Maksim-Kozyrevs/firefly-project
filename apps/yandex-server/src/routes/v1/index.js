import express from "express";

//API
import authRouter from "./auth/index.js";
//import userRouter from "./user/index.js";
import userDevicesRouter from "./user-devices/index.js";



const router = express.Router();



//Запросы к устройству
router.use("/user/devices", userDevicesRouter);
//Аккаунт пользоателя
//router.use("/user", userRouter);
//Аутификация Yandex
router.use("/", authRouter);
//Статус сервера
router.use("/", (req, res) => {
    res.status(200).send();
});



export default router;