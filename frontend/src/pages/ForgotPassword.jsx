import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import { useToast } from '../components/Toast';
import Button from '../components/Button';
import { FiMail, FiArrowLeft, FiSend, FiCheckCircle } from 'react-icons/fi';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const { showToast, ToastContainer } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await authService.forgotPassword(email);
            setSent(true);
            showToast('Recovery email has been sent!', 'success');
        } catch (error) {
            showToast(
                error.response?.data?.message || 'Failed to send recovery email. Please check the address.',
                'error'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-md" style={{ background: 'var(--gradient-purple)' }}>
            <ToastContainer />

            <div className="card-glass max-w-md w-full animate-fadeIn">
                {!sent ? (
                    <>
                        <div className="text-center mb-xl">
                            <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-md shadow-lg">
                                <FiMail className="text-white text-3xl" />
                            </div>
                            <h1 className="text-3xl font-bold mb-sm">Recover Account</h1>
                            <p className="text-secondary">Enter your email and we'll send a recovery link</p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
                            <div className="form-group">
                                <label className="form-label">
                                    <FiMail className="inline mr-2" />
                                    Account Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input"
                                    placeholder="Enter your registered email"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? 'Sending Request...' : 'Send Recovery Link'}
                            </Button>

                            <div className="text-center mt-md">
                                <Link to="/login" className="text-primary-600 font-semibold hover:underline flex items-center justify-center gap-xs">
                                    <FiArrowLeft /> Back to Login
                                </Link>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-xl">
                        <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-lg text-white">
                            <FiCheckCircle size={40} />
                        </div>
                        <h2 className="text-2xl font-bold mb-md">Email Sent</h2>
                        <p className="text-secondary mb-xl">
                            We have sent a password recovery link to:<br />
                            <strong>{email}</strong>
                        </p>
                        <Link to="/login">
                            <Button variant="outline" className="w-full">
                                Return to Sign In
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
