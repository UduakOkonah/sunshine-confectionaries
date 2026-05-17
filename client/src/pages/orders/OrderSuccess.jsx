import { Link, useParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";

function OrderSuccess() {
  const { trackingCode } = useParams();

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#FFF7D6] px-4">
      <div className="max-w-xl rounded-[36px] bg-white p-8 text-center shadow-2xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-700">
          <CheckCircle size={42} />
        </div>

        <h1 className="mt-6 text-4xl font-black text-slate-900">
          Order submitted
        </h1>

        <p className="mt-4 text-sm leading-7 text-slate-600">
          Your order has been sent to admin and is awaiting approval.
        </p>

        <div className="mt-6 rounded-2xl bg-yellow-50 p-5">
          <p className="text-xs font-black uppercase text-slate-400">
            Tracking Code
          </p>

          <p className="mt-2 text-2xl font-black text-green-700">
            {trackingCode}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to={`/track-order?code=${trackingCode}`}
            className="rounded-full bg-green-500 px-6 py-4 text-sm font-black text-white transition hover:bg-green-600"
          >
            Track Order
          </Link>

          <Link
            to="/"
            className="rounded-full bg-slate-100 px-6 py-4 text-sm font-black text-slate-700 transition hover:bg-slate-200"
          >
            Back Home
          </Link>
        </div>
      </div>
    </section>
  );
}

export default OrderSuccess;