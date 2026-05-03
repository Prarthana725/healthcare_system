import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api';

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ name: '', specialization: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadDoctors() {
      try {
        const response = await fetch(`${API_URL}/doctors`);
        const data = response.ok ? await response.json() : [];
        setDoctors(Array.isArray(data) ? data : []);
      } catch (error) {
        setDoctors([]);
      }
    }
    loadDoctors();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch(`${API_URL}/doctors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (response.ok) {
        setMessage('Doctor added successfully.');
        setForm({ name: '', specialization: '' });
        const fresh = await (await fetch(`${API_URL}/doctors`)).json();
        setDoctors(Array.isArray(fresh) ? fresh : []);
      } else {
        setMessage('Unable to add doctor.');
      }
    } catch (error) {
      setMessage('Unable to add doctor.');
    }
  }

  return (
    <div className="page-content">
      <h2>Doctors</h2>
      <div className="form-panel">
        <h3>Add Doctor</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Name"
              required
            />
            <input
              value={form.specialization}
              onChange={(e) => setForm({ ...form, specialization: e.target.value })}
              placeholder="Specialization"
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
        {message && <p className="small-note">{message}</p>}
      </div>

      <div className="table-panel">
        <h3>Doctor List</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialization</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor, index) => (
              <tr key={doctor.doctor_id ?? doctor.id ?? index}>
                <td>{doctor.name}</td>
                <td>{doctor.specialization}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Doctors;
