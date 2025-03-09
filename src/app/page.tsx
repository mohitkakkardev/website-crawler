import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import CrawlForm from '@/app/components/CrawlForm';

export default function App() {
  return (
    <div>
      <Header />
      <main className="p-8 min-h-screen">
        <section className="text-center py-5 mt-28">

          <h1 className="text-3xl sm:text-5xl font-bold text-center mt-6">
            🚀 Instantly crawl any
            <span className="relative inline-block w-[16rem] h-[2.2rem] overflow-hidden align-middle
               [mask-image:linear-gradient(to_bottom,transparent,white_20%,white_80%,transparent)]
               [--webkit-mask-image:linear-gradient(to_bottom,transparent,white_20%,white_80%,transparent)]">
              <span className="block animate-scroll-text text-blue-500">
                <span className="block pb-5">Keyword</span>
                <span className="block pb-5">Image</span>
                <span className="block pb-5">Document</span>
              </span>
            </span>
            on any Website
          </h1>





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