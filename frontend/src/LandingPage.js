import React, { useEffect } from 'react';

import {
    FaUserDoctor,
    FaUserShield,
    FaHospitalUser,
    FaPills,
    FaCalendarCheck,
    FaArrowRight,
    FaHeartPulse,
    FaClock,
    FaShieldHeart,
    FaChartLine,
    FaBedPulse
} from 'react-icons/fa6';

import AOS from 'aos';
import 'aos/dist/aos.css';

export default function LandingPage() {

    useEffect(() => {
        AOS.init({
            duration: 900,
            once: true
        });
    }, []);

    const services = [
        {
            icon: <FaUserShield />,
            title: 'Hospital Administration',
            desc:
                'Control departments, staff accounts, reports and operational analytics from one centralized healthcare platform.'
        },

        {
            icon: <FaUserDoctor />,
            title: 'Doctor Workflow',
            desc:
                'Handle consultations, prescriptions, patient records and appointment scheduling with optimized workflows.'
        },

        {
            icon: <FaPills />,
            title: 'Pharmacy & Inventory',
            desc:
                'Manage medicine stock, low inventory alerts, prescription tracking and pharmacy operations in real-time.'
        },

        {
            icon: <FaCalendarCheck />,
            title: 'Smart Appointment System',
            desc:
                'Reduce waiting time using structured patient scheduling and reception management workflows.'
        }
    ];

    const stats = [
        {
            number: '25K+',
            label: 'Patients Managed'
        },
        {
            number: '120+',
            label: 'Medical Staff'
        },
        {
            number: '24/7',
            label: 'Hospital Operations'
        },
        {
            number: '98%',
            label: 'System Reliability'
        }
    ];

    const features = [
        {
            icon: <FaHeartPulse />,
            title: 'Emergency Monitoring',
            text: 'Track emergency patients and treatment flow instantly.'
        },
        {
            icon: <FaShieldHeart />,
            title: 'Secure Medical Records',
            text: 'Encrypted patient records with role-based access control.'
        },
        {
            icon: <FaChartLine />,
            title: 'Healthcare Analytics',
            text: 'Monitor appointments, pharmacy usage and hospital performance.'
        },
        {
            icon: <FaBedPulse />,
            title: 'Ward & Bed Tracking',
            text: 'Manage ward allocation and live bed availability.'
        }
    ];

    return (

        <div
            style={{
                background: '#f4f8fb',
                minHeight: '100vh',
                fontFamily: "'Inter', sans-serif",
                color: '#0f172a',
                overflowX: 'hidden'
            }}
        >

            {/* NAVBAR */}

            {/* NAVBAR */}

            <nav
                style={{
                    position: 'fixed',
                    top: 0,
                    width: '100%',
                    zIndex: 1000,
                    background: 'rgba(255,255,255,0.78)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(148,163,184,0.18)'
                }}
            >

                <div
                    style={{
                        maxWidth: '1350px',
                        margin: '0 auto',
                        padding: '14px 28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >

                    {/* LEFT - HOSPITAL BRAND */}

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px'
                        }}
                    >

                        {/* ICON */}

                        <div
                            style={{
                                width: '54px',
                                height: '54px',
                                borderRadius: '16px',
                                background:
                                    'linear-gradient(135deg,#0f766e,#0284c7)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '22px',
                                color: 'white',
                                boxShadow:
                                    '0 12px 28px rgba(2,132,199,0.25)'
                            }}
                        >
                            🏥
                        </div>

                        {/* NAME */}

                        <div>

                            <h2
                                style={{
                                    margin: 0,
                                    fontSize: '22px',
                                    fontWeight: '900',
                                    letterSpacing: '-0.6px',
                                    color: '#0f172a'
                                }}
                            >
                                MediCare
                                <span style={{ color: '#0f766e' }}>
                                    {' '}Hospital
                                </span>
                            </h2>

                            <p
                                style={{
                                    margin: 0,
                                    fontSize: '12px',
                                    color: '#64748b'
                                }}
                            >
                                Integrated Hospital Management System
                            </p>

                        </div>

                    </div>

                    {/* CENTER NAV */}

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '28px'
                        }}
                    >

                        {[
                            { label: 'Home', link: '#' },
                            { label: 'About Hospital', link: '#about' },
                            { label: 'Our Services', link: '#services' },
                            { label: 'Care Units', link: '#features' },
                            { label: 'Dashboard', link: '#dashboard' }
                        ].map((item, index) => (

                            <a
                                key={index}
                                href={item.link}
                                style={{
                                    textDecoration: 'none',
                                    color: '#0f172a',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    padding: '8px 6px',
                                    transition: '0.3s'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.color = '#0f766e';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.color = '#0f172a';
                                }}
                            >
                                {item.label}
                            </a>

                        ))}

                    </div>

                    {/* RIGHT SIDE */}

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}
                    >

                        {/* STATUS */}

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 14px',
                                borderRadius: '999px',
                                background: 'rgba(34,197,94,0.12)',
                                color: '#16a34a',
                                fontSize: '12px',
                                fontWeight: '700'
                            }}
                        >
                            <span
                                style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: '#22c55e',
                                    boxShadow: '0 0 10px #22c55e'
                                }}
                            ></span>

                        </div>

                        {/* CTA */}

                        <a
                            href="/login"
                            style={{
                                background:
                                    'linear-gradient(135deg,#0f766e,#0284c7)',
                                color: 'white',
                                padding: '12px 22px',
                                borderRadius: '14px',
                                textDecoration: 'none',
                                fontWeight: '800',
                                fontSize: '14px',
                                boxShadow:
                                    '0 12px 28px rgba(2,132,199,0.25)'
                            }}
                        >
                            Patient Access →
                        </a>

                    </div>

                </div>

            </nav>

            {/* HERO SECTION */}

            <section
                style={{
                    position: 'relative',
                    minHeight: '100vh',
                    padding: '160px 30px 120px',
                    overflow: 'hidden',
                    background:
                        'linear-gradient(135deg,#08111f 0%,#0f172a 45%,#0f766e 100%)'
                }}
            >

                {/* BACKGROUND EFFECTS */}
                <div style={heroGlow1}></div>
                <div style={heroGlow2}></div>

                {/* GRID */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                        opacity: 0.35
                    }}
                ></div>

                <div
                    style={{
                        maxWidth: '1380px',
                        margin: '0 auto',
                        display: 'grid',
                        gridTemplateColumns: '1.1fr 0.9fr',
                        gap: '70px',
                        alignItems: 'center',
                        position: 'relative',
                        zIndex: 2
                    }}
                >

                    {/* LEFT SIDE */}

                    <div data-aos="fade-right">

                        {/* BADGE */}

                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '12px 20px',
                                borderRadius: '999px',
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                color: '#dbeafe',
                                fontWeight: '600',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            <div
                                style={{
                                    width: '9px',
                                    height: '9px',
                                    borderRadius: '50%',
                                    background: '#4ade80',
                                    boxShadow: '0 0 12px #4ade80'
                                }}
                            ></div>

                            Welcome to Our Hospital Care System
                        </div>

                        {/* TITLE */}

                        <h1
                            style={{
                                fontSize: '72px',
                                lineHeight: '1.0',
                                marginTop: '34px',
                                marginBottom: '0',
                                color: 'white',
                                fontWeight: '900',
                                letterSpacing: '-2px'
                            }}
                        >
                            Caring for
                            <br />

                            <span style={{ color: '#7dd3fc' }}>
                                Patients
                            </span>

                            {' '}with Compassion
                        </h1>

                        {/* DESCRIPTION */}

                        <p
                            style={{
                                marginTop: '30px',
                                color: 'rgba(255,255,255,0.78)',
                                fontSize: '18px',
                                lineHeight: '1.9',
                                maxWidth: '650px'
                            }}
                        >
                            We are dedicated to providing safe, reliable and high-quality
                            healthcare services for every patient. Our hospital brings
                            together experienced doctors, nurses and medical staff to
                            ensure care, comfort and trust at every step of treatment.
                        </p>

                        {/* BUTTONS */}

                        <div
                            style={{
                                display: 'flex',
                                gap: '18px',
                                marginTop: '42px',
                                flexWrap: 'wrap'
                            }}
                        >

                            <a
                                href="/login"
                                style={{
                                    background: 'white',
                                    color: '#0f172a',
                                    padding: '18px 30px',
                                    borderRadius: '18px',
                                    textDecoration: 'none',
                                    fontWeight: '800',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}
                            >
                                Patient Portal
                                <FaArrowRight />
                            </a>

                            <a
                                href="#services"
                                style={{
                                    border: '1px solid rgba(255,255,255,0.18)',
                                    background: 'rgba(255,255,255,0.06)',
                                    color: 'white',
                                    padding: '18px 30px',
                                    borderRadius: '18px',
                                    textDecoration: 'none',
                                    fontWeight: '700',
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                Our Services
                            </a>

                        </div>

                    </div>

                    {/* RIGHT SIDE (SIMPLIFIED REAL HOSPITAL STATUS) */}

                    <div
                        data-aos="fade-left"
                        style={{ display: 'flex', justifyContent: 'center' }}
                    >

                        <div
                            style={{
                                width: '100%',
                                maxWidth: '520px',
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '34px',
                                padding: '30px',
                                backdropFilter: 'blur(24px)'
                            }}
                        >

                            {/* HEADER */}

                            <div style={{ marginBottom: '25px' }}>

                                <h3 style={{ color: 'white', margin: 0 }}>
                                    Hospital Daily Overview
                                </h3>

                                <p style={{ color: 'rgba(255,255,255,0.65)', marginTop: '6px' }}>
                                    General activity summary
                                </p>

                            </div>

                            {/* SIMPLE STATS */}

                            {[
                                { label: 'Patients Attended', value: '240' },
                                { label: 'Doctors Available', value: '75' },
                                { label: 'Appointments Today', value: '126' },
                                { label: 'Pharmacy Status', value: 'In Stock' }
                            ].map((item, i) => (

                                <div
                                    key={i}
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                        borderRadius: '18px',
                                        padding: '18px 20px',
                                        marginBottom: '14px',
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}
                                >

                                    <span style={{ color: 'rgba(255,255,255,0.7)' }}>
                                        {item.label}
                                    </span>

                                    <strong style={{ color: 'white' }}>
                                        {item.value}
                                    </strong>

                                </div>

                            ))}

                            {/* EMERGENCY NOTE */}

                            <div
                                style={{
                                    marginTop: '18px',
                                    padding: '18px',
                                    borderRadius: '18px',
                                    background: 'rgba(34,197,94,0.08)',
                                    border: '1px solid rgba(34,197,94,0.15)',
                                    color: '#4ade80',
                                    fontWeight: '600',
                                    fontSize: '13px'
                                }}
                            >
                                🏥 Emergency services available 24/7 for all patients
                            </div>

                        </div>

                    </div>

                </div>

            </section>
            <section
                id="about"
                style={{
                    padding: '120px 25px',
                    background: '#f8fafc'
                }}
            >

                <div
                    style={{
                        maxWidth: '1100px',
                        margin: '0 auto',
                        textAlign: 'center'
                    }}
                >

                    <span style={sectionTag}>
                        About Our Hospital
                    </span>

                    <h2
                        style={{
                            ...sectionTitle,
                            fontSize: '54px'
                        }}
                    >
                        Caring for Patients with Compassion and Trust
                    </h2>

                    <p
                        style={{
                            color: '#64748b',
                            lineHeight: '2',
                            marginTop: '25px',
                            fontSize: '18px',
                            maxWidth: '850px',
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}
                    >
                        We are committed to providing high-quality healthcare services
                        with a focus on patient well-being, safety, and comfort.
                        Our hospital brings together experienced doctors, caring nurses,
                        and dedicated staff to ensure every patient receives the attention
                        they deserve in a safe and supportive environment.
                    </p>

                </div>

                {/* HOSPITAL HIGHLIGHTS */}

                <div
                    style={{
                        maxWidth: '1200px',
                        margin: '70px auto 0',
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fit,minmax(250px,1fr))',
                        gap: '24px'
                    }}
                >

                    <div style={aboutCard}>
                        <h3 style={aboutTitle}>🏥 Quality Care</h3>
                        <p style={aboutText}>
                            We focus on delivering safe and reliable healthcare services
                            for all patients with professional medical attention.
                        </p>
                    </div>

                    <div style={aboutCard}>
                        <h3 style={aboutTitle}>👨‍⚕️ Experienced Doctors</h3>
                        <p style={aboutText}>
                            Our medical team includes qualified doctors and specialists
                            dedicated to patient care and recovery.
                        </p>
                    </div>

                    <div style={aboutCard}>
                        <h3 style={aboutTitle}>❤️ Patient First</h3>
                        <p style={aboutText}>
                            Every decision we make is centered around patient comfort,
                            dignity, and well-being.
                        </p>
                    </div>

                    <div style={aboutCard}>
                        <h3 style={aboutTitle}>🕒 24/7 Care</h3>
                        <p style={aboutText}>
                            Emergency and critical care services are available at all times
                            to support patients when they need it most.
                        </p>
                    </div>

                </div>

                {/* SIMPLE MESSAGE BANNER */}

                <div
                    style={{
                        maxWidth: '1000px',
                        margin: '80px auto 0',
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '28px',
                        padding: '35px',
                        textAlign: 'center'
                    }}
                >

                    <h3 style={{ margin: 0, fontSize: '24px' }}>
                        Your Health, Our Priority
                    </h3>

                    <p
                        style={{
                            marginTop: '12px',
                            color: '#64748b',
                            lineHeight: '1.9'
                        }}
                    >
                        We believe healthcare is not just treatment — it is care,
                        understanding, and support throughout every step of a patient’s journey.
                    </p>

                </div>

            </section>

            <section
                id="services"
                style={{
                    maxWidth: '1300px',
                    margin: '120px auto',
                    padding: '0 25px'
                }}
            >

                {/* HEADER */}

                <div
                    style={{
                        textAlign: 'center',
                        marginBottom: '80px'
                    }}
                >

                    <span style={sectionTag}>
                        Hospital Services
                    </span>

                    <h2 style={sectionTitle}>
                        Complete Medical Care & Patient Support Services
                    </h2>

                    <p style={sectionDesc}>
                        Our hospital provides integrated healthcare services designed to
                        ensure accurate diagnosis, safe treatment and continuous patient
                        care delivered by qualified medical professionals.
                    </p>

                </div>

                {/* GRID */}

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fit,minmax(290px,1fr))',
                        gap: '28px'
                    }}
                >

                    {[
                        {
                            title: 'Emergency Care Unit',
                            desc: '24/7 emergency response for critical patients, trauma cases and urgent medical attention.',
                            tag: 'Critical Care'
                        },
                        {
                            title: 'Outpatient Department',
                            desc: 'General consultations, follow-up visits and routine health assessments for patients.',
                            tag: 'OPD Services'
                        },
                        {
                            title: 'Hospital Pharmacy',
                            desc: 'Safe medication dispensing with pharmacist supervision and prescription management.',
                            tag: 'Medication'
                        },
                        {
                            title: 'Diagnostic Laboratory',
                            desc: 'Accurate lab testing, imaging and diagnostics for clinical decision support.',
                            tag: 'Lab Services'
                        },
                        {
                            title: 'Maternity & Neonatal Care',
                            desc: 'Comprehensive care for pregnancy, safe delivery and newborn health monitoring.',
                            tag: 'Mother & Child'
                        },
                        {
                            title: 'Inpatient Ward Care',
                            desc: 'Continuous patient monitoring with nursing support and recovery management.',
                            tag: 'Ward Care'
                        }
                    ].map((item, index) => (

                        <div
                            key={index}
                            style={{
                                background: '#ffffff',
                                border: '1px solid rgba(15,23,42,0.08)',
                                borderRadius: '22px',
                                padding: '28px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                                transition: '0.3s ease',
                                position: 'relative'
                            }}
                        >

                            {/* CATEGORY TAG */}

                            <div
                                style={{
                                    display: 'inline-block',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    color: '#0f766e',
                                    background: 'rgba(15,118,110,0.08)',
                                    padding: '6px 12px',
                                    borderRadius: '999px',
                                    marginBottom: '14px'
                                }}
                            >
                                {item.tag}
                            </div>

                            {/* TITLE */}

                            <h3
                                style={{
                                    fontSize: '18px',
                                    fontWeight: '800',
                                    color: '#0f172a',
                                    marginBottom: '10px'
                                }}
                            >
                                {item.title}
                            </h3>

                            {/* DESCRIPTION */}

                            <p
                                style={{
                                    color: '#64748b',
                                    lineHeight: '1.7',
                                    fontSize: '14px'
                                }}
                            >
                                {item.desc}
                            </p>

                            {/* BOTTOM ACCENT LINE */}

                            <div
                                style={{
                                    marginTop: '18px',
                                    width: '45px',
                                    height: '3px',
                                    borderRadius: '999px',
                                    background:
                                        'linear-gradient(to right,#0f766e,#38bdf8)'
                                }}
                            ></div>

                        </div>

                    ))}

                </div>

            </section>

            {/* FEATURES */}

            <section
                id="care-units"
                style={{
                    padding: '120px 25px',
                    background: '#ffffff'
                }}
            >

                <div
                    style={{
                        maxWidth: '1300px',
                        margin: '0 auto'
                    }}
                >

                    {/* HEADER */}

                    <div
                        style={{
                            textAlign: 'center',
                            marginBottom: '70px'
                        }}
                    >

                        <span style={sectionTag}>
                            Care Units
                        </span>

                        <h2 style={sectionTitle}>
                            Hospital Care Departments & Clinical Services
                        </h2>

                        <p style={sectionDesc}>
                            Dedicated medical care units designed to support patients across
                            different stages of treatment with professional staff, continuous
                            monitoring and hospital-grade care standards.
                        </p>

                    </div>

                    {/* GRID */}

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns:
                                'repeat(auto-fit,minmax(280px,1fr))',
                            gap: '26px'
                        }}
                    >

                        {/* CARD TEMPLATE STYLE */}

                        {[
                            {
                                title: 'General Care Unit',
                                desc: 'Primary medical consultations, routine treatment and outpatient care services.',
                                status: 'Active'
                            },
                            {
                                title: 'Emergency Care Unit',
                                desc: '24/7 emergency response for trauma, accidents and critical patients.',
                                status: '24/7 Available'
                            },
                            {
                                title: 'Maternity & Child Care',
                                desc: 'Safe delivery, prenatal monitoring and newborn care services.',
                                status: 'Specialized'
                            },
                            {
                                title: 'Specialist Clinics',
                                desc: 'Cardiology, neurology, orthopedics and other specialist consultations.',
                                status: 'Consultation'
                            },
                            {
                                title: 'Diagnostic Services',
                                desc: 'Laboratory testing, imaging and medical diagnostics for accurate reports.',
                                status: 'Lab Active'
                            },
                            {
                                title: 'Inpatient Ward Care',
                                desc: 'Continuous monitoring with nursing support and recovery care facilities.',
                                status: 'In Care'
                            }
                        ].map((item, index) => (

                            <div
                                key={index}
                                style={{
                                    background: '#ffffff',
                                    border: '1px solid rgba(15,23,42,0.08)',
                                    borderRadius: '22px',
                                    padding: '26px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                                    transition: '0.3s ease'
                                }}
                            >

                                {/* STATUS BADGE */}

                                <div
                                    style={{
                                        display: 'inline-block',
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        color: '#0f766e',
                                        background: 'rgba(15,118,110,0.08)',
                                        padding: '6px 12px',
                                        borderRadius: '999px',
                                        marginBottom: '14px'
                                    }}
                                >
                                    {item.status}
                                </div>

                                {/* TITLE */}

                                <h3
                                    style={{
                                        fontSize: '18px',
                                        fontWeight: '800',
                                        color: '#0f172a',
                                        marginBottom: '10px'
                                    }}
                                >
                                    {item.title}
                                </h3>

                                {/* DESCRIPTION */}

                                <p
                                    style={{
                                        color: '#64748b',
                                        lineHeight: '1.7',
                                        fontSize: '14px'
                                    }}
                                >
                                    {item.desc}
                                </p>

                                {/* FOOTER LINE */}

                                <div
                                    style={{
                                        marginTop: '18px',
                                        height: '2px',
                                        width: '40px',
                                        background:
                                            'linear-gradient(to right,#0f766e,#38bdf8)',
                                        borderRadius: '999px'
                                    }}
                                ></div>

                            </div>

                        ))}

                    </div>

                </div>

            </section>

            {/* HOSPITAL ACCESS PORTALS */}

            <section
                id="dashboard"
                style={{
                    background: '#07111f',
                    padding: '120px 25px',
                    color: 'white'
                }}
            >

                <div
                    style={{
                        maxWidth: '1300px',
                        margin: '0 auto'
                    }}
                >

                    {/* HEADER */}

                    <div
                        style={{
                            textAlign: 'center',
                            marginBottom: '70px'
                        }}
                    >

                        <span style={darkTag}>
                            Hospital Access System
                        </span>

                        <h2 style={darkTitle}>
                            Integrated Hospital Service Portals
                        </h2>

                        <p
                            style={{
                                color: 'rgba(255,255,255,0.65)',
                                marginTop: '18px',
                                maxWidth: '750px',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                lineHeight: '1.8'
                            }}
                        >
                            Different hospital service portals designed to support
                            medical staff, patients and administrative operations
                            in a structured and efficient healthcare environment.
                        </p>

                    </div>

                    {/* CARDS */}

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns:
                                'repeat(auto-fit,minmax(300px,1fr))',
                            gap: '26px'
                        }}
                    >

                        {/* ADMIN */}

                        <div style={previewCard}>

                            <FaUserShield size={44} />

                            <h3 style={{ marginTop: '18px' }}>
                                Hospital Administration
                            </h3>

                            <p>
                                Manages hospital operations, staff coordination,
                                patient flow, reports and overall service management.
                            </p>

                        </div>

                        {/* DOCTOR */}

                        <div style={previewCard}>

                            <FaUserDoctor size={44} />

                            <h3 style={{ marginTop: '18px' }}>
                                Medical Staff Portal
                            </h3>

                            <p>
                                Supports doctors and medical staff in handling
                                consultations, patient care and treatment records.
                            </p>

                        </div>

                        {/* PATIENT */}

                        <div style={previewCard}>

                            <FaHospitalUser size={44} />

                            <h3 style={{ marginTop: '18px' }}>
                                Patient Services Portal
                            </h3>

                            <p>
                                Allows patients to access appointments, medical
                                information and hospital service updates.
                            </p>

                        </div>

                    </div>

                    {/* NOTE STRIP */}

                    <div
                        style={{
                            marginTop: '60px',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '24px',
                            padding: '26px',
                            textAlign: 'center'
                        }}
                    >

                        <p
                            style={{
                                margin: 0,
                                color: 'rgba(255,255,255,0.7)',
                                lineHeight: '1.8'
                            }}
                        >
                            All hospital portals are designed to ensure secure,
                            efficient and patient-centered healthcare service delivery.
                        </p>

                    </div>

                </div>

            </section>

            {/* FOOTER */}

            <footer
                style={{
                    background: 'linear-gradient(135deg,#020617,#0f172a)',
                    color: 'white',
                    padding: '80px 25px',
                    borderTop: '1px solid rgba(255,255,255,0.08)'
                }}
            >

                <div
                    style={{
                        maxWidth: '1300px',
                        margin: '0 auto',
                        display: 'grid',
                        gridTemplateColumns:
                            '2fr 1fr 1fr 1fr',
                        gap: '40px'
                    }}
                >

                    {/* HOSPITAL INFO */}

                    <div>

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}
                        >

                            <div
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '14px',
                                    background:
                                        'linear-gradient(135deg,#0f766e,#0284c7)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '22px'
                                }}
                            >
                                🏥
                            </div>

                            <div>

                                <h2
                                    style={{
                                        margin: 0,
                                        fontSize: '20px',
                                        fontWeight: '800'
                                    }}
                                >
                                    MediCore Hospital System
                                </h2>

                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: '12px',
                                        color: 'rgba(255,255,255,0.6)'
                                    }}
                                >
                                    Integrated Healthcare Management Platform
                                </p>

                            </div>

                        </div>

                        <p
                            style={{
                                marginTop: '20px',
                                color: 'rgba(255,255,255,0.65)',
                                lineHeight: '1.8',
                                fontSize: '14px',
                                maxWidth: '420px'
                            }}
                        >
                            A centralized hospital system designed for patient care,
                            clinical workflow management, pharmacy operations,
                            appointment scheduling and secure medical data handling.
                        </p>

                        {/* STATUS */}

                        <div
                            style={{
                                marginTop: '20px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 14px',
                                borderRadius: '999px',
                                background: 'rgba(34,197,94,0.12)',
                                color: '#4ade80',
                                fontSize: '12px',
                                fontWeight: '700'
                            }}
                        >
                            <span
                                style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: '#22c55e',
                                    boxShadow: '0 0 10px #22c55e'
                                }}
                            ></span>
                            Hospital System Online
                        </div>

                    </div>

                    {/* HOSPITAL MODULES */}

                    <div>

                        <h4 style={footerTitle}>
                            Hospital Modules
                        </h4>

                        <p style={footerItem}>Patient Management</p>
                        <p style={footerItem}>Doctor Dashboard</p>
                        <p style={footerItem}>Pharmacy System</p>
                        <p style={footerItem}>Lab Reports</p>
                        <p style={footerItem}>Appointments</p>

                    </div>

                    {/* HOSPITAL DEPARTMENTS */}

                    <div>

                        <h4 style={footerTitle}>
                            Departments
                        </h4>

                        <p style={footerItem}>Emergency Unit</p>
                        <p style={footerItem}>Cardiology</p>
                        <p style={footerItem}>Neurology</p>
                        <p style={footerItem}>General OPD</p>
                        <p style={footerItem}>ICU Management</p>

                    </div>

                    {/* SYSTEM ACCESS */}

                    <div>

                        <h4 style={footerTitle}>
                            System Access
                        </h4>

                        <a href="/login" style={{ textDecoration: 'none' }}>
                            <p style={footerItem}>Admin Portal</p>
                        </a>

                        <a href="/login" style={{ textDecoration: 'none' }}>
                            <p style={footerItem}>Doctor Login</p>
                        </a>

                        <a href="/login" style={{ textDecoration: 'none' }}>
                            <p style={footerItem}>Pharmacy Panel</p>
                        </a>

                        <a href="/login" style={{ textDecoration: 'none' }}>
                            <p style={footerItem}>Reception Desk</p>
                        </a>
                        <p style={footerItem}>Emergency Access</p>

                    </div>

                </div>

                {/* BOTTOM BAR */}

                <div
                    style={{
                        maxWidth: '1300px',
                        margin: '50px auto 0',
                        paddingTop: '25px',
                        borderTop: '1px solid rgba(255,255,255,0.08)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '20px',
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '13px'
                    }}
                >

                    <p>
                        © 2026 MediCore Hospital System • All Medical Operations Secured
                    </p>

                    <p>
                        Emergency Support: 24/7 • System Monitoring Active
                    </p>

                </div>

            </footer>
        </div>
    );
}

