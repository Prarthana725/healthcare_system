
const express = require('express');
const router  = express.Router();
const viewsController = require('../controllers/viewsController');
 
// PATIENT
router.get('/patient-details',             viewsController.getPatientSummary);
router.get('/receptionist/patients',       viewsController.getReceptionistPatientList);
 
// APPOINTMENTS
router.get('/appointments',                viewsController.getAppointmentDetails);
router.get('/doctors/appointments',        viewsController.getDoctorAppointmentSummary);
 
// PRESCRIPTIONS
router.get('/prescriptions',               viewsController.getPrescriptionDetails);
 
// BILLING
router.get('/bills',                       viewsController.getBillSummary);
 
// PHARMACY
router.get('/low-stock',                   viewsController.getMedicineUsage);
router.get('/pharmacy/stock',              viewsController.getPharmacistStockOverview);
 
// REPORTS
router.get('/reports/daily-appointments',  viewsController.getDailyAppointmentReport);
router.get('/reports/doctor-performance',  viewsController.getDoctorPerformanceReport);
 
module.exports = router;
 