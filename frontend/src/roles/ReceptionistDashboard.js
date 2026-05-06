import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api';

export default function ReceptionistDashboard() {
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [form, setForm] = useState({
        name: '',
        age: '',
        phone: ''
    });
    const [message, setMessage] = useState('');

    // Load data
    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [pRes, aRes] = await Promise.all([
                fetch(`${API_URL}/patients`),
                fetch(`${API_URL}/appointments`)
            ]);

            const pData = await pRes.json();
            const aData = await aRes.json();

            setPatients(Array.isArray(pData) ? pData : []);
            setAppointments(Array.isArray(aData) ? aData : []);
        } catch (err) {
            console.error(err);
        }
    }

    // Register patient
    async function handleSubmit(e) {
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

    return (
        <div className="page-content">

            <h1>🕒 Receptionist Dashboard</h1>
            <p>Patient registration & appointment scheduling system</p>

            {/* REGISTER PATIENT */}
            <div className="form-panel">
                <h3>Register New Patient</h3>

                <form onSubmit={handleSubmit}>
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

                    <button type="submit">Register</button>
                </form>

                {message && <p className="small-note">{message}</p>}
            </div>

            {/* PATIENT LIST */}
            <div className="table-panel">
                <h3>Recent Patients</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Phone</th>
                        </tr>
                    </thead>
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
            </div>

            {/* APPOINTMENTS */}
            <div className="table-panel">
                <h3>Today's Appointments</h3>

                <table>
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((a, i) => (
                            <tr key={i}>
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