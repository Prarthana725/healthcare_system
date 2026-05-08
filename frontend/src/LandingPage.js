import React from 'react';

export default function LandingPage() {

    const services = [

        {
            icon: '🛡️',
            title: 'Admin Management',
            desc:
                'Complete user control, analytics and healthcare reporting system.'
        },

        {
            icon: '👩‍⚕️',
            title: 'Doctor Workspace',
            desc:
                'Manage appointments, prescriptions and patient workflows.'
        },

        {
            icon: '💊',
            title: 'Pharmacy Inventory',
            desc:
                'Track medicine stock and prescription usage dynamically.'
        },

        {
            icon: '📅',
            title: 'Appointment System',
            desc:
                'Real-time patient appointment and reception management.'
        }

    ];

    return (

        <div
            style={{
                background: '#f8fafc',
                minHeight: '100vh',
                fontFamily:
                    "'Segoe UI', sans-serif",
                color: '#0f172a'
            }}
        >

            {/* NAVBAR */}

            <nav
                style={{
                    position: 'fixed',
                    top: 0,
                    width: '100%',
                    zIndex: 1000,
                    background:
                        'rgba(255,255,255,0.88)',
                    backdropFilter: 'blur(12px)',
                    borderBottom:
                        '1px solid #e2e8f0'
                }}
            >

                <div
                    style={{
                        maxWidth: '1300px',
                        margin: '0 auto',
                        padding: '18px 30px',
                        display: 'flex',
                        justifyContent:
                            'space-between',
                        alignItems: 'center'
                    }}
                >

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
                                borderRadius: '16px',
                                background:
                                    'linear-gradient(to right, #0f766e, #0284c7)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent:
                                    'center',
                                color: 'white',
                                fontSize: '26px'
                            }}
                        >
                            🏥
                        </div>

                        <div>

                            <div
                                style={{
                                    fontWeight: '800',
                                    fontSize: '24px'
                                }}
                            >
                                HealthCare Pro
                            </div>

                            <div
                                style={{
                                    fontSize: '13px',
                                    color: '#64748b'
                                }}
                            >
                                Smart Healthcare Platform
                            </div>

                        </div>

                    </div>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '28px'
                        }}
                    >

                        <a
                            href="#services"
                            style={navLink}
                        >
                            Services
                        </a>

                        <a
                            href="#about"
                            style={navLink}
                        >
                            About
                        </a>

                        <a
                            href="#contact"
                            style={navLink}
                        >
                            Contact
                        </a>

                        <a
                            href="/login"
                            style={loginBtn}
                        >
                            Login
                        </a>

                    </div>

                </div>

            </nav>

            {/* HERO */}

            <section
                style={{
                    minHeight: '100vh',
                    background:
                        'linear-gradient(135deg, #0f172a 0%, #0f766e 45%, #0284c7 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    padding:
                        '140px 30px 100px'
                }}
            >

                <div
                    style={{
                        position: 'absolute',
                        width: '450px',
                        height: '450px',
                        borderRadius: '999px',
                        background:
                            'rgba(255,255,255,0.08)',
                        top: '-120px',
                        right: '-100px'
                    }}
                />

                <div
                    style={{
                        position: 'absolute',
                        width: '300px',
                        height: '300px',
                        borderRadius: '999px',
                        background:
                            'rgba(255,255,255,0.06)',
                        bottom: '-80px',
                        left: '-60px'
                    }}
                />

                <div
                    style={{
                        maxWidth: '1300px',
                        margin: '0 auto',
                        width: '100%',
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '70px',
                        alignItems: 'center',
                        position: 'relative',
                        zIndex: 2
                    }}
                >

                    {/* LEFT */}

                    <div>

                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                                background:
                                    'rgba(255,255,255,0.12)',
                                padding:
                                    '12px 18px',
                                borderRadius:
                                    '999px',
                                marginBottom:
                                    '30px',
                                color: 'white',
                                fontWeight: '600'
                            }}
                        >
                            🚀 AI Powered Healthcare Workflow
                        </div>

                        <h1
                            style={{
                                fontSize: '76px',
                                lineHeight: '1.05',
                                color: 'white',
                                margin: 0,
                                fontWeight: '900'
                            }}
                        >
                            Next Generation
                            <br />
                            Hospital Management
                        </h1>

                        <p
                            style={{
                                marginTop: '30px',
                                color:
                                    'rgba(255,255,255,0.9)',
                                fontSize: '20px',
                                lineHeight: '1.9',
                                maxWidth: '680px'
                            }}
                        >
                            Manage appointments,
                            prescriptions,
                            patients, inventory
                            and analytics through
                            one modern healthcare
                            ecosystem designed
                            for hospitals and clinics.
                        </p>

                        <div
                            style={{
                                display: 'flex',
                                gap: '18px',
                                marginTop: '45px',
                                flexWrap: 'wrap'
                            }}
                        >

                            <a
                                href="/login"
                                style={heroPrimaryBtn}
                            >
                                Launch Dashboard
                            </a>

                            <a
                                href="#services"
                                style={heroSecondaryBtn}
                            >
                                View Features
                            </a>

                        </div>

                        <div
                            style={{
                                display: 'flex',
                                gap: '35px',
                                marginTop: '55px',
                                flexWrap: 'wrap'
                            }}
                        >

                            <div>
                                <div style={heroStatNumber}>
                                    10K+
                                </div>

                                <div style={heroStatLabel}>
                                    Appointments
                                </div>
                            </div>

                            <div>
                                <div style={heroStatNumber}>
                                    1500+
                                </div>

                                <div style={heroStatLabel}>
                                    Patients
                                </div>
                            </div>

                            <div>
                                <div style={heroStatNumber}>
                                    99%
                                </div>

                                <div style={heroStatLabel}>
                                    System Uptime
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* RIGHT */}

                    <div
                        style={{
                            display: 'flex',
                            justifyContent:
                                'center'
                        }}
                    >

                        <div
                            style={{
                                width: '100%',
                                maxWidth: '470px',
                                background:
                                    'rgba(255,255,255,0.14)',
                                backdropFilter:
                                    'blur(18px)',
                                border:
                                    '1px solid rgba(255,255,255,0.18)',
                                borderRadius:
                                    '35px',
                                padding: '35px',
                                boxShadow:
                                    '0 20px 60px rgba(0,0,0,0.25)'
                            }}
                        >

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent:
                                        'space-between',
                                    alignItems:
                                        'center',
                                    marginBottom:
                                        '30px'
                                }}
                            >

                                <div>

                                    <div
                                        style={{
                                            color: 'white',
                                            fontWeight:
                                                '700',
                                            fontSize:
                                                '24px'
                                        }}
                                    >
                                        Live Dashboard
                                    </div>

                                    <div
                                        style={{
                                            color:
                                                'rgba(255,255,255,0.7)'
                                        }}
                                    >
                                        Real-time hospital activity
                                    </div>

                                </div>

                                <div
                                    style={{
                                        width: '16px',
                                        height: '16px',
                                        borderRadius:
                                            '999px',
                                        background:
                                            '#22c55e'
                                    }}
                                />

                            </div>

                            <div style={dashboardGlassCard}>
                                <span>
                                    👨‍⚕️ Active Doctors
                                </span>
                                <strong>75</strong>
                            </div>

                            <div style={dashboardGlassCard}>
                                <span>
                                    🧑 Patients Today
                                </span>
                                <strong>240</strong>
                            </div>

                            <div style={dashboardGlassCard}>
                                <span>
                                    💊 Medicine Stock
                                </span>
                                <strong>530</strong>
                            </div>

                            <div style={dashboardGlassCard}>
                                <span>
                                    📅 Appointments
                                </span>
                                <strong>126</strong>
                            </div>

                            <div
                                style={{
                                    marginTop: '28px',
                                    background:
                                        'rgba(255,255,255,0.12)',
                                    borderRadius:
                                        '18px',
                                    padding: '18px',
                                    color: 'white'
                                }}
                            >
                                ✔ System performance stable • SQL Server Connected
                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* SERVICES */}

            <section
                id="services"
                style={{
                    maxWidth: '1250px',
                    margin: '90px auto',
                    padding: '0 20px'
                }}
            >

                <div
                    style={{
                        textAlign: 'center',
                        marginBottom: '60px'
                    }}
                >

                    <h2
                        style={{
                            fontSize: '48px',
                            marginBottom: '15px'
                        }}
                    >
                        Powerful Healthcare Features
                    </h2>

                    <p
                        style={{
                            color: '#64748b',
                            fontSize: '18px'
                        }}
                    >
                        Everything needed for a complete digital healthcare ecosystem.
                    </p>

                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '28px'
                    }}
                >

                    {services.map((service, index) => (

                        <div
                            key={index}
                            style={serviceCard}
                        >

                            <div
                                style={{
                                    fontSize: '52px',
                                    marginBottom: '20px'
                                }}
                            >
                                {service.icon}
                            </div>

                            <h3
                                style={{
                                    fontSize: '25px',
                                    marginBottom: '14px'
                                }}
                            >
                                {service.title}
                            </h3>

                            <p
                                style={{
                                    color: '#64748b',
                                    lineHeight: '1.8'
                                }}
                            >
                                {service.desc}
                            </p>

                        </div>

                    ))}

                </div>

            </section>

            {/* ABOUT */}

            <section
                id="about"
                style={{
                    background: 'white',
                    padding: '90px 25px'
                }}
            >

                <div
                    style={{
                        maxWidth: '1250px',
                        margin: '0 auto',
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '60px',
                        alignItems: 'center'
                    }}
                >

                    <div
                        style={{
                            fontSize: '150px',
                            textAlign: 'center'
                        }}
                    >
                        🏥
                    </div>

                    <div>

                        <h2
                            style={{
                                fontSize: '46px',
                                marginBottom: '25px'
                            }}
                        >
                            Built for Modern Healthcare
                        </h2>

                        <p
                            style={{
                                color: '#64748b',
                                lineHeight: '2',
                                fontSize: '18px'
                            }}
                        >
                            This Healthcare Management
                            System is designed to simplify
                            hospital operations using modern
                            web technologies.
                        </p>

                    </div>

                </div>

            </section>

            {/* FOOTER */}

            <footer
                id="contact"
                style={{
                    background: '#020617',
                    color: 'white',
                    padding: '50px 25px',
                    textAlign: 'center'
                }}
            >

                <h2>
                    HealthCare Pro
                </h2>

                <p
                    style={{
                        marginTop: '16px',
                        opacity: 0.75
                    }}
                >
                    Developed by Sankalpa • React • Node.js • SQL Server
                </p>

            </footer>

        </div>
    );
}

