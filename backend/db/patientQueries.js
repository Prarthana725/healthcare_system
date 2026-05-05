const { getConnection, sql } = require("./sqlConnection");

class PatientQueries {

    async getAllPatients() {
        const pool = await getConnection();
        const result = await pool.request().query("SELECT * FROM patients");
        return result.recordset;
    }

    async getPatientById(patientId) {
        const pool = await getConnection();

        const result = await pool.request()
            .input("id", sql.Int, patientId)
            .query("SELECT * FROM patients WHERE patient_id = @id");

        return result.recordset;
    }

    async createPatient(name, age, phone) {
        const pool = await getConnection();

        const result = await pool.request()
            .input("name", sql.VarChar, name)
            .input("age", sql.Int, age)
            .input("phone", sql.VarChar, phone)
            .query(`
                INSERT INTO patients (name, age, phone)
                VALUES (@name, @age, @phone);
                SELECT SCOPE_IDENTITY() AS id;
            `);

        return result.recordset[0];
    }

    async updatePatient(patientId, name, age, phone) {
        const pool = await getConnection();

        const result = await pool.request()
            .input("id", sql.Int, patientId)
            .input("name", sql.VarChar, name)
            .input("age", sql.Int, age)
            .input("phone", sql.VarChar, phone)
            .query(`
                UPDATE patients
                SET name=@name, age=@age, phone=@phone
                WHERE patient_id=@id
            `);

        return result.rowsAffected[0];
    }

    async deletePatient(patientId) {
        const pool = await getConnection();

        const result = await pool.request()
            .input("id", sql.Int, patientId)
            .query("DELETE FROM patients WHERE patient_id=@id");

        return result.rowsAffected[0];
    }

    async getPatientWithAllData(patientId) {
        const pool = await getConnection();

        const patient = await pool.request()
            .input("id", sql.Int, patientId)
            .query("SELECT * FROM patients WHERE patient_id=@id");

        if (patient.recordset.length === 0) return null;

        const appointments = await pool.request()
            .input("id", sql.Int, patientId)
            .query(`
                SELECT a.*, d.name AS doctor_name
                FROM appointments a
                JOIN doctors d ON a.doctor_id = d.doctor_id
                WHERE a.patient_id=@id
            `);

        const prescriptions = await pool.request()
            .input("id", sql.Int, patientId)
            .query(`
                SELECT pr.*, d.name AS doctor_name
                FROM prescriptions pr
                JOIN doctors d ON pr.doctor_id = d.doctor_id
                WHERE pr.patient_id=@id
            `);

        const bills = await pool.request()
            .input("id", sql.Int, patientId)
            .query(`
                SELECT * FROM bills
                WHERE patient_id=@id
            `);

        return {
            ...patient.recordset[0],
            appointments: appointments.recordset,
            prescriptions: prescriptions.recordset,
            bills: bills.recordset
        };
    }
}

module.exports = new PatientQueries();