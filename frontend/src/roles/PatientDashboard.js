import { useEffect, useState } from 'react';
import { 
    LayoutDashboard, 
    Calendar, 
    Plus, 
    Pill, 
    CreditCard, 
    LogOut, 
    User, 
    Zap, 
    ChevronRight,
    Building2,
    FolderOpen,
    Search
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function PatientDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [doctors, setDoctors] = useState([]);
    
    const [doctorSearch, setDoctorSearch] = useState(''); 

    const [activeSection, setActiveSection] = useState('dashboard');
    const [message, setMessage] = useState('');
    const [appointmentForm, setAppointmentForm] = useState({
        doctor_id: '',
        date: ''
    });

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.username || user?.user_id; 

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
            
            const profRes = await fetch(`${API_URL}/patients/profile/${username}`);
            if (!profRes.ok) throw new Error('Could not find your patient profile.');
            const profileData = await profRes.json();
            
            const pId = profileData.patient_id || profileData.id;

            let docsData = [];
            const docsRes = await fetch(`${API_URL}/doctors`);
            if (docsRes.ok) {
                docsData = await docsRes.json();
                setDoctors(docsData);
            }

            let medsData = [];
            const medsRes = await fetch(`${API_URL}/medicines`);
            if (medsRes.ok) {
                medsData = await medsRes.json();
            }

            let myAppts = [];
            const apptRes = await fetch(`${API_URL}/appointments`);
            if (apptRes.ok) {
                const allAppts = await apptRes.json();
                myAppts = allAppts.filter(a => String(a.patient_id) === String(pId));
                myAppts = myAppts.map(a => {
                    const doc = docsData.find(d => String(d.doctor_id || d.id) === String(a.doctor_id));
                    return { ...a, doctor_name: a.doctor_name || (doc ? (doc.name || doc.user_id) : 'Specialist') };
                });
            }

            let myPresc = [];
            const prescRes = await fetch(`${API_URL}/prescriptions`);
            if (prescRes.ok) {
                const allPresc = await prescRes.json();
                myPresc = allPresc.filter(p => String(p.patient_id) === String(pId));
                
                myPresc = myPresc.map(p => {
                    const doc = docsData.find(d => String(d.doctor_id || d.id) === String(p.doctor_id));
                    let medNames = 'General Treatment';
                    if (p.details && Array.isArray(p.details)) {
                        medNames = p.details.map(detail => {
                            const med = medsData.find(m => String(m.medicine_id || m.id) === String(detail.medicine_id));
                            return med ? `${med.name} (Qty: ${detail.quantity})` : `Med ID ${detail.medicine_id}`;
                        }).join(', ');
                    } else if (p.medicine_id) {
                         const med = medsData.find(m => String(m.medicine_id || m.id) === String(p.medicine_id));
                         if(med) medNames = med.name;
                    } else if (p.medicine_name) {
                         medNames = p.medicine_name;
                    }

                    return { 
                        ...p, 
                        doctor_name: p.doctor_name || (doc ? (doc.name || doc.user_id) : 'Doctor'),
                        display_medicines: medNames
                    };
                });
            }

            let myBills = [];
            try {
                const billsRes = await fetch(`${API_URL}/bills`);
                if (billsRes.ok) {
                    const allBills = await billsRes.json();
                    myBills = allBills.filter(b => String(b.patient_id || b.patientId) === String(pId));
                }
            } catch (e) {
                console.warn("Bills endpoint not ready yet", e);
            }

            setData({
                patient: profileData,
                appointments: myAppts,
                prescriptions: myPresc,
                bills: myBills
            });

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
                    patient_id: data.patient.patient_id || data.patient.id,
                    doctor_id: appointmentForm.doctor_id,
                    date: appointmentForm.date
                })
            });

            if (res.ok) {
                setMessage('Appointment booked successfully ✅');
                setAppointmentForm({ doctor_id: '', date: '' });
                setDoctorSearch(''); 
                loadInitialData(userId); 
                setActiveSection('appointments'); 
            } else {
                const errData = await res.json();
                setMessage(errData.error || 'Failed to book appointment ❌');
            }
        } catch (error) {
            setMessage('Server error ❌');
        }
    }

    async function updateAppointmentStatus(id, status) {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
        try {
            const res = await fetch(`${API_URL}/appointments/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                loadInitialData(userId); 
            } else {
                alert('Failed to cancel the appointment.');
            }
        } catch (err) {
            console.error(err);
        }
    }

    function handlePaymentClick(billId) {
        alert(`Redirecting to secure payment gateway for Invoice #${billId}...\n\n(This is a placeholder for your future payment integration!)`);
    }

    function logout() {
        localStorage.clear();
        window.location.href = '/login';
    }

    const filteredDoctors = doctors.filter(d => {
        if (!doctorSearch) return true;
        const searchTerm = doctorSearch.toLowerCase().replace(/dr\.?\s*/g, '').trim();
        const nameField = (d.name || d.doctor_name || d.user_id || '').toLowerCase();
        const specField = (d.specialization || d.specialty || '').toLowerCase();
        return nameField.includes(searchTerm) || specField.includes(searchTerm);
    });

    if (loading) return <div style={centerStyle}><h2 style={{ color: '#0284c7', fontSize: '24px' }}>Loading Patient Portal...</h2></div>;

    if (error) {
        return (
            <div style={centerStyle}>
                <div style={{ textAlign: 'center', background: 'white', padding: '50px', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ color: '#dc2626', marginBottom: '25px', fontSize: '28px' }}>{error}</h2>
                    <button onClick={() => window.location.reload()} style={buttonStyle}>Try Again</button>
                    <button onClick={logout} style={{ ...buttonStyle, background: '#64748b', marginLeft: '15px' }}>Logout</button>
                </div>
            </div>
        );
    }

    const initial = data?.patient?.name ? data.patient.name.charAt(0).toUpperCase() : 'U';

    return (
        <div style={pageLayout}>
            {/* SIDEBAR */}
            <div style={sidebarStyle}>
                <div style={sidebarHeader}>
                    <div style={sidebarLogo}><Building2 size={24} color="white" /></div>
                    <div>
                        <div style={sidebarTitle}>Health Care Hospital</div>
                        <div style={sidebarSub}>Patient Portal</div>
                    </div>
                </div>

                <div style={sidebarNav}>
                    <div style={activeSection === 'dashboard' ? activeNavItem : navItem} onClick={() => setActiveSection('dashboard')}>
                        <LayoutDashboard size={22} /> Dashboard
                    </div>
                    <div style={activeSection === 'appointments' ? activeNavItem : navItem} onClick={() => setActiveSection('appointments')}>
                        <Calendar size={22} /> Appointments
                    </div>
                    <div style={activeSection === 'book' ? activeNavItem : navItem} onClick={() => setActiveSection('book')}>
                        <Plus size={22} /> Book Now
                    </div>
                    <div style={activeSection === 'history' ? activeNavItem : navItem} onClick={() => setActiveSection('history')}>
                        <Pill size={22} /> History
                    </div>
                    <div style={activeSection === 'bills' ? activeNavItem : navItem} onClick={() => setActiveSection('bills')}>
                        <CreditCard size={22} /> Bills
                    </div>
                </div>

                <div style={sidebarProfileSection}>
                    <div style={profileInfo}>
                        <div style={profileAvatar}>{initial}</div>
                        <div>
                            <div style={profileName}>{data?.patient?.name || 'User'}</div>
                            <div style={profileRole}>Patient</div>
                        </div>
                    </div>
                    <button onClick={logout} style={sidebarLogoutBtn}>
                        <LogOut size={18} /> Log Out
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div style={mainContentStyle}>
                
                {/* WELCOME BANNER */}
                <div style={bannerStyle}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '36px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '800' }}>
                            👋 Welcome, {data?.patient?.name || 'Patient'}!
                        </h1>
                        <p style={{ marginTop: '10px', opacity: 0.9, fontSize: '18px' }}>
                            Check your health status and manage your records.
                        </p>
                    </div>
                    <div style={bannerDecoration}>
                        <div style={shieldShape}><Plus size={40} color="#0284c7" /></div>
                        <div style={heartShape}>❤️</div>
                    </div>
                </div>

                {/* DASHBOARD VIEW */}
                {activeSection === 'dashboard' && (
                    <>
                        <div style={statsGrid}>
                            <div style={statsCard}>
                                <div style={{...iconBox, background: '#dcfce7', color: '#16a34a'}}><Calendar size={28} /></div>
                                <div>
                                    <div style={statLabel}>ACTIVE APPOINTMENTS</div>
                                    <div style={statValue}>{data?.appointments?.filter(a => a.status?.toLowerCase() !== 'cancelled').length || 0}</div>
                                    <div style={statSub}>{data?.appointments?.length ? 'View in Appointments tab' : 'No upcoming appointments'}</div>
                                </div>
                            </div>
                            <div style={statsCard}>
                                <div style={{...iconBox, background: '#e0f2fe', color: '#0284c7'}}><FolderOpen size={28} /></div>
                                <div>
                                    <div style={statLabel}>MEDICAL RECORDS</div>
                                    <div style={statValue}>{data?.prescriptions?.length || 0}</div>
                                    <div style={statSub}>{data?.prescriptions?.length ? 'View in History tab' : 'No records available'}</div>
                                </div>
                            </div>
                            <div style={statsCard}>
                                <div style={{...iconBox, background: '#ffedd5', color: '#ea580c'}}><CreditCard size={28} /></div>
                                <div>
                                    <div style={statLabel}>TOTAL BILLS</div>
                                    <div style={statValue}>{data?.bills?.length || 0}</div>
                                    <div style={statSub}>{data?.bills?.length ? 'View in Bills tab' : 'No pending bills'}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '40px' }}>
                            <div style={sectionHeader}>
                                <User size={28} color="#475569" />
                                <div>
                                    <h2 style={sectionTitle}>Profile Details</h2>
                                    <p style={sectionSub}>View and manage your personal information.</p>
                                </div>
                            </div>
                            <div style={infoGrid}>
                                <div style={infoBox}>
                                    <p style={infoLabel}>FULL NAME</p>
                                    <h3 style={infoValue}>{data?.patient?.name || 'N/A'}</h3>
                                </div>
                                <div style={infoBox}>
                                    <p style={infoLabel}>AGE</p>
                                    <h3 style={infoValue}>{data?.patient?.age ? `${data.patient.age} Years` : 'N/A'}</h3>
                                </div>
                                <div style={infoBox}>
                                    <p style={infoLabel}>PHONE</p>
                                    <h3 style={infoValue}>{data?.patient?.phone || 'N/A'}</h3>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div style={sectionHeader}>
                                <Zap size={28} color="#475569" />
                                <div>
                                    <h2 style={sectionTitle}>Quick Actions</h2>
                                    <p style={sectionSub}>Frequently used actions for easy access.</p>
                                </div>
                            </div>
                            <div style={quickActionsContainer}>
                                <div style={actionRow} onClick={() => setActiveSection('appointments')}>
                                    <div style={{...actionIcon, background: '#dcfce7', color: '#16a34a'}}><Calendar size={24} /></div>
                                    <div style={actionText}>
                                        <div style={actionTitle}>Appointments</div>
                                        <div style={actionSub}>View and manage your appointments</div>
                                    </div>
                                    <ChevronRight color="#94a3b8" size={24} />
                                </div>
                                <div style={actionRow} onClick={() => setActiveSection('book')}>
                                    <div style={{...actionIcon, background: '#f3e8ff', color: '#9333ea'}}><Plus size={24} /></div>
                                    <div style={actionText}>
                                        <div style={actionTitle}>Book Now</div>
                                        <div style={actionSub}>Schedule a new appointment</div>
                                    </div>
                                    <ChevronRight color="#94a3b8" size={24} />
                                </div>
                                <div style={actionRow} onClick={() => setActiveSection('history')}>
                                    <div style={{...actionIcon, background: '#ffe4e6', color: '#db2777'}}><Pill size={24} /></div>
                                    <div style={actionText}>
                                        <div style={actionTitle}>History</div>
                                        <div style={actionSub}>View your appointment and medical history</div>
                                    </div>
                                    <ChevronRight color="#94a3b8" size={24} />
                                </div>
                                <div style={actionRow} onClick={() => setActiveSection('bills')}>
                                    <div style={{...actionIcon, background: '#ffedd5', color: '#ea580c'}}><CreditCard size={24} /></div>
                                    <div style={actionText}>
                                        <div style={actionTitle}>Bills</div>
                                        <div style={actionSub}>View your invoices and payment history</div>
                                    </div>
                                    <ChevronRight color="#94a3b8" size={24} />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* OTHER TABS */}
                {activeSection !== 'dashboard' && (
                    <div style={contentCard}>
                        {activeSection === 'appointments' && (
                            <>
                                <h2 style={cardTitle}>📅 My Scheduled Appointments</h2>
                                {data?.appointments?.length > 0 ? (
                                    <table style={tableStyle}>
                                        <thead>
                                            <tr style={tableHeaderRow}>
                                                <th style={tableHead}>Date</th>
                                                <th style={tableHead}>Doctor</th>
                                                <th style={tableHead}>Status</th>
                                                <th style={tableHead}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.appointments.map((a, i) => {
                                                const isCancelled = a.status?.toLowerCase() === 'cancelled';
                                                const isCompleted = a.status?.toLowerCase() === 'completed';
                                                return (
                                                    <tr key={i}>
                                                        <td style={{...tableData, fontWeight: 'bold'}}>{new Date(a.date).toLocaleDateString()}</td>
                                                        <td style={tableData}>{a.doctor_name || 'Medical Specialist'}</td>
                                                        <td style={tableData}>
                                                            <span style={{
                                                                ...statusBadge,
                                                                background: isCancelled ? '#fee2e2' : (isCompleted ? '#dcfce7' : '#ffedd5'),
                                                                color: isCancelled ? '#991b1b' : (isCompleted ? '#166534' : '#ea580c')
                                                            }}>
                                                                {a.status || 'Pending'}
                                                            </span>
                                                        </td>
                                                        <td style={tableData}>
                                                            {(!isCancelled && !isCompleted) ? (
                                                                <button onClick={() => updateAppointmentStatus(a.appointment_id || a.id, 'Cancelled')} style={cancelBtnStyle}>Cancel</button>
                                                            ) : (
                                                                <span style={{ color: '#94a3b8', fontSize: '15px' }}>-</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                        <p style={{ color: '#64748b', fontSize: '18px', marginBottom: '25px' }}>You have no upcoming appointments.</p>
                                        <button onClick={() => setActiveSection('book')} style={buttonStyle}>Book an Appointment Now</button>
                                    </div>
                                )}
                            </>
                        )}

                        {activeSection === 'book' && (
                            <>
                                <h2 style={cardTitle}>➕ Schedule a New Visit</h2>
                                <form onSubmit={bookAppointment} style={formContainer}>
                                    
                                    <div>
                                        <label style={formLabel}>Search for a Doctor</label>
                                        <div style={searchWrapper}>
                                            <Search size={22} color="#94a3b8" style={searchIcon} />
                                            <input 
                                                type="text" 
                                                placeholder="Search by name or specialty (e.g., Cardiologist)" 
                                                value={doctorSearch}
                                                onChange={(e) => setDoctorSearch(e.target.value)}
                                                style={searchInputStyle}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={formLabel}>Select Specialist</label>
                                        <select 
                                            value={appointmentForm.doctor_id} 
                                            onChange={(e) => setAppointmentForm({...appointmentForm, doctor_id: e.target.value})} 
                                            required style={inputStyle}
                                        >
                                            <option value="">-- Select a Doctor --</option>
                                            {filteredDoctors.map(d => (
                                                <option key={d.doctor_id || d.id} value={d.doctor_id || d.id}>
                                                    {d.name || d.doctor_name || d.user_id || 'Unknown Doctor'} 
                                                    ({d.specialization || d.specialty || 'General'})
                                                </option>
                                            ))}
                                        </select>
                                        {filteredDoctors.length === 0 && (
                                            <p style={{ color: '#ef4444', fontSize: '15px', marginTop: '8px', fontWeight: 'bold' }}>No doctors match your search.</p>
                                        )}
                                    </div>
                                    <div>
                                        <label style={formLabel}>Preferred Date</label>
                                        <input 
                                            type="date" 
                                            value={appointmentForm.date} 
                                            onChange={(e) => setAppointmentForm({...appointmentForm, date: e.target.value})} 
                                            required style={inputStyle} 
                                        />
                                    </div>
                                    <button type="submit" style={{...buttonStyle, width: '100%', padding: '16px'}}>Confirm Appointment</button>
                                </form>
                                {message && <div style={messageStyle}>{message}</div>}
                            </>
                        )}

                        {activeSection === 'history' && (
                            <>
                                <h2 style={cardTitle}>💊 Medical & Prescription History</h2>
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
                                                    <td style={{...tableData, fontWeight: 'bold'}}>{new Date(p.date).toLocaleDateString()}</td>
                                                    <td style={{...tableData, color: '#0f766e', fontWeight: 'bold'}}>{p.display_medicines}</td>
                                                    <td style={tableData}>{p.doctor_name}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                        <p style={{ color: '#64748b', fontSize: '18px' }}>No medical records available for your profile yet.</p>
                                    </div>
                                )}
                            </>
                        )}

                        {activeSection === 'bills' && (
                            <>
                                <h2 style={cardTitle}>💳 Invoices & Payments</h2>
                                {data?.bills?.length > 0 ? (
                                    <table style={tableStyle}>
                                        <thead>
                                            <tr style={tableHeaderRow}>
                                                <th style={tableHead}>Invoice ID</th>
                                                <th style={tableHead}>Date</th>
                                                <th style={tableHead}>Total Amount</th>
                                                <th style={tableHead}>Status</th>
                                                <th style={tableHead}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.bills.map((b, i) => {
                                                const isPaid = (b.status || '').toLowerCase() === 'paid';
                                                return (
                                                    <tr key={b.bill_id || b.id || i}>
                                                        <td style={{...tableData, fontWeight: 'bold', color: '#0284c7'}}>
                                                            #INV-{b.bill_id || b.id || (i + 1000)}
                                                        </td>
                                                        <td style={tableData}>{new Date(b.bill_date || b.date).toLocaleDateString()}</td>
                                                        <td style={{...tableData, fontWeight: '900', fontSize: '18px'}}>Rs. {b.total_amount || b.amount}</td>
                                                        <td style={tableData}>
                                                            <span style={{
                                                                ...statusBadge,
                                                                background: isPaid ? '#dcfce7' : '#ffedd5',
                                                                color: isPaid ? '#16a34a' : '#ea580c'
                                                            }}>
                                                                {(b.status || 'Pending').toUpperCase()}
                                                            </span>
                                                        </td>
                                                        <td style={tableData}>
                                                            {!isPaid ? (
                                                                <button 
                                                                    onClick={() => handlePaymentClick(b.bill_id || b.id || (i + 1000))} 
                                                                    style={payBtnStyle}
                                                                >
                                                                    Pay Now
                                                                </button>
                                                            ) : (
                                                                <span style={{ color: '#94a3b8', fontSize: '15px', fontWeight: 'bold' }}>Completed</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                        <p style={{ color: '#64748b', fontSize: '18px' }}>No billing history found.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// --------------------------------------------------
// UPGRADED STYLES 
// --------------------------------------------------
const pageLayout = { display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" };
const centerStyle = { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f8fafc', fontFamily: "'Segoe UI', sans-serif" };

const sidebarStyle = { width: '300px', background: '#0f172a', color: 'white', display: 'flex', flexDirection: 'column' };
const sidebarHeader = { padding: '30px 25px', display: 'flex', alignItems: 'center', gap: '18px', borderBottom: '1px solid rgba(255,255,255,0.05)' };
const sidebarLogo = { background: '#0ea5e9', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const sidebarTitle = { fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.5px' };
const sidebarSub = { fontSize: '14px', color: '#94a3b8', marginTop: '4px' };
const sidebarNav = { padding: '25px 20px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 };
const navItem = { display: 'flex', alignItems: 'center', gap: '18px', padding: '16px 20px', borderRadius: '12px', color: '#cbd5e1', cursor: 'pointer', fontSize: '17px', transition: '0.2s', fontWeight: '600' };
const activeNavItem = { ...navItem, background: 'linear-gradient(to right, #0ea5e9, #0284c7)', color: 'white', fontWeight: 'bold' };
const sidebarProfileSection = { padding: '25px', borderTop: '1px solid rgba(255,255,255,0.05)' };
const profileInfo = { display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '25px' };
const profileAvatar = { width: '55px', height: '55px', background: '#7e22ce', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 'bold' };
const profileName = { fontSize: '16px', fontWeight: 'bold' };
const profileRole = { fontSize: '14px', color: '#94a3b8', marginTop: '4px' };
const sidebarLogoutBtn = { width: '100%', padding: '14px', background: 'transparent', border: '2px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', transition: '0.2s' };

const mainContentStyle = { flex: 1, padding: '50px', overflowY: 'auto' };

const bannerStyle = { position: 'relative', background: 'linear-gradient(to right, #0f766e, #0284c7)', borderRadius: '20px', padding: '45px 50px', color: 'white', marginBottom: '40px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', overflow: 'hidden' };
const bannerDecoration = { position: 'absolute', right: '60px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' };
const shieldShape = { width: '100px', height: '110px', background: 'white', borderRadius: '15px 15px 50px 50px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 15px 25px rgba(0,0,0,0.15)' };
const heartShape = { position: 'absolute', bottom: '-10px', right: '-15px', fontSize: '38px', background: '#fecdd3', borderRadius: '50%', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' };

const statsGrid = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '50px' };
const statsCard = { background: 'white', padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' };
const iconBox = { width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const statLabel = { fontSize: '14px', color: '#64748b', fontWeight: 'bold', letterSpacing: '1px' };
const statValue = { fontSize: '48px', fontWeight: '900', color: '#0f172a', margin: '8px 0' };
const statSub = { fontSize: '15px', color: '#94a3b8' };

const sectionHeader = { display: 'flex', alignItems: 'flex-start', gap: '18px', marginBottom: '25px' };
const sectionTitle = { margin: 0, fontSize: '24px', fontWeight: '900', color: '#0f172a' };
const sectionSub = { margin: '8px 0 0 0', fontSize: '16px', color: '#64748b' };

const infoGrid = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px' };
const infoBox = { background: 'white', padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' };
const infoLabel = { color: '#64748b', fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px', margin: '0 0 12px 0' };
const infoValue = { fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: 0 };

const quickActionsContainer = { display: 'flex', flexDirection: 'column', gap: '16px', background: 'white', padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' };
const actionRow = { display: 'flex', alignItems: 'center', gap: '25px', padding: '20px', borderRadius: '16px', cursor: 'pointer', transition: 'background 0.2s', border: '1px solid #f1f5f9' };
const actionIcon = { width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const actionText = { flex: 1 };
const actionTitle = { fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' };
const actionSub = { fontSize: '15px', color: '#64748b' };

const contentCard = { background: 'white', padding: '45px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' };
const cardTitle = { margin: '0 0 35px 0', fontSize: '26px', fontWeight: '900', color: '#0f172a' };
const emptyText = { color: '#64748b', fontSize: '16px' };

const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const tableHeaderRow = { borderBottom: '3px solid #e2e8f0' };
const tableHead = { padding: '18px 12px', color: '#475569', fontSize: '15px', fontWeight: '800', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.5px' };
const tableData = { padding: '20px 12px', borderBottom: '1px solid #f1f5f9', color: '#1e293b', fontSize: '16px', fontWeight: '500' };
const statusBadge = { background: '#dcfce7', color: '#166534', padding: '8px 16px', borderRadius: '30px', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' };
const cancelBtnStyle = { padding: '10px 18px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: '0.2s' };
const payBtnStyle = { padding: '10px 20px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' };

const formContainer = { display: 'flex', flexDirection: 'column', gap: '25px', maxWidth: '600px' };
const formLabel = { display: 'block', fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '10px' };

const searchWrapper = { position: 'relative', display: 'flex', alignItems: 'center' };
const searchIcon = { position: 'absolute', left: '16px' };
const searchInputStyle = { width: '100%', padding: '16px 16px 16px 48px', borderRadius: '12px', border: '2px solid #e2e8f0', outline: 'none', background: '#f8fafc', fontSize: '16px', color: '#1e293b', boxSizing: 'border-box', fontWeight: '500' };

const inputStyle = { width: '100%', padding: '16px', borderRadius: '12px', border: '2px solid #e2e8f0', outline: 'none', background: '#f8fafc', fontSize: '16px', color: '#1e293b', fontWeight: '500' };
const buttonStyle = { padding: '16px 28px', border: 'none', borderRadius: '12px', background: '#0ea5e9', color: 'white', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', marginTop: '15px' };
const messageStyle = { marginTop: '25px', padding: '18px', borderRadius: '12px', background: '#f0fdf4', color: '#166534', fontWeight: 'bold', border: '2px solid #bbf7d0', fontSize: '16px' };