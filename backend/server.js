const express = require('express');
const cors = require('cors');
const { getConnection } = require('./db/sqlConnection');


const app = express();
app.use(cors());
app.use(express.json());

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