// ========== FILE: src/pages/admin/ManageCoupons.jsx ==========
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '@/api/client';
import toast from 'react-hot-toast';

import PageHeader from '@/components/shared/PageHeader';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Modal from '@/components/ui/Modal';
import { formatCurrency } from '@/utils/formatCurrency';

const ManageCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [couponToArchive, setCouponToArchive] = useState(null);
    const navigate = useNavigate();

    const fetchCoupons = async () => {
        setIsLoading(true);
        try {
            const response = await API.get('/api/admin/coupons');
            setCoupons(response.data);
        } catch (error) {
            toast.error('Failed to fetch coupons.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleArchiveClick = (coupon) => {
        setCouponToArchive(coupon);
    };

    const handleConfirmArchive = async () => {
        if (couponToArchive) {
            try {
                // FIX: Use PUT to an /archive endpoint for soft-deletes
                await API.put(`/api/admin/coupons/${couponToArchive.id}/archive`);
                toast.success(`Coupon "${couponToArchive.code}" status updated.`);
                fetchCoupons(); // Re-fetch to show updated status
            } catch (error) {
                toast.error('Failed to update coupon status.');
            } finally {
                setCouponToArchive(null);
            }
        }
    };

    const formatDiscount = (type, value) => {
        return type === 'PERCENTAGE' ? `${value}%` : formatCurrency(value);
    };

    const archiveModalActionText = couponToArchive?.archived ? 'Unarchive' : 'Archive';

    return (
        <div>
            <PageHeader title="Manage Coupons">
                <Button onClick={() => navigate('/admin/coupons/new')}>
                    <i className="bi bi-plus-lg mr-2"></i>Create New Coupon
                </Button>
            </PageHeader>

            {isLoading ? (
                <div className="flex justify-center"><Spinner size="lg" /></div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <table className="min-w-full divide-y divide-secondary-200">
                        <thead className="bg-secondary-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Value</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Expiry Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-200">
                            {coupons.map((coupon) => (
                                <tr key={coupon.id} className={`transition-colors ${coupon.archived ? 'bg-secondary-50 text-secondary-500' : 'hover:bg-secondary-50'}`}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-primary-600">{coupon.code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{coupon.discountType}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">{formatDiscount(coupon.discountType, coupon.discountValue)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'No Expiry'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${coupon.archived ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                            {coupon.archived ? 'Archived' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                        <Button variant={coupon.archived ? "secondary" : "danger"} size="sm" onClick={() => handleArchiveClick(coupon)}>
                                            {coupon.archived ? 'Unarchive' : 'Archive'}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal isOpen={!!couponToArchive} onClose={() => setCouponToArchive(null)} title={`${archiveModalActionText} Coupon`}>
                <p>Are you sure you want to {archiveModalActionText.toLowerCase()} the coupon "<strong>{couponToArchive?.code}</strong>"?</p>
                <div className="flex justify-end gap-4 mt-6">
                    <Button variant="secondary" onClick={() => setCouponToArchive(null)}>Cancel</Button>
                    <Button variant={couponToArchive?.archived ? 'primary' : 'danger'} onClick={handleConfirmArchive}>
                        {archiveModalActionText}
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default ManageCoupons;