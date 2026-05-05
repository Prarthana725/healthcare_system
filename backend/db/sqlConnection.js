const sql = require('mssql');

const config = {
    user: 'sa',              // or your SQL user
    password: '12345',  // your password
    server: 'localhost',     // IMPORTANT (NOT localhost\SQLEXPRESS)
    database: 'HealthcareDB',
    port: 1433,              // IMPORTANT
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

let pool;

async function getConnection() {
    if (!pool) {
        pool = await sql.connect(config);
        console.log("✅ Connected to SQL Server");
    }
    return pool;
}

module.exports = { getConnection, sql };