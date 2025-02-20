import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import CrawlForm from '@/app/components/CrawlForm';

export default function App() {
  return (
    <div>
      <Header />
      <main className="p-8">
        <section className="text-center py-20">
          <h1 className="text-5xl font-bold">🚀 Instantly Find Any Text on Any Websitee</h1>
          <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
            Enter a URL, type your keyword, and let our crawler do the work. Quickly search and verify content across the web in seconds!
          </p>
          <CrawlForm />
        </section>
      </main>
      <Footer />
    </div>
  );
}