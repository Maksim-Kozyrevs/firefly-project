import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



function envConfig() {

  const envPath = path.join(__dirname, '../../.env');
  const result = dotenv.config({ path: envPath });

  if (result.error) {
    console.error(`Error when envConfig initialization, error:\n\r${result.error}`);
  }

}



export default envConfig;