import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import medicineService from '../services/medicineService';
import { useToast } from '../components/Toast';
import MedicineCard from '../components/MedicineCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import { FiPlus } from 'react-icons/fi';

const Medicines = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast, ToastContainer } = useToast();

    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        try {
            const response = await medicineService.getMyMedicines();
            if (response.success) {
                setMedicines(response.data || []);
            }
        } catch (error) {
            showToast('Failed to load medicines', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (medicineId) => {
        if (!window.confirm('Are you sure you want to delete this medicine?')) {
            return;
        }

        try {
            await medicineService.deleteMedicine(medicineId);
            showToast('Medicine deleted successfully', 'success');
            fetchMedicines();
        } catch (error) {
            showToast('Failed to delete medicine', 'error');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 70px)' }}>
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="container py-xl">
            <ToastContainer />

            <div className="flex justify-between items-center mb-xl">
                <div>
                    <h1 className="text-3xl font-bold mb-sm">My Medicines</h1>
                    <p className="text-secondary">Manage your medication schedule</p>
                </div>
                <Link to="/add-medicine">
                    <Button variant="primary">
                        <FiPlus />
                        Add Medicine
                    </Button>
                </Link>
            </div>

            {medicines.length === 0 ? (
                <div className="card-glass text-center py-3xl">
                    <div className="text-6xl mb-md">💊</div>
                    <h3 className="text-2xl font-bold mb-md">No medicines yet</h3>
                    <p className="text-secondary mb-lg">Start by adding your first medicine</p>
                    <Link to="/add-medicine">
                        <Button variant="primary">
                            <FiPlus />
                            Add Your First Medicine
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
                    {medicines.map((medicine) => (
                        <MedicineCard
                            key={medicine.id}
                            medicine={medicine}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Medicines;
