const { getConnection } = require('../db/connection');

class MedicineController {
    // Get all medicines
    async getAll(req, res) {
        try {
            const connection = await getConnection();
            const [rows] = await connection.execute('SELECT * FROM medicines');
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch medicines' });
        }
    }

    // Get medicine by ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const connection = await getConnection();
            const [rows] = await connection.execute('SELECT * FROM medicines WHERE medicine_id = ?', [id]);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Medicine not found' });
            }
            res.json(rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch medicine' });
        }
    }

    // Get low stock medicines (quantity < 10)
    async getLowStock(req, res) {
        try {
            const connection = await getConnection();
            const [rows] = await connection.execute('SELECT * FROM medicines WHERE quantity < 10');
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch low stock medicines' });
        }
    }

    // Create new medicine
    async create(req, res) {
        try {
            const { name, quantity } = req.body;
            const connection = await getConnection();
            const [result] = await connection.execute(
                'INSERT INTO medicines (name, quantity) VALUES (?, ?)',
                [name, quantity]
            );
            res.status(201).json({ message: 'Medicine created', id: result.insertId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create medicine' });
        }
    }

    // Update medicine
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, quantity } = req.body;
            const connection = await getConnection();
            const [result] = await connection.execute(
                'UPDATE medicines SET name = ?, quantity = ? WHERE medicine_id = ?',
                [name, quantity, id]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Medicine not found' });
            }
            res.json({ message: 'Medicine updated' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update medicine' });
        }
    }

    // Delete medicine
    async delete(req, res) {
        try {
            const { id } = req.params;
            const connection = await getConnection();
            const [result] = await connection.execute('DELETE FROM medicines WHERE medicine_id = ?', [id]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Medicine not found' });
            }
            res.json({ message: 'Medicine deleted' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete medicine' });
        }
    }
}

module.exports = new MedicineController();