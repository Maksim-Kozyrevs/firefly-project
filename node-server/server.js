const express = require('express');
const server = express();



function startServer() {

  try {
      
    server.use('/test', (req, res) => {
      res.json({
        data: "Test is successful."
      });
    });

    server.listen(8000, "0.0.0.0", () => {
      console.log("Server is started.");
    });

  } catch (error) {
    console.log("Error when starting server.\n\r", error);
  }

}



startServer();