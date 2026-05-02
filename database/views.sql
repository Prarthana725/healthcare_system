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