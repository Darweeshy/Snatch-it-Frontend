import Container from '../components/ui/Container';
import PageHeader from '../components/shared/PageHeader';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';

const ContactUs = () => {
    return (
        <Container className="py-12">
            <PageHeader
                title="Contact Us"
                subtitle="We'd love to hear from you. Reach out with any questions or feedback."
            />

            <div className="grid md:grid-cols-2 gap-12 bg-white p-8 rounded-lg shadow-md">
                {/* Contact Information */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-secondary-800">Our Address</h3>
                        <p className="text-secondary-600 mt-1">123 Gym Street, Maadi<br/>Cairo, Egypt</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-secondary-800">Email Us</h3>
                        <p className="text-secondary-600 mt-1">support@snatchit.com</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-secondary-800">Call Us</h3>
                        <p className="text-secondary-600 mt-1">+20 100 123 4567</p>
                    </div>
                </div>

                {/* Contact Form */}
                <div>
                    <form className="space-y-6">
                        <Input label="Your Name" id="name" type="text" placeholder="John Doe" required />
                        <Input label="Your Email" id="email" type="email" placeholder="you@example.com" required />
                        <Textarea label="Your Message" id="message" rows="5" placeholder="How can we help?" required />
                        <Button type="submit" className="w-full">Send Message</Button>
                    </form>
                </div>
            </div>
        </Container>
    );
};

export default ContactUs;