SELECT p.name AS patient,
    d.name AS doctor,
    a.date
FROM appointments a
    JOIN patients p ON a.patient_id = p.patient_id
    JOIN doctors d ON a.doctor_id = d.doctor_id;