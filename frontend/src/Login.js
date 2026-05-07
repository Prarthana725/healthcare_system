import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

function Login() {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
                return;
            }

            // save user
            localStorage.setItem('user', JSON.stringify(data.user));

            // ROLE REDIRECT SYSTEM
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
                    navigate('/dashboard');
            }

        } catch {
            setError('Login failed');
        }
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background:
                    'linear-gradient(135deg, #e0f7fa 0%, #f1f5f9 50%, #dbeafe 100%)',
                fontFamily: "'Segoe UI', sans-serif",
                padding: '20px'
            }}
        >
            <div
                style={{
                    width: '420px',
                    background: '#ffffff',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.12)'
                }}
            >
                {/* TOP HEADER */}
                <div
                    style={{
                        background:
                            'linear-gradient(to right, #0f766e, #0ea5e9)',
                        padding: '35px 30px',
                        color: 'white',
                        textAlign: 'center'
                    }}
                >
                    <div
                        style={{
                            fontSize: '50px',
                            marginBottom: '10px'
                        }}
                    >
                        🏥
                    </div>

                    <h1
                        style={{
                            margin: 0,
                            fontSize: '28px',
                            fontWeight: '700'
                        }}
                    >
                        Healthcare System
                    </h1>

                    <p
                        style={{
                            marginTop: '10px',
                            opacity: 0.9,
                            fontSize: '15px'
                        }}
                    >
                        Secure Hospital Management Portal
                    </p>
                </div>

                {/* FORM AREA */}
                <div style={{ padding: '35px 30px' }}>
                    <h2
                        style={{
                            textAlign: 'center',
                            marginBottom: '25px',
                            color: '#0f172a',
                            fontSize: '24px'
                        }}
                    >
                        Sign In
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px'
                        }}
                    >
                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    color: '#334155',
                                    fontWeight: '600'
                                }}
                            >
                                Username
                            </label>

                            <input
                                placeholder="Enter your username"
                                value={form.username}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        username: e.target.value
                                    })
                                }
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    borderRadius: '12px',
                                    border: '1px solid #cbd5e1',
                                    fontSize: '15px',
                                    background: '#f8fafc',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    color: '#334155',
                                    fontWeight: '600'
                                }}
                            >
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        password: e.target.value
                                    })
                                }
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    borderRadius: '12px',
                                    border: '1px solid #cbd5e1',
                                    fontSize: '15px',
                                    background: '#f8fafc',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                marginTop: '10px',
                                padding: '15px',
                                border: 'none',
                                borderRadius: '12px',
                                background:
                                    'linear-gradient(to right, #0f766e, #0284c7)',
                                color: '#fff',
                                fontSize: '16px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: '0.3s',
                                letterSpacing: '0.5px'
                            }}
                        >
                            LOGIN TO SYSTEM
                        </button>
                    </form>

                    {error && (
                        <div
                            style={{
                                marginTop: '20px',
                                padding: '12px',
                                borderRadius: '10px',
                                background: '#fee2e2',
                                color: '#b91c1c',
                                textAlign: 'center',
                                fontWeight: '600'
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <div
                        style={{
                            marginTop: '30px',
                            textAlign: 'center',
                            color: '#64748b',
                            fontSize: '13px'
                        }}
                    >
                        © 2026 Healthcare Management System
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;