import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-12">
        <Component {...pageProps} />
      </main>
    </div>
  );
}
