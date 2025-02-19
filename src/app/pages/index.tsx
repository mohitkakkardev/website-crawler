import Header from '../components/Header';
import Footer from '../components/Footer';

const Index: React.FC = () => (
    <div>
        <Header />
        <main className="p-8">
            <h1 className="text-3xl font-bold mb-4">Welcome to the Home Page</h1>
            <p>This is the main content of the homepage.</p>
        </main>
        <Footer />
    </div>
);

export default Index;
