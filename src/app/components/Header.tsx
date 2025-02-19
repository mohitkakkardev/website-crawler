import Link from 'next/link';

const Header: React.FC = () => (
    <header>
        <nav className="flex justify-between items-center px-8 py-4 border-b border-gray-200">
            <div className="text-lg font-semibold">Website Crawler</div>
            <div className="flex space-x-6">
                <li><Link href="/" className="text-white-700 hover:text-gray">Home</Link></li>
                <li><Link href="/about" className="text-white-700 hover:text-gray">About</Link></li>
                <li><Link href="/contact" className="text-white-700 hover:text-gray">Contact</Link></li>
            </div>
        </nav>
    </header>
);

export default Header;
