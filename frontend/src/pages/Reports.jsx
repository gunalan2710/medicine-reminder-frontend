import React, { useState, useEffect } from 'react';
import reportService from '../services/reportService';
import LoadingSpinner from '../components/LoadingSpinner';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FiTrendingUp, FiActivity, FiCalendar } from 'react-icons/fi';

const Reports = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = async () => {
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

    if (loading) {
        return (
            <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 70px)' }}>
                <LoadingSpinner />
            </div>
        );
    }

    const pieData = [
        { name: 'Taken', value: report?.takenDoses || 0, color: '#10b981' },
        { name: 'Missed', value: report?.missedDoses || 0, color: '#ef4444' },
        { name: 'Pending', value: report?.pendingDoses || 0, color: '#f59e0b' },
    ];

    const barData = [
        {
            name: 'Today',
            Taken: report?.takenDoses || 0,
            Missed: report?.missedDoses || 0,
            Pending: report?.pendingDoses || 0,
        },
    ];

    const adherenceRate = report?.totalDoses > 0
        ? ((report?.takenDoses / report?.totalDoses) * 100).toFixed(1)
        : 0;

    return (
        <div className="container py-xl">
            <div className="mb-xl">
                <h1 className="text-3xl font-bold mb-sm">Reports & Analytics</h1>
                <p className="text-secondary">Track your medication adherence and patterns</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">
                <div className="card-glass">
                    <div className="flex items-center gap-md mb-md">
                        <div className="w-12 h-12 bg-gradient-success rounded-lg flex items-center justify-center">
                            <FiTrendingUp className="text-white text-xl" />
                        </div>
                        <div>
                            <p className="text-tertiary text-sm">Adherence Rate</p>
                            <p className="text-2xl font-bold">{adherenceRate}%</p>
                        </div>
                    </div>
                    <div className="h-2 bg-tertiary rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-success"
                            style={{ width: `${adherenceRate}%` }}
                        ></div>
                    </div>
                </div>

                <div className="card-glass">
                    <div className="flex items-center gap-md">
                        <div className="w-12 h-12 bg-gradient-info rounded-lg flex items-center justify-center">
                            <FiActivity className="text-white text-xl" />
                        </div>
                        <div>
                            <p className="text-tertiary text-sm">Total Doses Today</p>
                            <p className="text-2xl font-bold">{report?.totalDoses || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="card-glass">
                    <div className="flex items-center gap-md">
                        <div className="w-12 h-12 bg-gradient-purple rounded-lg flex items-center justify-center">
                            <FiCalendar className="text-white text-xl" />
                        </div>
                        <div>
                            <p className="text-tertiary text-sm">Report Date</p>
                            <p className="text-lg font-bold">{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
                {/* Pie Chart */}
                <div className="card-glass">
                    <h3 className="text-xl font-bold mb-lg">Dose Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div className="card-glass">
                    <h3 className="text-xl font-bold mb-lg">Dose Status Overview</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Taken" fill="#10b981" />
                            <Bar dataKey="Missed" fill="#ef4444" />
                            <Bar dataKey="Pending" fill="#f59e0b" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Detailed Stats */}
            <div className="card-glass mt-lg">
                <h3 className="text-xl font-bold mb-lg">Detailed Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                    <div className="text-center p-lg bg-tertiary rounded-lg">
                        <div className="text-4xl font-bold text-green-600 mb-sm">
                            {report?.takenDoses || 0}
                        </div>
                        <p className="text-secondary">Doses Taken</p>
                    </div>
                    <div className="text-center p-lg bg-tertiary rounded-lg">
                        <div className="text-4xl font-bold text-red-600 mb-sm">
                            {report?.missedDoses || 0}
                        </div>
                        <p className="text-secondary">Doses Missed</p>
                    </div>
                    <div className="text-center p-lg bg-tertiary rounded-lg">
                        <div className="text-4xl font-bold text-yellow-600 mb-sm">
                            {report?.pendingDoses || 0}
                        </div>
                        <p className="text-secondary">Doses Pending</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
