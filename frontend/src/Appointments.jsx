import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api';

function Appointments() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ patient_id: '', doctor_id: '', date: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
          fetch(`${API_URL}/patients`),
          fetch(`${API_URL}/doctors`),
          fetch(`${API_URL}/appointments`)
        ]);
        const patientsData = patientsRes.ok ? await patientsRes.json() : [];
        const doctorsData = doctorsRes.ok ? await doctorsRes.json() : [];
        const appointmentsData = appointmentsRes.ok ? await appointmentsRes.json() : [];
        setPatients(Array.isArray(patientsData) ? patientsData : []);
        setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
        setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      } catch (error) {
        setPatients([]);
        setDoctors([]);
        setAppointments([]);
      }
    }
    loadData();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: Number(form.patient_id),
          doctor_id: Number(form.doctor_id),
          date: form.date
        })
      });
      if (response.ok) {
        setMessage('Appointment booked successfully.');
        setForm({ patient_id: '', doctor_id: '', date: '' });
        const fresh = await (await fetch(`${API_URL}/appointments`)).json();
        setAppointments(Array.isArray(fresh) ? fresh : []);
      } else {
        setMessage('Unable to book appointment.');
      }
    } catch (error) {
      setMessage('Unable to book appointment.');
    }
  }

  return (
    <div className="page-content">
      <h2>Appointments</h2>

      <div className="form-panel">
        <h3>Book Appointment</h3>
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
          <button type="submit">Submit</button>
        </form>
        {message && <p className="small-note">{message}</p>}
      </div>

      <div className="table-panel">
        <h3>Appointment List</h3>
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment, index) => (
              <tr key={appointment.appointment_id ?? appointment.id ?? index}>
                <td>{appointment.patient_name ?? appointment.patient?.name ?? appointment.patient_id}</td>
                <td>{appointment.doctor_name ?? appointment.doctor?.name ?? appointment.doctor_id}</td>
                <td>{appointment.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Appointments;
