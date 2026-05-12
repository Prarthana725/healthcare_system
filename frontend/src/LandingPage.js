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
    FaCircleCheck,
    FaShieldHalved,
    FaUserGroup,
    FaClock,
    // New icons for the redesigned hero
    FaStethoscope,
    FaFlask,
    FaTruckMedical,
    FaBell,
    FaHeart
} from 'react-icons/fa6';

import AOS from 'aos';
import 'aos/dist/aos.css';

const HERO_IMAGES = [
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1920&q=80',
];

export default function LandingPage() {

    const [currentBg, setCurrentBg] = useState(0);

    const [stats, setStats] = useState({
        patientsAttended: 0,
        doctorsAvailable: 0,
        appointmentsToday: 0,
        pharmacyStatus: "Loading..."
    });

    useEffect(() => {
        AOS.init({ duration: 900, once: true });

        // Auto-cycle background images every 5 seconds
        const bgInterval = setInterval(() => {
            setCurrentBg(prev => (prev + 1) % HERO_IMAGES.length);
        }, 5000);

        fetch('http://localhost:5000/api/hospital-stats')
            .then(response => response.json())
            .then(data => {
                setStats({
                    patientsAttended: data.patients || 0,
                    doctorsAvailable: data.doctors || 0,
                    appointmentsToday: data.appointments || 0,
                    pharmacyStatus: data.medicines > 0 ? "In Stock" : "Low Stock"
                });
            })
            .catch(() => {
                setStats({
                    patientsAttended: 22,
                    doctorsAvailable: 22,
                    appointmentsToday: 11,
                    pharmacyStatus: "In Stock"
                });
            });

        return () => clearInterval(bgInterval);
    }, []);

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
                    background: 'rgba(7,17,31,0.82)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(255,255,255,0.07)'
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div
                            style={{
                                width: '54px',
                                height: '54px',
                                borderRadius: '16px',
                                background: 'linear-gradient(135deg,#0f766e,#0284c7)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '22px',
                                color: 'white',
                                boxShadow: '0 12px 28px rgba(2,132,199,0.25)'
                            }}
                        >
                            🏥
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '900', letterSpacing: '-0.6px', color: '#ffffff' }}>
                                MediCare<span style={{ color: '#0f766e' }}> Hospital</span>
                            </h2>
                            <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                                Integrated Hospital Management System
                            </p>
                        </div>
                    </div>

                    {/* CENTER NAV */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
                        {[
                            { label: 'Home', link: '#' },
                            { label: 'About Hospital', link: '#about' },
                            { label: 'Our Services', link: '#services' },
                            { label: 'Care Units', link: '#care-units' },
                            { label: 'Dashboard', link: '#dashboard' }
                        ].map((item, index) => (
                            <a
                                key={index}
                                href={item.link}
                                style={{
                                    textDecoration: 'none',
                                    color: index === 0 ? '#0d9488' : 'rgba(255,255,255,0.8)',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    padding: '8px 6px',
                                    borderBottom: index === 0 ? '2px solid #0d9488' : '2px solid transparent',
                                    transition: '0.3s'
                                }}
                                onMouseEnter={(e) => { e.target.style.color = '#0d9488'; }}
                                onMouseLeave={(e) => { e.target.style.color = index === 0 ? '#0d9488' : 'rgba(255,255,255,0.8)'; }}
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>

                    {/* RIGHT SIDE */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

                        <a
                            href="/login"
                            style={{
                                background: 'linear-gradient(135deg,#0f766e,#0284c7)',
                                color: 'white',
                                padding: '12px 22px',
                                borderRadius: '14px',
                                textDecoration: 'none',
                                fontWeight: '800',
                                fontSize: '14px',
                                boxShadow: '0 12px 28px rgba(2,132,199,0.25)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            Patient Access →
                        </a>
                    </div>
                </div>
            </nav>

            {/* ===================== NEW HERO SECTION ===================== */}
            <section
                style={{
                    position: 'relative',
                    minHeight: '100vh',
                    overflow: 'hidden',
                    background: '#07111f',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {/* CROSSFADE BACKGROUND SLIDESHOW */}
                {HERO_IMAGES.map((img, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: `url(${img})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center 30%',
                            backgroundRepeat: 'no-repeat',
                            opacity: currentBg === i ? 0.48 : 0,
                            transition: 'opacity 1.4s ease-in-out'
                        }}
                    />
                ))}

                {/* SLIDE DOT INDICATORS */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '200px',
                        left: '28px',
                        display: 'flex',
                        gap: '8px',
                        zIndex: 10
                    }}
                >
                    {HERO_IMAGES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentBg(i)}
                            style={{
                                width: currentBg === i ? '28px' : '8px',
                                height: '8px',
                                borderRadius: '999px',
                                background: currentBg === i ? '#0d9488' : 'rgba(255,255,255,0.35)',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'all 0.4s ease'
                            }}
                        />
                    ))}
                </div>

                {/* GRADIENT OVERLAYS */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to right, rgba(7,17,31,0.92) 0%, rgba(7,17,31,0.55) 50%, rgba(7,17,31,0.25) 100%)'
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '220px',
                        background: 'linear-gradient(to top, #07111f 0%, transparent 100%)'
                    }}
                />
                {/* Teal glow bottom right */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-80px',
                        right: '-80px',
                        width: '500px',
                        height: '500px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(13,148,136,0.3) 0%, transparent 70%)',
                        pointerEvents: 'none'
                    }}
                />

                {/* MAIN HERO CONTENT */}
                <div
                    style={{
                        position: 'relative',
                        zIndex: 2,
                        maxWidth: '1350px',
                        margin: '0 auto',
                        padding: '160px 28px 40px',
                        display: 'grid',
                        gridTemplateColumns: '1fr 380px',
                        gap: '40px',
                        alignItems: 'center',
                        width: '100%',
                        boxSizing: 'border-box'
                    }}
                >
                    {/* LEFT: HERO TEXT */}
                    <div data-aos="fade-right">
                        {/* BADGE */}
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px 18px',
                                borderRadius: '999px',
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#e2e8f0',
                                fontWeight: '600',
                                fontSize: '14px',
                                backdropFilter: 'blur(10px)',
                                marginBottom: '28px'
                            }}
                        >
                            <span
                                style={{
                                    width: '9px',
                                    height: '9px',
                                    borderRadius: '50%',
                                    background: '#4ade80',
                                    boxShadow: '0 0 12px #4ade80',
                                    flexShrink: 0
                                }}
                            />
                            Welcome to Our Hospital Care System
                        </div>

                        {/* HEADLINE */}
                        <h1
                            style={{
                                fontSize: '76px',
                                lineHeight: '1.05',
                                margin: '0 0 24px',
                                color: 'white',
                                fontWeight: '900',
                                letterSpacing: '-2.5px',
                                maxWidth: '680px'
                            }}
                        >
                            Caring for{' '}
                            <span style={{ color: '#38bdf8' }}>Patients</span>
                            {' '}with Compassion{' '}
                            <FaHeart
                                style={{
                                    color: '#38bdf8',
                                    fontSize: '56px',
                                    verticalAlign: 'middle',
                                    marginLeft: '6px'
                                }}
                            />
                        </h1>

                        {/* DESCRIPTION */}
                        <p
                            style={{
                                color: 'rgba(255,255,255,0.72)',
                                fontSize: '17px',
                                lineHeight: '1.85',
                                maxWidth: '580px',
                                margin: '0 0 40px'
                            }}
                        >
                            We are dedicated to providing safe, reliable and high-quality
                            healthcare services for every patient. Our hospital brings
                            together experienced doctors, nurses and medical staff to
                            ensure care, comfort and trust at every step of treatment.
                        </p>

                        {/* BUTTONS */}
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            <a
                                href="/login"
                                style={{
                                    background: 'white',
                                    color: '#0f172a',
                                    padding: '16px 28px',
                                    borderRadius: '16px',
                                    textDecoration: 'none',
                                    fontWeight: '800',
                                    fontSize: '15px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                                }}
                            >
                                Patient Portal <FaArrowRight />
                            </a>
                            <a
                                href="#services"
                                style={{
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    background: 'rgba(255,255,255,0.07)',
                                    color: 'white',
                                    padding: '16px 28px',
                                    borderRadius: '16px',
                                    textDecoration: 'none',
                                    fontWeight: '700',
                                    fontSize: '15px',
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                Our Services
                            </a>
                        </div>
                    </div>

                    {/* RIGHT: STATS PANEL */}
                    <div
                        data-aos="fade-left"
                        style={{
                            background: 'rgba(13,20,35,0.75)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '28px',
                            padding: '28px',
                            backdropFilter: 'blur(28px)',
                            boxShadow: '0 32px 64px rgba(0,0,0,0.4)'
                        }}
                    >
                        {/* PANEL HEADER */}
                        <div style={{ marginBottom: '22px' }}>
                            <h3 style={{ color: 'white', margin: '0 0 6px', fontSize: '20px', fontWeight: '800' }}>
                                Hospital Daily Overview
                            </h3>
                            <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '13px' }}>
                                Live activity summary
                            </p>
                        </div>

                        {/* STATS ROWS */}
                        {[
                            {
                                label: 'Patients Attended',
                                value: stats.patientsAttended,
                                icon: '👥'
                            },
                            {
                                label: 'Doctors Available',
                                value: stats.doctorsAvailable,
                                icon: '🩺'
                            },
                            {
                                label: 'Appointments Today',
                                value: stats.appointmentsToday,
                                icon: '📅'
                            },
                            {
                                label: 'Pharmacy Status',
                                value: stats.pharmacyStatus,
                                icon: '💊'
                            }
                        ].map((item, i) => (
                            <div
                                key={i}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '14px',
                                    padding: '14px 18px',
                                    marginBottom: '10px'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontSize: '18px' }}>{item.icon}</span>
                                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                                        {item.label}
                                    </span>
                                </div>
                                <strong style={{ color: 'white', fontSize: '15px' }}>
                                    {item.value}
                                </strong>
                            </div>
                        ))}

                        {/* EMERGENCY NOTE */}
                        <div
                            style={{
                                marginTop: '14px',
                                padding: '14px 18px',
                                borderRadius: '14px',
                                background: 'rgba(34,197,94,0.07)',
                                border: '1px solid rgba(34,197,94,0.18)',
                                color: '#4ade80',
                                fontWeight: '600',
                                fontSize: '13px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            <FaBell style={{ flexShrink: 0 }} />
                            Emergency services available 24/7 for all patients
                        </div>
                    </div>
                </div>

                {/* BOTTOM FEATURE STRIP */}
                <div
                    style={{
                        position: 'relative',
                        zIndex: 2,
                        maxWidth: '1350px',
                        margin: '0 auto',
                        padding: '0 28px 60px',
                        width: '100%',
                        boxSizing: 'border-box'
                    }}
                >
                    <div
                        style={{
                            background: 'rgba(13,20,35,0.7)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '22px',
                            padding: '24px 32px',
                            backdropFilter: 'blur(20px)',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '8px'
                        }}
                    >
                        {[
                            {
                                icon: <FaShieldHalved size={22} style={{ color: '#0d9488' }} />,
                                title: 'Trusted Care',
                                desc: 'Patient safety is our priority'
                            },
                            {
                                icon: <FaUserGroup size={22} style={{ color: '#818cf8' }} />,
                                title: 'Expert Doctors',
                                desc: 'Experienced & compassionate'
                            },
                            {
                                icon: <FaClock size={22} style={{ color: '#f59e0b' }} />,
                                title: '24/7 Support',
                                desc: 'Always here for you'
                            },
                            {
                                icon: <FaHeartPulse size={22} style={{ color: '#f43f5e' }} />,
                                title: 'Modern Facilities',
                                desc: 'Advanced tech for better care'
                            }
                        ].map((item, i) => (
                            <div
                                key={i}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    padding: '12px 16px',
                                    borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none'
                                }}
                            >
                                <div
                                    style={{
                                        background: 'rgba(255,255,255,0.06)',
                                        borderRadius: '12px',
                                        padding: '10px',
                                        display: 'flex',
                                        flexShrink: 0
                                    }}
                                >
                                    {item.icon}
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'white' }}>
                                        {item.title}
                                    </h4>
                                    <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===================== NEW SERVICES SECTION (below hero) ===================== */}
            <section
                style={{
                    background: '#07111f',
                    padding: '80px 28px'
                }}
            >
                <div style={{ maxWidth: '1350px', margin: '0 auto' }}>
                    {/* HEADER */}
                    <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <span
                            style={{
                                background: 'rgba(255,255,255,0.06)',
                                color: '#7dd3fc',
                                padding: '8px 18px',
                                borderRadius: '999px',
                                fontWeight: '700',
                                fontSize: '13px',
                                border: '1px solid rgba(255,255,255,0.08)'
                            }}
                        >
                            We Are Here For You
                        </span>
                        <h2
                            style={{
                                color: 'white',
                                fontSize: '42px',
                                fontWeight: '900',
                                margin: '18px 0 12px',
                                letterSpacing: '-1px'
                            }}
                        >
                            Our Services
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '16px', margin: 0 }}>
                            Comprehensive healthcare services for you and your family.
                        </p>
                    </div>

                    {/* SERVICE CARDS GRID */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(5, 1fr)',
                            gap: '16px'
                        }}
                    >
                        {[
                            {
                                icon: <FaStethoscope size={28} />,
                                color: '#0d9488',
                                bg: 'rgba(13,148,136,0.12)',
                                title: 'OPD Services',
                                desc: 'Consult our specialists for diagnosis and treatment.'
                            },
                            {
                                icon: <FaBedPulse size={28} />,
                                color: '#818cf8',
                                bg: 'rgba(129,140,248,0.12)',
                                title: 'Inpatient Care',
                                desc: 'Comfortable rooms and 24/7 medical support.'
                            },
                            {
                                icon: <FaFlask size={28} />,
                                color: '#a78bfa',
                                bg: 'rgba(167,139,250,0.12)',
                                title: 'Laboratory',
                                desc: 'Advanced lab tests with accurate results.'
                            },
                            {
                                icon: <FaPills size={28} />,
                                color: '#fb923c',
                                bg: 'rgba(251,146,60,0.12)',
                                title: 'Pharmacy',
                                desc: 'Quality medicines available at our hospital pharmacy.'
                            },
                            {
                                icon: <FaTruckMedical size={28} />,
                                color: '#34d399',
                                bg: 'rgba(52,211,153,0.12)',
                                title: 'Emergency Care',
                                desc: '24/7 emergency services for critical care.'
                            }
                        ].map((item, i) => (
                            <div
                                key={i}
                                style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                    borderRadius: '20px',
                                    padding: '28px 22px',
                                    transition: '0.3s',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <div
                                    style={{
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: '16px',
                                        background: item.bg,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: item.color,
                                        marginBottom: '18px'
                                    }}
                                >
                                    {item.icon}
                                </div>
                                <h3
                                    style={{
                                        color: 'white',
                                        fontSize: '16px',
                                        fontWeight: '800',
                                        margin: '0 0 10px'
                                    }}
                                >
                                    {item.title}
                                </h3>
                                <p
                                    style={{
                                        color: 'rgba(255,255,255,0.5)',
                                        fontSize: '13px',
                                        lineHeight: '1.7',
                                        margin: '0 0 18px'
                                    }}
                                >
                                    {item.desc}
                                </p>
                                <a
                                    href="#services"
                                    style={{
                                        color: item.color,
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        textDecoration: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    Learn More <FaArrowRight size={11} />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- ABOUT SECTION --- */}
            <section
                id="about"
                style={{
                    padding: '120px 25px',
                    background: '#07111f'
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
                    <div>
                        <span style={darkTag}>About Our Hospital</span>
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
                        <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '16px', maxWidth: '600px' }}>
                            We are a patient-focused hospital dedicated to delivering safe, reliable and
                            high-quality healthcare services. Our mission is to combine medical expertise
                            with compassion, ensuring every patient receives personalized care in a
                            supportive environment.
                        </p>
                        <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                'Modern medical facilities with advanced equipment',
                                'Experienced doctors & certified healthcare staff',
                                'Patient-centered care approach',
                                'Emergency services available 24/7'
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.9)', fontWeight: '500', fontSize: '15px' }}>
                                    <FaCircleCheck style={{ color: '#0d9488', fontSize: '18px' }} />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '26px',
                            padding: '32px',
                            border: '1px solid rgba(255,255,255,0.08)',
                            backdropFilter: 'blur(16px)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                            <div style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', padding: '12px', borderRadius: '12px', display: 'flex' }}>
                                <FaHeartPulse size={22} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '20px', color: 'white' }}>Hospital Care Principles</h3>
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: '4px 0 0' }}>Core values of our medical service</p>
                            </div>
                        </div>
                        {[
                            { title: 'Quality Care', desc: 'Safe and reliable healthcare services', icon: <FaShieldHalved /> },
                            { title: 'Experienced Staff', desc: 'Qualified doctors & medical professionals', icon: <FaUserGroup /> },
                            { title: 'Patient First', desc: 'Care focused on dignity and comfort', icon: <FaBedPulse /> },
                            { title: '24/7 Support', desc: 'Continuous emergency medical service', icon: <FaClock /> }
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
                                <div style={{ background: 'rgba(15,118,110,0.25)', color: '#2dd4bf', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {item.icon}
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '15px', color: 'white' }}>{item.title}</h4>
                                    <p style={{ marginTop: '4px', marginBottom: 0, fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div
                    style={{
                        maxWidth: '1100px',
                        margin: '80px auto 0',
                        background: 'linear-gradient(90deg,#064e3b,#0f766e)',
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
                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '50%', display: 'flex' }}>
                        <FaShieldHeart size={32} />
                    </div>
                    <div style={{ textAlign: 'center', flex: 1, maxWidth: '700px', margin: '0 auto' }}>
                        <h3 style={{ margin: 0, fontSize: '26px' }}>Trusted Healthcare for Every Patient</h3>
                        <p style={{ marginTop: '12px', marginBottom: 0, color: 'rgba(255,255,255,0.85)', lineHeight: '1.8' }}>
                            We believe healthcare is not just treatment — it is care, trust,
                            and human connection that supports every step of a patient's journey.
                        </p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '50%', display: 'flex' }}>
                        <FaHeartPulse size={32} />
                    </div>
                </div>
            </section>

            {/* SERVICES SECTION */}
            <section id="services" style={{ padding: '120px 25px', background: '#f8fafc' }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '70px' }}>
                        <span style={sectionTag}>Hospital Care Services</span>
                        <h2 style={sectionTitle}>Integrated Medical Care Across All Departments</h2>
                        <p style={sectionDesc}>
                            A complete hospital care ecosystem designed to support patients from emergency response
                            to recovery with continuous monitoring and specialist care.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px', alignItems: 'stretch' }}>
                        <div
                            style={{
                                background: 'linear-gradient(135deg,#0f172a,#0f766e)',
                                borderRadius: '26px',
                                padding: '40px',
                                color: 'white',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <h3 style={{ fontSize: '26px', margin: 0 }}>Emergency & Critical Care Center</h3>
                            <p style={{ marginTop: '14px', color: 'rgba(255,255,255,0.75)', lineHeight: '1.8' }}>
                                24/7 rapid response emergency unit designed to handle trauma, critical conditions
                                and urgent medical situations with immediate specialist intervention.
                            </p>
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

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { title: 'Outpatient Care', desc: 'Consultation & follow-ups' },
                                { title: 'Pharmacy Unit', desc: 'Medication & prescription control' },
                                { title: 'Diagnostic Lab', desc: 'Reports & medical testing' },
                                { title: 'Maternity Care', desc: 'Mother & newborn support' }
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
                                    <h4 style={{ margin: 0, fontSize: '15px', color: '#0f172a' }}>{item.title}</h4>
                                    <p style={{ marginTop: '6px', fontSize: '13px', color: '#64748b' }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: '50px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '16px' }}>
                        {['Patient Admission', 'Diagnosis', 'Treatment Plan', 'Recovery Monitoring'].map((step, i) => (
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
            <section id="care-units" style={{ padding: '120px 25px', background: '#f8fafc' }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '70px' }}>
                        <span style={sectionTag}>Care Units</span>
                        <h2 style={sectionTitle}>Hospital Departments & Specialized Medical Units</h2>
                        <p style={sectionDesc}>
                            Each care unit is designed with dedicated medical teams, advanced facilities and
                            continuous patient monitoring for safe and effective treatment.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '26px' }}>
                        {[
                            { title: 'General Care Unit', desc: 'Primary consultations and routine medical treatment services.', status: 'Active', img: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=60' },
                            { title: 'Emergency Care Unit', desc: '24/7 critical response for trauma and urgent medical cases.', status: '24/7 Emergency', img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=60' },
                            { title: 'Maternity Care Unit', desc: 'Safe delivery, prenatal monitoring and newborn care.', status: 'Specialized', img: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=60' },
                            { title: 'Specialist Clinics', desc: 'Cardiology, neurology and orthopedic consultations.', status: 'Consultation', img: 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?auto=format&fit=crop&w=800&q=60' },
                            { title: 'Diagnostic Lab', desc: 'Medical tests, imaging and accurate diagnostic reporting.', status: 'Lab Active', img: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=60' },
                            { title: 'Inpatient Ward', desc: 'Continuous patient monitoring with nursing care support.', status: 'In Care', img: 'https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?auto=format&fit=crop&w=800&q=60' }
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
                                <div style={{ height: '170px', overflow: 'hidden' }}>
                                    <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ padding: '22px' }}>
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
                                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>{item.title}</h3>
                                    <p style={{ marginTop: '10px', fontSize: '14px', color: '#64748b', lineHeight: '1.7' }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* HOSPITAL ACCESS PORTALS */}
            <section id="dashboard" style={{ background: '#07111f', padding: '120px 25px', color: 'white' }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '70px' }}>
                        <span style={darkTag}>Hospital Access System</span>
                        <h2 style={darkTitle}>Integrated Hospital Service Portals</h2>
                        <p style={{ color: 'rgba(255,255,255,0.65)', marginTop: '18px', maxWidth: '750px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.8' }}>
                            Different hospital service portals designed to support medical staff, patients and
                            administrative operations in a structured and efficient healthcare environment.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '26px' }}>
                        <div style={previewCard}>
                            <FaUserShield size={44} />
                            <h3 style={{ marginTop: '18px' }}>Hospital Administration</h3>
                            <p>Manages hospital operations, staff coordination, patient flow, reports and overall service management.</p>
                        </div>
                        <div style={previewCard}>
                            <FaUserDoctor size={44} />
                            <h3 style={{ marginTop: '18px' }}>Medical Staff Portal</h3>
                            <p>Supports doctors and medical staff in handling consultations, patient care and treatment records.</p>
                        </div>
                        <div style={previewCard}>
                            <FaHospitalUser size={44} />
                            <h3 style={{ marginTop: '18px' }}>Patient Services Portal</h3>
                            <p>Allows patients to access appointments, medical information and hospital service updates.</p>
                        </div>
                    </div>

                    <div style={{ marginTop: '60px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '24px', padding: '26px', textAlign: 'center' }}>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', lineHeight: '1.8' }}>
                            All hospital portals are designed to ensure secure, efficient and patient-centered healthcare service delivery.
                        </p>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{ background: 'linear-gradient(135deg,#020617,#0f172a)', color: 'white', padding: '80px 25px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'linear-gradient(135deg,#0f766e,#0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                                🏥
                            </div>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>MediCore Hospital System</h2>
                                <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Integrated Healthcare Management Platform</p>
                            </div>
                        </div>
                        <p style={{ marginTop: '20px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.8', fontSize: '14px', maxWidth: '420px' }}>
                            A centralized hospital system designed for patient care, clinical workflow management,
                            pharmacy operations, appointment scheduling and secure medical data handling.
                        </p>
                        <div style={{ marginTop: '20px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '999px', background: 'rgba(34,197,94,0.12)', color: '#4ade80', fontSize: '12px', fontWeight: '700' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }}></span>
                            Hospital System Online
                        </div>
                    </div>

                    <div>
                        <h4 style={footerTitle}>Hospital Modules</h4>
                        {['Patient Management', 'Doctor Dashboard', 'Pharmacy System', 'Lab Reports', 'Appointments'].map(t => <p key={t} style={footerItem}>{t}</p>)}
                    </div>
                    <div>
                        <h4 style={footerTitle}>Departments</h4>
                        {['Emergency Unit', 'Cardiology', 'Neurology', 'General OPD', 'ICU Management'].map(t => <p key={t} style={footerItem}>{t}</p>)}
                    </div>
                    <div>
                        <h4 style={footerTitle}>System Access</h4>
                        {['Admin Portal', 'Doctor Login', 'Pharmacy Panel', 'Reception Desk', 'Emergency Access'].map(t => (
                            <a key={t} href="/login" style={{ textDecoration: 'none' }}><p style={footerItem}>{t}</p></a>
                        ))}
                    </div>
                </div>

                <div style={{ maxWidth: '1300px', margin: '50px auto 0', paddingTop: '25px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                    <p>© 2026 MediCore Hospital System • All Medical Operations Secured</p>
                    <p>Emergency Support: 24/7 • System Monitoring Active</p>
                </div>
            </footer>
        </div>
    );
}

/* ---------------- STYLES ---------------- */

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