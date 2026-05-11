const express = require('express');
const router = express.Router();
const { getConnection } = require('../db/sqlConnection');
const sql = require('mssql');

// --- THE PROFILE ROUTE (This is what the dashboard needs) ---
router.get('/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const pool = await getConnection();
        
        // This query finds the patient linked to your login name
        const result = await pool.request()
            .input('userId', sql.VarChar, userId)
            .query('SELECT TOP 1 * FROM patients WHERE user_id = @userId');

        if (result.recordset.length > 0) {
            res.json(result.recordset[0]); // ✅ Sends your name/age/phone as JSON
        } else {
            res.status(404).json({ message: 'Patient not found' });
        }
    } catch (err) {
        console.error("Profile Fetch Error:", err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Existing POST route
router.post('/', async (req, res) => {
    try {
        const { name, age, phone, user_id } = req.body;
        const pool = await getConnection();
        await pool.request()
            .input('name', sql.VarChar, name)
            .input('age', sql.Int, age)
            .input('phone', sql.VarChar, phone)
            .input('user_id', sql.VarChar, user_id)
            .query('INSERT INTO patients (name, age, phone, user_id) VALUES (@name, @age, @phone, @user_id)');
        res.status(201).json({ message: 'Success' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;