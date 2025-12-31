import express from "express";

//API
import authRouter from "./auth-gateway/index.js";



const router = express.Router();



router.use("/", authRouter);
router.use("/", (req, res) => {
    res.status(200).send();
})



export default router;