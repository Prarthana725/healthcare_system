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

                setForm({
                    name: '',
                    age: '',
                    phone: ''
                });

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

                setAppointmentForm({
                    patient_id: '',
                    doctor_id: '',
                    date: ''
                });

                loadData();

            } else {
                setMessage('Failed to book appointment ❌');
            }

        } catch (err) {
            setMessage('Server error ❌');
        }
    }

    return (

        <div
            style={{
                minHeight: '100vh',
                background: '#f1f5f9',
                padding: '30px',
                fontFamily: "'Segoe UI', sans-serif"
            }}
        >

            {/* HEADER */}

            <div
                style={{
                    background:
                        'linear-gradient(to right, #0f766e, #0284c7)',
                    borderRadius: '24px',
                    padding: '35px',
                    color: 'white',
                    marginBottom: '30px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}
            >

                <h1
                    style={{
                        margin: 0,
                        fontSize: '34px'
                    }}
                >
                    🧑‍💼 Receptionist Dashboard
                </h1>

                <p
                    style={{
                        marginTop: '10px',
                        opacity: 0.9,
                        fontSize: '16px'
                    }}
                >
                    Patient registration & appointment scheduling system
                </p>

            </div>

            {/* MESSAGE */}

            {message && (

                <div
                    style={{
                        background: '#ecfeff',
                        color: '#0f766e',
                        padding: '14px',
                        borderRadius: '12px',
                        marginBottom: '25px',
                        fontWeight: '600',
                        textAlign: 'center'
                    }}
                >
                    {message}
                </div>

            )}

            {/* DASHBOARD STATS */}

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns:
                        'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '20px',
                    marginBottom: '30px'
                }}
            >

                <div style={cardStyle}>

                    <div style={cardTitle}>
                        👥 Total Patients
                    </div>

                    <div style={cardValue}>
                        {patients.length}
                    </div>

                </div>

                <div style={cardStyle}>

                    <div style={cardTitle}>
                        📅 Appointments
                    </div>

                    <div style={cardValue}>
                        {appointments.length}
                    </div>

                </div>

                <div style={cardStyle}>

                    <div style={cardTitle}>
                        👨‍⚕️ Doctors
                    </div>

                    <div style={cardValue}>
                        {doctors.length}
                    </div>

                </div>

            </div>

            {/* FORMS GRID */}

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '25px',
                    marginBottom: '30px'
                }}
            >

                {/* PATIENT REGISTRATION */}

                <div style={panelStyle}>

                    <h2 style={sectionTitle}>
                        ➕ Register New Patient
                    </h2>

                    <form
                        onSubmit={handlePatientSubmit}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '18px'
                        }}
                    >

                        <input
                            placeholder="Patient Name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    name: e.target.value
                                })
                            }
                            required
                            style={inputStyle}
                        />

                        <input
                            type="number"
                            placeholder="Age"
                            value={form.age}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    age: e.target.value
                                })
                            }
                            required
                            style={inputStyle}
                        />

                        <input
                            placeholder="Phone"
                            value={form.phone}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    phone: e.target.value
                                })
                            }
                            required
                            style={inputStyle}
                        />

                        <button
                            type="submit"
                            style={buttonStyle}
                        >
                            Register Patient
                        </button>

                    </form>

                </div>

                {/* APPOINTMENT BOOKING */}

                <div style={panelStyle}>

                    <h2 style={sectionTitle}>
                        📅 Book Appointment
                    </h2>

                    <form
                        onSubmit={handleAppointmentSubmit}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '18px'
                        }}
                    >

                        <select
                            value={appointmentForm.patient_id}
                            onChange={(e) =>
                                setAppointmentForm({
                                    ...appointmentForm,
                                    patient_id: e.target.value
                                })
                            }
                            required
                            style={inputStyle}
                        >

                            <option value="">
                                Select Patient
                            </option>

                            {patients.map((p) => (

                                <option
                                    key={p.patient_id}
                                    value={p.patient_id}
                                >
                                    {p.name}
                                </option>

                            ))}

                        </select>

                        <select
                            value={appointmentForm.doctor_id}
                            onChange={(e) =>
                                setAppointmentForm({
                                    ...appointmentForm,
                                    doctor_id: e.target.value
                                })
                            }
                            required
                            style={inputStyle}
                        >

                            <option value="">
                                Select Doctor
                            </option>

                            {doctors.map((d) => (

                                <option
                                    key={d.doctor_id}
                                    value={d.doctor_id}
                                >
                                    {d.name}
                                </option>

                            ))}

                        </select>

                        <input
                            type="date"
                            value={appointmentForm.date}
                            onChange={(e) =>
                                setAppointmentForm({
                                    ...appointmentForm,
                                    date: e.target.value
                                })
                            }
                            required
                            style={inputStyle}
                        />

                        <button
                            type="submit"
                            style={buttonStyle}
                        >
                            Book Appointment
                        </button>

                    </form>

                </div>

            </div>

            {/* PATIENT TABLE */}

            <div
                style={{
                    ...panelStyle,
                    marginBottom: '30px'
                }}
            >

                <h2 style={sectionTitle}>
                    👥 Recent Patients
                </h2>

                <div style={{ overflowX: 'auto' }}>

                    <table style={tableStyle}>

                        <thead>

                            <tr style={tableHeaderRow}>

                                <th style={tableHead}>
                                    Name
                                </th>

                                <th style={tableHead}>
                                    Age
                                </th>

                                <th style={tableHead}>
                                    Phone
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {patients.map((p) => (

                                <tr key={p.patient_id}>

                                    <td style={tableData}>
                                        {p.name}
                                    </td>

                                    <td style={tableData}>
                                        {p.age}
                                    </td>

                                    <td style={tableData}>
                                        {p.phone}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* APPOINTMENTS TABLE */}

            <div style={panelStyle}>

                <h2 style={sectionTitle}>
                    📋 All Appointments
                </h2>

                <div style={{ overflowX: 'auto' }}>

                    <table style={tableStyle}>

                        <thead>

                            <tr style={tableHeaderRow}>

                                <th style={tableHead}>
                                    Patient
                                </th>

                                <th style={tableHead}>
                                    Doctor
                                </th>

                                <th style={tableHead}>
                                    Date
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {appointments.map((a) => (

                                <tr key={a.appointment_id}>

                                    <td style={tableData}>
                                        {a.patient_name}
                                    </td>

                                    <td style={tableData}>
                                        {a.doctor_name}
                                    </td>

                                    <td style={tableData}>
                                        {a.date}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

/* STYLES */

const cardStyle = {
    background: 'white',
    borderRadius: '20px',
    padding: '25px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.06)'
};

const cardTitle = {
    color: '#64748b',
    fontSize: '16px',
    marginBottom: '15px'
};

const cardValue = {
    fontSize: '42px',
    fontWeight: '700',
    color: '#0f172a'
};

const panelStyle = {
    background: 'white',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.06)'
};

const sectionTitle = {
    marginBottom: '25px',
    color: '#0f172a'
};

const inputStyle = {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    background: '#f8fafc',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box'
};

const buttonStyle = {
    padding: '15px',
    border: 'none',
    borderRadius: '12px',
    background:
        'linear-gradient(to right, #0f766e, #0284c7)',
    color: 'white',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer'
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
};

const tableHeaderRow = {
    background: '#f1f5f9'
};

const tableHead = {
    padding: '16px',
    textAlign: 'left',
    color: '#334155',
    fontSize: '15px'
};

const tableData = {
    padding: '16px',
    borderBottom: '1px solid #e2e8f0',
    color: '#0f172a'
};