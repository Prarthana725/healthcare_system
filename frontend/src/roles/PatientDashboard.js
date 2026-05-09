import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api';

export default function PatientDashboard() {

    //--------------------------------------------------
    // STATES
    //--------------------------------------------------

    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');

    const [doctors, setDoctors] =
        useState([]);

    const [appointmentForm,
        setAppointmentForm] =
        useState({

            doctor_id: '',

            date: ''

        });

    const [message, setMessage] =
        useState('');

    //--------------------------------------------------
    // GET LOGGED USER
    //--------------------------------------------------

    const user = JSON.parse(
        localStorage.getItem('user')
    );

    //--------------------------------------------------
    // LOAD DASHBOARD
    //--------------------------------------------------

    useEffect(() => {

        if (user) {

            loadDashboard();

            loadDoctors();

        } else {

            setError(
                'User not logged in'
            );

            setLoading(false);

        }

    }, []);

    //--------------------------------------------------
    // FETCH PATIENT DATA
    //--------------------------------------------------

    async function loadDashboard() {

        try {

            const patientId =
                user.patient_id;

            if (!patientId) {

                setError(
                    'Patient ID not found'
                );

                return;
            }

            const res = await fetch(

                `${API_URL}/patients/with-data/${patientId}`

            );

            const result =
                await res.json();

            setData({

                patient: {

                    patient_id:
                        result.patient_id,

                    name:
                        result.name,

                    age:
                        result.age,

                    phone:
                        result.phone

                },

                appointments:
                    result.appointments || [],

                prescriptions:
                    result.prescriptions || [],

                bills:
                    result.bills || []

            });

        } catch (err) {

            console.error(err);

            setError(
                'Failed to load dashboard'
            );

        } finally {

            setLoading(false);

        }
    }

    //--------------------------------------------------
    // LOAD DOCTORS
    //--------------------------------------------------

    async function loadDoctors() {

        try {

            const res = await fetch(

                `${API_URL}/doctors`

            );

            const result =
                await res.json();

            setDoctors(result);

        } catch (error) {

            console.error(error);

        }
    }

    //--------------------------------------------------
    // BOOK APPOINTMENT
    //--------------------------------------------------

    async function bookAppointment(e) {

        e.preventDefault();

        try {

            const res = await fetch(

                `${API_URL}/appointments`,

                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body: JSON.stringify({

                        patient_id:
                            user.patient_id,

                        doctor_id:
                            appointmentForm.doctor_id,

                        date:
                            appointmentForm.date
                    })
                }
            );

            const data =
                await res.json();

            if (res.ok) {

                setMessage(

                    'Appointment booked successfully ✅'

                );

                setAppointmentForm({

                    doctor_id: '',

                    date: ''

                });

                loadDashboard();

            } else {

                setMessage(

                    data.error ||

                    'Failed to book appointment ❌'

                );

            }

        } catch (error) {

            console.error(error);

            setMessage(
                'Server error ❌'
            );

        }
    }

    //--------------------------------------------------
    // LOGOUT
    //--------------------------------------------------

    function logout() {

        localStorage.clear();

        window.location.href =
            '/login';
    }

    //--------------------------------------------------
    // LOADING SCREEN
    //--------------------------------------------------

    if (loading) {

        return (

            <div style={centerStyle}>

                <h2
                    style={{
                        color: '#0f766e'
                    }}
                >
                    Loading Dashboard...
                </h2>

            </div>

        );
    }

    //--------------------------------------------------
    // ERROR SCREEN
    //--------------------------------------------------

    if (error) {

        return (

            <div style={centerStyle}>

                <h2
                    style={{
                        color: '#dc2626'
                    }}
                >
                    {error}
                </h2>

            </div>

        );
    }

    //--------------------------------------------------
    // MAIN UI
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

                    justifyContent: 'space-between',

                    alignItems: 'center'
                }}
            >

                <div>

                    <h1
                        style={{
                            margin: 0,
                            fontSize: '34px'
                        }}
                    >
                        🧑‍⚕️ Patient Dashboard
                    </h1>

                    <p
                        style={{
                            marginTop: '10px',
                            opacity: 0.9
                        }}
                    >
                        View medical history,
                        appointments and billing information
                    </p>

                </div>

                <button
                    onClick={logout}
                    style={logoutButton}
                >
                    Logout
                </button>

            </div>

            {/* STATS */}

            <div style={statsGrid}>

                <div style={statsCard}>

                    <h3>Total Appointments</h3>

                    <h1>
                        {data.appointments.length}
                    </h1>

                </div>

                <div style={statsCard}>

                    <h3>Prescriptions</h3>

                    <h1>
                        {data.prescriptions.length}
                    </h1>

                </div>

                <div style={statsCard}>

                    <h3>Total Bills</h3>

                    <h1>
                        {data.bills.length}
                    </h1>

                </div>

            </div>

            {/* PATIENT INFO */}

            <div style={cardStyle}>

                <h2 style={sectionTitle}>
                    👤 Patient Information
                </h2>

                <div style={infoGrid}>

                    <div style={infoBox}>
                        <p style={infoLabel}>
                            Name
                        </p>

                        <h3>
                            {data.patient.name}
                        </h3>
                    </div>

                    <div style={infoBox}>
                        <p style={infoLabel}>
                            Age
                        </p>

                        <h3>
                            {data.patient.age}
                        </h3>
                    </div>

                    <div style={infoBox}>
                        <p style={infoLabel}>
                            Phone
                        </p>

                        <h3>
                            {data.patient.phone}
                        </h3>
                    </div>

                </div>

            </div>

            {/* APPOINTMENTS */}

            <div style={cardStyle}>

                <h2 style={sectionTitle}>
                    📅 Pending Appointments
                </h2>

                <table style={tableStyle}>

                    <thead>

                        <tr style={tableHeaderRow}>

                            <th style={tableHead}>
                                Date
                            </th>

                            <th style={tableHead}>
                                Doctor
                            </th>

                            <th style={tableHead}>
                                Specialization
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {data.appointments.map((a) => (

                            <tr
                                key={a.appointment_id}
                            >

                                <td style={tableData}>

                                    {
                                        new Date(a.date)
                                            .toLocaleDateString()
                                    }

                                </td>

                                <td style={tableData}>
                                    {a.doctor_name}
                                </td>

                                <td style={tableData}>
                                    {a.specialization}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {/* BOOK APPOINTMENT */}

            <div style={cardStyle}>

                <h2 style={sectionTitle}>
                    📅 Book Appointment
                </h2>

                <form
                    onSubmit={bookAppointment}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '18px'
                    }}
                >

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

                        {doctors.map((doctor) => (

                            <option

                                key={doctor.doctor_id}

                                value={doctor.doctor_id}
                            >

                                {doctor.name}
                                {' - '}
                                {doctor.specialization}

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

                {message && (

                    <div style={messageStyle}>
                        {message}
                    </div>

                )}

            </div>

            {/* PRESCRIPTIONS */}

            <div style={cardStyle}>

                <h2 style={sectionTitle}>
                    💊 Medical History
                </h2>

                <table style={tableStyle}>

                    <thead>

                        <tr style={tableHeaderRow}>

                            <th style={tableHead}>
                                Date
                            </th>

                            <th style={tableHead}>
                                Doctor
                            </th>

                            <th style={tableHead}>
                                Medicine
                            </th>

                            <th style={tableHead}>
                                Quantity
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {data.prescriptions.map((p) => (

                            <tr
                                key={p.prescription_id}
                            >

                                <td style={tableData}>

                                    {
                                        new Date(p.date)
                                            .toLocaleDateString()
                                    }

                                </td>

                                <td style={tableData}>
                                    {p.doctor_name}
                                </td>

                                <td style={tableData}>

                                    {
                                        p.details
                                            ?.map(

                                                d =>

                                                    d.medicine_name
                                            )

                                            .join(', ')
                                    }

                                </td>

                                <td style={tableData}>

                                    {
                                        p.details
                                            ?.map(

                                                d =>

                                                    d.quantity
                                            )

                                            .join(', ')
                                    }

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {/* BILLS */}

            <div style={cardStyle}>

                <h2 style={sectionTitle}>
                    💳 Bills
                </h2>

                <table style={tableStyle}>

                    <thead>

                        <tr style={tableHeaderRow}>

                            <th style={tableHead}>
                                Bill Date
                            </th>

                            <th style={tableHead}>
                                Total Amount
                            </th>

                            <th style={tableHead}>
                                Status
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {data.bills.map((b) => (

                            <tr key={b.bill_id}>

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

                                        fontWeight: 'bold'
                                    }}
                                >
                                    {b.status}
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

const centerStyle = {

    minHeight: '100vh',

    display: 'flex',

    justifyContent: 'center',

    alignItems: 'center',

    background: '#f1f5f9',

    fontFamily:
        "'Segoe UI', sans-serif"
};

const statsGrid = {

    display: 'grid',

    gridTemplateColumns:
        'repeat(auto-fit, minmax(220px, 1fr))',

    gap: '20px',

    marginBottom: '30px'
};

const statsCard = {

    background: 'white',

    padding: '25px',

    borderRadius: '20px',

    boxShadow:
        '0 5px 20px rgba(0,0,0,0.06)'
};

const logoutButton = {

    padding:
        '12px 24px',

    border: 'none',

    borderRadius: '12px',

    background: 'white',

    color: '#0f766e',

    fontWeight: 'bold',

    cursor: 'pointer'
};

const infoGrid = {

    display: 'grid',

    gridTemplateColumns:
        'repeat(auto-fit, minmax(220px, 1fr))',

    gap: '20px',

    marginTop: '20px'
};

const messageStyle = {

    marginTop: '18px',

    padding: '14px',

    borderRadius: '12px',

    background: '#ecfeff',

    color: '#0f766e',

    fontWeight: '600'
};

const cardStyle = {

    background: 'white',

    borderRadius: '20px',

    padding: '30px',

    marginBottom: '30px',

    boxShadow:
        '0 5px 20px rgba(0,0,0,0.06)'
};

const sectionTitle = {

    marginBottom: '20px',

    color: '#0f172a'
};

const infoBox = {

    background: '#f8fafc',

    padding: '20px',

    borderRadius: '16px',

    border:
        '1px solid #e2e8f0'
};

const infoLabel = {

    color: '#64748b',

    marginBottom: '8px',

    fontSize: '14px'
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

const inputStyle = {

    width: '100%',

    padding: '14px',

    borderRadius: '12px',

    border:
        '1px solid #cbd5e1',

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

    fontSize: '16px',

    fontWeight: '700',

    cursor: 'pointer'
};