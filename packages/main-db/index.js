import pkg from 'pg';
import "dotenv/config";



const { Pool } = pkg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_URL,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432
});



export default pool;