import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/client';
import toast from 'react-hot-toast';

import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Spinner from '../../components/ui/Spinner';

const CouponEditor = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [discountType, setDiscountType] = useState('PERCENTAGE');
    const [discountValue, setDiscountValue] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const couponData = {
            code: code.toUpperCase(),
            discountType,
            discountValue,
            expiryDate: expiryDate || null, // Send null if empty
        };

        try {
            await API.post('/api/admin/coupons', couponData);
            toast.success('Coupon created successfully!');
            navigate('/admin/coupons');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create coupon. Code may already exist.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <PageHeader title="Create New Coupon" />
            <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-8 rounded-lg shadow-md space-y-6">
                <Input label="Coupon Code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g., SUMMER25" required />
                
                <Select label="Discount Type" value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
                    <option value="PERCENTAGE">Percentage</option>
                    <option value="FIXED_AMOUNT">Fixed Amount (EGP)</option>
                </Select>

                <Input label="Discount Value" type="number" step="0.01" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} placeholder={discountType === 'PERCENTAGE' ? 'e.g., 10 for 10%' : 'e.g., 50 for 50 EGP'} required />
                
                <Input label="Expiry Date (Optional)" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />

                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="secondary" onClick={() => navigate('/admin/coupons')}>Cancel</Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? <Spinner size="sm" color="white" /> : 'Save Coupon'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CouponEditor;