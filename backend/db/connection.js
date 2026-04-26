const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'healthcare_db'
};

let connection;

async function connectDB() {
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL database');
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
}

async function getConnection() {
    if (!connection) {
        await connectDB();
    }
    return connection;
}

module.exports = { getConnection };