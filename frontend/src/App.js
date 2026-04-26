import { useEffect, useState } from "react";

function App() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [patientsRes, doctorsRes, medicinesRes, appointmentsRes, prescriptionsRes] = await Promise.all([
        fetch("http://localhost:5000/api/patients"),
        fetch("http://localhost:5000/api/doctors"),
        fetch("http://localhost:5000/api/medicines"),
        fetch("http://localhost:5000/api/appointments"),
        fetch("http://localhost:5000/api/prescriptions")
      ]);

      setPatients(await patientsRes.json());
      setDoctors(await doctorsRes.json());
      setMedicines(await medicinesRes.json());
      setAppointments(await appointmentsRes.json());
      setPrescriptions(await prescriptionsRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Healthcare & Inventory Management System</h1>

      <h2>Patients</h2>
      <ul>
        {patients.map(p => (
          <li key={p.patient_id}>{p.name} - Age: {p.age} - Phone: {p.phone}</li>
        ))}
      </ul>

      <h2>Doctors</h2>
      <ul>
        {doctors.map(d => (
          <li key={d.doctor_id}>{d.name} - {d.specialization}</li>
        ))}
      </ul>

      <h2>Medicines</h2>
      <ul>
        {medicines.map(m => (
          <li key={m.medicine_id}>{m.name} - Quantity: {m.quantity}</li>
        ))}
      </ul>

      <h2>Appointments</h2>
      <ul>
        {appointments.map((a, index) => (
          <li key={index}>{a.patient} - {a.doctor} - {a.date}</li>
        ))}
      </ul>

      <h2>Prescriptions</h2>
      <ul>
        {prescriptions.map(p => (
          <li key={p.prescription_id}>
            Prescription ID: {p.prescription_id} - Date: {p.date}
            <ul>
              {p.details.map(d => (
                <li key={d.id}>{d.medicine_name} - Qty: {d.quantity}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;