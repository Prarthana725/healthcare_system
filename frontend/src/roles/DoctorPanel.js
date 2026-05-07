import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api';

export default function DoctorPanel() {

    const [appointments, setAppointments] =
        useState([]);

    const user = JSON.parse(
        localStorage.getItem('user')
    );

    useEffect(() => {

        loadAppointments();

    }, []);

    async function loadAppointments() {

        try {

            const res = await fetch(

                `${API_URL}/appointments/doctor/${user.doctor_id}`

            );

            const data = await res.json();

            console.log(data);

            setAppointments(data);

        } catch (err) {

            console.error(err);

        }
    }

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
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}
            >

                <h1
                    style={{
                        margin: 0,
                        fontSize: '34px'
                    }}
                >
                    👩‍⚕️ Doctor Panel
                </h1>

                <p
                    style={{
                        marginTop: '10px',
                        opacity: 0.9,
                        fontSize: '16px'
                    }}
                >
                    Manage patients and appointments
                </p>

            </div>

            {/* STATS CARD */}

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns:
                        'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px',
                    marginBottom: '30px'
                }}
            >

                <div style={cardStyle}>

                    <div style={cardTitle}>
                        📅 Total Appointments
                    </div>

                    <div style={cardValue}>
                        {appointments.length}
                    </div>

                </div>

            </div>

            {/* APPOINTMENTS TABLE */}

            <div style={panelStyle}>

                <h2 style={sectionTitle}>
                    📋 My Appointments
                </h2>

                <div style={{ overflowX: 'auto' }}>

                    <table style={tableStyle}>

                        <thead>

                            <tr style={tableHeaderRow}>

                                <th style={tableHead}>
                                    Patient
                                </th>

                                <th style={tableHead}>
                                    Age
                                </th>

                                <th style={tableHead}>
                                    Appointment Date
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {appointments.length > 0 ? (

                                appointments.map((a) => (

                                    <tr
                                        key={a.appointment_id}
                                    >

                                        <td style={tableData}>
                                            {a.patient_name}
                                        </td>

                                        <td style={tableData}>
                                            {a.age}
                                        </td>

                                        <td style={tableData}>
                                            {a.date}
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

        </div>
    );
}

/* STYLES */

const cardStyle = {
    background: 'white',
    borderRadius: '20px',
    padding: '25px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.06)'
};

const cardTitle = {
    color: '#64748b',
    fontSize: '16px',
    marginBottom: '15px'
};

const cardValue = {
    fontSize: '42px',
    fontWeight: '700',
    color: '#0f172a'
};

const panelStyle = {
    background: 'white',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.06)'
};

const sectionTitle = {
    marginBottom: '25px',
    color: '#0f172a'
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
    borderBottom: '1px solid #e2e8f0',
    color: '#0f172a'
};

const emptyStyle = {
    padding: '20px',
    textAlign: 'center',
    color: '#64748b'
};