import React, { useState, useEffect } from 'react';

import {
    FaUserDoctor,
    FaUserShield,
    FaHospitalUser,
    FaPills,
    FaCalendarCheck,
    FaArrowRight,
    FaHeartPulse,
    FaChartLine,
    FaBedPulse,
    FaShieldHeart,
    // --- NEW ICONS ADDED FOR ABOUT PAGE ---
    FaCircleCheck,
    FaShieldHalved,
    FaUserGroup,
    FaClock
} from 'react-icons/fa6';

import AOS from 'aos';
import 'aos/dist/aos.css';

export default function LandingPage() {

    // --- State to hold the dynamic database stats ---
    const [stats, setStats] = useState({
        patientsAttended: 0,
        doctorsAvailable: 0,
        appointmentsToday: 0,
        pharmacyStatus: "Loading..."
    });

    useEffect(() => {
        // Initialize animations
        AOS.init({
            duration: 900,
            once: true
        });

        // --- Fetch real data from your backend ---
        fetch('http://localhost:5000/api/hospital-stats') 
            .then(response => response.json())
            .then(data => {
                setStats({
                    patientsAttended: data.patientsAttended || 0,
                    doctorsAvailable: data.doctorsAvailable || 0,
                    appointmentsToday: data.appointmentsToday || 0,
                    pharmacyStatus: data.pharmacyStatus || "In Stock"
                });
            })
            .catch(error => {
                console.error('Error fetching real-time stats:', error);
                // Fallback to defaults if the backend isn't running
                setStats({
                    patientsAttended: 240,
                    doctorsAvailable: 75,
                    appointmentsToday: 126,
                    pharmacyStatus: "In Stock"
                });
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

                    {/* RIGHT SIDE (DYNAMIC REAL HOSPITAL STATUS) */}
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
                                    Live activity summary
                                </p>
                            </div>

                            {/* DYNAMIC STATS */}
                            {[
                                { label: 'Patients Attended', value: stats.patientsAttended },
                                { label: 'Doctors Available', value: stats.doctorsAvailable },
                                { label: 'Appointments Today', value: stats.appointmentsToday },
                                { label: 'Pharmacy Status', value: stats.pharmacyStatus }
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

            {/* --- UPDATED ABOUT SECTION --- */}
            <section
                id="about"
                style={{
                    padding: '120px 25px',
                    background: '#07111f' // Updated to match the dark UI
                }}
            >
                <div
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        display: 'grid',
                        gridTemplateColumns: '1.2fr 0.8fr',
                        gap: '60px',
                        alignItems: 'center'
                    }}
                >
                    {/* LEFT CONTENT */}
                    <div>
                        <span style={darkTag}>
                            About Our Hospital
                        </span>
                        <h2
                            style={{
                                fontSize: '48px',
                                lineHeight: '1.2',
                                marginTop: '22px',
                                marginBottom: '20px',
                                color: 'white',
                                fontWeight: '800'
                            }}
                        >
                            Compassionate Healthcare <br />
                            <span style={{ color: '#7dd3fc' }}>Built on Trust & Care</span>
                        </h2>
                        <p
                            style={{
                                color: 'rgba(255,255,255,0.75)',
                                lineHeight: '1.9',
                                fontSize: '16px',
                                maxWidth: '600px'
                            }}
                        >
                            We are a patient-focused hospital dedicated to delivering
                            safe, reliable and high-quality healthcare services. Our mission
                            is to combine medical expertise with compassion, ensuring every
                            patient receives personalized care in a supportive environment.
                        </p>

                        {/* KEY POINTS (Updated with icons) */}
                        <div
                            style={{
                                marginTop: '30px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px'
                            }}
                        >
                            {[
                                'Modern medical facilities with advanced equipment',
                                'Experienced doctors & certified healthcare staff',
                                'Patient-centered care approach',
                                'Emergency services available 24/7'
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        color: 'rgba(255,255,255,0.9)',
                                        fontWeight: '500',
                                        fontSize: '15px'
                                    }}
                                >
                                    <FaCircleCheck style={{ color: '#0d9488', fontSize: '18px' }} />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT VISUAL PANEL (Updated to Glassmorphism) */}
                    <div
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '26px',
                            padding: '32px',
                            border: '1px solid rgba(255,255,255,0.08)',
                            backdropFilter: 'blur(16px)'
                        }}
                    >
                        {/* PANEL HEADER */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                            <div style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', padding: '12px', borderRadius: '12px', display: 'flex' }}>
                                <FaHeartPulse size={22} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '20px', color: 'white' }}>
                                    Hospital Care Principles
                                </h3>
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: '4px 0 0' }}>
                                    Core values of our medical service
                                </p>
                            </div>
                        </div>

                        {/* STACKED INFO BLOCKS (Updated with icons) */}
                        {[
                            {
                                title: 'Quality Care',
                                desc: 'Safe and reliable healthcare services',
                                icon: <FaShieldHalved />
                            },
                            {
                                title: 'Experienced Staff',
                                desc: 'Qualified doctors & medical professionals',
                                icon: <FaUserGroup />
                            },
                            {
                                title: 'Patient First',
                                desc: 'Care focused on dignity and comfort',
                                icon: <FaBedPulse />
                            },
                            {
                                title: '24/7 Support',
                                desc: 'Continuous emergency medical service',
                                icon: <FaClock />
                            }
                        ].map((item, i) => (
                            <div
                                key={i}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    marginTop: '12px',
                                    padding: '16px 20px',
                                    borderRadius: '16px',
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}
                            >
                                {/* Left Box Icon */}
                                <div style={{ 
                                    background: 'rgba(15, 118, 110, 0.25)', 
                                    color: '#2dd4bf', 
                                    padding: '12px', 
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {item.icon}
                                </div>
                                
                                {/* Right Text */}
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '15px', color: 'white' }}>
                                        {item.title}
                                    </h4>
                                    <p style={{ marginTop: '4px', marginBottom: 0, fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* TRUST FOOTER STRIP (Updated Colors and Icons) */}
                <div
                    style={{
                        maxWidth: '1100px',
                        margin: '80px auto 0',
                        background: 'linear-gradient(90deg, #064e3b, #0f766e)',
                        borderRadius: '24px',
                        padding: '40px 50px',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '20px'
                    }}
                >
                    {/* Left Icon */}
                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '50%', display: 'flex' }}>
                        <FaShieldHeart size={32} />
                    </div>

                    {/* Center Text */}
                    <div style={{ textAlign: 'center', flex: 1, maxWidth: '700px', margin: '0 auto' }}>
                        <h3 style={{ margin: 0, fontSize: '26px' }}>
                            Trusted Healthcare for Every Patient
                        </h3>
                        <p style={{ marginTop: '12px', marginBottom: 0, color: 'rgba(255,255,255,0.85)', lineHeight: '1.8' }}>
                            We believe healthcare is not just treatment — it is care, trust,
                            and human connection that supports every step of a patient’s journey.
                        </p>
                    </div>

                    {/* Right Icon */}
                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '50%', display: 'flex' }}>
                        <FaHeartPulse size={32} />
                    </div>
                </div>
            </section>
            {/* --- END OF UPDATED ABOUT SECTION --- */}


            {/* SERVICES SECTION */}
            <section
                id="services"
                style={{
                    padding: '120px 25px',
                    background: '#f8fafc'
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
                            Hospital Care Services
                        </span>
                        <h2 style={sectionTitle}>
                            Integrated Medical Care Across All Departments
                        </h2>
                        <p style={sectionDesc}>
                            A complete hospital care ecosystem designed to support
                            patients from emergency response to recovery with
                            continuous monitoring and specialist care.
                        </p>
                    </div>

                    {/* LAYOUT SPLIT */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1.2fr 0.8fr',
                            gap: '30px',
                            alignItems: 'stretch'
                        }}
                    >
                        {/* LEFT - FEATURED SERVICE */}
                        <div
                            style={{
                                background:
                                    'linear-gradient(135deg,#0f172a,#0f766e)',
                                borderRadius: '26px',
                                padding: '40px',
                                color: 'white',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <h3 style={{ fontSize: '26px', margin: 0 }}>
                                Emergency & Critical Care Center
                            </h3>
                            <p
                                style={{
                                    marginTop: '14px',
                                    color: 'rgba(255,255,255,0.75)',
                                    lineHeight: '1.8'
                                }}
                            >
                                24/7 rapid response emergency unit designed to handle
                                trauma, critical conditions and urgent medical situations
                                with immediate specialist intervention.
                            </p>

                            {/* STATUS BADGE */}
                            <div
                                style={{
                                    marginTop: '22px',
                                    display: 'inline-block',
                                    padding: '8px 14px',
                                    borderRadius: '999px',
                                    background: 'rgba(34,197,94,0.18)',
                                    color: '#4ade80',
                                    fontWeight: '700',
                                    fontSize: '13px'
                                }}
                            >
                                Active 24/7 Emergency Support
                            </div>
                        </div>

                        {/* RIGHT - STACKED SERVICES */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px'
                            }}
                        >
                            {[
                                {
                                    title: 'Outpatient Care',
                                    desc: 'Consultation & follow-ups'
                                },
                                {
                                    title: 'Pharmacy Unit',
                                    desc: 'Medication & prescription control'
                                },
                                {
                                    title: 'Diagnostic Lab',
                                    desc: 'Reports & medical testing'
                                },
                                {
                                    title: 'Maternity Care',
                                    desc: 'Mother & newborn support'
                                }
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    style={{
                                        background: 'white',
                                        borderRadius: '18px',
                                        padding: '18px 20px',
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 8px 20px rgba(0,0,0,0.04)'
                                    }}
                                >
                                    <h4
                                        style={{
                                            margin: 0,
                                            fontSize: '15px',
                                            color: '#0f172a'
                                        }}
                                    >
                                        {item.title}
                                    </h4>
                                    <p
                                        style={{
                                            marginTop: '6px',
                                            fontSize: '13px',
                                            color: '#64748b'
                                        }}
                                    >
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* BOTTOM CARE FLOW STRIP */}
                    <div
                        style={{
                            marginTop: '50px',
                            display: 'grid',
                            gridTemplateColumns:
                                'repeat(auto-fit,minmax(220px,1fr))',
                            gap: '16px'
                        }}
                    >
                        {[
                            'Patient Admission',
                            'Diagnosis',
                            'Treatment Plan',
                            'Recovery Monitoring'
                        ].map((step, i) => (
                            <div
                                key={i}
                                style={{
                                    background: '#ffffff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '18px',
                                    padding: '18px',
                                    textAlign: 'center',
                                    fontWeight: '600',
                                    color: '#0f172a'
                                }}
                            >
                                {step}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CARE UNITS */}
            <section
                id="care-units"
                style={{
                    padding: '120px 25px',
                    background: '#f8fafc'
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
                            Hospital Departments & Specialized Medical Units
                        </h2>
                        <p style={sectionDesc}>
                            Each care unit is designed with dedicated medical teams,
                            advanced facilities and continuous patient monitoring for
                            safe and effective treatment.
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
                        {[
                            {
                                title: 'General Care Unit',
                                desc: 'Primary consultations and routine medical treatment services.',
                                status: 'Active',
                                img: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=60'
                            },
                            {
                                title: 'Emergency Care Unit',
                                desc: '24/7 critical response for trauma and urgent medical cases.',
                                status: '24/7 Emergency',
                                img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=60'
                            },
                            {
                                title: 'Maternity Care Unit',
                                desc: 'Safe delivery, prenatal monitoring and newborn care.',
                                status: 'Specialized',
                                img: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=60'
                            },
                            {
                                title: 'Specialist Clinics',
                                desc: 'Cardiology, neurology and orthopedic consultations.',
                                status: 'Consultation',
                                img: 'https://unsplash.com/photos/main-thing-that-children-were-healthy-beautiful-mother-with-her-son-smiling-and-talking-with-handsome-middle-aged-pediatrician-in-his-office-MovaY_VL6cU'
                            },
                            {
                                title: 'Diagnostic Lab',
                                desc: 'Medical tests, imaging and accurate diagnostic reporting.',
                                status: 'Lab Active',
                                img: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=60'
                            },
                            {
                                title: 'Inpatient Ward',
                                desc: 'Continuous patient monitoring with nursing care support.',
                                status: 'In Care',
                                img: 'https://images.unsplash.com/photo-1586773860387-d2c6a1d0f8b5?auto=format&fit=crop&w=800&q=60'
                            }
                        ].map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    background: '#fff',
                                    borderRadius: '22px',
                                    overflow: 'hidden',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                                    transition: '0.3s ease'
                                }}
                            >
                                {/* IMAGE HEADER */}
                                <div
                                    style={{
                                        height: '170px',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </div>

                                {/* CONTENT */}
                                <div style={{ padding: '22px' }}>
                                    {/* STATUS */}
                                    <div
                                        style={{
                                            display: 'inline-block',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            color: '#0f766e',
                                            background: 'rgba(15,118,110,0.08)',
                                            padding: '6px 12px',
                                            borderRadius: '999px',
                                            marginBottom: '12px'
                                        }}
                                    >
                                        {item.status}
                                    </div>

                                    {/* TITLE */}
                                    <h3
                                        style={{
                                            margin: 0,
                                            fontSize: '18px',
                                            fontWeight: '800',
                                            color: '#0f172a'
                                        }}
                                    >
                                        {item.title}
                                    </h3>

                                    {/* DESCRIPTION */}
                                    <p
                                        style={{
                                            marginTop: '10px',
                                            fontSize: '14px',
                                            color: '#64748b',
                                            lineHeight: '1.7'
                                        }}
                                    >
                                        {item.desc}
                                    </p>
                                </div>
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