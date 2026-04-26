DELIMITER // CREATE TRIGGER reduce_stock
AFTER
INSERT ON prescription_details FOR EACH ROW BEGIN
UPDATE medicines
SET quantity = quantity - NEW.quantity
WHERE medicine_id = NEW.medicine_id;
END // DELIMITER;