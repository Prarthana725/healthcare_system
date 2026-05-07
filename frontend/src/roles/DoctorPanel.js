import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api';

export default function DoctorPanel() {

    const user = JSON.parse(localStorage.getItem('user'));

    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [medicines, setMedicines] = useState([]);

    const [message, setMessage] = useState('');

    const [prescriptionForm, setPrescriptionForm] = useState({
        patient_id: '',
        date: '',
        details: [
            {
                medicine_id: '',
                quantity: ''
            }
        ]
    });

    useEffect(() => {

        loadAppointments();
        loadPatients();
        loadMedicines();

    }, []);

    async function loadAppointments() {

        try {

            const res = await fetch(
                `${API_URL}/appointments/doctor/${user.doctor_id}`
            );

            const data = await res.json();

            setAppointments(Array.isArray(data) ? data : []);

        } catch (err) {

            console.error(err);

        }
    }

    async function loadPatients() {

        try {

            const res = await fetch(`${API_URL}/patients`);

            const data = await res.json();

            setPatients(data);

        } catch (err) {

            console.error(err);

        }
    }

    async function loadMedicines() {

        try {

            const res = await fetch(`${API_URL}/medicines`);

            const data = await res.json();

            setMedicines(data);

        } catch (err) {

            console.error(err);

        }
    }

    async function updateAppointmentStatus(id, status) {

        try {

            const res = await fetch(
                `${API_URL}/appointments/${id}/status`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status })
                }
            );

            if (res.ok) {

                loadAppointments();

            }

        } catch (err) {

            console.error(err);

        }
    }

    function handleMedicineChange(index, field, value) {

        const updated = [...prescriptionForm.details];

        updated[index][field] = value;

        setPrescriptionForm({
            ...prescriptionForm,
            details: updated
        });
    }

    function addMedicineRow() {

        setPrescriptionForm({
            ...prescriptionForm,
            details: [
                ...prescriptionForm.details,
                {
                    medicine_id: '',
                    quantity: ''
                }
            ]
        });
    }

    async function handlePrescriptionSubmit(e) {

        e.preventDefault();

        try {

            const formattedDetails =
                prescriptionForm.details.map((d) => ({
                    medicine_id: Number(d.medicine_id),
                    quantity: Number(d.quantity)
                }));

            const res = await fetch(
                `${API_URL}/prescriptions`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        patient_id: Number(
                            prescriptionForm.patient_id
                        ),
                        doctor_id: user.doctor_id,
                        date: prescriptionForm.date,
                        details: formattedDetails
                    })
                }
            );

            if (res.ok) {

                setMessage(
                    'Prescription created successfully ✅'
                );

                setPrescriptionForm({
                    patient_id: '',
                    date: '',
                    details: [
                        {
                            medicine_id: '',
                            quantity: ''
                        }
                    ]
                });

            } else {

                setMessage(
                    'Failed to create prescription ❌'
                );

            }

        } catch (err) {

            setMessage('Server error ❌');

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
                    marginBottom: '30px'
                }}
            >

                <h1>👩‍⚕️ Doctor Panel</h1>

                <p>
                    Manage appointments and create prescriptions
                </p>

            </div>

            {/* STATS */}

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns:
                        'repeat(auto-fit, minmax(220px, 1fr))',
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

            {/* APPOINTMENTS */}

            <div style={panelStyle}>

                <h2 style={sectionTitle}>
                    📋 My Appointments
                </h2>

                <table style={tableStyle}>

                    <thead>

                        <tr style={tableHeaderRow}>

                            <th style={tableHead}>Patient</th>
                            <th style={tableHead}>Age</th>
                            <th style={tableHead}>Date</th>
                            <th style={tableHead}>Status</th>
                            <th style={tableHead}>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {appointments.map((a) => (

                            <tr key={a.appointment_id}>

                                <td style={tableData}>
                                    {a.patient_name}
                                </td>

                                <td style={tableData}>
                                    {a.age}
                                </td>

                                <td style={tableData}>
                                    {a.date}
                                </td>

                                <td style={tableData}>
                                    {a.status || 'pending'}
                                </td>

                                <td style={tableData}>

                                    <button
                                        onClick={() =>
                                            updateAppointmentStatus(
                                                a.appointment_id,
                                                'completed'
                                            )
                                        }
                                        style={btnStyle}
                                    >
                                        Complete
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {/* PRESCRIPTION */}

            <div
                style={{
                    ...panelStyle,
                    marginTop: '30px'
                }}
            >

                <h2 style={sectionTitle}>
                    💊 Create Prescription
                </h2>

                <form
                    onSubmit={handlePrescriptionSubmit}
                >

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns:
                                '1fr 1fr',
                            gap: '15px',
                            marginBottom: '20px'
                        }}
                    >

                        <select
                            value={
                                prescriptionForm.patient_id
                            }
                            onChange={(e) =>
                                setPrescriptionForm({
                                    ...prescriptionForm,
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

                        <input
                            type="date"
                            value={prescriptionForm.date}
                            onChange={(e) =>
                                setPrescriptionForm({
                                    ...prescriptionForm,
                                    date: e.target.value
                                })
                            }
                            required
                            style={inputStyle}
                        />

                    </div>

                    {prescriptionForm.details.map(
                        (d, index) => (

                            <div
                                key={index}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns:
                                        '2fr 1fr',
                                    gap: '15px',
                                    marginBottom: '15px'
                                }}
                            >

                                <select
                                    value={d.medicine_id}
                                    onChange={(e) =>
                                        handleMedicineChange(
                                            index,
                                            'medicine_id',
                                            e.target.value
                                        )
                                    }
                                    required
                                    style={inputStyle}
                                >

                                    <option value="">
                                        Select Medicine
                                    </option>

                                    {medicines.map((m) => (

                                        <option
                                            key={
                                                m.medicine_id
                                            }
                                            value={
                                                m.medicine_id
                                            }
                                        >
                                            {m.name}
                                        </option>

                                    ))}

                                </select>

                                <input
                                    type="number"
                                    placeholder="Quantity"
                                    value={d.quantity}
                                    onChange={(e) =>
                                        handleMedicineChange(
                                            index,
                                            'quantity',
                                            e.target.value
                                        )
                                    }
                                    required
                                    style={inputStyle}
                                />

                            </div>

                        )
                    )}

                    <button
                        type="button"
                        onClick={addMedicineRow}
                        style={secondaryBtn}
                    >
                        + Add Medicine
                    </button>

                    <br />
                    <br />

                    <button
                        type="submit"
                        style={submitBtn}
                    >
                        Create Prescription
                    </button>

                </form>

                {message && (

                    <div style={messageStyle}>
                        {message}
                    </div>

                )}

            </div>

        </div>

    );
}

/* STYLES */

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
    borderBottom: '1px solid #e2e8f0'
};

const inputStyle = {
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    width: '100%'
};

const btnStyle = {
    padding: '10px 15px',
    background: '#0f766e',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer'
};

const secondaryBtn = {
    padding: '12px 18px',
    border: 'none',
    borderRadius: '10px',
    background: '#0284c7',
    color: 'white',
    cursor: 'pointer'
};

const submitBtn = {
    padding: '14px 20px',
    border: 'none',
    borderRadius: '12px',
    background: 'linear-gradient(to right, #0f766e, #0284c7)',
    color: 'white',
    fontWeight: '700',
    cursor: 'pointer'
};

const messageStyle = {
    marginTop: '20px',
    padding: '14px',
    borderRadius: '10px',
    background: '#ecfeff',
    color: '#0f766e',
    fontWeight: '600'
};