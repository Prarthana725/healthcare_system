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
DELIMITER $$ CREATE TRIGGER prevent_negative_stock BEFORE
UPDATE ON medicines FOR EACH ROW BEGIN IF NEW.quantity < 0 THEN
SET NEW.quantity = 0;
END IF;
END $$ DELIMITER;
DELIMITER $$ CREATE TRIGGER low_stock_alert
AFTER
UPDATE ON medicines FOR EACH ROW BEGIN IF NEW.quantity < 10 THEN SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'Low stock warning!';
END IF;
END $$ DELIMITER;
DELIMITER $$ CREATE PROCEDURE AddPatient(
    IN p_name VARCHAR(100),
    IN p_age INT,
    IN p_phone VARCHAR(15)
) BEGIN
INSERT INTO patients(name, age, phone)
VALUES (p_name, p_age, p_phone);
END $$ DELIMITER;