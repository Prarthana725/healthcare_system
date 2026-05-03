import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api';

function Patients() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ name: '', age: '', phone: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadPatients() {
      try {
        const response = await fetch(`${API_URL}/patients`);
        const data = response.ok ? await response.json() : [];
        setPatients(Array.isArray(data) ? data : []);
      } catch (error) {
        setPatients([]);
      }
    }
    loadPatients();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch(`${API_URL}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (response.ok) {
        setMessage('Patient added successfully.');
        setForm({ name: '', age: '', phone: '' });
        const fresh = await (await fetch(`${API_URL}/patients`)).json();
        setPatients(Array.isArray(fresh) ? fresh : []);
      } else {
        setMessage('Unable to add patient.');
      }
    } catch (error) {
      setMessage('Unable to add patient.');
    }
  }

  return (
    <div className="page-content">
      <h2>Patients</h2>
      <div className="form-panel">
        <h3>Add Patient</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Name"
              required
            />
            <input
              type="number"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              placeholder="Age"
              required
            />
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Phone"
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
        {message && <p className="small-note">{message}</p>}
      </div>

      <div className="table-panel">
        <h3>Patient List</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, index) => (
              <tr key={patient.patient_id ?? patient.id ?? index}>
                <td>{patient.name}</td>
                <td>{patient.age}</td>
                <td>{patient.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Patients;
