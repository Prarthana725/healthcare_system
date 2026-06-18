// backend/controllers/statsController.js

const { getConnection } = require('../db/sqlConnection');

class StatsController {
    async getSystemOverview(req, res) {
        try {
            const connection = await getConnection();
            
            // last_login ඉවත් කර සකසන ලද ආරක්ෂිත SQL Query එක
            const result = await connection.request().query(`
                SELECT 
                    (SELECT COUNT(*) FROM users) AS totalUsers,
                    (SELECT COUNT(*) FROM users WHERE status = 'Active') AS activeUsers,
                    0 AS loginsToday, -- දැනට last_login නැති නිසා 0 ලබා දී ඇත
                    (SELECT COUNT(*) FROM appointments) AS totalActivities 
            `);

            res.json(result.recordset[0]); 

        } catch (error) {
            console.error("Stats Fetch Error:", error);
            res.status(500).json({ error: 'Failed to fetch system stats' });
        }
    }
}

module.exports = new StatsController();