/* ---------------- STYLES ---------------- */

const navLink = {
    textDecoration: 'none',
    color: '#0f172a',
    fontWeight: '600',
    fontSize: '15px'
};

const loginBtn = {
    background:
        'linear-gradient(to right,#0f766e,#0284c7)',
    color: 'white',
    padding: '13px 24px',
    borderRadius: '14px',
    textDecoration: 'none',
    fontWeight: '700',
    boxShadow:
        '0 10px 25px rgba(2,132,199,0.25)'
};

const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 18px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.12)',
    color: 'white',
    fontWeight: '600',
    border: '1px solid rgba(255,255,255,0.1)'
};

const primaryBtn = {
    background: 'white',
    color: '#0f172a',
    padding: '16px 28px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    fontWeight: '700',
    boxShadow:
        '0 15px 35px rgba(255,255,255,0.18)'
};

const secondaryBtn = {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.25)',
    color: 'white',
    padding: '16px 28px',
    borderRadius: '16px',
    textDecoration: 'none',
    fontWeight: '700'
};

const heroStatCard = {
    background: 'rgba(255,255,255,0.08)',
    padding: '24px',
    borderRadius: '24px',
    border: '1px solid rgba(255,255,255,0.08)',
    backdropFilter: 'blur(14px)'
};

