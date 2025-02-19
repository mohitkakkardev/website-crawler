import Header from '../components/Header';
import Footer from '../components/Footer';

const About: React.FC = () => (
    <div>
        <Header />
        <main className="p-8">
            <h1 className="text-3xl font-bold mb-4">About Us</h1>
            <p>This is the about page.</p>
        </main>
        <Footer />
    </div>
);

export default About;
