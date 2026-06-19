const { getConnection, sql } = require('../db/sqlConnection');
const bcrypt = require('bcrypt'); // Use 'bcryptjs' here if that's what you installed earlier!

class AuthController {

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const connection = await getConnection();

            const cleanUsername = username.trim();
            const cleanPassword = password.trim();

            const result = await connection.request()
                .input('username', sql.VarChar, cleanUsername)
                .query(`
                    SELECT
                        u.user_id,
                        u.username,
                        u.password,
                        u.doctor_id,
                        u.patient_id,
                        r.role_name,
                        d.doctor_id AS doctor_row_id
                    FROM users u
                    LEFT JOIN user_roles ur
                        ON u.user_id = ur.user_id
                    LEFT JOIN roles r
                        ON ur.role_id = r.role_id
                    LEFT JOIN doctors d
                        ON d.doctor_id = u.doctor_id
                    WHERE u.username = @username
                `);

            const user = result.recordset[0];
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            //--------------------------------------------------
            // INVALID LOGIN CHECK
            //--------------------------------------------------

            let isMatch = false;

            if (user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$'))) {
                isMatch = await bcrypt.compare(cleanPassword, user.password);
            } else {
                isMatch = user.password && user.password.trim() === cleanPassword;
            }

            // If the passwords do not match
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            //--------------------------------------------------
            // SUCCESS LOGIN - UPDATE LAST LOGIN TIME
            //--------------------------------------------------
            // මෙතන තමයි අපි අලුතින් එකතු කළේ. ලොග් වුණ වෙලාව සටහන් කරනවා.
            try {
                await connection.request()
                    .input('userId', user.user_id)
                    .query(`
                        UPDATE users 
                        SET last_login = GETDATE() 
                        WHERE user_id = @userId
                    `);
            } catch (updateErr) {
                console.error("Failed to update last login time:", updateErr);
                // වෙලාව සේව් කරන්න බැරි වුණත් ලොග් වෙන එක නතර කරන්නේ නැහැ
            }


            // ROLE LINK VALIDATION (ONLY FOR DOCTOR)
            const resolvedDoctorId = user.doctor_row_id || user.doctor_id;
            if (user.role_name === 'Doctor' && !resolvedDoctorId) {
                return res.status(403).json({
                    error: "Your login is not linked to any Doctor profile. Please contact admin."
                });
            }
            res.json({
                message: 'Login successful',
                user: {
                    id: user.user_id,
                    username: user.username,
                    role: user.role_name,
                    doctor_id: resolvedDoctorId,
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

            // දැන් Frontend එකෙන් එන role_id එකත් අපි මෙතනින් අල්ලගන්නවා
            const { username, password, role_name, role, role_id } = req.body;
            const incomingRoleName = role_name || role;

            const connection = await getConnection();

            // 1. Password & Username Update කිරීම
            if (password && password.trim() !== "") {
                await connection.request()
                    .input('id', id)
                    .input('username', username)
                    .input('password', password)
                    .query(`
                        UPDATE users 
                        SET username = @username, password = @password 
                        WHERE user_id = @id
                    `);
            } else if (username) {
                await connection.request()
                    .input('id', id)
                    .input('username', username)
                    .query(`
                        UPDATE users 
                        SET username = @username 
                        WHERE user_id = @id
                    `);
            }

            // 2. Role Update කිරීම (role_id එක හරහා)
            if (role_id) {
                // කෙලින්ම ID එක පාවිච්චි කරලා අකුරු වැරදීම් (spelling mistakes) නැතුව අප්ඩේට් කිරීම
                await connection.request()
                    .input('id', id)
                    .input('role_id', parseInt(role_id))
                    .query(`
                        UPDATE user_roles 
                        SET role_id = @role_id 
                        WHERE user_id = @id;
                        
                        -- යම් හෙයකින් user_roles එකේ record එකක් කලින් තිබුණේ නැත්නම් අලුතින් දැමීම
                        IF @@ROWCOUNT = 0
                        BEGIN
                            INSERT INTO user_roles (user_id, role_id) VALUES (@id, @role_id);
                        END
                    `);
            } else if (incomingRoleName) {
                // යම් හෙයකින් අනාගතයේදී නමෙන් එව්වොත් වැඩ කරන්න පරණ කේතයත් තබාගැනීම
                const formattedRole = incomingRoleName.charAt(0).toUpperCase() + incomingRoleName.slice(1).toLowerCase();
                await connection.request()
                    .input('id', id)
                    .input('role_name', formattedRole)
                    .query(`
                        DECLARE @TargetRoleID INT = (SELECT TOP 1 role_id FROM roles WHERE role_name LIKE '%' + LTRIM(RTRIM(@role_name)) + '%');
                        IF @TargetRoleID IS NOT NULL
                        BEGIN
                            UPDATE user_roles SET role_id = @TargetRoleID WHERE user_id = @id;
                        END
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