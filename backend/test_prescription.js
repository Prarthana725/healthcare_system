const prescriptionQueries = require('./db/prescriptionQueries');
const { getConnection } = require('./db/connection');
(async () => {
  try {
    const conn = await getConnection();
    const [[medicine]] = await conn.query('SELECT medicine_id, quantity FROM medicines WHERE quantity >= 1 LIMIT 1');
    const [[patient]] = await conn.query('SELECT patient_id FROM patients LIMIT 1');
    const [[doctor]] = await conn.query('SELECT doctor_id FROM doctors LIMIT 1');
    if (!medicine || !patient || !doctor) {
      throw new Error('Missing sample patient/doctor/medicine.');
    }
    console.log('Using sample:', { medicine, patient, doctor });
    const result = await prescriptionQueries.createPrescriptionWithDetails(
      patient.patient_id,
      doctor.doctor_id,
      new Date().toISOString().slice(0, 10),
      [{ medicine_id: medicine.medicine_id, quantity: 1 }]
    );
    console.log('CREATE RESULT', result);
  } catch (e) {
    console.error('ERR', e);
    process.exit(1);
  }
})();
