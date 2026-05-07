const patientQueries = require('../db/patientQueries');

class PatientController {

    // Get all patients
    async getAll(req, res) {

        try {

            const patients =
                await patientQueries.getAllPatients();

            console.log(
                'PatientController.getAll - Returning patients:',
                patients
            );

            res.json(patients || []);

        } catch (error) {

            console.error(
                'PatientController.getAll - SQL Error:',
                error.message
            );

            res.status(500).json({
                error: 'Failed to fetch patients',
                details: error.message
            });

        }
    }

    // Get patient by ID
    async getById(req, res) {

        try {

            const { id } = req.params;

            const patients =
                await patientQueries.getPatientById(id);

            if (patients.length === 0) {

                return res.status(404).json({
                    error: 'Patient not found'
                });

            }

            res.json(patients[0]);

        } catch (error) {

            console.error(
                'Error fetching patient:',
                error
            );

            res.status(500).json({
                error: 'Failed to fetch patient'
            });

        }
    }

    // Create new patient
    async create(req, res) {

        try {

            const { name, age, phone } = req.body;

            if (!name || !age || !phone) {

                return res.status(400).json({
                    error:
                        'Missing required fields: name, age, phone'
                });

            }

            const result =
                await patientQueries.createPatient(
                    name,
                    age,
                    phone
                );

            res.status(201).json({

                message:
                    'Patient created successfully',

                patientId: result.id

            });

        } catch (error) {

            console.error(
                'Error creating patient:',
                error
            );

            res.status(500).json({
                error: 'Failed to create patient'
            });

        }
    }

    // Update patient
    async update(req, res) {

        try {

            const { id } = req.params;

            const { name, age, phone } = req.body;

            if (!name || !age || !phone) {

                return res.status(400).json({
                    error:
                        'Missing required fields: name, age, phone'
                });

            }

            const result =
                await patientQueries.updatePatient(
                    id,
                    name,
                    age,
                    phone
                );

            if (result === 0) {

                return res.status(404).json({
                    error: 'Patient not found'
                });

            }

            res.json({
                message:
                    'Patient updated successfully'
            });

        } catch (error) {

            console.error(
                'Error updating patient:',
                error
            );

            res.status(500).json({
                error: 'Failed to update patient'
            });

        }
    }

    // Get patient with all related data
    async getWithAllData(req, res) {

        try {

            const { id } = req.params;

            const patientData =
                await patientQueries.getPatientWithAllData(id);

            if (!patientData) {

                return res.status(404).json({
                    error: 'Patient not found'
                });

            }

            res.json(patientData);

        } catch (error) {

            console.error(
                'Error fetching patient with all data:',
                error
            );

            res.status(500).json({
                error:
                    'Failed to fetch patient data'
            });

        }
    }

    // NEW PATIENT DASHBOARD
    async getPatientDashboard(req, res) {

        try {

            const { id } = req.params;

            const data =
                await patientQueries.getPatientDashboardData(id);

            if (!data) {

                return res.status(404).json({
                    error: 'Patient not found'
                });

            }

            res.json(data);

        } catch (error) {

            console.error(
                'Error fetching patient dashboard:',
                error
            );

            res.status(500).json({
                error:
                    'Failed to fetch patient dashboard'
            });

        }
    }

    // Delete patient
    async delete(req, res) {

        try {

            const { id } = req.params;

            const result =
                await patientQueries.deletePatient(id);

            if (result === 0) {

                return res.status(404).json({
                    error: 'Patient not found'
                });

            }

            res.json({
                message:
                    'Patient deleted successfully'
            });

        } catch (error) {

            console.error(
                'Error deleting patient:',
                error
            );

            res.status(500).json({
                error: 'Failed to delete patient'
            });

        }
    }
}

module.exports = new PatientController();