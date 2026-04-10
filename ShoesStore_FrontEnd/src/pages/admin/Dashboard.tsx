import { adminApi } from "@/api/admin.api";
import { formatVndCurrency } from "@/lib/currency";
import type { AdminDashboardResponse } from "@/types/admin.types";
import { useEffect, useMemo, useState } from "react";

const MONTH_LABELS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

interface MetricCard {
  icon: string;
  title: string;
  value: string;
  growth: number;
}

const getGrowthStyle = (value: number) => {
  if (value > 0) {
    return {
      icon: "trending_up",
      className:
        "text-xs font-bold text-green-600 flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full",
      label: `+${value.toFixed(1)}%`,
    };
  }

  if (value < 0) {
    return {
      icon: "trending_down",
      className:
        "text-xs font-bold text-red-600 flex items-center gap-1 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full",
      label: `${value.toFixed(1)}%`,
    };
  }

  return {
    icon: "trending_flat",
    className:
      "text-xs font-bold text-slate-400 flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full",
    label: "0.0%",
  };
};

const getOrderStatusStyle = (status: string) => {
  const normalizedStatus = status.toLowerCase();

  if (
    normalizedStatus.includes("paid") ||
    normalizedStatus.includes("deliver")
  ) {
    return "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
  }

  if (
    normalizedStatus.includes("shipping") ||
    normalizedStatus.includes("process")
  ) {
    return "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
  }

  if (
    normalizedStatus.includes("cancel") ||
    normalizedStatus.includes("draft") ||
    normalizedStatus.includes("draff")
  ) {
    return "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
  }

  return "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
};

const Dashboard = () => {
  const [dashboard, setDashboard] = useState<AdminDashboardResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminApi.getDashboard();
        setDashboard(data);
      } catch {
        setError("Khong the tai du lieu dashboard. Vui long thu lai.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const chartPoints = useMemo(() => {
    if (!dashboard?.revenueByMonth?.length) return [];

    const maxRevenue = Math.max(
      ...dashboard.revenueByMonth.map((point) => point.revenue),
      1,
    );

    return dashboard.revenueByMonth.map((point, index) => {
      const x = index * (1000 / 11);
      const y = 90 - (point.revenue / maxRevenue) * 80;
      return { x, y };
    });
  }, [dashboard]);

  const pathData = useMemo(() => {
    if (!chartPoints.length) return "";
    return chartPoints
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");
  }, [chartPoints]);

  const metricCards: MetricCard[] = dashboard
    ? [
        {
          icon: "payments",
          title: "Total Sales",
          value: formatVndCurrency(dashboard.summary.totalSales),
          growth: dashboard.summary.totalSalesGrowthPercent,
        },
        {
          icon: "shopping_bag",
          title: "Total Orders",
          value: dashboard.summary.totalOrders.toLocaleString("vi-VN"),
          growth: dashboard.summary.totalOrdersGrowthPercent,
        },
        {
          icon: "person_add",
          title: "New Customers",
          value: dashboard.summary.newCustomers.toLocaleString("vi-VN"),
          growth: dashboard.summary.newCustomersGrowthPercent,
        },
        {
          icon: "group",
          title: "Active Users",
          value: dashboard.summary.activeUsers.toLocaleString("vi-VN"),
          growth: dashboard.summary.activeUsersGrowthPercent,
        },
      ]
    : [];

  return (
    <>
      <div className="px-8 pt-8 pb-4">
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-slate-900 dark:text-white text-3xl font-extrabold tracking-tight">
              Dashboard Overview
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Tong quan du lieu cua cua hang trong 30 ngay gan nhat.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold py-2.5 px-4 rounded-lg text-sm transition-all shadow-sm">
              <span className="material-symbols-outlined text-lg text-slate-400">
                calendar_today
              </span>
              <span>Last 30 Days</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="px-8 pb-2">
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
        </div>
      )}

      <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading &&
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`metric-skeleton-${index}`}
              className="bg-white dark:bg-background-dark/30 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm animate-pulse h-37"
            />
          ))}

        {!loading &&
          metricCards.map((card) => {
            const growthStyle = getGrowthStyle(card.growth);

            return (
              <div
                key={card.title}
                className="bg-white dark:bg-background-dark/30 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
                    <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">
                      {card.icon}
                    </span>
                  </div>
                  <span className={growthStyle.className}>
                    <span className="material-symbols-outlined text-sm">
                      {growthStyle.icon}
                    </span>
                    {growthStyle.label}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {card.value}
                </p>
              </div>
            );
          })}
      </div>

      <div className="px-8 pb-6">
        <div className="bg-white dark:bg-background-dark/30 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Sales Analytics
              </h3>
              <p className="text-sm text-slate-500">
                Doanh thu theo thang trong nam hien tai
              </p>
            </div>
            <div className="px-3 py-1.5 text-xs font-bold bg-primary text-white rounded-md">
              Monthly
            </div>
          </div>

          <div className="h-64 chart-grid relative rounded-lg border border-slate-100 dark:border-slate-800 flex items-end justify-between px-4 pb-8">
            {!loading && chartPoints.length > 0 && (
              <svg
                className="absolute inset-0 w-full h-full px-4 pb-8"
                preserveAspectRatio="none"
                viewBox="0 0 1000 100"
              >
                <path
                  d={pathData}
                  fill="none"
                  stroke="#ee5b2b"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                />
                {chartPoints.map((point, index) => (
                  <circle
                    key={`point-${index}`}
                    cx={point.x}
                    cy={point.y}
                    fill="#ee5b2b"
                    r={4}
                  />
                ))}
              </svg>
            )}
            {MONTH_LABELS.map((month) => (
              <div key={month} className="text-[10px] text-slate-400 mt-auto">
                {month}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-8 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-background-dark/30 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white">
              Recent Orders
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {!loading && dashboard?.recentOrders.length === 0 && (
                  <tr>
                    <td
                      className="px-6 py-6 text-sm text-slate-500"
                      colSpan={4}
                    >
                      Chua co don hang nao.
                    </td>
                  </tr>
                )}

                {!loading &&
                  dashboard?.recentOrders.map((order) => (
                    <tr key={order.orderId}>
                      <td className="px-6 py-4 text-sm font-bold">
                        #{order.orderId.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {order.customerName}
                      </td>
                      <td className="px-6 py-4">
                        <span className={getOrderStatusStyle(order.status)}>
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-right">
                        {formatVndCurrency(order.totalAmount)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-background-dark/30 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white">
              Top Selling Products
            </h3>
          </div>
          <div className="p-4 space-y-4">
            {!loading && dashboard?.topProducts.length === 0 && (
              <p className="text-sm text-slate-500">
                Chua co du lieu san pham ban chay.
              </p>
            )}

            {!loading &&
              dashboard?.topProducts.map((product) => (
                <div
                  key={product.productId}
                  className="flex items-center gap-4 group"
                >
                  <div className="size-14 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.productName}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                      {product.productName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {product.unitsSold} units sold
                    </p>
                  </div>
                  <p className="text-sm font-bold">
                    {formatVndCurrency(product.unitPrice)}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
