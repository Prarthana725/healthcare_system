import React, { useEffect, useState } from 'react';
import { 
    LayoutDashboard, 
    CalendarDays, 
    Plus, 
    History, 
    CreditCard, 
    LogOut, 
    Users, 
    UserPlus, 
    Phone, 
    Calendar,
    Wallet,
    Hourglass,
    Building2,
    ChevronDown,
    Search
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function ReceptionistDashboard() {
    // --- STATE ---
    const [activeTab, setActiveTab] = useState('dashboard');
    const [patients, setPatients] = useState([]);
    const [inactivePatients, setInactivePatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [bills, setBills] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState({});
    const [paymentAmounts, setPaymentAmounts] = useState({});
    
    // Search states for full pages
    const [searchPatient, setSearchPatient] = useState('');
    const [searchAppt, setSearchAppt] = useState('');
    const [searchBill, setSearchBill] = useState('');

    const [form, setForm] = useState({ name: '', age: '', phone: '' });
    const [appointmentForm, setAppointmentForm] = useState({ patient_id: '', doctor_id: '', date: '' });
    const [message, setMessage] = useState('');
    const [editingPatient, setEditingPatient] = useState(null);
    const [selectedBill, setSelectedBill] = useState(null);
    const [showInvoice, setShowInvoice] = useState(false);

    // --- INIT ---
    useEffect(() => {
        loadAllData();
    }, []);

    // --- FETCH DATA ---
    async function loadInactivePatients() {

    try {

        const res = await fetch(
            `${API_URL}/patients/inactive`
        );

        const data = await res.json();

        setInactivePatients(data);

    } catch (err) {

        console.error(err);
    }
}
async function restorePatient(id) {

    try {

        const res = await fetch(
            `${API_URL}/patients/${id}/restore`,
            {
                method: 'PUT'
            }
        );

        const data =
            await res.json();

        if (res.ok) {

            setMessage(
                'Patient restored successfully ✅'
            );

            loadAllData();

        } else {

            setMessage(
                data.message ||
                'Restore failed ❌'
            );
        }

    } catch (err) {

        console.error(err);

        setMessage(
            'Server Error ❌'
        );
    }

    setTimeout(
        () => setMessage(''),
        5000
    );
}
    async function loadAllData() {
        try {
            await loadInactivePatients();
            // Fetch everything at once for smooth cross-referencing
            const [pRes, aRes, dRes] = await Promise.all([
                fetch(`${API_URL}/patients`),
                fetch(`${API_URL}/appointments`),
                fetch(`${API_URL}/doctors`)
                
            ]);
            
            const pData = await pRes.json();
            const aData = await aRes.json();
            const dData = await dRes.json();

            const fetchedPatients = Array.isArray(pData) ? pData : [];
            const fetchedDoctors = Array.isArray(dData) ? dData : [];
            
            setPatients(fetchedPatients);
            setDoctors(fetchedDoctors);

            // Map Real Names to Appointments just in case the DB only gives IDs
            let mappedAppts = Array.isArray(aData) ? aData : [];
            mappedAppts = mappedAppts.map(a => {
                const pat = fetchedPatients.find(p => String(p.patient_id || p.id) === String(a.patient_id));
                const doc = fetchedDoctors.find(d => String(d.doctor_id || d.id) === String(a.doctor_id));
                return {
                    ...a,
                    patient_name: a.patient_name || (pat ? pat.name : `Patient #${a.patient_id}`),
                    doctor_name: a.doctor_name || (doc ? doc.name : `Doc #${a.doctor_id}`)
                };
            });
            // Sort so newest are usually first (basic fallback sort)
            setAppointments(mappedAppts.reverse());

            // Fetch Bills
            try {
                const bRes = await fetch(`${API_URL}/bills`);
                if (bRes.ok) {
                    let bData = await bRes.json();
                    bData = Array.isArray(bData) ? bData : [];
                    bData = bData.map(b => {
                        const pat = fetchedPatients.find(p => String(p.patient_id || p.id) === String(b.patient_id));
                        const doc = fetchedDoctors.find(d => String(d.doctor_id || d.id) === String(b.doctor_id));
                        return {
                            ...b,
                            patient_name: b.patient_name || (pat ? pat.name : `Patient #${b.patient_id}`),
                            doctor_name: b.doctor_name || (doc ? doc.name : `Doc #${b.doctor_id}`)
                        };
                    });
                    setBills(bData.reverse());
                }
            } catch (err) {
                console.log("Bills API not ready or empty.");
            }

        } catch (err) {
            console.error("Failed to load dashboard data:", err);
        }
    }

    // --- ACTIONS ---
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
                setForm({ name: '', age: '', phone: '' });
                loadAllData();
            } else {
                setMessage('Failed to register patient ❌');
            }
        } catch {
            setMessage('Server error ❌');
        }
        setTimeout(() => setMessage(''), 5000);
    }

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
                setAppointmentForm({ patient_id: '', doctor_id: '', date: '' });
                loadAllData();
            } else {
                setMessage('Failed to book appointment ❌');
            }
        } catch {
            setMessage('Server error ❌');
        }
        setTimeout(() => setMessage(''), 5000);
    }

    async function updateAppointmentStatus(id, status) {
        if (!window.confirm(`Are you sure you want to mark this appointment as ${status}?`)) return;
        try {
            const res = await fetch(`${API_URL}/appointments/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setMessage(`Appointment ${status} ✅`);
                loadAllData();
            } else {
                alert('Failed to update status.');
            }
        } catch (err) {
            console.error(err);
        }
        setTimeout(() => setMessage(''), 5000);
    }

    async function markAsPaid(billId) {

    try {

        const amount =
            paymentAmounts[billId];

        if (!amount || Number(amount) <= 0) {

            alert('Enter valid amount');

            return;
        }

        const res = await fetch(

            `${API_URL}/bills/${billId}/pay`,

            {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({

                    amount,

                    payment_method:
                        paymentMethods[billId]
                        || 'Cash'

                })
            }
        );

        const data =
            await res.json();

        if (res.ok) {

            setMessage(
                'Payment successful ✅'
            );

            setPaymentAmounts({
                ...paymentAmounts,
                [billId]: ''
            });

            loadAllData();

        } else {

            alert(
                data.error || 'Payment failed'
            );
        }

    } catch (err) {

        console.error(err);

        setMessage(
            'Payment failed ❌'
        );
    }

    setTimeout(() =>
        setMessage(''),
        5000
    );
}   function editPatient(patient) {

    const newName =
        prompt(
            "Patient Name",
            patient.name
        );

    if (!newName) return;

    const newAge =
        prompt(
            "Age",
            patient.age
        );

    if (!newAge) return;

    const newPhone =
        prompt(
            "Phone",
            patient.phone
        );

    if (!newPhone) return;

    updatePatient(
        patient.patient_id,
        newName,
        newAge,
        newPhone
    );
}

async function updatePatient(
    id,
    name,
    age,
    phone
) {

    try {

        const res = await fetch(
            `${API_URL}/patients/${id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type':
                        'application/json'
                },
                body: JSON.stringify({
                    name,
                    age,
                    phone
                })
            }
        );

        const data =
            await res.json();

        if (res.ok) {

            setMessage(
                'Patient updated successfully ✅'
            );

            loadAllData();

        } else {

            setMessage(
                data.error ||
                'Update failed ❌'
            );
        }

    } catch (err) {

        console.error(err);

        setMessage(
            'Server Error ❌'
        );
    }

    setTimeout(
        () => setMessage(''),
        5000
    );
}   

    async function deactivatePatient(id) {

    if (!window.confirm('Deactivate this patient?')) {
        return;
    }

    try {

        const res = await fetch(
            `${API_URL}/patients/${id}/deactivate`,
            {
                method: 'PUT'
            }
        );

        const data = await res.json();

        if (res.ok) {

            setMessage(
                'Patient deactivated successfully ✅'
            );

            loadAllData();

        } else {

            setMessage(
                data.error || 'Failed ❌'
            );
        }

    } catch (err) {

        console.error(err);
        setMessage('Server Error ❌');
    }
}

