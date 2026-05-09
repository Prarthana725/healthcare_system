

const { getConnection } = require('../db/sqlConnection');

// ── 1. PATIENT FULL DETAILS ───────────────────────────────────
exports.getPatientSummary = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.request()
            .query('SELECT * FROM patient_full_details');
        res.json(result.recordset);
    } catch (err) {
        console.error("Error in patient summary:", err);
        res.status(500).json({ error: err.message });
    }
};

// ── 2. LOW STOCK MEDICINES ────────────────────────────────────
exports.getMedicineUsage = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.request()
            .query('SELECT * FROM low_stock_medicines');
        res.json(result.recordset);
    } catch (err) {
        console.error("Error in medicine usage:", err);
        res.status(500).json({ error: err.message });
    }
};

// ── 3. DOCTOR APPOINTMENT SUMMARY ────────────────────────────
exports.getDoctorAppointmentSummary = async (req, res) => {
    try {
        const connection = await getConnection();
        const { doctor_id } = req.query;
        const request = connection.request();
        let query = 'SELECT * FROM doctor_appointment_summary';
        if (doctor_id) {
            query += ' WHERE doctor_id = @doctor_id';
            request.input('doctor_id', doctor_id);
        }
        const result = await request.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error("Error in doctor appointment summary:", err);
        res.status(500).json({ error: err.message });
    }
};

// ── 4. APPOINTMENT FULL DETAILS ───────────────────────────────
exports.getAppointmentDetails = async (req, res) => {
    try {
        const connection = await getConnection();
        const { status, date } = req.query;
        const request = connection.request();
        const conditions = [];
        if (status) {
            conditions.push('appointment_status = @status');
            request.input('status', status);
        }
        if (date) {
            conditions.push('CAST(appointment_date AS DATE) = @date');
            request.input('date', date);
        }
        const where = conditions.length ? ' WHERE ' + conditions.join(' AND ') : '';
        const result = await request.query(
            `SELECT * FROM appointment_full_details${where} ORDER BY appointment_date DESC`
        );
        res.json(result.recordset);
    } catch (err) {
        console.error("Error in appointment details:", err);
        res.status(500).json({ error: err.message });
    }
};

// ── 5. PRESCRIPTION DETAILS ───────────────────────────────────
exports.getPrescriptionDetails = async (req, res) => {
    try {
        const connection = await getConnection();
        const { patient_id, doctor_id } = req.query;
        const request = connection.request();
        const conditions = [];
        if (patient_id) {
            conditions.push('patient_id = @patient_id');
            request.input('patient_id', patient_id);
        }
        if (doctor_id) {
            conditions.push('doctor_id = @doctor_id');
            request.input('doctor_id', doctor_id);
        }
        const where = conditions.length ? ' WHERE ' + conditions.join(' AND ') : '';
        const result = await request.query(
            `SELECT * FROM prescription_details${where} ORDER BY prescription_date DESC`
        );
        res.json(result.recordset);
    } catch (err) {
        console.error("Error in prescription details:", err);
        res.status(500).json({ error: err.message });
    }
};

// ── 6. BILL PAYMENT SUMMARY ───────────────────────────────────
exports.getBillSummary = async (req, res) => {
    try {
        const connection = await getConnection();
        const { patient_id, payment_status } = req.query;
        const request = connection.request();
        const conditions = [];
        if (patient_id) {
            conditions.push('patient_id = @patient_id');
            request.input('patient_id', patient_id);
        }
        if (payment_status) {
            conditions.push('payment_status = @payment_status');
            request.input('payment_status', payment_status);
        }
        const where = conditions.length ? ' WHERE ' + conditions.join(' AND ') : '';
        const result = await request.query(
            `SELECT * FROM bill_payment_summary${where} ORDER BY bill_date DESC`
        );
        res.json(result.recordset);
    } catch (err) {
        console.error("Error in bill summary:", err);
        res.status(500).json({ error: err.message });
    }
};

// ── 7. PHARMACIST STOCK OVERVIEW ──────────────────────────────
exports.getPharmacistStockOverview = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.request()
            .query('SELECT * FROM pharmacist_stock_overview ORDER BY stock_quantity ASC');
        res.json(result.recordset);
    } catch (err) {
        console.error("Error in pharmacist stock overview:", err);
        res.status(500).json({ error: err.message });
    }
};

// ── 8. RECEPTIONIST PATIENT LIST ──────────────────────────────
exports.getReceptionistPatientList = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.request()
            .query('SELECT * FROM receptionist_patient_list ORDER BY registered_date DESC');
        res.json(result.recordset);
    } catch (err) {
        console.error("Error in receptionist patient list:", err);
        res.status(500).json({ error: err.message });
    }
};

// ── 9. DAILY APPOINTMENT REPORT ───────────────────────────────
exports.getDailyAppointmentReport = async (req, res) => {
    try {
        const connection = await getConnection();
        const { date } = req.query;
        const request = connection.request();
        let query = 'SELECT * FROM daily_appointment_report';
        if (date) {
            query += ' WHERE CAST(appointment_date AS DATE) = @date';
            request.input('date', date);
        } else {
            query += ' WHERE CAST(appointment_date AS DATE) = CAST(GETDATE() AS DATE)';
        }
        query += ' ORDER BY appointment_date ASC';
        const result = await request.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error("Error in daily appointment report:", err);
        res.status(500).json({ error: err.message });
    }
};

// ── 10. DOCTOR PERFORMANCE REPORT ────────────────────────────
exports.getDoctorPerformanceReport = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.request()
            .query('SELECT * FROM doctor_performance_report ORDER BY total_appointments DESC');
        res.json(result.recordset);
    } catch (err) {
        console.error("Error in doctor performance report:", err);
        res.status(500).json({ error: err.message });
    }
};