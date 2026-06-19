const userQueries = require('../db/userQueries');

class UserController {

    // GET USERS
    async getAll(req, res) {
        try {
            const users = await userQueries.getAllUsers();

            res.json(users);

        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: 'Failed to fetch users'
            });
        }
    }

    // CREATE USER
    async create(req, res) {
        try {
            const { username, password, role_id, doctor_id, patient_id } = req.body;
            const parsedRoleId = Number(role_id);
            const parsedDoctorId = doctor_id === undefined || doctor_id === null || doctor_id === ''
                ? null
                : Number(doctor_id);
            const parsedPatientId = patient_id === undefined || patient_id === null || patient_id === ''
                ? null
                : Number(patient_id);

            if (!username || !password || !role_id || Number.isNaN(parsedRoleId)) {
                return res.status(400).json({
                    error: 'Missing or invalid fields: username, password, role_id'
                });
            }

            if (parsedRoleId === 2) {
                if (parsedDoctorId === null || Number.isNaN(parsedDoctorId)) {
                    return res.status(400).json({
                        error: 'Doctor role requires a valid existing doctor_id'
                    });
                }

                if (!(await userQueries.doctorExists(parsedDoctorId))) {
                    return res.status(400).json({
                        error: 'Selected doctor profile does not exist'
                    });
                }
            }

            if (parsedRoleId === 3) {
                if (parsedPatientId === null || Number.isNaN(parsedPatientId)) {
                    return res.status(400).json({
                        error: 'Patient role requires a valid existing patient_id'
                    });
                }

                if (!(await userQueries.patientExists(parsedPatientId))) {
                    return res.status(400).json({
                        error: 'Selected patient profile does not exist'
                    });
                }
            }

            const user = await userQueries.createUser(
                username,
                password,
                parsedRoleId,
                parsedDoctorId,
                parsedPatientId
            );

            res.status(201).json({
                message: 'User created successfully',
                user
            });

        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: 'Failed to create user'
            });
        }
    }

    // DELETE USER
    async deleteUser(req, res) {
        try {
            const { id } = req.params;

            await userQueries.deleteUser(id);

            res.json({
                message: 'User deleted successfully'
            });

        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: 'Failed to delete user'
            });
        }
    }
}

module.exports = new UserController();