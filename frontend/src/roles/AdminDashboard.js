import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import "../styles/AdminDashboard.css";

const API_URL = 'http://localhost:5000/api';

const roles = [
    { role_id: 1, role_name: 'Admin' },
    { role_id: 2, role_name: 'Doctor' },
    { role_id: 3, role_name: 'Patient' },
    { role_id: 4, role_name: 'Pharmacist' },
    { role_id: 5, role_name: 'Receptionist' }
];

const specializations = [
    'Cardiologist', 'Neurologist', 'Pediatrician', 'General Surgeon', 'Orthopedist', 'Psychiatrist', 'Dermatologist'
];

const medCategories = [
    'Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Drops', 'Inhaler'
];

const roleBadgeStyle = {
    Admin: { background: '#fee2e2', color: '#991b1b' },
    Doctor: { background: '#dbeafe', color: '#1e40af' },
    Pharmacist: { background: '#fef3c7', color: '#92400e' },
    Receptionist: { background: '#ede9fe', color: '#5b21b6' },
    Patient: { background: '#dcfce7', color: '#166534' },
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

    // Stats state
    const [stats, setStats] = useState({
        patients: 0, doctors: 0, medicines: 0, appointments: 0,
        totalUsers: 0, activeUsers: 0, loginsToday: 0, totalActivities: 0
    });

    // UI State
    const [activeNav, setActiveNav] = useState('Dashboard');
    const [showPass, setShowPass] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);

    const [topMedicines, setTopMedicines] = useState([]);
    const [doctorPerformance, setDoctorPerformance] = useState([]);
    const [patientVisits, setPatientVisits] = useState([]);

    // Form States
    const [form, setForm] = useState({ username: '', password: '', role_id: '', doctor_id: '', patient_id: '' });
    const [docForm, setDocForm] = useState({ name: '', specialization: '' });
    const [patForm, setPatForm] = useState({ name: '', age: '', phone: '', user_id: '' });
    const [pharmForm, setPharmForm] = useState({ name: '', category: '', quantity: '', price: '' });
    const [apptForm, setApptForm] = useState({ patient_id: '', doctor_id: '', date: '', time: '', status: 'Scheduled' });

    // Editing ID States (Tracks which row we are updating)
    const [editingUserId, setEditingUserId] = useState(null);
    const [editingDocId, setEditingDocId] = useState(null);
    const [editingPatId, setEditingPatId] = useState(null);
    const [editingPharmId, setEditingPharmId] = useState(null);
    const [editingApptId, setEditingApptId] = useState(null);

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
    const [availablePatientProfiles, setAvailablePatientProfiles] = useState([]);
    const [pharmacyList, setPharmacyList] = useState([]);
    const [appointmentsList, setAppointmentsList] = useState([]);

    // --- PAGE LOAD TRIGGER ---
    useEffect(() => {
        loadStats();
        loadUsers();
        loadDoctors();
        loadPatients();
        loadAvailablePatientProfiles();
        loadPharmacy();
        loadAppointments();
        loadTopMedicines();
        loadDoctorPerformance();
        loadPatientVisits();
    }, []);

    async function loadStats() {
        try {
            const resTop = await fetch(`${API_URL}/hospital-stats`);
            const topData = resTop.ok ? await resTop.json() : {};

            const resBottom = await fetch(`${API_URL}/stats/overview`);
            const bottomData = resBottom.ok ? await resBottom.json() : {};

            setStats({ ...topData, ...bottomData });
        } catch (err) { console.error(err); }
    }

    async function loadUsers() {
        try {
            const res = await fetch(`${API_URL}/users`);
            const data = await res.json();
            console.log("Users data from backend:", data);
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setUsers([]);
        }
    }
    async function loadDoctors() {
        try {
            const res = await fetch(`${API_URL}/doctors`);
            setDoctorsList(await res.json());
        } catch (err) { console.error(err); }
    }
    async function loadPatients() {
        try {
            const res = await fetch(`${API_URL}/patients`);
            setPatientsList(await res.json());
        } catch (err) { console.error(err); }
    }
    async function loadAvailablePatientProfiles() {
        try {
            const res = await fetch(`${API_URL}/patients/unlinked`);
            const data = await res.json();
            setAvailablePatientProfiles(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setAvailablePatientProfiles([]);
        }
    }
    async function loadPharmacy() {
        try {
            const res = await fetch(`${API_URL}/medicines`);
            setPharmacyList(await res.json());
        } catch (err) { console.error(err); }
    }
    async function loadAppointments() {
        try {
            const res = await fetch(`${API_URL}/appointments`);
            setAppointmentsList(await res.json());
        } catch (err) { console.error(err); }
    }

    async function loadTopMedicines() {
        try {
            const res = await fetch(`${API_URL}/reports/top-medicines`);
            const data = await res.json();
            setTopMedicines(data);
        } catch (err) { console.error(err); }
    }

    async function loadDoctorPerformance() {
        try {
            const res = await fetch(`${API_URL}/reports/doctor-performance`);
            const data = await res.json();
            setDoctorPerformance(data);
        } catch (err) { console.error(err); }
    }

    async function loadPatientVisits() {
        try {
            const res = await fetch(`${API_URL}/reports/patient-visits`);
            const data = await res.json();
            setPatientVisits(data);
        } catch (err) { console.error(err); }
    }

    // ==========================================
    // 👥 USERS HANDLERS
    // ==========================================
    async function handleUserSubmit(e) {
        e.preventDefault();
        try {
            const method = editingUserId ? 'PUT' : 'POST';
            const endpoint = editingUserId ? `${API_URL}/users/${editingUserId}` : `${API_URL}/users`;
            const payload = {
                username: form.username,
                password: form.password,
                role_id: Number(form.role_id),
                doctor_id: Number(form.doctor_id) || null,
                patient_id: Number(form.patient_id) || null
            };

            if (payload.role_id !== 2) { payload.doctor_id = null; }
            if (payload.role_id !== 3) { payload.patient_id = null; }

            const res = await fetch(endpoint, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                setMessage('success');
                setForm({ username: '', password: '', role_id: '', doctor_id: '', patient_id: '' });
                setEditingUserId(null);
                loadUsers(); loadStats();
            } else { setMessage('error'); }
        } catch { setMessage('error'); }
        setTimeout(() => setMessage(''), 3000);
    }

    const handleEditUser = (u) => {
        const foundRole = roles.find(r => r.role_name === u.role_name);
        setForm({
            username: u.username,
            password: '',
            role_id: foundRole ? foundRole.role_id : '',
            doctor_id: u.doctor_id || '',
            patient_id: u.patient_id || ''
        });
        setEditingUserId(u.id || u.user_id);
        setActiveMenu(null);
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            const res = await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setMessage('deleted'); loadUsers(); loadStats();
            } else { setMessage('error'); }
        } catch { setMessage('error'); }
        setActiveMenu(null);
        setTimeout(() => setMessage(''), 3000);
    };

    // ==========================================
    // 🩺 DOCTORS HANDLERS
    // ==========================================
    async function handleDoctorSubmit(e) {
        e.preventDefault();
        try {
            const method = editingDocId ? 'PUT' : 'POST';
            const endpoint = editingDocId ? `${API_URL}/doctors/${editingDocId}` : `${API_URL}/doctors`;
            const payload = { name: docForm.name, specialization: docForm.specialization };

            const res = await fetch(endpoint, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                setDocMessage('success');
                setDocForm({ name: '', specialization: '', user_id: '' });
                setEditingDocId(null);
                loadDoctors(); loadStats();
            } else { setDocMessage('error'); }
        } catch { setDocMessage('error'); }
        setTimeout(() => setDocMessage(''), 3000);
    }

    const handleEditDoctor = (doc) => {
        setDocForm({ name: doc.name, specialization: doc.specialization || '' });
        setEditingDocId(doc.doctor_id || doc.id);
        setActiveMenu(null);
    };

    const handleDeleteDoctor = async (id) => {
        if (!window.confirm("Are you sure you want to delete this doctor?")) return;
        try {
            const res = await fetch(`${API_URL}/doctors/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setDocMessage('deleted'); loadDoctors(); loadStats();
            } else { setDocMessage('error'); }
        } catch { setDocMessage('error'); }
        setActiveMenu(null);
        setTimeout(() => setDocMessage(''), 3000);
    };

    // ==========================================
    // 🧑 PATIENTS HANDLERS
    // ==========================================
    async function handlePatientSubmit(e) {
        e.preventDefault();
        try {
            const method = editingPatId ? 'PUT' : 'POST';
            const endpoint = editingPatId ? `${API_URL}/patients/${editingPatId}` : `${API_URL}/patients`;

            const res = await fetch(endpoint, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patForm),
            });
            if (res.ok) {
                setPatMessage('success');
                setPatForm({ name: '', age: '', phone: '', user_id: '' });
                setEditingPatId(null);
                loadPatients(); loadStats();
            } else { setPatMessage('error'); }
        } catch { setPatMessage('error'); }
        setTimeout(() => setPatMessage(''), 3000);
    }

    const handleEditPatient = (pat) => {
        setPatForm({ name: pat.name, age: pat.age, phone: pat.phone, user_id: pat.user_id || '' });
        setEditingPatId(pat.patient_id || pat.id);
        setActiveMenu(null);
    };

    const handleDeletePatient = async (id) => {
        if (!window.confirm("Are you sure you want to delete this patient?")) return;
        try {
            const res = await fetch(`${API_URL}/patients/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setPatMessage('deleted'); loadPatients(); loadStats();
            } else { setPatMessage('error'); }
        } catch { setPatMessage('error'); }
        setActiveMenu(null);
        setTimeout(() => setPatMessage(''), 3000);
    };

    // ==========================================
    // 💊 PHARMACY HANDLERS
    // ==========================================
    async function handlePharmacySubmit(e) {
        e.preventDefault();
        try {
            const method = editingPharmId ? 'PUT' : 'POST';
            const endpoint = editingPharmId ? `${API_URL}/medicines/${editingPharmId}` : `${API_URL}/medicines`;

            const res = await fetch(endpoint, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pharmForm),
            });
            if (res.ok) {
                setPharmMessage('success');
                setPharmForm({ name: '', category: '', quantity: '', price: '' });
                setEditingPharmId(null);
                loadPharmacy(); loadStats();
            } else { setPharmMessage('error'); }
        } catch { setPharmMessage('error'); }
        setTimeout(() => setPharmMessage(''), 3000);
    }

    const handleEditPharmacy = (med) => {
        setPharmForm({ name: med.name, category: med.category, quantity: med.quantity, price: med.price });
        setEditingPharmId(med.medicine_id || med.id);
        setActiveMenu(null);
    };

    const handleDeletePharmacy = async (id) => {
        if (!window.confirm("Are you sure you want to delete this medicine?")) return;
        try {
            const res = await fetch(`${API_URL}/medicines/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setPharmMessage('deleted'); loadPharmacy(); loadStats();
            } else { setPharmMessage('error'); }
        } catch { setPharmMessage('error'); }
        setActiveMenu(null);
        setTimeout(() => setPharmMessage(''), 3000);
    };

    // ==========================================
    // 📅 APPOINTMENTS HANDLERS
    // ==========================================
    async function handleAppointmentSubmit(e) {
        e.preventDefault();
        try {
            const method = editingApptId ? 'PUT' : 'POST';
            const endpoint = editingApptId ? `${API_URL}/appointments/${editingApptId}` : `${API_URL}/appointments`;

            const res = await fetch(endpoint, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(apptForm),
            });
            if (res.ok) {
                setApptMessage('success');
                setApptForm({ patient_id: '', doctor_id: '', date: '', appointment_time: '', status: 'Scheduled' });
                setEditingApptId(null);
                loadAppointments(); loadStats();
            } else { setApptMessage('error'); }
        } catch { setApptMessage('error'); }
        setTimeout(() => setApptMessage(''), 3000);
    }

    const handleEditAppointment = (appt) => {
        setApptForm({ patient_id: appt.patient_id, doctor_id: appt.doctor_id, date: appt.date, appointment_time: appt.appointment_time, status: appt.status });
        setEditingApptId(appt.appointment_id || appt.id);
        setActiveMenu(null);
    };

    const handleDeleteAppointment = async (id) => {
        if (!window.confirm("Are you sure you want to delete this appointment?")) return;
        try {
            const res = await fetch(`${API_URL}/appointments/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setApptMessage('deleted'); loadAppointments(); loadStats();
            } else { setApptMessage('error'); }
        } catch { setApptMessage('error'); }
        setActiveMenu(null);
        setTimeout(() => setApptMessage(''), 3000);
    };

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const statCards = [
        { label: 'Total Doctors', value: stats.doctors, icon: '🩺', trend: stats.doctorTrend ? `${stats.doctorTrend}%` : '0%', navTarget: 'Doctors' },
        { label: 'Total Patients', value: stats.patients, icon: '🧑', trend: stats.patientTrend ? `${stats.patientTrend}%` : '0%', navTarget: 'Patients' },
        { label: 'Total Medicines', value: stats.medicines, icon: '💊', trend: stats.medicineTrend ? `${stats.medicineTrend}%` : '0%', navTarget: 'Pharmacy' },
        { label: "Total Appointments", value: stats.appointments, icon: '📅', trend: stats.appointmentTrend ? `${stats.appointmentTrend}%` : '0%', navTarget: 'Appointments' },
    ];

    // --- CONDITIONALLY RENDER CONTENT ---
    const renderMainContent = () => {
        if (activeNav === 'Dashboard') {
            return (
                <div className="dashboard-view">
                    <div className="stats-grid">
                        {statCards.map(({ label, value, icon, trend, navTarget }) => (
                            <div key={label} className="stat-card">
                                <div className="stat-card-header">
                                    <div className="stat-card-title-group">
                                        <div className="stat-card-icon">{icon}</div>
                                        <span className="stat-card-label">{label}</span>
                                    </div>
                                    <span className="stat-card-trend">↑ {trend}</span>
                                </div>
                                <div className="stat-card-value">{value}</div>
                                <div onClick={() => setActiveNav(navTarget)} className="stat-card-link">
                                    View all {label.toLowerCase().replace("today's ", "")} ›
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* BI ANALYTICS SECTION */}
                    <div className="analytics-grid">
                        {/* TOP MEDICINES */}
                        <div className="analytics-card">
                            <h3 className="analytics-card-title">
                                <span>💊</span> Top Medicines
                            </h3>
                            <div className="analytics-list">
                                {topMedicines.slice(0, 5).map((item, index) => (
                                    <div key={index} className={`analytics-row ${index % 2 === 0 ? 'striped' : ''}`}>
                                        <div className="analytics-row-info">
                                            <span className="analytics-rank">{index + 1}</span>
                                            <span className="analytics-name">{item.name}</span>
                                        </div>
                                        <span className="analytics-badge-blue">
                                            {item.total_used}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* DOCTOR PERFORMANCE */}
                        <div className="analytics-card">
                            <h3 className="analytics-card-title">
                                <span>🩺</span> Doctor Performance
                            </h3>
                            <div className="analytics-list">
                                {doctorPerformance.slice(0, 5).map((item, index) => (
                                    <div key={index} className={`analytics-row ${index % 2 === 0 ? 'striped' : ''}`}>
                                        <div className="analytics-row-info">
                                            <span className="analytics-rank">{index + 1}</span>
                                            <span className="analytics-name">{item.name}</span>
                                        </div>
                                        <span className="analytics-badge-green">
                                            {item.total_appointments} appts
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* PATIENT VISITS */}
                        <div className="analytics-card">
                            <h3 className="analytics-card-title">
                                <span>👤</span> Patient Visits
                            </h3>
                            <div className="analytics-list">
                                {patientVisits.slice(0, 5).map((item, index) => (
                                    <div key={index} className={`analytics-row ${index % 2 === 0 ? 'striped' : ''}`}>
                                        <div className="analytics-row-info">
                                            <span className="analytics-rank">{index + 1}</span>
                                            <span className="analytics-name">{item.name}</span>
                                        </div>
                                        <span className="analytics-badge-purple">
                                            {item.total_visits} visits
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="system-overview-panel">
                        <div>
                            <div className="overview-title">System Overview</div>
                            <div className="overview-subtitle">Quick overview of system statistics</div>
                        </div>
                        <div className="overview-metrics-group">
                            {[
                                { icon: '👥', value: stats.totalUsers, label: 'Total Users' },
                                { icon: '🛡', value: stats.activeUsers, label: 'Active Users' },
                                { icon: '🕐', value: stats.loginsToday, label: 'Total Logins Today' },
                                { icon: '📋', value: stats.totalActivities, label: 'Total Activities' }
                            ].map(({ icon, value, label }) => (
                                <div key={label} className="overview-metric-item">
                                    <div className="overview-metric-icon">{icon}</div>
                                    <div>
                                        <div className="overview-metric-value">{value}</div>
                                        <div className="overview-metric-label">{label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        if (activeNav === 'Users') {
            return (
                <div className="data-view-grid">
                    <div className="form-panel">
                        <div className="panel-header-inline">
                            <div className="stat-card-icon">👤</div>
                            <div>
                                <div className="panel-title">{editingUserId ? 'Update User' : 'Create User'}</div>
                                <div className="panel-subtitle">{editingUserId ? 'Edit user credentials' : 'Add a new user to the system'}</div>
                            </div>
                        </div>
                        <form onSubmit={handleUserSubmit} className="form-container">
                            <div>
                                <label className="input-label">Username</label>
                                <input placeholder="Enter username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required className="form-input" />
                            </div>
                            <div>
                                <label className="input-label">Password {editingUserId && '(Leave blank to keep current)'}</label>
                                <div className="password-input-wrapper">
                                    <input type={showPass ? 'text' : 'password'} placeholder="Enter password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required={!editingUserId} className="form-input" style={{ paddingRight: 46 }} />
                                    <button type="button" onClick={() => setShowPass(s => !s)} className="password-toggle-btn">
                                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="input-label">Select Role</label>
                                <select value={form.role_id} onChange={e => setForm({ ...form, role_id: e.target.value, doctor_id: '', patient_id: '' })} required className="form-input">
                                    <option value="">Choose a role</option>
                                    {roles.map(r => <option key={r.role_id} value={r.role_id}>{r.role_name}</option>)}
                                </select>
                            </div>
                            {form.role_id === '2' && (
                                <div>
                                    <label className="input-label">Link Doctor Profile</label>
                                    <select value={form.doctor_id} onChange={e => setForm({ ...form, doctor_id: e.target.value })} required className="form-input">
                                        <option value="">Select a doctor profile</option>
                                        {doctorsList.map(d => (
                                            <option key={d.doctor_id || d.id} value={d.doctor_id || d.id}>{d.name} ({d.specialization})</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            {form.role_id === '3' && (
                                <div>
                                    <label className="input-label">Link Patient Profile</label>
                                    <select value={form.patient_id} onChange={e => setForm({ ...form, patient_id: e.target.value })} required className="form-input">
                                        <option value="">Select a patient profile</option>
                                        {(() => {
                                            const currentPatient = editingUserId && form.patient_id
                                                ? patientsList.find(p => String(p.patient_id || p.id) === String(form.patient_id))
                                                : null;
                                            const options = availablePatientProfiles.slice();
                                            if (currentPatient && !options.some(p => String(p.patient_id || p.id) === String(currentPatient.patient_id || currentPatient.id))) {
                                                options.unshift(currentPatient);
                                            }
                                            return options.map(p => (
                                                <option key={p.patient_id || p.id} value={p.patient_id || p.id}>{p.name} ({p.age} yrs)</option>
                                            ));
                                        })()}
                                    </select>
                                </div>
                            )}
                            <div className="form-actions">
                                <button type="submit" className="submit-btn">
                                    {editingUserId ? '👤 Update User' : '👤 Create User'}
                                </button>
                                {editingUserId && (
                                    <button type="button" onClick={() => { setEditingUserId(null); setForm({ username: '', password: '', role_id: '', doctor_id: '', patient_id: '' }); }} className="cancel-btn">Cancel</button>
                                )}
                            </div>
                        </form>
                        {message && (
                            <div className={`feedback-msg ${message === 'error' ? 'error' : 'success'}`}>
                                {message === 'success' ? '✅ User saved successfully' : message === 'deleted' ? '✅ User deleted successfully' : '❌ Failed to process request'}
                            </div>
                        )}
                    </div>

                    <div className="table-panel">
                        <div className="panel-header-between">
                            <div className="panel-header-icon-group">
                                <div className="stat-card-icon">👥</div>
                                <div>
                                    <div className="panel-title">System Users</div>
                                    <div className="panel-subtitle">Manage all system users</div>
                                </div>
                            </div>
                        </div>
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr className="table-header-row">
                                        {['Username', 'Role', 'Status', 'Last Login', 'Actions'].map(h => <th key={h} className="table-th">{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u, i) => {
                                        const userId = u.id || u.user_id || `user_${i}`;
                                        return (
                                            <tr key={i} className="table-row">
                                                <td className="table-td">{u.username}</td>
                                                <td className="table-td">
                                                    <span className="status-badge" style={{ ...(roleBadgeStyle[u.role_name] || roleBadgeStyle.Patient) }}>
                                                        {u.role_name}
                                                    </span>
                                                </td>
                                                <td className="table-td"><span className="status-badge active">Active</span></td>
                                                <td className="table-td muted-text nowrap">
                                                    {u.lastLogin ? u.lastLogin : '—'}
                                                </td>
                                                <td className="table-td action-cell">
                                                    <button onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === userId ? null : userId); }} className="action-trigger-btn">⋮</button>
                                                    {activeMenu === userId && (
                                                        <div className="dropdown-menu">
                                                            <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleEditUser(u); }}>✏️ Edit</div>
                                                            <div className="dropdown-item delete" onClick={(e) => { e.stopPropagation(); handleDeleteUser(userId); }}>🗑️ Delete</div>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        }

        if (activeNav === 'Doctors') {
            return (
                <div className="data-view-grid">
                    <div className="form-panel">
                        <div className="panel-header-inline">
                            <div className="stat-card-icon" style={{ backgroundColor: '#eff6ff' }}>🩺</div>
                            <div>
                                <div className="panel-title">{editingDocId ? 'Update Doctor' : 'Register Doctor'}</div>
                                <div className="panel-subtitle">{editingDocId ? 'Edit medical professional details' : 'Add a medical professional'}</div>
                            </div>
                        </div>
                        <form onSubmit={handleDoctorSubmit} className="form-container">
                            <div>
                                <label className="input-label">Doctor's Full Name</label>
                                <input placeholder="e.g. Dr. Sarah Smith" value={docForm.name} onChange={e => setDocForm({ ...docForm, name: e.target.value })} required className="form-input" />
                            </div>
                            <div>
                                <label className="input-label">Specialization</label>
                                <select value={docForm.specialization} onChange={e => setDocForm({ ...docForm, specialization: e.target.value })} required className="form-input">
                                    <option value="">Select Specialization</option>
                                    {specializations.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="submit-btn" style={{ background: 'linear-gradient(to right, #2563eb, #3b82f6)' }}>
                                    {editingDocId ? '🩺 Update Doctor' : '🩺 Add Doctor'}
                                </button>
                                {editingDocId && (
                                    <button type="button" onClick={() => { setEditingDocId(null); setDocForm({ name: '', specialization: '' }); }} className="cancel-btn">Cancel</button>
                                )}
                            </div>
                        </form>
                        {docMessage && (
                            <div className={`feedback-msg ${docMessage === 'error' ? 'error' : 'success'}`}>
                                {docMessage === 'success' ? '✅ Doctor saved successfully' : docMessage === 'deleted' ? '✅ Doctor deleted successfully' : '❌ Failed to process request'}
                            </div>
                        )}
                    </div>

                    <div className="table-panel">
                        <div className="panel-header-between">
                            <div className="panel-header-icon-group">
                                <div className="stat-card-icon" style={{ backgroundColor: '#eff6ff' }}>📋</div>
                                <div>
                                    <div className="panel-title">Doctors Directory</div>
                                    <div className="panel-subtitle">Manage medical staff records</div>
                                </div>
                            </div>
                        </div>
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr className="table-header-row">
                                        {['Doctor Name', 'Specialty', 'Linked Account', 'Status', 'Actions'].map(h => <th key={h} className="table-th">{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {doctorsList.map((d, i) => {
                                        const docId = d.doctor_id || d.id;
                                        return (
                                            <tr key={i} className="table-row">
                                                <td className="table-td bold-name">{d.name}</td>
                                                <td className="table-td">
                                                    <span className="status-badge pill-bordered">{d.specialization}</span>
                                                </td>
                                                <td className="table-td muted-text">{d.user_id || 'Not Linked'}</td>
                                                <td className="table-td"><span className="status-badge active">Available</span></td>
                                                <td className="table-td action-cell">
                                                    <button onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === docId ? null : docId); }} className="action-trigger-btn">⋮</button>
                                                    {activeMenu === docId && (
                                                        <div className="dropdown-menu">
                                                            <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleEditDoctor(d); }}>✏️ Edit</div>
                                                            <div className="dropdown-item delete" onClick={(e) => { e.stopPropagation(); handleDeleteDoctor(docId); }}>🗑️ Delete</div>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        }

        if (activeNav === 'Patients') {
            return (
                <div className="data-view-grid">
                    <div className="form-panel">
                        <div className="panel-header-inline">
                            <div className="stat-card-icon" style={{ backgroundColor: '#fdf4ff', color: '#c026d3' }}>🧑</div>
                            <div>
                                <div className="panel-title">{editingPatId ? 'Update Patient' : 'Register Patient'}</div>
                                <div className="panel-subtitle">{editingPatId ? 'Edit patient details' : 'Add a new patient record'}</div>
                            </div>
                        </div>
                        <form onSubmit={handlePatientSubmit} className="form-container">
                            <div>
                                <label className="input-label">Patient Full Name</label>
                                <input placeholder="e.g. John Doe" value={patForm.name} onChange={e => setPatForm({ ...patForm, name: e.target.value })} required className="form-input" />
                            </div>
                            <div className="form-field-grid-patient">
                                <div>
                                    <label className="input-label">Age</label>
                                    <input type="number" placeholder="Years" value={patForm.age} onChange={e => setPatForm({ ...patForm, age: e.target.value })} required className="form-input" />
                                </div>
                                <div>
                                    <label className="input-label">Contact Phone</label>
                                    <input type="tel" placeholder="e.g. 555-0198" value={patForm.phone} onChange={e => setPatForm({ ...patForm, phone: e.target.value })} required className="form-input" />
                                </div>
                            </div>
                            <div>
                                <label className="input-label">Link User Account (Optional)</label>
                                <select value={patForm.user_id} onChange={e => setPatForm({ ...patForm, user_id: e.target.value })} className="form-input">
                                    <option value="">Select an existing user</option>
                                    {users.filter(u => u.role_name === 'Patient').map(u => (
                                        <option key={u.user_id || u.id} value={u.user_id || u.id}>{u.username}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="submit-btn" style={{ background: 'linear-gradient(to right, #a21caf, #d946ef)' }}>
                                    {editingPatId ? '🧑 Update Patient' : '🧑 Add Patient'}
                                </button>
                                {editingPatId && (
                                    <button type="button" onClick={() => { setEditingPatId(null); setPatForm({ name: '', age: '', phone: '', user_id: '' }); }} className="cancel-btn">Cancel</button>
                                )}
                            </div>
                        </form>
                        {patMessage && (
                            <div className={`feedback-msg ${patMessage === 'error' ? 'error' : 'success'}`}>
                                {patMessage === 'success' ? '✅ Patient saved successfully' : patMessage === 'deleted' ? '✅ Patient deleted successfully' : '❌ Failed to process request'}
                            </div>
                        )}
                    </div>

                    <div className="table-panel">
                        <div className="panel-header-between">
                            <div className="panel-header-icon-group">
                                <div className="stat-card-icon" style={{ backgroundColor: '#fdf4ff', color: '#c026d3' }}>🗂️</div>
                                <div>
                                    <div className="panel-title">Patients Directory</div>
                                    <div className="panel-subtitle">Manage registered patients</div>
                                </div>
                            </div>
                        </div>
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr className="table-header-row">
                                        {['Patient Name', 'Age', 'Contact Info', 'Linked Account', 'Actions'].map(h => <th key={h} className="table-th">{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {patientsList.map((p, i) => {
                                        const patId = p.patient_id || p.id;
                                        return (
                                            <tr key={i} className="table-row">
                                                <td className="table-td bold-name">{p.name}</td>
                                                <td className="table-td">
                                                    <span className="status-badge pill-gray">{p.age} yrs</span>
                                                </td>
                                                <td className="table-td" style={{ color: '#475569' }}>📞 {p.phone}</td>
                                                <td className="table-td muted-text">{p.user_id || 'Not Linked'}</td>
                                                <td className="table-td action-cell">
                                                    <button onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === patId ? null : patId); }} className="action-trigger-btn">⋮</button>
                                                    {activeMenu === patId && (
                                                        <div className="dropdown-menu">
                                                            <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleEditPatient(p); }}>✏️ Edit</div>
                                                            <div className="dropdown-item delete" onClick={(e) => { e.stopPropagation(); handleDeletePatient(patId); }}>🗑️ Delete</div>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        }

        if (activeNav === 'Pharmacy') {
            return (
                <div className="data-view-grid">
                    <div className="form-panel">
                        <div className="panel-header-inline">
                            <div className="stat-card-icon" style={{ backgroundColor: '#ffedd5', color: '#ea580c' }}>💊</div>
                            <div>
                                <div className="panel-title">{editingPharmId ? 'Update Medicine' : 'Add Medicine'}</div>
                                <div className="panel-subtitle">{editingPharmId ? 'Edit stock details' : 'Enter new stock to inventory'}</div>
                            </div>
                        </div>
                        <form onSubmit={handlePharmacySubmit} className="form-container">
                            <div>
                                <label className="input-label">Medicine Name</label>
                                <input placeholder="e.g. Amoxicillin 500mg" value={pharmForm.name} onChange={e => setPharmForm({ ...pharmForm, name: e.target.value })} required className="form-input" />
                            </div>
                            <div>
                                <label className="input-label">Category</label>
                                <select value={pharmForm.category} onChange={e => setPharmForm({ ...pharmForm, category: e.target.value })} required className="form-input">
                                    <option value="">Select Category</option>
                                    {medCategories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="form-field-group">
                                <div>
                                    <label className="input-label">Stock Quantity</label>
                                    <input type="number" placeholder="Units" value={pharmForm.quantity} onChange={e => setPharmForm({ ...pharmForm, quantity: e.target.value })} required className="form-input" />
                                </div>
                                <div>
                                    <label className="input-label">Unit Price (Rs)</label>
                                    <input type="number" step="0.01" placeholder="0.00" value={pharmForm.price} onChange={e => setPharmForm({ ...pharmForm, price: e.target.value })} required className="form-input" />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="submit-btn" style={{ background: 'linear-gradient(to right, #ea580c, #f97316)' }}>
                                    {editingPharmId ? '💊 Update Medicine' : '💊 Add Medicine'}
                                </button>
                                {editingPharmId && (
                                    <button type="button" onClick={() => { setEditingPharmId(null); setPharmForm({ name: '', category: '', quantity: '', price: '' }); }} className="cancel-btn">Cancel</button>
                                )}
                            </div>
                        </form>
                        {pharmMessage && (
                            <div className={`feedback-msg ${pharmMessage === 'error' ? 'error' : 'success'}`}>
                                {pharmMessage === 'success' ? '✅ Medicine saved successfully' : pharmMessage === 'deleted' ? '✅ Medicine deleted successfully' : '❌ Failed to process request'}
                            </div>
                        )}
                    </div>

                    <div className="table-panel">
                        <div className="panel-header-between">
                            <div className="panel-header-icon-group">
                                <div className="stat-card-icon" style={{ backgroundColor: '#ffedd5', color: '#ea580c' }}>📦</div>
                                <div>
                                    <div className="panel-title">Pharmacy Inventory</div>
                                    <div className="panel-subtitle">Manage medical stock & pricing</div>
                                </div>
                            </div>
                        </div>
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr className="table-header-row">
                                        {['Medicine Name', 'Category', 'Stock Level', 'Price', 'Status', 'Actions'].map(h => <th key={h} className="table-th">{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {pharmacyList.map((m, i) => {
                                        const medId = m.medicine_id || m.id;
                                        const qty = parseInt(m.quantity);
                                        let statType = "active"; let statText = "In Stock";
                                        if (qty === 0) { statType = "danger"; statText = "Out of Stock"; }
                                        else if (qty < 20) { statType = "warning"; statText = "Low Stock"; }

                                        return (
                                            <tr key={i} className="table-row">
                                                <td className="table-td bold-name">{m.name}</td>
                                                <td className="table-td">
                                                    <span className="status-badge pill-gray">{m.category}</span>
                                                </td>
                                                <td className="table-td" style={{ fontWeight: 600 }}>{m.quantity} Units</td>
                                                <td className="table-td" style={{ color: '#475569' }}>Rs {parseFloat(m.price).toFixed(2)}</td>
                                                <td className="table-td"><span className={`status-badge ${statType}`}>{statText}</span></td>
                                                <td className="table-td action-cell">
                                                    <button onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === medId ? null : medId); }} className="action-trigger-btn">⋮</button>
                                                    {activeMenu === medId && (
                                                        <div className="dropdown-menu">
                                                            <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleEditPharmacy(m); }}>✏️ Edit</div>
                                                            <div className="dropdown-item delete" onClick={(e) => { e.stopPropagation(); handleDeletePharmacy(medId); }}>🗑️ Delete</div>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
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
                <div className="data-view-grid">
                    <div className="form-panel">
                        <div className="panel-header-inline">
                            <div className="stat-card-icon" style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }}>📅</div>
                            <div>
                                <div className="panel-title">{editingApptId ? 'Update Visit' : 'Schedule Visit'}</div>
                                <div className="panel-subtitle">{editingApptId ? 'Edit appointment details' : 'Book a new appointment'}</div>
                            </div>
                        </div>
                        <form onSubmit={handleAppointmentSubmit} className="form-container">
                            <div>
                                <label className="input-label">Select Patient</label>
                                <select value={apptForm.patient_id} onChange={e => setApptForm({ ...apptForm, patient_id: e.target.value })} required className="form-input">
                                    <option value="">Choose Patient</option>
                                    {patientsList.map(p => (
                                        <option key={p.patient_id || p.id} value={p.patient_id || p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="input-label">Select Doctor</label>
                                <select value={apptForm.doctor_id} onChange={e => setApptForm({ ...apptForm, doctor_id: e.target.value })} required className="form-input">
                                    <option value="">Choose Doctor</option>
                                    {doctorsList.map(d => (
                                        <option key={d.doctor_id || d.id} value={d.doctor_id || d.id}>{d.name} ({d.specialization})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-field-group">
                                <div>
                                    <label className="input-label">Date</label>
                                    <input type="date" value={apptForm.date} onChange={e => setApptForm({ ...apptForm, date: e.target.value })} required className="form-input" />
                                </div>
                                <div>
                                    <label className="input-label">Time</label>
                                    <input type="time" value={apptForm.appointment_time} onChange={e => setApptForm({ ...apptForm, appointment_time: e.target.value })} required className="form-input" />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="submit-btn" style={{ background: 'linear-gradient(to right, #7c3aed, #a855f7)' }}>
                                    {editingApptId ? '📅 Update Appointment' : '📅 Schedule Appointment'}
                                </button>
                                {editingApptId && (
                                    <button type="button" onClick={() => { setEditingApptId(null); setApptForm({ patient_id: '', doctor_id: '', date: '', time: '', status: 'Scheduled' }); }} className="cancel-btn">Cancel</button>
                                )}
                            </div>
                        </form>
                        {apptMessage && (
                            <div className={`feedback-msg ${apptMessage === 'error' ? 'error' : 'success'}`}>
                                {apptMessage === 'success' ? '✅ Appointment saved successfully' : apptMessage === 'deleted' ? '✅ Appointment deleted successfully' : '❌ Failed to process request'}
                            </div>
                        )}
                    </div>

                    <div className="table-panel">
                        <div className="panel-header-between">
                            <div className="panel-header-icon-group">
                                <div className="stat-card-icon" style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }}>📋</div>
                                <div>
                                    <div className="panel-title">Master Schedule</div>
                                    <div className="panel-subtitle">Manage today's hospital visits</div>
                                </div>
                            </div>
                        </div>
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr className="table-header-row">
                                        {['Patient ID', 'Assigned Doctor ID', 'Date', 'Time', 'Status', 'Actions'].map(h => <th key={h} className="table-th">{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointmentsList.map((a, i) => {
                                        const apptId = a.appointment_id || a.id;
                                        let statType = "active";
                                        if (a.status === 'Completed') statType = "active";
                                        else if (a.status === 'Pending' || a.status === 'Scheduled') statType = "warning";
                                        else if (a.status === 'Cancelled') statType = "danger";

                                        return (
                                            <tr key={i} className="table-row">
                                                <td className="table-td bold-name">{a.patient_id}</td>
                                                <td className="table-td">
                                                    <span className="status-badge pill-gray">{a.doctor_id}</span>
                                                </td>
                                                <td className="table-td muted-text" style={{ fontSize: 14 }}>{a.date}</td>
                                                <td className="table-td" style={{ color: '#0f172a', fontWeight: 600 }}>{a.appointment_time}</td>
                                                <td className="table-td"><span className={`status-badge ${statType}`}>{a.status}</span></td>
                                                <td className="table-td action-cell">
                                                    <button onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === apptId ? null : apptId); }} className="action-trigger-btn">⋮</button>
                                                    {activeMenu === apptId && (
                                                        <div className="dropdown-menu">
                                                            <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleEditAppointment(a); }}>✏️ Edit</div>
                                                            <div className="dropdown-item delete" onClick={(e) => { e.stopPropagation(); handleDeleteAppointment(apptId); }}>🗑️ Delete</div>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
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
        <div className="admin-container">
            <aside className="sidebar">
                <div className="sidebar-brand-wrapper">
                    <div className="sidebar-brand">
                        <div className="brand-icon">🏥</div>
                        <div>
                            <div className="brand-title">Health Care Hospital</div>
                            <div className="brand-subtitle">Integrated Management</div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-nav-wrapper">
                    <div onClick={() => setActiveNav('Dashboard')} className={`dashboard-nav-item ${activeNav === 'Dashboard' ? 'active' : ''}`}>
                        <span style={{ fontSize: 18 }}>📊</span> Dashboard
                    </div>
                </div>

                <div className="nav-section-title">Management</div>

                <nav className="sidebar-nav">
                    {navItems.map(({ icon, label }) => (
                        <div key={label} onClick={() => setActiveNav(label)} className={`nav-item ${activeNav === label ? 'active' : ''}`}>
                            <span className="nav-item-content">
                                <span className="nav-item-icon">{icon}</span>
                                {label}
                            </span>
                            <span className="nav-arrow">›</span>
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="avatar">👤</div>
                        <div>
                            <div className="profile-name">Admin</div>
                            <div className="profile-role">Shashi</div>
                        </div>
                    </div>
                    <button onClick={() => navigate('/')} className="logout-btn">
                        🚪 Log Out
                    </button>
                </div>
            </aside>

            {/* Global Click handler to close dropdowns */}
            <main onClick={() => activeMenu && setActiveMenu(null)} className="main-content">
                <div className="header-section">
                    <div>
                        <h1 className="header-title">Welcome Back, Admin 👋</h1>
                        <p className="header-subtitle">Here's what's happening in your hospital today.</p>
                    </div>
                    <div className="date-badge">
                        📅 <span>{today}</span>
                    </div>
                </div>

                {renderMainContent()}
            </main>
        </div>
    );
}