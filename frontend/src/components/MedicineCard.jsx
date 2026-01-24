import React from 'react';
import { FiTrash2, FiClock, FiCalendar, FiEdit2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const MedicineCard = ({ medicine, onDelete }) => {
    return (
        <div className="card-glass hover:shadow-xl transition-all animate-fadeIn">
            <div className="flex justify-between items-start mb-md">
                <div>
                    <div className="flex items-center gap-sm mb-sm">
                        <h3 className="text-xl font-bold">{medicine.name}</h3>
                        <span className="badge badge-purple text-xs">{medicine.medicineType}</span>
                    </div>
                    <p className="text-secondary text-sm">{medicine.description || 'No description'}</p>
                </div>
                <div className="flex gap-sm">
                    <Link
                        to={`/edit-medicine/${medicine.id}`}
                        className="text-primary-600 hover:text-primary-700 transition-colors p-sm rounded-lg hover:bg-primary-50"
                        title="Edit Medication"
                    >
                        <FiEdit2 className="text-xl" />
                    </Link>
                    <button
                        onClick={() => onDelete(medicine.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-sm rounded-lg hover:bg-red-50"
                        title="Delete Medication"
                    >
                        <FiTrash2 className="text-xl" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-md mb-md">
                <div className="flex items-center gap-sm">
                    <span className="badge badge-info">Dosage</span>
                    <span className="font-semibold">{medicine.dosageQty}</span>
                </div>
                <div className="flex items-center gap-sm">
                    <span className="badge badge-success">Food</span>
                    <span className="font-semibold">{medicine.beforeFood ? 'Before' : 'After'}</span>
                </div>
            </div>

            <div className="flex items-center gap-sm text-sm text-secondary mb-md">
                <FiCalendar />
                <span>
                    {new Date(medicine.startDate).toLocaleDateString()} -{' '}
                    {new Date(medicine.endDate).toLocaleDateString()}
                </span>
            </div>

            {medicine.scheduleTimes && medicine.scheduleTimes.length > 0 && (
                <div className="mt-md pt-md border-t border-color">
                    <div className="flex items-center gap-sm mb-sm">
                        <FiClock className="text-primary-600" />
                        <span className="font-semibold text-sm">Schedule Times:</span>
                    </div>
                    <div className="flex flex-wrap gap-sm">
                        {medicine.scheduleTimes.map((time, index) => (
                            <span key={index} className="badge badge-success">
                                {time.time}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicineCard;
