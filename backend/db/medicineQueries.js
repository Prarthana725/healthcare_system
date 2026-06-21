const { getConnection, sql } = require("./sqlConnection");

class MedicineQueries {

    // GET ALL MEDICINES
    async getAllMedicines() {

        const pool =
            await getConnection();

        const result =
            await pool.request()

                .query(
                    "SELECT * FROM medicines"
                );

        return result.recordset;
    }

    // GET MEDICINE BY ID
    async getMedicineById(
        medicineId
    ) {

        const pool =
            await getConnection();

        const result =
            await pool.request()

                .input(
                    "id",
                    sql.Int,
                    medicineId
                )

                .query(`

                    SELECT *

                    FROM medicines

                    WHERE medicine_id = @id

                `);

        return result.recordset[0];
    }

    // LOW STOCK (quantity < 10)
    async getLowStockMedicines() {

        const pool =
            await getConnection();

        const result =
            await pool.request()

                .query(`

                    SELECT *

                    FROM medicines

                    WHERE quantity < 10

                    ORDER BY quantity ASC

                `);

        return result.recordset;
    }
    // LOW STOCK COUNT
async getLowStockCount() {

    const pool = await getConnection();

    const result = await pool.request().query(`
        SELECT COUNT(*) AS total
        FROM medicines
        WHERE quantity < 10
    `);

    return result.recordset[0];
}

    // MEDICINE USAGE (JOIN)
    async getMedicinesWithUsage() {

        const pool =
            await getConnection();

        const result =
            await pool.request()

                .query(`

                    SELECT

                        m.medicine_id,

                        m.name,

                        m.quantity,

                        m.price,

                        ISNULL(
                            SUM(pd.quantity),
                            0
                        ) AS total_used

                    FROM medicines m

                    LEFT JOIN
                        prescription_details pd

                    ON
                        m.medicine_id =
                        pd.medicine_id

                    GROUP BY

                        m.medicine_id,

                        m.name,

                        m.quantity,

                        m.price

                    ORDER BY
                        m.medicine_id

                `);

        return result.recordset;
    }

    // CREATE MEDICINE
    async createMedicine(
        name,
        quantity,
        price,
        category,
        expiry_date
    ) {

        const pool =
            await getConnection();

        const result =
            await pool.request()

                .input(
                    "name",
                    sql.VarChar,
                    name
                )

                .input(
                    "quantity",
                    sql.Int,
                    quantity
                )

                .input(
                    "price",
                    sql.Decimal(10, 2),
                    price || 0
                )

                .input(
                    "category",
                    sql.VarChar,
                    category || null
                )

                .input(
                    "expiry_date",
                    sql.Date,
                    expiry_date || null
                )

                .query(`

    INSERT INTO medicines (

        name,
        quantity,
        price,
        category,
        expiry_date

    )

    VALUES (

        @name,
        @quantity,
        @price,
        @category,
        @expiry_date

    );

    SELECT
        SCOPE_IDENTITY()
        AS id;

`);

        return result.recordset[0];
    }

    // UPDATE MEDICINE
    async updateMedicine(
        medicineId,
        name,
        quantity,
        price,
        category
    ) {

        const pool =
            await getConnection();

        const result =
            await pool.request()

                .input(
                    "id",
                    sql.Int,
                    medicineId
                )

                .input(
                    "name",
                    sql.VarChar,
                    name
                )

                .input(
                    "quantity",
                    sql.Int,
                    quantity
                )

                .input(
                    "price",
                    sql.Decimal(10, 2),
                    price || 0
                )
                .input(
    "category",
    sql.VarChar,
    category || null
)

                .query(`

                    UPDATE medicines

                    SET

                        name=@name,

                        quantity=@quantity,

                        price=@price,

                        category=@category

                    WHERE medicine_id=@id

                `);

        return result.rowsAffected;
    }

    // REDUCE STOCK
    async reduceStock(
        medicineId,
        reduceQuantity
    ) {

        const pool =
            await getConnection();

        //--------------------------------------------------
        // CHECK CURRENT STOCK
        //--------------------------------------------------

        const medicine =
            await this.getMedicineById(
                medicineId
            );

        if (!medicine) {

            throw new Error(
                "Medicine not found"
            );
        }

        if (
            medicine.quantity <
            reduceQuantity
        ) {

            throw new Error(
                `Not enough stock for ${medicine.name}`
            );
        }

        //--------------------------------------------------
        // UPDATE STOCK
        //--------------------------------------------------

        await pool.request()

            .input(
                "id",
                sql.Int,
                medicineId
            )

            .input(
                "quantity",
                sql.Int,
                reduceQuantity
            )

            .query(`

                UPDATE medicines

                SET quantity =
                    quantity - @quantity

                WHERE medicine_id =
                    @id

            `);

        //--------------------------------------------------
        // RETURN UPDATED MEDICINE
        //--------------------------------------------------

        return await this.getMedicineById(
            medicineId
        );
    }

    // ISSUE MEDICINE
    async issueMedicine(
        medicineId,
        quantity
    ) {

        const pool =
            await getConnection();

        //--------------------------------
        // CHECK STOCK
        //--------------------------------

        const medicine =
            await this.getMedicineById(
                medicineId
            );

        if (!medicine) {

            throw new Error(
                'Medicine not found'
            );
        }

        if (
            medicine.quantity < quantity
        ) {

            throw new Error(
                'Not enough stock'
            );
        }

        //--------------------------------
        // REDUCE STOCK
        //--------------------------------

        await pool.request()

            .input(
                'id',
                sql.Int,
                medicineId
            )

            .input(
                'quantity',
                sql.Int,
                quantity
            )

            .query(`

            UPDATE medicines

            SET quantity =
                quantity - @quantity

            WHERE medicine_id =
                @id

        `);

        //--------------------------------
        // SAVE ISSUE HISTORY
        //--------------------------------

        await pool.request()

            .input(
                'medicine_id',
                sql.Int,
                medicineId
            )

            .input(
                'quantity',
                sql.Int,
                quantity
            )

            .query(`

            INSERT INTO medicine_issues (

                medicine_id,
                quantity

            )

            VALUES (

                @medicine_id,
                @quantity

            )

        `);

        return {
            success: true
        };
    }

    // GET ISSUE HISTORY
    async getIssueHistory() {

        const pool =
            await getConnection();

        const result =
            await pool.request()

                .query(`

                SELECT

                    mi.issue_id,
                    m.name,
                    mi.quantity,
                    mi.issued_date

                FROM medicine_issues mi

                JOIN medicines m

                ON mi.medicine_id =
                    m.medicine_id

                ORDER BY
                    mi.issue_id DESC

            `);

        return result.recordset;
    }

    // DELETE MEDICINE
    async deleteMedicine(
        medicineId
    ) {

        const pool =
            await getConnection();

        const result =
            await pool.request()

                .input(
                    "id",
                    sql.Int,
                    medicineId
                )

                .query(`

                    DELETE FROM medicines

                    WHERE medicine_id=@id

                `);

        return result.rowsAffected;
    }
}

module.exports =
    new MedicineQueries();