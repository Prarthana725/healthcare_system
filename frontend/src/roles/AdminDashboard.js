import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const roles = [
    { role_id: 1, role_name: 'Admin' },
    { role_id: 2, role_name: 'Doctor' },
    { role_id: 3, role_name: 'Pharmacist' },
    { role_id: 4, role_name: 'Receptionist' },
    { role_id: 5, role_name: 'Patient' }
];

const specializations = [
    'Cardiologist', 'Neurologist', 'Pediatrician', 'General Surgeon', 'Orthopedist', 'Psychiatrist', 'Dermatologist'
];

const medCategories = [
    'Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Drops', 'Inhaler'
];

const roleBadgeStyle = {
    Admin:        { background: '#fee2e2', color: '#991b1b' },
    Doctor:       { background: '#dbeafe', color: '#1e40af' },
    Pharmacist:   { background: '#fef3c7', color: '#92400e' },
    Receptionist: { background: '#ede9fe', color: '#5b21b6' },
    Patient:      { background: '#dcfce7', color: '#166534' },
};

const navItems = [
    { icon: '👥', label: 'Users' },
    { icon: '🩺', label: 'Doctors' },
    { icon: '🧑', label: 'Patients' },
    { icon: '💊', label: 'Pharmacy' },
    { icon: '📅', label: 'Appointments' },
];

