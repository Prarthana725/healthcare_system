# API Documentation - Healthcare & Inventory Management System

## Base URL
```
http://localhost:5000/api
```

## Patients API

### Get All Patients
```
GET /patients
```
**Response:**
```json
[
  {
    "patient_id": 1,
    "name": "John Doe",
    "age": 30,
    "phone": "1234567890"
  }
]
```

### Get Patient by ID
```
GET /patients/:id
```

### Create Patient
```
POST /patients
Content-Type: application/json

{
  "name": "Jane Doe",
  "age": 25,
  "phone": "9876543210"
}
```

### Update Patient
```
PUT /patients/:id
Content-Type: application/json

{
  "name": "Jane Smith",
  "age": 26,
  "phone": "9876543210"
}
```

### Delete Patient
```
DELETE /patients/:id
```

---

## Doctors API

### Get All Doctors
```
GET /doctors
```

### Get Doctors with Appointment Count (JOIN + GROUP BY)
```
GET /doctors/with-appointments
```
**Response:**
```json
[
  {
    "doctor_id": 1,
    "name": "Dr. Silva",
    "specialization": "Cardiology",
    "total_appointments": 5
  }
]
```

### Get Doctor by ID
```
GET /doctors/:id
```

### Get Doctor with Appointments (JOIN)
```
GET /doctors/:id/appointments
```
**Response:**
```json
{
  "doctor_id": 1,
  "name": "Dr. Silva",
  "specialization": "Cardiology",
  "appointment_count": 5
}
```

### Create Doctor
```
POST /doctors
Content-Type: application/json

{
  "name": "Dr. Smith",
  "specialization": "Neurology"
}
```

### Update Doctor
```
PUT /doctors/:id
```

### Delete Doctor
```
DELETE /doctors/:id
```

---

## Medicines API

### Get All Medicines
```
GET /medicines
```

### Get Low Stock Medicines (WHERE quantity < 10)
```
GET /medicines/low-stock
```

### Get Medicines with Usage Count (GROUP BY, SUM)
```
GET /medicines/with-usage
```
**Response:**
```json
[
  {
    "medicine_id": 1,
    "name": "Paracetamol",
    "quantity": 50,
    "total_used": 25
  }
]
```

### Get Medicine by ID
```
GET /medicines/:id
```

### Create Medicine
```
POST /medicines
Content-Type: application/json

{
  "name": "Aspirin",
  "quantity": 100
}
```

### Update Medicine
```
PUT /medicines/:id
```

### Delete Medicine
```
DELETE /medicines/:id
```

---

## Appointments API

### Get All Appointments (3-Table JOIN)
```
GET /appointments
```
**Response:**
```json
[
  {
    "appointment_id": 1,
    "date": "2026-04-27",
    "patient_id": 1,
    "patient_name": "John Doe",
    "doctor_id": 1,
    "doctor_name": "Dr. Silva",
    "specialization": "Cardiology"
  }
]
```

### Get Appointments by Patient (JOIN)
```
GET /appointments/patient/:patientId
```

### Get Appointments by Doctor (JOIN)
```
GET /appointments/doctor/:doctorId
```

### Get Appointment by ID (JOIN)
```
GET /appointments/:id
```

### Create Appointment
```
POST /appointments
Content-Type: application/json

{
  "patient_id": 1,
  "doctor_id": 1,
  "date": "2026-04-27"
}
```

### Update Appointment
```
PUT /appointments/:id
```

### Delete Appointment
```
DELETE /appointments/:id
```

---

## Prescriptions API

### Get All Prescriptions (Complex LEFT JOINs)
```
GET /prescriptions
```
**Response:**
```json
[
  {
    "prescription_id": 1,
    "patient_id": 1,
    "patient_name": "John Doe",
    "doctor_id": 1,
    "doctor_name": "Dr. Silva",
    "date": "2026-04-26",
    "details": [
      {
        "id": 1,
        "medicine_id": 1,
        "medicine_name": "Paracetamol",
        "quantity": 10
      }
    ]
  }
]
```

### Get Prescriptions by Patient (JOIN)
```
GET /prescriptions/patient/:patientId
```

### Get Prescription by ID (LEFT JOINs)
```
GET /prescriptions/:id
```

