import React, { useState, useEffect } from 'react';
import caregiverService from '../services/caregiverService';
import { useToast } from '../components/Toast';
import Button from '../components/Button';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiUserPlus, FiUsers, FiMail, FiClock, FiTrash2, FiEdit2, FiCheckCircle, FiAlertCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const CaregiverDashboard = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [patientEmail, setPatientEmail] = useState('');
    const [sendingReminder, setSendingReminder] = useState({}); // Tracking which patient is being reminded
    const [expandedPatients, setExpandedPatients] = useState({});
    const { showToast, ToastContainer } = useToast();

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await caregiverService.getSummary();
            if (response.success) {
                setPatients(response.data || []);
            }
        } catch (error) {
            showToast('Failed to load patients', 'error');
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (patientId) => {
        setExpandedPatients(prev => ({
            ...prev,
            [patientId]: !prev[patientId]
        }));
    };

    const handleTriggerReminder = async (patientId, doseLogId = 0) => {
        setSendingReminder(prev => ({ ...prev, [patientId]: true }));
        try {
            await caregiverService.triggerReminder(patientId, doseLogId);
            showToast('Reminder sent successfully!', 'success');
            // Visual feedback: brief delay before clearing "sending" state
            setTimeout(() => {
                setSendingReminder(prev => ({ ...prev, [patientId]: 'sent' }));
                setTimeout(() => {
                    setSendingReminder(prev => ({ ...prev, [patientId]: false }));
                }, 3000);
            }, 500);
        } catch (error) {
            showToast('Failed to send reminder', 'error');
            setSendingReminder(prev => ({ ...prev, [patientId]: false }));
        }
    };

    const handleRemovePatient = async (patientId, patientName) => {
        if (!window.confirm(`Are you sure you want to remove ${patientName} from your list?`)) {
            return;
        }

        try {
            await caregiverService.removePatient(patientId);
            showToast('Patient removed successfully', 'success');
            fetchPatients();
        } catch (error) {
            showToast('Failed to remove patient', 'error');
        }
    };

    const handleAddPatient = async (e) => {
        e.preventDefault();
        try {
            await caregiverService.addPatient(patientEmail);
            showToast('Patient added successfully!', 'success');
            setPatientEmail('');
            setShowAddModal(false);
            fetchPatients();
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to add patient', 'error');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="container py-xl animate-fadeIn">
            <ToastContainer />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md mb-xl">
                <div>
                    <h1 className="text-4xl font-black tracking-tight flex items-center gap-md">
                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
                            <FiUsers />
                        </div>
                        Care Overview
                    </h1>
                    <p className="text-secondary font-medium mt-sm">Real-time monitoring of linked patient schedules</p>
                </div>
                <Button variant="primary" size="lg" onClick={() => setShowAddModal(true)} className="shadow-lg h-14">
                    <FiUserPlus />
                    Link New Patient
                </Button>
            </div>

            {patients.length === 0 ? (
                <div className="card-glass text-center py-4xl border-dashed border-2">
                    <div className="text-8xl mb-md grayscale opacity-30">🤝</div>
                    <h3 className="text-3xl font-black mb-md text-slate-400">Collaborative Care</h3>
                    <p className="text-secondary mb-xl max-w-sm mx-auto">Assist family members or patients by monitoring their medication intervals and sending reminders.</p>
                    <Button variant="primary" onClick={() => setShowAddModal(true)}>
                        <FiUserPlus />
                        Start by Adding a Patient
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-xl">
                    {patients.map((patient) => (
                        <div key={patient.id} className="card-glass overflow-hidden border-l-8 border-primary-600">
                            <div className="flex justify-between items-start mb-xl">
                                <div className="flex items-center gap-lg">
                                    <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg text-white font-black text-2xl uppercase">
                                        {patient.name[0]}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black flex items-center gap-sm">
                                            {patient.name}
                                            {patient.pendingToday > 0 && (
                                                <span className="badge badge-warning text-[10px] py-1">Action Needed</span>
                                            )}
                                        </h3>
                                        <p className="text-secondary font-bold flex items-center gap-xs">
                                            <FiMail size={16} className="text-indigo-400" />
                                            {patient.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-sm">
                                    <button
                                        onClick={() => handleRemovePatient(patient.id, patient.name)}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                        title="Remove Patient Mapping"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>

                            {/* Summary Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-lg mb-xl">
                                <div className="p-xl bg-tertiary/40 rounded-3xl border border-color text-center hover:scale-[1.02] transition-transform">
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-xs">Today's Progress</p>
                                    <p className="text-4xl font-black text-primary-600">{Math.round(((patient.takenToday) / (patient.takenToday + patient.missedToday + patient.pendingToday) * 100) || 0)}%</p>
                                </div>
                                <div className="p-xl bg-success/5 rounded-3xl border border-success/20 text-center hover:scale-[1.02] transition-transform">
                                    <p className="text-success/60 text-[10px] font-black uppercase tracking-widest mb-xs">Confirmed</p>
                                    <p className="text-4xl font-black text-success">{patient.takenToday}</p>
                                </div>
                                <div className="p-xl bg-red-50 rounded-3xl border border-red-100 text-center hover:scale-[1.02] transition-transform">
                                    <p className="text-red-400 text-[10px] font-black uppercase tracking-widest mb-xs">Missed</p>
                                    <p className="text-4xl font-black text-danger">{patient.missedToday}</p>
                                </div>
                                <div className="p-xl bg-amber-50 rounded-3xl border border-amber-100 text-center hover:scale-[1.02] transition-transform relative">
                                    <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-xs">Remaining</p>
                                    <p className="text-4xl font-black text-warning">{patient.pendingToday}</p>
                                </div>
                            </div>

                            {/* Medications List */}
                            <div className="bg-slate-50/50 rounded-3xl border border-color p-md">
                                <button
                                    onClick={() => toggleExpand(patient.id)}
                                    className="w-full flex justify-between items-center px-md py-sm hover:bg-white/50 rounded-xl transition-all"
                                >
                                    <span className="font-black text-slate-500 uppercase text-xs tracking-widest">Active Schedule Records</span>
                                    {expandedPatients[patient.id] ? <FiChevronUp /> : <FiChevronDown />}
                                </button>

                                {expandedPatients[patient.id] && (
                                    <div className="mt-md space-y-md animate-fadeIn">
                                        {patient.todaysDoses && patient.todaysDoses.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-md p-sm">
                                                {patient.todaysDoses.map((dose, idx) => (
                                                    <div key={idx} className="flex justify-between items-center bg-white border border-color p-md rounded-2xl shadow-sm">
                                                        <div>
                                                            <p className="font-bold text-slate-700">{dose.medicineName}</p>
                                                            <p className="text-xs text-secondary flex items-center gap-xs">
                                                                <FiClock size={12} /> {dose.scheduledTime} • {dose.dosage}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            {dose.status === 'TAKEN' ? (
                                                                <FiCheckCircle className="text-success text-xl" />
                                                            ) : dose.status === 'MISSED' ? (
                                                                <FiAlertCircle className="text-danger text-xl" />
                                                            ) : (
                                                                <span className="badge badge-warning text-[8px] px-2">PENDING</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-center py-md text-slate-400 italic text-sm">No medication records found for today.</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="mt-xl">
                                <Button
                                    variant={sendingReminder[patient.id] === 'sent' ? 'success' : 'outline'}
                                    className={`w-full h-16 shadow-md transition-all ${sendingReminder[patient.id] === true ? 'animate-pulse' : ''}`}
                                    onClick={() => handleTriggerReminder(patient.id)}
                                    disabled={patient.pendingToday === 0 || sendingReminder[patient.id] === true}
                                >
                                    {sendingReminder[patient.id] === true ? (
                                        <>Dispatching Reminder...</>
                                    ) : sendingReminder[patient.id] === 'sent' ? (
                                        <><FiCheckCircle className="scale-125" /> Reminder Transmitted</>
                                    ) : (
                                        <><FiClock /> Urgent Manual Reminder</>
                                    )}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Establish Patient Connection"
            >
                <form onSubmit={handleAddPatient} className="flex flex-col gap-lg">
                    <div className="p-xl bg-indigo-50/50 rounded-2xl border border-indigo-100 mb-md">
                        <p className="text-sm text-indigo-700 font-medium">To monitor a patient, they must already have an account. Enter their registered email address below to send a linkage request.</p>
                    </div>
                    <div className="form-group">
                        <label className="form-label uppercase text-[10px] tracking-widest text-slate-400">Patient Identifier (Email)</label>
                        <input
                            type="email"
                            value={patientEmail}
                            onChange={(e) => setPatientEmail(e.target.value)}
                            className="form-input text-lg font-bold"
                            placeholder="patient@domain.com"
                            required
                        />
                    </div>
                    <div className="flex gap-md mt-lg">
                        <Button type="submit" variant="primary" className="flex-1 h-14 shadow-lg">
                            <FiUserPlus /> Link Patient
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                            Abort
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default CaregiverDashboard;
