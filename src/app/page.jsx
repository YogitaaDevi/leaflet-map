export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="text-center p-8">
        <h1 className="text-5xl font-bold text-blue-900 mb-4">
          Interactive World Map
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Explore events around the globe with interactive markers
        </p>
        <a
          href="/map"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          View Map
        </a>
      </div>
    </main>
  );
}
