import pkg from 'pg';



const { Pool } = pkg;

const pool = new Pool({
    user: "",
    host: "",
    database: "",
    password: "",
    port: 
});



export default pool;
