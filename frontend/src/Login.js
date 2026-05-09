import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/logo.png';

const API_URL = 'http://localhost:5000/api';

function Login() {

    const [form, setForm] = useState({
        username: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(e) {

        e.preventDefault();

        setError('');
        setLoading(true);

        try {

            const res = await fetch(`${API_URL}/auth/login`, {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (!res.ok) {

                setError(data.error || 'Login failed');

                setLoading(false);

                return;
            }

            localStorage.setItem(
                'user',
                JSON.stringify(data.user)
            );

            switch (data.user.role) {

                case 'Admin':
                    navigate('/admin-dashboard');
                    break;

                case 'Doctor':
                    navigate('/doctor-panel');
                    break;

                case 'Pharmacist':
                    navigate('/inventory');
                    break;

                case 'Receptionist':
                    navigate('/receptionist-dashboard');
                    break;

                case 'Patient':
                    navigate('/patient-dashboard');
                    break;

                default:
                    navigate('/');
            }

        } catch (err) {

            setError(
                'Server error. Please try again.'
            );
        }

        setLoading(false);
    }

    return (

        <>
            <style>
                {`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes float {
                    0% {
                        transform: translateY(0px);
                    }

                    50% {
                        transform: translateY(-8px);
                    }

                    100% {
                        transform: translateY(0px);
                    }
                }

                input::placeholder {
                    color: rgba(255,255,255,0.75);
                }
                `}
            </style>

            <div style={styles.page}>

                <div style={styles.container}>

                    {/* LEFT SIDE */}

                    <div style={styles.leftPanel}>

                        <div style={styles.leftContent}>

                            <img
                                src={logo}
                                alt="logo"
                                style={styles.logoImg}
                            />

                            <h1 style={styles.leftTitle}>
                                HealthCare Pro
                            </h1>

                            <p style={styles.leftSubtitle}>
                                Smart Hospital Management System for patient care,
                                pharmacy automation, billing, analytics and workflow control.
                            </p>

                            <div style={styles.features}>
                                <div>✔ Smart Patient Management</div>
                                <div>✔ Doctor Workflow System</div>
                                <div>✔ Pharmacy Automation</div>
                                <div>✔ Billing & Reports</div>
                            </div>

                        </div>

                    </div>

                    {/* RIGHT SIDE */}

                    <div style={styles.rightPanel}>

                        <div style={styles.card}>

                            <h2 style={styles.title}>
                                Sign In
                            </h2>

                            <p style={styles.subtitle}>
                                Access your secure healthcare dashboard
                            </p>

                            <form
                                onSubmit={handleSubmit}
                                style={styles.form}
                            >

                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={form.username}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            username: e.target.value
                                        })
                                    }
                                    required
                                    style={styles.input}
                                />

                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={form.password}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            password: e.target.value
                                        })
                                    }
                                    required
                                    style={styles.input}
                                />

                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        ...styles.button,
                                        opacity: loading ? 0.7 : 1
                                    }}

                                    onMouseEnter={(e) => {

                                        e.target.style.transform =
                                            'translateY(-4px) scale(1.01)';

                                        e.target.style.boxShadow =
                                            '0 20px 40px rgba(6,182,212,0.45)';
                                    }}

                                    onMouseLeave={(e) => {

                                        e.target.style.transform =
                                            'translateY(0px) scale(1)';

                                        e.target.style.boxShadow =
                                            '0 10px 30px rgba(6,182,212,0.35)';
                                    }}
                                >
                                    {loading
                                        ? 'Signing In...'
                                        : 'Sign In'}
                                </button>

                            </form>

                            {error && (

                                <div style={styles.error}>
                                    {error}
                                </div>

                            )}

                            <div style={styles.footer}>
                                © 2026 Healthcare Management System
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}

export default Login;

/* =========================
   STYLES
========================= */

