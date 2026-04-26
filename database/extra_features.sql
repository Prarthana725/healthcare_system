DELIMITER $$ CREATE TRIGGER prevent_negative_stock BEFORE
UPDATE ON medicines FOR EACH ROW BEGIN IF NEW.quantity < 0 THEN
SET NEW.quantity = 0;
END IF;
END $$ DELIMITER;
DELIMITER $$ CREATE TRIGGER auto_generate_bill
AFTER
INSERT ON prescriptions FOR EACH ROW BEGIN
INSERT INTO bills (patient_id, total_amount)
VALUES (NEW.patient_id, 0);
END $$ DELIMITER;
SELECT CheckMedicineStock(1);
SELECT *
FROM medicines
WHERE quantity < 10;