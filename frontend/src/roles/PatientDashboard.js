import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api';

export default function PatientDashboard() {
    // 1. STATE MANAGEMENT
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [message, setMessage] = useState('');
    const [appointmentForm, setAppointmentForm] = useState({
        doctor_id: '',
        date: ''
    });

    // Get user from local storage
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.username; 

    // 2. DATA LOADING LOGIC
    useEffect(() => {
        if (userId) {
            loadInitialData(userId);
        } else {
            setError('User session not found. Please login again.');
            setLoading(false);
        }
    }, [userId]);

    async function loadInitialData(username) {
        try {
            setLoading(true);
            // Fetch the patient profile based on the user_id (username)
            const res = await fetch(`${API_URL}/patients/profile/${username}`);
            
            if (!res.ok) {
                throw new Error('Could not find your patient profile.');
            }
            
            const profileData = await res.json();

            // Set the state for the entire dashboard
            setData({
                patient: profileData,
                appointments: profileData.appointments || [],
                prescriptions: profileData.prescriptions || [],
                bills: profileData.bills || []
            });

            // Fetch doctors list for the booking dropdown
            const docsRes = await fetch(`${API_URL}/doctors`);
            const docsData = await docsRes.json();
            setDoctors(docsData);

            setError('');
        } catch (err) {
            console.error("Dashboard Load Error:", err);
            setError('Failed to load dashboard. Ensure your patient record exists.');
        } finally {
            setLoading(false);
        }
    }

    async function bookAppointment(e) {
        e.preventDefault();
        setMessage('');
        try {
            const res = await fetch(`${API_URL}/appointments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patient_id: data.patient.patient_id,
                    doctor_id: appointmentForm.doctor_id,
                    date: appointmentForm.date
                })
            });

            if (res.ok) {
                setMessage('Appointment booked successfully ✅');
                setAppointmentForm({ doctor_id: '', date: '' });
                loadInitialData(userId); // Refresh data
            } else {
                const errData = await res.json();
                setMessage(errData.error || 'Failed to book appointment ❌');
            }
        } catch (error) {
            setMessage('Server error ❌');
        }
    }

    function logout() {
        localStorage.clear();
        window.location.href = '/login';
    }

    // 3. RENDER LOGIC (LOADING & ERROR)
    if (loading) {
        return (
            <div style={centerStyle}>
                <h2 style={{ color: '#0f766e' }}>Loading Dashboard...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div style={centerStyle}>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ color: '#dc2626' }}>{error}</h2>
                    <button onClick={() => window.location.reload()} style={buttonStyle}>Try Again</button>
                    <button onClick={logout} style={{ ...buttonStyle, background: '#64748b', marginLeft: '10px' }}>Logout</button>
                </div>
            </div>
        );
    }

    // 4. MAIN UI RENDER
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
            {/* SIDEBAR */}
            <div style={sidebarStyle}>
                <h2 style={logoStyle}>🏥 Medicare</h2>
                <button onClick={() => setActiveSection('dashboard')} style={activeSection === 'dashboard' ? activeSidebarBtn : sidebarButton}>📊 Dashboard</button>
                <button onClick={() => setActiveSection('appointments')} style={activeSection === 'appointments' ? activeSidebarBtn : sidebarButton}>📅 Appointments</button>
                <button onClick={() => setActiveSection('book')} style={activeSection === 'book' ? activeSidebarBtn : sidebarButton}>➕ Book Now</button>
                <button onClick={() => setActiveSection('history')} style={activeSection === 'history' ? activeSidebarBtn : sidebarButton}>💊 History</button>
                <button onClick={() => setActiveSection('bills')} style={activeSection === 'bills' ? activeSidebarBtn : sidebarButton}>💳 Bills</button>
                <button onClick={logout} style={logoutSidebarBtn}>Logout</button>
            </div>

            {/* MAIN CONTENT AREA */}
            <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
                
                {/* WELCOME HEADER */}
                <div style={headerBannerStyle}>
                    <h1 style={{ margin: 0, fontSize: '32px' }}>Welcome, {data?.patient?.name}!</h1>
                    <p style={{ marginTop: '10px', opacity: 0.9 }}>Check your health status and manage your records.</p>
                </div>

                {/* DASHBOARD VIEW */}
                {activeSection === 'dashboard' && (
                    <>
                        <div style={statsGrid}>
                            <div style={statsCard}>
                                <p style={infoLabel}>Active Appointments</p>
                                <h1 style={{ margin: '10px 0', color: '#0f766e' }}>{data?.appointments?.length || 0}</h1>
                            </div>
                            <div style={statsCard}>
                                <p style={infoLabel}>Medical Records</p>
                                <h1 style={{ margin: '10px 0', color: '#0284c7' }}>{data?.prescriptions?.length || 0}</h1>
                            </div>
                            <div style={statsCard}>
                                <p style={infoLabel}>Total Bills</p>
                                <h1 style={{ margin: '10px 0', color: '#f59e0b' }}>{data?.bills?.length || 0}</h1>
                            </div>
                        </div>

                        <div style={cardStyle}>
                            <h2 style={sectionTitle}>👤 Profile Details</h2>
                            <div style={infoGrid}>
                                <div style={infoBox}><p style={infoLabel}>Full Name</p><h3>{data?.patient?.name}</h3></div>
                                <div style={infoBox}><p style={infoLabel}>Age</p><h3>{data?.patient?.age} Years</h3></div>
                                <div style={infoBox}><p style={infoLabel}>Phone</p><h3>{data?.patient?.phone}</h3></div>
                            </div>
                        </div>
                    </>
                )}

                {/* APPOINTMENTS VIEW */}
                {activeSection === 'appointments' && (
                    <div style={cardStyle}>
                        <h2 style={sectionTitle}>📅 My Scheduled Appointments</h2>
                        {data?.appointments?.length > 0 ? (
                            <table style={tableStyle}>
                                <thead>
                                    <tr style={tableHeaderRow}>
                                        <th style={tableHead}>Date</th>
                                        <th style={tableHead}>Doctor</th>
                                        <th style={tableHead}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.appointments.map((a, i) => (
                                        <tr key={i}>
                                            <td style={tableData}>{new Date(a.date).toLocaleDateString()}</td>
                                            <td style={tableData}>{a.doctor_name || 'Medical Specialist'}</td>
                                            <td style={tableData}><span style={statusBadge}>{a.status || 'Confirmed'}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : <p>No appointments found.</p>}
                    </div>
                )}

                {/* BOOK APPOINTMENT VIEW */}
                {activeSection === 'book' && (
                    <div style={cardStyle}>
                        <h2 style={sectionTitle}>➕ Schedule a New Visit</h2>
                        <form onSubmit={bookAppointment} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px' }}>
                            <label style={infoLabel}>Select Specialist</label>
                            <select 
                                value={appointmentForm.doctor_id} 
                                onChange={(e) => setAppointmentForm({...appointmentForm, doctor_id: e.target.value})} 
                                required 
                                style={inputStyle}
                            >
                                <option value="">-- Select a Doctor --</option>
                                {doctors.map(d => <option key={d.doctor_id} value={d.doctor_id}>{d.name} ({d.specialization})</option>)}
                            </select>
                            
                            <label style={infoLabel}>Preferred Date</label>
                            <input 
                                type="date" 
                                value={appointmentForm.date} 
                                onChange={(e) => setAppointmentForm({...appointmentForm, date: e.target.value})} 
                                required 
                                style={inputStyle} 
                            />
                            
                            <button type="submit" style={buttonStyle}>Confirm Appointment</button>
                        </form>
                        {message && <div style={messageStyle}>{message}</div>}
                    </div>
                )}

                {/* HISTORY VIEW */}
                {activeSection === 'history' && (
                    <div style={cardStyle}>
                        <h2 style={sectionTitle}>💊 Medical & Prescription History</h2>
                        {data?.prescriptions?.length > 0 ? (
                            <table style={tableStyle}>
                                <thead>
                                    <tr style={tableHeaderRow}>
                                        <th style={tableHead}>Date</th>
                                        <th style={tableHead}>Diagnosis/Medicine</th>
                                        <th style={tableHead}>Doctor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.prescriptions.map((p, i) => (
                                        <tr key={i}>
                                            <td style={tableData}>{new Date(p.date).toLocaleDateString()}</td>
                                            <td style={tableData}>{p.medicine_name || 'General Treatment'}</td>
                                            <td style={tableData}>{p.doctor_name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : <p>No medical records available.</p>}
                    </div>
                )}

                {/* BILLS VIEW */}
                {activeSection === 'bills' && (
                    <div style={cardStyle}>
                        <h2 style={sectionTitle}>💳 Invoices & Payments</h2>
                        {data?.bills?.length > 0 ? (
                            <table style={tableStyle}>
                                <thead>
                                    <tr style={tableHeaderRow}>
                                        <th style={tableHead}>Date</th>
                                        <th style={tableHead}>Total Amount</th>
                                        <th style={tableHead}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.bills.map((b, i) => (
                                        <tr key={i}>
                                            <td style={tableData}>{new Date(b.bill_date).toLocaleDateString()}</td>
                                            <td style={tableData}>Rs. {b.total_amount}</td>
                                            <td style={{...tableData, color: b.status === 'paid' ? '#16a34a' : '#ea580c', fontWeight: 'bold'}}>
                                                {b.status.toUpperCase()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : <p>No billing history found.</p>}
                    </div>
                )}
            </div>
        </div>
    );
}

// 5. STYLES OBJECTS
const centerStyle = { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f1f5f9', fontFamily: 'inherit' };
const sidebarStyle = { width: '260px', background: 'linear-gradient(to bottom, #0f766e, #0284c7)', padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '12px', color: 'white' };
const logoStyle = { marginBottom: '30px', textAlign: 'center', fontSize: '24px' };
const sidebarButton = { padding: '14px', border: 'none', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', color: 'white', textAlign: 'left', cursor: 'pointer', fontWeight: '600', transition: '0.3s' };
const activeSidebarBtn = { ...sidebarButton, background: 'white', color: '#0f766e' };
const logoutSidebarBtn = { marginTop: 'auto', padding: '14px', border: 'none', borderRadius: '12px', background: '#be123c', color: 'white', cursor: 'pointer', fontWeight: 'bold' };
const headerBannerStyle = { background: 'linear-gradient(to right, #0f766e, #0284c7)', borderRadius: '20px', padding: '35px', color: 'white', marginBottom: '30px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' };
const statsGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' };
const statsCard = { background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', textAlign: 'center' };
const cardStyle = { background: 'white', borderRadius: '20px', padding: '30px', marginBottom: '30px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' };
const sectionTitle = { marginBottom: '20px', color: '#1e293b' };
const infoGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' };
const infoBox = { background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' };
const infoLabel = { color: '#64748b', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const tableHeaderRow = { background: '#f1f5f9', textAlign: 'left' };
const tableHead = { padding: '15px', color: '#475569', fontSize: '14px' };
const tableData = { padding: '15px', borderBottom: '1px solid #f1f5f9' };
const statusBadge = { background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' };
const buttonStyle = { padding: '14px', border: 'none', borderRadius: '8px', background: '#0f766e', color: 'white', fontWeight: 'bold', cursor: 'pointer' };
const messageStyle = { marginTop: '15px', padding: '12px', borderRadius: '8px', background: '#f0fdf4', color: '#166534', fontWeight: '600', border: '1px solid #bbf7d0' };