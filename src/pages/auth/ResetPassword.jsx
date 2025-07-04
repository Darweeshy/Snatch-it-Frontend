import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import API from '../../api/client';
import toast from 'react-hot-toast';

import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Logo from '../../components/shared/Logo';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }
        if (!token) {
            toast.error("Invalid or missing reset token.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await API.post('/api/reset-password', { token, password });
            toast.success(response.data.message);
            setMessage("You will be redirected to the login page shortly.");
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to reset password. The link may have expired.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="text-center p-10">
                <h2 className="text-2xl text-red-600">Invalid Link</h2>
                <p className="text-secondary-500 mt-2">No password reset token was found. Please request a new link.</p>
                <Link to="/forgot-password"><Button className="mt-4">Request New Link</Button></Link>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-secondary-50 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Logo />
                </div>
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-center text-secondary-900 mb-6">Reset Your Password</h2>
                    
                    {!message ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input label="New Password" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <Input label="Confirm New Password" id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                            <Button type="submit" className="w-full py-3" disabled={isLoading}>
                                {isLoading ? <Spinner size="sm" color="white" /> : 'Reset Password'}
                            </Button>
                        </form>
                    ) : (
                         <div className="text-center">
                            <p className="p-4 bg-green-50 text-green-700 rounded-md">{message}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;