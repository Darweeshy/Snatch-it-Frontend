import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const AccessDenied = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary-50 text-center px-4">
        <i className="bi bi-shield-lock-fill text-8xl text-red-500"></i>
        <h1 className="mt-6 text-5xl font-extrabold text-secondary-900 tracking-tight">403</h1>
        <p className="mt-2 text-2xl font-semibold text-secondary-700">Access Denied</p>
        <p className="mt-4 max-w-md text-base text-secondary-500">You do not have the necessary permissions to view this page. Please contact an administrator if you believe this is an error.</p>
        <Button onClick={() => window.history.back()} className="mt-8">Go Back</Button>
        <Link to="/" className="mt-4 text-sm text-primary-600 hover:underline">Or go to homepage</Link>
    </div>
);

export default AccessDenied;