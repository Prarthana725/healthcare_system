const { getConnection, sql } = require("./sqlConnection");

class DoctorQueries {

    // GET ALL DOCTORS
    async getAllDoctors() {
        const pool = await getConnection();
        const result = await pool.request()
            .query("SELECT * FROM doctors");

        return result.recordset;
    }

    // GET DOCTOR BY ID
    async getDoctorById(doctorId) {
        const pool = await getConnection();

        const result = await pool.request()
            .input("id", sql.Int, doctorId)
            .query("SELECT * FROM doctors WHERE doctor_id = @id");

        return result.recordset;
    }

    // CREATE DOCTOR
    async createDoctor(name, specialization) {
        const pool = await getConnection();

        const result = await pool.request()
            .input("name", sql.VarChar, name)
            .input("specialization", sql.VarChar, specialization)
            .query(`
    INSERT INTO doctors (name, specialization)
    OUTPUT INSERTED.doctor_id
    VALUES (@name, @specialization);
`);

        return result.recordset[0];
    }

    // UPDATE DOCTOR
    async updateDoctor(doctorId, name, specialization) {
        const pool = await getConnection();

        const result = await pool.request()
            .input("id", sql.Int, doctorId)
            .input("name", sql.VarChar, name)
            .input("specialization", sql.VarChar, specialization)
            .query(`
                UPDATE doctors
                SET name=@name, specialization=@specialization
                WHERE doctor_id=@id
            `);

        return result.rowsAffected;
    }

    // DELETE DOCTOR
    async deleteDoctor(doctorId) {
        const pool = await getConnection();

        const result = await pool.request()
            .input("id", sql.Int, doctorId)
            .query("DELETE FROM doctors WHERE doctor_id=@id");

        return result.rowsAffected;
    }

    // DOCTOR WITH APPOINTMENTS (JOIN)
    async getAllDoctorsWithAppointments() {
        const pool = await getConnection();

        const result = await pool.request().query(`
            SELECT d.doctor_id, d.name, d.specialization,
                   COUNT(a.appointment_id) AS total_appointments
            FROM doctors d
            LEFT JOIN appointments a ON d.doctor_id = a.doctor_id
            GROUP BY d.doctor_id, d.name, d.specialization
        `);

        return result.recordset;
    }

    // DOCTOR WITH FULL DATA
    async getDoctorWithAllData(doctorId) {
        const pool = await getConnection();

        const doctor = await pool.request()
            .input("id", sql.Int, doctorId)
            .query("SELECT * FROM doctors WHERE doctor_id=@id");

        if (doctor.recordset.length === 0) return null;

        const appointments = await pool.request()
            .input("id", sql.Int, doctorId)
            .query(`
                SELECT a.*, p.name AS patient_name
                FROM appointments a
                JOIN patients p ON a.patient_id = p.patient_id
                WHERE a.doctor_id=@id
            `);

        const prescriptions = await pool.request()
            .input("id", sql.Int, doctorId)
            .query(`
                SELECT pr.*, p.name AS patient_name
                FROM prescriptions pr
                JOIN patients p ON pr.patient_id = p.patient_id
                WHERE pr.doctor_id=@id
            `);

        return {
            ...doctor.recordset[0],
            appointments: appointments.recordset,
            prescriptions: prescriptions.recordset
        };
    }
}

module.exports = new DoctorQueries();