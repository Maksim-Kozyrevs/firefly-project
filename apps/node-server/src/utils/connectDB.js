import pkg from 'pg';



const { Pool } = pkg;

const pool = new Pool({
    user: "",
    host: "",
    database: "",
    password: "",
    port: 5432
});



export default pool;
