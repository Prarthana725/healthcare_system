const patientQueries = require('../db/patientQueries');

class PatientController {
    // Get all patients
    async getAll(req, res) {
        try {
            const patients = await patientQueries.getAllPatients();
            res.json(patients);
        } catch (error) {
            console.error('Error fetching patients:', error);
            res.status(500).json({ error: 'Failed to fetch patients' });
        }
    }

    // Get patient by ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const patients = await patientQueries.getPatientById(id);
            if (patients.length === 0) {
                return res.status(404).json({ error: 'Patient not found' });
            }
            res.json(patients[0]);
        } catch (error) {
            console.error('Error fetching patient:', error);
            res.status(500).json({ error: 'Failed to fetch patient' });
        }
    }

    // Create new patient
    async create(req, res) {
        try {
            const { name, age, phone } = req.body;
            if (!name || !age || !phone) {
                return res.status(400).json({ error: 'Missing required fields: name, age, phone' });
            }
            const result = await patientQueries.createPatient(name, age, phone);
            res.status(201).json({ message: 'Patient created successfully', patientId: result.insertId });
        } catch (error) {
            console.error('Error creating patient:', error);
            res.status(500).json({ error: 'Failed to create patient' });
        }
    }

    // Update patient
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, age, phone } = req.body;
            if (!name || !age || !phone) {
                return res.status(400).json({ error: 'Missing required fields: name, age, phone' });
            }
            const result = await patientQueries.updatePatient(id, name, age, phone);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Patient not found' });
            }
            res.json({ message: 'Patient updated successfully' });
        } catch (error) {
            console.error('Error updating patient:', error);
            res.status(500).json({ error: 'Failed to update patient' });
        }
    }

    // Delete patient
    async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await patientQueries.deletePatient(id);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Patient not found' });
            }
            res.json({ message: 'Patient deleted successfully' });
        } catch (error) {
            console.error('Error deleting patient:', error);
            res.status(500).json({ error: 'Failed to delete patient' });
        }
    }
}

module.exports = new PatientController();