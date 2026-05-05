const medicineQueries = require('../db/medicineQueries');

class MedicineController {

    // Get all medicines
    async getAll(req, res) {
        try {
            const medicines = await medicineQueries.getAllMedicines();
            console.log('MedicineController.getAll - Returning medicines:', medicines.length);
            res.json(medicines || []);
        } catch (error) {
            console.error('MedicineController.getAll - SQL Error:', error.message);
            res.status(500).json({ error: 'Failed to fetch medicines', details: error.message });
        }
    }

    // Get medicine by ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const medicines = await medicineQueries.getMedicineById(id);
            if (medicines.length === 0) {
                return res.status(404).json({ error: 'Medicine not found' });
            }
            res.json(medicines[0]);
        } catch (error) {
            console.error('Error fetching medicine:', error);
            res.status(500).json({ error: 'Failed to fetch medicine' });
        }
    }

    // Get low stock medicines (quantity < 10)
    async getLowStock(req, res) {
        try {
            const medicines = await medicineQueries.getLowStockMedicines();
            res.json(medicines);
        } catch (error) {
            console.error('Error fetching low stock medicines:', error);
            res.status(500).json({ error: 'Failed to fetch low stock medicines' });
        }
    }

    // Get medicines with usage count (JOIN query)
    async getWithUsage(req, res) {
        try {
            const medicines = await medicineQueries.getMedicinesWithUsage();
            res.json(medicines);
        } catch (error) {
            console.error('Error fetching medicines with usage:', error);
            res.status(500).json({ error: 'Failed to fetch medicines' });
        }
    }

    // Create new medicine
    async create(req, res) {
        try {
            const { name, quantity } = req.body;
            console.log('MedicineController.create - Request body:', { name, quantity });

            if (!name || quantity === undefined) {
                return res.status(400).json({ error: 'Missing required fields: name, quantity' });
            }
            const result = await medicineQueries.createMedicine(name, quantity);
            res.status(201).json({ message: 'Medicine created successfully', medicineId: result.id });
        } catch (error) {
            console.error('MedicineController.create - Error:', error.message);
            res.status(500).json({ error: 'Failed to create medicine', details: error.message });
        }
    }

    // Update medicine
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, quantity } = req.body;
            if (!name || quantity === undefined) {
                return res.status(400).json({ error: 'Missing required fields: name, quantity' });
            }
            const result = await medicineQueries.updateMedicine(id, name, quantity);
            if (result[0] === 0) {
                return res.status(404).json({ error: 'Medicine not found' });
            }
            res.json({ message: 'Medicine updated successfully' });
        } catch (error) {
            console.error('Error updating medicine:', error);
            res.status(500).json({ error: 'Failed to update medicine' });
        }
    }

    // Delete medicine
    async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await medicineQueries.deleteMedicine(id);
            if (result[0] === 0) {
                return res.status(404).json({ error: 'Medicine not found' });
            }
            res.json({ message: 'Medicine deleted successfully' });
        } catch (error) {
            console.error('Error deleting medicine:', error);
            res.status(500).json({ error: 'Failed to delete medicine' });
        }
    }
}

module.exports = new MedicineController();