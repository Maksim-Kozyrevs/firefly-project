import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import path from 'path';



const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({path: path.join(__dirname, ".env")});

export const apps = [
  /*{
    name: "firefly-server",
    script: "./apps/node-server/src/server.js",
    env: process.env
  },*/
  /*{
    name: "telegram-app",
    script: "./apps/telegram-app/app.js",
    env: process.env
  },*/
  {
    name: "yandex-server",
    script: "./apps/yandex-server/src/server.js",
    env: process.env
  }
];