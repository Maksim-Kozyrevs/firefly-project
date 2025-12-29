import express from 'express';
import pool from "../../../utils/connectDB.js";


const router = express.Router();



router.get("/test", async (req, res) => {

  res.json({
    status: true,
    code: 200,
    data: "Success!"
  });

});



export default router;