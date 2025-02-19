import Link from 'next/link';

const Header: React.FC = () => (
    <header>
        <nav className="flex justify-between items-center px-8 py-4 border-b border-gray-200">
            <div className="text-lg font-semibold">Website Crawler</div>
            <div className="flex space-x-6">
                <li><Link href="/" className="text-gray-700 hover:text-black">Home</Link></li>
                <li><Link href="/about" className="text-gray-700 hover:text-black">About</Link></li>
                <li><Link href="/contact" className="text-gray-700 hover:text-black">Contact</Link></li>
            </div>
            <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900">
                Button
            </button>
        </nav>
    </header>
);

export default Header;
