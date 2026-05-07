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
        <div className="page-content">

            <h1>🛡 Admin Dashboard</h1>
            <p>System control, analytics & user management</p>

            {/* STATS CARDS */}
            <div className="card-grid">

                <div className="card">
                    <h3>Patients</h3>
                    <h2>{stats.patients}</h2>
                </div>

                <div className="card">
                    <h3>Doctors</h3>
                    <h2>{stats.doctors}</h2>
                </div>

                <div className="card">
                    <h3>Medicines</h3>
                    <h2>{stats.medicines}</h2>
                </div>

                <div className="card">
                    <h3>Appointments</h3>
                    <h2>{stats.appointments}</h2>
                </div>

            </div>

            {/* USER CREATION */}
            <div className="form-panel">

                <h3>➕ Create System User</h3>

                <form onSubmit={handleSubmit}>

                    <input
                        placeholder="Username"
                        value={form.username}
                        onChange={(e) =>
                            setForm({ ...form, username: e.target.value })
                        }
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                        required
                    />

                    <select
                        value={form.role_id}
                        onChange={(e) =>
                            setForm({ ...form, role_id: e.target.value })
                        }
                        required
                    >
                        <option value="">Select Role</option>
                        {roles.map((r) => (
                            <option key={r.role_id} value={r.role_id}>
                                {r.role_name}
                            </option>
                        ))}
                    </select>

                    <button type="submit">
                        Create User
                    </button>

                </form>

                {message && <p className="small-note">{message}</p>}

            </div>

            {/* USERS TABLE */}
            <div className="table-panel">

                <h3>👤 System Users</h3>

                <table>

                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Role</th>
                        </tr>
                    </thead>

                    <tbody>

                        {users.map((u, i) => (
                            <tr key={i}>
                                <td>{u.username}</td>
                                <td>{u.role_name}</td>
                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}