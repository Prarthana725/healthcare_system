const db = require('../db/connection');

// GET patient summary view
exports.getPatientSummary = async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM patient_summary');
    res.json(rows);
  } catch (err) {
    console.error("Error in patient summary:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET medicine usage view
exports.getMedicineUsage = async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM medicine_usage');
    res.json(rows);
  } catch (err) {
    console.error("Error in medicine usage:", err);
    res.status(500).json({ error: err.message });
  }
};