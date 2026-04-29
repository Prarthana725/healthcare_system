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
        console.log('Attempting to connect to MySQL with config:', { host: dbConfig.host, user: dbConfig.user, database: dbConfig.database });
        connection = await mysql.createConnection(dbConfig);
        console.log('✓ Successfully connected to MySQL database');

        // Test connection with SELECT 1
        const [rows] = await connection.execute('SELECT 1');
        console.log('✓ Database connection test passed');
    } catch (error) {
        console.error('✗ Database connection failed:', error.message);
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