import React from 'react';
import { FiCheck, FiX, FiClock } from 'react-icons/fi';
import Button from './Button';

const DoseCard = ({ dose, onMarkTaken, onMarkMissed, onSnooze }) => {
    const getStatusBadge = (status) => {
        const badges = {
            PENDING: <span className="badge badge-warning">Pending</span>,
            TAKEN: <span className="badge badge-success">Taken</span>,
            MISSED: <span className="badge badge-danger">Missed</span>,
        };
        return badges[status] || <span className="badge badge-info">{status}</span>;
    };

    const isPending = dose.status === 'PENDING';

    return (
        <div className="card-glass animate-fadeIn">
            <div className="flex justify-between items-start mb-md">
                <div className="flex-1">
                    <h4 className="text-lg font-bold mb-sm">{dose.medicineName}</h4>
                    <div className="flex items-center gap-md text-sm text-secondary">
                        <div className="flex items-center gap-sm">
                            <FiClock />
                            <span>{dose.scheduledTime}</span>
                        </div>
                        {getStatusBadge(dose.status)}
                    </div>
                </div>
            </div>

            {dose.dosage && (
                <p className="text-secondary mb-md text-sm">
                    <span className="font-semibold">Dosage:</span> {dose.dosage}
                </p>
            )}

            {isPending && (
                <div className="flex gap-sm mt-md">
                    <Button
                        variant="success"
                        size="sm"
                        onClick={() => onMarkTaken(dose.id)}
                        className="flex-1"
                        style={{ padding: '0.5rem' }}
                    >
                        <FiCheck />
                        Taken
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onMarkMissed(dose.id)}
                        className="flex-1"
                        style={{ padding: '0.5rem' }}
                    >
                        <FiX />
                        Missed
                    </Button>
                    <Button
                        variant="warning"
                        size="sm"
                        onClick={() => onSnooze(dose.id)}
                        className="flex-1"
                        style={{ padding: '0.5rem' }}
                    >
                        <FiClock />
                    </Button>
                </div>
            )}

            {dose.takenAt && (
                <p className="text-[0.7rem] text-secondary mt-md italic">
                    Taken at: {new Date(dose.takenAt).toLocaleString()}
                </p>
            )}
        </div>
    );
};

export default DoseCard;
