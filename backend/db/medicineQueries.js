const { getConnection } = require('./connection');

class MedicineQueries {
    // Get all medicines
    async getAllMedicines() {
        try {
            const connection = await getConnection();
            const [rows] = await connection.execute('SELECT * FROM medicines');
            console.log('getAllMedicines - Fetched rows:', rows.length);
            return rows;
        } catch (error) {
            console.error('getAllMedicines - SQL Error:', error.message);
            throw error;
        }
    }

    // Get medicine by ID
    async getMedicineById(medicineId) {
        const connection = await getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM medicines WHERE medicine_id = ?',
            [medicineId]
        );
        return rows;
    }

    // Get low stock medicines (quantity < 10)
    async getLowStockMedicines() {
        const connection = await getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM medicines WHERE quantity < 10 ORDER BY quantity ASC'
        );
        return rows;
    }

    // Get medicines with usage count (JOIN with prescription_details)
    async getMedicinesWithUsage() {
        const connection = await getConnection();
        const [rows] = await connection.execute(`
            SELECT m.medicine_id, m.name, m.quantity,
                   COALESCE(SUM(pd.quantity), 0) AS total_used
            FROM medicines m
            LEFT JOIN prescription_details pd ON m.medicine_id = pd.medicine_id
            GROUP BY m.medicine_id
            ORDER BY m.medicine_id
        `);
        return rows;
    }

    // Create medicine
    async createMedicine(name, quantity) {
        try {
            const connection = await getConnection();
            const [result] = await connection.execute(
                'INSERT INTO medicines (name, quantity) VALUES (?, ?)',
                [name, quantity]
            );
            console.log('createMedicine - New medicine ID:', result.insertId);
            return result;
        } catch (error) {
            console.error('createMedicine - SQL Error:', error.message);
            throw error;
        }
    }

    // Update medicine
    async updateMedicine(medicineId, name, quantity) {
        const connection = await getConnection();
        const [result] = await connection.execute(
            'UPDATE medicines SET name = ?, quantity = ? WHERE medicine_id = ?',
            [name, quantity, medicineId]
        );
        return result;
    }

    // Delete medicine
    async deleteMedicine(medicineId) {
        const connection = await getConnection();
        const [result] = await connection.execute(
            'DELETE FROM medicines WHERE medicine_id = ?',
            [medicineId]
        );
        return result;
    }
}

module.exports = new MedicineQueries();