export default function AdminDashboard() {
    const navigate = useNavigate();
    
    // UPDATED: Stats state now includes the System Overview fields
    const [stats, setStats] = useState({ 
    patients: 0, doctors: 0, medicines: 0, appointments: 0,
    totalUsers: 0, activeUsers: 0, loginsToday: 0, totalActivities: 0 
});
    
    // UI State
    const [activeNav, setActiveNav] = useState('Dashboard');
    const [showPass, setShowPass] = useState(false);

    // Form States
    const [form, setForm] = useState({ username: '', password: '', role_id: '' });
    const [docForm, setDocForm] = useState({ name: '', specialization: '', user_id: '' });
    const [patForm, setPatForm] = useState({ name: '', age: '', phone: '', user_id: '' });
    const [pharmForm, setPharmForm] = useState({ name: '', category: '', quantity: '', price: '' });
    const [apptForm, setApptForm] = useState({ patient_id: '', doctor_id: '', date: '', time: '', status: 'Scheduled' });

    // Message States
    const [message, setMessage] = useState('');
    const [docMessage, setDocMessage] = useState('');
    const [patMessage, setPatMessage] = useState('');
    const [pharmMessage, setPharmMessage] = useState('');
    const [apptMessage, setApptMessage] = useState('');

    // List States
    const [users, setUsers] = useState([]);
    const [doctorsList, setDoctorsList] = useState([]);
    const [patientsList, setPatientsList] = useState([]);
    const [pharmacyList, setPharmacyList] = useState([]);
    const [appointmentsList, setAppointmentsList] = useState([]);

    // --- PAGE LOAD TRIGGER ---
    useEffect(() => {
        loadStats();
        loadUsers();
        loadDoctors();
        loadPatients();
        loadPharmacy();
        loadAppointments();
    }, []);

    async function loadStats() {
    try {
        const res = await fetch(`${API_URL}/hospital-stats`);
        if (res.ok) {
            const data = await res.json();
            // This ensures both the top 4 cards and bottom 4 bar items update
            setStats(data); 
        }
    } catch (err) { 
        console.error("Failed to load stats:", err); 
    }
}

    async function loadUsers() {
        try {
            const res = await fetch(`${API_URL}/users`);
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) { console.error("Failed to load users:", err); }
    }

    async function loadDoctors() {
        try {
            const res = await fetch(`${API_URL}/doctors`);
            const data = await res.json();
            setDoctorsList(Array.isArray(data) ? data : []);
        } catch (err) { console.error("Failed to load doctors:", err); }
    }

    async function loadPatients() {
        try {
            const res = await fetch(`${API_URL}/patients`);
            const data = await res.json();
            setPatientsList(Array.isArray(data) ? data : []);
        } catch (err) { console.error("Failed to load patients:", err); }
    }

    async function loadPharmacy() {
        try {
            const res = await fetch(`${API_URL}/medicines`);
            const data = await res.json();
            setPharmacyList(Array.isArray(data) ? data : []);
        } catch (err) { console.error("Failed to load medicines:", err); }
    }

    async function loadAppointments() {
        try {
            const res = await fetch(`${API_URL}/appointments`);
            const data = await res.json();
            setAppointmentsList(Array.isArray(data) ? data : []);
        } catch (err) { console.error("Failed to load appointments:", err); }
    }

    async function handleUserSubmit(e) {
    e.preventDefault();
    try {
        const res = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        if (res.ok) {
            setMessage('success');
            setForm({ username: '', password: '', role_id: '' });
            loadUsers(); // Refreshes the table
            loadStats(); // <--- ADD THIS: Refreshes the Top Cards and Bottom Bar
        } else { setMessage('error'); }
    } catch { setMessage('error'); }
    setTimeout(() => setMessage(''), 3000);
}

    async function handleDoctorSubmit(e) {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/doctors`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(docForm),
            });
            if (res.ok) {
                setDocMessage('success');
                setDocForm({ name: '', specialization: '', user_id: '' });
                loadStats();
                loadDoctors();
            } else { setDocMessage('error'); }
        } catch { setDocMessage('error'); }
        setTimeout(() => setDocMessage(''), 3000);
    }

    async function handlePatientSubmit(e) {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/patients`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patForm),
            });
            if (res.ok) {
                setPatMessage('success');
                setPatForm({ name: '', age: '', phone: '', user_id: '' });
                loadStats();
                loadPatients();
            } else { setPatMessage('error'); }
        } catch { setPatMessage('error'); }
        setTimeout(() => setPatMessage(''), 3000);
    }

    async function handlePharmacySubmit(e) {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/medicines`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pharmForm),
            });
            if (res.ok) {
                setPharmMessage('success');
                setPharmForm({ name: '', category: '', quantity: '', price: '' });
                loadStats();
                loadPharmacy();
            } else { setPharmMessage('error'); }
        } catch { setPharmMessage('error'); }
        setTimeout(() => setPharmMessage(''), 3000);
    }

    async function handleAppointmentSubmit(e) {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/appointments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(apptForm),
            });
            if (res.ok) {
                setApptMessage('success');
                setApptForm({ patient_id: '', doctor_id: '', date: '', time: '', status: 'Scheduled' });
                loadStats();
                loadAppointments();
            } else { setApptMessage('error'); }
        } catch { setApptMessage('error'); }
        setTimeout(() => setApptMessage(''), 3000);
    }

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const statCards = [
        { label: 'Total Doctors', value: stats.doctors, icon: '🩺', trend: '5%' },
        { label: 'Total Patients', value: stats.patients, icon: '🧑', trend: '25%' },
        { label: 'Total Medicines', value: stats.medicines, icon: '💊', trend: '0%' },
        { label: "Today's Appointments", value: stats.appointments, icon: '📅', trend: '12%' },
    ];

    // --- DYNAMIC CONTENT RENDERER ---
    const renderMainContent = () => {
        if (activeNav === 'Dashboard' || activeNav === 'Users') {
            return (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: 28, marginBottom: 40 }}>
                    <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                            <div style={{ width: 46, height: 46, borderRadius: 12, background: '#f0fdfa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>👤</div>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: 18, color: '#0f172a' }}>Create User</div>
                                <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Add a new user to the system</div>
                            </div>
                        </div>
                        <form onSubmit={handleUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div>
                                <label style={labelSt}>Username</label>
                                <input placeholder="Enter username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required style={inputSt} />
                            </div>
                            <div>
                                <label style={labelSt}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input type={showPass ? 'text' : 'password'} placeholder="Enter password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={{ ...inputSt, paddingRight: 46 }} />
                                    <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#64748b' }}>
                                        {showPass ? '🙈' : '👁'}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label style={labelSt}>Select Role</label>
                                <select value={form.role_id} onChange={e => setForm({ ...form, role_id: e.target.value })} required style={inputSt}>
                                    <option value="">Choose a role</option>
                                    {roles.map(r => <option key={r.role_id} value={r.role_id}>{r.role_name}</option>)}
                                </select>
                            </div>
                            <button type="submit" style={btnStyle}>👤 Create User</button>
                        </form>
                        {message && (
                            <div style={message === 'success' ? msgSuccess : msgError}>
                                {message === 'success' ? '✅ User created successfully' : '❌ Failed to create user'}
                            </div>
                        )}
                    </div>

                    <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{ width: 46, height: 46, borderRadius: 12, background: '#f0fdfa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>👥</div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: 18, color: '#0f172a' }}>System Users</div>
                                    <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>Manage all system users</div>
                                </div>
                            </div>
                            <button style={viewAllBtn}>View All Users ›</button>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                                        {['Username', 'Role', 'Status', 'Last Login', 'Actions'].map(h => <th key={h} style={thSt}>{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                                            <td style={tdSt}>{u.username}</td>
                                            <td style={tdSt}>
                                                <span style={{ padding: '5px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700, ...(roleBadgeStyle[u.role_name] || { background: '#f1f5f9', color: '#475569' }) }}>
                                                    {u.role_name}
                                                </span>
                                            </td>
                                            <td style={tdSt}><span style={statusActive}>Active</span></td>
                                            <td style={{ ...tdSt, color: '#64748b' }}>{u.lastLogin || '—'}</td>
                                            <td style={tdSt}><button style={actionBtn}>⋮</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        }

        if (activeNav === 'Doctors') {
            return (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: 28, marginBottom: 40 }}>
                    <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                            <div style={{ width: 46, height: 46, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🩺</div>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: 18, color: '#0f172a' }}>Register Doctor</div>
                                <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Add a medical professional</div>
                            </div>
                        </div>
                        <form onSubmit={handleDoctorSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div>
                                <label style={labelSt}>Doctor's Full Name</label>
                                <input placeholder="e.g. Dr. Sarah Smith" value={docForm.name} onChange={e => setDocForm({ ...docForm, name: e.target.value })} required style={inputSt} />
                            </div>
                            <div>
                                <label style={labelSt}>Specialization</label>
                                <select value={docForm.specialization} onChange={e => setDocForm({ ...docForm, specialization: e.target.value })} required style={inputSt}>
                                    <option value="">Select Specialization</option>
                                    {specializations.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={labelSt}>Link User Account (Optional)</label>
                                <select value={docForm.user_id} onChange={e => setDocForm({ ...docForm, user_id: e.target.value })} style={inputSt}>
                                    <option value="">Select an existing user</option>
                                    {users.filter(u => u.role_name === 'Doctor').map(u => (
                                        <option key={u.username} value={u.username}>{u.username}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" style={{...btnStyle, background: 'linear-gradient(to right, #2563eb, #3b82f6)'}}>🩺 Add Doctor</button>
                        </form>
                        {docMessage && (
                            <div style={docMessage === 'success' ? msgSuccess : msgError}>
                                {docMessage === 'success' ? '✅ Doctor registered successfully' : '❌ Failed to register'}
                            </div>
                        )}
                    </div>

                    <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{ width: 46, height: 46, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📋</div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: 18, color: '#0f172a' }}>Doctors Directory</div>
                                    <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>Manage medical staff records</div>
                                </div>
                            </div>
                            <button style={viewAllBtn}>View All Doctors ›</button>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                                        {['Doctor Name', 'Specialty', 'Linked Account', 'Status', 'Actions'].map(h => <th key={h} style={thSt}>{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {doctorsList.map((d, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                                            <td style={{...tdSt, fontWeight: 700}}>{d.name}</td>
                                            <td style={tdSt}>
                                                <span style={{ padding: '5px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
                                                    {d.specialization}
                                                </span>
                                            </td>
                                            <td style={{ ...tdSt, color: '#64748b' }}>{d.user_id || 'Not Linked'}</td>
                                            <td style={tdSt}><span style={statusActive}>Available</span></td>
                                            <td style={tdSt}><button style={actionBtn}>⋮</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        }

        if (activeNav === 'Patients') {
            return (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: 28, marginBottom: 40 }}>
                    <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                            <div style={{ width: 46, height: 46, borderRadius: 12, background: '#fdf4ff', color: '#c026d3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🧑</div>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: 18, color: '#0f172a' }}>Register Patient</div>
                                <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Add a new patient record</div>
                            </div>
                        </div>
                        <form onSubmit={handlePatientSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div>
                                <label style={labelSt}>Patient Full Name</label>
                                <input placeholder="e.g. John Doe" value={patForm.name} onChange={e => setPatForm({ ...patForm, name: e.target.value })} required style={inputSt} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
                                <div>
                                    <label style={labelSt}>Age</label>
                                    <input type="number" placeholder="Years" value={patForm.age} onChange={e => setPatForm({ ...patForm, age: e.target.value })} required style={inputSt} />
                                </div>
                                <div>
                                    <label style={labelSt}>Contact Phone</label>
                                    <input type="tel" placeholder="e.g. 555-0198" value={patForm.phone} onChange={e => setPatForm({ ...patForm, phone: e.target.value })} required style={inputSt} />
                                </div>
                            </div>
                            <div>
                                <label style={labelSt}>Link User Account (Optional)</label>
                                <select value={patForm.user_id} onChange={e => setPatForm({ ...patForm, user_id: e.target.value })} style={inputSt}>
                                    <option value="">Select an existing user</option>
                                    {users.filter(u => u.role_name === 'Patient').map(u => (
                                        <option key={u.username} value={u.username}>{u.username}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" style={{...btnStyle, background: 'linear-gradient(to right, #a21caf, #d946ef)'}}>🧑 Add Patient</button>
                        </form>
                        {patMessage && (
                            <div style={patMessage === 'success' ? msgSuccess : msgError}>
                                {patMessage === 'success' ? '✅ Patient registered successfully' : '❌ Failed to register'}
                            </div>
                        )}
                    </div>

                    <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{ width: 46, height: 46, borderRadius: 12, background: '#fdf4ff', color: '#c026d3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🗂️</div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: 18, color: '#0f172a' }}>Patients Directory</div>
                                    <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>Manage registered patients</div>
                                </div>
                            </div>
                            <button style={viewAllBtn}>View All Patients ›</button>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                                        {['Patient Name', 'Age', 'Contact Info', 'Linked Account', 'Actions'].map(h => <th key={h} style={thSt}>{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {patientsList.map((p, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                                            <td style={{...tdSt, fontWeight: 700}}>{p.name}</td>
                                            <td style={tdSt}>
                                                <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 13, fontWeight: 600, background: '#f1f5f9', color: '#64748b' }}>
                                                    {p.age} yrs
                                                </span>
                                            </td>
                                            <td style={{ ...tdSt, color: '#475569' }}>📞 {p.phone}</td>
                                            <td style={{ ...tdSt, color: '#64748b' }}>{p.user_id || 'Not Linked'}</td>
                                            <td style={tdSt}><button style={actionBtn}>⋮</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        }

        if (activeNav === 'Pharmacy') {
            return (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: 28, marginBottom: 40 }}>
                    <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                            <div style={{ width: 46, height: 46, borderRadius: 12, background: '#ffedd5', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>💊</div>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: 18, color: '#0f172a' }}>Add Medicine</div>
                                <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Enter new stock to inventory</div>
                            </div>
                        </div>
                        <form onSubmit={handlePharmacySubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div>
                                <label style={labelSt}>Medicine Name</label>
                                <input placeholder="e.g. Amoxicillin 500mg" value={pharmForm.name} onChange={e => setPharmForm({ ...pharmForm, name: e.target.value })} required style={inputSt} />
                            </div>
                            <div>
                                <label style={labelSt}>Category</label>
                                <select value={pharmForm.category} onChange={e => setPharmForm({ ...pharmForm, category: e.target.value })} required style={inputSt}>
                                    <option value="">Select Category</option>
                                    {medCategories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div>
                                    <label style={labelSt}>Stock Quantity</label>
                                    <input type="number" placeholder="Units" value={pharmForm.quantity} onChange={e => setPharmForm({ ...pharmForm, quantity: e.target.value })} required style={inputSt} />
                                </div>
                                <div>
                                    <label style={labelSt}>Unit Price (Rs)</label>
                                    <input type="number" step="0.01" placeholder="0.00" value={pharmForm.price} onChange={e => setPharmForm({ ...pharmForm, price: e.target.value })} required style={inputSt} />
                                </div>
                            </div>
                            <button type="submit" style={{...btnStyle, background: 'linear-gradient(to right, #ea580c, #f97316)'}}>💊 Add Medicine</button>
                        </form>
                        {pharmMessage && (
                            <div style={pharmMessage === 'success' ? msgSuccess : msgError}>
                                {pharmMessage === 'success' ? '✅ Medicine added successfully' : '❌ Failed to add medicine'}
                            </div>
                        )}
                    </div>

                    <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{ width: 46, height: 46, borderRadius: 12, background: '#ffedd5', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📦</div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: 18, color: '#0f172a' }}>Pharmacy Inventory</div>
                                    <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>Manage medical stock & pricing</div>
                                </div>
                            </div>
                            <button style={viewAllBtn}>View Full Inventory ›</button>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                                        {['Medicine Name', 'Category', 'Stock Level', 'Price', 'Status', 'Actions'].map(h => <th key={h} style={thSt}>{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {pharmacyList.map((m, i) => {
                                        const qty = parseInt(m.quantity);
                                        let statBadge = statusActive; 
                                        let statText = "In Stock";
                                        if (qty === 0) {
                                            statBadge = statusDanger;
                                            statText = "Out of Stock";
                                        } else if (qty < 20) {
                                            statBadge = statusWarning;
                                            statText = "Low Stock";
                                        }

                                        return (
                                            <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                                                <td style={{...tdSt, fontWeight: 700}}>{m.name}</td>
                                                <td style={tdSt}>
                                                    <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 13, fontWeight: 600, background: '#f1f5f9', color: '#64748b' }}>
                                                        {m.category}
                                                    </span>
                                                </td>
                                                <td style={{ ...tdSt, fontWeight: 600 }}>{m.quantity} Units</td>
                                                <td style={{ ...tdSt, color: '#475569' }}>Rs {parseFloat(m.price).toFixed(2)}</td>
                                                <td style={tdSt}><span style={statBadge}>{statText}</span></td>
                                                <td style={tdSt}><button style={actionBtn}>⋮</button></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        }

        if (activeNav === 'Appointments') {
            return (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: 28, marginBottom: 40 }}>
                    <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                            <div style={{ width: 46, height: 46, borderRadius: 12, background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📅</div>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: 18, color: '#0f172a' }}>Schedule Visit</div>
                                <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Book a new appointment</div>
                            </div>
                        </div>
                        <form onSubmit={handleAppointmentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div>
                                <label style={labelSt}>Select Patient</label>
                                <select value={apptForm.patient_id} onChange={e => setApptForm({ ...apptForm, patient_id: e.target.value })} required style={inputSt}>
                                    <option value="">Choose Patient</option>
                                    {/* FIX: Use ID as value so SQL doesn't crash */}
                                    {patientsList.map(p => (
                                        <option key={p.patient_id || p.id} value={p.patient_id || p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={labelSt}>Select Doctor</label>
                                <select value={apptForm.doctor_id} onChange={e => setApptForm({ ...apptForm, doctor_id: e.target.value })} required style={inputSt}>
                                    <option value="">Choose Doctor</option>
                                    {/* FIX: Use ID as value so SQL doesn't crash */}
                                    {doctorsList.map(d => (
                                        <option key={d.doctor_id || d.id} value={d.doctor_id || d.id}>
                                            {d.name} ({d.specialization})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div>
                                    <label style={labelSt}>Date</label>
                                    <input type="date" value={apptForm.date} onChange={e => setApptForm({ ...apptForm, date: e.target.value })} required style={inputSt} />
                                </div>
                                <div>
                                    <label style={labelSt}>Time</label>
                                    <input type="time" value={apptForm.time} onChange={e => setApptForm({ ...apptForm, time: e.target.value })} required style={inputSt} />
                                </div>
                            </div>
                            <button type="submit" style={{...btnStyle, background: 'linear-gradient(to right, #7c3aed, #a855f7)'}}>📅 Schedule Appointment</button>
                        </form>
                        {apptMessage && (
                            <div style={apptMessage === 'success' ? msgSuccess : msgError}>
                                {apptMessage === 'success' ? '✅ Appointment scheduled' : '❌ Scheduling failed'}
                            </div>
                        )}
                    </div>

                    <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{ width: 46, height: 46, borderRadius: 12, background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📋</div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: 18, color: '#0f172a' }}>Master Schedule</div>
                                    <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>Manage today's hospital visits</div>
                                </div>
                            </div>
                            <button style={viewAllBtn}>View Full Schedule ›</button>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                                        {['Patient ID', 'Assigned Doctor ID', 'Date', 'Time', 'Status', 'Actions'].map(h => <th key={h} style={thSt}>{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointmentsList.map((a, i) => {
                                        let statBadge;
                                        if (a.status === 'Completed') statBadge = statusActive;
                                        else if (a.status === 'Pending' || a.status === 'Scheduled') statBadge = statusWarning;
                                        else if (a.status === 'Cancelled') statBadge = statusDanger;
                                        else statBadge = statusActive;

                                        return (
                                            <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                                                <td style={{...tdSt, fontWeight: 700}}>{a.patient_id}</td>
                                                <td style={tdSt}>
                                                    <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 13, fontWeight: 600, background: '#f1f5f9', color: '#64748b' }}>
                                                        {a.doctor_id}
                                                    </span>
                                                </td>
                                                <td style={{ ...tdSt, color: '#475569', fontSize: 14 }}>{a.date}</td>
                                                <td style={{ ...tdSt, color: '#0f172a', fontWeight: 600 }}>{a.time}</td>
                                                <td style={tdSt}><span style={statBadge}>{a.status}</span></td>
                                                <td style={tdSt}><button style={actionBtn}>⋮</button></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif", background: '#f8fafc' }}>
            <aside style={{ width: 250, background: '#0d1f2d', color: 'white', display: 'flex', flexDirection: 'column', padding: '28px 0', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>
                <div style={{ padding: '0 24px 32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 42, height: 42, borderRadius: 10, background: 'linear-gradient(135deg, #0d9488, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🏥</div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>Health Care Hospital</div>
                            <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>Integrated Management</div>
                        </div>
                    </div>
                </div>

                <div style={{ padding: '0 16px', marginBottom: 12 }}>
                    <div onClick={() => setActiveNav('Dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, background: activeNav === 'Dashboard' ? 'linear-gradient(135deg, #0d9488, #0284c7)' : 'transparent', color: activeNav === 'Dashboard' ? 'white' : 'rgba(255,255,255,0.7)', cursor: 'pointer', fontWeight: 600, fontSize: 15, transition: 'all 0.2s' }}>
                        <span style={{ fontSize: 18 }}>📊</span> Dashboard
                    </div>
                </div>

                <div style={{ padding: '20px 28px 10px', fontSize: 12, letterSpacing: '0.1em', opacity: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>Management</div>

                <nav style={{ flex: 1, padding: '0 16px' }}>
                    {navItems.map(({ icon, label }) => (
                        <div key={label} onClick={() => setActiveNav(label)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 15, marginBottom: 4, fontWeight: 500, background: activeNav === label ? 'rgba(255,255,255,0.08)' : 'transparent', color: activeNav === label ? 'white' : 'rgba(255,255,255,0.7)', transition: 'all 0.15s' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ fontSize: 18 }}>{icon}</span>{label}</span>
                            <span style={{ opacity: 0.4, fontSize: 14 }}>›</span>
                        </div>
                    ))}
                </nav>

                <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                        <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>👤</div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: 15 }}>Admin</div>
                            <div style={{ fontSize: 12, opacity: 0.6, marginTop: 2 }}>Super Administrator</div>
                        </div>
                    </div>
                    <button onClick={() => navigate('/')} style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: '0.2s' }}>
                        🚪 Log Out
                    </button>
                </div>
            </aside>

            <main style={{ flex: 1, padding: '40px 48px', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36 }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: '#0f172a' }}>Welcome Back, Admin 👋</h1>
                        <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: 16 }}>Here's what's happening in your hospital today.</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 20px', fontSize: 15, fontWeight: 500, color: '#475569', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                        📅 <span>{today}</span>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 36 }}>
                    {statCards.map(({ label, value, icon, trend }) => (
                        <div key={label} style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 42, height: 42, borderRadius: 10, background: '#f0fdfa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{icon}</div>
                                    <span style={{ fontSize: 15, fontWeight: 600, color: '#64748b' }}>{label}</span>
                                </div>
                                <span style={{ fontSize: 13, fontWeight: 700, color: '#10b981', background: '#ecfdf5', borderRadius: 20, padding: '4px 10px' }}>↑ {trend}</span>
                            </div>
                            <div style={{ fontSize: 40, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{value}</div>
                            <div style={{ marginTop: 14, fontSize: 14, fontWeight: 500, color: '#0284c7', cursor: 'pointer' }}>View all {label.toLowerCase().replace("today's ", "")} ›</div>
                        </div>
                    ))}
                </div>

                {renderMainContent()}

                {/* UPDATED: System Overview bar now uses dynamic stats from your DB */}
                <div style={{ marginTop: 'auto', background: '#0d1f2d', borderRadius: 20, padding: '30px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white', flexWrap: 'wrap', gap: '24px', boxShadow: '0 10px 25px rgba(13,31,45,0.15)' }}>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: 18 }}>System Overview</div>
                        <div style={{ fontSize: 14, opacity: 0.6, marginTop: 6 }}>Quick overview of system statistics</div>
                    </div>
                    <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
                        {[ 
                            { icon: '👥', value: stats.totalUsers, label: 'Total Users' }, 
                            { icon: '🛡', value: stats.activeUsers, label: 'Active Users' }, 
                            { icon: '🕐', value: stats.loginsToday, label: 'Total Logins Today' }, 
                            { icon: '📋', value: stats.totalActivities, label: 'Total Activities' } 
                        ].map(({ icon, value, label }) => (
                            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{icon}</div>
                                <div>
                                    <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{value}</div>
                                    <div style={{ fontSize: 13, opacity: 0.6, marginTop: 6, fontWeight: 500 }}>{label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

/* Shared styles */
const labelSt = { display: 'block', fontSize: 14, color: '#334155', marginBottom: 8, fontWeight: 600 };
const inputSt = { width: '100%', padding: '14px 18px', borderRadius: 12, border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: 15, outline: 'none', boxSizing: 'border-box', color: '#0f172a' };
const tdSt = { padding: '16px 16px', fontSize: 15, color: '#1e293b', fontWeight: 500 };
const thSt = { padding: '14px 16px', textAlign: 'left', fontSize: 14, color: '#475569', fontWeight: 700 };
const btnStyle = { padding: '16px', border: 'none', borderRadius: 12, background: 'linear-gradient(to right, #0d9488, #0284c7)', color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 8, boxShadow: '0 4px 12px rgba(2,132,199,0.2)' };
const viewAllBtn = { padding: '10px 20px', borderRadius: 10, border: '1px solid #e2e8f0', background: 'white', fontSize: 14, fontWeight: 600, color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 };
const actionBtn = { background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#94a3b8' };
const msgSuccess = { marginTop: 20, padding: '14px', borderRadius: 10, textAlign: 'center', background: '#ecfdf5', color: '#065f46', fontWeight: 700, fontSize: 15 };
const msgError = { marginTop: 20, padding: '14px', borderRadius: 10, textAlign: 'center', background: '#fef2f2', color: '#991b1b', fontWeight: 700, fontSize: 15 };

/* Status Badges */
const statusActive = { padding: '5px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700, background: '#dcfce7', color: '#166534' };
const statusWarning = { padding: '5px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700, background: '#fef3c7', color: '#92400e' };
const statusDanger = { padding: '5px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700, background: '#fee2e2', color: '#991b1b' };