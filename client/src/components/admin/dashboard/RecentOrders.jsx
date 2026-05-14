import { useOrders } from "../../../context/OrderContext";

function RecentOrders() {
  const { orders } = useOrders();

  const recentOrders = [...orders].reverse().slice(0, 5);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className="rounded-[32px] bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-400">
            Orders
          </p>

          <h2 className="mt-2 text-2xl font-black text-slate-900">
            Recent Orders
          </h2>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {recentOrders.length === 0 ? (
          <div className="rounded-[24px] bg-yellow-50 p-6 text-center">
            <p className="text-sm font-bold text-slate-500">
              No recent orders
            </p>
          </div>
        ) : (
          recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between rounded-[24px] bg-yellow-50 p-4"
            >
              <div>
                <p className="text-sm font-black text-slate-900">
                  {order.customerName}
                </p>

                <p className="mt-1 text-xs font-bold text-slate-500">
                  {order.orderNumber}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-black text-green-700">
                  {formatPrice(order.total)}
                </p>

                <p className="mt-1 text-xs font-bold text-slate-500">
                  {order.orderStatus}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RecentOrders;