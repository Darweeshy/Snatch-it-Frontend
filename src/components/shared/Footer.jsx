import { Link } from "react-router-dom";
import Container from "../ui/Container";
import Logo from "./Logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-secondary-200 mt-12">
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-secondary-500">
              High-quality, affordable athletic wear for your active lifestyle.
            </p>
            <div className="flex gap-4 text-secondary-500">
                <a href="#" className="hover:text-primary-600 transition-colors"><i className="bi bi-twitter-x"></i></a>
                <a href="#" className="hover:text-primary-600 transition-colors"><i className="bi bi-instagram"></i></a>
                <a href="#" className="hover:text-primary-600 transition-colors"><i className="bi bi-facebook"></i></a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-secondary-800">Shop</h3>
            <ul className="mt-4 space-y-2 text-sm">
                <li><Link to="/" className="text-secondary-500 hover:text-primary-600">Categories</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-secondary-800">Company</h3>
            <ul className="mt-4 space-y-2 text-sm">
                <li><Link to="/page/about-us" className="text-secondary-500 hover:text-primary-600">About Us</Link></li>
                <li><Link to="/page/contact-us" className="text-secondary-500 hover:text-primary-600">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-secondary-800">Legal</h3>
            <ul className="mt-4 space-y-2 text-sm">
                <li><Link to="/page/privacy-policy" className="text-secondary-500 hover:text-primary-600">Privacy Policy</Link></li>
                <li><Link to="/page/return-policy" className="text-secondary-500 hover:text-primary-600">Return Policy</Link></li>
                <li><Link to="/track-order" className="text-secondary-500 hover:text-primary-600">Track Your Order</Link></li>

            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-secondary-500">
            &copy; {currentYear} Snatch It. All rights reserved.
        </div>
      </Container>
    </footer>
  )
}

export default Footer;