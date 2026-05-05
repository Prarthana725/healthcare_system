const { getConnection, sql } = require("./sqlConnection");

class PrescriptionQueries {

    // GET ALL
    async getAllPrescriptions() {
        const pool = await getConnection();

        const result = await pool.request().query(`
            SELECT pr.prescription_id, pr.date,
                   p.patient_id, p.name AS patient_name,
                   d.doctor_id, d.name AS doctor_name,
                   pd.id AS detail_id, pd.medicine_id, pd.quantity,
                   m.name AS medicine_name
            FROM prescriptions pr
            JOIN patients p ON pr.patient_id = p.patient_id
            JOIN doctors d ON pr.doctor_id = d.doctor_id
            LEFT JOIN prescription_details pd ON pr.prescription_id = pd.prescription_id
            LEFT JOIN medicines m ON pd.medicine_id = m.medicine_id
            ORDER BY pr.prescription_id DESC
        `);

        return result.recordset;
    }

    // GET BY ID
    async getPrescriptionById(id) {
        const pool = await getConnection();

        const result = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                SELECT pr.prescription_id, pr.date,
                       p.patient_id, p.name AS patient_name,
                       d.doctor_id, d.name AS doctor_name,
                       pd.id AS detail_id, pd.medicine_id, pd.quantity,
                       m.name AS medicine_name
                FROM prescriptions pr
                JOIN patients p ON pr.patient_id = p.patient_id
                JOIN doctors d ON pr.doctor_id = d.doctor_id
                LEFT JOIN prescription_details pd ON pr.prescription_id = pd.prescription_id
                LEFT JOIN medicines m ON pd.medicine_id = m.medicine_id
                WHERE pr.prescription_id = @id
            `);

        return result.recordset;
    }

    // GET BY PATIENT
    async getPrescriptionsByPatient(patientId) {
        const pool = await getConnection();

        const result = await pool.request()
            .input("pid", sql.Int, patientId)
            .query(`
                SELECT pr.prescription_id, pr.date,
                       p.name AS patient_name,
                       d.name AS doctor_name,
                       pd.id AS detail_id, pd.medicine_id, pd.quantity,
                       m.name AS medicine_name
                FROM prescriptions pr
                JOIN patients p ON pr.patient_id = p.patient_id
                JOIN doctors d ON pr.doctor_id = d.doctor_id
                LEFT JOIN prescription_details pd ON pr.prescription_id = pd.prescription_id
                LEFT JOIN medicines m ON pd.medicine_id = m.medicine_id
                WHERE pr.patient_id = @pid
            `);

        return result.recordset;
    }

    // CREATE PRESCRIPTION
    async createPrescriptionWithDetails(patientId, doctorId, date, details) {
        const pool = await getConnection();
        const transaction = new sql.Transaction(pool);

        try {
            await transaction.begin();

            const request = new sql.Request(transaction);

            // Insert prescription
            const insertPrescription = await request
                .input("patient_id", sql.Int, patientId)
                .input("doctor_id", sql.Int, doctorId)
                .input("date", sql.Date, date)
                .query(`
                    INSERT INTO prescriptions (patient_id, doctor_id, date)
                    OUTPUT INSERTED.prescription_id
                    VALUES (@patient_id, @doctor_id, @date)
                `);

            const prescriptionId = insertPrescription.recordset[0].prescription_id;

            // Insert details
            for (const d of details) {
                await new sql.Request(transaction)
                    .input("pid", sql.Int, prescriptionId)
                    .input("mid", sql.Int, d.medicine_id)
                    .input("qty", sql.Int, d.quantity)
                    .query(`
                        INSERT INTO prescription_details (prescription_id, medicine_id, quantity)
                        VALUES (@pid, @mid, @qty)
                    `);

                // Reduce stock
                await new sql.Request(transaction)
                    .input("mid", sql.Int, d.medicine_id)
                    .input("qty", sql.Int, d.quantity)
                    .query(`
                        UPDATE medicines
                        SET quantity = quantity - @qty
                        WHERE medicine_id = @mid
                    `);
            }

            await transaction.commit();

            return { prescriptionId };

        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }

    // UPDATE
    async updatePrescription(id, patientId, doctorId, date) {
        const pool = await getConnection();

        const result = await pool.request()
            .input("id", sql.Int, id)
            .input("pid", sql.Int, patientId)
            .input("did", sql.Int, doctorId)
            .input("date", sql.Date, date)
            .query(`
                UPDATE prescriptions
                SET patient_id=@pid, doctor_id=@did, date=@date
                WHERE prescription_id=@id
            `);

        return result.rowsAffected;
    }

    // DELETE
    async deletePrescription(id) {
        const pool = await getConnection();

        const result = await pool.request()
            .input("id", sql.Int, id)
            .query(`DELETE FROM prescriptions WHERE prescription_id=@id`);

        return result.rowsAffected;
    }

    // BILL TOTAL FUNCTION
    async getPrescriptionBillTotal(id) {
        const pool = await getConnection();

        const result = await pool.request()
            .input("id", sql.Int, id)
            .query(`SELECT dbo.CalculateBillTotal(@id) AS total_amount`);

        return result.recordset[0];
    }
}

module.exports = new PrescriptionQueries();