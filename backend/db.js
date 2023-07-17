const Pool = require('pg').Pool
const dotenv = require('dotenv');

dotenv.config();

//console.log(process.env.USER);

const pool = new Pool({
    
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.DBPORT,
    database: 'todoapp'
    
   /*
    user: 'me',
    password: 'Rajeev$@',
    host: 'localhost',
    port: 5432,
    database: 'todoapp'
    */
});

module.exports = pool;