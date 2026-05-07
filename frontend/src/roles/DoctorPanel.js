import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api';

export default function DoctorDashboard() {

    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);

    const [message, setMessage] = useState('');

    // Prescription form
    const [form, setForm] = useState({
        patient_id: '',
        doctor_id: '',
        date: '',
        details: [
            {
                medicine_id: '',
                quantity: ''
            }
        ]
    });

    // Logged doctor
    const doctorId = localStorage.getItem('doctor_id') || 2;

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {

            const [
                patientsRes,
                appointmentsRes,
                medicinesRes,
                prescriptionsRes
            ] = await Promise.all([
                fetch(`${API_URL}/patients`),
                fetch(`${API_URL}/appointments/doctor/${doctorId}`),
                fetch(`${API_URL}/medicines`),
                fetch(`${API_URL}/prescriptions`)
            ]);

            const patientsData = await patientsRes.json();
            const appointmentsData = await appointmentsRes.json();
            const medicinesData = await medicinesRes.json();
            const prescriptionsData = await prescriptionsRes.json();

            setPatients(Array.isArray(patientsData) ? patientsData : []);
            setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
            setMedicines(Array.isArray(medicinesData) ? medicinesData : []);
            setPrescriptions(Array.isArray(prescriptionsData) ? prescriptionsData : []);

        } catch (err) {
            console.error(err);
        }
    }

    // Create prescription
    async function handleSubmit(e) {
        e.preventDefault();

        try {

            const payload = {
                patient_id: Number(form.patient_id),
                doctor_id: Number(doctorId),
                date: form.date,
                details: form.details.map(item => ({
                    medicine_id: Number(item.medicine_id),
                    quantity: Number(item.quantity)
                }))
            };

            const res = await fetch(`${API_URL}/prescriptions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {

                setMessage('Prescription created successfully ✅');

                setForm({
                    patient_id: '',
                    doctor_id: '',
                    date: '',
                    details: [
                        {
                            medicine_id: '',
                            quantity: ''
                        }
                    ]
                });

                loadData();

            } else {
                setMessage('Failed to create prescription ❌');
            }

        } catch (err) {
            setMessage('Server error ❌');
        }
    }

    // Medicine row change
    function handleDetailChange(index, field, value) {

        const updated = [...form.details];

        updated[index][field] = value;

        setForm({
            ...form,
            details: updated
        });
    }

    // Add medicine row
    function addMedicineRow() {

        setForm({
            ...form,
            details: [
                ...form.details,
                {
                    medicine_id: '',
                    quantity: ''
                }
            ]
        });
    }

    return (

        <div className="page-content">

            <h1>👨‍⚕️ Doctor Dashboard</h1>
            <p>Medical records, appointments & prescription management</p>

            {/* MESSAGE */}
            {message && (
                <p className="small-note">
                    {message}
                </p>
            )}

            {/* APPOINTMENTS */}
            <div className="table-panel">

                <h3>📅 My Appointments</h3>

                <table>

                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Age</th>
                            <th>Date</th>
                        </tr>
                    </thead>

                    <tbody>

                        {appointments.map((a, i) => (

                            <tr key={i}>
                                <td>{a.patient_name}</td>
                                <td>{a.age}</td>
                                <td>{a.date}</td>
                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {/* CREATE PRESCRIPTION */}
            <div className="form-panel">

                <h3>📝 Write Prescription</h3>

                <form onSubmit={handleSubmit}>

                    <select
                        value={form.patient_id}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                patient_id: e.target.value
                            })
                        }
                        required
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
                        value={form.date}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                date: e.target.value
                            })
                        }
                        required
                    />

                    {/* MEDICINES */}
                    <div className="form-panel">

                        <h4>💊 Medicines</h4>

                        {form.details.map((detail, index) => (

                            <div
                                className="form-row"
                                key={index}
                            >

                                <select
                                    value={detail.medicine_id}
                                    onChange={(e) =>
                                        handleDetailChange(
                                            index,
                                            'medicine_id',
                                            e.target.value
                                        )
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Medicine
                                    </option>

                                    {medicines.map((m) => (

                                        <option
                                            key={m.medicine_id}
                                            value={m.medicine_id}
                                        >
                                            {m.name}
                                        </option>

                                    ))}

                                </select>

                                <input
                                    type="number"
                                    placeholder="Quantity"
                                    value={detail.quantity}
                                    onChange={(e) =>
                                        handleDetailChange(
                                            index,
                                            'quantity',
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                        ))}

                        <button
                            type="button"
                            onClick={addMedicineRow}
                        >
                            Add Medicine
                        </button>

                    </div>

                    <button type="submit">
                        Save Prescription
                    </button>

                </form>

            </div>

            {/* PATIENT LIST */}
            <div className="table-panel">

                <h3>👥 Patients</h3>

                <table>

                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Phone</th>
                        </tr>
                    </thead>

                    <tbody>

                        {patients.map((p) => (

                            <tr key={p.patient_id}>
                                <td>{p.name}</td>
                                <td>{p.age}</td>
                                <td>{p.phone}</td>
                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {/* PRESCRIPTIONS */}
            <div className="table-panel">

                <h3>📄 Recent Prescriptions</h3>

                <table>

                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Date</th>
                            <th>Doctor</th>
                        </tr>
                    </thead>

                    <tbody>

                        {prescriptions.map((p, i) => (

                            <tr key={i}>
                                <td>{p.patient_name}</td>
                                <td>{p.date}</td>
                                <td>{p.doctor_name}</td>
                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}