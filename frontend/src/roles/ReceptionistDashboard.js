import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api';

export default function ReceptionistDashboard() {
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const [form, setForm] = useState({
        name: '',
        age: '',
        phone: ''
    });

    const [appointmentForm, setAppointmentForm] = useState({
        patient_id: '',
        doctor_id: '',
        date: ''
    });

    const [message, setMessage] = useState('');

    // Load data
    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [pRes, aRes, dRes] = await Promise.all([
                fetch(`${API_URL}/patients`),
                fetch(`${API_URL}/appointments`),
                fetch(`${API_URL}/doctors`)
            ]);

            const pData = await pRes.json();
            const aData = await aRes.json();
            const dData = await dRes.json();

            setPatients(Array.isArray(pData) ? pData : []);
            setAppointments(Array.isArray(aData) ? aData : []);
            setDoctors(Array.isArray(dData) ? dData : []);
        } catch (err) {
            console.error('Load error:', err);
        }
    }

    // Register patient
    async function handlePatientSubmit(e) {
        e.preventDefault();

        try {
            const res = await fetch(`${API_URL}/patients`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                setMessage('Patient registered successfully ✅');
                setForm({ name: '', age: '', phone: '' });
                loadData();
            } else {
                setMessage('Failed to register patient ❌');
            }
        } catch (err) {
            setMessage('Server error ❌');
        }
    }

    // Book appointment
    async function handleAppointmentSubmit(e) {
        e.preventDefault();

        try {
            const res = await fetch(`${API_URL}/appointments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appointmentForm)
            });

            if (res.ok) {
                setMessage('Appointment booked successfully ✅');
                setAppointmentForm({ patient_id: '', doctor_id: '', date: '' });
                loadData();
            } else {
                setMessage('Failed to book appointment ❌');
            }
        } catch (err) {
            setMessage('Server error ❌');
        }
    }

    return (
        <div className="page-content">

            <h1>🧑‍💼 Receptionist Dashboard</h1>
            <p>Patient registration + Appointment scheduling module</p>

            {/* MESSAGE */}
            {message && <p className="small-note">{message}</p>}

            {/* ================= PATIENT REGISTRATION ================= */}
            <div className="form-panel">
                <h3>➕ Register New Patient</h3>

                <form onSubmit={handlePatientSubmit}>
                    <input
                        placeholder="Patient Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />

                    <input
                        type="number"
                        placeholder="Age"
                        value={form.age}
                        onChange={(e) => setForm({ ...form, age: e.target.value })}
                        required
                    />

                    <input
                        placeholder="Phone"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        required
                    />

                    <button type="submit">Register Patient</button>
                </form>
            </div>

            {/* ================= APPOINTMENT BOOKING ================= */}
            <div className="form-panel">
                <h3>📅 Book Appointment</h3>

                <form onSubmit={handleAppointmentSubmit}>
                    <select
                        value={appointmentForm.patient_id}
                        onChange={(e) =>
                            setAppointmentForm({ ...appointmentForm, patient_id: e.target.value })
                        }
                        required
                    >
                        <option value="">Select Patient</option>
                        {patients.map((p) => (
                            <option key={p.patient_id} value={p.patient_id}>
                                {p.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={appointmentForm.doctor_id}
                        onChange={(e) =>
                            setAppointmentForm({ ...appointmentForm, doctor_id: e.target.value })
                        }
                        required
                    >
                        <option value="">Select Doctor</option>
                        {doctors.map((d) => (
                            <option key={d.doctor_id} value={d.doctor_id}>
                                {d.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="date"
                        value={appointmentForm.date}
                        onChange={(e) =>
                            setAppointmentForm({ ...appointmentForm, date: e.target.value })
                        }
                        required
                    />

                    <button type="submit">Book Appointment</button>
                </form>
            </div>

            {/* ================= PATIENT TABLE ================= */}
            <div className="table-panel">
                <h3>👥 Recent Patients</h3>

                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((p) => (
                            <tr key={p.patient_id}>
                                <td>{p.name}</td>
                                <td>{p.age}</td>
                                <td>{p.phone}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ================= APPOINTMENTS TABLE ================= */}
            <div className="table-panel">
                <h3>📋 All Appointments</h3>

                <table>
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((a) => (
                            <tr key={a.appointment_id}>
                                <td>{a.patient_name}</td>
                                <td>{a.doctor_name}</td>
                                <td>{a.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}