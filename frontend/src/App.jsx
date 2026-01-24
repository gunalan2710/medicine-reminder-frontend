import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Medicines from './pages/Medicines';
import AddMedicine from './pages/AddMedicine';
import Reports from './pages/Reports';
import CaregiverDashboard from './pages/CaregiverDashboard';
import Settings from './pages/Settings';
import EditMedicine from './pages/EditMedicine';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AlarmManager from './components/AlarmManager';

const AppContent = () => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            <AlarmManager />
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute requiredRole="PATIENT">
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/medicines"
                    element={
                        <ProtectedRoute requiredRole="PATIENT">
                            <Medicines />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/add-medicine"
                    element={
                        <ProtectedRoute requiredRole="PATIENT">
                            <AddMedicine />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/edit-medicine/:id"
                    element={
                        <ProtectedRoute requiredRole="PATIENT">
                            <EditMedicine />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/reports"
                    element={
                        <ProtectedRoute requiredRole="PATIENT">
                            <Reports />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/caregiver"
                    element={
                        <ProtectedRoute requiredRole="CAREGIVER">
                            <CaregiverDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    }
                />

                {/* Default Route */}
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            user?.role === 'CAREGIVER' ? (
                                <Navigate to="/caregiver" replace />
                            ) : (
                                <Navigate to="/dashboard" replace />
                            )
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="*"
                    element={
                        isAuthenticated ? (
                            user?.role === 'CAREGIVER' ? (
                                <Navigate to="/caregiver" replace />
                            ) : (
                                <Navigate to="/dashboard" replace />
                            )
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
            </Routes>
        </div>
    );
};

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <AppContent />
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
