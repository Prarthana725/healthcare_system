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
    // LOADING SCREEN
    //--------------------------------------------------

    if (loading) {

        return (

            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontFamily:
                        "'Segoe UI', sans-serif",
                    background: '#f1f5f9'
                }}
            >

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

            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontFamily:
                        "'Segoe UI', sans-serif",
                    background: '#f1f5f9'
                }}
            >

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
    // NO DATA
    //--------------------------------------------------

    if (!data || !data.patient) {

        return (

            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontFamily:
                        "'Segoe UI', sans-serif",
                    background: '#f1f5f9'
                }}
            >

                <h2>
                    No patient data found
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

                    boxShadow:
                        '0 10px 30px rgba(0,0,0,0.1)'
                }}
            >

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
                        opacity: 0.9,
                        fontSize: '16px'
                    }}
                >
                    View medical history,
                    appointments and billing information
                </p>

            </div>

            {/* PATIENT INFO */}

            <div style={cardStyle}>

                <h2 style={sectionTitle}>
                    👤 Patient Information
                </h2>

                <div
                    style={{
                        display: 'grid',

                        gridTemplateColumns:
                            'repeat(auto-fit, minmax(220px, 1fr))',

                        gap: '20px',

                        marginTop: '20px'
                    }}
                >

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

                <div style={{ overflowX: 'auto' }}>

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

                            {data.appointments &&
                            data.appointments.length > 0 ? (

                                data.appointments.map((a) => (

                                    <tr
                                        key={a.appointment_id}
                                    >

                                        <td style={tableData}>
                                            {a.date}
                                        </td>

                                        <td style={tableData}>
                                            {a.doctor_name}
                                        </td>

                                        <td style={tableData}>
                                            {a.specialization}
                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="3"
                                        style={emptyStyle}
                                    >
                                        No appointments found
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

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

                    <div
                        style={{
                            marginTop: '18px',
                            padding: '14px',
                            borderRadius: '12px',
                            background: '#ecfeff',
                            color: '#0f766e',
                            fontWeight: '600'
                        }}
                    >
                        {message}
                    </div>

                )}

            </div>

            {/* PRESCRIPTIONS */}

            <div style={cardStyle}>

                <h2 style={sectionTitle}>
                    💊 Medical History
                </h2>

                <div style={{ overflowX: 'auto' }}>

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

                            {data.prescriptions &&
                            data.prescriptions.length > 0 ? (

                                data.prescriptions.map((p) => (

                                    <tr
                                        key={p.prescription_id}
                                    >

                                        <td style={tableData}>
                                            {p.date}
                                        </td>

                                        <td style={tableData}>
                                            {p.doctor_name}
                                        </td>

                                        <td style={tableData}>
                                            {p.medicine_name}
                                        </td>

                                        <td style={tableData}>
                                            {p.quantity}
                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="4"
                                        style={emptyStyle}
                                    >
                                        No medical history found
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* BILLS */}

            <div style={cardStyle}>

                <h2 style={sectionTitle}>
                    💳 Bills
                </h2>

                <div style={{ overflowX: 'auto' }}>

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

                            {data.bills &&
                            data.bills.length > 0 ? (

                                data.bills.map((b) => (

                                    <tr key={b.bill_id}>

                                        <td style={tableData}>
                                            {b.bill_date}
                                        </td>

                                        <td style={tableData}>
                                            Rs. {b.total_amount}
                                        </td>

                                        <td style={tableData}>
                                            {b.status}
                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="3"
                                        style={emptyStyle}
                                    >
                                        No bills available
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

/* STYLES */

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

const emptyStyle = {

    padding: '20px',

    textAlign: 'center',

    color: '#64748b'
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