const heroGlow1 = {
    position: 'absolute',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'rgba(14,165,233,0.18)',
    top: '-120px',
    right: '-100px',
    filter: 'blur(80px)'
};

const heroGlow2 = {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'rgba(16,185,129,0.18)',
    bottom: '-100px',
    left: '-80px',
    filter: 'blur(80px)'
};

const dashboardCard = {
    background: 'rgba(255,255,255,0.06)',
    borderRadius: '22px',
    padding: '22px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '18px',
    border: '1px solid rgba(255,255,255,0.08)'
};

const dashboardLabel = {
    margin: 0,
    color: 'rgba(255,255,255,0.7)',
    fontSize: '14px'
};

const dashboardValue = {
    margin: '8px 0 0',
    color: 'white',
    fontSize: '34px'
};

const dashboardMiniBadge = {
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    padding: '10px 14px',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '13px'
};

const liveIndicator = {
    background: 'rgba(34,197,94,0.15)',
    color: '#4ade80',
    padding: '10px 16px',
    borderRadius: '999px',
    fontWeight: '700',
    fontSize: '13px'
};

const sectionTag = {
    background: '#dff6f5',
    color: '#0f766e',
    padding: '10px 18px',
    borderRadius: '999px',
    fontWeight: '700',
    fontSize: '14px'
};

