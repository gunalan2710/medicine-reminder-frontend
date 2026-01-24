import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../services/authService';
import { useToast } from '../components/Toast';
import Button from '../components/Button';
import { FiLock, FiCheck, FiAlertCircle } from 'react-icons/fi';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const { showToast, ToastContainer } = useToast();

    const [passwords, setPasswords] = useState({
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (passwords.password !== passwords.confirmPassword) {
            return showToast('Passwords do not match', 'error');
        }

        setLoading(true);
        try {
            await authService.resetPassword(token, passwords.password);
            showToast('Password reset successful! Please login.', 'success');
            setTimeout(() => navigate('/login'), 1500);
        } catch (error) {
            showToast(
                error.response?.data?.message || 'Invalid or expired reset link. Please try again.',
                'error'
            );
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center p-md bg-medical">
                <div className="card-glass max-w-md w-full text-center">
                    <FiAlertCircle className="text-danger text-5xl mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-4">Invalid Link</h2>
                    <p className="text-secondary mb-6">This password reset link is invalid or has expired.</p>
                    <Button variant="primary" onClick={() => navigate('/forgot-password')}>
                        Request New Link
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-medical relative overflow-hidden"
            style={{ backgroundImage: `url('/medicine_hero_bg.png')`, backgroundSize: 'cover' }}>
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]"></div>
            <ToastContainer />

            <div className="card-glass max-w-lg w-full z-10 animate-fade-in mx-4">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-primary/20">
                        <FiLock className="text-primary text-4xl" />
                    </div>
                    <h1 className="text-3xl font-bold mb-3 tracking-tight text-primary">Reset Password</h1>
                    <p className="text-secondary font-medium">Create a strong new password for your account</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="form-group">
                        <label className="form-label">New Password</label>
                        <input
                            type="password"
                            value={passwords.password}
                            onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
                            className="form-input"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm New Password</label>
                        <input
                            type="password"
                            value={passwords.confirmPassword}
                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                            className="form-input"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={loading}
                        className="w-full shadow-lg h-14"
                    >
                        {loading ? 'Updating Password...' : 'Save New Password'}
                        {!loading && <FiCheck />}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
