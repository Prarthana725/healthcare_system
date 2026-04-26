const { getConnection } = require('./connection');

class BillQueries {
    // Get all bills (calculated from prescriptions and medicines using JOINs)
    async getAllBills() {
        const connection = await getConnection();
        const [rows] = await connection.execute(`
            SELECT pr.prescription_id AS bill_id,
                   p.patient_id, p.name AS patient_name,
                   d.doctor_id, d.name AS doctor_name,
                   pr.date,
                   COUNT(DISTINCT pd.id) AS total_medicines,
                   SUM(pd.quantity * COALESCE(m.quantity, 1)) AS total_items,
                   COALESCE(SUM(pd.quantity), 0) AS total_quantity
            FROM prescriptions pr
            JOIN patients p ON pr.patient_id = p.patient_id
            JOIN doctors d ON pr.doctor_id = d.doctor_id
            LEFT JOIN prescription_details pd ON pr.prescription_id = pd.prescription_id
            LEFT JOIN medicines m ON pd.medicine_id = m.medicine_id
            GROUP BY pr.prescription_id
            ORDER BY pr.date DESC
        `);
        return rows;
    }

    // Get bill details for a specific prescription (JOIN with medicines)
    async getBillDetails(prescriptionId) {
        const connection = await getConnection();
        const [rows] = await connection.execute(`
            SELECT pr.prescription_id,
                   p.patient_id, p.name AS patient_name, p.phone,
                   d.doctor_id, d.name AS doctor_name, d.specialization,
                   pr.date,
                   pd.id AS item_id, m.medicine_id, m.name AS medicine_name,
                   pd.quantity, 1 AS unit_price, (pd.quantity * 1) AS item_total
            FROM prescriptions pr
            JOIN patients p ON pr.patient_id = p.patient_id
            JOIN doctors d ON pr.doctor_id = d.doctor_id
            LEFT JOIN prescription_details pd ON pr.prescription_id = pd.prescription_id
            LEFT JOIN medicines m ON pd.medicine_id = m.medicine_id
            WHERE pr.prescription_id = ?
            ORDER BY pd.id
        `, [prescriptionId]);
        return rows;
    }

    // Get bill by patient (multiple prescriptions/bills)
    async getBillsByPatient(patientId) {
        const connection = await getConnection();
        const [rows] = await connection.execute(`
            SELECT pr.prescription_id AS bill_id,
                   p.name AS patient_name,
                   d.name AS doctor_name,
                   pr.date,
                   COUNT(DISTINCT pd.id) AS total_medicines,
                   COALESCE(SUM(pd.quantity), 0) AS total_quantity
            FROM prescriptions pr
            JOIN patients p ON pr.patient_id = p.patient_id
            JOIN doctors d ON pr.doctor_id = d.doctor_id
            LEFT JOIN prescription_details pd ON pr.prescription_id = pd.prescription_id
            WHERE pr.patient_id = ?
            GROUP BY pr.prescription_id
            ORDER BY pr.date DESC
        `, [patientId]);
        return rows;
    }

    // Get bill summary by doctor (with JOIN and GROUP BY)
    async getBillsByDoctor(doctorId) {
        const connection = await getConnection();
        const [rows] = await connection.execute(`
            SELECT d.doctor_id,
                   d.name AS doctor_name,
                   COUNT(DISTINCT pr.prescription_id) AS total_bills,
                   COALESCE(SUM(pd.quantity), 0) AS total_medicines_prescribed
            FROM doctors d
            LEFT JOIN prescriptions pr ON d.doctor_id = pr.doctor_id
            LEFT JOIN prescription_details pd ON pr.prescription_id = pd.prescription_id
            WHERE d.doctor_id = ?
            GROUP BY d.doctor_id
        `, [doctorId]);
        return rows;
    }

    // Get monthly bill report (JOIN with GROUP BY and date functions)
    async getMonthlyBillReport() {
        const connection = await getConnection();
        const [rows] = await connection.execute(`
            SELECT YEAR(pr.date) AS year,
                   MONTH(pr.date) AS month,
                   COUNT(DISTINCT pr.prescription_id) AS total_bills,
                   COUNT(DISTINCT p.patient_id) AS total_patients,
                   COALESCE(SUM(pd.quantity), 0) AS total_medicines_issued
            FROM prescriptions pr
            LEFT JOIN patients p ON pr.patient_id = p.patient_id
            LEFT JOIN prescription_details pd ON pr.prescription_id = pd.prescription_id
            GROUP BY YEAR(pr.date), MONTH(pr.date)
            ORDER BY year DESC, month DESC
        `);
        return rows;
    }

    // Get total bill amount with medicine details
    async calculateBillAmount(prescriptionId) {
        const connection = await getConnection();
        const [rows] = await connection.execute(`
            SELECT pr.prescription_id,
                   COALESCE(SUM(pd.quantity), 0) AS total_quantity,
                   COALESCE(SUM(pd.quantity * 10), 0) AS total_amount
            FROM prescriptions pr
            LEFT JOIN prescription_details pd ON pr.prescription_id = pd.prescription_id
            WHERE pr.prescription_id = ?
            GROUP BY pr.prescription_id
        `, [prescriptionId]);
        return rows;
    }

    // Generate bill record (returns prescription data formatted as bill)
    async generateBill(prescriptionId) {
        const connection = await getConnection();
        const [rows] = await connection.execute(`
            SELECT pr.prescription_id AS bill_id,
                   p.patient_id, p.name AS patient_name, p.age, p.phone,
                   d.doctor_id, d.name AS doctor_name, d.specialization,
                   pr.date AS bill_date,
                   pd.id AS item_id, m.medicine_id, m.name AS medicine_name,
                   pd.quantity,
                   (pd.quantity * 10) AS item_total
            FROM prescriptions pr
            JOIN patients p ON pr.patient_id = p.patient_id
            JOIN doctors d ON pr.doctor_id = d.doctor_id
            LEFT JOIN prescription_details pd ON pr.prescription_id = pd.prescription_id
            LEFT JOIN medicines m ON pd.medicine_id = m.medicine_id
            WHERE pr.prescription_id = ?
        `, [prescriptionId]);
        return rows;
    }
}

module.exports = new BillQueries();