function logout() {

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    window.location.href = '/';
}
    // --- FILTERS & STATS ---
    const totalRevenue = bills.filter(b => b.status === 'paid').reduce((sum, b) => sum + Number(b.total_amount || b.amount || 0), 0);
    const pendingBills = bills.filter(b => b.status !== 'paid').length;
    const todayAppointments = appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length;

    const filteredPatients = patients.filter(p => (p.name || '').toLowerCase().includes(searchPatient.toLowerCase()) || (p.phone || '').includes(searchPatient));
    const filteredAppts = appointments.filter(a => (a.patient_name || '').toLowerCase().includes(searchAppt.toLowerCase()) || (a.doctor_name || '').toLowerCase().includes(searchAppt.toLowerCase()));
    const filteredBills = bills.filter(b => (b.patient_name || '').toLowerCase().includes(searchBill.toLowerCase()));

    return (
        <div style={pageLayout}>
            {/* SIDEBAR */}
            <div style={sidebarStyle}>
                <div style={sidebarHeader}>
                    <div style={sidebarLogo}><Building2 size={24} color="white" /></div>
                    <div>
                        <div style={sidebarTitle}>Health Care Hospital</div>
                        <div style={sidebarSub}>Receptionist Portal</div>
                    </div>
                </div>

                <div style={sidebarNav}>
                    <div style={activeTab === 'dashboard' ? activeNavItem : navItem} onClick={() => setActiveTab('dashboard')}>
                        <LayoutDashboard size={22} /> Dashboard
                    </div>
                    <div style={activeTab === 'appointments' ? activeNavItem : navItem} onClick={() => setActiveTab('appointments')}>
                        <CalendarDays size={22} /> Appointments
                    </div>
                    <div style={activeTab === 'book' ? activeNavItem : navItem} onClick={() => setActiveTab('book')}>
                        <Plus size={22} /> Book Now
                    </div>
                    <div style={activeTab === 'history' ? activeNavItem : navItem} onClick={() => setActiveTab('history')}>
                        <History size={22} /> History
                    </div>
                    <div style={activeTab === 'inactivePatients'? activeNavItem: navItem}onClick={() =>setActiveTab('inactivePatients' ) }>
                        <Users size={22} />Inactive Patients
                    </div>
                    <div style={activeTab === 'bills' ? activeNavItem : navItem} onClick={() => setActiveTab('bills')}>
                        <CreditCard size={22} /> Bills
                    </div>
                </div>

                <div style={sidebarProfileSection}>
                    <div style={profileInfo}>
                        <div style={profileAvatar}>👩‍💼</div>
                        <div>
                            <div style={profileName}>Receptionist</div>
                            <div style={profileRole}>Front Desk</div>
                        </div>
                    </div>
                    <button onClick={logout} style={sidebarLogoutBtn}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div style={mainContentStyle}>

                {/* BANNER */}
                <div style={bannerStyle}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '32px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '800' }}>
                            👋 Welcome, Receptionist!
                        </h1>
                        <p style={{ marginTop: '10px', opacity: 0.9, fontSize: '18px' }}>
                            Manage appointments, patients and billing efficiently.
                        </p>
                    </div>
                    <div style={bannerIllustration}>
                        <span style={{ fontSize: '70px' }}>👩‍💻</span>
                        <div style={deskProp}>RECEPTION</div>
                    </div>
                </div>

                {message && (
                    <div style={{...messageStyle, color: message.includes('❌') ? '#dc2626' : '#16a34a', background: message.includes('❌') ? '#fef2f2' : '#dcfce7', border: message.includes('❌') ? '2px solid #fca5a5' : '2px solid #bbf7d0'}}>
                        {message}
                    </div>
                )}

                {/* =========================================
                    DASHBOARD TAB
                ========================================= */}
                {activeTab === 'dashboard' && (
                    <>
                        <div style={statsGrid}>
                            <div style={statCard}>
                                <div style={statTopRow}>
                                    <div style={{...iconBox, background: '#f3e8ff', color: '#9333ea'}}><Users size={28} /></div>
                                    <span style={{...trendBadge, color: '#9333ea', background: '#f3e8ff'}}>↑ 12%</span>
                                </div>
                                <div style={statValue}>{patients.length}</div>
                                <div style={statLabel}>Total Patients</div>
                            </div>
                            <div style={statCard}>
                                <div style={statTopRow}>
                                    <div style={{...iconBox, background: '#e0f2fe', color: '#0284c7'}}><CalendarDays size={28} /></div>
                                    <span style={{...trendBadge, color: '#0284c7', background: '#e0f2fe'}}>↑ 8%</span>
                                </div>
                                <div style={statValue}>{appointments.length}</div>
                                <div style={statLabel}>Total Appointments</div>
                            </div>
                            <div style={statCard}>
                                <div style={statTopRow}>
                                    <div style={{...iconBox, background: '#dcfce7', color: '#16a34a'}}><Calendar size={28} /></div>
                                    <span style={{...trendBadge, color: '#64748b', background: '#f1f5f9'}}>-</span>
                                </div>
                                <div style={statValue}>{todayAppointments}</div>
                                <div style={statLabel}>Today's Appointments</div>
                            </div>
                            <div style={statCard}>
                                <div style={statTopRow}>
                                    <div style={{...iconBox, background: '#ffedd5', color: '#ea580c'}}><Hourglass size={28} /></div>
                                    <span style={{...trendBadge, color: '#ea580c', background: '#ffedd5'}}>↑ 15%</span>
                                </div>
                                <div style={statValue}>{pendingBills}</div>
                                <div style={statLabel}>Pending Payments</div>
                            </div>
                            <div style={statCard}>
                                <div style={statTopRow}>
                                    <div style={{...iconBox, background: '#ffe4e6', color: '#e11d48'}}><Wallet size={28} /></div>
                                    <span style={{...trendBadge, color: '#e11d48', background: '#ffe4e6'}}>↑ 10%</span>
                                </div>
                                <div style={statValue}>Rs. {totalRevenue}</div>
                                <div style={statLabel}>Total Revenue</div>
                            </div>
                        </div>

                        <div style={formsGrid}>
                            <div style={panelCard}>
                                <div style={panelHeader}>
                                    <UserPlus size={24} color="#4f46e5" />
                                    <h2 style={panelTitle}>Register Patient</h2>
                                </div>
                                <form onSubmit={handlePatientSubmit} style={formStyle}>
                                    <div style={inputWrapper}>
                                        <Users size={20} color="#94a3b8" style={inputIcon} />
                                        <input type="text" placeholder="Patient Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={iconInput} required />
                                    </div>
                                    <div style={inputWrapper}>
                                        <Calendar size={20} color="#94a3b8" style={inputIcon} />
                                        <input type="number" placeholder="Age" value={form.age} onChange={e => setForm({...form, age: e.target.value})} style={iconInput} required />
                                    </div>
                                    <div style={inputWrapper}>
                                        <Phone size={20} color="#94a3b8" style={inputIcon} />
                                        <input type="text" placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={iconInput} required />
                                    </div>
                                    <button type="submit" style={primaryBtn}>Register Patient</button>
                                </form>
                            </div>

                            <div style={panelCard}>
                                <div style={panelHeader}>
                                    <CalendarDays size={24} color="#0284c7" />
                                    <h2 style={panelTitle}>Book Appointment</h2>
                                </div>
                                <form onSubmit={handleAppointmentSubmit} style={formStyle}>
                                    <div style={inputWrapper}>
                                        <select value={appointmentForm.patient_id} onChange={e => setAppointmentForm({...appointmentForm, patient_id: e.target.value})} style={iconInput} required>
                                            <option value="">Select Patient</option>
                                            {patients.map(p => <option key={p.patient_id || p.id} value={p.patient_id || p.id}>{p.name}</option>)}
                                        </select>
                                        <ChevronDown size={20} color="#94a3b8" style={dropdownArrow} />
                                    </div>
                                    <div style={inputWrapper}>
                                        <select value={appointmentForm.doctor_id} onChange={e => setAppointmentForm({...appointmentForm, doctor_id: e.target.value})} style={iconInput} required>
                                            <option value="">Select Doctor</option>
                                            {doctors.map(d => <option key={d.doctor_id || d.id} value={d.doctor_id || d.id}>{d.name} ({d.specialization})</option>)}
                                        </select>
                                        <ChevronDown size={20} color="#94a3b8" style={dropdownArrow} />
                                    </div>
                                    <div style={inputWrapper}>
                                        <Calendar size={20} color="#94a3b8" style={inputIcon} />
                            <input type="date" value={appointmentForm.date} onChange={e => setAppointmentForm({...appointmentForm, date: e.target.value})} style={iconInput} required />
                                    </div>
                                    <button type="submit" style={tealBtn}>Book Appointment</button>
                                </form>
                            </div>
                        </div>

                        <div style={tablesGrid}>
                            <div style={panelCard}>
                                <div style={tableHeaderArea}>
                                    <div style={panelHeader}>
                                        <CalendarDays size={24} color="#0284c7" />
                                        <h2 style={panelTitle}>Appointments</h2>
                                    </div>
                                    <button onClick={() => setActiveTab('appointments')} style={viewAllBtn}>View All</button>
                                </div>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={tableStyle}>
                                        <thead>
                                            <tr style={tableHeaderRow}>
                                                <th style={tableHead}>Patient</th>
                                                <th style={tableHead}>Doctor</th>
                                                <th style={tableHead}>Date</th>
                                                <th style={tableHead}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {appointments.slice(0, 5).map((a, i) => {
                                                const stat = (a.status || 'Pending').toLowerCase();
                                                const badgeStyle = stat === 'completed' ? statusGreen : stat === 'cancelled' ? statusRed : statusOrange;
                                                return (
                                                    <tr key={i} style={tableRow}>
                                                        <td style={{...tableData, fontWeight: 'bold'}}>{a.patient_name}</td>
                                                        <td style={tableData}>{a.doctor_name || 'Specialist'}</td>
                                                        <td style={tableData}>{new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                                        <td style={tableData}><span style={badgeStyle}>{(a.status || 'Pending')}</span></td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div style={panelCard}>
                                <div style={tableHeaderArea}>
                                    <div style={panelHeader}>
                                        <CreditCard size={24} color="#0284c7" />
                                        <h2 style={panelTitle}>Bills</h2>
                                    </div>
                                    <button onClick={() => setActiveTab('bills')} style={viewAllBtn}>View All</button>
                                </div>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={tableStyle}>
                                        <thead>
                                            <tr style={tableHeaderRow}>
                                                <th style={tableHead}>Patient</th>
                                                <th style={tableHead}>Doctor</th>
                                                <th style={tableHead}>Date</th>
                                                <th style={tableHead}>Amount</th>
                                                <th style={tableHead}>Status</th>
                                                <th style={tableHead}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bills.slice(0, 4).map((b, i) => {
                                                const isPaid = (b.status || '').toLowerCase() === 'paid';
                                                return (
                                                    <tr key={b.bill_id || i} style={tableRow}>
                                                        <td style={{...tableData, fontWeight: 'bold'}}>{b.patient_name}</td>
                                                        <td style={tableData}>{b.doctor_name || 'Doctor'}</td>
                                                        <td style={tableData}>{new Date(b.bill_date || b.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                                        <td style={{...tableData, fontWeight: 'bold'}}>Rs. {b.total_amount || b.amount}</td>
                                                        <td style={tableData}>

    <span style={{
        background:
            isPaid
                ? '#dcfce7'
                : '#fef3c7',

        color:
            isPaid
                ? '#16a34a'
                : '#d97706',

        padding: '6px 12px',

        borderRadius: '999px',

        fontWeight: 'bold',

        fontSize: '12px'
    }}>
        {isPaid ? 'Paid' : 'Pending'}
    </span>

</td>
                                                        <td style={tableData}>

    {(
        b.status || ''
    ).toLowerCase() === 'paid' ? (

        <span style={paidBadge}>
            Paid
        </span>

    ) : (

        <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    minWidth: '220px'
        }}>

<button
    onClick={() => {
        setSelectedBill(b);
        setShowInvoice(true);
    }}
    style={{
        background: '#2563eb',
        color: '#fff',
        border: 'none',
        padding: '10px 16px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: '600'
    }}
>
    👁 View Invoice
</button>

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
                    </>
                )}

                {/* =========================================
                    APPOINTMENTS FULL TAB
                ========================================= */}
                {activeTab === 'appointments' && (
                    <div style={contentCard}>
                        <div style={tableHeaderArea}>
                            <h2 style={cardTitle}>📅 All Appointments</h2>
                            <div style={searchWrapper}>
                                <Search size={20} color="#94a3b8" style={searchIcon} />
                                <input 
                                    type="text" 
                                    placeholder="Search patient or doctor..." 
                                    value={searchAppt}
                                    onChange={(e) => setSearchAppt(e.target.value)}
                                    style={searchInputStyle}
                                />
                            </div>
                        </div>
                        {filteredAppts.length > 0 ? (
                            <table style={tableStyle}>
                                <thead>
                                    <tr style={tableHeaderRow}>
                                        <th style={tableHead}>Appt ID</th>
                                        <th style={tableHead}>Patient</th>
                                        <th style={tableHead}>Doctor</th>
                                        <th style={tableHead}>Date</th>
                                        <th style={tableHead}>Status</th>
                                        <th style={tableHead}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAppts.map((a, i) => {
                                        const stat = (a.status || 'Pending').toLowerCase();
                                        const badgeStyle = stat === 'completed' ? statusGreen : stat === 'cancelled' ? statusRed : statusOrange;
                                        return (
                                            <tr key={i} style={tableRow}>
                                                <td style={{...tableData, color: '#0284c7'}}>#{a.appointment_id || a.id}</td>
                                                <td style={{...tableData, fontWeight: 'bold'}}>{a.patient_name}</td>
                                                <td style={tableData}>{a.doctor_name || 'Specialist'}</td>
                                                <td style={tableData}>{new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                                <td style={tableData}><span style={badgeStyle}>{(a.status || 'Pending')}</span></td>
                                                <td style={tableData}>
                                                    {stat !== 'completed' && stat !== 'cancelled' ? (
                                                        <button onClick={() => updateAppointmentStatus(a.appointment_id || a.id, 'Cancelled')} style={cancelBtnStyle}>Cancel</button>
                                                    ) : (
                                                        <span style={{ color: '#94a3b8' }}>-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : <p style={emptyText}>No appointments found.</p>}
                    </div>
                )}

                {/* =========================================
                    BOOK NOW FULL TAB
                ========================================= */}
                {activeTab === 'book' && (
                    <div style={formsGrid}>
                        {/* Duplicate the forms here so they can be accessed full screen */}
                        <div style={panelCard}>
                            <div style={panelHeader}>
                                <UserPlus size={24} color="#4f46e5" />
                                <h2 style={panelTitle}>Register Patient</h2>
                            </div>
                            <form onSubmit={handlePatientSubmit} style={formStyle}>
                                <div style={inputWrapper}>
                                    <Users size={20} color="#94a3b8" style={inputIcon} />
                                    <input type="text" placeholder="Patient Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={iconInput} required />
                                </div>
                                <div style={inputWrapper}>
                                    <Calendar size={20} color="#94a3b8" style={inputIcon} />
                                    <input type="number" placeholder="Age" value={form.age} onChange={e => setForm({...form, age: e.target.value})} style={iconInput} required />
                                </div>
                                <div style={inputWrapper}>
                                    <Phone size={20} color="#94a3b8" style={inputIcon} />
                                    <input type="text" placeholder="Phone Number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={iconInput} required />
                                </div>
                                <button type="submit" style={primaryBtn}>Register Patient</button>
                            </form>
                        </div>

                        <div style={panelCard}>
                            <div style={panelHeader}>
                                <CalendarDays size={24} color="#0284c7" />
                                <h2 style={panelTitle}>Book Appointment</h2>
                            </div>
                            <form onSubmit={handleAppointmentSubmit} style={formStyle}>
                                <div style={inputWrapper}>
                                    <select value={appointmentForm.patient_id} onChange={e => setAppointmentForm({...appointmentForm, patient_id: e.target.value})} style={iconInput} required>
                                        <option value="">Select Existing Patient</option>
                                        {patients.map(p => <option key={p.patient_id || p.id} value={p.patient_id || p.id}>{p.name} ({p.phone})</option>)}
                                    </select>
                                    <ChevronDown size={20} color="#94a3b8" style={dropdownArrow} />
                                </div>
                                <div style={inputWrapper}>
                                    <select value={appointmentForm.doctor_id} onChange={e => setAppointmentForm({...appointmentForm, doctor_id: e.target.value})} style={iconInput} required>
                                        <option value="">Select Doctor</option>
                                        {doctors.map(d => <option key={d.doctor_id || d.id} value={d.doctor_id || d.id}>{d.name} ({d.specialization})</option>)}
                                    </select>
                                    <ChevronDown size={20} color="#94a3b8" style={dropdownArrow} />
                                </div>
                                <div style={inputWrapper}>
                                    <Calendar size={20} color="#94a3b8" style={inputIcon} />
                                    <input type="date" value={appointmentForm.date} onChange={e => setAppointmentForm({...appointmentForm, date: e.target.value})} style={iconInput} required />
                                </div>
                                <button type="submit" style={tealBtn}>Confirm Booking</button>
                            </form>
                        </div>
                    </div>
                )}

                {/* =========================================
    HISTORY (PATIENT DIRECTORY) FULL TAB
========================================= */}
{activeTab === 'history' && (
    <div style={contentCard}>
        <div style={tableHeaderArea}>
            <h2 style={cardTitle}>👥 Patient Directory</h2>

            <div style={searchWrapper}>
                <Search
                    size={20}
                    color="#94a3b8"
                    style={searchIcon}
                />

                <input
                    type="text"
                    placeholder="Search by name or phone..."
                    value={searchPatient}
                    onChange={(e) =>
                        setSearchPatient(e.target.value)
                    }
                    style={searchInputStyle}
                />
            </div>
        </div>

        {filteredPatients.length > 0 ? (

            <table style={tableStyle}>

                <thead>
                    <tr style={tableHeaderRow}>
                        <th style={tableHead}>
                            Patient ID
                        </th>

                        <th style={tableHead}>
                            Name
                        </th>

                        <th style={tableHead}>
                            Age
                        </th>

                        <th style={tableHead}>
                            Phone
                        </th>

                        <th style={tableHead}>
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>

                    {filteredPatients.map((p, i) => (

                        <tr
                            key={i}
                            style={tableRow}
                        >

                            <td
                                style={{
                                    ...tableData,
                                    color: '#0284c7'
                                }}
                            >
                                #{p.patient_id || p.id}
                            </td>

                            <td
                                style={{
                                    ...tableData,
                                    fontWeight: 'bold'
                                }}
                            >
                                {p.name}
                            </td>

                            <td style={tableData}>
                                {p.age} Yrs
                            </td>

                            <td style={tableData}>
                                {p.phone || 'N/A'}
                            </td>

                            <td style={tableData}>

                                <button
                                    onClick={() =>
                                        editPatient(p)
                                    }
                                    style={{
                                        background: '#0284c7',
                                        color: 'white',
                                        border: 'none',
                                        padding: '10px 16px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        marginRight: '10px'
                                    }}
                                >
                                    Update
                                </button>

                                <button
                                    onClick={() =>
                                        deactivatePatient(
                                            p.patient_id || p.id
                                        )
                                    }
                                    style={{
                                        background: '#dc2626',
                                        color: 'white',
                                        border: 'none',
                                        padding: '10px 16px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Deactivate
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        ) : (

            <p style={emptyText}>
                No patients found matching your search.
            </p>

        )}
    </div>
)}

                {/* =========================================
                    BILLS FULL TAB
                ========================================= */}
                {activeTab === 'inactivePatients' && (
    <div style={contentCard}>

        <div style={tableHeaderArea}>
            <h2 style={cardTitle}>
                👥 Inactive Patients
            </h2>
        </div>

        {inactivePatients.length > 0 ? (

            <table style={tableStyle}>

                <thead>
                    <tr style={tableHeaderRow}>

                        <th style={tableHead}>
                            Patient ID
                        </th>

                        <th style={tableHead}>
                            Name
                        </th>

                        <th style={tableHead}>
                            Age
                        </th>

                        <th style={tableHead}>
                            Phone
                        </th>

                        <th style={tableHead}>
                            Status
                        </th>

                        <th style={tableHead}>
                            Action
                        </th>

                    </tr>
                </thead>

                <tbody>

                    {inactivePatients.map((p) => (

                        <tr
                            key={p.patient_id}
                            style={tableRow}
                        >

                            <td style={tableData}>
                                #{p.patient_id}
                            </td>

                            <td style={tableData}>
                                {p.name}
                            </td>

                            <td style={tableData}>
                                {p.age}
                            </td>

                            <td style={tableData}>
                                {p.phone}
                            </td>

                            <td style={tableData}>
                                <span
                                    style={{
                                        color: '#dc2626',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Inactive
                                </span>
                            </td>

                            <td style={tableData}>

                                <button
                                    onClick={() =>
                                        restorePatient(
                                            p.patient_id
                                        )
                                    }
                                    style={{
                                        background:
                                            '#16a34a',
                                        color:
                                            'white',
                                        border:
                                            'none',
                                        padding:
                                            '10px 16px',
                                        borderRadius:
                                            '8px',
                                        cursor:
                                            'pointer',
                                        fontWeight:
                                            'bold'
                                    }}
                                >
                                    Restore
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        ) : (

            <p style={emptyText}>
                No inactive patients found.
            </p>

        )}

    </div>
)}
                {activeTab === 'bills' && (
                    <div style={contentCard}>
                        <div style={tableHeaderArea}>
                            <h2 style={cardTitle}>💳 All Invoices</h2>
                            <div style={searchWrapper}>
                                <Search size={20} color="#94a3b8" style={searchIcon} />
                                <input 
                                    type="text" 
                                    placeholder="Search by patient name..." 
                                    value={searchBill}
                                    onChange={(e) => setSearchBill(e.target.value)}
                                    style={searchInputStyle}
                                />
                            </div>
                        </div>
                        {filteredBills.length > 0 ? (
                            <table style={tableStyle}>
                                <thead>
                                    <tr style={tableHeaderRow}>
                                        <th style={tableHead}>Invoice ID</th>
                                        <th style={tableHead}>Patient</th>
                                        <th style={tableHead}>Doctor</th>
                                        <th style={tableHead}>Date</th>
                                        <th style={tableHead}>Amount</th>
                                        <th style={tableHead}>Status</th>
                                        <th style={tableHead}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBills.map((b, i) => {
                                        const isPaid = (b.status || '').toLowerCase() === 'paid';
                                        return (
                                            <tr key={b.bill_id || i} style={tableRow}>
                                                <td style={{...tableData, color: '#0284c7'}}>#INV-{b.bill_id || b.id || (i + 1000)}</td>
                                                <td style={{...tableData, fontWeight: 'bold'}}>{b.patient_name}</td>
                                                <td style={tableData}>{b.doctor_name || 'Doctor'}</td>
                                                <td style={tableData}>{new Date(b.bill_date || b.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                                <td style={{...tableData, fontWeight: 'bold'}}>Rs. {b.total_amount || b.amount}</td>
                                                <td style={tableData}>
                                                    <span style={isPaid ? statusGreenText : statusOrangeText}>{(b.status || 'Pending')}</span>
                                                </td>
                                                <td style={tableData}>

    {(
        b.status || ''
    ).toLowerCase() === 'paid' ? (

        <span style={paidBadge}>
            Paid
        </span>

    ) : (

        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
        }}>

            <input

                type="number"

                placeholder="Amount"

                value={
                    paymentAmounts[
                        b.bill_id || b.id
                    ] || ''
                }

                onChange={(e) =>
                    setPaymentAmounts({

                        ...paymentAmounts,

                        [b.bill_id || b.id]:
                            e.target.value
                    })
                }

                style={amountInput}
            />

            <select

                value={
                    paymentMethods[
                        b.bill_id || b.id
                    ] || 'Cash'
                }

                onChange={(e) =>
                    setPaymentMethods({

                        ...paymentMethods,

                        [b.bill_id || b.id]:
                            e.target.value
                    })
                }

                style={smallSelect}
            >

                <option value="Cash">
                    Cash
                </option>

                <option value="Card">
                    Card
                </option>

                <option value="Insurance">
                    Insurance
                </option>

                <option value="Online">
                    Online
                </option>

            </select>
            <button
    onClick={() => {
        setSelectedBill(b);
        setShowInvoice(true);
    }}
    style={{
        background: '#2563eb',
        color: 'white',
        border: 'none',
        padding: '8px 14px',
        borderRadius: '8px',
        cursor: 'pointer',
        marginBottom: '8px',
        fontWeight: 'bold'
    }}
>
    View Invoice
</button>
            <button

                onClick={() =>
                    markAsPaid(
                        b.bill_id || b.id
                    )
                }

                style={markPaidBtn}

            >
                Pay Now
            </button>

            <div style={{
                fontSize: '13px',
                color: '#16a34a',
                fontWeight: 'bold'
            }}>
                Paid:
                Rs. {b.paid_amount || 0}
            </div>

            <div style={{
                fontSize: '13px',
                color: '#dc2626',
                fontWeight: 'bold'
            }}>
                Balance:
                Rs. {
                    b.balance_amount
                    || b.total_amount
                }
            </div>

        </div>
    )}

</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : <p style={emptyText}>No billing history found.</p>}
                    </div>
                )}
                {showInvoice && selectedBill && (
  <div
    style={{
      position: "fixed",
      top: 0,
      right: 0,
      width: "450px",
      height: "100vh",
      background: "#f8fafc",
      boxShadow: "-10px 0 30px rgba(0,0,0,0.12)",
      zIndex: 9999,
      overflowY: "auto",
      padding: "25px",
      borderLeft: "1px solid #e2e8f0",
    }}
  >
    {/* Header */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px",
      }}
    >
      <h2
        style={{
          margin: 0,
          color: "#0f172a",
          fontWeight: "800",
        }}
      >
        💳 Payment Details
      </h2>

      <button
        onClick={() => setShowInvoice(false)}
        style={{
          border: "none",
          background: "transparent",
          fontSize: "24px",
          cursor: "pointer",
          color: "#64748b",
        }}
      >
        ✕
      </button>
    </div>

    {/* Status Badge */}
    <div style={{ marginBottom: "20px" }}>
      <span
        style={{
          background:
            (selectedBill.status || "").toLowerCase() === "paid"
              ? "#dcfce7"
              : "#fef3c7",
          color:
            (selectedBill.status || "").toLowerCase() === "paid"
              ? "#16a34a"
              : "#d97706",
          padding: "8px 14px",
          borderRadius: "999px",
          fontWeight: "bold",
          fontSize: "13px",
        }}
      >
        {(selectedBill.status || "").toLowerCase() === "paid"
          ? "Paid"
          : "Pending Payment"}
      </span>
    </div>

    {/* Invoice Info */}
    <div
      style={{
        background: "#ffffff",
        padding: "22px",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        marginBottom: "20px",
      }}
    >
      <p><strong>Invoice ID:</strong> INV-{selectedBill.bill_id}</p>

      <p><strong>Patient:</strong> {selectedBill.patient_name}</p>

      <p><strong>Doctor:</strong> {selectedBill.doctor_name}</p>

      <p>
        <strong>Date:</strong>{" "}
        {new Date(selectedBill.bill_date).toLocaleDateString()}
      </p>
    </div>

    {/* Amount Card */}
    <div
      style={{
        background:
          "linear-gradient(135deg,#eff6ff,#dbeafe)",
        padding: "25px",
        borderRadius: "16px",
        border: "1px solid #bfdbfe",
        marginBottom: "20px",
      }}
    >
      <h1
        style={{
          margin: 0,
          color: "#2563eb",
          fontSize: "42px",
          fontWeight: "900",
        }}
      >
        Rs. {selectedBill.total_amount}
      </h1>

      <small
        style={{
          color: "#475569",
          fontWeight: "600",
        }}
      >
        Total Amount
      </small>
    </div>

    {/* Payment Method */}
    <label
      style={{
        fontWeight: "600",
        color: "#334155",
      }}
    >
      Payment Method
    </label>

    <select
      value={
        paymentMethods[selectedBill.bill_id] ||
        "Cash"
      }
      onChange={(e) =>
        setPaymentMethods({
          ...paymentMethods,
          [selectedBill.bill_id]:
            e.target.value,
        })
      }
      style={{
        width: "100%",
        padding: "12px",
        marginTop: "8px",
        marginBottom: "15px",
        borderRadius: "12px",
        border: "1px solid #cbd5e1",
        background: "#fff",
      }}
    >
      <option>Cash</option>
      <option>Card</option>
      <option>Insurance</option>
      <option>Online</option>
    </select>

    {/* Amount Received */}
    <label
      style={{
        fontWeight: "600",
        color: "#334155",
      }}
    >
      Amount Received
    </label>

    <input
      type="number"
      placeholder="Enter amount"
      value={
        paymentAmounts[selectedBill.bill_id] ||
        ""
      }
      onChange={(e) =>
        setPaymentAmounts({
          ...paymentAmounts,
          [selectedBill.bill_id]:
            e.target.value,
        })
      }
      style={{
        width: "100%",
        padding: "12px",
        marginTop: "8px",
        borderRadius: "12px",
        border: "1px solid #cbd5e1",
        background: "#fff",
      }}
    />

    {/* Payment Summary */}
    <div
      style={{
        marginTop: "20px",
        padding: "20px",
        background: "#ffffff",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        boxShadow:
          "0 2px 10px rgba(0,0,0,0.05)",
      }}
    >
      <p>
        <strong>Consultation Fee:</strong>
        Rs. {selectedBill.subtotal || 0}
      </p>

      <p>
        <strong>Tax:</strong>
        Rs. {selectedBill.tax || 0}
      </p>

      <hr />

      <p>
        <strong>Paid:</strong>
        Rs. {selectedBill.paid_amount || 0}
      </p>

      <p>
        <strong>Balance:</strong>
        Rs.{" "}
        {selectedBill.balance_amount ||
          selectedBill.total_amount}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        <span
          style={{
            color:
              (selectedBill.status || "")
                .toLowerCase() === "paid"
                ? "#16a34a"
                : "#ea580c",
            fontWeight: "bold",
          }}
        >
          {selectedBill.status}
        </span>
      </p>
    </div>

    {(selectedBill.status || "")
      .toLowerCase() !== "paid" && (
      <button
        onClick={() =>
          markAsPaid(
            selectedBill.bill_id
          )
        }
        style={{
          width: "100%",
          marginTop: "25px",
          padding: "16px",
          background:
            "linear-gradient(to right,#16a34a,#22c55e)",
          color: "#fff",
          border: "none",
          borderRadius: "14px",
          fontWeight: "bold",
          fontSize: "16px",
          cursor: "pointer",
          boxShadow:
            "0 6px 15px rgba(34,197,94,0.25)",
        }}
      >
        ✓ Confirm Payment
      </button>
    )}
  </div>
)}

            </div>
        </div>
    );
}

// --------------------------------------------------
// STYLES 
// --------------------------------------------------
const pageLayout = { display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" };

/* SIDEBAR */
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
const profileAvatar = { width: '55px', height: '55px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' };
const profileName = { fontSize: '16px', fontWeight: 'bold' };
const profileRole = { fontSize: '14px', color: '#94a3b8', marginTop: '4px' };
const sidebarLogoutBtn = { width: '100%', padding: '14px', background: 'transparent', border: '2px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', transition: '0.2s' };

const mainContentStyle = { flex: 1, padding: '50px', overflowY: 'auto' };

/* BANNER */
const bannerStyle = { position: 'relative', background: 'linear-gradient(to right, #0f766e, #0284c7)', borderRadius: '20px', padding: '45px 50px', color: 'white', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' };
const bannerIllustration = { display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '50px' };
const deskProp = { background: '#facc15', color: '#0f172a', padding: '6px 24px', fontWeight: '900', fontSize: '14px', borderRadius: '6px', marginTop: '-15px', letterSpacing: '1.5px', zIndex: 2 };

/* STATS GRID */
const statsGrid = { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '25px', marginBottom: '40px' };
const statCard = { background: 'white', padding: '25px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' };
const statTopRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' };
const iconBox = { width: '55px', height: '55px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const trendBadge = { padding: '6px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' };
const statValue = { fontSize: '32px', fontWeight: '900', color: '#0f172a', marginBottom: '6px' };
const statLabel = { fontSize: '15px', color: '#64748b', fontWeight: '600' };

/* GRIDS */
const formsGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' };
const tablesGrid = { display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '30px', marginBottom: '40px' };

/* PANELS */
const panelCard = { background: 'white', padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' };
const contentCard = { background: 'white', padding: '40px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' };
const tableHeaderArea = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' };
const panelHeader = { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' };
const panelTitle = { margin: 0, fontSize: '20px', fontWeight: '900', color: '#0f172a' };
const cardTitle = { margin: 0, fontSize: '26px', fontWeight: '900', color: '#0f172a' };
const viewAllBtn = { padding: '8px 18px', borderRadius: '10px', border: '2px solid #e2e8f0', background: 'white', color: '#0f172a', fontWeight: '700', cursor: 'pointer', fontSize: '14px', transition: '0.2s' };

/* FORMS */
const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const inputWrapper = { position: 'relative', display: 'flex', alignItems: 'center' };
const inputIcon = { position: 'absolute', left: '18px' };
const dropdownArrow = { position: 'absolute', right: '18px', pointerEvents: 'none' };
const iconInput = { width: '100%', padding: '16px 16px 16px 50px', borderRadius: '12px', border: '2px solid #e2e8f0', outline: 'none', fontSize: '16px', color: '#1e293b', boxSizing: 'border-box', appearance: 'none', background: '#f8fafc', fontWeight: '500' };
const primaryBtn = { padding: '16px', border: 'none', borderRadius: '12px', background: '#0284c7', color: 'white', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '10px' };
const tealBtn = { padding: '16px', border: 'none', borderRadius: '12px', background: '#0f766e', color: 'white', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '10px' };

/* SEARCH */
const searchWrapper = { position: 'relative', display: 'flex', alignItems: 'center', minWidth: '350px' };
const searchIcon = { position: 'absolute', left: '18px' };
const searchInputStyle = { width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px', border: '2px solid #e2e8f0', outline: 'none', background: '#f8fafc', fontSize: '16px', color: '#1e293b', boxSizing: 'border-box', fontWeight: '500' };

/* TABLES */
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const tableHeaderRow = { borderBottom: '3px solid #e2e8f0' };
const tableHead = { padding: '16px 12px', color: '#475569', fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.5px' };
const tableRow = { borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' };
const tableData = { padding: '20px 12px', color: '#1e293b', fontSize: '16px', fontWeight: '500' };
const summaryCard = {background: '#fff',borderRadius: '16px',padding: '20px',boxShadow:'0 2px 10px rgba(0,0,0,0.06)',border:'1px solid #e2e8f0'
};
/* STATUS BADGES & INLINE ACTIONS */
const statusOrange = { background: '#ffedd5', color: '#ea580c', padding: '8px 16px', borderRadius: '30px', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' };
const statusRed = { background: '#fee2e2', color: '#e11d48', padding: '8px 16px', borderRadius: '30px', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' };
const statusGreen = { background: '#dcfce7', color: '#16a34a', padding: '8px 16px', borderRadius: '30px', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' };

const statusOrangeText = { color: '#ea580c', fontSize: '15px', fontWeight: 'bold' };
const statusGreenText = { color: '#16a34a', fontSize: '15px', fontWeight: 'bold' };

const paidBadge = { border: '2px solid #16a34a', color: '#16a34a', padding: '8px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', display: 'inline-block', textAlign: 'center' };
const smallSelect = { padding: '8px 30px 8px 12px', borderRadius: '8px', border: '2px solid #cbd5e1', outline: 'none', fontSize: '14px', background: 'white', fontWeight: '600' };
const amountInput = {padding: '10px',borderRadius: '8px',border:'2px solid #cbd5e1',outline: 'none',fontSize: '14px', width: '130px',fontWeight: '600'};
const markPaidBtn = { padding: '8px 16px', border: 'none', borderRadius: '8px', background: '#16a34a', color: 'white', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' };
const cancelBtnStyle = { padding: '10px 16px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: '0.2s' };

const messageStyle = { padding: '18px', borderRadius: '12px', fontWeight: 'bold', marginBottom: '30px', fontSize: '16px' };
const emptyText = { color: '#64748b', fontSize: '16px', padding: '40px 0', textAlign: 'center' };