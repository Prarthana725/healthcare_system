const { getConnection, sql } = require("./sqlConnection");

class PrescriptionQueries {

    // GET ALL
    async getAllPrescriptions() {
        const pool = await getConnection();

        const result = await pool.request().query(`
            SELECT
                pr.prescription_id,
                pr.date,
                p.patient_id,
                p.name AS patient_name,
                d.doctor_id,
                d.name AS doctor_name,
                pd.id AS detail_id,
                pd.medicine_id,
                pd.quantity,
                m.name AS medicine_name
            FROM prescriptions pr
            JOIN patients p
                ON pr.patient_id = p.patient_id
            JOIN doctors d
                ON pr.doctor_id = d.doctor_id
            LEFT JOIN prescription_details pd
                ON pr.prescription_id = pd.prescription_id
            LEFT JOIN medicines m
                ON pd.medicine_id = m.medicine_id
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
                SELECT
                    pr.prescription_id,
                    pr.date,
                    p.patient_id,
                    p.name AS patient_name,
                    d.doctor_id,
                    d.name AS doctor_name,
                    pd.id AS detail_id,
                    pd.medicine_id,
                    pd.quantity,
                    m.name AS medicine_name
                FROM prescriptions pr
                JOIN patients p
                    ON pr.patient_id = p.patient_id
                JOIN doctors d
                    ON pr.doctor_id = d.doctor_id
                LEFT JOIN prescription_details pd
                    ON pr.prescription_id = pd.prescription_id
                LEFT JOIN medicines m
                    ON pd.medicine_id = m.medicine_id
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
                SELECT
                    pr.prescription_id,
                    pr.date,
                    p.name AS patient_name,
                    d.name AS doctor_name,
                    pd.id AS detail_id,
                    pd.medicine_id,
                    pd.quantity,
                    m.name AS medicine_name
                FROM prescriptions pr
                JOIN patients p
                    ON pr.patient_id = p.patient_id
                JOIN doctors d
                    ON pr.doctor_id = d.doctor_id
                LEFT JOIN prescription_details pd
                    ON pr.prescription_id = pd.prescription_id
                LEFT JOIN medicines m
                    ON pd.medicine_id = m.medicine_id
                WHERE pr.patient_id = @pid
            `);

        return result.recordset;
    }

    // CREATE PRESCRIPTION
    async createPrescriptionWithDetails(
        patientId,
        doctorId,
        date,
        details,
        consultationFee = 0,
        appointmentFee = 0,
        medicineFee = 0,
        serviceFee = 0,
        subtotal = 0,
        tax = 0,
        totalAmount = 0
    ) {

        const pool = await getConnection();
        const transaction = new sql.Transaction(pool);

        try {

            await transaction.begin();

            // INSERT PRESCRIPTION
            const insertPrescription =
                await new sql.Request(transaction)
                    .input("patient_id", sql.Int, patientId)
                    .input("doctor_id", sql.Int, doctorId)
                    .input("date", sql.Date, date)
                    .query(`
                        INSERT INTO prescriptions (
                            patient_id,
                            doctor_id,
                            date
                        )
                        OUTPUT INSERTED.prescription_id
                        VALUES (
                            @patient_id,
                            @doctor_id,
                            @date
                        )
                    `);

            const prescriptionId =
                insertPrescription.recordset[0].prescription_id;

            // INSERT DETAILS + UPDATE STOCK
            for (const item of details) {

                await new sql.Request(transaction)
                    .input("pid", sql.Int, prescriptionId)
                    .input("mid", sql.Int, item.medicine_id)
                    .input("qty", sql.Int, item.quantity)
                    .query(`
                        INSERT INTO prescription_details (
                            prescription_id,
                            medicine_id,
                            quantity
                        )
                        VALUES (
                            @pid,
                            @mid,
                            @qty
                        )
                    `);

                await new sql.Request(transaction)
                    .input("mid", sql.Int, item.medicine_id)
                    .input("qty", sql.Int, item.quantity)
                    .query(`
                        UPDATE medicines
                        SET quantity = quantity - @qty
                        WHERE medicine_id = @mid
                    `);
            }

           // CREATE BILL
const billInsert =
    await new sql.Request(transaction)

        .input("pid", sql.Int, prescriptionId)

        .input("consultation_fee", sql.Decimal(10,2), consultationFee)
        .input("appointment_fee", sql.Decimal(10,2), appointmentFee)
        .input("medicine_fee", sql.Decimal(10,2), medicineFee)
        .input("service_fee", sql.Decimal(10,2), serviceFee)

        .input("subtotal", sql.Decimal(10,2), subtotal)
        .input("tax", sql.Decimal(10,2), tax)
        .input("total_amount", sql.Decimal(10,2), totalAmount)

        .query(`

            INSERT INTO bills (

                prescription_id,
                patient_id,
                doctor_id,
                bill_date,

                consultation_fee,
                appointment_fee,
                medicine_fee,
                service_fee,

                subtotal,
                tax,
                total_amount,

                paid_amount,
                balance_amount,

                payment_status,
                payment_method,
                status

            )

            OUTPUT INSERTED.bill_id

            SELECT

                p.prescription_id,
                p.patient_id,
                p.doctor_id,
                GETDATE(),

                @consultation_fee,
                @appointment_fee,
                @medicine_fee,
                @service_fee,

                @subtotal,
                @tax,
                @total_amount,

                0,
                @total_amount,

                'pending',
                'Cash',
                'pending'

            FROM prescriptions p

            WHERE p.prescription_id = @pid

        `);

const billId =
    billInsert.recordset[0].bill_id;

await transaction.commit();

return {
    prescriptionId,
    bill: {
        bill_id: billId,
        consultation_fee: consultationFee,
        appointment_fee: appointmentFee,
        medicine_fee: medicineFee,
        service_fee: serviceFee,
        subtotal: subtotal,
        tax: tax,
        total_amount: totalAmount,
        paid_amount: 0,
        balance_amount: totalAmount,
        payment_status: "pending",
        status: "pending"
    }
};
} catch (err) {

    if (transaction._aborted === false) {
        try {
            await transaction.rollback();
        } catch {}
    }

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
                SET
                    patient_id = @pid,
                    doctor_id = @did,
                    date = @date
                WHERE prescription_id = @id
            `);

        return result.rowsAffected;
    }


    // DELETE
    async deletePrescription(id) {

        const pool = await getConnection();

        const result = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                DELETE FROM prescriptions
                WHERE prescription_id = @id
            `);

        return result.rowsAffected;
    }

    // BILL TOTAL
    async getPrescriptionBillTotal(id) {

        const pool = await getConnection();

        const result = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                SELECT dbo.CalculateBillTotal(@id) AS total_amount
            `);

        return result.recordset[0];
    }
}

module.exports = new PrescriptionQueries();