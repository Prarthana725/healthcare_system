const { getConnection } = require('./connection');

class PrescriptionQueries {
    // Get all prescriptions with details and medicine names (JOIN)
    async getAllPrescriptions() {
        const connection = await getConnection();
        const [rows] = await connection.execute(`
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
            ORDER BY pr.prescription_id DESC, pd.id
        `);
        return rows;
    }

    // Get prescription by ID with all details (JOIN)
    async getPrescriptionById(prescriptionId) {
        const connection = await getConnection();
        const [rows] = await connection.execute(`
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
            WHERE pr.prescription_id = ?
            ORDER BY pd.id
        `, [prescriptionId]);
        return rows;
    }

    // Get prescriptions by patient (JOIN)
    async getPrescriptionsByPatient(patientId) {
        const connection = await getConnection();
        const [rows] = await connection.execute(`
            SELECT pr.prescription_id, pr.date,
                   p.name AS patient_name,
                   d.doctor_id, d.name AS doctor_name,
                   pd.id AS detail_id, pd.medicine_id, pd.quantity,
                   m.name AS medicine_name
            FROM prescriptions pr
            JOIN patients p ON pr.patient_id = p.patient_id
            JOIN doctors d ON pr.doctor_id = d.doctor_id
            LEFT JOIN prescription_details pd ON pr.prescription_id = pd.prescription_id
            LEFT JOIN medicines m ON pd.medicine_id = m.medicine_id
            WHERE pr.patient_id = ?
            ORDER BY pr.prescription_id DESC, pd.id
        `, [patientId]);
        return rows;
    }

    // Create prescription
    async createPrescription(patientId, doctorId, date) {
        const connection = await getConnection();
        const [result] = await connection.execute(
            'INSERT INTO prescriptions (patient_id, doctor_id, date) VALUES (?, ?, ?)',
            [patientId, doctorId, date]
        );
        return result;
    }

    // Add prescription detail
    async addPrescriptionDetail(prescriptionId, medicineId, quantity) {
        const connection = await getConnection();
        const [result] = await connection.execute(
            'INSERT INTO prescription_details (prescription_id, medicine_id, quantity) VALUES (?, ?, ?)',
            [prescriptionId, medicineId, quantity]
        );
        return result;
    }

    // Update prescription (header only)
    async updatePrescription(prescriptionId, patientId, doctorId, date) {
        const connection = await getConnection();
        const [result] = await connection.execute(
            'UPDATE prescriptions SET patient_id = ?, doctor_id = ?, date = ? WHERE prescription_id = ?',
            [patientId, doctorId, date, prescriptionId]
        );
        return result;
    }

    // Delete prescription and its details
    async deletePrescription(prescriptionId) {
        const connection = await getConnection();
        await connection.beginTransaction();
        try {
            await connection.execute('DELETE FROM prescription_details WHERE prescription_id = ?', [prescriptionId]);
            const [result] = await connection.execute('DELETE FROM prescriptions WHERE prescription_id = ?', [prescriptionId]);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    }
}

module.exports = new PrescriptionQueries();
