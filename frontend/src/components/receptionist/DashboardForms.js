import React from 'react';
import {
    UserPlus,
    Users,
    Phone,
    Calendar,
    CalendarDays,
    ChevronDown
} from 'lucide-react';

export default function DashboardForms({
    form,
    setForm,
    appointmentForm,
    setAppointmentForm,
    patients,
    doctors,
    handlePatientSubmit,
    handleAppointmentSubmit,

    formsGrid,
    panelCard,
    panelHeader,
    panelTitle,
    formStyle,
    inputWrapper,
    inputIcon,
    dropdownArrow,
    iconInput,
    primaryBtn,
    tealBtn
}) {
    return (
        <div style={formsGrid}>

            {/* REGISTER PATIENT */}

            <div style={panelCard}>
                <div style={panelHeader}>
                    <UserPlus size={24} color="#4f46e5" />
                    <h2 style={panelTitle}>
                        Register Patient
                    </h2>
                </div>

                <form
                    onSubmit={handlePatientSubmit}
                    style={formStyle}
                >
                    <div style={inputWrapper}>
                        <Users
                            size={20}
                            color="#94a3b8"
                            style={inputIcon}
                        />

                        <input
                            type="text"
                            placeholder="Patient Name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    name: e.target.value
                                })
                            }
                            style={iconInput}
                            required
                        />
                    </div>

                    <div style={inputWrapper}>
                        <Calendar
                            size={20}
                            color="#94a3b8"
                            style={inputIcon}
                        />

                        <input
                            type="number"
                            placeholder="Age"
                            value={form.age}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    age: e.target.value
                                })
                            }
                            style={iconInput}
                            required
                        />
                    </div>

                    <div style={inputWrapper}>
                        <Phone
                            size={20}
                            color="#94a3b8"
                            style={inputIcon}
                        />

                        <input
                            type="text"
                            placeholder="Phone Number"
                            value={form.phone}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    phone: e.target.value
                                })
                            }
                            style={iconInput}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        style={primaryBtn}
                    >
                        Register Patient
                    </button>
                </form>
            </div>

            {/* BOOK APPOINTMENT */}

            <div style={panelCard}>
                <div style={panelHeader}>
                    <CalendarDays
                        size={24}
                        color="#0284c7"
                    />

                    <h2 style={panelTitle}>
                        Book Appointment
                    </h2>
                </div>

                <form
                    onSubmit={handleAppointmentSubmit}
                    style={formStyle}
                >
                    <div style={inputWrapper}>
                        <select
                            value={appointmentForm.patient_id}
                            onChange={(e) =>
                                setAppointmentForm({
                                    ...appointmentForm,
                                    patient_id:
                                        e.target.value
                                })
                            }
                            style={iconInput}
                            required
                        >
                            <option value="">
                                Select Patient
                            </option>

                            {patients.map((p) => (
                                <option
                                    key={
                                        p.patient_id ||
                                        p.id
                                    }
                                    value={
                                        p.patient_id ||
                                        p.id
                                    }
                                >
                                    {p.name}
                                </option>
                            ))}
                        </select>

                        <ChevronDown
                            size={20}
                            color="#94a3b8"
                            style={dropdownArrow}
                        />
                    </div>

                    <div style={inputWrapper}>
                        <select
                            value={appointmentForm.doctor_id}
                            onChange={(e) =>
                                setAppointmentForm({
                                    ...appointmentForm,
                                    doctor_id:
                                        e.target.value
                                })
                            }
                            style={iconInput}
                            required
                        >
                            <option value="">
                                Select Doctor
                            </option>

                            {doctors.map((d) => (
                                <option
                                    key={
                                        d.doctor_id ||
                                        d.id
                                    }
                                    value={
                                        d.doctor_id ||
                                        d.id
                                    }
                                >
                                    {d.name}
                                    {' '}
                                    ({d.specialization})
                                </option>
                            ))}
                        </select>

                        <ChevronDown
                            size={20}
                            color="#94a3b8"
                            style={dropdownArrow}
                        />
                    </div>

                    <div style={inputWrapper}>
                        <Calendar
                            size={20}
                            color="#94a3b8"
                            style={inputIcon}
                        />

                        <input
                            type="date"
                            value={appointmentForm.date}
                            onChange={(e) =>
                                setAppointmentForm({
                                    ...appointmentForm,
                                    date: e.target.value
                                })
                            }
                            style={iconInput}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        style={tealBtn}
                    >
                        Book Appointment
                    </button>
                </form>
            </div>

        </div>
    );
}