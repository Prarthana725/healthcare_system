const { getConnection, sql } = require("./sqlConnection");

class BillQueries {

    // Get all bills
    async getAllBills() {

        const pool =
            await getConnection();

        const result =
            await pool.request()

                .query(`

                    SELECT

                        b.bill_id,

                        b.prescription_id,

                        b.patient_id,

                        b.doctor_id,

                        b.bill_date,

                        b.total_amount,

                        b.status,

                        p.name AS patient_name,

                        p.phone AS patient_phone,

                        d.name AS doctor_name,

                        d.specialization AS doctor_specialization

                    FROM bills b

                    JOIN patients p

                        ON b.patient_id =
                        p.patient_id

                    JOIN doctors d

                        ON b.doctor_id =
                        d.doctor_id

                    ORDER BY
                        b.bill_date DESC

                `);

        return result.recordset;
    }

    // CREATE BILL
    async createBill(
        prescription_id,
        patient_id,
        doctor_id,
        total_amount
    ) {

        const pool =
            await getConnection();

        const result =
            await pool.request()

                .input(
                    "prescription_id",
                    sql.Int,
                    prescription_id
                )

                .input(
                    "patient_id",
                    sql.Int,
                    patient_id
                )

                .input(
                    "doctor_id",
                    sql.Int,
                    doctor_id
                )

                .input(
                    "total_amount",
                    sql.Decimal(10,2),
                    total_amount
                )

                .input(
                    "status",
                    sql.VarChar,
                    "Pending"
                )

                .query(`

                    INSERT INTO bills (

                        prescription_id,

                        patient_id,

                        doctor_id,

                        bill_date,

                        total_amount,

                        status

                    )

                    VALUES (

                        @prescription_id,

                        @patient_id,

                        @doctor_id,

                        GETDATE(),

                        @total_amount,

                        @status

                    );

                    SELECT
                        SCOPE_IDENTITY()
                        AS bill_id;

                `);

        return result.recordset[0];
    }

    // Get bill details
    async getBillDetails(
        billId
    ) {

        const pool =
            await getConnection();

        const result =
            await pool.request()

                .input(
                    "id",
                    sql.Int,
                    billId
                )

                .query(`

                    SELECT

                        b.bill_id,

                        b.prescription_id,

                        b.patient_id,

                        b.doctor_id,

                        b.bill_date,

                        b.total_amount,

                        b.status,

                        p.name AS patient_name,

                        p.phone,

                        p.age,

                        d.name AS doctor_name,

                        d.specialization,

                        pd.id AS item_id,

                        m.medicine_id,

                        m.name AS medicine_name,

                        pd.quantity,

                        m.price AS unit_price,

                        (
                            pd.quantity *
                            m.price
                        ) AS item_total

                    FROM bills b

                    JOIN patients p

                        ON b.patient_id =
                        p.patient_id

                    JOIN doctors d

                        ON b.doctor_id =
                        d.doctor_id

                    LEFT JOIN
                        prescription_details pd

                        ON b.prescription_id =
                        pd.prescription_id

                    LEFT JOIN medicines m

                        ON pd.medicine_id =
                        m.medicine_id

                    WHERE b.bill_id =
                        @id

                    ORDER BY pd.id

                `);

        return result.recordset;
    }

    // Bills by patient
    async getBillsByPatient(
        patientId
    ) {

        const pool =
            await getConnection();

        const result =
            await pool.request()

                .input(
                    "id",
                    sql.Int,
                    patientId
                )

                .query(`

                    SELECT

                        b.bill_id,

                        b.prescription_id,

                        b.doctor_id,

                        b.bill_date,

                        b.total_amount,

                        b.status,

                        d.name AS doctor_name,

                        COUNT(pd.id)
                            AS total_medicines,

                        ISNULL(
                            SUM(pd.quantity),
                            0
                        ) AS total_quantity

                    FROM bills b

                    JOIN doctors d

                        ON b.doctor_id =
                        d.doctor_id

                    LEFT JOIN
                        prescription_details pd

                        ON b.prescription_id =
                        pd.prescription_id

                    WHERE b.patient_id =
                        @id

                    GROUP BY

                        b.bill_id,

                        b.prescription_id,

                        b.doctor_id,

                        b.bill_date,

                        b.total_amount,

                        b.status,

                        d.name

                    ORDER BY
                        b.bill_date DESC

                `);

        return result.recordset;
    }

