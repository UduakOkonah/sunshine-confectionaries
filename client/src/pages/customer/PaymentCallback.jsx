import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import api from "../../lib/api";

function PaymentCallback() {
  const [searchParams] = useSearchParams();

  const reference = searchParams.get("reference");

  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("pending");

  const [order, setOrder] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const { data } = await api.get(
          `/payments/verify/${reference}`
        );

        setOrder(data.order);

        if (data.status === "success") {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch (error) {
        setStatus("failed");
      } finally {
        setLoading(false);
      }
    };

    if (reference) {
      verifyPayment();
    } else {
      setLoading(false);
      setStatus("failed");
    }
  }, [reference]);

  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#FFF7D6] px-4">
        <div className="rounded-[36px] bg-white p-10 text-center shadow-xl">
          <Loader2
            size={60}
            className="mx-auto animate-spin text-green-500"
          />

          <h1 className="mt-6 text-3xl font-black text-slate-900">
            Verifying Payment...
          </h1>

          <p className="mt-3 text-sm font-medium text-slate-500">
            Please wait while we confirm your transaction.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#FFF7D6] px-4 py-12">
      <div className="w-full max-w-xl rounded-[42px] bg-white p-8 text-center shadow-2xl">
        {status === "success" ? (
          <>
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 size={60} />
            </div>

            <h1 className="mt-6 text-4xl font-black text-slate-900">
              Payment Successful
            </h1>

            <p className="mt-4 text-base leading-7 text-slate-600">
              Your payment has been verified successfully.
            </p>

            {order && (
              <div className="mt-6 rounded-[28px] bg-green-50 p-5 text-left">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-bold text-slate-500">
                      Order Number
                    </span>

                    <span className="text-sm font-black text-slate-900">
                      {order.orderNumber}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm font-bold text-slate-500">
                      Payment Status
                    </span>

                    <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-black text-white">
                      {order.paymentStatus}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm font-bold text-slate-500">
                      Amount
                    </span>

                    <span className="text-sm font-black text-slate-900">
                      ₦{order.total?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100 text-red-500">
              <XCircle size={60} />
            </div>

            <h1 className="mt-6 text-4xl font-black text-slate-900">
              Payment Failed
            </h1>

            <p className="mt-4 text-base leading-7 text-slate-600">
              We could not verify your payment transaction.
            </p>
          </>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/my-orders"
            className="rounded-full bg-green-500 px-6 py-4 text-sm font-black text-white shadow-lg transition hover:bg-green-600"
          >
            View Orders
          </Link>

          <Link
            to="/products"
            className="rounded-full bg-yellow-100 px-6 py-4 text-sm font-black text-yellow-700 transition hover:bg-yellow-200"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}

export default PaymentCallback;