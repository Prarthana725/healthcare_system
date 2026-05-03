import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api';

function Prescriptions() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [form, setForm] = useState({
    patient_id: '',
    doctor_id: '',
    date: '',
    details: [{ medicine_id: '', quantity: '' }]
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [patientsRes, doctorsRes, medicinesRes, prescriptionsRes] = await Promise.all([
          fetch(`${API_URL}/patients`),
          fetch(`${API_URL}/doctors`),
          fetch(`${API_URL}/medicines`),
          fetch(`${API_URL}/prescriptions`)
        ]);
        const patientsData = patientsRes.ok ? await patientsRes.json() : [];
        const doctorsData = doctorsRes.ok ? await doctorsRes.json() : [];
        const medicinesData = medicinesRes.ok ? await medicinesRes.json() : [];
        const prescriptionsData = prescriptionsRes.ok ? await prescriptionsRes.json() : [];
        setPatients(Array.isArray(patientsData) ? patientsData : []);
        setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
        setMedicines(Array.isArray(medicinesData) ? medicinesData : []);
        setPrescriptions(Array.isArray(prescriptionsData) ? prescriptionsData : []);
      } catch (error) {
        setPatients([]);
        setDoctors([]);
        setMedicines([]);
        setPrescriptions([]);
      }
    }
    loadData();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const details = form.details
        .filter((item) => item.medicine_id && item.quantity)
        .map((item) => ({
          medicine_id: Number(item.medicine_id),
          quantity: Number(item.quantity)
        }));

      const response = await fetch(`${API_URL}/prescriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: Number(form.patient_id),
          doctor_id: Number(form.doctor_id),
          date: form.date,
          details
        })
      });
      if (response.ok) {
        setMessage('Prescription created successfully.');
        setForm({ patient_id: '', doctor_id: '', date: '', details: [{ medicine_id: '', quantity: '' }] });
        const fresh = await (await fetch(`${API_URL}/prescriptions`)).json();
        setPrescriptions(Array.isArray(fresh) ? fresh : []);
      } else {
        setMessage('Unable to create prescription.');
      }
    } catch (error) {
      setMessage('Unable to create prescription.');
    }
  }

  function handleDetailChange(index, field, value) {
    const details = [...form.details];
    details[index][field] = value;
    setForm({ ...form, details });
  }

  function addDetailRow() {
    setForm({ ...form, details: [...form.details, { medicine_id: '', quantity: '' }] });
  }

  return (
    <div className="page-content">
      <h2>Prescriptions</h2>
      <div className="form-panel">
        <h3>Create Prescription</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <select
              value={form.patient_id}
              onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
              required
            >
              <option value="">Select Patient</option>
              {patients.map((patient, index) => (
                <option key={patient.patient_id ?? patient.id ?? index} value={patient.patient_id ?? patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
            <select
              value={form.doctor_id}
              onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
              required
            >
              <option value="">Select Doctor</option>
              {doctors.map((doctor, index) => (
                <option key={doctor.doctor_id ?? doctor.id ?? index} value={doctor.doctor_id ?? doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </div>

          <div className="form-panel">
            <h4>Medicine Details</h4>
            {form.details.map((detail, index) => (
              <div className="form-row" key={index}>
                <select
                  value={detail.medicine_id}
                  onChange={(e) => handleDetailChange(index, 'medicine_id', e.target.value)}
                  required
                >
                  <option value="">Select Medicine</option>
                  {medicines.map((medicine, idx) => (
                    <option key={medicine.medicine_id ?? medicine.id ?? idx} value={medicine.medicine_id ?? medicine.id}>
                      {medicine.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={detail.quantity}
                  onChange={(e) => handleDetailChange(index, 'quantity', e.target.value)}
                  placeholder="Quantity"
                  required
                />
              </div>
            ))}
            <button type="button" onClick={addDetailRow} style={{ marginTop: '10px' }}>
              Add Medicine Row
            </button>
          </div>

          <button type="submit">Submit</button>
        </form>
        {message && <p className="small-note">{message}</p>}
      </div>

      <div className="table-panel">
        <h3>Prescription List</h3>
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((prescription, index) => (
              <tr key={prescription.prescription_id ?? prescription.id ?? index}>
                <td>{prescription.patient_name ?? prescription.patient?.name ?? prescription.patient_id}</td>
                <td>{prescription.doctor_name ?? prescription.doctor?.name ?? prescription.doctor_id}</td>
                <td>{prescription.date}</td>
                <td>{Array.isArray(prescription.details) ? prescription.details.length : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Prescriptions;
