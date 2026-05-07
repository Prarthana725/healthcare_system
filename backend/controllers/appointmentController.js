const appointmentQueries = require('../db/appointmentQueries');

class AppointmentController {
    // Get all appointments with patient and doctor names (JOIN query)
    async getAll(req, res) {
        try {
            const appointments = await appointmentQueries.getAllAppointments();
            console.log('AppointmentController.getAll - Returning appointments:', appointments.length);
            res.json(appointments || []);
        } catch (error) {
            console.error('AppointmentController.getAll - SQL Error:', error.message);
            res.status(500).json({ error: 'Failed to fetch appointments', details: error.message });
        }
    }

    // Get appointment by ID with details (JOIN query)
    async getById(req, res) {
        try {
            const { id } = req.params;
            const appointments = await appointmentQueries.getAppointmentById(id);
            if (appointments.length === 0) {
                return res.status(404).json({ error: 'Appointment not found' });
            }
            res.json(appointments[0]);
        } catch (error) {
            console.error('Error fetching appointment:', error);
            res.status(500).json({ error: 'Failed to fetch appointment' });
        }
    }

    // Get appointments by patient (JOIN query)
    async getByPatient(req, res) {
        try {
            const { patientId } = req.params;
            const appointments = await appointmentQueries.getAppointmentsByPatient(patientId);
            res.json(appointments);
        } catch (error) {
            console.error('Error fetching patient appointments:', error);
            res.status(500).json({ error: 'Failed to fetch appointments' });
        }
    }

    // Get appointments by doctor (JOIN query)
    async getByDoctor(req, res) {
        try {
            const { doctorId } = req.params;
            const appointments = await appointmentQueries.getAppointmentsByDoctor(doctorId);
            res.json(appointments);
        } catch (error) {
            console.error('Error fetching doctor appointments:', error);
            res.status(500).json({ error: 'Failed to fetch appointments' });
        }
    } async updateStatus(req, res) {

        try {

            const { id } = req.params;
            const { status } = req.body;

            await appointmentQueries.updateAppointmentStatus(
                id,
                status
            );

            res.json({
                success: true,
                message: 'Appointment updated'
            });

        } catch (err) {

            console.error(err);

            res.status(500).json({
                error: 'Failed to update appointment'
            });

        }
    }

    // Create new appointment
    async create(req, res) {
        try {
            const { patient_id, doctor_id, date } = req.body;
            console.log('AppointmentController.create - Request body:', { patient_id, doctor_id, date });

            if (!patient_id || !doctor_id || !date) {
                return res.status(400).json({ error: 'Missing required fields: patient_id, doctor_id, date' });
            }
            const result = await appointmentQueries.createAppointment(patient_id, doctor_id, date);
            res.status(201).json({ message: 'Appointment created successfully', appointmentId: result.appointment_id });
        } catch (error) {
            console.error('AppointmentController.create - Error:', error.message);
            res.status(500).json({ error: 'Failed to create appointment', details: error.message });
        }
    }

    // Update appointment
    async update(req, res) {
        try {
            const { id } = req.params;
            const { patient_id, doctor_id, date } = req.body;
            if (!patient_id || !doctor_id || !date) {
                return res.status(400).json({ error: 'Missing required fields: patient_id, doctor_id, date' });
            }
            const result = await appointmentQueries.updateAppointment(id, patient_id, doctor_id, date);
            if (result[0] === 0) {
                return res.status(404).json({ error: 'Appointment not found' });
            }
            res.json({ message: 'Appointment updated successfully' });
        } catch (error) {
            console.error('Error updating appointment:', error);
            res.status(500).json({ error: 'Failed to update appointment' });
        }
    }

    // Delete appointment
    async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await appointmentQueries.deleteAppointment(id);
            if (result[0] === 0) {
                return res.status(404).json({ error: 'Appointment not found' });
            }
            res.json({ message: 'Appointment deleted successfully' });
        } catch (error) {
            console.error('Error deleting appointment:', error);
            res.status(500).json({ error: 'Failed to delete appointment' });
        }
    }
}

module.exports = new AppointmentController();