const sectionTitle = {
    fontSize: '52px',
    marginTop: '25px',
    lineHeight: '1.15'
};

const sectionDesc = {
    maxWidth: '720px',
    margin: '20px auto 0',
    color: '#64748b',
    lineHeight: '1.9',
    fontSize: '18px'
};

const serviceCard = {
    background: 'white',
    padding: '36px',
    borderRadius: '32px',
    border: '1px solid #e2e8f0',
    boxShadow:
        '0 15px 40px rgba(15,23,42,0.06)',
    transition: '0.3s'
};

const serviceIcon = {
    width: '74px',
    height: '74px',
    borderRadius: '22px',
    background:
        'linear-gradient(135deg,#dff6f5,#e0f2fe)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '30px',
    color: '#0f766e',
    marginBottom: '24px'
};

const serviceTitle = {
    fontSize: '24px',
    marginBottom: '16px'
};

const serviceDesc = {
    color: '#64748b',
    lineHeight: '1.9'
};

const featureCard = {
    background: '#f8fafc',
    padding: '36px',
    borderRadius: '30px',
    border: '1px solid #e2e8f0'
};

const featureIcon = {
    width: '68px',
    height: '68px',
    borderRadius: '20px',
    background:
        'linear-gradient(135deg,#0f766e,#0284c7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: '28px',
    marginBottom: '22px'
};

