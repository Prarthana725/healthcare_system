const appointmentQueries = require('../db/appointmentQueries');

class AppointmentController {

    // GET ALL
    async getAll(req, res) {
        try {
            const data = await appointmentQueries.getAllAppointments();
            res.json(data || []);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // GET BY ID
    async getById(req, res) {
        try {
            const data = await appointmentQueries.getAppointmentById(req.params.id);
            if (!data.length) return res.status(404).json({ error: "Not found" });
            res.json(data[0]);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // GET BY PATIENT
    async getByPatient(req, res) {
        try {
            const data = await appointmentQueries.getAppointmentsByPatient(req.params.patientId);
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // GET BY DOCTOR
    async getByDoctor(req, res) {
        try {
            const data = await appointmentQueries.getAppointmentsByDoctor(req.params.doctorId);
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // CREATE
    async create(req, res) {
        try {
            const { patient_id, doctor_id, date } = req.body;

            if (!patient_id || !doctor_id || !date) {
                return res.status(400).json({ error: "Missing fields" });
            }

            const result = await appointmentQueries.createAppointment(
                patient_id,
                doctor_id,
                date
            );

            res.status(201).json(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // UPDATE
    async update(req, res) {
        try {
            await appointmentQueries.updateAppointment(
                req.params.id,
                req.body.patient_id,
                req.body.doctor_id,
                req.body.date
            );

            res.json({ message: "Updated successfully" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // UPDATE STATUS
    async updateStatus(req, res) {
        try {
            await appointmentQueries.updateAppointmentStatus(
                req.params.id,
                req.body.status
            );

            res.json({ message: "Status updated" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // DELETE
    async delete(req, res) {
        try {
            await appointmentQueries.deleteAppointment(req.params.id);
            res.json({ message: "Deleted successfully" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new AppointmentController();