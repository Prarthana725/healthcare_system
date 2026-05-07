const userQueries = require('../db/userQueries');

class UserController {

    async create(req, res) {
        try {
            const { username, password, role_id } = req.body;

            const result = await userQueries.createUser(username, password, role_id);

            res.status(201).json({ message: 'User created', result });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async getAll(req, res) {
        try {
            const users = await userQueries.getUsers();
            res.json(users);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new UserController();