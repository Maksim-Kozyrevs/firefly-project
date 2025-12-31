import pkg from 'pg';



const { Pool } = pkg;

const pool = new Pool({
    user: "fireflyproject",
    host: "localhost",
    database: "main",
    password: "7zih8qFVCltQWmA*egti",
    port: 5432
});



export default pool;