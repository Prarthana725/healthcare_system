import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api';

function Reports() {
  const [patientSummary, setPatientSummary] = useState([]);
  const [medicineUsage, setMedicineUsage] = useState([]);

  useEffect(() => {
    async function loadReports() {
      try {
        const [patientsRes, medicinesRes] = await Promise.all([
          fetch(`${API_URL}/views/patient-summary`),
          fetch(`${API_URL}/views/medicine-usage`)
        ]);
        const patients = patientsRes.ok ? await patientsRes.json() : [];
        const medicines = medicinesRes.ok ? await medicinesRes.json() : [];
        setPatientSummary(Array.isArray(patients) ? patients : []);
        setMedicineUsage(Array.isArray(medicines) ? medicines : []);
      } catch (error) {
        setPatientSummary([]);
        setMedicineUsage([]);
      }
    }
    loadReports();
  }, []);

  return (
    <div className="page-content">
      <h2>Reports</h2>

      <div className="table-panel">
        <h3>Patient Summary</h3>
        <table>
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Total Appointments</th>
            </tr>
          </thead>
          <tbody>
            {patientSummary.map((row, index) => (
              <tr key={row.patient_name ?? index}>
                <td>{row.patient_name}</td>
                <td>{row.total_appointments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-panel">
        <h3>Medicine Usage</h3>
        <table>
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Total Quantity Used</th>
            </tr>
          </thead>
          <tbody>
            {medicineUsage.map((row, index) => (
              <tr key={row.medicine_name ?? index}>
                <td>{row.medicine_name}</td>
                <td>{row.total_quantity_used}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reports;
