import InvoiceModal from '../components/receptionist/InvoiceModal';
import BillTable from '../components/receptionist/BillTable';
import AppointmentsTable from '../components/receptionist/AppointmentsTable';
import PatientTable from "../components/receptionist/PatientTable";
import InactivePatientsTable from "../components/receptionist/InactivePatientsTable";
import DashboardStats from "../components/receptionist/DashboardStats";
import ReceptionistSidebar from '../components/receptionist/ReceptionistSidebar';
import DashboardForms from '../components/receptionist/DashboardForms';
import DashboardTables from "../components/receptionist/DashboardTables";
import React, { useEffect, useState } from 'react';
import { LayoutDashboard, CalendarDays, Plus, History, CreditCard, LogOut, Users, UserPlus, Phone, Calendar, Wallet, Hourglass, Building2, ChevronDown, Search } from 'lucide-react';
import {pageLayout,mainContentStyle,sidebarStyle,sidebarHeader,sidebarLogo,sidebarTitle,sidebarSub,sidebarNav,navItem,activeNavItem,sidebarProfileSection,profileInfo,profileAvatar,profileName,profileRole,sidebarLogoutBtn,bannerStyle,bannerIllustration,deskProp,statsGrid,statCard,statTopRow,iconBox,trendBadge,statValue,statLabel,formsGrid,tablesGrid,panelCard,contentCard,tableHeaderArea,panelHeader,panelTitle,cardTitle,viewAllBtn,formStyle,inputWrapper,inputIcon,dropdownArrow,iconInput,primaryBtn,tealBtn,searchWrapper,searchIcon,searchInputStyle,tableStyle,tableHeaderRow,tableHead,tableRow,tableData,statusOrange,statusRed,statusGreen,statusOrangeText,statusGreenText,paidBadge,markPaidBtn,cancelBtnStyle,messageStyle,emptyText} from '../styles/receptionistStyles';

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
    } function editPatient(patient) {

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
            <ReceptionistSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                logout={logout}
                sidebarStyle={sidebarStyle}
                sidebarHeader={sidebarHeader}
                sidebarLogo={sidebarLogo}
                sidebarTitle={sidebarTitle}
                sidebarSub={sidebarSub}
                sidebarNav={sidebarNav}
                navItem={navItem}
                activeNavItem={activeNavItem}
                sidebarProfileSection={sidebarProfileSection}
                profileInfo={profileInfo}
                profileAvatar={profileAvatar}
                profileName={profileName}
                profileRole={profileRole}
                sidebarLogoutBtn={sidebarLogoutBtn}
            />
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
                    <div style={{ ...messageStyle, color: message.includes('❌') ? '#dc2626' : '#16a34a', background: message.includes('❌') ? '#fef2f2' : '#dcfce7', border: message.includes('❌') ? '2px solid #fca5a5' : '2px solid #bbf7d0' }}>
                        {message}
                    </div>
                )}
                {/* =========================================
                    //DASHBOARD TAB
                ========================================= */}
                {activeTab === 'dashboard' && (
                    <>
                        <DashboardStats
                            patients={patients}
                            appointments={appointments}
                            todayAppointments={todayAppointments}
                            pendingBills={pendingBills}
                            totalRevenue={totalRevenue}
                            statsGrid={statsGrid}
                            statCard={statCard}
                            statTopRow={statTopRow}
                            iconBox={iconBox}
                            trendBadge={trendBadge}
                            statValue={statValue}
                            statLabel={statLabel}
                        />
                        <DashboardForms
                            form={form}
                            setForm={setForm}
                            appointmentForm={appointmentForm}
                            setAppointmentForm={setAppointmentForm}
                            patients={patients}
                            doctors={doctors}
                            handlePatientSubmit={handlePatientSubmit}
                            handleAppointmentSubmit={handleAppointmentSubmit}
                            formsGrid={formsGrid}
                            panelCard={panelCard}
                            panelHeader={panelHeader}
                            panelTitle={panelTitle}
                            formStyle={formStyle}
                            inputWrapper={inputWrapper}
                            inputIcon={inputIcon}
                            dropdownArrow={dropdownArrow}
                            iconInput={iconInput}
                            primaryBtn={primaryBtn}
                            tealBtn={tealBtn}
                        />
                        <DashboardTables
                            appointments={appointments}
                            bills={bills}
                            setActiveTab={setActiveTab}
                            setSelectedBill={setSelectedBill}
                            setShowInvoice={setShowInvoice}

                            panelCard={panelCard}
                            tableHeaderArea={tableHeaderArea}
                            panelHeader={panelHeader}
                            panelTitle={panelTitle}
                            viewAllBtn={viewAllBtn}

                            tableStyle={tableStyle}
                            tableHeaderRow={tableHeaderRow}
                            tableHead={tableHead}
                            tableRow={tableRow}
                            tableData={tableData}

                            statusGreen={statusGreen}
                            statusRed={statusRed}
                            statusOrange={statusOrange}

                            paidBadge={paidBadge}
                        />
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
                        <AppointmentsTable
                            filteredAppts={filteredAppts}
                            updateAppointmentStatus={updateAppointmentStatus}
                            tableStyle={tableStyle}
                            tableHeaderRow={tableHeaderRow}
                            tableHead={tableHead}
                            tableRow={tableRow}
                            tableData={tableData}
                            statusGreen={statusGreen}
                            statusRed={statusRed}
                            statusOrange={statusOrange}
                            cancelBtnStyle={cancelBtnStyle}
                            emptyText={emptyText}
                        />
                    </div>
                )}

                {/* =========================================
                    BOOK NOW FULL TAB
                ========================================= */}
                {activeTab === 'book' && (
                    <DashboardForms
                        form={form}
                        setForm={setForm}
                        appointmentForm={appointmentForm}
                        setAppointmentForm={setAppointmentForm}
                        patients={patients}
                        doctors={doctors}
                        handlePatientSubmit={handlePatientSubmit}
                        handleAppointmentSubmit={handleAppointmentSubmit}
                        formsGrid={formsGrid}
                        panelCard={panelCard}
                        panelHeader={panelHeader}
                        panelTitle={panelTitle}
                        formStyle={formStyle}
                        inputWrapper={inputWrapper}
                        inputIcon={inputIcon}
                        dropdownArrow={dropdownArrow}
                        iconInput={iconInput}
                        primaryBtn={primaryBtn}
                        tealBtn={tealBtn}
                    />
                )}
                {/* =========================================
    HISTORY (PATIENT DIRECTORY) FULL TAB
========================================= */}
                {activeTab === "history" && (
                    <div style={contentCard}>
                        <PatientTable
                            filteredPatients={filteredPatients}
                            editPatient={editPatient}
                            deactivatePatient={deactivatePatient}
                            tableStyle={tableStyle}
                            tableHeaderRow={tableHeaderRow}
                            tableHead={tableHead}
                            tableRow={tableRow}
                            tableData={tableData}
                            emptyText={emptyText}
                        />

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

                        <InactivePatientsTable
                            inactivePatients={inactivePatients}
                            restorePatient={restorePatient}
                            tableStyle={tableStyle}
                            tableHeaderRow={tableHeaderRow}
                            tableHead={tableHead}
                            tableRow={tableRow}
                            tableData={tableData}
                            emptyText={emptyText}
                        />

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
                            <BillTable
                                filteredBills={filteredBills}
                                setSelectedBill={setSelectedBill}
                                setShowInvoice={setShowInvoice}
                                markAsPaid={markAsPaid}
                                tableStyle={tableStyle}
                                tableHeaderRow={tableHeaderRow}
                                tableHead={tableHead}
                                tableRow={tableRow}
                                tableData={tableData}
                                statusGreenText={statusGreenText}
                                statusOrangeText={statusOrangeText}
                                paidBadge={paidBadge}
                                markPaidBtn={markPaidBtn}
                            />
                        ) : (
                            <p style={emptyText}>
                                No billing history found.
                            </p>
                        )}
                    </div>
                )}
                <InvoiceModal
                    showInvoice={showInvoice}
                    selectedBill={selectedBill}
                    setShowInvoice={setShowInvoice}
                    paymentMethods={paymentMethods}
                    setPaymentMethods={setPaymentMethods}
                    paymentAmounts={paymentAmounts}
                    setPaymentAmounts={setPaymentAmounts}
                    markAsPaid={markAsPaid}
                />
            </div>
        </div>

    );
}

