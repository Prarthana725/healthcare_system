import { useEffect, useState } from 'react';
import { 
    LayoutDashboard, 
    CalendarCheck, 
    Pill, 
    Users, 
    FileText, 
    LogOut
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function DoctorPanel() {
    const user = JSON.parse(localStorage.getItem('user'));
    const loginName = user?.username || user?.user_id || 'UNKNOWN'; 

    const [activeTab, setActiveTab] = useState('Dashboard');

    const [myDoctorId, setMyDoctorId] = useState(null); 
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]); 

    const [selectedRecordPatient, setSelectedRecordPatient] = useState('');
    const [message, setMessage] = useState('');
    const [prescriptionForm, setPrescriptionForm] = useState({
        patient_id: '',
        date: '',
        details: [{ medicine_id: '', quantity: '' }]
    });

    useEffect(() => {
        async function initDoctorProfile() {
            try {
                const res = await fetch(`${API_URL}/doctors`);
                if (res.ok) {
                    const allDocs = await res.json();
                    const myDoc = allDocs.find(d => d.user_id === loginName);
                    if (myDoc) {
                        setMyDoctorId(myDoc.doctor_id || myDoc.id);
                        setMessage(''); 
                    } else {
                        setMessage(`⚠️ Warning: Your login ('${loginName}') is not linked to any Doctor in the database.`);
                    }
                }
            } catch (err) { console.error("Error:", err); }
        }
        initDoctorProfile();
        loadPatients();
        loadMedicines();
    }, [loginName]);

    useEffect(() => {
        if (myDoctorId) {
            loadAppointments(myDoctorId);
            loadPrescriptions(myDoctorId); 
        }
    }, [myDoctorId]);

    async function loadAppointments(id) {
        try {
            const res = await fetch(`${API_URL}/appointments/doctor/${id}`);
            if (res.ok) {
                const data = await res.json();
                setAppointments(Array.isArray(data) ? data : []);
            }
        } catch (err) { console.error(err); }
    }

    async function loadPrescriptions(id) {
        try {
            const res = await fetch(`${API_URL}/prescriptions`);
            if (res.ok) {
                const data = await res.json();
                const myPrescriptions = data.filter(p => p.doctor_id === id);
                setPrescriptions(Array.isArray(myPrescriptions) ? myPrescriptions : []);
            }
        } catch (err) { console.error(err); }
    }

    async function loadPatients() {
        try {
            const res = await fetch(`${API_URL}/patients`);
            if (res.ok) {
                const data = await res.json();
                setPatients(Array.isArray(data) ? data : []);
            }
        } catch (err) { console.error(err); }
    }

    async function loadMedicines() {
        try {
            const res = await fetch(`${API_URL}/medicines`);
            if (res.ok) {
                const data = await res.json();
                setMedicines(Array.isArray(data) ? data : []);
            }
        } catch (err) { console.error(err); }
    }

    async function updateAppointmentStatus(id, status) {
        try {
            const res = await fetch(`${API_URL}/appointments/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok && myDoctorId) loadAppointments(myDoctorId);
        } catch (err) { console.error(err); }
    }

    function handleMedicineChange(index, field, value) {
        const updated = [...prescriptionForm.details];
        updated[index][field] = value;
        setPrescriptionForm({ ...prescriptionForm, details: updated });
    }

    function addMedicineRow() {
        setPrescriptionForm({
            ...prescriptionForm,
            details: [...prescriptionForm.details, { medicine_id: '', quantity: '' }]
        });
    }

    async function handlePrescriptionSubmit(e) {
        e.preventDefault();
        
        if (!myDoctorId) {
            setMessage(`❌ Cannot create prescription: No doctor profile found for '${loginName}'.`);
            return;
        }

        try {
            const formattedDetails = prescriptionForm.details.map((d) => ({
                medicine_id: Number(d.medicine_id),
                quantity: Number(d.quantity)
            }));

            const res = await fetch(`${API_URL}/prescriptions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patient_id: Number(prescriptionForm.patient_id),
                    doctor_id: Number(myDoctorId), 
                    date: prescriptionForm.date,
                    details: formattedDetails
                })
            });

            const result = await res.json();

            if (res.ok) {
                setMessage('Prescription created successfully ✅');
                setPrescriptionForm({ patient_id: '', date: '', details: [{ medicine_id: '', quantity: '' }] });
                loadMedicines(); 
                if (myDoctorId) loadPrescriptions(myDoctorId); 
            } else {
                setMessage(result.error || 'Failed to create prescription ❌');
            }
        } catch (err) {
            setMessage('Server error ❌');
        }
    }

    function logout() {
        localStorage.clear();
        window.location.href = '/login';
    }

    const completedAppointments = appointments.filter(a => a.status?.toLowerCase() === 'completed').length;

    const patientIdsFromAppts = appointments.map(a => a.patient_id);
    const patientIdsFromPresc = prescriptions.map(p => p.patient_id);
    const myUniquePatientIds = [...new Set([...patientIdsFromAppts, ...patientIdsFromPresc])];
    const myRealPatients = patients.filter(p => myUniquePatientIds.includes(p.patient_id || p.id));


    return (
        <div style={pageLayout}>
            {/* SIDEBAR */}
            <div style={sidebarStyle}>
                <div style={sidebarHeader}>
                    <div style={sidebarLogo}>🏥</div>
                    <div>
                        <div style={sidebarTitle}>Health Care Hospital</div>
                        <div style={sidebarSub}>Doctor Management</div>
                    </div>
                </div>

                <div style={sidebarNav}>
                    <div style={activeTab === 'Dashboard' ? activeNavItem : navItem} onClick={() => setActiveTab('Dashboard')}>
                        <LayoutDashboard size={24} /> Dashboard
                    </div>
                    <div style={activeTab === 'Appointments' ? activeNavItem : navItem} onClick={() => setActiveTab('Appointments')}>
                        <CalendarCheck size={24} /> My Appointments
                    </div>
                    <div style={activeTab === 'Prescriptions' ? activeNavItem : navItem} onClick={() => setActiveTab('Prescriptions')}>
                        <Pill size={24} /> Prescriptions
                    </div>
                    <div style={activeTab === 'Patients' ? activeNavItem : navItem} onClick={() => setActiveTab('Patients')}>
                        <Users size={24} /> Patients
                    </div>
                    <div style={activeTab === 'Records' ? activeNavItem : navItem} onClick={() => setActiveTab('Records')}>
                        <FileText size={24} /> Medical Records
                    </div>
                </div>

                <div style={sidebarProfileSection}>
                    <div style={profileInfo}>
                        <div style={profileAvatar}>👨‍⚕️</div>
                        <div>
                            <div style={profileName}>Doctor</div>
                            <div style={profileRole}>{loginName}</div>
                        </div>
                    </div>
                    <button onClick={logout} style={sidebarLogoutBtn}>
                        <LogOut size={18} /> Log Out
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div style={mainContentStyle}>
                
                <div style={headerStyle}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '28px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '800' }}>
                            👩‍⚕️ Doctor Panel
                        </h1>
                        <p style={{ marginTop: '8px', opacity: 0.9, fontSize: '16px' }}>
                            Manage appointments and create prescriptions
                            <span style={debugBadge}>Logged in as: {loginName}</span>
                        </p>
                    </div>
                </div>

                {message && (
                    <div style={{...messageStyle, color: message.includes('❌') || message.includes('⚠️') ? '#dc2626' : '#0f766e', background: message.includes('❌') || message.includes('⚠️') ? '#fef2f2' : '#ecfeff'}}>
                        {message}
                    </div>
                )}

                {/* TAB: DASHBOARD */}
                {activeTab === 'Dashboard' && (
                    <>
                        <div style={statsGrid}>
                            <div style={cardStyle}>
                                <div style={cardHeader}><CalendarCheck size={28} color="#64748b" /> <span style={cardTitle}>Appointments</span></div>
                                <div style={cardValue}>{appointments.length}</div>
                            </div>
                            <div style={cardStyle}>
                                <div style={cardHeader}><div style={greenIconBox}>✓</div> <span style={cardTitle}>Completed</span></div>
                                <div style={cardValue}>{completedAppointments}</div>
                            </div>
                            <div style={cardStyle}>
                                <div style={cardHeader}><FileText size={28} color="#0284c7" /> <span style={cardTitle}>Prescriptions</span></div>
                                <div style={cardValue}>{prescriptions.length}</div>
                            </div>
                            <div style={cardStyle}>
                                <div style={cardHeader}><Pill size={28} color="#ef4444" /> <span style={cardTitle}>Medicines</span></div>
                                <div style={cardValue}>{medicines.length}</div>
                            </div>
                        </div>

                        <div style={panelStyle}>
                            <h2 style={sectionTitle}>📋 Today's Appointments</h2>
                            {appointments.length > 0 ? (
                                <table style={tableStyle}>
                                    <thead>
                                        <tr style={tableHeaderRow}>
                                            <th style={tableHead}>Patient Name</th>
                                            <th style={tableHead}>Date</th>
                                            <th style={tableHead}>Status</th>
                                            <th style={tableHead}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.slice(0, 5).map((a) => {
                                            const isComplete = a.status?.toLowerCase() === 'completed';
                                            return (
                                                <tr key={a.appointment_id || a.id}>
                                                    <td style={tableData}>{a.patient_name || a.patient_id}</td>
                                                    <td style={tableData}>{new Date(a.date).toLocaleDateString()}</td>
                                                    <td style={tableData}>
                                                        <span style={{
                                                            padding: '6px 14px', 
                                                            borderRadius: '20px', 
                                                            fontSize: '14px', 
                                                            fontWeight: 'bold', 
                                                            textTransform: 'uppercase',
                                                            background: isComplete ? '#dcfce7' : '#ffedd5',
                                                            color: isComplete ? '#166534' : '#9a3412'
                                                        }}>
                                                            {a.status || 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td style={tableData}>
                                                        {!isComplete && (
                                                            <button onClick={() => updateAppointmentStatus(a.appointment_id || a.id, 'Completed')} style={tealBtnStyle}>Mark Complete</button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            ) : <p style={{ color: '#64748b', fontSize: '16px' }}>No appointments scheduled for you currently.</p>}
                        </div>
                    </>
                )}

                {/* TAB: APPOINTMENTS */}
                {activeTab === 'Appointments' && (
                    <div style={panelStyle}>
                        <h2 style={sectionTitle}>📋 All Appointments</h2>
                        <table style={tableStyle}>
                            <thead>
                                <tr style={tableHeaderRow}>
                                    <th style={tableHead}>Patient Name</th>
                                    <th style={tableHead}>Date</th>
                                    <th style={tableHead}>Time</th>
                                    <th style={tableHead}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((a) => {
                                    const isComplete = a.status?.toLowerCase() === 'completed';
                                    return (
                                        <tr key={a.appointment_id || a.id}>
                                            <td style={tableData}>{a.patient_name || a.patient_id}</td>
                                            <td style={tableData}>{new Date(a.date).toLocaleDateString()}</td>
                                            <td style={tableData}>{a.time || 'N/A'}</td>
                                            <td style={tableData}>
                                                <span style={{
                                                    padding: '6px 14px', 
                                                    borderRadius: '20px', 
                                                    fontSize: '14px', 
                                                    fontWeight: 'bold', 
                                                    textTransform: 'uppercase',
                                                    background: isComplete ? '#dcfce7' : '#ffedd5',
                                                    color: isComplete ? '#166534' : '#9a3412'
                                                }}>
                                                    {a.status || 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* TAB: PRESCRIPTIONS */}
                {activeTab === 'Prescriptions' && (
                    <div style={panelStyle}>
                        <h2 style={sectionTitle}>💊 Create New Prescription</h2>
                        <form onSubmit={handlePrescriptionSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                                <select value={prescriptionForm.patient_id} onChange={(e) => setPrescriptionForm({ ...prescriptionForm, patient_id: e.target.value })} required style={inputStyle}>
                                    <option value="">-- Select Patient --</option>
                                    {patients.length > 0 ? patients.map((p) => <option key={p.patient_id || p.id} value={p.patient_id || p.id}>{p.name} (Age: {p.age})</option>) : <option disabled>No patients in database...</option>}
                                </select>
                                <input type="date" value={prescriptionForm.date} onChange={(e) => setPrescriptionForm({ ...prescriptionForm, date: e.target.value })} required style={inputStyle} />
                            </div>

                            {prescriptionForm.details.map((d, index) => (
                                <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                    <select value={d.medicine_id} onChange={(e) => handleMedicineChange(index, 'medicine_id', e.target.value)} required style={inputStyle}>
                                        <option value="">-- Select Medicine --</option>
                                        {medicines.map((m) => <option key={m.medicine_id || m.id} value={m.medicine_id || m.id}>{m.name} | Rs. {m.price} | Stock: {m.quantity}</option>)}
                                    </select>
                                    <input type="number" placeholder="Quantity" value={d.quantity} onChange={(e) => handleMedicineChange(index, 'quantity', e.target.value)} required style={inputStyle} />
                                </div>
                            ))}

                            <button type="button" onClick={addMedicineRow} style={blueBtnStyle}>+ Add Medicine</button>
                            <br /><br />
                            <button type="submit" style={{...tealBtnStyle, width: '100%', padding: '16px'}}>Create Prescription</button>
                        </form>
                    </div>
                )}

                {/* TAB: PATIENTS */}
                {activeTab === 'Patients' && (
                    <div style={panelStyle}>
                        <h2 style={sectionTitle}>👥 My Patients Directory</h2>
                        {myRealPatients.length > 0 ? (
                            <table style={tableStyle}>
                                <thead>
                                    <tr style={tableHeaderRow}>
                                        <th style={tableHead}>Name</th>
                                        <th style={tableHead}>Age</th>
                                        <th style={tableHead}>Phone</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myRealPatients.map(p => (
                                        <tr key={p.patient_id || p.id}>
                                            <td style={{...tableData, fontWeight: 'bold'}}>{p.name}</td>
                                            <td style={tableData}>{p.age} yrs</td>
                                            <td style={tableData}>{p.phone || 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p style={{ color: '#64748b', fontSize: '16px' }}>You do not have any active patients in your directory yet.</p>
                        )}
                    </div>
                )}

                {/* TAB: RECORDS */}
                {activeTab === 'Records' && (
                    <div style={panelStyle}>
                        <h2 style={sectionTitle}>📄 Patient Medical Records</h2>
                        
                        {myRealPatients.length > 0 ? (
                            <>
                                <div style={{ marginBottom: '25px' }}>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', color: '#1e293b', fontSize: '16px' }}>
                                        Select Patient to View History:
                                    </label>
                                    <select 
                                        value={selectedRecordPatient} 
                                        onChange={(e) => setSelectedRecordPatient(e.target.value)} 
                                        style={{...inputStyle, maxWidth: '500px'}}
                                    >
                                        <option value="">-- Choose a Patient --</option>
                                        {myRealPatients.map(p => (
                                            <option key={p.patient_id || p.id} value={p.patient_id || p.id}>
                                                {p.name} (Phone: {p.phone || 'N/A'})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {selectedRecordPatient ? (
                                    <div style={{ marginTop: '40px' }}>
                                        <h3 style={{ borderBottom: '3px solid #e2e8f0', paddingBottom: '10px', color: '#0284c7', fontSize: '20px' }}>Appointment History</h3>
                                        <table style={{...tableStyle, marginBottom: '40px'}}>
                                            <thead>
                                                <tr style={tableHeaderRow}>
                                                    <th style={tableHead}>Date</th>
                                                    <th style={tableHead}>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {appointments.filter(a => String(a.patient_id) === String(selectedRecordPatient)).length > 0 ? (
                                                    appointments.filter(a => String(a.patient_id) === String(selectedRecordPatient)).map(a => {
                                                        const isComplete = a.status?.toLowerCase() === 'completed';
                                                        return(
                                                            <tr key={a.appointment_id || a.id}>
                                                                <td style={tableData}>{new Date(a.date).toLocaleDateString()}</td>
                                                                <td style={tableData}>
                                                                    <span style={{
                                                                        padding: '6px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase',
                                                                        background: isComplete ? '#dcfce7' : '#ffedd5', color: isComplete ? '#166534' : '#9a3412'
                                                                    }}>
                                                                        {a.status || 'Pending'}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                ) : <tr><td colSpan="2" style={tableData}>No appointments found for this patient.</td></tr>}
                                            </tbody>
                                        </table>

                                        <h3 style={{ borderBottom: '3px solid #e2e8f0', paddingBottom: '10px', color: '#0f766e', fontSize: '20px' }}>Prescription History</h3>
                                        <table style={tableStyle}>
                                            <thead>
                                                <tr style={tableHeaderRow}>
                                                    <th style={tableHead}>Date Issued</th>
                                                    <th style={tableHead}>Prescription ID</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {prescriptions.filter(p => String(p.patient_id) === String(selectedRecordPatient)).length > 0 ? (
                                                    prescriptions.filter(p => String(p.patient_id) === String(selectedRecordPatient)).map(p => (
                                                        <tr key={p.prescription_id || p.id}>
                                                            <td style={tableData}>{new Date(p.date).toLocaleDateString()}</td>
                                                            <td style={{...tableData, fontWeight: 'bold'}}>#PR-{p.prescription_id || p.id}</td>
                                                        </tr>
                                                    ))
                                                ) : <tr><td colSpan="2" style={tableData}>No prescriptions found for this patient.</td></tr>}
                                            </tbody>
                                        </table>

                                    </div>
                                ) : (
                                    <div style={{ padding: '40px', textAlign: 'center', background: '#f8fafc', borderRadius: '15px', color: '#64748b', marginTop: '20px', fontSize: '16px', border: '2px dashed #e2e8f0' }}>
                                        Please select a patient from the dropdown above to view their medical history.
                                    </div>
                                )}
                            </>
                        ) : (
                            <p style={{ color: '#64748b', fontSize: '16px' }}>You do not have any patients to view records for.</p>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}

/* --- UPDATED STYLES FOR BETTER READABILITY AND HIGHLIGHTS --- */
const pageLayout = { display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" };

const sidebarStyle = { width: '280px', background: '#0a192f', color: 'white', display: 'flex', flexDirection: 'column' };
const sidebarHeader = { padding: '25px 20px', display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid #1e293b' };
const sidebarLogo = { background: '#0ea5e9', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' };
const sidebarTitle = { fontSize: '18px', fontWeight: 'bold' };
const sidebarSub = { fontSize: '14px', color: '#94a3b8', marginTop: '4px' };
const sidebarNav = { padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 };
const navItem = { display: 'flex', alignItems: 'center', gap: '15px', padding: '14px 18px', borderRadius: '10px', color: '#cbd5e1', cursor: 'pointer', fontSize: '16px', transition: '0.2s', fontWeight: '500' };
const activeNavItem = { ...navItem, background: '#0ea5e9', color: 'white', fontWeight: 'bold' };
const sidebarProfileSection = { padding: '25px 20px', borderTop: '1px solid #1e293b' };
const profileInfo = { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' };
const profileAvatar = { width: '48px', height: '48px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' };
const profileName = { fontSize: '16px', fontWeight: 'bold' };
const profileRole = { fontSize: '14px', color: '#94a3b8', marginTop: '4px' };
const sidebarLogoutBtn = { width: '100%', padding: '12px', background: 'transparent', border: '2px solid #334155', color: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' };

const mainContentStyle = { flex: 1, padding: '40px', overflowY: 'auto' };

const headerStyle = { background: 'linear-gradient(to right, #0f766e, #0284c7)', borderRadius: '18px', padding: '30px', color: 'white', marginBottom: '40px', display: 'flex', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' };
const debugBadge = { marginLeft: '20px', background: 'rgba(0,0,0,0.3)', padding: '6px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', letterSpacing: '0.5px' };

const statsGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '25px', marginBottom: '40px' };
const cardStyle = { background: 'white', borderRadius: '18px', padding: '30px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f5f9' };
const cardHeader = { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' };
const cardTitle = { color: '#64748b', fontWeight: 'bold', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' };
const cardValue = { fontSize: '48px', fontWeight: '900', color: '#0f172a' };
const greenIconBox = { background: '#dcfce7', color: '#16a34a', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' };

const panelStyle = { background: 'white', borderRadius: '18px', padding: '35px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f5f9' };
const sectionTitle = { margin: '0 0 30px 0', color: '#1e293b', fontSize: '22px', fontWeight: '800' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const tableHeaderRow = { background: '#f8fafc', borderBottom: '2px solid #e2e8f0' };
const tableHead = { padding: '16px', textAlign: 'left', color: '#334155', fontSize: '16px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' };
const tableData = { padding: '18px 16px', borderBottom: '1px solid #f1f5f9', color: '#1e293b', fontSize: '16px', fontWeight: '500' };

const inputStyle = { padding: '14px 16px', borderRadius: '10px', border: '2px solid #e2e8f0', width: '100%', boxSizing: 'border-box', outline: 'none', background: '#f8fafc', fontSize: '16px', color: '#1e293b', fontWeight: '500' };
const blueBtnStyle = { padding: '12px 20px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', transition: '0.2s' };
const tealBtnStyle = { padding: '12px 24px', background: '#0f766e', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', transition: '0.2s' };
const messageStyle = { padding: '18px', borderRadius: '10px', fontWeight: 'bold', marginBottom: '25px', fontSize: '16px' };