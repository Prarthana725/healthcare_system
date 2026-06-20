const { getConnection, sql } = require("./sqlConnection");

class PatientQueries {

    async getAllPatients() {

        const pool = await getConnection();

        const result = await pool.request()
            .query("SELECT * FROM patients");

        return result.recordset;
    }

    async getPatientById(patientId) {

        const pool = await getConnection();

        const result = await pool.request()
            .input("id", sql.Int, patientId)
            .query(`
                SELECT *
                FROM patients
                WHERE patient_id = @id
            `);

        return result.recordset;
    }

    async getPatientByPhone(phone) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('phone', sql.VarChar, phone)
            .query(`
                SELECT *
                FROM patients
                WHERE phone = @phone
            `);
        return result.recordset[0];
    }

    async createPatient(name, age, phone) {

        const pool = await getConnection();

        const result = await pool.request()
            .input("name", sql.VarChar, name)
            .input("age", sql.Int, age)
            .input("phone", sql.VarChar, phone)
            .query(`

                INSERT INTO patients (
                    name,
                    age,
                    phone,
                    status
                )

                VALUES (
                    @name,
                    @age,
                    @phone,
                    'Active'
                );

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

                SET
                    name = @name,
                    age = @age,
                    phone = @phone

                WHERE patient_id = @id

            `);

        return result.rowsAffected[0];
    }

    async deletePatient(patientId) {

        const pool = await getConnection();

        const result = await pool.request()
            .input("id", sql.Int, patientId)
            .query(`
                DELETE FROM patients
                WHERE patient_id = @id
            `);

        return result.rowsAffected[0];
    }

    async getUnlinkedPatients() {
        const pool = await getConnection();

        const result = await pool.request().query(`
            SELECT p.*
            FROM patients p
            LEFT JOIN users u
                ON p.patient_id = u.patient_id
            WHERE u.patient_id IS NULL
            ORDER BY p.patient_id DESC
        `);

        return result.recordset;
    }

    async getPatientWithAllData(patientId) {

        const pool = await getConnection();

        //--------------------------------------------------
        // PATIENT
        //--------------------------------------------------

        const patient = await pool.request()
            .input("id", sql.Int, patientId)
            .query(`
                SELECT *
                FROM patients
                WHERE patient_id = @id
            `);

        if (patient.recordset.length === 0) {

            return null;

        }

        //--------------------------------------------------
        // APPOINTMENTS
        //--------------------------------------------------

        const appointments = await pool.request()
            .input("id", sql.Int, patientId)
            .query(`

                SELECT
                    a.*,
                    d.name AS doctor_name,
                    d.specialization

                FROM appointments a

                JOIN doctors d
                    ON a.doctor_id = d.doctor_id

                WHERE a.patient_id = @id

                ORDER BY a.date DESC

            `);

        //--------------------------------------------------
        // PRESCRIPTIONS
        //--------------------------------------------------

        const prescriptions = await pool.request()
            .input("id", sql.Int, patientId)
            .query(`

                SELECT
                    pr.*,
                    d.name AS doctor_name

                FROM prescriptions pr

                JOIN doctors d
                    ON pr.doctor_id = d.doctor_id

                WHERE pr.patient_id = @id

                ORDER BY pr.date DESC

            `);

        //--------------------------------------------------
        // BILLS
        //--------------------------------------------------

        const bills = await pool.request()
            .input("id", sql.Int, patientId)
            .query(`

                SELECT *
                FROM bills

                WHERE patient_id = @id

                ORDER BY bill_date DESC

            `);

        return {

            ...patient.recordset[0],

            appointments: appointments.recordset,

            prescriptions: prescriptions.recordset,

            bills: bills.recordset

        };
    }

    // ======================================================
    // NEW PATIENT DASHBOARD
    // ======================================================

    async getPatientDashboardData(patientId) {

        const pool = await getConnection();

        //--------------------------------------------------
        // PATIENT DETAILS
        //--------------------------------------------------

        const patientResult = await pool.request()
            .input("id", sql.Int, patientId)
            .query(`

                SELECT *
                FROM patients

                WHERE patient_id = @id

            `);

        //--------------------------------------------------
        // APPOINTMENTS
        //--------------------------------------------------

        const appointmentsResult = await pool.request()
            .input("id", sql.Int, patientId)
            .query(`

                SELECT
                    a.appointment_id,
                    a.date,
                    d.name AS doctor_name,
                    d.specialization

                FROM appointments a

                JOIN doctors d
                    ON a.doctor_id = d.doctor_id

                WHERE a.patient_id = @id

                ORDER BY a.date DESC

            `);

        //--------------------------------------------------
        // MEDICAL HISTORY / PRESCRIPTIONS
        //--------------------------------------------------

        const prescriptionsResult = await pool.request()
            .input("id", sql.Int, patientId)
            .query(`

                SELECT
                    pr.prescription_id,
                    pr.date,
                    d.name AS doctor_name,
                    m.name AS medicine_name,
                    pd.quantity

                FROM prescriptions pr

                JOIN doctors d
                    ON pr.doctor_id = d.doctor_id

                JOIN prescription_details pd
                    ON pr.prescription_id = pd.prescription_id

                JOIN medicines m
                    ON pd.medicine_id = m.medicine_id

                WHERE pr.patient_id = @id

                ORDER BY pr.date DESC

            `);

        //--------------------------------------------------
        // BILLS
        //--------------------------------------------------

        const billsResult = await pool.request()
            .input("id", sql.Int, patientId)
            .query(`

                SELECT
                    bill_id,
                    total_amount,
                    status,
                    bill_date

                FROM bills

                WHERE patient_id = @id

                ORDER BY bill_date DESC

            `);

        return {

            patient: patientResult.recordset[0],

            appointments: appointmentsResult.recordset,

            prescriptions: prescriptionsResult.recordset,

            bills: billsResult.recordset

        };
    }
}

module.exports = new PatientQueries();