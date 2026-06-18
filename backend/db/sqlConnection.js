const sql = require('mssql');

const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '12345',
  server: process.env.DB_SERVER || '127.0.0.1',
  database: process.env.DB_DATABASE || 'HealthcareDB',
  port: parseInt(process.env.DB_PORT || '1433', 10),
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
};

let pool;

async function getConnection() {
  try {
    if (pool) {
      return pool;
    }

    console.log("Trying SQL config:", {
      user: config.user,
      server: config.server,
      database: config.database,
      port: config.port,
    });

    pool = await sql.connect(config);
    console.log("✅ Connected to SQL Server");
    return pool;

  } catch (error) {
    console.error("❌ SQL Connection Error:");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Original Error:", error.originalError?.message);
    throw error;
  }
}

module.exports = { getConnection, sql };