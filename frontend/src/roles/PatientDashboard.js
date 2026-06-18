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


import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

    
    // PDF GENERATION FUNCTION 

    const handleDownloadPdf = async (billId) => {
        const invoiceElement = document.getElementById(`invoice-${billId}`);
        
        if (!invoiceElement) {
            alert("Could not find invoice document.");
            return;
        }

        try {
            // Create a canvas from the HTML element
            const canvas = await html2canvas(invoiceElement, { 
                scale: 2, 
                useCORS: true,
                backgroundColor: '#ffffff'
            });
            
            const imgData = canvas.toDataURL('image/png');
            
            // Generate PDF
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`MediCare_Invoice_INV-${billId}.pdf`);
            
        } catch (error) {
            console.error("PDF Generation Error:", error);
            alert("Failed to generate PDF. Please try again.");
        }
    };

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
    const patientName = data?.patient?.name || 'Patient';

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
                                                const billId = b.bill_id || b.id || (i + 1000);
                                                const isPaid = (b.status || '').toLowerCase() === 'paid';
                                                
                                                return (
                                                    <tr key={billId}>
                                                        <td style={{...tableData, fontWeight: 'bold', color: '#0284c7'}}>
                                                            #INV-{billId}
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
                                                                    onClick={() => handlePaymentClick(billId)} 
                                                                    style={payBtnStyle}
                                                                >
                                                                    Pay Now
                                                                </button>
                                                            ) : (
                                                                <span style={{ color: '#94a3b8', fontSize: '15px', fontWeight: 'bold' }}>Completed</span>
                                                            )}

                                                            {/* PDF Download Button */}
                                                            <button 
                                                                onClick={() => handleDownloadPdf(billId)} 
                                                                style={{...payBtnStyle, background: '#0f172a', marginLeft: '10px'}}
                                                            >
                                                                Download PDF
                                                            </button>

                                                            {/* HIDDEN INVOICE TEMPLATE (This will be converted to PDF) */}
                                                            <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
                                                                <div id={`invoice-${billId}`} style={{ padding: '40px', width: '800px', background: 'white', color: 'black', fontFamily: 'Arial, sans-serif' }}>
                                                                    
                                                                    {/* Hospital Header */}
                                                                    <div style={{ borderBottom: '3px solid #0d9488', paddingBottom: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                        <div>
                                                                            <h1 style={{ color: '#0d9488', margin: 0, fontSize: '32px' }}>MediCare Hospital</h1>
                                                                            <p style={{ margin: '5px 0 0 0', color: '#64748b' }}>123 Health Avenue, Colombo, Sri Lanka</p>
                                                                            <p style={{ margin: '0', color: '#64748b' }}>Tel: +94 11 234 5678 | Web: www.medicare.lk</p>
                                                                        </div>
                                                                        <div style={{ textAlign: 'right' }}>
                                                                            <h2 style={{ margin: 0, fontSize: '28px', color: '#0f172a' }}>INVOICE</h2>
                                                                            <p style={{ margin: '5px 0 0 0', fontWeight: 'bold' }}>#INV-{billId}</p>
                                                                        </div>
                                                                    </div>

                                                                    {/* Patient & Bill Info */}
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                                                                        <div>
                                                                            <h4 style={{ color: '#94a3b8', margin: '0 0 5px 0' }}>Billed To:</h4>
                                                                            <h3 style={{ margin: 0, fontSize: '20px' }}>{patientName}</h3>
                                                                            <p style={{ margin: '5px 0 0 0' }}>Patient ID: {data?.patient?.patient_id || data?.patient?.id || 'N/A'}</p>
                                                                        </div>
                                                                        <div style={{ textAlign: 'right' }}>
                                                                            <p style={{ margin: '0 0 5px 0' }}><strong>Date Issued:</strong> {new Date(b.bill_date || b.date).toLocaleDateString()}</p>
                                                                            <p style={{ margin: '0' }}>
                                                                                <strong>Status:</strong> 
                                                                                <span style={{ color: isPaid ? '#16a34a' : '#ea580c', marginLeft: '5px' }}>
                                                                                    {b.status ? b.status.toUpperCase() : 'PENDING'}
                                                                                </span>
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    {/* Bill Items Table (Placeholder/General) */}
                                                                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
                                                                        <thead>
                                                                            <tr style={{ background: '#f1f5f9' }}>
                                                                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #cbd5e1' }}>Description</th>
                                                                                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #cbd5e1' }}>Amount</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            <tr>
                                                                                <td style={{ padding: '15px 12px', borderBottom: '1px solid #e2e8f0' }}>Medical Services / Treatment Fees</td>
                                                                                <td style={{ padding: '15px 12px', textAlign: 'right', borderBottom: '1px solid #e2e8f0' }}>Rs. {b.total_amount || b.amount}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td style={{ padding: '15px 12px', borderBottom: '1px solid #e2e8f0' }}>Hospital Admin Charges</td>
                                                                                <td style={{ padding: '15px 12px', textAlign: 'right', borderBottom: '1px solid #e2e8f0' }}>Rs. 0.00</td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>

                                                                    {/* Total Amount Box */}
                                                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                        <div style={{ background: '#f8fafc', padding: '20px 30px', borderRadius: '10px', minWidth: '250px', border: '1px solid #e2e8f0' }}>
                                                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                                                <span>Subtotal:</span>
                                                                                <span>Rs. {b.total_amount || b.amount}</span>
                                                                            </div>
                                                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '22px', fontWeight: 'bold', borderTop: '2px solid #cbd5e1', paddingTop: '10px', marginTop: '10px' }}>
                                                                                <span>Total:</span>
                                                                                <span style={{ color: '#0f172a' }}>Rs. {b.total_amount || b.amount}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Footer Note */}
                                                                    <div style={{ marginTop: '60px', textAlign: 'center', color: '#64748b', fontSize: '14px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                                                                        <p style={{ margin: 0 }}>Thank you for trusting MediCare Hospital.</p>
                                                                        <p style={{ margin: '5px 0 0 0', fontSize: '12px' }}>This is a computer-generated document and requires no signature.</p>
                                                                    </div>
                                                                    
                                                                </div>
                                                            </div>
                                                            {/* END OF HIDDEN INVOICE */}

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


// css 

const pageLayout = {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', sans-serif",
    background: '#f8fafc'
};

const centerStyle = {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f8fafc'
};

// SIDEBAR

const sidebarStyle = {
    width: 250,
    background: '#0d1f2d',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    padding: '28px 0',
    flexShrink: 0,
    position: 'sticky',
    top: 0,
    height: '100vh'
};

const sidebarHeader = {
    padding: '0 24px 32px',
    display: 'flex',
    alignItems: 'center',
    gap: 12
};

const sidebarLogo = {
    width: 42,
    height: 42,
    borderRadius: 10,
    background: 'linear-gradient(135deg, #0d9488, #0284c7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const sidebarTitle = {
    fontWeight: 700,
    fontSize: 15,
    lineHeight: 1.2
};

const sidebarSub = {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4
};

const sidebarNav = {
    flex: 1,
    padding: '0 16px'
};

const navItem = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    borderRadius: 10,
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: 15,
    marginBottom: 6,
    transition: '0.2s'
};

const activeNavItem = {
    ...navItem,
    background: 'linear-gradient(135deg, #0d9488, #0284c7)',
    color: 'white'
};

const sidebarProfileSection = {
    padding: '20px 24px',
    borderTop: '1px solid rgba(255,255,255,0.08)'
};

const profileInfo = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18
};

