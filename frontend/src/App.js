import { useEffect, useState } from "react";

function App() {
  const [medicines, setMedicines] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // medicines
    fetch("http://localhost:5000/medicines")
      .then(res => res.json())
      .then(data => setMedicines(data));

    // appointments
    fetch("http://localhost:5000/appointments")
      .then(res => res.json())
      .then(data => setAppointments(data));
  }, []);

  return (
    <div>
      <h1>Medicines</h1>
      <ul>
        {medicines.map(med => (
          <li key={med.medicine_id}>
            {med.name} - {med.quantity}
          </li>
        ))}
      </ul>

      <h1>Appointments</h1>
      <ul>
        {appointments.map((a, index) => (
          <li key={index}>
            {a.patient} - {a.doctor} - {a.date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;