const express = require('express');
const cors = require('cors');
const { getConnection } = require('./db/connection');

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const patientRoutes = require('./routes/patients');
const doctorRoutes = require('./routes/doctors');
const medicineRoutes = require('./routes/medicines');
const appointmentRoutes = require('./routes/appointments');
const prescriptionRoutes = require('./routes/prescriptions');

// Use routes
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('Healthcare & Inventory Management System Backend');
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