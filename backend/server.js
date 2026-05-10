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
const forgotPasswordRoutes = require('./routes/auth.forgotPassword'); // New forgot password route

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Link routes to paths
app.use('/api/auth', authRoutes);
app.use('/api/auth', forgotPasswordRoutes); // Link the forgot password routes here correctly
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/views', viewRoutes);

// --- UPDATED HOSPITAL STATS ROUTE ---
app.get('/api/hospital-stats', async (req, res) => {
    try {
        const pool = await getConnection(); 

        // 1. Count total patients
        const patientsResult = await pool.request().query('SELECT COUNT(*) AS total FROM patients');
        
        // 2. Count doctors (Using your user_roles bridge table to avoid 'role_id' error)
        const doctorsResult = await pool.request().query(`
            SELECT COUNT(DISTINCT u.user_id) AS total 
            FROM users u
            JOIN user_roles ur ON u.user_id = ur.user_id
            JOIN roles r ON ur.role_id = r.role_id
            WHERE r.role_name = 'Doctor'
        `);
        
        // 3. Count appointments
        const appointmentsResult = await pool.request().query('SELECT COUNT(*) AS total FROM appointments');

        res.json({
            patientsAttended: patientsResult.recordset[0].total,
            doctorsAvailable: doctorsResult.recordset[0].total,
            appointmentsToday: appointmentsResult.recordset[0].total,
            pharmacyStatus: "In Stock"
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