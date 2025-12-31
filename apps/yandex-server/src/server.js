import express from 'express';
import cors from 'cors';
import dotenv from "dotenv"
import path from "path";
import { fileURLToPath } from 'url';

//Routes
import v1Router from "./routes/v1/index.js";



const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({
  path: path.join(__dirname, "../../../.env")
});

const server = express();



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
    server.use("/yandex/v1.0/", v1Router);


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