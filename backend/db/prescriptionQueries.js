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

    // Create prescription with details, stock checking, and automatic stock reduction
    async createPrescriptionWithDetails(patientId, doctorId, date, details) {
        const connection = await getConnection();
        await connection.beginTransaction();

        try {
            // Step 1: Check stock availability for all medicines
            for (const detail of details) {
                const [stockCheck] = await connection.execute(
                    'SELECT quantity FROM medicines WHERE medicine_id = ?',
                    [detail.medicine_id]
                );

                if (stockCheck.length === 0) {
                    throw new Error(`Medicine with ID ${detail.medicine_id} not found`);
                }

                if (stockCheck[0].quantity < detail.quantity) {
                    throw new Error(`Insufficient stock for medicine ID ${detail.medicine_id}. Available: ${stockCheck[0].quantity}, Requested: ${detail.quantity}`);
                }
            }

            // Step 2: Insert prescription
            const [prescriptionResult] = await connection.execute(
                'INSERT INTO prescriptions (patient_id, doctor_id, date) VALUES (?, ?, ?)',
                [patientId, doctorId, date]
            );
            const prescriptionId = prescriptionResult.insertId;

            // Step 3: Insert prescription details and reduce stock
            for (const detail of details) {
                // Insert detail
                await connection.execute(
                    'INSERT INTO prescription_details (prescription_id, medicine_id, quantity) VALUES (?, ?, ?)',
                    [prescriptionId, detail.medicine_id, detail.quantity]
                );

                // Reduce stock (this will also trigger the database trigger)
                await connection.execute(
                    'UPDATE medicines SET quantity = quantity - ? WHERE medicine_id = ?',
                    [detail.quantity, detail.medicine_id]
                );
            }

            // Step 4: Calculate total bill using the database function
            const [billResult] = await connection.execute(
                'SELECT CalculateBillTotal(?) AS total_amount',
                [prescriptionId]
            );

            await connection.commit();

            return {
                prescriptionId,
                totalAmount: billResult[0].total_amount
            };

        } catch (error) {
            await connection.rollback();
            throw error;
        }
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

    // Get prescription bill total using database function
    async getPrescriptionBillTotal(prescriptionId) {
        const connection = await getConnection();
        const [rows] = await connection.execute(
            'SELECT CalculateBillTotal(?) AS total_amount',
            [prescriptionId]
        );
        return rows[0];
    }
}

module.exports = new PrescriptionQueries();