const profileAvatar = {
    width: 42,
    height: 42,
    borderRadius: '50%',
    background: '#334155',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 700
};

const profileName = {
    fontWeight: 600,
    fontSize: 15
};

const profileRole = {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2
};

const sidebarLogoutBtn = {
    width: '100%',
    padding: '12px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'transparent',
    color: 'rgba(255,255,255,0.8)',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
};

// MAIN

const mainContentStyle = {
    flex: 1,
    padding: '40px 48px',
    overflow: 'auto'
};

// BANNER

const bannerStyle = {
    background: 'linear-gradient(135deg, #0d9488, #0284c7)',
    borderRadius: 20,
    padding: '40px',
    color: 'white',
    marginBottom: 36,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 10px 25px rgba(2,132,199,0.15)'
};

const bannerDecoration = {
    position: 'relative'
};

const shieldShape = {
    width: 90,
    height: 90,
    borderRadius: 20,
    background: 'rgba(255,255,255,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)'
};

const heartShape = {
    position: 'absolute',
    bottom: -10,
    right: -10,
    fontSize: 28
};

// STATS

const statsGrid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 24,
    marginBottom: 36
};

const statsCard = {
    background: 'white',
    borderRadius: 16,
    border: '1px solid #e2e8f0',
    padding: '24px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
    display: 'flex',
    alignItems: 'center',
    gap: 18
};

