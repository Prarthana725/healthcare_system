import { useEffect, useState } from "react";

function App() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  // Form states
  const [newPatient, setNewPatient] = useState({ name: "", age: "", phone: "" });
  const [newDoctor, setNewDoctor] = useState({ name: "", specialization: "" });
  const [newMedicine, setNewMedicine] = useState({ name: "", quantity: "" });
  const [newAppointment, setNewAppointment] = useState({ patient_id: "", doctor_id: "", date: "" });
  const [newPrescription, setNewPrescription] = useState({
    patient_id: "",
    doctor_id: "",
    date: "",
    details: [{ medicine_id: "", quantity: "" }]
  });

  // Status messages
  const [statusMessage, setStatusMessage] = useState("");

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

      // Check responses and parse JSON only if successful
      const patientsData = patientsRes.ok ? await patientsRes.json() : [];
      const doctorsData = doctorsRes.ok ? await doctorsRes.json() : [];
      const medicinesData = medicinesRes.ok ? await medicinesRes.json() : [];
      const appointmentsData = appointmentsRes.ok ? await appointmentsRes.json() : [];
      const prescriptionsData = prescriptionsRes.ok ? await prescriptionsRes.json() : [];

      // Ensure arrays are always arrays
      setPatients(Array.isArray(patientsData) ? patientsData : []);
      setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
      setMedicines(Array.isArray(medicinesData) ? medicinesData : []);
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      setPrescriptions(Array.isArray(prescriptionsData) ? prescriptionsData : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Set empty arrays on error
      setPatients([]);
      setDoctors([]);
      setMedicines([]);
      setAppointments([]);
      setPrescriptions([]);
    }
  };

  const showStatus = (message) => {
    setStatusMessage(message);
    setTimeout(() => setStatusMessage(""), 3000);
  };

  // Add Patient
  const addPatient = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPatient)
      });
      if (response.ok) {
        showStatus("Patient added successfully!");
        setNewPatient({ name: "", age: "", phone: "" });
        fetchData();
      }
    } catch (error) {
      showStatus("Error adding patient");
    }
  };

  // Add Doctor
  const addDoctor = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDoctor)
      });
      if (response.ok) {
        showStatus("Doctor added successfully!");
        setNewDoctor({ name: "", specialization: "" });
        fetchData();
      }
    } catch (error) {
      showStatus("Error adding doctor");
    }
  };

  // Add Medicine
  const addMedicine = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/medicines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newMedicine, quantity: parseInt(newMedicine.quantity) })
      });
      if (response.ok) {
        showStatus("Medicine added successfully!");
        setNewMedicine({ name: "", quantity: "" });
        fetchData();
      }
    } catch (error) {
      showStatus("Error adding medicine");
    }
  };

  // Book Appointment
  const bookAppointment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newAppointment,
          patient_id: parseInt(newAppointment.patient_id),
          doctor_id: parseInt(newAppointment.doctor_id)
        })
      });
      if (response.ok) {
        showStatus("Appointment booked successfully!");
        setNewAppointment({ patient_id: "", doctor_id: "", date: "" });
        fetchData();
      }
    } catch (error) {
      showStatus("Error booking appointment");
    }
  };

  // Add prescription detail
  const addPrescriptionDetail = () => {
    setNewPrescription({
      ...newPrescription,
      details: [...newPrescription.details, { medicine_id: "", quantity: "" }]
    });
  };

  // Update prescription detail
  const updatePrescriptionDetail = (index, field, value) => {
    const updatedDetails = [...newPrescription.details];
    updatedDetails[index][field] = value;
    setNewPrescription({ ...newPrescription, details: updatedDetails });
  };

  // Create Prescription
  const createPrescription = async (e) => {
    e.preventDefault();
    try {
      const prescriptionData = {
        ...newPrescription,
        patient_id: parseInt(newPrescription.patient_id),
        doctor_id: parseInt(newPrescription.doctor_id),
        details: newPrescription.details.map(d => ({
          medicine_id: parseInt(d.medicine_id),
          quantity: parseInt(d.quantity)
        })).filter(d => d.medicine_id && d.quantity > 0)
      };

      const response = await fetch("http://localhost:5000/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prescriptionData)
      });
      if (response.ok) {
        showStatus("Prescription created successfully!");
        setNewPrescription({
          patient_id: "",
          doctor_id: "",
          date: "",
          details: [{ medicine_id: "", quantity: "" }]
        });
        fetchData();
      }
    } catch (error) {
      showStatus("Error creating prescription");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Healthcare & Inventory Management System</h1>

      {statusMessage && (
        <div style={{
          padding: "10px",
          marginBottom: "20px",
          backgroundColor: "#d4edda",
          color: "#155724",
          border: "1px solid #c3e6cb",
          borderRadius: "4px"
        }}>
          {statusMessage}
        </div>
      )}

      {/* Add Patient Form */}
      <div style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ddd" }}>
        <h2>Add New Patient</h2>
        <form onSubmit={addPatient}>
          <input
            type="text"
            placeholder="Name"
            value={newPatient.name}
            onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
            required
            style={{ marginRight: "10px", padding: "5px" }}
          />
          <input
            type="number"
            placeholder="Age"
            value={newPatient.age}
            onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
            required
            style={{ marginRight: "10px", padding: "5px" }}
          />
          <input
            type="text"
            placeholder="Phone"
            value={newPatient.phone}
            onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
            required
            style={{ marginRight: "10px", padding: "5px" }}
          />
          <button type="submit" style={{ padding: "5px 10px" }}>Add Patient</button>
        </form>
      </div>

      {/* Add Doctor Form */}
      <div style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ddd" }}>
        <h2>Add New Doctor</h2>
        <form onSubmit={addDoctor}>
          <input
            type="text"
            placeholder="Name"
            value={newDoctor.name}
            onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
            required
            style={{ marginRight: "10px", padding: "5px" }}
          />
          <input
            type="text"
            placeholder="Specialization"
            value={newDoctor.specialization}
            onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
            required
            style={{ marginRight: "10px", padding: "5px" }}
          />
          <button type="submit" style={{ padding: "5px 10px" }}>Add Doctor</button>
        </form>
      </div>

      {/* Add Medicine Form */}
      <div style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ddd" }}>
        <h2>Add New Medicine</h2>
        <form onSubmit={addMedicine}>
          <input
            type="text"
            placeholder="Medicine Name"
            value={newMedicine.name}
            onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
            required
            style={{ marginRight: "10px", padding: "5px" }}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newMedicine.quantity}
            onChange={(e) => setNewMedicine({ ...newMedicine, quantity: e.target.value })}
            required
            style={{ marginRight: "10px", padding: "5px" }}
          />
          <button type="submit" style={{ padding: "5px 10px" }}>Add Medicine</button>
        </form>
      </div>

      {/* Book Appointment Form */}
      <div style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ddd" }}>
        <h2>Book Appointment</h2>
        <form onSubmit={bookAppointment}>
          <select
            value={newAppointment.patient_id}
            onChange={(e) => setNewAppointment({ ...newAppointment, patient_id: e.target.value })}
            required
            style={{ marginRight: "10px", padding: "5px" }}
          >
            <option value="">Select Patient</option>
            {Array.isArray(patients) && patients.map(p => (
              <option key={p.patient_id} value={p.patient_id}>{p.name}</option>
            ))}
          </select>
          <select
            value={newAppointment.doctor_id}
            onChange={(e) => setNewAppointment({ ...newAppointment, doctor_id: e.target.value })}
            required
            style={{ marginRight: "10px", padding: "5px" }}
          >
            <option value="">Select Doctor</option>
            {Array.isArray(doctors) && doctors.map(d => (
              <option key={d.doctor_id} value={d.doctor_id}>{d.name}</option>
            ))}
          </select>
          <input
            type="datetime-local"
            value={newAppointment.date}
            onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
            required
            style={{ marginRight: "10px", padding: "5px" }}
          />
          <button type="submit" style={{ padding: "5px 10px" }}>Book Appointment</button>
        </form>
      </div>

      {/* Create Prescription Form */}
      <div style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ddd" }}>
        <h2>Create Prescription</h2>
        <form onSubmit={createPrescription}>
          <div style={{ marginBottom: "10px" }}>
            <select
              value={newPrescription.patient_id}
              onChange={(e) => setNewPrescription({ ...newPrescription, patient_id: e.target.value })}
              required
              style={{ marginRight: "10px", padding: "5px" }}
            >
              <option value="">Select Patient</option>
              {Array.isArray(patients) && patients.map(p => (
                <option key={p.patient_id} value={p.patient_id}>{p.name}</option>
              ))}
            </select>
            <select
              value={newPrescription.doctor_id}
              onChange={(e) => setNewPrescription({ ...newPrescription, doctor_id: e.target.value })}
              required
              style={{ marginRight: "10px", padding: "5px" }}
            >
              <option value="">Select Doctor</option>
              {Array.isArray(doctors) && doctors.map(d => (
                <option key={d.doctor_id} value={d.doctor_id}>{d.name}</option>
              ))}
            </select>
            <input
              type="datetime-local"
              value={newPrescription.date}
              onChange={(e) => setNewPrescription({ ...newPrescription, date: e.target.value })}
              required
              style={{ marginRight: "10px", padding: "5px" }}
            />
          </div>

          <h3>Medicines:</h3>
          {newPrescription.details.map((detail, index) => (
            <div key={index} style={{ marginBottom: "5px" }}>
              <select
                value={detail.medicine_id}
                onChange={(e) => updatePrescriptionDetail(index, 'medicine_id', e.target.value)}
                required
                style={{ marginRight: "10px", padding: "5px" }}
              >
                <option value="">Select Medicine</option>
                {Array.isArray(medicines) && medicines.map(m => (
                  <option key={m.medicine_id} value={m.medicine_id}>{m.name}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Quantity"
                value={detail.quantity}
                onChange={(e) => updatePrescriptionDetail(index, 'quantity', e.target.value)}
                required
                min="1"
                style={{ marginRight: "10px", padding: "5px", width: "80px" }}
              />
            </div>
          ))}
          <button type="button" onClick={addPrescriptionDetail} style={{ marginRight: "10px", padding: "5px 10px" }}>
            Add Another Medicine
          </button>
          <button type="submit" style={{ padding: "5px 10px" }}>Create Prescription</button>
        </form>
      </div>

      {/* Display Data Sections */}
      <div style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ddd" }}>
        <h2>Patients ({Array.isArray(patients) ? patients.length : 0})</h2>
        <ul>
          {Array.isArray(patients) && patients.map(p => (
            <li key={p.patient_id}>{p.name} - Age: {p.age} - Phone: {p.phone}</li>
          ))}
        </ul>
      </div>

      <div style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ddd" }}>
        <h2>Doctors ({Array.isArray(doctors) ? doctors.length : 0})</h2>
        <ul>
          {Array.isArray(doctors) && doctors.map(d => (
            <li key={d.doctor_id}>{d.name} - {d.specialization}</li>
          ))}
        </ul>
      </div>

      <div style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ddd" }}>
        <h2>Medicines ({Array.isArray(medicines) ? medicines.length : 0})</h2>
        <ul>
          {Array.isArray(medicines) && medicines.map(m => (
            <li key={m.medicine_id}>{m.name} - Quantity: {m.quantity}</li>
          ))}
        </ul>
      </div>

      <div style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ddd" }}>
        <h2>Appointments ({Array.isArray(appointments) ? appointments.length : 0})</h2>
        <ul>
          {Array.isArray(appointments) && appointments.map((a, index) => (
            <li key={index}>
              {a.patient_name} with {a.doctor_name} - {new Date(a.date).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ddd" }}>
        <h2>Prescriptions ({Array.isArray(prescriptions) ? prescriptions.length : 0})</h2>
        <ul>
          {Array.isArray(prescriptions) && prescriptions.map(p => (
            <li key={p.prescription_id}>
              {p.patient_name} - Dr. {p.doctor_name} - {new Date(p.date).toLocaleDateString()}
              <ul>
                {p.details && Array.isArray(p.details) && p.details.map(d => (
                  <li key={d.id}>{d.medicine_name} - Qty: {d.quantity}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;