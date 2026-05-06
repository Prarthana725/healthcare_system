const prescriptionQueries = require('../db/prescriptionQueries');
const billQueries = require('../db/billQueries');

// Helper function to group prescriptions
function groupPrescriptions(rows) {
    const prescriptions = {};
    rows.forEach(row => {
        if (!prescriptions[row.prescription_id]) {
            prescriptions[row.prescription_id] = {
                prescription_id: row.prescription_id,
                patient_id: row.patient_id,
                patient_name: row.patient_name,
                doctor_id: row.doctor_id,
                doctor_name: row.doctor_name,
                date: row.date,
                details: []
            };
        }
        if (row.detail_id) {
            prescriptions[row.prescription_id].details.push({
                id: row.detail_id,
                medicine_id: row.medicine_id,
                medicine_name: row.medicine_name,
                quantity: row.quantity
            });
        }
    });
    return Object.values(prescriptions);
}

class PrescriptionController {
    // Get all prescriptions with details (JOIN query)
    async getAll(req, res) {
        try {
            const rows = await prescriptionQueries.getAllPrescriptions();
            const prescriptions = groupPrescriptions(rows);
            console.log('PrescriptionController.getAll - Returning prescriptions:', prescriptions.length);
            res.json(prescriptions || []);
        } catch (error) {
            console.error('PrescriptionController.getAll - SQL Error:', error.message);
            res.status(500).json({ error: 'Failed to fetch prescriptions', details: error.message });
        }
    }

    // Get prescription by ID with details (JOIN query)
    async getById(req, res) {
        try {
            const { id } = req.params;
            const rows = await prescriptionQueries.getPrescriptionById(id);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Prescription not found' });
            }
            const prescription = {
                prescription_id: rows[0].prescription_id,
                patient_id: rows[0].patient_id,
                patient_name: rows[0].patient_name,
                doctor_id: rows[0].doctor_id,
                doctor_name: rows[0].doctor_name,
                date: rows[0].date,
                details: rows.filter(row => row.detail_id).map(row => ({
                    id: row.detail_id,
                    medicine_id: row.medicine_id,
                    medicine_name: row.medicine_name,
                    quantity: row.quantity
                }))
            };
            res.json(prescription);
        } catch (error) {
            console.error('Error fetching prescription:', error);
            res.status(500).json({ error: 'Failed to fetch prescription' });
        }
    }

    // Get prescriptions by patient (JOIN query)
    async getByPatient(req, res) {
        try {
            const { patientId } = req.params;
            const rows = await prescriptionQueries.getPrescriptionsByPatient(patientId);
            const prescriptions = groupPrescriptions(rows);
            res.json(prescriptions);
        } catch (error) {
            console.error('Error fetching patient prescriptions:', error);
            res.status(500).json({ error: 'Failed to fetch prescriptions' });
        }
    }

    // Create new prescription with details (with stock checking and reduction)
    async create(req, res) {
        try {
            const { patient_id, doctor_id, date, details } = req.body;

            if (!patient_id || !doctor_id || !date) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            if (!details || !Array.isArray(details) || details.length === 0) {
                return res.status(400).json({ error: 'Details required' });
            }

            const result = await prescriptionQueries.createPrescriptionWithDetails(
                patient_id,
                doctor_id,
                date,
                details
            );

            // Try to get bill (if exists)
            let bill = null;

            try {
                const billDetails = await billQueries.getBillByPrescription(result.prescriptionId);

                if (billDetails) {
                    bill = {
                        bill_id: billDetails.bill_id,
                        total_amount: billDetails.total_amount,
                        status: billDetails.status,
                        bill_date: billDetails.bill_date
                    };
                }
            } catch (e) {
                console.log("No bill yet (this is OK)");
            }

            res.status(201).json({
                message: 'Prescription created successfully',
                prescriptionId: result.prescriptionId,
                bill
            });

        } catch (error) {
            console.error('Create Error:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // Update prescription (header only)
    async update(req, res) {
        try {
            const { id } = req.params;
            const { patient_id, doctor_id, date } = req.body;
            if (!patient_id || !doctor_id || !date) {
                return res.status(400).json({ error: 'Missing required fields: patient_id, doctor_id, date' });
            }
            const result = await prescriptionQueries.updatePrescription(id, patient_id, doctor_id, date);
            if (result[0] === 0) {
                return res.status(404).json({ error: 'Prescription not found' });
            }
            res.json({ message: 'Prescription updated successfully' });
        } catch (error) {
            console.error('Error updating prescription:', error);
            res.status(500).json({ error: 'Failed to update prescription' });
        }
    }

    // Delete prescription and details
    async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await prescriptionQueries.deletePrescription(id);
            if (result[0] === 0) {
                return res.status(404).json({ error: 'Prescription not found' });
            }
            res.json({ message: 'Prescription deleted successfully' });
        } catch (error) {
            console.error('Error deleting prescription:', error);
            res.status(500).json({ error: 'Failed to delete prescription' });
        }
    }

    // Get prescription bill total
    async getBillTotal(req, res) {
        try {
            const { id } = req.params;
            const result = await prescriptionQueries.getPrescriptionBillTotal(id);
            res.json({ prescriptionId: id, totalAmount: result.total_amount });
        } catch (error) {
            console.error('Error getting bill total:', error);
            res.status(500).json({ error: 'Failed to get bill total' });
        }
    }
}

module.exports = new PrescriptionController();