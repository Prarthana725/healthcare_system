import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

function ForgotPassword() {

    const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // NEW: Countdown timer state for the Resend button
    const [resendTimer, setResendTimer] = useState(0);

    const navigate = useNavigate();

    // NEW: Effect to handle the countdown timer
    useEffect(() => {
        let interval;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleResponse = async (res) => {
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const rawText = await res.text();
            console.error("Backend Crash Details:", rawText);
            throw new Error("Backend server error. Please check your SQL column names in the terminal.");
        }
        return await res.json();
    };

    // Step 1 — send OTP to email
    async function handleSendOtp(e) {
        if (e) e.preventDefault();
        setError(''); setSuccess(''); setLoading(true);

        try {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 15000);

            const res = await fetch(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
                signal: controller.signal
            });
            
            clearTimeout(id);

            const data = await handleResponse(res);
            if (!res.ok) { 
                setError(data.error || 'Failed to send OTP'); 
                setLoading(false); 
                return; 
            }

            setSuccess('OTP sent successfully!');
            setStep(2);
            setResendTimer(60); // Start the 60-second cooldown
        } catch (err) {
            if (err.name === 'AbortError') {
                setError('Request timed out. Check your internet or backend connection.');
            } else {
                setError(err.message || 'Server error. Check VS Code terminal.');
            }
        }
        setLoading(false);
    }

    // Step 2 — verify OTP
    async function handleVerifyOtp(e) {
        e.preventDefault();
        setError(''); setSuccess(''); setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });
            const data = await handleResponse(res);
            if (!res.ok) { setError(data.error || 'Invalid OTP'); setLoading(false); return; }
            setSuccess('Code verified!');
            setStep(3);
        } catch (err) {
            setError(err.message || 'Verification failed.');
        }
        setLoading(false);
    }

    // Step 3 — reset password
    async function handleResetPassword(e) {
        e.preventDefault();
        setError('');
        if (newPassword !== confirmPassword) { setError('Passwords do not match!'); return; }
        if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword })
            });
            const data = await handleResponse(res);
            if (!res.ok) { setError(data.error || 'Reset failed'); setLoading(false); return; }
            setSuccess('Password updated! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2500); 
        } catch (err) {
            setError(err.message || 'Failed to update password.');
        }
        setLoading(false);
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes glowPulse {
                    0%   { box-shadow: 0 0 8px rgba(20,184,166,0.3); }
                    50%  { box-shadow: 0 0 22px rgba(20,184,166,0.7), 0 0 40px rgba(6,182,212,0.3); }
                    100% { box-shadow: 0 0 8px rgba(20,184,166,0.3); }
                }
                .fp-input::placeholder { color: rgba(180,220,220,0.45); }
                .fp-input:focus {
                    border-color: rgba(20,184,166,0.7) !important;
                    background: rgba(20,184,166,0.08) !important;
                    outline: none;
                }
                .fp-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 16px 40px rgba(6,182,212,0.55) !important;
                }
                .back-btn:hover { color: #2dd4bf !important; }
                .eye-btn:hover  { color: #2dd4bf !important; }
                
                .otp-input-special {
                    width: 100% !important;
                    text-align: center !important;
                    letter-spacing: 14px !important;
                    font-size: 26px !important;
                    font-weight: 800 !important;
                    color: #2dd4bf !important;
                }
            `}</style>

            <div style={styles.page}>
                <div style={styles.card}>

                    <div style={styles.iconWrap}>
                        {step === 1 && (
                            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#2dd4bf" strokeWidth="1.8"/>
                                <path d="M22 6l-10 7L2 6" stroke="#2dd4bf" strokeWidth="1.8" strokeLinecap="round"/>
                            </svg>
                        )}
                        {step === 2 && (
                            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="11" width="18" height="11" rx="2" stroke="#2dd4bf" strokeWidth="1.8"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#2dd4bf" strokeWidth="1.8" strokeLinecap="round"/>
                            </svg>
                        )}
                        {step === 3 && (
                            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6l-8-4z"
                                    fill="rgba(20,184,166,0.2)" stroke="#2dd4bf" strokeWidth="1.8"/>
                            </svg>
                        )}
                    </div>

                    <div style={styles.stepRow}>
                        {[1, 2, 3].map(s => (
                            <div key={s} style={{
                                ...styles.stepDot,
                                background: s <= step ? 'linear-gradient(90deg,#06b6d4,#14b8a6)' : 'rgba(255,255,255,0.1)',
                                width: s === step ? '28px' : '10px'
                            }}/>
                        ))}
                    </div>

                    <h2 style={styles.title}>
                        {step === 1 && 'Forgot Password'}
                        {step === 2 && 'Verify Code'}
                        {step === 3 && 'Update Password'}
                    </h2>
                    <p style={styles.subtitle}>
                        {step === 1 && 'Enter your email to receive a recovery OTP'}
                        {step === 2 && `We've sent a 6-digit code to ${email}`}
                        {step === 3 && 'Almost there! Set your new account password'}
                    </p>

                    {step === 1 && (
                        <form onSubmit={handleSendOtp} style={styles.form}>
                            <div style={styles.inputWrap}>
                                <span style={styles.inputIcon}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#2dd4bf" strokeWidth="2"/>
                                    </svg>
                                </span>
                                <input
                                    className="fp-input"
                                    type="email"
                                    placeholder="Enter your registered email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    style={styles.input}
                                />
                            </div>
                            <button type="submit" disabled={loading} className="fp-btn"
                                style={{ ...styles.button, opacity: loading ? 0.75 : 1 }}>
                                {loading ? 'Sending OTP...' : 'Send Recovery OTP →'}
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerifyOtp} style={styles.form}>
                            <div style={styles.inputWrap}>
                                <input
                                    className="fp-input otp-input-special"
                                    type="text"
                                    maxLength={6}
                                    placeholder="000000"
                                    value={otp}
                                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                                    required
                                    style={styles.input}
                                />
                            </div>
                            <button type="submit" disabled={loading || otp.length < 6} className="fp-btn"
                                style={{ ...styles.button, opacity: (loading || otp.length < 6) ? 0.6 : 1 }}>
                                {loading ? 'Verifying...' : 'Verify Code →'}
                            </button>
                            
                            {/* UPDATED TIMER RESEND BUTTON */}
                            <button 
                                type="button" 
                                disabled={resendTimer > 0 || loading}
                                style={{ ...styles.resendBtn, opacity: (resendTimer > 0) ? 0.5 : 1, cursor: (resendTimer > 0) ? 'not-allowed' : 'pointer' }}
                                onClick={() => { setOtp(''); handleSendOtp(); }}
                            >
                                {resendTimer > 0 ? `Resend available in ${resendTimer}s` : "Didn't get it? Resend Code"}
                            </button>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleResetPassword} style={styles.form}>
                            <div style={styles.inputWrap}>
                                <span style={styles.inputIcon}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <rect x="3" y="11" width="18" height="11" rx="2" stroke="#2dd4bf" strokeWidth="2"/>
                                    </svg>
                                </span>
                                <input
                                    className="fp-input"
                                    type={showNew ? 'text' : 'password'}
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    required
                                    style={{ ...styles.input, paddingRight: '48px' }}
                                />
                                <button type="button" className="eye-btn"
                                    onClick={() => setShowNew(!showNew)} style={styles.eyeBtn}>
                                    {showNew ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            <div style={styles.inputWrap}>
                                <span style={styles.inputIcon}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <rect x="3" y="11" width="18" height="11" rx="2" stroke="#2dd4bf" strokeWidth="2"/>
                                    </svg>
                                </span>
                                <input
                                    className="fp-input"
                                    type={showConfirm ? 'text' : 'password'}
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    required
                                    style={{ 
                                        ...styles.input, 
                                        paddingRight: '48px',
                                        borderColor: (confirmPassword && newPassword === confirmPassword) ? '#22c55e' : 'rgba(45,212,191,0.18)'
                                    }}
                                />
                                <button type="button" className="eye-btn"
                                    onClick={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                                    {showConfirm ? 'Hide' : 'Show'}
                                </button>
                            </div>

                            {newPassword && (
                                <div style={styles.strengthWrap}>
                                    <div style={styles.strengthBar}>
                                        <div style={{
                                            ...styles.strengthFill,
                                            width: newPassword.length >= 10 ? '100%' : newPassword.length >= 6 ? '60%' : '25%',
                                            background: newPassword.length >= 10 ? '#22c55e' : newPassword.length >= 6 ? '#f59e0b' : '#ef4444'
                                        }}/>
                                    </div>
                                    <span style={{ ...styles.strengthLabel, color: newPassword.length >= 10 ? '#22c55e' : newPassword.length >= 6 ? '#f59e0b' : '#ef4444' }}>
                                        {newPassword.length >= 10 ? 'Strong' : newPassword.length >= 6 ? 'Medium' : 'Weak'}
                                    </span>
                                </div>
                            )}

                            <button type="submit" disabled={loading} className="fp-btn"
                                style={{ ...styles.button, opacity: loading ? 0.75 : 1 }}>
                                {loading ? 'Saving...' : 'Save New Password →'}
                            </button>
                        </form>
                    )}

                    {error   && <div style={styles.error}>{error}</div>}
                    {success && <div style={styles.successMsg}>{success}</div>}

                    <button type="button" className="back-btn"
                        onClick={() => navigate('/login')} style={styles.backBtn}>
                        ← Back to Login
                    </button>

                </div>
            </div>
        </>
    );
}

