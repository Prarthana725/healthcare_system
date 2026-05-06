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
        <div style={{ padding: '50px' }}>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Username"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />

                <button type="submit">Login</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default Login;