const featureTitle = {
    fontSize: '24px',
    marginBottom: '12px'
};

const featureText = {
    color: '#64748b',
    lineHeight: '1.8'
};

const darkTag = {
    background: 'rgba(255,255,255,0.08)',
    color: '#7dd3fc',
    padding: '10px 18px',
    borderRadius: '999px',
    fontWeight: '700'
};

const darkTitle = {
    fontSize: '52px',
    marginTop: '25px'
};

const previewCard = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: '40px',
    borderRadius: '28px',
    textAlign: 'center',
    backdropFilter: 'blur(16px)'
};

const footerText = {
    color: 'rgba(255,255,255,0.65)',
    marginTop: '12px'
};

const footerTitle = {
    fontSize: '14px',
    fontWeight: '800',
    marginBottom: '16px',
    color: '#ffffff',
    letterSpacing: '0.5px'
};

const footerItem = {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.65)',
    marginBottom: '10px',
    cursor: 'pointer',
    transition: '0.3s'
};

const aboutCard = {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '24px',
    padding: '26px',
    boxShadow: '0 10px 30px rgba(15,23,42,0.06)',
    transition: '0.3s'
};

const aboutTitle = {
    fontSize: '16px',
    fontWeight: '800',
    marginBottom: '10px',
    color: '#0f172a'
};

const aboutText = {
    fontSize: '14px',
    lineHeight: '1.8',
    color: '#64748b'
};