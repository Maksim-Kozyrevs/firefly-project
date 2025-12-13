import express from 'express';



const router = express.Router();



router.get("/test", (req, res) => {
  res.json({
    status: true,
    data: "Success!"
  });
});



export default router;