import express from 'express';
import cors from 'cors';
import envConfig from "@project/env";

//Routes
import v1Router from "./routes/v1/index.js";



const server = express();

//Инициализация .env
envConfig();



function startServer() {

  try {
    server.use(cors());
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));

    //API
    server.get("/", (req, res) => {
      res.json({
        status: true,
        code: 200,
        data: "Success!",
      });
    });
    //server.use("/yandex/v1.0/", v1Router);


    server.listen(process.env.YANDEX_SERVER_PORT, () => {
      console.log(
        `Yandex Server is successfully running on port ${process.env.YANDEX_SERVER_PORT}.`
      );
    });
  } catch (error) {
    console.error(
      `Error when starting Yandex Server.\n\r${error}`
    );
  }

};



startServer();