const express = require('express');
const cors = require('cors');
const { getConnection } = require('./db/sqlConnection');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use(express.urlencoded({ extended: true }));

// Import routes
const patientRoutes = require('./routes/patients');
const doctorRoutes = require('./routes/doctors');
const medicineRoutes = require('./routes/medicines');
const appointmentRoutes = require('./routes/appointments');
const prescriptionRoutes = require('./routes/prescriptions');
const billRoutes = require('./routes/bills');
const viewRoutes = require('./routes/views');

// Use routes
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/views', viewRoutes);

// Add this to your backend server file
// Add this to your backend server file
app.get('/api/hospital-stats', async (req, res) => {
    try {
        const pool = await getConnection(); 

        let patientCount = 0;
        let doctorCount = 0;
        let aptCount = 0;

        // 1. Safely Count Patients
        try {
            const pRes = await pool.request().query('SELECT COUNT(*) AS total FROM patients');
            patientCount = pRes.recordset[0].total;
        } catch (e) { console.log("Note: patients table might be empty or missing."); }

        // 2. Safely Count Doctors (FIXED: Using your user_roles bridge table!)
        try {
            const dRes = await pool.request().query(`
                SELECT COUNT(*) AS total 
                FROM users u
                JOIN user_roles ur ON u.user_id = ur.user_id
                JOIN roles r ON ur.role_id = r.role_id
                WHERE r.role_name = 'Doctor'
            `);
            doctorCount = dRes.recordset[0].total;
        } catch (e) { console.log("Note: error checking doctors count."); }

        // 3. Safely Count Appointments
        try {
            const aRes = await pool.request().query('SELECT COUNT(*) AS total FROM appointments');
            aptCount = aRes.recordset[0].total;
        } catch (e) { console.log("Note: appointments table might not exist yet."); }

        // Send the real data back to React safely!
        res.json({
            patientsAttended: patientCount,
            doctorsAvailable: doctorCount,
            appointmentsToday: aptCount,
            pharmacyStatus: "In Stock" 
        });

    } catch (err) {
        console.error("Database connection failed:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

// Test route
app.get('/', (req, res) => {
    res.send('Healthcare & Inventory Management System Backend');
});

// Database test endpoint
app.get('/api/test-db', async (req, res) => {
    try {
        const connection = await getConnection();
        const [rows] = await connection.execute('SELECT 1 AS test');
        res.json({ status: 'success', message: 'Database connection working', data: rows });
    } catch (error) {
        console.error('Database test failed:', error.message);
        res.status(500).json({ status: 'error', message: 'Database connection failed', error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    // Test DB connection
    try {
        await getConnection();
    } catch (error) {
        console.error('Failed to connect to database');
    }
});