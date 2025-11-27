import Container from "../components/ui/Container";
import PageHeader from "../components/shared/PageHeader";

const AboutUs = () => {
    return (
        <Container className="py-12">
            <PageHeader 
              title="About Snatch It"
            />
            <div className="prose prose-lg max-w-4xl mx-auto text-secondary-600">
                <p>
                    Welcome to Snatch It, your new go-to for high-quality, affordable athletic wear.
                </p>
                <p>
                    We're a group of engineers in our mid-20s who share a passion for working out. For years, we faced the same frustrating problem: finding great athletic apparel that didn't break the bank. It seemed like you had to choose between overpriced, big-name brands and cheap, low-quality gear that wouldn't last a single deadlift session.
                </p>
                <p>
                    We decided to change that.
                </p>
                <p>
                    Using our engineering mindset, we approached this problem head-on. We spent countless hours researching materials, testing designs, and building relationships with manufacturers who share our commitment to quality. Our goal was simple: to create durable, comfortable, and stylish athletic wear that we would be proud to use ourselves, and to offer it at a price that makes sense for everyone.
                </p>
                <p>
                    Every item you see here is a product of that passion. From our team to yours, we hope you'll love it.
                </p>
            </div>
        </Container>
    );
};

export default AboutUs;