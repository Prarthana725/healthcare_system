DELIMITER // -- Trigger to automatically generate bill when prescription is created
CREATE TRIGGER generate_bill_after_prescription
AFTER
INSERT ON prescriptions FOR EACH ROW BEGIN -- Insert bill record with calculated total using CalculateBillTotal function
INSERT INTO bills (
        prescription_id,
        patient_id,
        doctor_id,
        bill_date,
        total_amount
    )
VALUES (
        NEW.prescription_id,
        NEW.patient_id,
        NEW.doctor_id,
        NEW.date,
        CalculateBillTotal(NEW.prescription_id)
    );
END // DELIMITER;