const iconBox = {
    width: 54,
    height: 54,
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const statLabel = {
    fontSize: 14,
    fontWeight: 600,
    color: '#64748b'
};

const statValue = {
    fontSize: 38,
    fontWeight: 800,
    color: '#0f172a',
    lineHeight: 1
};

const statSub = {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 8
};

// SECTIONS

const sectionHeader = {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 24
};

const sectionTitle = {
    margin: 0,
    fontWeight: 800,
    fontSize: 22,
    color: '#0f172a'
};

const sectionSub = {
    marginTop: 4,
    fontSize: 14,
    color: '#64748b'
};

// INFO GRID

const infoGrid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 24,
    marginBottom: 36
};

const infoBox = {
    background: 'white',
    borderRadius: 16,
    border: '1px solid #e2e8f0',
    padding: '24px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
};

const infoLabel = {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 10,
    fontWeight: 700
};

const infoValue = {
    fontSize: 24,
    fontWeight: 800,
    color: '#0f172a',
    margin: 0
};

// QUICK ACTIONS

const quickActionsContainer = {
    background: 'white',
    borderRadius: 20,
    border: '1px solid #e2e8f0',
    padding: '28px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
};

const actionRow = {
    display: 'flex',
    alignItems: 'center',
    gap: 18,
    padding: '18px',
    borderRadius: 14,
    border: '1px solid #f1f5f9',
    marginBottom: 14,
    cursor: 'pointer'
};

const actionIcon = {
    width: 54,
    height: 54,
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const actionText = {
    flex: 1
};

const actionTitle = {
    fontWeight: 700,
    color: '#0f172a',
    fontSize: 16
};

const actionSub = {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4
};

// CONTENT CARD

const contentCard = {
    background: 'white',
    borderRadius: 20,
    border: '1px solid #e2e8f0',
    padding: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
};

const cardTitle = {
    marginBottom: 28,
    fontWeight: 800,
    fontSize: 24,
    color: '#0f172a'
};

// TABLES

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
};

const tableHeaderRow = {
    borderBottom: '2px solid #f1f5f9'
};

const tableHead = {
    padding: '14px 16px',
    textAlign: 'left',
    fontSize: 14,
    color: '#475569',
    fontWeight: 700
};

const tableData = {
    padding: '16px',
    fontSize: 15,
    color: '#1e293b',
    fontWeight: 500,
    borderBottom: '1px solid #f8fafc'
};

const statusBadge = {
    padding: '6px 14px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 700
};

const cancelBtnStyle = {
    padding: '10px 16px',
    borderRadius: 10,
    border: 'none',
    background: '#fee2e2',
    color: '#991b1b',
    cursor: 'pointer',
    fontWeight: 700
};

const payBtnStyle = {
    padding: '10px 18px',
    borderRadius: 10,
    border: 'none',
    background: 'linear-gradient(to right, #0d9488, #0284c7)',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 700
};

// FORM

const formContainer = {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    maxWidth: 600
};

const formLabel = {
    display: 'block',
    fontSize: 14,
    color: '#334155',
    marginBottom: 8,
    fontWeight: 600
};

const searchWrapper = {
    position: 'relative'
};

const searchIcon = {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: 'translateY(-50%)'
};

const searchInputStyle = {
    width: '100%',
    padding: '14px 18px 14px 48px',
    borderRadius: 12,
    border: '1px solid #cbd5e1',
    background: '#f8fafc',
    fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box',
    color: '#0f172a'
};

const inputStyle = {
    width: '100%',
    padding: '14px 18px',
    borderRadius: 12,
    border: '1px solid #cbd5e1',
    background: '#f8fafc',
    fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box',
    color: '#0f172a'
};

const buttonStyle = {
    padding: '16px',
    border: 'none',
    borderRadius: 12,
    background: 'linear-gradient(to right, #0d9488, #0284c7)',
    color: 'white',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
    boxShadow: '0 4px 12px rgba(2,132,199,0.2)'
};

const messageStyle = {
    marginTop: 20,
    padding: '14px',
    borderRadius: 10,
    textAlign: 'center',
    background: '#ecfdf5',
    color: '#065f46',
    fontWeight: 700,
    fontSize: 15
};