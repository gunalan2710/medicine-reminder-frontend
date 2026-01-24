import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon, FiLogOut, FiUser, FiUsers, FiBarChart2, FiHome, FiPackage, FiSettings } from 'react-icons/fi';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { toggleTheme, isDark } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white border-b border-color shadow-sm sticky top-0 z-40">
            <div className="container">
                <div className="flex items-center justify-between" style={{ height: '70px' }}>
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-md">
                        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <FiPackage className="text-white text-xl" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                            MediRemind
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    {isAuthenticated && (
                        <div className="flex items-center gap-lg">
                            <Link
                                to={user?.role === 'CAREGIVER' ? "/caregiver" : "/dashboard"}
                                className={`flex items-center gap-sm px-md py-sm rounded-lg transition-all ${(user?.role === 'CAREGIVER' ? isActive('/caregiver') : isActive('/dashboard'))
                                    ? 'bg-primary-100 text-primary-700'
                                    : 'text-secondary hover:bg-tertiary'
                                    }`}
                            >
                                <FiHome />
                                <span className="font-medium">Dashboard</span>
                            </Link>

                            {user?.role !== 'CAREGIVER' && (
                                <Link
                                    to="/medicines"
                                    className={`flex items-center gap-sm px-md py-sm rounded-lg transition-all ${isActive('/medicines')
                                        ? 'bg-primary-100 text-primary-700'
                                        : 'text-secondary hover:bg-tertiary'
                                        }`}
                                >
                                    <FiPackage />
                                    <span className="font-medium">Medicines</span>
                                </Link>
                            )}

                            {user?.role === 'CAREGIVER' && (
                                <Link
                                    to="/caregiver"
                                    className={`flex items-center gap-sm px-md py-sm rounded-lg transition-all ${isActive('/caregiver')
                                        ? 'bg-primary-100 text-primary-700'
                                        : 'text-secondary hover:bg-tertiary'
                                        }`}
                                >
                                    <FiUsers />
                                    <span className="font-medium">Patients</span>
                                </Link>
                            )}

                            {user?.role !== 'CAREGIVER' && (
                                <Link
                                    to="/reports"
                                    className={`flex items-center gap-sm px-md py-sm rounded-lg transition-all ${isActive('/reports')
                                        ? 'bg-primary-100 text-primary-700'
                                        : 'text-secondary hover:bg-tertiary'
                                        }`}
                                >
                                    <FiBarChart2 />
                                    <span className="font-medium">Reports</span>
                                </Link>
                            )}

                            <Link
                                to="/settings"
                                className={`flex items-center gap-sm px-md py-sm rounded-lg transition-all ${isActive('/settings')
                                    ? 'bg-primary-100 text-primary-700'
                                    : 'text-secondary hover:bg-tertiary'
                                    }`}
                            >
                                <FiSettings />
                                <span className="font-medium">Settings</span>
                            </Link>
                        </div>
                    )}

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-md">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-sm rounded-lg hover:bg-tertiary transition-all"
                            aria-label="Toggle theme"
                        >
                            {isDark ? (
                                <FiSun className="text-xl text-yellow-400" />
                            ) : (
                                <FiMoon className="text-xl text-primary-600" />
                            )}
                        </button>

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <div className="flex items-center gap-md">
                                <div className="flex items-center gap-sm px-md py-sm bg-tertiary rounded-lg">
                                    <FiUser className="text-primary-600" />
                                    <span className="font-medium text-sm text-secondary">{user?.email}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-outline btn-sm"
                                >
                                    <FiLogOut />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-sm">
                                <Link to="/login" className="btn btn-outline btn-sm">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-primary btn-sm">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

