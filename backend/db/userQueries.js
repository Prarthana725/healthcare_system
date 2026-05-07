const { getConnection, sql } = require('./sqlConnection');

class UserQueries {

    // GET ALL USERS WITH ROLE
    async getAllUsers() {

        const pool = await getConnection();

        const result = await pool.request().query(`
            SELECT 
                u.user_id,
                u.username,
                r.role_name
            FROM users u
            JOIN user_roles ur 
                ON u.user_id = ur.user_id
            JOIN roles r
                ON ur.role_id = r.role_id
            ORDER BY u.user_id DESC
        `);

        return result.recordset;
    }

    // CREATE USER
    async createUser(username, password, role_id) {

        const pool = await getConnection();

        // insert user
        const userResult = await pool.request()
            .input('username', sql.VarChar, username)
            .input('password', sql.VarChar, password)
            .query(`
                INSERT INTO users (username, password)
                OUTPUT INSERTED.user_id
                VALUES (@username, @password)
            `);

        const user_id = userResult.recordset[0].user_id;

        // assign role
        await pool.request()
            .input('user_id', sql.Int, user_id)
            .input('role_id', sql.Int, role_id)
            .query(`
                INSERT INTO user_roles (user_id, role_id)
                VALUES (@user_id, @role_id)
            `);

        return {
            user_id,
            username,
            role_id
        };
    }
}

module.exports = new UserQueries();