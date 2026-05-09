import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api';

export default function ReceptionistDashboard() {

    const [patients, setPatients] =
        useState([]);

    const [appointments, setAppointments] =
        useState([]);

    const [doctors, setDoctors] =
        useState([]);

    const [bills, setBills] =
        useState([]);

    const [paymentMethods,
        setPaymentMethods] =
        useState({});

    const [searchPatient,
        setSearchPatient] =
        useState('');

    const [searchBill,
        setSearchBill] =
        useState('');

    const [form, setForm] =
        useState({

            name: '',

            age: '',

            phone: ''
        });

    const [appointmentForm,
        setAppointmentForm] =
        useState({

            patient_id: '',

            doctor_id: '',

            date: ''
        });

    const [message, setMessage] =
        useState('');

    useEffect(() => {

        loadData();

        loadBills();

    }, []);

    async function loadData() {

        try {

            const [pRes, aRes, dRes] =

                await Promise.all([

                    fetch(`${API_URL}/patients`),

                    fetch(`${API_URL}/appointments`),

                    fetch(`${API_URL}/doctors`)
                ]);

            const pData =
                await pRes.json();

            const aData =
                await aRes.json();

            const dData =
                await dRes.json();

            setPatients(
                Array.isArray(pData)
                    ? pData
                    : []
            );

            setAppointments(
                Array.isArray(aData)
                    ? aData
                    : []
            );

            setDoctors(
                Array.isArray(dData)
                    ? dData
                    : []
            );

        } catch (err) {

            console.error(err);
        }
    }

    async function loadBills() {

        try {

            const res =
                await fetch(

                    `${API_URL}/bills`
                );

            const data =
                await res.json();

            setBills(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(error);
        }
    }

    async function handlePatientSubmit(e) {

        e.preventDefault();

        try {

            const res =
                await fetch(

                    `${API_URL}/patients`,

                    {

                        method: 'POST',

                        headers: {

                            'Content-Type':
                                'application/json'
                        },

                        body:
                            JSON.stringify(form)
                    }
                );

            if (res.ok) {

                setMessage(
                    'Patient registered successfully ✅'
                );

                setForm({

                    name: '',

                    age: '',

                    phone: ''
                });

                loadData();

            } else {

                setMessage(
                    'Failed to register patient ❌'
                );
            }

        } catch {

            setMessage(
                'Server error ❌'
            );
        }
    }

    async function handleAppointmentSubmit(e) {

        e.preventDefault();

        try {

            const res =
                await fetch(

                    `${API_URL}/appointments`,

                    {

                        method: 'POST',

                        headers: {

                            'Content-Type':
                                'application/json'
                        },

                        body: JSON.stringify(
                            appointmentForm
                        )
                    }
                );

            if (res.ok) {

                setMessage(
                    'Appointment booked successfully ✅'
                );

                setAppointmentForm({

                    patient_id: '',

                    doctor_id: '',

                    date: ''
                });

                loadData();

            } else {

                setMessage(
                    'Failed to book appointment ❌'
                );
            }

        } catch {

            setMessage(
                'Server error ❌'
            );
        }
    }

    async function markAsPaid(
        billId
    ) {

        try {

            await fetch(

                `${API_URL}/bills/${billId}/status`,

                {

                    method: 'PUT',

                    headers: {

                        'Content-Type':
                            'application/json'
                    },

                    body: JSON.stringify({

                        status: 'paid',

                        payment_method:

                            paymentMethods[billId]
                            || 'Cash'
                    })
                }
            );

            setMessage(
                'Payment completed ✅'
            );

            loadBills();

        } catch {

            setMessage(
                'Payment failed ❌'
            );
        }
    }

    function logout() {

        localStorage.clear();

        window.location.href =
            '/login';
    }

    //--------------------------------------------------
    // FILTERS
    //--------------------------------------------------

    const filteredPatients =

        patients.filter(p =>

            p.name
                .toLowerCase()
                .includes(

                    searchPatient
                        .toLowerCase()
                )
        );

    const filteredBills =

        bills.filter(b =>

            b.patient_name
                .toLowerCase()
                .includes(

                    searchBill
                        .toLowerCase()
                )
        );

    //--------------------------------------------------
    // STATS
    //--------------------------------------------------

    const totalRevenue =

        bills.reduce(

            (sum, b) =>

                sum +
                Number(
                    b.total_amount || 0
                ),

            0
        );

    const todayAppointments =

        appointments.filter(a =>

            new Date(a.date)
                .toDateString()

            ===

            new Date()
                .toDateString()

        ).length;

    const pendingBills =

        bills.filter(

            b => b.status !== 'paid'

        ).length;

    //--------------------------------------------------
    // UI
    //--------------------------------------------------

    return (

        <div
            style={{
                minHeight: '100vh',
                background: '#f1f5f9',
                padding: '30px',
                fontFamily:
                    "'Segoe UI', sans-serif"
            }}
        >

            {/* HEADER */}

            <div
                style={{
                    background:
                        'linear-gradient(to right, #0f766e, #0284c7)',

                    borderRadius: '24px',

                    padding: '35px',

                    color: 'white',

                    marginBottom: '30px',

                    display: 'flex',

                    justifyContent:
                        'space-between',

                    alignItems: 'center'
                }}
            >

                <div>

                    <h1>
                        🧑‍💼 Receptionist Dashboard
                    </h1>

                    <p>
                        Hospital front desk
                        management system
                    </p>

                </div>

                <button
                    onClick={logout}
                    style={logoutBtn}
                >
                    Logout
                </button>

            </div>

            {message && (

                <div style={messageBox}>
                    {message}
                </div>

            )}

            {/* STATS */}

            <div style={statsGrid}>

                <div style={cardStyle}>

                    <div style={cardTitle}>
                        👥 Patients
                    </div>

                    <div style={cardValue}>
                        {patients.length}
                    </div>

                </div>

                <div style={cardStyle}>

                    <div style={cardTitle}>
                        📅 Appointments
                    </div>

                    <div style={cardValue}>
                        {appointments.length}
                    </div>

                </div>

                <div style={cardStyle}>

                    <div style={cardTitle}>
                        📅 Today
                    </div>

                    <div style={cardValue}>
                        {todayAppointments}
                    </div>

                </div>

                <div style={cardStyle}>

                    <div style={cardTitle}>
                        ⏳ Pending Bills
                    </div>

                    <div style={cardValue}>
                        {pendingBills}
                    </div>

                </div>

                <div style={cardStyle}>

                    <div style={cardTitle}>
                        💰 Revenue
                    </div>

                    <div style={cardValue}>
                        Rs. {totalRevenue}
                    </div>

                </div>

            </div>

            {/* FORMS */}

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns:
                        '1fr 1fr',

                    gap: '25px',

                    marginBottom: '30px'
                }}
            >

                {/* REGISTER */}

                <div style={panelStyle}>

                    <h2 style={sectionTitle}>
                        ➕ Register Patient
                    </h2>

                    <form
                        onSubmit={
                            handlePatientSubmit
                        }

                        style={{
                            display: 'flex',
                            flexDirection:
                                'column',

                            gap: '18px'
                        }}
                    >

                        <input
                            placeholder="Patient Name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({

                                    ...form,

                                    name:
                                        e.target.value
                                })
                            }
                            required
                            style={inputStyle}
                        />

                        <input
                            type="number"
                            placeholder="Age"
                            value={form.age}
                            onChange={(e) =>
                                setForm({

                                    ...form,

                                    age:
                                        e.target.value
                                })
                            }
                            required
                            style={inputStyle}
                        />

                        <input
                            placeholder="Phone"
                            value={form.phone}
                            onChange={(e) =>
                                setForm({

                                    ...form,

                                    phone:
                                        e.target.value
                                })
                            }
                            required
                            style={inputStyle}
                        />

                        <button
                            type="submit"
                            style={buttonStyle}
                        >
                            Register
                        </button>

                    </form>

                </div>

                {/* APPOINTMENT */}

                <div style={panelStyle}>

                    <h2 style={sectionTitle}>
                        📅 Book Appointment
                    </h2>

                    <form
                        onSubmit={
                            handleAppointmentSubmit
                        }

                        style={{
                            display: 'flex',
                            flexDirection:
                                'column',

                            gap: '18px'
                        }}
                    >

                        <select
                            value={
                                appointmentForm.patient_id
                            }

                            onChange={(e) =>
                                setAppointmentForm({

                                    ...appointmentForm,

                                    patient_id:
                                        e.target.value
                                })
                            }

                            required

                            style={inputStyle}
                        >

                            <option value="">
                                Select Patient
                            </option>

                            {patients.map((p) => (

                                <option

                                    key={p.patient_id}

                                    value={p.patient_id}
                                >

                                    {p.name}

                                </option>

                            ))}

                        </select>

                        <select
                            value={
                                appointmentForm.doctor_id
                            }

                            onChange={(e) =>
                                setAppointmentForm({

                                    ...appointmentForm,

                                    doctor_id:
                                        e.target.value
                                })
                            }

                            required

                            style={inputStyle}
                        >

                            <option value="">
                                Select Doctor
                            </option>

                            {doctors.map((d) => (

                                <option

                                    key={d.doctor_id}

                                    value={d.doctor_id}
                                >

                                    {d.name}
                                    {' - '}
                                    {d.specialization}

                                </option>

                            ))}

                        </select>

                        <input
                            type="date"
                            value={
                                appointmentForm.date
                            }

                            onChange={(e) =>
                                setAppointmentForm({

                                    ...appointmentForm,

                                    date:
                                        e.target.value
                                })
                            }

                            required

                            style={inputStyle}
                        />

                        <button
                            type="submit"
                            style={buttonStyle}
                        >
                            Book Appointment
                        </button>

                    </form>

                </div>

            </div>

            {/* PATIENTS */}

            <div
                style={{
                    ...panelStyle,
                    marginBottom: '30px'
                }}
            >

                <div
                    style={{
                        display: 'flex',

                        justifyContent:
                            'space-between',

                        alignItems: 'center',

                        marginBottom: '20px'
                    }}
                >

                    <h2 style={sectionTitle}>
                        👥 Patients
                    </h2>

                    <input
                        placeholder="Search patient..."
                        value={searchPatient}
                        onChange={(e) =>
                            setSearchPatient(
                                e.target.value
                            )
                        }
                        style={searchInput}
                    />

                </div>

                <table style={tableStyle}>

                    <thead>

                        <tr style={tableHeaderRow}>

                            <th style={tableHead}>
                                Name
                            </th>

                            <th style={tableHead}>
                                Age
                            </th>

                            <th style={tableHead}>
                                Phone
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredPatients.map((p) => (

                            <tr
                                key={p.patient_id}
                            >

                                <td style={tableData}>
                                    {p.name}
                                </td>

                                <td style={tableData}>
                                    {p.age}
                                </td>

                                <td style={tableData}>
                                    {p.phone}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {/* APPOINTMENTS */}

            <div
                style={{
                    ...panelStyle,
                    marginBottom: '30px'
                }}
            >

                <h2 style={sectionTitle}>
                    📋 Appointments
                </h2>

                <table style={tableStyle}>

                    <thead>

                        <tr style={tableHeaderRow}>

                            <th style={tableHead}>
                                Patient
                            </th>

                            <th style={tableHead}>
                                Doctor
                            </th>

                            <th style={tableHead}>
                                Date
                            </th>

                            <th style={tableHead}>
                                Status
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {appointments.map((a) => (

                            <tr
                                key={a.appointment_id}
                            >

                                <td style={tableData}>
                                    {a.patient_name}
                                </td>

                                <td style={tableData}>
                                    {a.doctor_name}
                                </td>

                                <td style={tableData}>

                                    {
                                        new Date(a.date)
                                            .toLocaleDateString()
                                    }

                                </td>

                                <td
                                    style={{
                                        ...tableData,

                                        color:

                                            a.status === 'completed'
                                                ? 'green'
                                                : 'orange',

                                        fontWeight:
                                            'bold'
                                    }}
                                >

                                    {
                                        a.status ||
                                        'pending'
                                    }

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {/* BILLS */}

            <div style={panelStyle}>

                <div
                    style={{
                        display: 'flex',

                        justifyContent:
                            'space-between',

                        alignItems: 'center',

                        marginBottom: '20px'
                    }}
                >

                    <h2 style={sectionTitle}>
                        💳 Bills
                    </h2>

                    <input
                        placeholder="Search bills..."
                        value={searchBill}
                        onChange={(e) =>
                            setSearchBill(
                                e.target.value
                            )
                        }
                        style={searchInput}
                    />

                </div>

                <table style={tableStyle}>

                    <thead>

                        <tr style={tableHeaderRow}>

                            <th style={tableHead}>
                                Patient
                            </th>

                            <th style={tableHead}>
                                Doctor
                            </th>

                            <th style={tableHead}>
                                Date
                            </th>

                            <th style={tableHead}>
                                Amount
                            </th>

                            <th style={tableHead}>
                                Method
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

                        {filteredBills.map((b) => (

                            <tr
                                key={b.bill_id}
                            >

                                <td style={tableData}>
                                    {b.patient_name}
                                </td>

                                <td style={tableData}>
                                    {b.doctor_name}
                                </td>

                                <td style={tableData}>

                                    {
                                        new Date(
                                            b.bill_date
                                        )
                                        .toLocaleDateString()
                                    }

                                </td>

                                <td style={tableData}>
                                    Rs. {b.total_amount}
                                </td>

                                <td style={tableData}>
                                    {
                                        b.payment_method
                                        || '-'
                                    }
                                </td>

                                <td
                                    style={{
                                        ...tableData,

                                        color:

                                            b.status === 'paid'
                                                ? 'green'
                                                : 'orange',

                                        fontWeight:
                                            'bold'
                                    }}
                                >

                                    {b.status}

                                </td>

                                <td style={tableData}>

                                    {b.status !== 'paid' ? (

                                        <div
                                            style={{
                                                display:
                                                    'flex',

                                                gap: '10px'
                                            }}
                                        >

                                            <select

                                                value={
                                                    paymentMethods[
                                                        b.bill_id
                                                    ]
                                                    || 'Cash'
                                                }

                                                onChange={(e) =>

                                                    setPaymentMethods({

                                                        ...paymentMethods,

                                                        [b.bill_id]:
                                                            e.target.value
                                                    })

                                                }

                                                style={selectStyle}
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

                                                onClick={() =>

                                                    markAsPaid(
                                                        b.bill_id
                                                    )

                                                }

                                                style={payBtn}
                                            >

                                                Mark Paid

                                            </button>

                                        </div>

                                    ) : (

                                        <span
                                            style={{
                                                color:
                                                    'green',

                                                fontWeight:
                                                    'bold'
                                            }}
                                        >

                                            Paid

                                        </span>

                                    )}

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

/* STYLES */

const statsGrid = {
    display: 'grid',
    gridTemplateColumns:
        'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
};

const logoutBtn = {
    padding: '12px 22px',
    border: 'none',
    borderRadius: '12px',
    background: 'white',
    color: '#0f766e',
    fontWeight: '700',
    cursor: 'pointer'
};

const messageBox = {
    background: '#ecfeff',
    color: '#0f766e',
    padding: '14px',
    borderRadius: '12px',
    marginBottom: '25px',
    fontWeight: '600',
    textAlign: 'center'
};

const searchInput = {
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    width: '250px'
};

const selectStyle = {
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1'
};

const payBtn = {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '10px',
    background: '#16a34a',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '600'
};

const cardStyle = {
    background: 'white',
    borderRadius: '20px',
    padding: '25px'
};

const cardTitle = {
    color: '#64748b',
    marginBottom: '10px'
};

const cardValue = {
    fontSize: '42px',
    fontWeight: '700'
};

const panelStyle = {
    background: 'white',
    borderRadius: '20px',
    padding: '30px'
};

const sectionTitle = {
    marginBottom: '25px'
};

const inputStyle = {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    background: '#f8fafc',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box'
};

const buttonStyle = {
    padding: '15px',
    border: 'none',
    borderRadius: '12px',
    background:
        'linear-gradient(to right, #0f766e, #0284c7)',
    color: 'white',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer'
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
};

const tableHeaderRow = {
    background: '#f1f5f9'
};

const tableHead = {
    padding: '16px',
    textAlign: 'left',
    color: '#334155',
    fontSize: '15px'
};

const tableData = {
    padding: '16px',
    borderBottom:
        '1px solid #e2e8f0',
    color: '#0f172a'
};