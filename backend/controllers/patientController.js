const { getConnection } = require('../db/connection');

class PatientController {
    // Get all patients
    async getAll(req, res) {
        try {
            const connection = await getConnection();
            const [rows] = await connection.execute('SELECT * FROM patients');
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch patients' });
        }
    }

    // Get patient by ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const connection = await getConnection();
            const [rows] = await connection.execute('SELECT * FROM patients WHERE patient_id = ?', [id]);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Patient not found' });
            }
            res.json(rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch patient' });
        }
    }

    // Create new patient
    async create(req, res) {
        try {
            const { name, age, phone } = req.body;
            const connection = await getConnection();
            const [result] = await connection.execute(
                'INSERT INTO patients (name, age, phone) VALUES (?, ?, ?)',
                [name, age, phone]
            );
            res.status(201).json({ message: 'Patient created', id: result.insertId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create patient' });
        }
    }

    // Update patient
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, age, phone } = req.body;
            const connection = await getConnection();
            const [result] = await connection.execute(
                'UPDATE patients SET name = ?, age = ?, phone = ? WHERE patient_id = ?',
                [name, age, phone, id]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Patient not found' });
            }
            res.json({ message: 'Patient updated' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update patient' });
        }
    }

    // Delete patient
    async delete(req, res) {
        try {
            const { id } = req.params;
            const connection = await getConnection();
            const [result] = await connection.execute('DELETE FROM patients WHERE patient_id = ?', [id]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Patient not found' });
            }
            res.json({ message: 'Patient deleted' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete patient' });
        }
    }
}

module.exports = new PatientController();