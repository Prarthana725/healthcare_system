import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api';

function Dashboard() {
  const [totals, setTotals] = useState({ patients: 0, doctors: 0, medicines: 0 });

  useEffect(() => {
    async function loadCounts() {
      try {
        const [patientsRes, doctorsRes, medicinesRes] = await Promise.all([
          fetch(`${API_URL}/patients`),
          fetch(`${API_URL}/doctors`),
          fetch(`${API_URL}/medicines`)
        ]);
        const patients = patientsRes.ok ? await patientsRes.json() : [];
        const doctors = doctorsRes.ok ? await doctorsRes.json() : [];
        const medicines = medicinesRes.ok ? await medicinesRes.json() : [];

        setTotals({
          patients: Array.isArray(patients) ? patients.length : 0,
          doctors: Array.isArray(doctors) ? doctors.length : 0,
          medicines: Array.isArray(medicines) ? medicines.length : 0
        });
      } catch (error) {
        setTotals({ patients: 0, doctors: 0, medicines: 0 });
      }
    }

    loadCounts();
  }, []);

  return (
    <div className="page-content">
      <h2>Dashboard</h2>
      <div className="card-grid">
        <div className="card">
          <div className="card-title">Total Patients</div>
          <div className="card-value">{totals.patients}</div>
        </div>
        <div className="card">
          <div className="card-title">Total Doctors</div>
          <div className="card-value">{totals.doctors}</div>
        </div>
        <div className="card">
          <div className="card-title">Total Medicines</div>
          <div className="card-value">{totals.medicines}</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