/* STYLES */

const navLink = {

    textDecoration: 'none',

    color: '#0f172a',

    fontWeight: '600'
};

const loginBtn = {

    background:
        'linear-gradient(to right, #0f766e, #0284c7)',

    color: 'white',

    padding: '12px 22px',

    borderRadius: '12px',

    textDecoration: 'none',

    fontWeight: '700'
};

const heroPrimaryBtn = {

    background: 'white',

    color: '#0f172a',

    padding: '16px 28px',

    borderRadius: '14px',

    textDecoration: 'none',

    fontWeight: '700'
};

const heroSecondaryBtn = {

    background: 'transparent',

    border:
        '2px solid rgba(255,255,255,0.4)',

    color: 'white',

    padding: '16px 28px',

    borderRadius: '14px',

    textDecoration: 'none',

    fontWeight: '700'
};

const serviceCard = {

    background: 'white',

    padding: '35px',

    borderRadius: '28px',

    boxShadow:
        '0 10px 30px rgba(0,0,0,0.06)'
};

const heroStatNumber = {

    color: 'white',

    fontSize: '42px',

    fontWeight: '800'
};

const heroStatLabel = {

    color:
        'rgba(255,255,255,0.75)',

    marginTop: '6px',

    fontSize: '15px'
};

const dashboardGlassCard = {

    display: 'flex',

    justifyContent: 'space-between',

    alignItems: 'center',

    background:
        'rgba(255,255,255,0.08)',

    padding: '18px 20px',

    borderRadius: '18px',

    color: 'white',

    marginBottom: '16px',

    border:
        '1px solid rgba(255,255,255,0.08)'
};