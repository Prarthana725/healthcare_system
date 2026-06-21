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

    b.consultation_fee,
    b.appointment_fee,
    b.medicine_fee,
    b.service_fee,

    b.subtotal,
    b.tax,

    b.total_amount,

    b.paid_amount,
    b.balance_amount,

    b.payment_status,
    b.payment_method,

    b.status,

    p.name AS patient_name,
    p.phone AS patient_phone,

    d.name AS doctor_name,
    d.specialization AS doctor_specialization

FROM bills b

JOIN patients p
    ON b.patient_id = p.patient_id

LEFT JOIN doctors d
    ON b.doctor_id = d.doctor_id

ORDER BY b.bill_id DESC
                `);

        return result.recordset;
    }

    // CREATE BILL
    
    async createBill(
        prescription_id,
        patient_id,
        doctor_id,
        total_amount,
        consultation_fee = 0,
        appointment_fee = 0,
        medicine_fee = 0,
        service_fee = 0,
        subtotal = 0,
        tax = 0
    ) {
           console.log("CREATE BILL START");

        const pool =
            await getConnection();
            const dbCheck = await pool.request().query(`
    SELECT DB_NAME() AS CurrentDatabase
`);

console.log("DATABASE =>");
console.log(dbCheck.recordset);

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
                    "consultation_fee",
                    sql.Decimal(10,2),
                    consultation_fee
                )

                .input(
                    "appointment_fee",
                    sql.Decimal(10,2),
                    appointment_fee
                )

                .input(
                    "medicine_fee",
                    sql.Decimal(10,2),
                    medicine_fee
                )

                .input(
                    "service_fee",
                    sql.Decimal(10,2),
                    service_fee
                )

                .input(
                    "subtotal",
                    sql.Decimal(10,2),
                    subtotal
                )

                .input(
                    "tax",
                    sql.Decimal(10,2),
                    tax
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

                    VALUES (

                        @prescription_id,

                        @patient_id,

                        @doctor_id,

                        GETDATE(),

                        @consultation_fee,

                        @appointment_fee,

                        @medicine_fee,

                        @service_fee,

                        @subtotal,

                        @tax,

                        @total_amount,

                        0.00,

                        @total_amount,

                        'pending',

                        'Pending',

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

                        b.consultation_fee,
                        b.appointment_fee,
                        b.medicine_fee,
                        b.service_fee,
                        b.subtotal,
                        b.tax,
                        b.total_amount,
                        b.paid_amount,
                        b.balance_amount,
                        b.payment_status,
                        b.payment_method,
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
    // CREATE CONSULTATION BILL
async createConsultationBill(
    appointmentId,
    patientId,
    doctorId,
    consultationFee
) {

    const pool = await getConnection();

  //--------------------------------------------------
// CALCULATIONS
//--------------------------------------------------

const appointmentFee = 500;
const serviceFee = 250;

const subtotal =
    consultationFee +
    appointmentFee +
    serviceFee;

const tax =
    subtotal * 0.05;

const grandTotal =
    subtotal + tax;

//--------------------------------------------------
// CREATE BILL
//--------------------------------------------------

const billResult =
    await pool.request()

        .input('appointment_id', sql.Int, appointmentId)
        .input('patient_id', sql.Int, patientId)
        .input('doctor_id', sql.Int, doctorId)

        .input('consultation_fee', sql.Decimal(10,2), consultationFee)
        .input('appointment_fee', sql.Decimal(10,2), appointmentFee)
        .input('medicine_fee', sql.Decimal(10,2), 0)
        .input('service_fee', sql.Decimal(10,2), serviceFee)

        .input('subtotal', sql.Decimal(10,2), subtotal)
        .input('tax', sql.Decimal(10,2), tax)
        .input('total_amount', sql.Decimal(10,2), grandTotal)

        .query(`

            INSERT INTO bills (

                appointment_id,
                patient_id,
                doctor_id,

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
                status,
                bill_date

            )

            OUTPUT INSERTED.bill_id

            VALUES (

                @appointment_id,
                @patient_id,
                @doctor_id,

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
                'Pending',
                'pending',
                GETDATE()

            )

        `);

const billId =
    billResult.recordset[0].bill_id;
        }

//--------------------------------------------------
// PARTIAL PAYMENT
//--------------------------------------------------

async makePayment(
    billId,
    amount,
    paymentMethod
) {

    const pool = await getConnection();

    //--------------------------------------------------
    // GET BILL
    //--------------------------------------------------

    const billResult =
        await pool.request()

            .input('bill_id', sql.Int, billId)

            .query(`

                SELECT *
                FROM bills
                WHERE bill_id = @bill_id

            `);

    if (!billResult.recordset.length) {
        throw new Error('Bill not found');
    }

    const bill = billResult.recordset[0];

    const newPaid =
        Number(bill.paid_amount || 0)
        + Number(amount);

    const balance =
        Number(bill.total_amount)
        - Number(newPaid);

    let paymentStatus = 'partial';

    if (balance <= 0) {
        paymentStatus = 'paid';
    }

    //--------------------------------------------------
    // UPDATE BILL
    //--------------------------------------------------

    await pool.request()

        .input('bill_id', sql.Int, billId)
        .input('paid_amount', sql.Decimal(10,2), newPaid)
        .input('balance_amount', sql.Decimal(10,2), balance)
        .input('payment_status', sql.VarChar, paymentStatus)
        .input('payment_method', sql.VarChar, paymentMethod)

        .query(`

            UPDATE bills

            SET

                paid_amount = @paid_amount,
                balance_amount = @balance_amount,
                payment_status = @payment_status,
                payment_method = @payment_method,
                status = @payment_status

            WHERE bill_id = @bill_id

        `);

    //--------------------------------------------------
    // PAYMENT HISTORY
    //--------------------------------------------------

    await pool.request()

        .input('bill_id', sql.Int, billId)
        .input('amount', sql.Decimal(10,2), amount)
        .input('payment_method', sql.VarChar, paymentMethod)

        .query(`

            INSERT INTO payments (

                bill_id,
                amount,
                payment_method,
                payment_date

            )

            VALUES (

                @bill_id,
                @amount,
                @payment_method,
                GETDATE()

            )

        `);

    return {
        success: true,
        paid_amount: newPaid,
        balance_amount: balance,
        payment_status: paymentStatus
    };
}
}

module.exports =
    new BillQueries();