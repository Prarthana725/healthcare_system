const { getConnection } = require('../db/connection');

class DoctorController {
    // Get all doctors
    async getAll(req, res) {
        try {
            const connection = await getConnection();
            const [rows] = await connection.execute('SELECT * FROM doctors');
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch doctors' });
        }
    }

    // Get doctor by ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const connection = await getConnection();
            const [rows] = await connection.execute('SELECT * FROM doctors WHERE doctor_id = ?', [id]);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Doctor not found' });
            }
            res.json(rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch doctor' });
        }
    }

    // Create new doctor
    async create(req, res) {
        try {
            const { name, specialization } = req.body;
            const connection = await getConnection();
            const [result] = await connection.execute(
                'INSERT INTO doctors (name, specialization) VALUES (?, ?)',
                [name, specialization]
            );
            res.status(201).json({ message: 'Doctor created', id: result.insertId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create doctor' });
        }
    }

    // Update doctor
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, specialization } = req.body;
            const connection = await getConnection();
            const [result] = await connection.execute(
                'UPDATE doctors SET name = ?, specialization = ? WHERE doctor_id = ?',
                [name, specialization, id]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Doctor not found' });
            }
            res.json({ message: 'Doctor updated' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update doctor' });
        }
    }

    // Delete doctor
    async delete(req, res) {
        try {
            const { id } = req.params;
            const connection = await getConnection();
            const [result] = await connection.execute('DELETE FROM doctors WHERE doctor_id = ?', [id]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Doctor not found' });
            }
            res.json({ message: 'Doctor deleted' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete doctor' });
        }
    }
}

module.exports = new DoctorController();