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
const statsRoutes = require('./routes/stats');
const reportsRoutes = require('./routes/reports');

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
app.use('/api/stats', statsRoutes);
app.use('/api/reports', reportsRoutes);

// --- THE MASTER STATS ROUTE ---
app.get('/api/hospital-stats', async (req, res) => {
    try {
        const pool = await getConnection();

        // Get standard counts
        const patients = await pool.request().query('SELECT COUNT(*) AS total FROM patients');
        const doctors = await pool.request().query('SELECT COUNT(*) AS total FROM doctors');
        const medicines = await pool.request().query('SELECT COUNT(*) AS total FROM medicines');
        const appointments = await pool.request().query('SELECT COUNT(*) AS total FROM appointments');
        const totalUsers = await pool.request().query('SELECT COUNT(*) AS total FROM users');

        // Get specific counts for percentages
        const inStockMeds = await pool.request().query('SELECT COUNT(*) AS total FROM medicines WHERE quantity > 0');
        const compAppts = await pool.request().query("SELECT COUNT(*) AS total FROM appointments WHERE status = 'Completed'");

        // Extract numbers
        const pCount = patients.recordset[0].total;
        const dCount = doctors.recordset[0].total;
        const mCount = medicines.recordset[0].total;
        const aCount = appointments.recordset[0].total;
        const uCount = totalUsers.recordset[0].total;
        const stockCount = inStockMeds.recordset[0].total;
        const cApptCount = compAppts.recordset[0].total;

        // 🧮 CALCULATE TRUE PERCENTAGES
        const doctorPct = uCount > 0 ? Math.round((dCount / uCount) * 100) : 0;
        const patientPct = uCount > 0 ? Math.round((pCount / uCount) * 100) : 0;
        const medicinePct = mCount > 0 ? Math.round((stockCount / mCount) * 100) : 0;
        const apptPct = aCount > 0 ? Math.round((cApptCount / aCount) * 100) : 0;

        // Get activity counts (Bottom bar)
        let activeUsersValue = 0, loginsTodayValue = 0, totalActivitiesValue = 0;
        try {
            const activeRes = await pool.request().query("SELECT COUNT(*) AS total FROM users WHERE status = 'Active'");
            activeUsersValue = activeRes.recordset[0].total;
            const loginsRes = await pool.request().query("SELECT COUNT(*) AS total FROM user_logins WHERE CAST(login_time AS DATE) = CAST(GETDATE() AS DATE)");
            loginsTodayValue = loginsRes.recordset[0].total;
            const activityRes = await pool.request().query("SELECT COUNT(*) AS total FROM activity_logs");
            totalActivitiesValue = activityRes.recordset[0].total;
        } catch (e) { console.log("Stats tracking starting..."); }

        res.json({
            patients: pCount,
            doctors: dCount,
            medicines: mCount,
            appointments: aCount,
            totalUsers: uCount,
            activeUsers: activeUsersValue || uCount,
            loginsToday: loginsTodayValue,
            totalActivities: totalActivitiesValue,

            // ✅ SEND THE CALCULATED PERCENTAGES
            doctorTrend: doctorPct,
            patientTrend: patientPct,
            medicineTrend: medicinePct,
            appointmentTrend: apptPct
        });
    } catch (err) {
        console.error("Stats Error:", err);
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