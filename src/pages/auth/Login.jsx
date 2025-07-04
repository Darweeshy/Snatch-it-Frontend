import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Logo from '../../components/shared/Logo';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await API.post('/api/login', { username, password });
            const { token, role } = response.data;
            
            login(token);
            toast.success('Logged in successfully!');

            if (role === 'ROLE_ADMIN') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to login. Please check your credentials.');
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
                    <h2 className="text-2xl font-bold text-center text-secondary-900 mb-6">Sign In</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input 
                            label="Username" 
                            id="username" 
                            type="text" 
                            value={username} 
                            onChange={e => setUsername(e.target.value)} 
                            required
                        />
                        <div>
                            {/* --- START OF CHANGE --- */}
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-1">Password</label>
                                <Link to="/forgot-password" tabIndex={-1} className="text-sm font-medium text-primary-600 hover:underline">
                                    Forgot Password?
                                </Link>
                            </div>
                            {/* --- END OF CHANGE --- */}
                            <Input
                                id="password" 
                                type="password" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                required
                                className="mt-1"
                            />
                        </div>
                        <Button type="submit" className="w-full py-3" disabled={isLoading}>
                            {isLoading ? <Spinner size="sm" color="white" /> : 'Login'}
                        </Button>
                    </form>
                    <p className="text-center text-sm text-secondary-600 mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-primary-600 hover:underline">Register here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;