export default ForgotPassword;

const styles = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #021a1a 0%, #062e2e 40%, #0a4040 70%, #062e2e 100%)',
        display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px',
        fontFamily: "'Inter','Segoe UI',sans-serif"
    },
    card: {
        width: '100%', maxWidth: '440px',
        background: 'linear-gradient(160deg, #031e1e 0%, #052828 100%)',
        borderRadius: '24px', border: '1px solid rgba(45,212,191,0.15)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.55)', padding: '48px 40px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        animation: 'fadeIn 0.7s ease'
    },
    iconWrap: {
        width: '72px', height: '72px', borderRadius: '50%',
        background: 'rgba(20,184,166,0.12)', border: '1px solid rgba(45,212,191,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
        animation: 'glowPulse 3s ease-in-out infinite'
    },
    stepRow: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '22px' },
    stepDot: { height: '8px', borderRadius: '99px', transition: 'all 0.4s ease' },
    title: { fontSize: '28px', fontWeight: '800', color: '#ffffff', marginBottom: '8px', textAlign: 'center' },
    subtitle: { fontSize: '14px', color: '#64748b', textAlign: 'center', marginBottom: '28px' },
    form: { display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' },
    inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
    inputIcon: { position: 'absolute', left: '16px', display: 'flex', alignItems: 'center', pointerEvents: 'none', zIndex: 1 },
    input: {
        width: '100%', padding: '15px 16px 15px 48px', borderRadius: '12px',
        border: '1px solid rgba(45,212,191,0.18)', background: 'rgba(255,255,255,0.04)',
        color: '#ffffff', fontSize: '15px', outline: 'none', boxSizing: 'border-box', transition: '0.25s'
    },
    eyeBtn: {
        position: 'absolute', right: '14px', background: 'none', border: 'none',
        cursor: 'pointer', color: '#14b8a6', fontSize: '12px', fontWeight: '700', padding: '4px'
    },
    button: {
        padding: '16px', border: 'none', borderRadius: '12px',
        background: 'linear-gradient(90deg, #06b6d4 0%, #14b8a6 100%)',
        color: '#ffffff', fontSize: '15px', fontWeight: '700', transition: '0.3s',
        boxShadow: '0 8px 24px rgba(6,182,212,0.35)', width: '100%', marginTop: '5px'
    },
    resendBtn: {
        background: 'none', border: 'none', color: '#14b8a6', fontSize: '13px',
        fontWeight: '600', textAlign: 'center', padding: '4px', transition: '0.3s'
    },
    strengthWrap: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '-5px' },
    strengthBar: { flex: 1, height: '4px', borderRadius: '99px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
    strengthFill: { height: '100%', borderRadius: '99px', transition: 'all 0.3s ease' },
    strengthLabel: { fontSize: '11px', fontWeight: '700', minWidth: '45px' },
    error: {
        marginTop: '14px', padding: '13px', borderRadius: '10px',
        background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.25)',
        color: '#fca5a5', textAlign: 'center', fontSize: '14px', fontWeight: '600', width: '100%'
    },
    successMsg: {
        marginTop: '14px', padding: '13px', borderRadius: '10px',
        background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.25)',
        color: '#86efac', textAlign: 'center', fontSize: '14px', fontWeight: '600', width: '100%'
    },
    backBtn: {
        marginTop: '24px', background: 'none', border: 'none',
        color: '#475569', fontSize: '14px', cursor: 'pointer',
        transition: '0.2s', fontWeight: '500'
    }
};