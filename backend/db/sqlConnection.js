const sql = require("mssql");
require("dotenv").config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: "localhost",
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false,
        trustServerCertificate: true,
        instanceName: "SQLEXPRESS"
    }
};

let pool;

async function getConnection() {
    try {
        if (!pool) {
            pool = await sql.connect(config);
            console.log("✅ SQL Server Connected");
        }
        return pool;
    } catch (err) {
        console.log("❌ DB Connection Error:", err.message);
        throw err;
    }
}

module.exports = { sql, getConnection };