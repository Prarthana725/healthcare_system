const { getConnection } = require('../db/sqlConnection');

class AuthController {
    async login(req, res) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ error: 'Username and password required' });
            }

            const connection = await getConnection();

            const result = await connection.request()
                .input('username', username)
                .query('SELECT * FROM users WHERE username = @username');

            const user = result.recordset[0];

            if (!user || user.password !== password) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            res.json({
                message: 'Login successful',
                user: {
                    id: user.user_id,
                    username: user.username
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Login failed' });
        }
    }
}

module.exports = new AuthController();