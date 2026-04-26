const { getConnection } = require('./connection');

class DoctorQueries {
    // Get all doctors
    async getAllDoctors() {
        const connection = await getConnection();
        const [rows] = await connection.execute('SELECT * FROM doctors');
        return rows;
    }

    // Get doctor by ID
    async getDoctorById(doctorId) {
        const connection = await getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM doctors WHERE doctor_id = ?',
            [doctorId]
        );
        return rows;
    }

    // Get doctor with appointment count (JOIN)
    async getDoctorWithAppointments(doctorId) {
        const connection = await getConnection();
        const [rows] = await connection.execute(`
            SELECT d.*, COUNT(a.appointment_id) AS appointment_count
            FROM doctors d
            LEFT JOIN appointments a ON d.doctor_id = a.doctor_id
            WHERE d.doctor_id = ?
            GROUP BY d.doctor_id
        `, [doctorId]);
        return rows;
    }

    // Get doctors with their appointments (JOIN)
    async getAllDoctorsWithAppointments() {
        const connection = await getConnection();
        const [rows] = await connection.execute(`
            SELECT d.doctor_id, d.name, d.specialization, 
                   COUNT(a.appointment_id) AS total_appointments
            FROM doctors d
            LEFT JOIN appointments a ON d.doctor_id = a.doctor_id
            GROUP BY d.doctor_id
            ORDER BY d.doctor_id
        `);
        return rows;
    }

    // Create doctor
    async createDoctor(name, specialization) {
        const connection = await getConnection();
        const [result] = await connection.execute(
            'INSERT INTO doctors (name, specialization) VALUES (?, ?)',
            [name, specialization]
        );
        return result;
    }

    // Update doctor
    async updateDoctor(doctorId, name, specialization) {
        const connection = await getConnection();
        const [result] = await connection.execute(
            'UPDATE doctors SET name = ?, specialization = ? WHERE doctor_id = ?',
            [name, specialization, doctorId]
        );
        return result;
    }

    // Delete doctor
    async deleteDoctor(doctorId) {
        const connection = await getConnection();
        const [result] = await connection.execute(
            'DELETE FROM doctors WHERE doctor_id = ?',
            [doctorId]
        );
        return result;
    }
}

module.exports = new DoctorQueries();
