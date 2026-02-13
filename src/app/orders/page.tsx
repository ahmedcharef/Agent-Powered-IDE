import type { Metadata } from "next";

type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

type Order = {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  total: string;
};

// TODO: Replace with real data from tRPC order.list once backend is wired
const mockOrders: Order[] = [
  {
    id: "ord_1",
    orderNumber: "ORD-1001",
    date: "2026-02-01",
    status: "DELIVERED",
    total: "$129.00",
  },
  {
    id: "ord_2",
    orderNumber: "ORD-1002",
    date: "2026-02-05",
    status: "PROCESSING",
    total: "$59.00",
  },
];

export const metadata: Metadata = {
  title: "Order history",
  description: "View your past orders, status, and totals.",
};

export default function OrdersPage() {
  const hasOrders = mockOrders.length > 0;

  return (
    <div className="flex min-h-screen justify-center bg-zinc-50 px-4 py-10 font-sans dark:bg-black">
      <main className="w-full max-w-4xl rounded-2xl bg-card p-6 shadow-sm sm:p-10">
        <header className="mb-8 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Order history
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Review your past orders, check their status, and keep track of your purchases.
          </p>
        </header>

        {!hasOrders ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-muted/40 px-6 py-12 text-center dark:border-zinc-800">
            <p className="text-base font-medium text-foreground">No orders yet</p>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Once you place an order, it will appear here with its status and total.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-background dark:border-zinc-800">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-muted/60">
                <tr className="border-b border-zinc-200 text-xs font-medium uppercase tracking-wide text-muted-foreground dark:border-zinc-800">
                  <th className="px-4 py-3 sm:px-6">Order</th>
                  <th className="px-4 py-3 sm:px-6">Date</th>
                  <th className="px-4 py-3 sm:px-6">Status</th>
                  <th className="px-4 py-3 text-right sm:px-6">Total</th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-zinc-100 last:border-0 hover:bg-muted/40 dark:border-zinc-900"
                  >
                    <td className="px-4 py-4 text-sm font-medium text-foreground sm:px-6">
                      <div className="flex flex-col">
                        <span>{order.orderNumber}</span>
                        <span className="text-xs font-normal text-muted-foreground">
                          Order ID: {order.id}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground sm:px-6">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-sm sm:px-6">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-semibold text-foreground sm:px-6">
                      {order.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const colorClasses: Record<OrderStatus, string> = {
    PENDING:
      "bg-amber-50 text-amber-800 ring-1 ring-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900",
    PROCESSING:
      "bg-blue-50 text-blue-800 ring-1 ring-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-900",
    SHIPPED:
      "bg-indigo-50 text-indigo-800 ring-1 ring-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300 dark:ring-indigo-900",
    DELIVERED:
      "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900",
    CANCELLED:
      "bg-rose-50 text-rose-800 ring-1 ring-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900",
  };

  const label = status.toLowerCase().replace(/^\w/, (s) => s.toUpperCase());

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${colorClasses[status]}`}
    >
      {label}
    </span>
  );
}

