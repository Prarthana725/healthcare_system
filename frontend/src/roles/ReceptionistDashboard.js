import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api';

export default function ReceptionistDashboard() {

    const [patients, setPatients] = useState([]);

    const [appointments, setAppointments] = useState([]);

    const [doctors, setDoctors] = useState([]);

    const [bills, setBills] = useState([]);

    const [paymentMethods,
        setPaymentMethods] =
        useState({});

    const [form, setForm] = useState({
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

            console.error(
                'Load error:',
                err
            );
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

            const res = await fetch(

                `${API_URL}/patients`,

                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body: JSON.stringify(form)
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

        } catch (err) {

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

        } catch (err) {

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

        } catch (error) {

            console.error(error);

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

    const totalRevenue =

        bills.reduce(

            (sum, b) =>

                sum +
                Number(
                    b.total_amount || 0
                ),

            0
        );

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
                        Patient registration,
                        appointments and
                        payment management
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
                        💳 Bills
                    </div>

                    <div style={cardValue}>
                        {bills.length}
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

            <div style={panelStyle}>

                <h2 style={sectionTitle}>
                    💳 Bill Payments
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
                                Total
                            </th>

                            <th style={tableHead}>
                                Status
                            </th>

                            <th style={tableHead}>
                                Payment
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {bills.map((b) => (

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
                                                    ] || 'Cash'
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

const tableStyle = {

    width: '100%',

    borderCollapse: 'collapse'
};

const tableHeaderRow = {

    background: '#f1f5f9'
};

const tableHead = {

    padding: '14px',

    textAlign: 'left'
};

const tableData = {

    padding: '14px',

    borderBottom:
        '1px solid #e2e8f0'
};