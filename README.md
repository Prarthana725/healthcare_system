# Healthcare & Inventory Management System

A full-stack DBMS project demonstrating Advanced Database Management System concepts.

## Features

- **Relational Database Design**: Normalized tables with proper relationships
- **CRUD Operations**: Complete Create, Read, Update, Delete for all entities
- **SQL Joins & Queries**: JOINs for appointments, prescriptions with details
- **Stored Procedures**: GetAppointments procedure
- **Triggers**: Automatic stock reduction on prescription issuance
- **Inventory Management**: Stock tracking with low stock alerts

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: React
- **Database**: MySQL
- **Database Programming**: SQL with procedures and triggers

## Entities

- Patients
- Doctors
- Medicines
- Appointments
- Prescriptions
- Prescription Details

## API Endpoints

### Patients
- GET /api/patients
- GET /api/patients/:id
- POST /api/patients
- PUT /api/patients/:id
- DELETE /api/patients/:id

### Doctors
- GET /api/doctors
- GET /api/doctors/:id
- POST /api/doctors
- PUT /api/doctors/:id
- DELETE /api/doctors/:id

### Medicines
- GET /api/medicines
- GET /api/medicines/low-stock
- GET /api/medicines/:id
- POST /api/medicines
- PUT /api/medicines/:id
- DELETE /api/medicines/:id

### Appointments
- GET /api/appointments (uses stored procedure with JOINs)
- GET /api/appointments/:id
- POST /api/appointments
- PUT /api/appointments/:id
- DELETE /api/appointments/:id

### Prescriptions
- GET /api/prescriptions (with JOINs to details and medicines)
- GET /api/prescriptions/:id
- POST /api/prescriptions
- PUT /api/prescriptions/:id
- DELETE /api/prescriptions/:id

## Database Schema

See `database/schema.sql` for table structures and relationships.

## Setup

1. Import database schema from `database/`
2. Install backend dependencies: `cd backend && npm install`
3. Start backend: `npm start`
4. Install frontend dependencies: `cd frontend && npm install`
5. Start frontend: `npm start`

## ADBMS Concepts Demonstrated

- Relational model with foreign keys
- Normalization (3NF)
- SQL JOINs, subqueries
- Stored procedures and triggers
- Transaction management
- ACID properties