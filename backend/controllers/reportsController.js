const { getConnection } = require('../db/sqlConnection');

// 1. Top Medicines Report
exports.topMedicines = async (req, res) => {
    try {
        const pool = await getConnection();

        const result = await pool.request().query(`
            SELECT 
                m.name,
                SUM(pd.quantity) AS total_used
            FROM prescription_details pd
            JOIN medicines m ON pd.medicine_id = m.medicine_id
            GROUP BY m.name
            ORDER BY total_used DESC
        `);

        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. Doctor Performance
exports.doctorPerformance = async (req, res) => {
    try {
        const pool = await getConnection();

        const result = await pool.request().query(`
            SELECT
                d.name,
                COUNT(a.appointment_id) AS total_appointments
            FROM doctors d
            LEFT JOIN appointments a ON d.doctor_id = a.doctor_id
            GROUP BY d.name
            ORDER BY total_appointments DESC
        `);

        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Patient Visit Analysis
exports.patientVisits = async (req, res) => {
    try {
        const pool = await getConnection();

        const result = await pool.request().query(`
            SELECT
                p.name,
                COUNT(a.appointment_id) AS total_visits
            FROM patients p
            LEFT JOIN appointments a ON p.patient_id = a.patient_id
            GROUP BY p.name
            ORDER BY total_visits DESC
        `);

        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};