    // Bills by doctor
    async getBillsByDoctor(
        doctorId
    ) {

        const pool =
            await getConnection();

        const result =
            await pool.request()

                .input(
                    "id",
                    sql.Int,
                    doctorId
                )

                .query(`

                    SELECT

                        d.doctor_id,

                        d.name AS doctor_name,

                        COUNT(
                            DISTINCT b.bill_id
                        ) AS total_bills,

                        ISNULL(
                            SUM(pd.quantity),
                            0
                        ) AS total_medicines_prescribed,

                        ISNULL(
                            SUM(b.total_amount),
                            0
                        ) AS total_revenue

                    FROM doctors d

                    LEFT JOIN bills b

                        ON d.doctor_id =
                        b.doctor_id

                    LEFT JOIN
                        prescription_details pd

                        ON b.prescription_id =
                        pd.prescription_id

                    WHERE d.doctor_id =
                        @id

                    GROUP BY

                        d.doctor_id,

                        d.name

                `);

        return result.recordset;
    }

    // Monthly report
    async getMonthlyBillReport() {

        const pool =
            await getConnection();

        const result =
            await pool.request()

                .query(`

                    SELECT

                        YEAR(b.bill_date)
                            AS year,

                        MONTH(b.bill_date)
                            AS month,

                        COUNT(b.bill_id)
                            AS total_bills,

                        COUNT(
                            DISTINCT b.patient_id
                        ) AS total_patients,

                        ISNULL(
                            SUM(pd.quantity),
                            0
                        ) AS total_medicines_issued,

                        ISNULL(
                            SUM(b.total_amount),
                            0
                        ) AS total_revenue

                    FROM bills b

                    LEFT JOIN
                        prescription_details pd

                        ON b.prescription_id =
                        pd.prescription_id

                    GROUP BY

                        YEAR(b.bill_date),

                        MONTH(b.bill_date)

                    ORDER BY

                        year DESC,

                        month DESC

                `);

        return result.recordset;
    }

    // Calculate bill
    async calculateBillAmount(
        billId
    ) {

        const pool =
            await getConnection();

        const result =
            await pool.request()

                .input(
                    "id",
                    sql.Int,
                    billId
                )

                .query(`

                    SELECT

                        b.bill_id,

                        b.total_amount,

                        ISNULL(
                            SUM(pd.quantity),
                            0
                        ) AS total_quantity

                    FROM bills b

                    LEFT JOIN
                        prescription_details pd

                        ON b.prescription_id =
                        pd.prescription_id

                    WHERE b.bill_id =
                        @id

                    GROUP BY

                        b.bill_id,

                        b.total_amount

                `);

        return result.recordset;
    }

    // Update status
    async updateBillStatus(
        billId,
        status
    ) {

        const pool =
            await getConnection();

        const result =
            await pool.request()

                .input(
                    "id",
                    sql.Int,
                    billId
                )

                .input(
                    "status",
                    sql.VarChar,
                    status
                )

                .query(`

                    UPDATE bills

                    SET status = @status

                    WHERE bill_id = @id

                `);

        return result.rowsAffected;
    }

    // Get bill by prescription
    async getBillByPrescription(
        prescriptionId
    ) {

        const pool =
            await getConnection();

        const result =
            await pool.request()

                .input(
                    "id",
                    sql.Int,
                    prescriptionId
                )

                .query(`

                    SELECT *

                    FROM bills

                    WHERE prescription_id =
                        @id

                `);

        return result.recordset[0];
    }
}

module.exports =
    new BillQueries();