const doctorQueries = require('../db/doctorQueries');

class DoctorController {
    // Get all doctors
    async getAll(req, res) {
        try {
            const doctors = await doctorQueries.getAllDoctors();
            console.log('DoctorController.getAll - Returning doctors:', doctors.length);
            res.json(doctors || []);
        } catch (error) {
            console.error('DoctorController.getAll - SQL Error:', error.message);
            res.status(500).json({ error: 'Failed to fetch doctors', details: error.message });
        }
    }

    // Get doctors with appointment count (JOIN query)
    async getAllWithAppointments(req, res) {
        try {
            const doctors = await doctorQueries.getAllDoctorsWithAppointments();
            res.json(doctors);
        } catch (error) {
            console.error('Error fetching doctors with appointments:', error);
            res.status(500).json({ error: 'Failed to fetch doctors' });
        }
    }

    // Get doctor by ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const doctors = await doctorQueries.getDoctorById(id);
            if (doctors.length === 0) {
                return res.status(404).json({ error: 'Doctor not found' });
            }
            res.json(doctors[0]);
        } catch (error) {
            console.error('Error fetching doctor:', error);
            res.status(500).json({ error: 'Failed to fetch doctor' });
        }
    }

    // Get doctor with appointments (JOIN query)
    async getWithAppointments(req, res) {
        try {
            const { id } = req.params;
            const doctors = await doctorQueries.getDoctorWithAppointments(id);
            if (doctors.length === 0) {
                return res.status(404).json({ error: 'Doctor not found' });
            }
            res.json(doctors[0]);
        } catch (error) {
            console.error('Error fetching doctor:', error);
            res.status(500).json({ error: 'Failed to fetch doctor' });
        }
    }

    // Create new doctor
    async create(req, res) {
        try {
            const { name, specialization } = req.body;
            console.log('DoctorController.create - Request body:', { name, specialization });

            if (!name || !specialization) {
                return res.status(400).json({ error: 'Missing required fields: name, specialization' });
            }

            const result = await doctorQueries.createDoctor(name, specialization);
            res.status(201).json({ message: 'Doctor created successfully', doctorId: result.doctor_id });
        } catch (error) {
            console.error('DoctorController.create - Error:', error.message);
            res.status(500).json({ error: 'Failed to create doctor', details: error.message });
        }
    }

    // Update doctor
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, specialization } = req.body;
            if (!name || !specialization) {
                return res.status(400).json({ error: 'Missing required fields: name, specialization' });
            }

            const result = await doctorQueries.updateDoctor(id, name, specialization);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Doctor not found' });
            }
            res.json({ message: 'Doctor updated successfully' });
        } catch (error) {
            console.error('Error updating doctor:', error);
            res.status(500).json({ error: 'Failed to update doctor' });
        }
    }

    // Get doctor with all related data (appointments, prescriptions, bills)
    async getWithAllData(req, res) {
        try {
            const { id } = req.params;
            const doctorData = await doctorQueries.getDoctorWithAllData(id);
            if (!doctorData) {
                return res.status(404).json({ error: 'Doctor not found' });
            }
            res.json(doctorData);
        } catch (error) {
            console.error('Error fetching doctor with all data:', error);
            res.status(500).json({ error: 'Failed to fetch doctor data' });
        }
    }

    // Delete doctor
    async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await doctorQueries.deleteDoctor(id);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Doctor not found' });
            }
            res.json({ message: 'Doctor deleted successfully' });
        } catch (error) {
            console.error('Error deleting doctor:', error);
            res.status(500).json({ error: 'Failed to delete doctor' });
        }
    }
}

module.exports = new DoctorController();