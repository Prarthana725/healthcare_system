import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api';

export default function PatientDashboard() {

    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');

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

        } else {

            setError('User not logged in');

            setLoading(false);

        }

    }, []);

    //--------------------------------------------------
    // FETCH PATIENT DATA
    //--------------------------------------------------

    async function loadDashboard() {

        try {

            //--------------------------------------------------
            // GET LOGGED PATIENT ID
            //--------------------------------------------------

            const patientId =
                user.patient_id;

            //--------------------------------------------------
            // CHECK PATIENT ID
            //--------------------------------------------------

            if (!patientId) {

                setError(
                    'Patient ID not found'
                );

                return;
            }

            //--------------------------------------------------
            // FETCH DATA
            //--------------------------------------------------

            const res = await fetch(

                `${API_URL}/patients/with-data/${patientId}`

            );

            const result =
                await res.json();

            console.log(result);

            //--------------------------------------------------
            // SET DASHBOARD DATA
            //--------------------------------------------------

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
                    fontFamily: "'Segoe UI', sans-serif",
                    background: '#f1f5f9'
                }}
            >

                <h2 style={{ color: '#0f766e' }}>
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
                    fontFamily: "'Segoe UI', sans-serif",
                    background: '#f1f5f9'
                }}
            >

                <h2 style={{ color: '#dc2626' }}>
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
                    fontFamily: "'Segoe UI', sans-serif",
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
                fontFamily: "'Segoe UI', sans-serif"
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
                    View medical history, appointments and billing information
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
    border: '1px solid #e2e8f0'
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