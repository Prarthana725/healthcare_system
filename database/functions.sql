DELIMITER // -- Function to calculate total bill for a prescription
CREATE FUNCTION CalculateBillTotal(prescription_id_param INT) RETURNS DECIMAL(10, 2) DETERMINISTIC BEGIN
DECLARE total_amount DECIMAL(10, 2) DEFAULT 0.00;
-- Calculate total based on prescription details
-- Assuming each medicine has a fixed price of 10.00 per unit
SELECT COALESCE(SUM(pd.quantity * 10.00), 0.00) INTO total_amount
FROM prescription_details pd
WHERE pd.prescription_id = prescription_id_param;
RETURN total
END //

CREATE FUNCTION GetPatientCount() RETURNS INT DETERMINISTIC BEGIN
    DECLARE total INT;
    SELECT COUNT(*) INTO total FROM patients;
    RETURN total;
END //
DELIMITER;
ELIMITER;