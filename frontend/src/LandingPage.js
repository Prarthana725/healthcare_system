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

            <nav
                style={{
                    position: 'fixed',
                    top: 0,
                    width: '100%',
                    zIndex: 1000,
                    background: 'rgba(255,255,255,0.82)',
                    backdropFilter: 'blur(18px)',
                    borderBottom: '1px solid rgba(148,163,184,0.12)'
                }}
            >

                <div
                    style={{
                        maxWidth: '1350px',
                        margin: '0 auto',
                        padding: '18px 30px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >

                    {/* LOGO */}

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px'
                        }}
                    >

                        <div
                            style={{
                                width: '58px',
                                height: '58px',
                                borderRadius: '18px',
                                background:
                                    'linear-gradient(135deg,#0f766e,#0284c7)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'white',
                                fontSize: '24px',
                                boxShadow:
                                    '0 10px 30px rgba(2,132,199,0.28)'
                            }}
                        >
                            🏥
                        </div>

                        <div>

                            <h2
                                style={{
                                    margin: 0,
                                    fontSize: '24px',
                                    fontWeight: '800'
                                }}
                            >
                                HealthCare Pro
                            </h2>

                            <div
                                style={{
                                    fontSize: '13px',
                                    color: '#64748b',
                                    marginTop: '2px'
                                }}
                            >
                                Advanced Hospital Management Platform
                            </div>

                        </div>

                    </div>

                    {/* MENU */}

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '30px'
                        }}
                    >

                        <a href="#services" style={navLink}>
                            Services
                        </a>

                        <a href="#features" style={navLink}>
                            Features
                        </a>

                        <a href="#dashboard" style={navLink}>
                            Dashboard
                        </a>

                        <a href="#about" style={navLink}>
                            About
                        </a>

                        <a href="/login" style={loginBtn}>
                            Login System
                        </a>

                    </div>

                </div>

            </nav>

            {/* HERO SECTION */}

            <section
                style={{
                    position: 'relative',
                    minHeight: '100vh',
                    padding: '150px 30px 120px',
                    overflow: 'hidden',
                    background:
                        'linear-gradient(135deg,#08111f 0%,#0f172a 30%,#0f766e 100%)'
                }}
            >

                {/* BACKGROUND GLOW */}

                <div style={heroGlow1}></div>
                <div style={heroGlow2}></div>

                <div
                    style={{
                        maxWidth: '1350px',
                        margin: '0 auto',
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fit,minmax(340px,1fr))',
                        gap: '70px',
                        alignItems: 'center',
                        position: 'relative',
                        zIndex: 2
                    }}
                >

                    {/* LEFT SIDE */}

                    <div data-aos="fade-right">

                        <div style={badgeStyle}>
                            <FaClock />
                            <span>
                                Smart Digital Healthcare Ecosystem
                            </span>
                        </div>

                        <h1
                            style={{
                                fontSize: '78px',
                                lineHeight: '1.02',
                                margin: '25px 0 0',
                                color: 'white',
                                fontWeight: '900',
                                letterSpacing: '-2px'
                            }}
                        >
                            Modern Hospital
                            <br />
                            Operations
                            <span
                                style={{
                                    color: '#7dd3fc'
                                }}
                            >
                                {' '}
                                Simplified
                            </span>
                        </h1>

                        <p
                            style={{
                                marginTop: '32px',
                                color: 'rgba(255,255,255,0.78)',
                                fontSize: '19px',
                                lineHeight: '1.9',
                                maxWidth: '650px'
                            }}
                        >
                            A complete healthcare management system designed
                            for hospitals, clinics and medical centers with
                            real-time appointment handling, patient workflows,
                            pharmacy management and secure medical operations.
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

                            <a href="/login" style={primaryBtn}>
                                Launch System
                                <FaArrowRight />
                            </a>

                            <a href="#services" style={secondaryBtn}>
                                Explore Features
                            </a>

                        </div>

                        {/* STATS */}

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns:
                                    'repeat(auto-fit,minmax(150px,1fr))',
                                gap: '18px',
                                marginTop: '65px'
                            }}
                        >

                            {stats.map((item, index) => (

                                <div
                                    key={index}
                                    style={heroStatCard}
                                >

                                    <h2
                                        style={{
                                            margin: 0,
                                            color: 'white',
                                            fontSize: '34px'
                                        }}
                                    >
                                        {item.number}
                                    </h2>

                                    <p
                                        style={{
                                            marginTop: '8px',
                                            color:
                                                'rgba(255,255,255,0.7)',
                                            fontSize: '14px'
                                        }}
                                    >
                                        {item.label}
                                    </p>

                                </div>

                            ))}

                        </div>

                    </div>

                    {/* RIGHT SIDE */}

                    <div
                        data-aos="fade-left"
                        style={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >

                        <div
                            style={{
                                width: '100%',
                                maxWidth: '520px',
                                background:
                                    'rgba(255,255,255,0.08)',
                                border:
                                    '1px solid rgba(255,255,255,0.12)',
                                backdropFilter: 'blur(22px)',
                                borderRadius: '34px',
                                padding: '28px',
                                boxShadow:
                                    '0 30px 80px rgba(0,0,0,0.35)'
                            }}
                        >

                            {/* TOP BAR */}

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent:
                                        'space-between',
                                    alignItems: 'center',
                                    marginBottom: '25px'
                                }}
                            >

                                <div>

                                    <h3
                                        style={{
                                            color: 'white',
                                            margin: 0
                                        }}
                                    >
                                        Live Hospital Status
                                    </h3>

                                    <p
                                        style={{
                                            color:
                                                'rgba(255,255,255,0.65)',
                                            marginTop: '6px',
                                            fontSize: '14px'
                                        }}
                                    >
                                        Central Healthcare Dashboard
                                    </p>

                                </div>

                                <div style={liveIndicator}>
                                    LIVE
                                </div>

                            </div>

                            {/* DASHBOARD CARD */}

                            <div style={dashboardCard}>
                                <div>
                                    <p style={dashboardLabel}>
                                        Active Doctors
                                    </p>
                                    <h2 style={dashboardValue}>
                                        75
                                    </h2>
                                </div>

                                <div style={dashboardMiniBadge}>
                                    +12%
                                </div>
                            </div>

                            <div style={dashboardCard}>
                                <div>
                                    <p style={dashboardLabel}>
                                        Patients Today
                                    </p>
                                    <h2 style={dashboardValue}>
                                        240
                                    </h2>
                                </div>

                                <div style={dashboardMiniBadge}>
                                    +18%
                                </div>
                            </div>

                            <div style={dashboardCard}>
                                <div>
                                    <p style={dashboardLabel}>
                                        Appointments
                                    </p>
                                    <h2 style={dashboardValue}>
                                        126
                                    </h2>
                                </div>

                                <div style={dashboardMiniBadge}>
                                    Stable
                                </div>
                            </div>

                            <div style={dashboardCard}>
                                <div>
                                    <p style={dashboardLabel}>
                                        Pharmacy Stock
                                    </p>
                                    <h2 style={dashboardValue}>
                                        530
                                    </h2>
                                </div>

                                <div style={dashboardMiniBadge}>
                                    Updated
                                </div>
                            </div>

                            {/* ACTIVITY */}

                            <div
                                style={{
                                    marginTop: '25px',
                                    background:
                                        'rgba(255,255,255,0.06)',
                                    borderRadius: '24px',
                                    padding: '22px'
                                }}
                            >

                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent:
                                            'space-between',
                                        alignItems: 'center'
                                    }}
                                >

                                    <h4
                                        style={{
                                            color: 'white',
                                            margin: 0
                                        }}
                                    >
                                        Emergency Room
                                    </h4>

                                    <span
                                        style={{
                                            color: '#4ade80',
                                            fontWeight: '700'
                                        }}
                                    >
                                        Operational
                                    </span>

                                </div>

                                <div
                                    style={{
                                        marginTop: '18px',
                                        height: '10px',
                                        background:
                                            'rgba(255,255,255,0.08)',
                                        borderRadius: '999px',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '82%',
                                            height: '100%',
                                            background:
                                                'linear-gradient(to right,#0f766e,#38bdf8)'
                                        }}
                                    ></div>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* SERVICES */}

            <section
                id="services"
                style={{
                    maxWidth: '1300px',
                    margin: '100px auto',
                    padding: '0 25px'
                }}
            >

                <div
                    style={{
                        textAlign: 'center',
                        marginBottom: '70px'
                    }}
                >

                    <span style={sectionTag}>
                        Healthcare Modules
                    </span>

                    <h2 style={sectionTitle}>
                        Designed for Real Hospital Workflows
                    </h2>

                    <p style={sectionDesc}>
                        Every module is structured to support healthcare
                        operations efficiently with modern hospital-grade UI
                        and workflow management.
                    </p>

                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fit,minmax(280px,1fr))',
                        gap: '28px'
                    }}
                >

                    {services.map((service, index) => (

                        <div
                            key={index}
                            data-aos="fade-up"
                            style={serviceCard}
                        >

                            <div style={serviceIcon}>
                                {service.icon}
                            </div>

                            <h3 style={serviceTitle}>
                                {service.title}
                            </h3>

                            <p style={serviceDesc}>
                                {service.desc}
                            </p>

                        </div>

                    ))}

                </div>

            </section>

            {/* FEATURES */}

            <section
                id="features"
                style={{
                    padding: '110px 25px',
                    background: '#ffffff'
                }}
            >

                <div
                    style={{
                        maxWidth: '1300px',
                        margin: '0 auto'
                    }}
                >

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns:
                                'repeat(auto-fit,minmax(300px,1fr))',
                            gap: '30px'
                        }}
                    >

                        {features.map((item, index) => (

                            <div
                                key={index}
                                data-aos="fade-up"
                                style={featureCard}
                            >

                                <div style={featureIcon}>
                                    {item.icon}
                                </div>

                                <h3 style={featureTitle}>
                                    {item.title}
                                </h3>

                                <p style={featureText}>
                                    {item.text}
                                </p>

                            </div>

                        ))}

                    </div>

                </div>

            </section>

            {/* DASHBOARD PREVIEW */}

            <section
                id="dashboard"
                style={{
                    background: '#07111f',
                    padding: '110px 25px',
                    color: 'white'
                }}
            >

                <div
                    style={{
                        maxWidth: '1300px',
                        margin: '0 auto'
                    }}
                >

                    <div
                        style={{
                            textAlign: 'center',
                            marginBottom: '70px'
                        }}
                    >

                        <span style={darkTag}>
                            Role Based System
                        </span>

                        <h2 style={darkTitle}>
                            Multi Dashboard Healthcare Platform
                        </h2>

                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns:
                                'repeat(auto-fit,minmax(300px,1fr))',
                            gap: '30px'
                        }}
                    >

                        <div style={previewCard}>
                            <FaUserShield size={44} />
                            <h3>Admin Dashboard</h3>
                            <p>
                                Reports, analytics, staff control and hospital operations.
                            </p>
                        </div>

                        <div style={previewCard}>
                            <FaUserDoctor size={44} />
                            <h3>Doctor Workspace</h3>
                            <p>
                                Patient diagnosis, appointments and prescriptions.
                            </p>
                        </div>

                        <div style={previewCard}>
                            <FaHospitalUser size={44} />
                            <h3>Patient Portal</h3>
                            <p>
                                Medical records, appointments and treatment history.
                            </p>
                        </div>

                    </div>

                </div>

            </section>

            {/* ABOUT */}

            <section
                id="about"
                style={{
                    padding: '110px 25px',
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
                        About Platform
                    </span>

                    <h2 style={sectionTitle}>
                        Built for Modern Healthcare Institutions
                    </h2>

                    <p
                        style={{
                            color: '#64748b',
                            lineHeight: '2',
                            marginTop: '25px',
                            fontSize: '18px'
                        }}
                    >
                        HealthCare Pro combines modern UI engineering with
                        hospital workflow management to deliver a scalable
                        healthcare ecosystem for clinics, hospitals and medical
                        institutions. Built using React, Node.js and SQL Server
                        with secure role-based architecture.
                    </p>

                </div>

            </section>

            {/* FOOTER */}

            <footer
                style={{
                    background: '#020617',
                    color: 'white',
                    padding: '70px 25px'
                }}
            >

                <div
                    style={{
                        maxWidth: '1300px',
                        margin: '0 auto',
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '30px'
                    }}
                >

                    <div>

                        <h2
                            style={{
                                margin: 0
                            }}
                        >
                            HealthCare Pro
                        </h2>

                        <p
                            style={{
                                marginTop: '18px',
                                color:
                                    'rgba(255,255,255,0.65)',
                                lineHeight: '1.8',
                                maxWidth: '420px'
                            }}
                        >
                            Smart healthcare infrastructure platform designed
                            for modern medical institutions and hospital
                            management systems.
                        </p>

                    </div>

                    <div>

                        <h4>
                            System Technology
                        </h4>

                        <p style={footerText}>
                            React.js
                        </p>

                        <p style={footerText}>
                            Node.js
                        </p>

                        <p style={footerText}>
                            SQL Server
                        </p>

                    </div>

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