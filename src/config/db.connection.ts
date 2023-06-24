import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

var pool = mysql.createPool({
    host    : process.env.HOST,
    user   : process.env.USER,
    password : process.env.PASSWORD,
    database : process.env.DATABASE,
    connectionLimit : 10,
    multipleStatements : true
})

export default pool;