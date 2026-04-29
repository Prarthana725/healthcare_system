const { getConnection } = require('./connection');

class PatientQueries {
    // Get all patients
    async getAllPatients() {
        try {
            const connection = await getConnection();
            const [rows] = await connection.execute('SELECT * FROM patients');
            console.log('getAllPatients - Fetched rows:', rows.length);
            return rows;
        } catch (error) {
            console.error('getAllPatients - SQL Error:', error.message);
            throw error;
        }
    }

    // Get patient by ID
    async getPatientById(patientId) {
        try {
            const connection = await getConnection();
            const [rows] = await connection.execute(
                'SELECT * FROM patients WHERE patient_id = ?',
                [patientId]
            );
            console.log('getPatientById - Fetched rows for ID', patientId, ':', rows.length);
            return rows;
        } catch (error) {
            console.error('getPatientById - SQL Error:', error.message);
            throw error;
        }
    }

    // Create patient
    async createPatient(name, age, phone) {
        try {
            const connection = await getConnection();
            const [result] = await connection.execute(
                'INSERT INTO patients (name, age, phone) VALUES (?, ?, ?)',
                [name, age, phone]
            );
            console.log('createPatient - New patient ID:', result.insertId);
            return result;
        } catch (error) {
            console.error('createPatient - SQL Error:', error.message);
            throw error;
        }
    }

    // Update patient
    async updatePatient(patientId, name, age, phone) {
        const connection = await getConnection();
        const [result] = await connection.execute(
            'UPDATE patients SET name = ?, age = ?, phone = ? WHERE patient_id = ?',
            [name, age, phone, patientId]
        );
        return result;
    }

    // Get patient with all related data (appointments, prescriptions, bills) - JOIN queries
    async getPatientWithAllData(patientId) {
        const connection = await getConnection();

        // Get patient basic info
        const [patientRows] = await connection.execute(
            'SELECT * FROM patients WHERE patient_id = ?',
            [patientId]
        );

        if (patientRows.length === 0) {
            return null;
        }

        const patient = patientRows[0];

        // Get appointments with doctor details
        const [appointments] = await connection.execute(`
            SELECT a.appointment_id, a.date,
                   d.doctor_id, d.name AS doctor_name, d.specialization
            FROM appointments a
            JOIN doctors d ON a.doctor_id = d.doctor_id
            WHERE a.patient_id = ?
            ORDER BY a.date DESC
        `, [patientId]);

        // Get prescriptions with doctor and medicine details
        const [prescriptionRows] = await connection.execute(`
            SELECT pr.prescription_id, pr.date,
                   d.doctor_id, d.name AS doctor_name, d.specialization,
                   pd.id AS detail_id, pd.medicine_id, pd.quantity,
                   m.name AS medicine_name
            FROM prescriptions pr
            JOIN doctors d ON pr.doctor_id = d.doctor_id
            LEFT JOIN prescription_details pd ON pr.prescription_id = pd.prescription_id
            LEFT JOIN medicines m ON pd.medicine_id = m.medicine_id
            WHERE pr.patient_id = ?
            ORDER BY pr.prescription_id DESC, pd.id
        `, [patientId]);

        // Group prescriptions
        const prescriptions = {};
        prescriptionRows.forEach(row => {
            if (!prescriptions[row.prescription_id]) {
                prescriptions[row.prescription_id] = {
                    prescription_id: row.prescription_id,
                    doctor_id: row.doctor_id,
                    doctor_name: row.doctor_name,
                    doctor_specialization: row.doctor_specialization,
                    date: row.date,
                    medicines: []
                };
            }
            if (row.detail_id) {
                prescriptions[row.prescription_id].medicines.push({
                    medicine_id: row.medicine_id,
                    medicine_name: row.medicine_name,
                    quantity: row.quantity
                });
            }
        });

        // Get bills with doctor details
        const [bills] = await connection.execute(`
            SELECT b.bill_id, b.prescription_id, b.bill_date, b.total_amount, b.status,
                   d.doctor_id, d.name AS doctor_name, d.specialization
            FROM bills b
            JOIN doctors d ON b.doctor_id = d.doctor_id
            WHERE b.patient_id = ?
            ORDER BY b.bill_date DESC
        `, [patientId]);

        return {
            ...patient,
            appointments,
            prescriptions: Object.values(prescriptions),
            bills
        };
    }

    // Delete patient
    async deletePatient(patientId) {
        const connection = await getConnection();
        const [result] = await connection.execute(
            'DELETE FROM patients WHERE patient_id = ?',
            [patientId]
        );
        return result;
    }
}

module.exports = new PatientQueries();
