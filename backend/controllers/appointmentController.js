const appointmentQueries = require('../db/appointmentQueries');
const billQueries = require('../db/billQueries');

class AppointmentController {

    async getAll(req, res) {
        try {
            const data = await appointmentQueries.getAllAppointments();
            res.json(data || []);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async getById(req, res) {
        try {
            const data = await appointmentQueries.getAppointmentById(req.params.id);

            if (!data.length) {
                return res.status(404).json({ error: 'Not found' });
            }

            res.json(data[0]);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async getByPatient(req, res) {
        try {
            const data = await appointmentQueries.getAppointmentsByPatient(req.params.patientId);
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async getByDoctor(req, res) {
        try {
            const data = await appointmentQueries.getAppointmentsByDoctor(req.params.doctorId);
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // CREATE APPOINTMENT + AUTO CONSULTATION BILL
    async create(req, res) {

        try {

            const {
                patient_id,
                doctor_id,
                date,
                appointment_time
            } = req.body;

            if (
    !patient_id ||
    !doctor_id ||
    !date ||
    !appointment_time
) {
    return res.status(400).json({
        error: 'Missing fields'
    });
}

            //--------------------------------------------------
            // CREATE APPOINTMENT
            //--------------------------------------------------

            const appointment =
                await appointmentQueries.createAppointment(
                    patient_id,
                    doctor_id,
                    date,
                    appointment_time
                );

            //--------------------------------------------------
            // GET CONSULTATION FEE
            //--------------------------------------------------

            const consultationFee =
                await appointmentQueries.getDoctorConsultationFee(
                    doctor_id
                );

            const fee = consultationFee || 1500;

            //--------------------------------------------------
            // CREATE BILL
            //--------------------------------------------------
            console.log("BEFORE CREATE BILL");

            const bill =
                await billQueries.createConsultationBill(
                    appointment.appointment_id,
                    patient_id,
                    doctor_id,
                    fee
                );

            res.status(201).json({

                message: 'Appointment booked successfully',

                appointment,

                consultation_fee: fee,

                bill
            });

        } catch (err) {
            console.error(
        'Appointment Create Error:',
        err
    );

    res.status(500).json({
        error: err.message
    });
        }
    }

    async update(req, res) {
        try {

            await appointmentQueries.updateAppointment(
                req.params.id,
                req.body.patient_id,
                req.body.doctor_id,
                req.body.date
            );

            res.json({
                message: 'Updated successfully'
            });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async updateStatus(req, res) {

        try {

            await appointmentQueries.updateAppointmentStatus(
                req.params.id,
                req.body.status
            );

            res.json({
                message: 'Status updated'
            });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async delete(req, res) {

        try {

            await appointmentQueries.deleteAppointment(req.params.id);

            res.json({
                message: 'Deleted successfully'
            });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new AppointmentController();