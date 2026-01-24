import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { useToast } from '../components/Toast';
import { FiUser, FiMail, FiPhone, FiBell, FiShield } from 'react-icons/fi';
import Button from '../components/Button';

const Settings = () => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        role: '',
        emailNotificationsEnabled: true,
        smsNotificationsEnabled: false
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { showToast, ToastContainer } = useToast();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await userService.getProfile();
            if (response.success) {
                setProfile(response.data);
            }
        } catch (error) {
            showToast('Failed to load profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await userService.updateProfile(profile);
            if (response.success) {
                showToast('Profile updated successfully', 'success');
                setProfile(response.data);
            }
        } catch (error) {
            showToast('Failed to update profile', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 70px)' }}>
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="container py-xl">
            <ToastContainer />
            <h1 className="text-3xl font-bold mb-xl">Account Settings</h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
                {/* Personal Information */}
                <div className="card-glass">
                    <h2 className="text-xl font-bold mb-lg flex items-center gap-md text-primary-700">
                        <FiUser /> Personal Information
                    </h2>
                    <div className="space-y-md">
                        <div className="form-group text-left">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-group text-left">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                value={profile.email}
                                className="form-input bg-tertiary"
                                disabled
                            />
                        </div>
                        <div className="form-group text-left">
                            <label className="form-label">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={profile.phone || ''}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="+1234567890"
                            />
                        </div>
                    </div>
                </div>

                {/* Preferences */}
                <div className="space-y-xl">
                    <div className="card-glass">
                        <h2 className="text-xl font-bold mb-lg flex items-center gap-md text-primary-700">
                            <FiBell /> Notification Preferences
                        </h2>
                        <div className="space-y-lg">
                            <label className="flex items-center justify-between cursor-pointer">
                                <div>
                                    <p className="font-bold">Email Notifications</p>
                                    <p className="text-sm text-secondary">Receive daily dose summaries</p>
                                </div>
                                <input
                                    type="checkbox"
                                    name="emailNotificationsEnabled"
                                    checked={profile.emailNotificationsEnabled}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-primary-600"
                                />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                                <div>
                                    <p className="font-bold">SMS Notifications</p>
                                    <p className="text-sm text-secondary">Get instant alerts on your phone</p>
                                </div>
                                <input
                                    type="checkbox"
                                    name="smsNotificationsEnabled"
                                    checked={profile.smsNotificationsEnabled}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-primary-600"
                                />
                            </label>
                        </div>
                    </div>

                    <div className="card-glass bg-tertiary">
                        <h2 className="text-xl font-bold mb-md flex items-center gap-md">
                            <FiShield /> Account Security
                        </h2>
                        <p className="text-secondary mb-lg">Your role is set to <strong>{profile.role}</strong>.</p>
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save All Changes'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Settings;
