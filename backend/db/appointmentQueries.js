const { getConnection } = require('./connection');

class AppointmentQueries {
    // Get all appointments with patient and doctor names (JOIN)
    async getAllAppointments() {
        try {
            const connection = await getConnection();
            const [rows] = await connection.execute(`
                SELECT a.appointment_id, a.date,
                       p.patient_id, p.name AS patient_name,
                       d.doctor_id, d.name AS doctor_name, d.specialization
                FROM appointments a
                JOIN patients p ON a.patient_id = p.patient_id
                JOIN doctors d ON a.doctor_id = d.doctor_id
                ORDER BY a.date DESC
            `);
            console.log('getAllAppointments - Fetched rows:', rows.length);
            return rows;
        } catch (error) {
            console.error('getAllAppointments - SQL Error:', error.message);
            throw error;
        }
    }

    // Get appointment by ID with details (JOIN)
    async getAppointmentById(appointmentId) {
        const connection = await getConnection();
        const [rows] = await connection.execute(`
            SELECT a.appointment_id, a.date,
                   p.patient_id, p.name AS patient_name, p.age, p.phone,
                   d.doctor_id, d.name AS doctor_name, d.specialization
            FROM appointments a
            JOIN patients p ON a.patient_id = p.patient_id
            JOIN doctors d ON a.doctor_id = d.doctor_id
            WHERE a.appointment_id = ?
        `, [appointmentId]);
        return rows;
    }

    // Get appointments by patient (JOIN)
    async getAppointmentsByPatient(patientId) {
        const connection = await getConnection();
        const [rows] = await connection.execute(`
            SELECT a.appointment_id, a.date,
                   p.name AS patient_name,
                   d.doctor_id, d.name AS doctor_name, d.specialization
            FROM appointments a
            JOIN patients p ON a.patient_id = p.patient_id
            JOIN doctors d ON a.doctor_id = d.doctor_id
            WHERE a.patient_id = ?
            ORDER BY a.date DESC
        `, [patientId]);
        return rows;
    }

    // Get appointments by doctor (JOIN)
    async getAppointmentsByDoctor(doctorId) {
        const connection = await getConnection();
        const [rows] = await connection.execute(`
            SELECT a.appointment_id, a.date,
                   p.patient_id, p.name AS patient_name, p.age,
                   d.name AS doctor_name
            FROM appointments a
            JOIN patients p ON a.patient_id = p.patient_id
            JOIN doctors d ON a.doctor_id = d.doctor_id
            WHERE a.doctor_id = ?
            ORDER BY a.date DESC
        `, [doctorId]);
        return rows;
    }

    // Create appointment
    async createAppointment(patientId, doctorId, date) {
        try {
            const connection = await getConnection();
            const [result] = await connection.execute(
                'INSERT INTO appointments (patient_id, doctor_id, date) VALUES (?, ?, ?)',
                [patientId, doctorId, date]
            );
            console.log('createAppointment - New appointment ID:', result.insertId);
            return result;
        } catch (error) {
            console.error('createAppointment - SQL Error:', error.message);
            throw error;
        }
    }

    // Update appointment
    async updateAppointment(appointmentId, patientId, doctorId, date) {
        const connection = await getConnection();
        const [result] = await connection.execute(
            'UPDATE appointments SET patient_id = ?, doctor_id = ?, date = ? WHERE appointment_id = ?',
            [patientId, doctorId, date, appointmentId]
        );
        return result;
    }

    // Delete appointment
    async deleteAppointment(appointmentId) {
        const connection = await getConnection();
        const [result] = await connection.execute(
            'DELETE FROM appointments WHERE appointment_id = ?',
            [appointmentId]
        );
        return result;
    }
}

module.exports = new AppointmentQueries();
