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

            const {
                username,
                password,
                role_id
            } = req.body;

            if (!username || !password || !role_id) {

                return res.status(400).json({
                    error: 'Missing fields'
                });
            }

            const user = await userQueries.createUser(
                username,
                password,
                role_id
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
}

module.exports = new UserController();