const styles = {

    page: {

        minHeight: '100vh',

        background:
            'linear-gradient(135deg, #064e3b 0%, #0f766e 50%, #115e59 100%)',

        display: 'flex',

        justifyContent: 'center',

        alignItems: 'center',

        padding: '20px',

        fontFamily:
            "'Inter','Segoe UI',sans-serif"
    },

    /* MAIN CONTAINER */

    container: {

        width: '100%',

        maxWidth: '1120px',

        minHeight: '620px',

        background:
            'rgba(255,255,255,0.08)',

        borderRadius: '30px',

        overflow: 'hidden',

        display: 'grid',

        gridTemplateColumns: '1fr 1fr',

        backdropFilter: 'blur(18px)',

        border:
            '1px solid rgba(255,255,255,0.12)',

        boxShadow:
            '0 25px 60px rgba(0,0,0,0.30)',

        animation:
            'fadeIn 1s ease'
    },

    /* LEFT PANEL */

    leftPanel: {

        background:
            'linear-gradient(135deg, #064e3b 0%, #0f766e 100%)',

        padding: '55px',

        display: 'flex',

        alignItems: 'center',

        justifyContent: 'center',

        color: '#ffffff'
    },

    leftContent: {

        width: '100%',

        display: 'flex',

        flexDirection: 'column',

        justifyContent: 'center',

        alignItems: 'center',

        textAlign: 'center'
    },

    logoImg: {

        width: '110px',

        height: '110px',

        objectFit: 'contain',

        marginBottom: '25px',

        animation:
            'float 4s ease-in-out infinite'
    },

    leftTitle: {

        fontSize: '50px',

        fontWeight: '800',

        marginBottom: '18px',

        color: '#ffffff'
    },

    leftSubtitle: {

        fontSize: '16px',

        lineHeight: '1.8',

        color: '#dbeafe',

        marginBottom: '35px',

        maxWidth: '430px',

        textAlign: 'center'
    },

    features: {

        display: 'flex',

        flexDirection: 'column',

        gap: '16px',

        fontSize: '16px',

        fontWeight: '600',

        alignItems: 'flex-start'
    },

    /* RIGHT PANEL */

    rightPanel: {

        background:
            'rgba(255,255,255,0.06)',

        display: 'flex',

        justifyContent: 'center',

        alignItems: 'center',

        padding: '45px'
    },

    card: {

        width: '100%',

        maxWidth: '400px'
    },

    title: {

        textAlign: 'center',

        fontSize: '46px',

        fontWeight: '800',

        color: '#ffffff',

        marginBottom: '10px'
    },

    subtitle: {

        textAlign: 'center',

        color: '#dbeafe',

        fontSize: '15px',

        marginBottom: '30px'
    },

    form: {

        display: 'flex',

        flexDirection: 'column',

        gap: '18px'
    },

    input: {

        width: '100%',

        padding: '17px 20px',

        borderRadius: '15px',

        border:
            '1px solid rgba(255,255,255,0.15)',

        background:
            'rgba(255,255,255,0.10)',

        backdropFilter: 'blur(10px)',

        color: '#ffffff',

        fontSize: '15px',

        outline: 'none',

        boxSizing: 'border-box',

        transition: '0.3s'
    },

    button: {

        marginTop: '10px',

        padding: '17px',

        border: 'none',

        borderRadius: '15px',

        background:
            'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',

        color: '#ffffff',

        fontSize: '16px',

        fontWeight: '700',

        cursor: 'pointer',

        transition: '0.35s',

        boxShadow:
            '0 10px 30px rgba(6,182,212,0.35)'
    },

    error: {

        marginTop: '16px',

        padding: '13px',

        borderRadius: '12px',

        background:
            'rgba(239,68,68,0.18)',

        color: '#ffffff',

        textAlign: 'center',

        fontWeight: '600'
    },

    footer: {

        marginTop: '30px',

        textAlign: 'center',

        fontSize: '13px',

        color: '#dbeafe'
    }
};