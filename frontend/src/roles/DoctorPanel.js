import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api';

export default function DoctorPanel() {
    const user = JSON.parse(localStorage.getItem('user'));
    const username = user?.username; // We use this to find your true profile

    // We will store your actual integer ID here once we find it
    const [myDoctorId, setMyDoctorId] = useState(null); 
    
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [message, setMessage] = useState('');
    const [prescriptionForm, setPrescriptionForm] = useState({
        patient_id: '',
        date: '',
        details: [
            { medicine_id: '', quantity: '' }
        ]
    });

    // 1. Initial Load: Find the true doctor ID, patients, and medicines
    useEffect(() => {
        async function initDoctorProfile() {
            try {
                const res = await fetch(`${API_URL}/doctors`);
                if (res.ok) {
                    const allDocs = await res.json();
                    // Find the doctor linked to your login username
                    const myDoc = allDocs.find(d => d.user_id === username);
                    
                    if (myDoc) {
                        setMyDoctorId(myDoc.doctor_id || myDoc.id);
                    } else {
                        setMessage('⚠️ Warning: Your login is not linked to a Doctor profile in the Admin dashboard.');
                    }
                }
            } catch (err) {
                console.error("Error fetching doctor profile:", err);
            }
        }

        if (username) initDoctorProfile();
        loadPatients();
        loadMedicines();
    }, [username]);

    // 2. Load Appointments: Only runs AFTER we find your integer ID
    useEffect(() => {
        if (myDoctorId) {
            loadAppointments(myDoctorId);
        }
    }, [myDoctorId]);

    async function loadAppointments(id) {
        try {
            const res = await fetch(`${API_URL}/appointments/doctor/${id}`);
            if (res.ok) {
                const data = await res.json();
                setAppointments(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function loadPatients() {
        try {
            const res = await fetch(`${API_URL}/patients`);
            if (res.ok) {
                const data = await res.json();
                setPatients(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function loadMedicines() {
        try {
            const res = await fetch(`${API_URL}/medicines`);
            if (res.ok) {
                const data = await res.json();
                setMedicines(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function updateAppointmentStatus(id, status) {
        try {
            const res = await fetch(`${API_URL}/appointments/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });

            if (res.ok && myDoctorId) {
                loadAppointments(myDoctorId); // Refresh the list
            }
        } catch (err) {
            console.error(err);
        }
    }

    function handleMedicineChange(index, field, value) {
        const updated = [...prescriptionForm.details];
        updated[index][field] = value;
        setPrescriptionForm({ ...prescriptionForm, details: updated });
    }

    function addMedicineRow() {
        setPrescriptionForm({
            ...prescriptionForm,
            details: [
                ...prescriptionForm.details,
                { medicine_id: '', quantity: '' }
            ]
        });
    }

    async function handlePrescriptionSubmit(e) {
        e.preventDefault();
        setMessage('');

        if (!myDoctorId) {
            setMessage('❌ Cannot create prescription: Your account is not linked to a valid Doctor ID.');
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
                    // ✅ FIXED: Now sends the actual integer ID to the database!
                    doctor_id: Number(myDoctorId), 
                    date: prescriptionForm.date,
                    details: formattedDetails
                })
            });

            const result = await res.json();

            if (res.ok) {
                setMessage('Prescription created successfully ✅');
                setPrescriptionForm({
                    patient_id: '',
                    date: '',
                    details: [{ medicine_id: '', quantity: '' }]
                });
                loadMedicines(); // Refresh stock
            } else {
                setMessage(result.error || 'Failed to create prescription ❌');
            }
        } catch (err) {
            console.error(err);
            setMessage('Server error ❌');
        }
    }

    function logout() {
        localStorage.clear();
        window.location.href = '/login';
    }

    const completedAppointments = appointments.filter(
        a => a.status?.toLowerCase() === 'completed'
    ).length;

    return (
        <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: '30px', fontFamily: "'Segoe UI', sans-serif" }}>
            
            {/* HEADER */}
            <div style={headerStyle}>
                <div>
                    <h1 style={{ margin: 0 }}>👩‍⚕️ Doctor Panel</h1>
                    <p style={{ marginTop: '5px', opacity: 0.9 }}>Manage appointments and create prescriptions</p>
                </div>
                <button onClick={logout} style={logoutBtn}>Logout</button>
            </div>

            {/* STATS */}
            <div style={statsGrid}>
                <div style={cardStyle}>
                    <div style={cardTitle}>📅 Appointments</div>
                    <div style={cardValue}>{appointments.length}</div>
                </div>
                <div style={cardStyle}>
                    <div style={cardTitle}>✅ Completed</div>
                    <div style={cardValue}>{completedAppointments}</div>
                </div>
                <div style={cardStyle}>
                    <div style={cardTitle}>💊 Medicines Available</div>
                    <div style={cardValue}>{medicines.length}</div>
                </div>
            </div>

            {/* APPOINTMENTS */}
            <div style={panelStyle}>
                <h2 style={sectionTitle}>📋 My Appointments</h2>
                {appointments.length > 0 ? (
                    <table style={tableStyle}>
                        <thead>
                            <tr style={tableHeaderRow}>
                                <th style={tableHead}>Patient Name</th>
                                <th style={tableHead}>Date</th>
                                <th style={tableHead}>Time</th>
                                <th style={tableHead}>Status</th>
                                <th style={tableHead}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((a) => (
                                <tr key={a.appointment_id || a.id}>
                                    <td style={tableData}>{a.patient_name || a.patient_id}</td>
                                    <td style={tableData}>{new Date(a.date).toLocaleDateString()}</td>
                                    <td style={tableData}>{a.time || 'N/A'}</td>
                                    <td style={{
                                        ...tableData,
                                        color: a.status?.toLowerCase() === 'completed' ? '#16a34a' : '#ea580c',
                                        fontWeight: 'bold'
                                    }}>
                                        {a.status || 'Pending'}
                                    </td>
                                    <td style={tableData}>
                                        {a.status?.toLowerCase() !== 'completed' && (
                                            <button onClick={() => updateAppointmentStatus(a.appointment_id || a.id, 'Completed')} style={btnStyle}>
                                                Mark Complete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p style={{ color: '#64748b' }}>No appointments scheduled for you currently.</p>
                )}
            </div>

            {/* PRESCRIPTION */}
            <div style={{ ...panelStyle, marginTop: '30px' }}>
                <h2 style={sectionTitle}>💊 Create Prescription</h2>
                <form onSubmit={handlePrescriptionSubmit}>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                        <select
                            value={prescriptionForm.patient_id}
                            onChange={(e) => setPrescriptionForm({ ...prescriptionForm, patient_id: e.target.value })}
                            required
                            style={inputStyle}
                        >
                            <option value="">-- Select Patient --</option>
                            {patients.length > 0 ? (
                                patients.map((p) => (
                                    <option key={p.patient_id || p.id} value={p.patient_id || p.id}>
                                        {p.name} (Age: {p.age})
                                    </option>
                                ))
                            ) : (
                                <option disabled>Loading patients...</option>
                            )}
                        </select>

                        <input
                            type="date"
                            value={prescriptionForm.date}
                            onChange={(e) => setPrescriptionForm({ ...prescriptionForm, date: e.target.value })}
                            required
                            style={inputStyle}
                        />
                    </div>

                    {prescriptionForm.details.map((d, index) => (
                        <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', marginBottom: '15px' }}>
                            <select
                                value={d.medicine_id}
                                onChange={(e) => handleMedicineChange(index, 'medicine_id', e.target.value)}
                                required
                                style={inputStyle}
                            >
                                <option value="">-- Select Medicine --</option>
                                {medicines.map((m) => (
                                    <option key={m.medicine_id || m.id} value={m.medicine_id || m.id}>
                                        {m.name} | Rs. {m.price} | Stock: {m.quantity}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="number"
                                placeholder="Quantity"
                                value={d.quantity}
                                onChange={(e) => handleMedicineChange(index, 'quantity', e.target.value)}
                                required
                                style={inputStyle}
                            />
                        </div>
                    ))}

                    <button type="button" onClick={addMedicineRow} style={secondaryBtn}>
                        + Add Medicine
                    </button>
                    <br /><br />
                    
                    <button type="submit" style={submitBtn}>
                        Create Prescription
                    </button>
                </form>

                {message && (
                    <div style={{...messageStyle, color: message.includes('❌') ? '#dc2626' : '#0f766e', background: message.includes('❌') ? '#fef2f2' : '#ecfeff'}}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

/* STYLES */
const headerStyle = { background: 'linear-gradient(to right, #0f766e, #0284c7)', borderRadius: '24px', padding: '35px', color: 'white', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const logoutBtn = { padding: '12px 22px', border: 'none', borderRadius: '12px', background: 'white', color: '#0f766e', fontWeight: '700', cursor: 'pointer' };
const statsGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' };
const cardStyle = { background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' };
const cardTitle = { color: '#64748b', marginBottom: '10px', fontWeight: 'bold' };
const cardValue = { fontSize: '42px', fontWeight: '800', color: '#0f172a' };
const panelStyle = { background: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' };
const sectionTitle = { marginBottom: '25px', color: '#1e293b' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const tableHeaderRow = { background: '#f1f5f9' };
const tableHead = { padding: '14px', textAlign: 'left', color: '#475569' };
const tableData = { padding: '14px', borderBottom: '1px solid #e2e8f0', color: '#1e293b' };
const inputStyle = { padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', width: '100%', boxSizing: 'border-box', outline: 'none' };
const btnStyle = { padding: '10px 15px', background: '#0f766e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const secondaryBtn = { padding: '12px 18px', border: 'none', borderRadius: '10px', background: '#0284c7', color: 'white', cursor: 'pointer', fontWeight: 'bold' };
const submitBtn = { padding: '14px 20px', border: 'none', borderRadius: '12px', background: 'linear-gradient(to right, #0f766e, #0284c7)', color: 'white', fontWeight: '700', cursor: 'pointer' };
const messageStyle = { marginTop: '20px', padding: '14px', borderRadius: '10px', fontWeight: '600' };