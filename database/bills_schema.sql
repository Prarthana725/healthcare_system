-- Bills table to store generated bills
CREATE TABLE IF NOT EXISTS bills (
    bill_id INT PRIMARY KEY AUTO_INCREMENT,
    prescription_id INT NOT NULL UNIQUE,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    bill_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
    INDEX idx_prescription (prescription_id),
    INDEX idx_patient (patient_id),
    INDEX idx_doctor (doctor_id),
    INDEX idx_date (bill_date)
);