const express = require('express');
const router = express.Router();
const { getConnection } = require('../db/sqlConnection');
const sql = require('mssql');


// GET ALL ACTIVE PATIENTS

router.get('/', async (req, res) => {
    try {

        const pool = await getConnection();

        const result = await pool.request()
            .query(`
                SELECT *
                FROM patients
                WHERE status = 'Active'
            `);

        res.json(result.recordset);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: 'Server Error'
        });
    }
});


// GET INACTIVE PATIENTS

router.get('/inactive', async (req, res) => {

    try {

        const pool = await getConnection();

        const result = await pool.request()
            .query(`
                SELECT *
                FROM patients
                WHERE status = 'Inactive'
            `);

        res.json(result.recordset);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: 'Server Error'
        });
    }
});


// GET PATIENT PROFILE BY USER ID

router.get('/profile/:userId', async (req, res) => {

    try {

        const pool = await getConnection();

        const result = await pool.request()
            .input('userId', sql.VarChar, req.params.userId)
            .query(`
                SELECT TOP 1 *
                FROM patients
                WHERE user_id = @userId
            `);

        if (result.recordset.length === 0) {

            return res.status(404).json({
                message: 'Patient not found'
            });
        }

        res.json(result.recordset[0]);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: 'Server Error'
        });
    }
});


// GET PATIENT BY ID

router.get('/:id', async (req, res) => {

    try {

        const pool = await getConnection();

        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query(`
                SELECT *
                FROM patients
                WHERE patient_id = @id
            `);

        if (result.recordset.length === 0) {

            return res.status(404).json({
                message: 'Patient not found'
            });
        }

        res.json(result.recordset[0]);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: 'Server Error'
        });
    }
});


// CREATE PATIENT

router.post('/', async (req, res) => {

    try {

        const {
            name,
            age,
            phone,
            user_id
        } = req.body;

        const pool = await getConnection();

        await pool.request()
            .input('name', sql.VarChar, name)
            .input('age', sql.Int, age)
            .input('phone', sql.VarChar, phone)
            .input('user_id', sql.VarChar, user_id || null)
            .query(`
                INSERT INTO patients
                (
                    name,
                    age,
                    phone,
                    user_id,
                    status
                )
                VALUES
                (
                    @name,
                    @age,
                    @phone,
                    @user_id,
                    'Active'
                )
            `);

        res.status(201).json({
            message: 'Patient created successfully'
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: 'Server Error'
        });
    }
});


// UPDATE PATIENT

router.put('/:id', async (req, res) => {

    try {

        const {
            name,
            age,
            phone
        } = req.body;

        const pool = await getConnection();

        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .input('name', sql.VarChar, name)
            .input('age', sql.Int, age)
            .input('phone', sql.VarChar, phone)
            .query(`
                UPDATE patients
                SET
                    name = @name,
                    age = @age,
                    phone = @phone
                WHERE patient_id = @id
            `);

        if (result.rowsAffected[0] === 0) {

            return res.status(404).json({
                message: 'Patient not found'
            });
        }

        res.json({
            message: 'Patient updated successfully'
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: 'Server Error'
        });
    }
});


// DEACTIVATE PATIENT

router.put('/:id/deactivate', async (req, res) => {

    try {

        const pool = await getConnection();

        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query(`
                UPDATE patients
                SET status = 'Inactive'
                WHERE patient_id = @id
            `);

        if (result.rowsAffected[0] === 0) {

            return res.status(404).json({
                message: 'Patient not found'
            });
        }

        res.json({
            message: 'Patient deactivated successfully'
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: 'Server Error'
        });
    }
});


// RESTORE PATIENT
router.put('/:id/restore', async (req, res) => {

    try {

        const pool = await getConnection();

        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query(`
                UPDATE patients
                SET status = 'Active'
                WHERE patient_id = @id
            `);

        if (result.rowsAffected[0] === 0) {

            return res.status(404).json({
                message: 'Patient not found'
            });
        }

        res.json({
            message: 'Patient restored successfully'
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: 'Server Error'
        });
    }
});

module.exports = router;