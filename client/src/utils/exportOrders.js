export function exportOrdersToCSV(orders) {
  if (!orders.length) return;

  const headers = [
    "Order Number",
    "Customer",
    "Phone",
    "Address",
    "Delivery Zone",
    "Order Status",
    "Payment Status",
    "Delivery Status",
    "Payment Method",
    "Payment Reference",
    "Subtotal",
    "Delivery Fee",
    "Total",
  ];

  const rows = orders.map((order) => [
    order.orderNumber,
    order.customerName,
    order.phone,
    order.address,
    order.deliveryZone,
    order.orderStatus,
    order.paymentStatus,
    order.deliveryStatus,
    order.paymentMethod,
    order.paymentReference,
    order.subtotal,
    order.deliveryFee,
    order.total,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((value) => `"${value || ""}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `sunshine-orders-${Date.now()}.csv`;
  link.click();

  URL.revokeObjectURL(url);
}