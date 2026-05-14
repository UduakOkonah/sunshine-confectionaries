import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-[#FFF7D6] px-4">
      <div className="text-center">
        <h1 className="text-8xl font-black text-green-500">
          404
        </h1>

        <h2 className="mt-5 text-4xl font-black text-slate-900">
          Page not found.
        </h2>

        <p className="mt-4 text-lg text-slate-600">
          The page you are looking for does not exist.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex rounded-[60px] bg-green-500 px-7 py-4 text-sm font-black text-white shadow-lg"
        >
          Go Home
        </Link>
      </div>
    </section>
  );
}

export default NotFound;