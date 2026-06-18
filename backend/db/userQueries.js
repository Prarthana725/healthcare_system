const { getConnection, sql } = require('./sqlConnection');

// userQueries.js
async function getAllUsers() {
    const connection = await getConnection();
    const result = await connection.request().query(`
        SELECT
            u.user_id,
            u.username,
            r.role_name,
            u.last_login
        FROM users u
        JOIN user_roles ur ON u.user_id = ur.user_id
        JOIN roles r ON ur.role_id = r.role_id
        ORDER BY u.user_id DESC
    `);
    return result.recordset;
}

async function createUser(username, password, role_id) {
    const connection = await getConnection();

    // INSERT USER - (මෙන්න මේ කොටස තමයි ඔයාගේ කේතයෙන් මැකිලා තිබුණේ)
    const userResult = await connection.request()
        .input('username', sql.VarChar, username)
        .input('password', sql.VarChar, password)
        .query(`
            INSERT INTO users (username, password)
            OUTPUT INSERTED.user_id
            VALUES (@username, @password)
        `);

    const user_id = userResult.recordset[0].user_id;

    // INSERT ROLE
    await connection.request()
        .input('user_id', sql.Int, user_id)
        .input('role_id', sql.Int, role_id)
        .query(`
            INSERT INTO user_roles (user_id, role_id)
            VALUES (@user_id, @role_id)
        `);

    // AUTO CREATE DOCTOR
    if (role_id == 2) {
        const doctorResult = await connection.request()
            .input('name', sql.VarChar, username)
            .input('specialization', sql.VarChar, 'General')
            .query(`
                INSERT INTO doctors (name, specialization)
                OUTPUT INSERTED.doctor_id
                VALUES (@name, @specialization)
            `);

        const doctor_id = doctorResult.recordset[0].doctor_id;

        await connection.request()
            .input('doctor_id', sql.Int, doctor_id)
            .input('user_id', sql.Int, user_id)
            .query(`
                UPDATE users
                SET doctor_id = @doctor_id
                WHERE user_id = @user_id
            `);
    }

    // AUTO CREATE PATIENT
    if (role_id == 5) {
        const patientResult = await connection.request()
            .input('name', sql.VarChar, username)
            .input('age', sql.Int, 0)
            .input('phone', sql.VarChar, 'Not Added')
            .query(`
                INSERT INTO patients (name, age, phone)
                OUTPUT INSERTED.patient_id
                VALUES (@name, @age, @phone)
            `);

        const patient_id = patientResult.recordset[0].patient_id;

        await connection.request()
            .input('patient_id', sql.Int, patient_id)
            .input('user_id', sql.Int, user_id)
            .query(`
                UPDATE users
                SET patient_id = @patient_id
                WHERE user_id = @user_id
            `);
    }

    return {
        user_id,
        username,
        role_id
    };
}

// DELETE USER
async function deleteUser(user_id) {
    const connection = await getConnection();

    // DELETE USER ROLE
    await connection.request()
        .input('user_id', sql.Int, user_id)
        .query(`
            DELETE FROM user_roles
            WHERE user_id = @user_id
        `);

    // DELETE USER
    await connection.request()
        .input('user_id', sql.Int, user_id)
        .query(`
            DELETE FROM users
            WHERE user_id = @user_id
        `);

    return true;
}

module.exports = {
    getAllUsers,
    createUser,
    deleteUser
};