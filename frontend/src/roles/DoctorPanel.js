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

        <div>

            <h1>
                Doctor Panel 👩‍⚕️
            </h1>

            <p>
                Manage patients and prescriptions
            </p>

            <hr />

            <h2>
                My Appointments
            </h2>

            <table border="1" cellPadding="10">

                <thead>

                    <tr>

                        <th>Patient</th>

                        <th>Age</th>

                        <th>Date</th>

                    </tr>

                </thead>

                <tbody>

                    {appointments.length > 0 ? (

                        appointments.map((a) => (

                            <tr key={a.appointment_id}>

                                <td>
                                    {a.patient_name}
                                </td>

                                <td>
                                    {a.age}
                                </td>

                                <td>
                                    {a.date}
                                </td>

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

        </div>
    );
}