import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/client';
import toast from 'react-hot-toast';

import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Logo from '../../components/shared/Logo';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [testToken, setTestToken] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setTestToken('');
        try {
            const response = await API.post('/api/forgot-password', { email });
            setMessage(response.data.message);
            // For testing purposes, we display the token. In production, this would be emailed.
            if (response.data.token) {
                setTestToken(response.data.token);
                toast.success("Token generated for testing.");
            }
        } catch (err) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-secondary-50 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Logo />
                </div>
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-center text-secondary-900 mb-2">Forgot Password</h2>
                    <p className="text-center text-sm text-secondary-500 mb-6">Enter your email and we'll send you a reset link.</p>
                    
                    {!message ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="Email Address"
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Button type="submit" className="w-full py-3" disabled={isLoading}>
                                {isLoading ? <Spinner size="sm" color="white" /> : 'Send Reset Link'}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center">
                            <p className="p-4 bg-green-50 text-green-700 rounded-md">{message}</p>
                            {testToken && (
                                <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 rounded-md text-left">
                                    <p className="font-bold">For Testing Only:</p>
                                    <p className="text-xs break-all">Your reset token is: <strong>{testToken}</strong></p>
                                    <Link to={`/reset-password?token=${testToken}`} className="font-bold text-primary-600 hover:underline mt-2 inline-block">Click here to reset password &rarr;</Link>
                                </div>
                            )}
                        </div>
                    )}

                    <p className="text-center text-sm text-secondary-600 mt-6">
                        Remembered your password?{' '}
                        <Link to="/login" className="font-medium text-primary-600 hover:underline">Back to Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;