const { getConnection, sql } = require('./sqlConnection');

async function getAllUsers() {
    const connection = await getConnection();

    const result = await connection.request().query(`
        SELECT 
            u.user_id,
            u.username,
            u.password,
            u.doctor_id,
            u.patient_id,
            r.role_name
        FROM users u
        LEFT JOIN user_roles ur ON u.user_id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.role_id
    `);

    return result.recordset;
}

async function usernameExists(username) {
    const connection = await getConnection();
    const result = await connection.request()
        .input('username', sql.VarChar, username)
        .query(`
            SELECT user_id
            FROM users
            WHERE username = @username
        `);
    return result.recordset.length > 0;
}

async function patientUserExists(patient_id) {
    const connection = await getConnection();
    const result = await connection.request()
        .input('patient_id', sql.Int, patient_id)
        .query(`
            SELECT user_id
            FROM users
            WHERE patient_id = @patient_id
        `);
    return result.recordset.length > 0;
}

async function doctorExists(doctor_id) {
    const connection = await getConnection();
    const result = await connection.request()
        .input('doctor_id', sql.Int, doctor_id)
        .query(`
            SELECT doctor_id
            FROM doctors
            WHERE doctor_id = @doctor_id
        `);
    return result.recordset.length > 0;
}

async function patientExists(patient_id) {
    const connection = await getConnection();
    const result = await connection.request()
        .input('patient_id', sql.Int, patient_id)
        .query(`
            SELECT patient_id
            FROM patients
            WHERE patient_id = @patient_id
        `);
    return result.recordset.length > 0;
}

async function createUser(username, password, role_id, doctor_id = null, patient_id = null) {
    const connection = await getConnection();

    const parsedRoleId = Number(role_id);
    const parsedDoctorId = doctor_id === null || doctor_id === undefined || doctor_id === ''
        ? null
        : Number(doctor_id);
    const parsedPatientId = patient_id === null || patient_id === undefined || patient_id === ''
        ? null
        : Number(patient_id);

    const doctorValue = parsedRoleId === 2 ? parsedDoctorId : null;
    const patientValue = parsedRoleId === 3 ? parsedPatientId : null;

    console.log('createUser payload:', { username, role_id: parsedRoleId, doctor_id: doctorValue, patient_id: patientValue });

    const userResult = await connection.request()
        .input('username', sql.VarChar, username)
        .input('password', sql.VarChar, password)
        .input('doctor_id', sql.Int, doctorValue)
        .input('patient_id', sql.Int, patientValue)
        .query(`
            INSERT INTO users (username, password, doctor_id, patient_id)
            OUTPUT INSERTED.user_id
            VALUES (@username, @password, @doctor_id, @patient_id)
        `);

    const user_id = userResult.recordset[0].user_id;

    // INSERT ROLE
    await connection.request()
        .input('user_id', sql.Int, user_id)
        .input('role_id', sql.Int, parsedRoleId)
        .query(`
        IF EXISTS (SELECT * FROM user_roles WHERE user_id = @user_id)
        BEGIN
            UPDATE user_roles SET role_id = @role_id WHERE user_id = @user_id
        END
        ELSE
        BEGIN
            INSERT INTO user_roles (user_id, role_id)
            VALUES (@user_id, @role_id)
        END
    `);

    if (parsedRoleId === 2 && doctorValue !== null) {
        console.log(`Linking doctor_id=${doctorValue} to user_id=${user_id}`);

        await connection.request()
            .input('doctor_id', sql.Int, doctorValue)
            .input('user_id', sql.Int, user_id)
            .query(`
                UPDATE doctors
                SET user_id = @user_id
                WHERE doctor_id = @doctor_id;
            `);
    }

    if (parsedRoleId === 3 && patientValue !== null) {
        console.log(`Linking patient_id=${patientValue} to user_id=${user_id}`);
        // Patient linking is maintained through users.patient_id only.
    }

    return {
        user_id,
        username,
        role_id: parsedRoleId,
        doctor_id: parsedRoleId === 2 ? parsedDoctorId : null,
        patient_id: parsedRoleId === 3 ? parsedPatientId : null
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
    usernameExists,
    patientUserExists,
    doctorExists,
    patientExists,
    createUser,
    deleteUser
};