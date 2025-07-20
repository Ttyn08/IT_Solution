require('dotenv').config();
console.log('ENV loaded:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    pass: process.env.DB_PASSWORD,
    db: process.env.DB_NAME
});


const mysql = require('mysql2/promise'); // Using promise-based version

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testDbConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to MySQL database!');
        connection.release(); // Release the connection back to the pool
    } catch (error) {
        console.error('Error connecting to database:', error.message);
        process.exit(1); // Exit the process if unable to connect to DB
    }
}

module.exports = { pool, testDbConnection };