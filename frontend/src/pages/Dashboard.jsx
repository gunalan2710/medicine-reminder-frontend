import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import reportService from '../services/reportService';
import doseService from '../services/doseService';
import { useToast } from '../components/Toast';
import DoseCard from '../components/DoseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import { FiPackage, FiCheckCircle, FiXCircle, FiClock, FiPlus } from 'react-icons/fi';

const Dashboard = () => {
    const { user } = useAuth();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showToast, ToastContainer } = useToast();

    useEffect(() => {
        fetchTodayReport();
    }, []);

    const fetchTodayReport = async () => {
        try {
            const response = await reportService.getTodayReport();
            if (response.success) {
                setReport(response.data);
            }
        } catch (error) {
            console.error('Failed to load report:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkTaken = async (doseLogId) => {
        try {
            await doseService.markTaken(doseLogId);
            showToast('Dose marked as taken!', 'success');
            fetchTodayReport();
        } catch (error) {
            showToast('Failed to mark dose', 'error');
        }
    };

    const handleMarkMissed = async (doseLogId) => {
        try {
            await doseService.markMissed(doseLogId);
            showToast('Dose marked as missed', 'warning');
            fetchTodayReport();
        } catch (error) {
            showToast('Failed to mark dose', 'error');
        }
    };

    const handleSnooze = async (doseLogId) => {
        try {
            await doseService.snooze(doseLogId);
            showToast('Dose snoozed', 'info');
            fetchTodayReport();
        } catch (error) {
            showToast('Failed to snooze dose', 'error');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 70px)' }}>
                <LoadingSpinner />
            </div>
        );
    }

    const stats = [
        {
            icon: FiPackage,
            label: 'Total Doses',
            value: report?.totalDoses || 0,
            color: 'bg-info',
        },
        {
            icon: FiCheckCircle,
            label: 'Taken',
            value: report?.takenDoses || 0,
            color: 'bg-success',
        },
        {
            icon: FiXCircle,
            label: 'Missed',
            value: report?.missedDoses || 0,
            color: 'bg-danger',
        },
        {
            icon: FiClock,
            label: 'Pending',
            value: report?.pendingDoses || 0,
            color: 'bg-warning',
        },
    ];

    const adherenceRate = report?.totalDoses > 0
        ? ((report?.takenDoses / report?.totalDoses) * 100).toFixed(1)
        : 0;

    return (
        <div className="container py-xl">
            <ToastContainer />

            {/* Welcome Section */}
            <div className="mb-xl">
                <h1 className="text-3xl font-bold mb-sm">
                    Welcome back, {user?.email?.split('@')[0]}! 👋
                </h1>
                <p className="text-secondary">Here's your medication overview for today</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg mb-xl">
                {stats.map((stat, index) => (
                    <div key={index} className="card-glass">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-secondary text-sm mb-sm">{stat.label}</p>
                                <p className="text-3xl font-bold">{stat.value}</p>
                            </div>
                            <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center`}>
                                <stat.icon className="text-white text-2xl" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Adherence Rate */}
            <div className="card-glass mb-xl">
                <h3 className="text-xl font-bold mb-md">Today's Adherence Rate</h3>
                <div className="flex items-center gap-lg">
                    <div className="flex-1">
                        <div className="h-4 bg-tertiary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-success transition-all duration-500"
                                style={{ width: `${adherenceRate}%` }}
                            ></div>
                        </div>
                    </div>
                    <span className="text-2xl font-bold text-primary-600">{adherenceRate}%</span>
                </div>
            </div>

            {/* Today's Doses */}
            <div className="flex justify-between items-center mb-lg">
                <h2 className="text-2xl font-bold">Today's Doses</h2>
                <Link to="/medicines">
                    <Button variant="outline">
                        <FiPlus />
                        Add Medicine
                    </Button>
                </Link>
            </div>

            {report?.doses && report.doses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
                    {report.doses.map((dose) => (
                        <DoseCard
                            key={dose.id}
                            dose={dose}
                            onMarkTaken={handleMarkTaken}
                            onMarkMissed={handleMarkMissed}
                            onSnooze={handleSnooze}
                        />
                    ))}
                </div>
            ) : (
                <div className="card-glass text-center py-3xl">
                    <div className="text-6xl mb-md">📅</div>
                    <h3 className="text-2xl font-bold mb-md">No doses scheduled for today</h3>
                    <p className="text-secondary mb-lg">Add medicines to start tracking your doses</p>
                    <Link to="/add-medicine">
                        <Button variant="primary">
                            <FiPlus />
                            Add Your First Medicine
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
