import pkg from 'pg';



const { Pool } = pkg;

const pool = new Pool({
    user: "server",
    host: "localhost",
    database: "main",
    password: "4F*CxbFunn16khu8bO6A",
    port: 5432
});



export default pool;