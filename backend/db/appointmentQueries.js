const { getConnection, sql } = require("./sqlConnection");

class AppointmentQueries {

    // GET ALL
    async getAllAppointments() {

        const pool =
            await getConnection();

        const result =
            await pool.request()

                .query(`

                    SELECT

                        a.appointment_id,

                        a.date,

                        a.status,

                        p.patient_id,

                        p.name AS patient_name,

                        d.doctor_id,

                        d.name AS doctor_name,

                        d.specialization

                    FROM appointments a

                    JOIN patients p

                        ON a.patient_id =
                        p.patient_id

                    JOIN doctors d

                        ON a.doctor_id =
                        d.doctor_id

                    ORDER BY a.date DESC

                `);

        return result.recordset;
    }

    // GET BY ID
    async getAppointmentById(id) {

        const pool =
            await getConnection();

        const result =
            await pool.request()

                .input(
                    "id",
                    sql.Int,
                    id
                )

                .query(`

                    SELECT

                        a.appointment_id,

                        a.date,

                        a.status,

                        p.patient_id,

                        p.name AS patient_name,

                        p.age,

                        p.phone,

                        d.doctor_id,

                        d.name AS doctor_name,

                        d.specialization

                    FROM appointments a

                    JOIN patients p

                        ON a.patient_id =
                        p.patient_id

                    JOIN doctors d

                        ON a.doctor_id =
                        d.doctor_id

                    WHERE a.appointment_id =
                        @id

                `);

        return result.recordset;
    }

    // UPDATE STATUS
    async updateAppointmentStatus(
        id,
        status
    ) {

        const pool =
            await getConnection();

        const result =
            await pool.request()

                .input(
                    'id',
                    sql.Int,
                    id
                )

                .input(
                    'status',
                    sql.VarChar,
                    status
                )

                .query(`

                    UPDATE appointments

                    SET status = @status

                    WHERE appointment_id = @id

                `);

        return result.rowsAffected;
    }

    // GET BY PATIENT
    async getAppointmentsByPatient(
        patientId
    ) {

        const pool =
            await getConnection();

        const result =
            await pool.request()

                .input(
                    "pid",
                    sql.Int,
                    patientId
                )

                .query(`

                    SELECT

                        a.appointment_id,

                        a.date,

                        a.status,

                        p.name AS patient_name,

                        d.doctor_id,

                        d.name AS doctor_name,

                        d.specialization

                    FROM appointments a

                    JOIN patients p

                        ON a.patient_id =
                        p.patient_id

                    JOIN doctors d

                        ON a.doctor_id =
                        d.doctor_id

                    WHERE a.patient_id =
                        @pid

                    ORDER BY a.date DESC

                `);

        return result.recordset;
    }

    // GET BY DOCTOR
    async getAppointmentsByDoctor(
        doctorId
    ) {

        const pool =
            await getConnection();

        const result =
            await pool.request()

                .input(
                    "did",
                    sql.Int,
                    doctorId
                )

                .query(`

                    SELECT

                        a.appointment_id,

                        a.date,

                        a.status,

                        p.patient_id,

                        p.name AS patient_name,

                        p.age,

                        d.name AS doctor_name

                    FROM appointments a

                    JOIN patients p

                        ON a.patient_id =
                        p.patient_id

                    JOIN doctors d

                        ON a.doctor_id =
                        d.doctor_id

                    WHERE a.doctor_id =
                        @did

                    ORDER BY a.date DESC

                `);

        return result.recordset;
    }

    // CREATE
    async createAppointment(
        patientId,
        doctorId,
        date
    ) {

        const pool =
            await getConnection();

        const result =
            await pool.request()

                .input(
                    "pid",
                    sql.Int,
                    patientId
                )

                .input(
                    "did",
                    sql.Int,
                    doctorId
                )

                .input(
                    "date",
                    sql.Date,
                    date
                )

                .query(`

                    INSERT INTO appointments (

                        patient_id,

                        doctor_id,

                        date,

                        status

                    )

                    OUTPUT
                        INSERTED.appointment_id

                    VALUES (

                        @pid,

                        @did,

                        @date,

                        'pending'

                    )

                `);

        return result.recordset[0];
    }

    // UPDATE
    async updateAppointment(
        id,
        patientId,
        doctorId,
        date
    ) {

        const pool =
            await getConnection();

        const result =
            await pool.request()

                .input(
                    "id",
                    sql.Int,
                    id
                )

                .input(
                    "pid",
                    sql.Int,
                    patientId
                )

                .input(
                    "did",
                    sql.Int,
                    doctorId
                )

                .input(
                    "date",
                    sql.Date,
                    date
                )

                .query(`

                    UPDATE appointments

                    SET

                        patient_id = @pid,

                        doctor_id = @did,

                        date = @date

                    WHERE appointment_id = @id

                `);

        return result.rowsAffected;
    }

    // DELETE
    async deleteAppointment(id) {

        const pool =
            await getConnection();

        const result =
            await pool.request()

                .input(
                    "id",
                    sql.Int,
                    id
                )

                .query(`

                    DELETE FROM appointments

                    WHERE appointment_id = @id

                `);

        return result.rowsAffected;
    }
}

module.exports =
    new AppointmentQueries();