require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const cors = require('cors');
const { getConnection } = require('./db/sqlConnection');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const patientRoutes = require('./routes/patients');
const doctorRoutes = require('./routes/doctors');
const medicineRoutes = require('./routes/medicines');
const appointmentRoutes = require('./routes/appointments');
const prescriptionRoutes = require('./routes/prescriptions');
const billRoutes = require('./routes/bills');
const viewRoutes = require('./routes/views');
const forgotPasswordRoutes = require('./routes/auth.forgotPassword');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Link routes to paths
app.use('/api/auth', authRoutes);
app.use('/api/auth', forgotPasswordRoutes);
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/views', viewRoutes);

// --- FULLY ACTIVATED HOSPITAL STATS ROUTE ---
app.get('/api/hospital-stats', async (req, res) => {
    try {
        const pool = await getConnection(); 

        // 1. Fetch Main Counts
        const patients = await pool.request().query('SELECT COUNT(*) AS total FROM patients');
        const doctors = await pool.request().query('SELECT COUNT(*) AS total FROM doctors');
        const medicines = await pool.request().query('SELECT COUNT(*) AS total FROM medicines');
        const appointments = await pool.request().query('SELECT COUNT(*) AS total FROM appointments');
        const totalUsers = await pool.request().query('SELECT COUNT(*) AS total FROM users');
        
        let activeUsersValue = 0;
        let loginsTodayValue = 0;
        let totalActivitiesValue = 0;

        // 2. Fetch Supplemental Stats (System Overview)
        try {
            // Note: Ensure you ran the 'ALTER TABLE users ADD status...' command in SSMS first!
            const activeRes = await pool.request().query("SELECT COUNT(*) AS total FROM users WHERE status = 'Active'");
            activeUsersValue = activeRes.recordset[0].total;
            
            const loginsRes = await pool.request().query("SELECT COUNT(*) AS total FROM user_logins WHERE CAST(login_time AS DATE) = CAST(GETDATE() AS DATE)");
            loginsTodayValue = loginsRes.recordset[0].total;

            const activityRes = await pool.request().query("SELECT COUNT(*) AS total FROM activity_logs");
            totalActivitiesValue = activityRes.recordset[0].total;
        } catch (e) {
            console.log("Supplemental tables not found, using defaults.");
        }

        // 3. Send Response (Includes naming for BOTH Dashboard and Landing Page)
        res.json({
            // For Admin Dashboard
            patients: patients.recordset[0].total,
            doctors: doctors.recordset[0].total,
            medicines: medicines.recordset[0].total,
            appointments: appointments.recordset[0].total,
            totalUsers: totalUsers.recordset[0].total,
            activeUsers: activeUsersValue,
            loginsToday: loginsTodayValue,
            totalActivities: totalActivitiesValue,

            // For Landing Page (Home)
            patientsAttended: patients.recordset[0].total,
            doctorsAvailable: doctors.recordset[0].total,
            appointmentsToday: appointments.recordset[0].total,
            pharmacyStatus: medicines.recordset[0].total > 0 ? "In Stock" : "Out of Stock"
        });
    } catch (err) {
        console.error("Database error in stats:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

// Root test route
app.get('/', (req, res) => {
    res.send('Healthcare & Inventory Management System Backend is Running');
});

// Database test endpoint
app.get('/api/test-db', async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT 1 AS test');
        res.json({ status: 'success', message: 'Database connection working', data: result.recordset });
    } catch (error) {
        console.error('Database test failed:', error.message);
        res.status(500).json({ status: 'error', message: 'Database connection failed', error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    try {
        await getConnection();
        console.log('✅ Connected to SQL Server');
    } catch (error) {
        console.error('❌ Failed to connect to database');
    }
});