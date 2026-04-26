const { getConnection } = require('../db/connection');

class AppointmentController {
    // Get all appointments with patient and doctor names
    async getAll(req, res) {
        try {
            const connection = await getConnection();
            // Using stored procedure
            const [rows] = await connection.execute('CALL GetAppointments()');
            res.json(rows[0]); // Procedures return array of arrays
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch appointments' });
        }
    }

    // Get appointment by ID with joins
    async getById(req, res) {
        try {
            const { id } = req.params;
            const connection = await getConnection();
            const [rows] = await connection.execute(`
                SELECT a.appointment_id, p.name AS patient_name, d.name AS doctor_name, a.date
                FROM appointments a
                JOIN patients p ON a.patient_id = p.patient_id
                JOIN doctors d ON a.doctor_id = d.doctor_id
                WHERE a.appointment_id = ?
            `, [id]);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Appointment not found' });
            }
            res.json(rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch appointment' });
        }
    }

    // Create new appointment
    async create(req, res) {
        try {
            const { patient_id, doctor_id, date } = req.body;
            const connection = await getConnection();
            const [result] = await connection.execute(
                'INSERT INTO appointments (patient_id, doctor_id, date) VALUES (?, ?, ?)',
                [patient_id, doctor_id, date]
            );
            res.status(201).json({ message: 'Appointment created', id: result.insertId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create appointment' });
        }
    }

    // Update appointment
    async update(req, res) {
        try {
            const { id } = req.params;
            const { patient_id, doctor_id, date } = req.body;
            const connection = await getConnection();
            const [result] = await connection.execute(
                'UPDATE appointments SET patient_id = ?, doctor_id = ?, date = ? WHERE appointment_id = ?',
                [patient_id, doctor_id, date, id]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Appointment not found' });
            }
            res.json({ message: 'Appointment updated' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update appointment' });
        }
    }

    // Delete appointment
    async delete(req, res) {
        try {
            const { id } = req.params;
            const connection = await getConnection();
            const [result] = await connection.execute('DELETE FROM appointments WHERE appointment_id = ?', [id]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Appointment not found' });
            }
            res.json({ message: 'Appointment deleted' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete appointment' });
        }
    }
}

module.exports = new AppointmentController();