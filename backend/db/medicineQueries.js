const { getConnection, sql } = require("./sqlConnection");

class MedicineQueries {

    // GET ALL MEDICINES
    async getAllMedicines() {
        const pool = await getConnection();
        const result = await pool.request()
            .query("SELECT * FROM medicines");

        return result.recordset;
    }

    // GET MEDICINE BY ID
    async getMedicineById(medicineId) {
        const pool = await getConnection();

        const result = await pool.request()
            .input("id", sql.Int, medicineId)
            .query("SELECT * FROM medicines WHERE medicine_id = @id");

        return result.recordset;
    }

    // LOW STOCK (quantity < 10)
    async getLowStockMedicines() {
        const pool = await getConnection();

        const result = await pool.request()
            .query("SELECT * FROM medicines WHERE quantity < 10 ORDER BY quantity ASC");

        return result.recordset;
    }

    // MEDICINE USAGE (JOIN)
    async getMedicinesWithUsage() {
        const pool = await getConnection();

        const result = await pool.request().query(`
            SELECT m.medicine_id, m.name, m.quantity,
                   ISNULL(SUM(pd.quantity), 0) AS total_used
            FROM medicines m
            LEFT JOIN prescription_details pd ON m.medicine_id = pd.medicine_id
            GROUP BY m.medicine_id, m.name, m.quantity
            ORDER BY m.medicine_id
        `);

        return result.recordset;
    }

    // CREATE MEDICINE
    async createMedicine(name, quantity) {
        const pool = await getConnection();

        const result = await pool.request()
            .input("name", sql.VarChar, name)
            .input("quantity", sql.Int, quantity)
            .query(`
                INSERT INTO medicines (name, quantity)
                VALUES (@name, @quantity);

                SELECT SCOPE_IDENTITY() AS id;
            `);

        return result.recordset[0];
    }

    // UPDATE MEDICINE
    async updateMedicine(medicineId, name, quantity) {
        const pool = await getConnection();

        const result = await pool.request()
            .input("id", sql.Int, medicineId)
            .input("name", sql.VarChar, name)
            .input("quantity", sql.Int, quantity)
            .query(`
                UPDATE medicines
                SET name=@name, quantity=@quantity
                WHERE medicine_id=@id
            `);

        return result.rowsAffected;
    }

    // DELETE MEDICINE
    async deleteMedicine(medicineId) {
        const pool = await getConnection();

        const result = await pool.request()
            .input("id", sql.Int, medicineId)
            .query("DELETE FROM medicines WHERE medicine_id=@id");

        return result.rowsAffected;
    }
}

module.exports = new MedicineQueries();