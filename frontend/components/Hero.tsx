import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-6 mt-20">
      <div className="mb-6 text-7xl">🚗</div>

      <h1 className="text-5xl md:text-7xl font-bold leading-tight max-w-4xl">
        Roadside Assistance{" "}
        <span className="text-blue-400">
          Anytime, Anywhere.
        </span>
      </h1>

      <p className="mt-8 text-gray-300 text-lg md:text-xl max-w-2xl">
        Flat tyre? Dead battery? Engine trouble? Find nearby mechanics and get real-time tracking with Yatri.
      </p>

      <div className="flex flex-col md:flex-row gap-4 mt-10">
        <Link
          href="/register"
          className="px-8 py-4 bg-blue-600 rounded-2xl text-lg font-semibold hover:bg-blue-700 transition"
        >
          Get Started
        </Link>

        <Link
          href="/login"
          className="px-8 py-4 border border-gray-600 rounded-2xl text-lg font-semibold hover:bg-gray-800 transition"
        >
          Sign In
        </Link>
      </div>
    </section>
  );
}