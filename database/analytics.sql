-- Top used medicines
SELECT m.name,
    SUM(pd.quantity) AS total_used
FROM prescription_details pd
    JOIN medicines m ON pd.medicine_id = m.medicine_id
GROUP BY m.name
ORDER BY total_used DESC;
-- Doctor performance
SELECT d.name,
    COUNT(pr.prescription_id) AS total_prescriptions
FROM prescriptions pr
    JOIN doctors d ON pr.doctor_id = d.doctor_id
GROUP BY d.name;
-- Monthly revenue
SELECT MONTH(created_at) AS month,
    SUM(total_amount) AS total_revenue
FROM bills
GROUP BY MONTH(created_at);