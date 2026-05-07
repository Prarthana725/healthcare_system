const { getConnection } =
    require('../db/sqlConnection');

class AuthController {

    async login(req, res) {

        try {

            const {
                username,
                password
            } = req.body;

            const connection =
                await getConnection();

            const result =
                await connection.request()

                    .input(
                        'username',
                        username
                    )

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

            const user =
                result.recordset[0];

            //--------------------------------------------------
            // INVALID LOGIN
            //--------------------------------------------------

            if (
                !user ||
                user.password !== password
            ) {

                return res.status(401).json({

                    error:
                        'Invalid credentials'

                });

            }

            //--------------------------------------------------
            // SUCCESS LOGIN
            //--------------------------------------------------

            res.json({

                message:
                    'Login successful',

                user: {

                    id:
                        user.user_id,

                    username:
                        user.username,

                    role:
                        user.role_name,

                    doctor_id:
                        user.doctor_id,

                    patient_id:
                        user.patient_id

                }

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({

                error:
                    'Login failed'

            });

        }
    }
}

module.exports =
    new AuthController();