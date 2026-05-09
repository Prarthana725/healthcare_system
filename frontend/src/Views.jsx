import React, { useEffect, useState } from "react";
import "./Views.css";

const API_BASE = "http://localhost:5000/api";

function Views() {

  const [patients, setPatients] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [bills, setBills] = useState([]);
  const [pharmacy, setPharmacy] = useState([]);
  const [reception, setReception] = useState([]);
  const [doctorReport, setDoctorReport] = useState([]);

  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  // SAFE FETCH
  const fetchData = async (url, setter) => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      setter(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("API Error:", err.message);
      setter([]);
    } finally {
      setLoading(false);
    }
  };

  // API CALLS
  const fetchPatients = () =>
    fetchData(`${API_BASE}/patients`, setPatients);

  const fetchMedicines = () =>
    fetchData(`${API_BASE}/medicines`, setMedicines);

  const fetchAppointments = () =>
    fetchData(`${API_BASE}/appointments`, setAppointments);

  const fetchPrescriptions = () =>
    fetchData(`${API_BASE}/prescriptions`, setPrescriptions);

  const fetchBills = () =>
    fetchData(`${API_BASE}/bills`, setBills);

  const fetchPharmacy = () =>
    fetchData(`${API_BASE}/pharmacy`, setPharmacy);

  const fetchReception = () =>
    fetchData(`${API_BASE}/reception`, setReception);

  const fetchDoctorReport = () =>
    fetchData(`${API_BASE}/doctor-report`, setDoctorReport);

  // LOAD ALL
  useEffect(() => {
    const loadAll = async () => {
      await Promise.all([
        fetchPatients(),
        fetchMedicines(),
        fetchAppointments(),
        fetchPrescriptions(),
        fetchBills(),
        fetchPharmacy(),
        fetchReception(),
        fetchDoctorReport()
      ]);
    };

    loadAll();
  }, []);

  if (loading) {
    return <h2 className="loading">Loading dashboard...</h2>;
  }

  return (
    <div className="views-container">
      <h1> Healthcare Dashboard</h1>

      {/* SUMMARY CARDS */}
<div className="summary">
  <div className="card">
    <h2>{patients.length}</h2>
    <p>Patients</p>
  </div>

  <div className="card">
    <h2>{appointments.length}</h2>
    <p>Appointments</p>
  </div>

  <div className="card">
    <h2>{medicines.length}</h2>
    <p>Medicines</p>
  </div>
</div>
      {/* PATIENTS */}
      <section>
        <h2>Patients</h2>
        <table>
          <tbody>
            {patients.map((p, i) => (
              <tr key={i}>
                <td>{p.name}</td>
                <td>{p.age}</td>
                <td>{p.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* MEDICINES */}
      <section>
        <h2>Medicines</h2>
        <table>
          <tbody>
            {medicines.map((m, i) => (
              <tr key={i}>
                <td>{m.medicine_name}</td>
                <td>{m.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* APPOINTMENTS + FILTER */}
      <section>
        <h2>Appointments</h2>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <table>
          <tbody>
            {appointments
              .filter(a =>
                statusFilter === "all" ? true : a.status === statusFilter
              )
              .map((a, i) => (
                <tr key={i}>
                  <td>{a.date}</td>
                  <td>{a.patient_name}</td>
                  <td>{a.doctor_name}</td>
                  <td>{a.status}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>

      {/* PRESCRIPTIONS */}
      <section>
        <h2>Prescriptions</h2>
        <table>
          <tbody>
            {prescriptions.map((p, i) => (
              <tr key={i}>
                <td>{p.prescription_id}</td>
                <td>{p.medicine}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* BILLS */}
      <section>
        <h2>Bills</h2>
        <table>
          <tbody>
            {bills.map((b, i) => (
              <tr key={i}>
                <td>{b.bill_id}</td>
                <td>{b.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* PHARMACY */}
      <section>
        <h2>Pharmacy</h2>
        <table>
          <tbody>
            {pharmacy.map((p, i) => (
              <tr key={i}>
                <td>{p.medicine}</td>
                <td>{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* RECEPTION */}
      <section>
        <h2>Reception</h2>
        <table>
          <tbody>
            {reception.map((r, i) => (
              <tr key={i}>
                <td>{r.name}</td>
                <td>{r.appointment_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* DOCTOR REPORT */}
      <section>
        <h2>Doctor Report</h2>
        <table>
          <tbody>
            {doctorReport.map((d, i) => (
              <tr key={i}>
                <td>{d.doctor_name}</td>
                <td>{d.total_appointments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

    </div>
  );
}

export default Views;