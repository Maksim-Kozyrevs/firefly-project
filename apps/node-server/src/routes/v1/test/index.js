import express from 'express';



import { asyncAPI } from "@project/middlewares";
import appError from "@project/errors";

const router = express.Router();



router.get("/test", asyncAPI(async (req, res) => {

  res.json({
    status: true,
    code: 200,
    data: "Success!"
  });

}));

router.get("/error", asyncAPI(async (req, res) => {
  throw new appError("Simulated error", 500);
}));



export default router;