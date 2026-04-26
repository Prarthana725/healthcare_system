# ADBMS Backend Project Structure

## Overview
This backend follows a professional ADBMS (Advanced Database Management System) structure with clear separation of concerns:
- **Database Layer** (`db/`): All SQL queries centralized
- **Controllers** (`controllers/`): Business logic using database layer
- **Routes** (`routes/`): API endpoint definitions
- **Server** (`server.js`): Express app configuration

## Directory Structure

```
backend/
├── db/
│   ├── connection.js           # MySQL connection manager
│   ├── patientQueries.js       # Patient SQL queries
│   ├── doctorQueries.js        # Doctor SQL queries (with JOINs)
│   ├── medicineQueries.js      # Medicine SQL queries (with GROUP BY)
│   ├── appointmentQueries.js   # Appointment SQL queries (with JOINs)
│   ├── prescriptionQueries.js  # Prescription SQL queries (with complex JOINs)
│   └── billQueries.js          # Bill SQL queries (with aggregations)
├── controllers/
│   ├── patientController.js
│   ├── doctorController.js
│   ├── medicineController.js
│   ├── appointmentController.js
│   ├── prescriptionController.js
│   └── billController.js
├── routes/
│   ├── patients.js
│   ├── doctors.js
│   ├── medicines.js
│   ├── appointments.js
│   ├── prescriptions.js
│   └── bills.js
├── server.js                   # Express app & routes setup
└── package.json
```

## ADBMS Features Demonstrated

### 1. Database Layer (`db/` folder)
All SQL logic is centralized in query files, separating SQL from business logic.

**Key Queries with Relationships:**

#### Doctor Queries (with JOIN)
```javascript
// Get doctors with appointment count
SELECT d.doctor_id, d.name, d.specialization, 
       COUNT(a.appointment_id) AS total_appointments
FROM doctors d
LEFT JOIN appointments a ON d.doctor_id = a.doctor_id
GROUP BY d.doctor_id
```

#### Appointment Queries (with INNER JOINs)
```javascript
// Get all appointments with patient and doctor details
SELECT a.appointment_id, a.date,
       p.patient_id, p.name AS patient_name,
       d.doctor_id, d.name AS doctor_name, d.specialization
FROM appointments a
JOIN patients p ON a.patient_id = p.patient_id
JOIN doctors d ON a.doctor_id = d.doctor_id
ORDER BY a.date DESC
```

#### Prescription Queries (complex JOINs with LEFT JOIN)
```javascript
// Get prescriptions with medicine details
SELECT pr.prescription_id, pr.date,
       p.patient_id, p.name AS patient_name,
       d.doctor_id, d.name AS doctor_name,
       pd.id AS detail_id, pd.medicine_id, pd.quantity,
       m.name AS medicine_name
FROM prescriptions pr
JOIN patients p ON pr.patient_id = p.patient_id
JOIN doctors d ON pr.doctor_id = d.doctor_id
LEFT JOIN prescription_details pd ON pr.prescription_id = pd.prescription_id
LEFT JOIN medicines m ON pd.medicine_id = m.medicine_id
```

#### Medicine Queries (with GROUP BY)
```javascript
// Get medicines with total usage count
SELECT m.medicine_id, m.name, m.quantity,
       COALESCE(SUM(pd.quantity), 0) AS total_used
FROM medicines m
LEFT JOIN prescription_details pd ON m.medicine_id = pd.medicine_id
GROUP BY m.medicine_id
```

#### Bill Queries (with aggregation and multiple JOINs)
```javascript
// Calculate bills with item totals
SELECT pr.prescription_id AS bill_id,
       p.patient_id, p.name AS patient_name,
       d.doctor_id, d.name AS doctor_name,
       pr.date,
       COUNT(DISTINCT pd.id) AS total_medicines,
       SUM(pd.quantity) AS total_quantity
FROM prescriptions pr
JOIN patients p ON pr.patient_id = p.patient_id
JOIN doctors d ON pr.doctor_id = d.doctor_id
LEFT JOIN prescription_details pd ON pr.prescription_id = pd.prescription_id
GROUP BY pr.prescription_id
```

### 2. Controllers (`controllers/` folder)
Controllers call query methods, not embedding SQL.

**Pattern:**
```javascript
// Controllers use query methods, not raw SQL
const doctorQueries = require('../db/doctorQueries');

async getAll(req, res) {
    try {
        const doctors = await doctorQueries.getAllDoctors();
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch' });
    }
}
```

### 3. Routes (`routes/` folder)
Routes map HTTP methods to controller actions.

**Example Route Structure:**
```javascript
// Specific routes before parameterized routes
router.post('/', controller.create);
router.get('/special-endpoint', controller.specialMethod);
router.get('/:id/related', controller.relatedData);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);
router.get('/', controller.getAll);
```

