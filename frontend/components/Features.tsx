export default function Features() {
  return (
    <section className="grid md:grid-cols-3 gap-8 px-8 mt-32 pb-20 max-w-7xl mx-auto">

      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10">
        <div className="text-5xl mb-4">📍</div>
        <h2 className="text-2xl font-bold mb-3">Live Tracking</h2>
        <p className="text-gray-300">
          Watch your mechanic approach in real time with location updates powered by maps.
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10">
        <div className="text-5xl mb-4">🔧</div>
        <h2 className="text-2xl font-bold mb-3">Verified Mechanics</h2>
        <p className="text-gray-300">
          Get connected with skilled mechanics ready to help you whenever you need assistance.
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10">
        <div className="text-5xl mb-4">⚡</div>
        <h2 className="text-2xl font-bold mb-3">Fast Response</h2>
        <p className="text-gray-300">
          Request help instantly and receive quick support when you're stranded on the road.
        </p>
      </div>

    </section>
  );
}