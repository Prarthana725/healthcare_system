const { getConnection } = require('./connection');

class DoctorQueries {
    // Get all doctors
    async getAllDoctors() {
        try {
            const connection = await getConnection();
            const [rows] = await connection.execute('SELECT * FROM doctors');
            console.log('getAllDoctors - Fetched rows:', rows.length);
            return rows;
        } catch (error) {
            console.error('getAllDoctors - SQL Error:', error.message);
            throw error;
        }
    }

    // Get doctor by ID
    async getDoctorById(doctorId) {
        const connection = await getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM doctors WHERE doctor_id = ?',
            [doctorId]
        );
        return rows;
    }

    // Get doctor with appointment count (JOIN)
    async getDoctorWithAppointments(doctorId) {
        const connection = await getConnection();
        const [rows] = await connection.execute(`
            SELECT d.*, COUNT(a.appointment_id) AS appointment_count
            FROM doctors d
            LEFT JOIN appointments a ON d.doctor_id = a.doctor_id
            WHERE d.doctor_id = ?
            GROUP BY d.doctor_id
        `, [doctorId]);
        return rows;
    }

    // Get doctors with their appointments (JOIN)
    async getAllDoctorsWithAppointments() {
        const connection = await getConnection();
        const [rows] = await connection.execute(`
            SELECT d.doctor_id, d.name, d.specialization, 
                   COUNT(a.appointment_id) AS total_appointments
            FROM doctors d
            LEFT JOIN appointments a ON d.doctor_id = a.doctor_id
            GROUP BY d.doctor_id
            ORDER BY d.doctor_id
        `);
        return rows;
    }

    // Create doctor
    async createDoctor(name, specialization) {
        try {
            const connection = await getConnection();
            const [result] = await connection.execute(
                'INSERT INTO doctors (name, specialization) VALUES (?, ?)',
                [name, specialization]
            );
            console.log('createDoctor - New doctor ID:', result.insertId);
            return result;
        } catch (error) {
            console.error('createDoctor - SQL Error:', error.message);
            throw error;
        }
    }

    // Update doctor
    async updateDoctor(doctorId, name, specialization) {
        const connection = await getConnection();
        const [result] = await connection.execute(
            'UPDATE doctors SET name = ?, specialization = ? WHERE doctor_id = ?',
            [name, specialization, doctorId]
        );
        return result;
    }

    // Get doctor with all related data (appointments, prescriptions, bills) - JOIN queries
    async getDoctorWithAllData(doctorId) {
        const connection = await getConnection();

        // Get doctor basic info
        const [doctorRows] = await connection.execute(
            'SELECT * FROM doctors WHERE doctor_id = ?',
            [doctorId]
        );

        if (doctorRows.length === 0) {
            return null;
        }

        const doctor = doctorRows[0];

        // Get appointments with patient details
        const [appointments] = await connection.execute(`
            SELECT a.appointment_id, a.date,
                   p.patient_id, p.name AS patient_name, p.age, p.phone
            FROM appointments a
            JOIN patients p ON a.patient_id = p.patient_id
            WHERE a.doctor_id = ?
            ORDER BY a.date DESC
        `, [doctorId]);

        // Get prescriptions with patient and medicine details
        const [prescriptionRows] = await connection.execute(`
            SELECT pr.prescription_id, pr.date,
                   p.patient_id, p.name AS patient_name, p.age, p.phone,
                   pd.id AS detail_id, pd.medicine_id, pd.quantity,
                   m.name AS medicine_name
            FROM prescriptions pr
            JOIN patients p ON pr.patient_id = p.patient_id
            LEFT JOIN prescription_details pd ON pr.prescription_id = pd.prescription_id
            LEFT JOIN medicines m ON pd.medicine_id = m.medicine_id
            WHERE pr.doctor_id = ?
            ORDER BY pr.prescription_id DESC, pd.id
        `, [doctorId]);

        // Group prescriptions
        const prescriptions = {};
        prescriptionRows.forEach(row => {
            if (!prescriptions[row.prescription_id]) {
                prescriptions[row.prescription_id] = {
                    prescription_id: row.prescription_id,
                    patient_id: row.patient_id,
                    patient_name: row.patient_name,
                    patient_age: row.patient_age,
                    patient_phone: row.patient_phone,
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

        // Get bills with patient details
        const [bills] = await connection.execute(`
            SELECT b.bill_id, b.prescription_id, b.bill_date, b.total_amount, b.status,
                   p.patient_id, p.name AS patient_name, p.age, p.phone
            FROM bills b
            JOIN patients p ON b.patient_id = p.patient_id
            WHERE b.doctor_id = ?
            ORDER BY b.bill_date DESC
        `, [doctorId]);

        return {
            ...doctor,
            appointments,
            prescriptions: Object.values(prescriptions),
            bills
        };
    }

    // Delete doctor
    async deleteDoctor(doctorId) {
        const connection = await getConnection();
        const [result] = await connection.execute(
            'DELETE FROM doctors WHERE doctor_id = ?',
            [doctorId]
        );
        return result;
    }
}

module.exports = new DoctorQueries();
