import { Link } from 'react-router-dom';

const Logo = () => (
    <Link to="/" className="text-2xl font-extrabold tracking-tight text-secondary-800">
        Snatch<span className="text-primary-600">.</span>It
    </Link>
);

export default Logo;