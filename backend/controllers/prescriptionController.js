const { getConnection } = require('../db/connection');

class PrescriptionController {
    // Get all prescriptions with details
    async getAll(req, res) {
        try {
            const connection = await getConnection();
            const [rows] = await connection.execute(`
                SELECT p.prescription_id, p.patient_id, p.doctor_id, p.date,
                       pd.id AS detail_id, pd.medicine_id, pd.quantity,
                       m.name AS medicine_name
                FROM prescriptions p
                LEFT JOIN prescription_details pd ON p.prescription_id = pd.prescription_id
                LEFT JOIN medicines m ON pd.medicine_id = m.medicine_id
                ORDER BY p.prescription_id, pd.id
            `);
            // Group by prescription_id
            const prescriptions = {};
            rows.forEach(row => {
                if (!prescriptions[row.prescription_id]) {
                    prescriptions[row.prescription_id] = {
                        prescription_id: row.prescription_id,
                        patient_id: row.patient_id,
                        doctor_id: row.doctor_id,
                        date: row.date,
                        details: []
                    };
                }
                if (row.detail_id) {
                    prescriptions[row.prescription_id].details.push({
                        id: row.detail_id,
                        medicine_id: row.medicine_id,
                        medicine_name: row.medicine_name,
                        quantity: row.quantity
                    });
                }
            });
            res.json(Object.values(prescriptions));
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch prescriptions' });
        }
    }

    // Get prescription by ID with details
    async getById(req, res) {
        try {
            const { id } = req.params;
            const connection = await getConnection();
            const [rows] = await connection.execute(`
                SELECT p.prescription_id, p.patient_id, p.doctor_id, p.date,
                       pd.id AS detail_id, pd.medicine_id, pd.quantity,
                       m.name AS medicine_name
                FROM prescriptions p
                LEFT JOIN prescription_details pd ON p.prescription_id = pd.prescription_id
                LEFT JOIN medicines m ON pd.medicine_id = m.medicine_id
                WHERE p.prescription_id = ?
                ORDER BY pd.id
            `, [id]);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Prescription not found' });
            }
            const prescription = {
                prescription_id: rows[0].prescription_id,
                patient_id: rows[0].patient_id,
                doctor_id: rows[0].doctor_id,
                date: rows[0].date,
                details: rows.filter(row => row.detail_id).map(row => ({
                    id: row.detail_id,
                    medicine_id: row.medicine_id,
                    medicine_name: row.medicine_name,
                    quantity: row.quantity
                }))
            };
            res.json(prescription);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch prescription' });
        }
    }

    // Create new prescription with details
    async create(req, res) {
        try {
            const { patient_id, doctor_id, date, details } = req.body; // details: [{medicine_id, quantity}, ...]
            const connection = await getConnection();
            await connection.beginTransaction();
            const [result] = await connection.execute(
                'INSERT INTO prescriptions (patient_id, doctor_id, date) VALUES (?, ?, ?)',
                [patient_id, doctor_id, date]
            );
            const prescriptionId = result.insertId;
            for (const detail of details) {
                await connection.execute(
                    'INSERT INTO prescription_details (prescription_id, medicine_id, quantity) VALUES (?, ?, ?)',
                    [prescriptionId, detail.medicine_id, detail.quantity]
                );
            }
            await connection.commit();
            res.status(201).json({ message: 'Prescription created', id: prescriptionId });
        } catch (error) {
            await connection.rollback();
            console.error(error);
            res.status(500).json({ error: 'Failed to create prescription' });
        }
    }

    // Update prescription (simplified, update header only, details separate)
    async update(req, res) {
        try {
            const { id } = req.params;
            const { patient_id, doctor_id, date } = req.body;
            const connection = await getConnection();
            const [result] = await connection.execute(
                'UPDATE prescriptions SET patient_id = ?, doctor_id = ?, date = ? WHERE prescription_id = ?',
                [patient_id, doctor_id, date, id]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Prescription not found' });
            }
            res.json({ message: 'Prescription updated' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update prescription' });
        }
    }

    // Delete prescription and details
    async delete(req, res) {
        try {
            const { id } = req.params;
            const connection = await getConnection();
            await connection.beginTransaction();
            await connection.execute('DELETE FROM prescription_details WHERE prescription_id = ?', [id]);
            const [result] = await connection.execute('DELETE FROM prescriptions WHERE prescription_id = ?', [id]);
            if (result.affectedRows === 0) {
                await connection.rollback();
                return res.status(404).json({ error: 'Prescription not found' });
            }
            await connection.commit();
            res.json({ message: 'Prescription deleted' });
        } catch (error) {
            await connection.rollback();
            console.error(error);
            res.status(500).json({ error: 'Failed to delete prescription' });
        }
    }
}

module.exports = new PrescriptionController();