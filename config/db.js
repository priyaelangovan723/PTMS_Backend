require('dotenv').config(); 
const mysql = require('mysql2');
const fs = require('fs');
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  ssl:{
    ca:fs.readFileSync(process.env.CA)
  },
  // connectionLimit:50
});

module.exports = pool.promise();