import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import SearchBar from '@/app/components/SearchBar';

export default function App() {
  return (
    <div>
      <Header />
      <main className="p-8">
        <section className="text-center py-20">
          <h1 className="text-5xl font-bold">Landing page title</h1>
          <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
            Subheading that sets up context, shares more info about the website, or generally gets people psyched to keep scrolling.
          </p>
          <SearchBar />
        </section>
      </main>
      <Footer />
    </div>
  );
}