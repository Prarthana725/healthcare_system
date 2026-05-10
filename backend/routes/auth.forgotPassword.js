const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const { getConnection } = require('../db/sqlConnection'); // Using your SQL connection

// Temporary OTP store
const otpStore = {};

// Configure your email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ── STEP 1: Send OTP ──
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const pool = await getConnection();
        
        // SQL query instead of MongoDB findOne
        const userRes = await pool.request()
            .input('email', email)
            .query('SELECT * FROM users WHERE email = @email');

        if (userRes.recordset.length === 0) {
            return res.status(404).json({ error: 'No account found with this email.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };

        await transporter.sendMail({
            from: `"Integrated Hospital" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your Password Reset OTP',
            html: `
                <div style="font-family:Inter,sans-serif;max-width:480px;margin:auto;background:#031e1e;color:#fff;border-radius:16px;padding:36px;border:1px solid rgba(45,212,191,0.2)">
                    <h2 style="color:#2dd4bf;margin-bottom:8px">Password Reset OTP</h2>
                    <p style="color:#94a3b8;margin-bottom:24px">Use the OTP below to reset your password. It expires in <strong style="color:#fff">10 minutes</strong>.</p>
                    <div style="background:rgba(20,184,166,0.1);border:1px solid rgba(45,212,191,0.3);border-radius:12px;padding:24px;text-align:center;letter-spacing:12px;font-size:36px;font-weight:800;color:#2dd4bf">
                        ${otp}
                    </div>
                </div>
            `
        });

        res.json({ message: 'OTP sent successfully.' });
    } catch (err) {
        console.error("SQL Error:", err);
        res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
    }
});

// ── STEP 2: Verify OTP ──
router.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    const record = otpStore[email];
    if (!record) return res.status(400).json({ error: 'OTP not found.' });
    if (Date.now() > record.expiresAt) {
        delete otpStore[email];
        return res.status(400).json({ error: 'OTP has expired.' });
    }
    if (record.otp !== otp) return res.status(400).json({ error: 'Invalid OTP.' });
    res.json({ message: 'OTP verified.' });
});

// ── STEP 3: Reset Password ──
router.post('/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const record = otpStore[email];
    if (!record || record.otp !== otp) return res.status(400).json({ error: 'Invalid or expired OTP.' });

    try {
        const hashed = await bcrypt.hash(newPassword, 10);
        const pool = await getConnection();
        
        // SQL update instead of MongoDB findOneAndUpdate
        await pool.request()
            .input('email', email)
            .input('password', hashed)
            .query('UPDATE users SET password = @password WHERE email = @email');

        delete otpStore[email];
        res.json({ message: 'Password reset successfully.' });
    } catch (err) {
        console.error("SQL Reset Error:", err);
        res.status(500).json({ error: 'Failed to reset password.' });
    }
});

module.exports = router;