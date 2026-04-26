const { getConnection } = require('./connection');

class PatientQueries {
    // Get all patients
    async getAllPatients() {
        const connection = await getConnection();
        const [rows] = await connection.execute('SELECT * FROM patients');
        return rows;
    }

    // Get patient by ID
    async getPatientById(patientId) {
        const connection = await getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM patients WHERE patient_id = ?',
            [patientId]
        );
        return rows;
    }

    // Create patient
    async createPatient(name, age, phone) {
        const connection = await getConnection();
        const [result] = await connection.execute(
            'INSERT INTO patients (name, age, phone) VALUES (?, ?, ?)',
            [name, age, phone]
        );
        return result;
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
