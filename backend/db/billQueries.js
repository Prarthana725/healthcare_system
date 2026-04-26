const { getConnection } = require('./connection');

class BillQueries {
    // Get all bills from bills table (with JOIN to get patient/doctor details)
    async getAllBills() {
        const connection = await getConnection();
        const [rows] = await connection.execute(`
            SELECT b.bill_id, b.prescription_id, b.patient_id, b.doctor_id,
                   b.bill_date, b.total_amount, b.status,
                   p.name AS patient_name, p.phone AS patient_phone,
                   d.name AS doctor_name, d.specialization AS doctor_specialization
            FROM bills b
            JOIN patients p ON b.patient_id = p.patient_id
            JOIN doctors d ON b.doctor_id = d.doctor_id
            ORDER BY b.bill_date DESC
        `);
        return rows;
    }

    // Get bill details for a specific bill ID (JOIN with prescription details)
    async getBillDetails(billId) {
        const connection = await getConnection();
        const [rows] = await connection.execute(`
            SELECT b.bill_id, b.prescription_id, b.patient_id, b.doctor_id,
                   b.bill_date, b.total_amount, b.status,
                   p.name AS patient_name, p.phone, p.age,
                   d.name AS doctor_name, d.specialization,
                   pd.id AS item_id, m.medicine_id, m.name AS medicine_name,
                   pd.quantity, 10.00 AS unit_price, (pd.quantity * 10.00) AS item_total
            FROM bills b
            JOIN patients p ON b.patient_id = p.patient_id
            JOIN doctors d ON b.doctor_id = d.doctor_id
            LEFT JOIN prescription_details pd ON b.prescription_id = pd.prescription_id
            LEFT JOIN medicines m ON pd.medicine_id = m.medicine_id
            WHERE b.bill_id = ?
            ORDER BY pd.id
        `, [billId]);
        return rows;
    }

    // Get bills by patient (from bills table)
    async getBillsByPatient(patientId) {
        const connection = await getConnection();
        const [rows] = await connection.execute(`
            SELECT b.bill_id, b.prescription_id, b.doctor_id,
                   b.bill_date, b.total_amount, b.status,
                   d.name AS doctor_name,
                   COUNT(DISTINCT pd.id) AS total_medicines,
                   COALESCE(SUM(pd.quantity), 0) AS total_quantity
            FROM bills b
            JOIN doctors d ON b.doctor_id = d.doctor_id
            LEFT JOIN prescription_details pd ON b.prescription_id = pd.prescription_id
            WHERE b.patient_id = ?
            GROUP BY b.bill_id
            ORDER BY b.bill_date DESC
        `, [patientId]);
        return rows;
    }

    // Get bills by doctor (with JOIN and GROUP BY from bills table)
    async getBillsByDoctor(doctorId) {
        const connection = await getConnection();
        const [rows] = await connection.execute(`
            SELECT d.doctor_id,
                   d.name AS doctor_name,
                   COUNT(DISTINCT b.bill_id) AS total_bills,
                   COALESCE(SUM(pd.quantity), 0) AS total_medicines_prescribed,
                   COALESCE(SUM(b.total_amount), 0) AS total_revenue
            FROM doctors d
            LEFT JOIN bills b ON d.doctor_id = b.doctor_id
            LEFT JOIN prescription_details pd ON b.prescription_id = pd.prescription_id
            WHERE d.doctor_id = ?
            GROUP BY d.doctor_id
        `, [doctorId]);
        return rows;
    }

    // Get monthly bill report (JOIN with GROUP BY and date functions from bills table)
    async getMonthlyBillReport() {
        const connection = await getConnection();
        const [rows] = await connection.execute(`
            SELECT YEAR(b.bill_date) AS year,
                   MONTH(b.bill_date) AS month,
                   COUNT(DISTINCT b.bill_id) AS total_bills,
                   COUNT(DISTINCT b.patient_id) AS total_patients,
                   COALESCE(SUM(pd.quantity), 0) AS total_medicines_issued,
                   COALESCE(SUM(b.total_amount), 0) AS total_revenue
            FROM bills b
            LEFT JOIN prescription_details pd ON b.prescription_id = pd.prescription_id
            GROUP BY YEAR(b.bill_date), MONTH(b.bill_date)
            ORDER BY year DESC, month DESC
        `);
        return rows;
    }

    // Get total bill amount from bills table
    async calculateBillAmount(billId) {
        const connection = await getConnection();
        const [rows] = await connection.execute(`
            SELECT b.bill_id, b.total_amount,
                   COALESCE(SUM(pd.quantity), 0) AS total_quantity
            FROM bills b
            LEFT JOIN prescription_details pd ON b.prescription_id = pd.prescription_id
            WHERE b.bill_id = ?
            GROUP BY b.bill_id
        `, [billId]);
        return rows;
    }

    // Update bill status
    async updateBillStatus(billId, status) {
        const connection = await getConnection();
        const [result] = await connection.execute(
            'UPDATE bills SET status = ? WHERE bill_id = ?',
            [status, billId]
        );
        return result;
    }

    // Get bill by prescription ID (to check if bill exists)
    async getBillByPrescription(prescriptionId) {
        const connection = await getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM bills WHERE prescription_id = ?',
            [prescriptionId]
        );
        return rows[0];
    }
}

module.exports = new BillQueries();
