-- View 1: Patient Full Details
CREATE VIEW patient_full_details AS
SELECT p.patient_id,
    p.name AS patient_name,
    d.name AS doctor_name,
    pr.date,
    m.name AS medicine_name
FROM prescriptions pr
    JOIN patients p ON pr.patient_id = p.patient_id
    JOIN doctors d ON pr.doctor_id = d.doctor_id
    JOIN prescription_details pd ON pr.prescription_id = pd.prescription_id
    JOIN medicines m ON pd.medicine_id = m.medicine_id;
-- View 2: Low Stock Medicines
CREATE VIEW low_stock_medicines AS
SELECT name,
    quantity
FROM medicines
WHERE quantity < 10;

-- View 3: Patient Summary
CREATE OR REPLACE VIEW patient_summary AS
SELECT p.name AS patient_name,
       COUNT(a.appointment_id) AS total_appointments
FROM patients p
LEFT JOIN appointments a ON p.patient_id = a.patient_id
GROUP BY p.patient_id, p.name;

-- View 4: Medicine Usage
CREATE OR REPLACE VIEW medicine_usage AS
SELECT m.name AS medicine_name,
       COALESCE(SUM(pd.quantity), 0) AS total_quantity_used
FROM medicines m
LEFT JOIN prescription_details pd ON m.medicine_id = pd.medicine_id
GROUP BY m.medicine_id, m.name;