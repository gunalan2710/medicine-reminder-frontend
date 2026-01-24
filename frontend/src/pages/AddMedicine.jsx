import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import medicineService from '../services/medicineService';
import { useToast } from '../components/Toast';
import Button from '../components/Button';
import { FiPlus, FiX, FiArrowLeft, FiActivity, FiClock, FiCalendar, FiFileText, FiType } from 'react-icons/fi';

const AddMedicine = () => {
    const [formData, setFormData] = useState({
        name: '',
        dosage: '',
        medicineType: 'Pill',
        frequency: 'Daily',
        description: '',
        beforeFood: false,
        startDate: '',
        endDate: '',
        scheduleTimes: [''],
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { showToast, ToastContainer } = useToast();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleTimeChange = (index, value) => {
        const newTimes = [...formData.scheduleTimes];
        newTimes[index] = value;
        setFormData({ ...formData, scheduleTimes: newTimes });
    };

    const addTimeSlot = () => {
        setFormData({
            ...formData,
            scheduleTimes: [...formData.scheduleTimes, ''],
        });
    };

    const removeTimeSlot = (index) => {
        const newTimes = formData.scheduleTimes.filter((_, i) => i !== index);
        setFormData({ ...formData, scheduleTimes: newTimes });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const medicineData = {
                medicineName: formData.name,
                dosageQty: formData.dosage,
                medicineType: formData.medicineType,
                frequency: formData.frequency,
                description: formData.description,
                beforeFood: formData.beforeFood,
                startDate: formData.startDate,
                endDate: formData.endDate,
                scheduleTimes: formData.scheduleTimes.filter((time) => time.trim() !== ''),
            };

            await medicineService.addMedicine(medicineData);
            showToast('Medicine successfully added to record!', 'success');
            setTimeout(() => navigate('/medicines'), 500);
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to add medicine', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-xl animate-fadeIn">
            <ToastContainer />

            <div className="max-w-4xl mx-auto">
                {/* Visual Back Button */}
                <button
                    onClick={() => navigate('/medicines')}
                    className="group flex items-center gap-md px-lg py-sm bg-white border border-color rounded-xl text-secondary hover:text-primary-600 hover:border-primary-600 transition-all mb-xl shadow-sm"
                >
                    <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold">Return to Cabinet</span>
                </button>

                <div className="card-glass border-t-8 border-primary-600">
                    <div className="flex items-center gap-lg mb-xl">
                        <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg text-white">
                            <FiPlus size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight">New Medication</h1>
                            <p className="text-secondary font-medium">Add a new administration protocol to your profile</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-xl">
                        {/* Basic Info Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
                            <div className="form-group">
                                <label className="form-label flex items-center gap-sm">
                                    <FiType className="text-primary-600" /> Medicine Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-input text-lg"
                                    placeholder="Enter drug name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label flex items-center gap-sm">
                                    <FiActivity className="text-primary-600" /> Standard Dosage
                                </label>
                                <input
                                    type="text"
                                    name="dosage"
                                    value={formData.dosage}
                                    onChange={handleChange}
                                    className="form-input text-lg"
                                    placeholder="e.g. 500mg or 2 tablets"
                                    required
                                />
                            </div>
                        </div>

                        {/* Classification Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
                            <div className="form-group">
                                <label className="form-label">Classification Type</label>
                                <div className="grid grid-cols-3 md:grid-cols-5 gap-sm">
                                    {['Pill', 'Syrup', 'Injection', 'Capsule', 'Drops'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, medicineType: type })}
                                            className={`p-sm rounded-xl border-2 transition-all flex flex-col items-center gap-xs
                                                ${formData.medicineType === type
                                                    ? 'border-primary-600 bg-primary-100 text-primary-600'
                                                    : 'border-tertiary hover:border-primary-200 text-secondary'}`}
                                        >
                                            <span className="text-[10px] font-black uppercase tracking-tighter">{type}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Administration Frequency</label>
                                <select
                                    name="frequency"
                                    value={formData.frequency}
                                    onChange={handleChange}
                                    className="form-input h-[68px] font-bold"
                                    required
                                >
                                    <option value="Daily">Daily Routine</option>
                                    <option value="Weekly">Weekly Cycle</option>
                                    <option value="Monthly">Monthly Cycle</option>
                                </select>
                            </div>
                        </div>

                        {/* Timing Section */}
                        <div className="bg-tertiary/50 p-xl rounded-2xl border border-color">
                            <div className="flex items-center gap-sm mb-lg">
                                <FiCalendar className="text-primary-600" />
                                <h3 className="font-bold">Treatment Window</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                                <div className="form-group">
                                    <label className="form-label text-xs uppercase tracking-widest text-slate-400">Start Date</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label text-xs uppercase tracking-widest text-slate-400">End Date</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Schedule Section */}
                        <div className="form-group">
                            <label className="form-label flex items-center justify-between">
                                <div className="flex items-center gap-sm">
                                    <FiClock className="text-primary-600" /> Administration Schedule
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase">Dispatch Times</span>
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                                {formData.scheduleTimes.map((time, index) => (
                                    <div key={index} className="flex items-center gap-sm bg-white p-sm rounded-xl border border-color shadow-sm">
                                        <input
                                            type="time"
                                            value={time}
                                            onChange={(e) => handleTimeChange(index, e.target.value)}
                                            className="form-input border-none bg-transparent flex-1 focus:ring-0 p-0"
                                            required
                                        />
                                        {formData.scheduleTimes.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeTimeSlot(index)}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                                            >
                                                <FiX size={14} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addTimeSlot}
                                    className="flex items-center justify-center gap-sm p-sm rounded-xl border-2 border-dashed border-primary-200 text-primary-600 hover:bg-primary-50 transition-all font-bold text-sm"
                                >
                                    <FiPlus /> Add Time
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label flex items-center gap-sm">
                                <FiFileText className="text-primary-600" /> Clinical Notes (Optional)
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="form-input min-h-[120px] py-md"
                                placeholder="Additional instructions or purpose..."
                            />
                        </div>

                        <div className="flex items-center justify-between p-lg bg-indigo-50/30 rounded-2xl border border-indigo-100">
                            <div className="flex items-center gap-md">
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        id="beforeFood"
                                        name="beforeFood"
                                        checked={formData.beforeFood}
                                        onChange={(e) => setFormData({ ...formData, beforeFood: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                </div>
                                <label htmlFor="beforeFood" className="font-bold text-slate-700 cursor-pointer select-none">
                                    Take on empty stomach
                                </label>
                            </div>
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic">Meal Policy</span>
                        </div>

                        <div className="flex flex-col md:flex-row gap-md pt-xl border-t border-color">
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                disabled={loading}
                                className="flex-1 h-16 shadow-lg"
                            >
                                {loading ? 'Processing...' : 'Register Medication Record'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                onClick={() => navigate('/medicines')}
                                className="h-16"
                            >
                                Discard
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddMedicine;
