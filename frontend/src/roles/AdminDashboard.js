import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api';

export default function AdminDashboard() {

    const [stats, setStats] = useState({
        patients: 0,
        doctors: 0,
        medicines: 0,
        appointments: 0
    });

    const [users, setUsers] = useState([]);

    const [form, setForm] = useState({
        username: '',
        password: '',
        role_id: ''
    });

    const [roles] = useState([
        { role_id: 1, role_name: 'Admin' },
        { role_id: 2, role_name: 'Doctor' },
        { role_id: 3, role_name: 'Pharmacist' },
        { role_id: 4, role_name: 'Receptionist' },
        { role_id: 5, role_name: 'Patient' }
    ]);

    const [message, setMessage] = useState('');

    useEffect(() => {
        loadStats();
        loadUsers();
    }, []);

    async function loadStats() {
        try {
            const [p, d, m, a] = await Promise.all([
                fetch(`${API_URL}/patients`),
                fetch(`${API_URL}/doctors`),
                fetch(`${API_URL}/medicines`),
                fetch(`${API_URL}/appointments`)
            ]);

            const patients = await p.json();
            const doctors = await d.json();
            const medicines = await m.json();
            const appointments = await a.json();

            setStats({
                patients: patients.length,
                doctors: doctors.length,
                medicines: medicines.length,
                appointments: appointments.length
            });

        } catch (err) {
            console.log(err);
        }
    }

    async function loadUsers() {
        try {
            const res = await fetch(`${API_URL}/users`);
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.log(err);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const res = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                setMessage('User created successfully ✅');
                setForm({ username: '', password: '', role_id: '' });
                loadUsers();
            } else {
                setMessage('Failed to create user ❌');
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
                    background: 'linear-gradient(to right, #0f766e, #0284c7)',
                    borderRadius: '22px',
                    padding: '35px',
                    color: 'white',
                    marginBottom: '30px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}
            >
                <h1
                    style={{
                        margin: 0,
                        fontSize: '34px',
                        fontWeight: '700'
                    }}
                >
                    🛡 Admin Dashboard
                </h1>

                <p
                    style={{
                        marginTop: '10px',
                        opacity: 0.9,
                        fontSize: '16px'
                    }}
                >
                    Healthcare Management Analytics & User Control Center
                </p>
            </div>

            {/* STATS */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '20px',
                    marginBottom: '35px'
                }}
            >

                <div style={cardStyle}>
                    <h3 style={cardTitle}>👨‍⚕️ Doctors</h3>
                    <h1 style={cardNumber}>{stats.doctors}</h1>
                </div>

                <div style={cardStyle}>
                    <h3 style={cardTitle}>🧑 Patients</h3>
                    <h1 style={cardNumber}>{stats.patients}</h1>
                </div>

                <div style={cardStyle}>
                    <h3 style={cardTitle}>💊 Medicines</h3>
                    <h1 style={cardNumber}>{stats.medicines}</h1>
                </div>

                <div style={cardStyle}>
                    <h3 style={cardTitle}>📅 Appointments</h3>
                    <h1 style={cardNumber}>{stats.appointments}</h1>
                </div>

            </div>

            {/* MAIN GRID */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.5fr',
                    gap: '25px'
                }}
            >

                {/* USER FORM */}
                <div
                    style={{
                        background: 'white',
                        borderRadius: '20px',
                        padding: '30px',
                        boxShadow: '0 5px 20px rgba(0,0,0,0.06)'
                    }}
                >

                    <h2
                        style={{
                            marginBottom: '25px',
                            color: '#0f172a'
                        }}
                    >
                        ➕ Create User
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '18px'
                        }}
                    >

                        <input
                            placeholder="Username"
                            value={form.username}
                            onChange={(e) =>
                                setForm({ ...form, username: e.target.value })
                            }
                            required
                            style={inputStyle}
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={(e) =>
                                setForm({ ...form, password: e.target.value })
                            }
                            required
                            style={inputStyle}
                        />

                        <select
                            value={form.role_id}
                            onChange={(e) =>
                                setForm({ ...form, role_id: e.target.value })
                            }
                            required
                            style={inputStyle}
                        >
                            <option value="">Select Role</option>

                            {roles.map((r) => (
                                <option key={r.role_id} value={r.role_id}>
                                    {r.role_name}
                                </option>
                            ))}

                        </select>

                        <button
                            type="submit"
                            style={{
                                padding: '15px',
                                border: 'none',
                                borderRadius: '12px',
                                background:
                                    'linear-gradient(to right, #0f766e, #0284c7)',
                                color: 'white',
                                fontSize: '16px',
                                fontWeight: '700',
                                cursor: 'pointer'
                            }}
                        >
                            Create User
                        </button>

                    </form>

                    {message && (
                        <div
                            style={{
                                marginTop: '20px',
                                padding: '12px',
                                borderRadius: '10px',
                                background: '#ecfeff',
                                color: '#0f766e',
                                fontWeight: '600',
                                textAlign: 'center'
                            }}
                        >
                            {message}
                        </div>
                    )}

                </div>

                {/* USER TABLE */}
                <div
                    style={{
                        background: 'white',
                        borderRadius: '20px',
                        padding: '30px',
                        boxShadow: '0 5px 20px rgba(0,0,0,0.06)'
                    }}
                >

                    <h2
                        style={{
                            marginBottom: '25px',
                            color: '#0f172a'
                        }}
                    >
                        👤 System Users
                    </h2>

                    <div style={{ overflowX: 'auto' }}>

                        <table
                            style={{
                                width: '100%',
                                borderCollapse: 'collapse'
                            }}
                        >

                            <thead>
                                <tr
                                    style={{
                                        background: '#f1f5f9'
                                    }}
                                >
                                    <th style={tableHead}>Username</th>
                                    <th style={tableHead}>Role</th>
                                </tr>
                            </thead>

                            <tbody>

                                {users.map((u, i) => (
                                    <tr
                                        key={i}
                                        style={{
                                            borderBottom:
                                                '1px solid #e2e8f0'
                                        }}
                                    >
                                        <td style={tableData}>
                                            {u.username}
                                        </td>

                                        <td style={tableData}>
                                            {u.role_name}
                                        </td>
                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>
    );
}

/* STYLES */

const cardStyle = {
    background: 'white',
    borderRadius: '18px',
    padding: '25px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.06)'
};

const cardTitle = {
    color: '#475569',
    marginBottom: '15px',
    fontSize: '17px'
};

const cardNumber = {
    color: '#0f172a',
    fontSize: '42px',
    margin: 0
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

const tableHead = {
    padding: '15px',
    textAlign: 'left',
    color: '#334155',
    fontSize: '15px'
};

const tableData = {
    padding: '16px',
    color: '#0f172a',
    fontSize: '15px'
};