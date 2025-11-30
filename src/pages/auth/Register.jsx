import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/client';
import toast from 'react-hot-toast';

import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Logo from '../../components/shared/Logo';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        setIsLoading(true);
        try {
            await API.post('/api/register', { username, email, password, role: 'ROLE_USER' });
            toast.success('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed. Username or email may already be taken.');
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
                    <h2 className="text-2xl font-bold text-center text-secondary-900 mb-6">Create an Account</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Username"
                            id="username"
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            minLength={3}
                            maxLength={20}
                        />
                        <Input
                            label="Email"
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        <div>
                            <Input
                                label="Password"
                                id="password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <p className="text-xs text-secondary-500 mt-1">
                                Must be at least 8 characters with uppercase, lowercase, and number.
                            </p>
                        </div>
                        <Input
                            label="Confirm Password"
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                        />
                        <Button type="submit" className="w-full py-3" disabled={isLoading}>
                            {isLoading ? <Spinner size="sm" color="white" /> : 'Register'}
                        </Button>
                    </form>
                    <p className="text-center text-sm text-secondary-600 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary-600 hover:underline">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;