## API Endpoints

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Doctors (with JOIN queries)
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/with-appointments` - Get doctors with appointment count (GROUP BY)
- `GET /api/doctors/:id` - Get doctor by ID
- `GET /api/doctors/:id/appointments` - Get doctor with appointment details (JOIN)
- `POST /api/doctors` - Create doctor
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor

### Medicines (with JOIN queries)
- `GET /api/medicines` - Get all medicines
- `GET /api/medicines/low-stock` - Get low stock medicines (< 10 qty)
- `GET /api/medicines/with-usage` - Get medicines with usage count (GROUP BY, SUM)
- `GET /api/medicines/:id` - Get medicine by ID
- `POST /api/medicines` - Create medicine
- `PUT /api/medicines/:id` - Update medicine
- `DELETE /api/medicines/:id` - Delete medicine

### Appointments (with JOIN queries)
- `GET /api/appointments` - Get all appointments (3-table JOIN)
- `GET /api/appointments/patient/:patientId` - Get appointments by patient (JOIN)
- `GET /api/appointments/doctor/:doctorId` - Get appointments by doctor (JOIN)
- `GET /api/appointments/:id` - Get appointment with full details (JOIN)
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Prescriptions (with complex JOINs)
- `GET /api/prescriptions` - Get all prescriptions with details (LEFT JOINs)
- `GET /api/prescriptions/patient/:patientId` - Get patient prescriptions (JOIN)
- `GET /api/prescriptions/:id` - Get prescription with all details (JOINs)
- `POST /api/prescriptions` - Create prescription with details
- `PUT /api/prescriptions/:id` - Update prescription
- `DELETE /api/prescriptions/:id` - Delete prescription and details

### Bills (with aggregation and reporting)
- `GET /api/bills` - Get all bills with summary (GROUP BY, COUNT, SUM)
- `GET /api/bills/patient/:patientId` - Get bills by patient
- `GET /api/bills/doctor/:doctorId` - Get bills by doctor (GROUP BY)
- `GET /api/bills/report/monthly` - Get monthly bill report (DATE functions, GROUP BY)
- `GET /api/bills/:id` - Get bill details with items (JOIN)
- `GET /api/bills/:id/calculate` - Calculate bill amount (SUM)
- `GET /api/bills/:id/generate` - Generate complete bill document (JOIN)

## ADBMS Concepts Demonstrated

1. **Relational Model**: Tables with primary and foreign keys
2. **Normalization**: 3NF design (patients, doctors, medicines are separate)
3. **SQL JOINs**:
   - INNER JOINs: appointments with patients and doctors
   - LEFT JOINs: medicines with prescription details
4. **Aggregation**:
   - COUNT(): Counting appointments per doctor
   - SUM(): Total medicines used
   - GROUP BY: Grouping by doctor, medicine, date
5. **Subqueries**: Via stored procedures
6. **Transactions**: Used in prescription creation/deletion
7. **Triggers**: Stock reduction on prescription insertion
8. **Complex Queries**: Multiple JOINs with grouping and aggregation

## Code Quality Features

- **Error Handling**: Try-catch blocks with proper HTTP status codes
- **Input Validation**: Checking required fields before DB operations
- **Separation of Concerns**: SQL logic separate from business logic
- **Reusability**: Query methods called by controllers
- **Consistency**: Uniform error responses and status codes
- **Student-Friendly**: Simple, readable code suitable for presentations

## How to Use

### 1. Setup
```bash
npm install
# Database must be created with schema
# Tables: patients, doctors, medicines, appointments, prescriptions, prescription_details
```

### 2. Start Server
```bash
npm start
# Server runs on http://localhost:5000
```

### 3. Test Endpoints
```bash
# Get all doctors
curl http://localhost:5000/api/doctors

# Get doctors with appointment summary
curl http://localhost:5000/api/doctors/with-appointments

# Get all bills with summaries
curl http://localhost:5000/api/bills

# Get bill details
curl http://localhost:5000/api/bills/1

# Get patient's prescriptions with medicines
curl http://localhost:5000/api/prescriptions/patient/1
```

## For ADBMS Viva Presentation

Highlight these points:
1. **Database Layer**: All SQL queries in `db/` folder for easy review
2. **JOIN Queries**: Multiple JOIN examples in doctor, appointment, prescription queries
3. **Aggregation**: GROUP BY and SUM in medicine and bill queries
4. **Relationships**: Foreign keys properly used in all queries
5. **Transactions**: Used in prescription creation/deletion
6. **Error Handling**: Proper HTTP status codes and error messages
7. **Scalability**: Easy to add new modules (controllers → routes → db queries)