### Create Prescription with Details
```
POST /prescriptions
Content-Type: application/json

{
  "patient_id": 1,
  "doctor_id": 1,
  "date": "2026-04-26",
  "details": [
    {
      "medicine_id": 1,
      "quantity": 10
    },
    {
      "medicine_id": 2,
      "quantity": 5
    }
  ]
}
```

### Update Prescription
```
PUT /prescriptions/:id
```

### Delete Prescription
```
DELETE /prescriptions/:id
```

---

## Bills API

### Get All Bills (GROUP BY with aggregation)
```
GET /bills
```
**Response:**
```json
[
  {
    "bill_id": 1,
    "patient_id": 1,
    "patient_name": "John Doe",
    "doctor_id": 1,
    "doctor_name": "Dr. Silva",
    "date": "2026-04-26",
    "total_medicines": 2,
    "total_items": 15,
    "total_quantity": 15
  }
]
```

### Get Bills by Patient
```
GET /bills/patient/:patientId
```

### Get Bills by Doctor (GROUP BY)
```
GET /bills/doctor/:doctorId
```
**Response:**
```json
[
  {
    "doctor_id": 1,
    "doctor_name": "Dr. Silva",
    "total_bills": 5,
    "total_medicines_prescribed": 45
  }
]
```

### Get Monthly Bill Report (Date Functions, GROUP BY)
```
GET /bills/report/monthly
```
**Response:**
```json
[
  {
    "year": 2026,
    "month": 4,
    "total_bills": 10,
    "total_patients": 8,
    "total_medicines_issued": 100
  }
]
```

### Get Bill Details (JOIN)
```
GET /bills/:id
```
**Response:**
```json
{
  "bill_id": 1,
  "patient_id": 1,
  "patient_name": "John Doe",
  "doctor_id": 1,
  "doctor_name": "Dr. Silva",
  "date": "2026-04-26",
  "items": [
    {
      "item_id": 1,
      "medicine_id": 1,
      "medicine_name": "Paracetamol",
      "quantity": 10,
      "unit_price": 10,
      "item_total": 100
    }
  ],
  "total_items": 1,
  "total_amount": 100
}
```

### Calculate Bill Amount (SUM)
```
GET /bills/:id/calculate
```

### Generate Full Bill (Complete JOIN)
```
GET /bills/:id/generate
```

---

## SQL Features Demonstrated

### 1. INNER JOINs
- Appointments with patients and doctors
- Prescriptions with patients and doctors

### 2. LEFT JOINs
- Medicines with prescription details
- Doctors with appointments (optional)

### 3. GROUP BY with Aggregation
- Doctors with COUNT of appointments
- Medicines with SUM of quantities used
- Bills with SUM and COUNT of items
- Monthly reports with DATE functions

### 4. Transactions
- Prescription creation with multiple details
- Prescription deletion (cascade)

### 5. Triggers
- Stock reduction on prescription insertion
- Low stock alerts

### 6. Error Handling
- 404 Not Found
- 400 Bad Request (validation)
- 500 Internal Server Error

---

## HTTP Status Codes

- `200 OK` - Successful GET, PUT
- `201 Created` - Successful POST
- `400 Bad Request` - Missing required fields
- `404 Not Found` - Resource doesn't exist
- `500 Internal Server Error` - Database error

---

## Example Workflow

### 1. Create Patient
```bash
curl -X POST http://localhost:5000/api/patients \
  -H "Content-Type: application/json" \
  -d '{"name":"John","age":30,"phone":"1234567890"}'
```

### 2. Create Doctor
```bash
curl -X POST http://localhost:5000/api/doctors \
  -H "Content-Type: application/json" \
  -d '{"name":"Dr.Smith","specialization":"Cardiology"}'
```

### 3. Create Appointment
```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{"patient_id":1,"doctor_id":1,"date":"2026-04-27"}'
```

### 4. Create Prescription
```bash
curl -X POST http://localhost:5000/api/prescriptions \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id":1,
    "doctor_id":1,
    "date":"2026-04-26",
    "details":[{"medicine_id":1,"quantity":10}]
  }'
```

### 5. View Bill
```bash
curl http://localhost:5000/api/bills/1
```

---

## Notes
- All timestamps are in ISO 8601 format (YYYY-MM-DD)
- IDs are auto-incremented by MySQL
- Prescription creation automatically triggers stock reduction via database trigger
- Bill amounts are calculated using database SUM functions
