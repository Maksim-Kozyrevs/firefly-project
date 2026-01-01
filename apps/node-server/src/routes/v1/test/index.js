import express from 'express';



const router = express.Router();



router.get("/test", async (req, res) => {

  res.json({
    status: true,
    code: 200,
    data: "Success!"
  });

});



export default router;