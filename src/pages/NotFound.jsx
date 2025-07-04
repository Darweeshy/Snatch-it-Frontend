import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary-50 text-center px-4">
        <i className="bi bi-compass text-8xl text-primary-500"></i>
        <h1 className="mt-6 text-5xl font-extrabold text-secondary-900 tracking-tight">404</h1>
        <p className="mt-2 text-2xl font-semibold text-secondary-700">Page Not Found</p>
        <p className="mt-4 max-w-md text-base text-secondary-500">Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.</p>
        <Link to="/" className="inline-block mt-8">
            <Button>Go to Homepage</Button>
        </Link>
    </div>
);

export default NotFound;