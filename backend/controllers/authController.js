const { getConnection } = require('../db/sqlConnection');
const bcrypt = require('bcrypt'); // Use 'bcryptjs' here if that's what you installed earlier!

class AuthController {

    async login(req, res) {

        try {
            const { username, password } = req.body;
            const connection = await getConnection();

            const result = await connection.request()
                .input('username', username)
                .query(`
                    SELECT
                        u.user_id,
                        u.username,
                        u.password,
                        u.doctor_id,
                        u.patient_id,
                        r.role_name
                    FROM users u
                    JOIN user_roles ur
                        ON u.user_id = ur.user_id
                    JOIN roles r
                        ON ur.role_id = r.role_id
                    WHERE u.username = @username
                `);

            const user = result.recordset[0];

            //--------------------------------------------------
            // INVALID LOGIN CHECK
            //--------------------------------------------------
            
            // 1. If username doesn't exist at all
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // 2. Hybrid Password Matcher
            let isMatch = false;
            
            // If the database password starts with $2a$ or $2b$, it is an encrypted bcrypt hash
            if (user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$'))) {
                isMatch = await bcrypt.compare(password, user.password);
            } else {
                // Otherwise, it is an old plain-text password (like '12345')
                isMatch = (user.password === password);
            }

            // If the passwords do not match
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }


            //--------------------------------------------------
            // SUCCESS LOGIN
            //--------------------------------------------------

            res.json({
                message: 'Login successful',
                user: {
                    id: user.user_id,
                    username: user.username,
                    role: user.role_name,
                    doctor_id: user.doctor_id,
                    patient_id: user.patient_id
                }
            });

        } catch (error) {
            console.error("Login Error:", error);
            res.status(500).json({ error: 'Login failed' });
        }
    }

  async updateUser(req, res) {
    try {
        const { id } = req.params;
        const { username, password, role_name } = req.body;
        const connection = await getConnection();

        
        await connection.request()
            .input('id', id)
            .input('username', username)
            .input('password', password)
            .query(`
                UPDATE users 
                SET username = @username, password = @password 
                WHERE user_id = @id
            `);

        
        if (role_name) {
            await connection.request()
                .input('id', id)
                .input('role_name', role_name)
                .query(`
                    UPDATE user_roles
                    SET role_id = (SELECT role_id FROM roles WHERE role_name = @role_name)
                    WHERE user_id = @id
                `);
        }

        res.json({ message: 'User updated successfully' });

    } catch (error) {
        console.error("Update User Error:", error);
        res.status(500).json({ error: 'Failed to update user' });
    }
}
}

module.exports = new AuthController();