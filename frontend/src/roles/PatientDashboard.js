import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api';

export default function PatientDashboard() {

    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');

    const user = JSON.parse(
        localStorage.getItem('user')
    );

    useEffect(() => {

        if (user) {

            loadDashboard();

        } else {

            setError('User not logged in');

            setLoading(false);

        }

    }, []);

    async function loadDashboard() {

        try {

            //--------------------------------------------------
            // TEMP FIX
            //--------------------------------------------------

            const patientId = 1;

            const res = await fetch(
                `${API_URL}/patients/dashboard/${patientId}`
            );

            const result = await res.json();

            console.log(result);

            setData(result);

        } catch (err) {

            console.error(err);

            setError('Failed to load dashboard');

        } finally {

            setLoading(false);

        }
    }

    //--------------------------------------------------
    // LOADING
    //--------------------------------------------------

    if (loading) {

        return <h2>Loading Dashboard...</h2>;

    }

    //--------------------------------------------------
    // ERROR
    //--------------------------------------------------

    if (error) {

        return <h2>{error}</h2>;

    }

    //--------------------------------------------------
    // NO DATA
    //--------------------------------------------------

    if (!data || !data.patient) {

        return <h2>No patient data found</h2>;

    }

    return (

        <div>

            <h1>
                Patient Dashboard 🧑‍⚕️
            </h1>

            <p>
                View medical history and pending appointments
            </p>

            <hr />

            {/* PATIENT INFO */}

            <h2>
                Patient Information
            </h2>

            <p>
                <strong>Name:</strong>
                {' '}
                {data.patient.name}
            </p>

            <p>
                <strong>Age:</strong>
                {' '}
                {data.patient.age}
            </p>

            <p>
                <strong>Phone:</strong>
                {' '}
                {data.patient.phone}
            </p>

            <hr />

            {/* APPOINTMENTS */}

            <h2>
                Pending Appointments
            </h2>

            <table border="1" cellPadding="10">

                <thead>

                    <tr>

                        <th>Date</th>

                        <th>Doctor</th>

                        <th>Specialization</th>

                    </tr>

                </thead>

                <tbody>

                    {data.appointments &&
                    data.appointments.length > 0 ? (

                        data.appointments.map((a) => (

                            <tr key={a.appointment_id}>

                                <td>{a.date}</td>

                                <td>{a.doctor_name}</td>

                                <td>{a.specialization}</td>

                            </tr>

                        ))

                    ) : (

                        <tr>

                            <td colSpan="3">
                                No appointments found
                            </td>

                        </tr>

                    )}

                </tbody>

            </table>

            <hr />

            {/* MEDICAL HISTORY */}

            <h2>
                Medical History
            </h2>

            <table border="1" cellPadding="10">

                <thead>

                    <tr>

                        <th>Date</th>

                        <th>Doctor</th>

                        <th>Medicine</th>

                        <th>Quantity</th>

                    </tr>

                </thead>

                <tbody>

                    {data.prescriptions &&
                    data.prescriptions.length > 0 ? (

                        data.prescriptions.map((p) => (

                            <tr key={p.prescription_id}>

                                <td>{p.date}</td>

                                <td>{p.doctor_name}</td>

                                <td>{p.medicine_name}</td>

                                <td>{p.quantity}</td>

                            </tr>

                        ))

                    ) : (

                        <tr>

                            <td colSpan="4">
                                No medical history found
                            </td>

                        </tr>

                    )}

                </tbody>

            </table>

            <hr />

            {/* BILLS */}

            <h2>
                Bills
            </h2>

            <table border="1" cellPadding="10">

                <thead>

                    <tr>

                        <th>Bill Date</th>

                        <th>Total Amount</th>

                        <th>Status</th>

                    </tr>

                </thead>

                <tbody>

                    {data.bills &&
                    data.bills.length > 0 ? (

                        data.bills.map((b) => (

                            <tr key={b.bill_id}>

                                <td>{b.bill_date}</td>

                                <td>
                                    Rs. {b.total_amount}
                                </td>

                                <td>{b.status}</td>

                            </tr>

                        ))

                    ) : (

                        <tr>

                            <td colSpan="3">
                                No bills available
                            </td>

                        </tr>

                    )}

                </tbody>

            </table>

        </div>
    );
}