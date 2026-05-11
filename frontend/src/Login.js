import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/logo.png';

const API_URL = 'http://localhost:5000/api';

function Login() {
    // --- 1. Existing Login States ---
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    
    // --- 2. NEW Password Reset States ---
    const [view, setView] = useState('login'); // 'login', 'forgot', 'verify', 'reset'
    const [resetEmail, setResetEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    // --- LOGIC: STANDARD LOGIN ---
    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error || 'Login failed'); setLoading(false); return; }
            localStorage.setItem('user', JSON.stringify(data.user));
            switch (data.user.role) {
                case 'Admin':         navigate('/admin-dashboard'); break;
                case 'Doctor':        navigate('/doctor-panel'); break;
                case 'Pharmacist':    navigate('/inventory'); break;
                case 'Receptionist':  navigate('/receptionist-dashboard'); break;
                case 'Patient':       navigate('/patient-dashboard'); break;
                default:              navigate('/');
            }
        } catch (err) {
            setError('Server error. Please try again.');
        }
        setLoading(false);
    }

    async function handleSendOtp(e) {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: resetEmail })
            });

            // FIX: Check if we actually got JSON back
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Backend server error. Check VS Code terminal!");
            }

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            
            setSuccess('OTP sent to your email!');
            setView('verify');
        } catch (err) {
            setError(err.message || 'Failed to send OTP.');
        }
        setLoading(false);
    }

    // --- LOGIC: VERIFY OTP ---
    async function handleVerifyOtp(e) {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: resetEmail, otp })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            
            setSuccess('OTP Verified!');
            setView('reset');
        } catch (err) {
            setError(err.message || 'Invalid OTP.');
        }
        setLoading(false);
    }

    // --- LOGIC: RESET PASSWORD ---
    async function handleResetPassword(e) {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: resetEmail, otp, newPassword })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            
            setSuccess('Password updated! You can now sign in.');
            setTimeout(() => {
                setView('login');
                setSuccess('');
                setResetEmail('');
                setOtp('');
                setNewPassword('');
            }, 3000);
        } catch (err) {
            setError(err.message || 'Failed to reset password.');
        }
        setLoading(false);
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(30px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                @keyframes floatLogo {
                    0%   { transform: translateY(0px) rotate(0deg); }
                    25%  { transform: translateY(-6px) rotate(1deg); }
                    50%  { transform: translateY(-10px) rotate(0deg); }
                    75%  { transform: translateY(-6px) rotate(-1deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }

                @keyframes floatText {
                    0%   { transform: translateY(0px) translateX(0px); }
                    33%  { transform: translateY(-5px) translateX(2px); }
                    66%  { transform: translateY(-3px) translateX(-2px); }
                    100% { transform: translateY(0px) translateX(0px); }
                }

                @keyframes glowPulse {
                    0%   { box-shadow: 0 0 8px rgba(20,184,166,0.3); }
                    50%  { box-shadow: 0 0 22px rgba(20,184,166,0.7), 0 0 40px rgba(6,182,212,0.3); }
                    100% { box-shadow: 0 0 8px rgba(20,184,166,0.3); }
                }

                @keyframes textGlow {
                    0%   { text-shadow: 0 0 0px rgba(255,255,255,0); }
                    50%  { text-shadow: 0 0 12px rgba(255,255,255,0.25), 0 0 24px rgba(45,212,191,0.15); }
                    100% { text-shadow: 0 0 0px rgba(255,255,255,0); }
                }

                .login-input::placeholder { color: rgba(180,220,220,0.45); }
                .login-input:focus {
                    border-color: rgba(20,184,166,0.7) !important;
                    background: rgba(20,184,166,0.08) !important;
                    outline: none;
                }
                .signin-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 16px 40px rgba(6,182,212,0.55) !important;
                }
                .feature-card:hover { background: rgba(255,255,255,0.08) !important; }
                .forgot-link:hover  { color: #2dd4bf !important; text-decoration: underline; }
                .eye-btn:hover      { color: #2dd4bf !important; }
            `}</style>

            <div style={styles.page}>
                <div style={styles.container}>

                    {/* ── LEFT PANEL ── */}
                    <div style={styles.leftPanel}>
                        <div style={styles.imgOverlay} />
                        <div style={styles.leftContent}>

                            {/* Brand with animation */}
                            <div style={styles.brand}>
                                <div style={styles.brandIcon}>
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"
                                            fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1.5"/>
                                        <path d="M12 8v8M8 12h8"
                                            stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                </div>
                                <div style={styles.brandTextWrap}>
                                    <div style={styles.brandName}>Medicare Hospital</div>
                                    <div style={styles.brandSub}>Management System</div>
                                </div>
                            </div>

                            {/* Hero headline */}
                            <div style={styles.heroText}>
                                <span style={{ color: '#ffffff' }}>Caring for{'\n'}</span>
                                <span style={{ color: '#2dd4bf' }}>Patients with{'\n'}</span>
                                <span style={{ color: '#ffffff' }}>Compassion</span>
                            </div>

                            <p style={styles.leftSubtitle}>
                                Smart Hospital Management System for patient care,
                                pharmacy automation, billing, analytics and workflow control.
                            </p>

                            <div style={styles.divider} />

                            {/* Features */}
                            <div style={styles.features}>
                                {[
                                    {
                                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>,
                                        title: 'Smart Patient Management',
                                        desc:  'Efficient and seamless patient management'
                                    },
                                    {
                                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/><path d="M12 8v4l3 3" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>,
                                        title: 'Doctor Workflow System',
                                        desc:  'Streamlined workflow for better care'
                                    },
                                    {
                                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-4" stroke="white" strokeWidth="2" strokeLinecap="round"/><path d="M9 3a3 3 0 0 1 6 0v1H9V3z" stroke="white" strokeWidth="2"/><path d="M9 12h6M9 16h4" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>,
                                        title: 'Pharmacy Automation',
                                        desc:  'Automated pharmacy & inventory management'
                                    },
                                    {
                                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><line x1="18" y1="20" x2="18" y2="10" stroke="white" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="20" x2="12" y2="4" stroke="white" strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="20" x2="6" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>,
                                        title: 'Billing & Reports',
                                        desc:  'Accurate billing with detailed reports'
                                    }
                                ].map((f, i) => (
                                    <div key={i} className="feature-card" style={styles.featureCard}>
                                        <div style={styles.featureIcon}>{f.icon}</div>
                                        <div>
                                            <div style={styles.featureTitle}>{f.title}</div>
                                            <div style={styles.featureDesc}>{f.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>

                    {/* ── RIGHT PANEL ── */}
                    <div style={styles.rightPanel}>
                        <div style={styles.card}>

                            <div style={styles.shieldWrap}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6l-8-4z"
                                        fill="rgba(20,184,166,0.25)" stroke="#2dd4bf" strokeWidth="1.8"/>
                                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2"
                                        strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>

                            {/* DYNAMIC HEADER */}
                            <h2 style={styles.title}>
                                {view === 'login' && 'Sign In'}
                                {view === 'forgot' && 'Reset Password'}
                                {view === 'verify' && 'Enter OTP'}
                                {view === 'reset' && 'New Password'}
                            </h2>
                            <p style={styles.subtitle}>
                                {view === 'login' && 'Access your secure healthcare dashboard'}
                                {view === 'forgot' && 'Enter your email to receive a code'}
                                {view === 'verify' && 'Check your email for the 6-digit code'}
                                {view === 'reset' && 'Create a strong new password'}
                            </p>

                            {/* --- VIEW 1: LOGIN FORM --- */}
                            {view === 'login' && (
                                <form onSubmit={handleSubmit} style={styles.form}>
                                    <div style={styles.inputWrap}>
                                        <span style={styles.inputIcon}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="8" r="4" stroke="#2dd4bf" strokeWidth="2"/>
                                                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round"/>
                                            </svg>
                                        </span>
                                        <input
                                            className="login-input"
                                            type="text"
                                            placeholder="Username"
                                            value={form.username}
                                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                                            required
                                            style={styles.input}
                                        />
                                    </div>

                                    <div style={styles.inputWrap}>
                                        <span style={styles.inputIcon}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                <rect x="3" y="11" width="18" height="11" rx="2" stroke="#2dd4bf" strokeWidth="2"/>
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round"/>
                                            </svg>
                                        </span>
                                        <input
                                            className="login-input"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Password"
                                            value={form.password}
                                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                                            required
                                            style={{ ...styles.input, paddingRight: '48px' }}
                                        />
                                        <button type="button" className="eye-btn"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={styles.eyeBtn}>
                                            {showPassword ? (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                </svg>
                                            ) : (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                                                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                                                </svg>
                                            )}
                                        </button>
                                    </div>

                                    <div style={styles.rememberRow}>
                                        <label style={styles.rememberLabel}>
                                            <input type="checkbox" checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                                style={styles.checkbox}/>
                                            <span style={{ color: '#cbd5e1', fontSize: '14px' }}>Remember me</span>
                                        </label>

                                        {/* CHANGED: Now switches the view instead of navigating */}
                                        <span
                                            className="forgot-link"
                                            style={styles.forgotLink}
                                            onClick={() => { setError(''); setSuccess(''); setView('forgot'); }}
                                        >
                                            Forgot Password?
                                        </span>
                                    </div>

                                    <button type="submit" disabled={loading} className="signin-btn"
                                        style={{ ...styles.button, opacity: loading ? 0.75 : 1,
                                            cursor: loading ? 'not-allowed' : 'pointer' }}>
                                        {loading ? 'Signing In...' : <>Sign In &nbsp;→</>}
                                    </button>
                                </form>
                            )}

                            {/* --- VIEW 2: REQUEST OTP --- */}
                            {view === 'forgot' && (
                                <form onSubmit={handleSendOtp} style={styles.form}>
                                    <div style={styles.inputWrap}>
                                        <span style={styles.inputIcon}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#2dd4bf" strokeWidth="2"/>
                                                <polyline points="22,6 12,13 2,6" stroke="#2dd4bf" strokeWidth="2"/>
                                            </svg>
                                        </span>
                                        <input
                                            className="login-input"
                                            type="email"
                                            placeholder="Enter your registered email"
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                            required
                                            style={styles.input}
                                        />
                                    </div>
                                    <button type="submit" disabled={loading} className="signin-btn" style={{ ...styles.button, opacity: loading ? 0.75 : 1 }}>
                                        {loading ? 'Sending...' : <>Send Recovery OTP &nbsp;→</>}
                                    </button>
                                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                                        <span className="forgot-link" onClick={() => { setError(''); setView('login'); }} style={styles.forgotLink}>
                                            ← Back to Login
                                        </span>
                                    </div>
                                </form>
                            )}

                            {/* --- VIEW 3: VERIFY OTP --- */}
                            {view === 'verify' && (
                                <form onSubmit={handleVerifyOtp} style={styles.form}>
                                    <div style={styles.inputWrap}>
                                        <span style={styles.inputIcon}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </span>
                                        <input
                                            className="login-input"
                                            type="text"
                                            placeholder="Enter 6-digit OTP"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            required
                                            style={{ ...styles.input, letterSpacing: '2px', fontWeight: 'bold' }}
                                        />
                                    </div>
                                    <button type="submit" disabled={loading} className="signin-btn" style={{ ...styles.button, opacity: loading ? 0.75 : 1 }}>
                                        {loading ? 'Verifying...' : <>Verify OTP &nbsp;→</>}
                                    </button>
                                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                                        <span className="forgot-link" onClick={() => setView('forgot')} style={styles.forgotLink}>
                                            ← Resend Code
                                        </span>
                                    </div>
                                </form>
                            )}

                            {/* --- VIEW 4: RESET PASSWORD --- */}
                            {view === 'reset' && (
                                <form onSubmit={handleResetPassword} style={styles.form}>
                                    <div style={styles.inputWrap}>
                                        <span style={styles.inputIcon}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                <rect x="3" y="11" width="18" height="11" rx="2" stroke="#2dd4bf" strokeWidth="2"/>
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round"/>
                                            </svg>
                                        </span>
                                        <input
                                            className="login-input"
                                            type="password"
                                            placeholder="Enter New Password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            style={styles.input}
                                        />
                                    </div>
                                    <button type="submit" disabled={loading} className="signin-btn" style={{ ...styles.button, opacity: loading ? 0.75 : 1 }}>
                                        {loading ? 'Updating...' : <>Update Password &nbsp;→</>}
                                    </button>
                                </form>
                            )}

                            {/* ALERTS */}
                            {error && <div style={styles.error}>{error}</div>}
                            {success && <div style={styles.success}>{success}</div>}

                            <div style={styles.footer}>
                                © 2026 Integrated Hospital Management System<br/>
                                <span style={{ opacity: 0.7 }}>All rights reserved.</span>
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
        background: 'linear-gradient(135deg, #021a1a 0%, #062e2e 40%, #0a4040 70%, #062e2e 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        fontFamily: "'Inter','Segoe UI',sans-serif"
    },

    container: {
        width: '100%',
        maxWidth: '1100px',
        minHeight: '640px',
        borderRadius: '24px',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        border: '1px solid rgba(45,212,191,0.15)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
        animation: 'fadeIn 0.8s ease'
    },

    leftPanel: {
        position: 'relative',
        background: 'linear-gradient(160deg, #021a1a 0%, #052a2a 60%, #0a3a3a 100%)',
        padding: '50px 45px',
        display: 'flex',
        alignItems: 'flex-start',
        overflow: 'hidden'
    },

    imgOverlay: {
        position: 'absolute',
        inset: 0,
        opacity: 0.08,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    },

    leftContent: {
        position: 'relative',
        zIndex: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
    },

    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        marginBottom: '40px'
    },

    brandIcon: {
        width: '52px',
        height: '52px',
        borderRadius: '14px',
        background: 'linear-gradient(135deg, #0f766e, #0891b2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        animation: 'floatLogo 4s ease-in-out infinite, glowPulse 4s ease-in-out infinite'
    },

    brandTextWrap: {
        animation: 'floatText 5s ease-in-out infinite'
    },

    brandName: {
        color: '#ffffff',
        fontSize: '17px',
        fontWeight: '700',
        lineHeight: '1.2',
        animation: 'textGlow 5s ease-in-out infinite'
    },

    brandSub: {
        color: '#94a3b8',
        fontSize: '13px',
        marginTop: '2px'
    },

    heroText: {
        fontSize: '42px',
        fontWeight: '800',
        lineHeight: '1.2',
        marginBottom: '20px',
        whiteSpace: 'pre-line'
    },

    leftSubtitle: {
        fontSize: '14px',
        lineHeight: '1.75',
        color: '#94a3b8',
        marginBottom: '28px',
        maxWidth: '380px'
    },

    divider: {
        width: '50px',
        height: '3px',
        background: 'linear-gradient(90deg, #14b8a6, #06b6d4)',
        borderRadius: '4px',
        marginBottom: '28px'
    },

    features: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },

    featureCard: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        padding: '14px 16px',
        borderRadius: '14px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: '0.25s'
    },

    featureIcon: {
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #0f766e, #0891b2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
    },

    featureTitle: {
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: '700',
        marginBottom: '3px'
    },

    featureDesc: {
        color: '#64748b',
        fontSize: '13px'
    },

    rightPanel: {
        background: 'linear-gradient(160deg, #031e1e 0%, #052828 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '50px 45px',
        borderLeft: '1px solid rgba(45,212,191,0.08)'
    },

    card: {
        width: '100%',
        maxWidth: '380px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },

    shieldWrap: {
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        background: 'rgba(20,184,166,0.12)',
        border: '1px solid rgba(45,212,191,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px'
    },

    title: {
        textAlign: 'center',
        fontSize: '38px',
        fontWeight: '800',
        color: '#ffffff',
        marginBottom: '8px'
    },

    subtitle: {
        textAlign: 'center',
        color: '#64748b',
        fontSize: '14px',
        marginBottom: '32px'
    },

    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%'
    },

    inputWrap: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    },

    inputIcon: {
        position: 'absolute',
        left: '16px',
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none',
        zIndex: 1
    },

    input: {
        width: '100%',
        padding: '15px 16px 15px 48px',
        borderRadius: '12px',
        border: '1px solid rgba(45,212,191,0.18)',
        background: 'rgba(255,255,255,0.04)',
        color: '#ffffff',
        fontSize: '15px',
        outline: 'none',
        boxSizing: 'border-box',
        transition: '0.25s'
    },

    eyeBtn: {
        position: 'absolute',
        right: '14px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#64748b',
        display: 'flex',
        alignItems: 'center',
        padding: '4px',
        transition: '0.2s'
    },

    rememberRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '-4px'
    },

    rememberLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer'
    },

    checkbox: {
        width: '16px',
        height: '16px',
        accentColor: '#14b8a6',
        cursor: 'pointer'
    },

    forgotLink: {
        color: '#14b8a6',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: '0.2s',
        userSelect: 'none'
    },

    button: {
        marginTop: '4px',
        padding: '16px',
        border: 'none',
        borderRadius: '12px',
        background: 'linear-gradient(90deg, #06b6d4 0%, #14b8a6 100%)',
        color: '#ffffff',
        fontSize: '16px',
        fontWeight: '700',
        transition: '0.3s',
        boxShadow: '0 8px 24px rgba(6,182,212,0.35)',
        width: '100%'
    },

    error: {
        marginTop: '14px',
        padding: '13px',
        borderRadius: '10px',
        background: 'rgba(239,68,68,0.15)',
        border: '1px solid rgba(239,68,68,0.25)',
        color: '#fca5a5',
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: '600',
        width: '100%'
    },

    // --- NEW: Added a green success box styling ---
    success: {
        marginTop: '14px',
        padding: '13px',
        borderRadius: '10px',
        background: 'rgba(20,184,166,0.15)',
        border: '1px solid rgba(20,184,166,0.25)',
        color: '#5eead4',
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: '600',
        width: '100%'
    },

    footer: {
        marginTop: '28px',
        textAlign: 'center',
        fontSize: '13px',
        color: '#c2cad2',
        lineHeight: '1.6'
    }
};