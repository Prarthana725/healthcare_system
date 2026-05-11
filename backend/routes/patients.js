const express = require('express');
const router = express.Router();
const { getConnection } = require('../db/sqlConnection');
const sql = require('mssql');

// 1. GET ALL PATIENTS (This was missing! Fixes the Doctor & Admin dropdowns)
router.get('/', async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM patients');
        res.json(result.recordset); // Sends the list of patients to the frontend
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// 2. GET SPECIFIC PATIENT PROFILE (For the Patient Dashboard)
router.get('/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const pool = await getConnection();
        
        const result = await pool.request()
            .input('userId', sql.VarChar, userId)
            .query('SELECT TOP 1 * FROM patients WHERE user_id = @userId');

        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).json({ message: 'Patient not found' });
        }
    } catch (err) {
        console.error("Profile Fetch Error:", err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// 3. ADD NEW PATIENT (For Admin/Receptionist)
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
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;