const { getConnection } = require('./connection');

class UserQueries {

    async createUser(username, password, role_id) {
        const connection = await getConnection();

        const [result] = await connection.execute(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, password]
        );

        const userId = result.insertId;

        await connection.execute(
            'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
            [userId, role_id]
        );

        return result;
    }

    async getUsers() {
        const connection = await getConnection();

        const [rows] = await connection.execute(`
            SELECT u.user_id, u.username, r.role_name
            FROM users u
            JOIN user_roles ur ON u.user_id = ur.user_id
            JOIN roles r ON ur.role_id = r.role_id
        `);

        return rows;
    }
}

module.exports = new UserQueries();