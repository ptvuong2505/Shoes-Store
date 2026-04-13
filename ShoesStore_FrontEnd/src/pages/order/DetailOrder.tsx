import { getOrderDetail } from "@/api/order.api";
import { formatVndCurrency } from "@/lib/currency";

import type { OrderDetail, OrderItem } from "@/types/order.types";
import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";

const DetailOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      if (id == null) return;
      try {
        setLoading(true);
        const res = await getOrderDetail(id!);
        console.log("Order detail:", res);
        setOrder(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  return (
    <>
      {loading || !order ? (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p>Loading order details...</p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <NavLink
              className="hover:text-primary transition-colors"
              to="/account/order-history"
            >
              Orders History
            </NavLink>
            <span className="material-symbols-outlined text-xs">
              chevron_right
            </span>
            <span className="text-slate-900 dark:text-slate-100 font-medium">
              Order Details
            </span>
          </nav>
          <section className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                    Order #{order?.id.slice(0, 8)}
                  </h2>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {order?.status}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400">
                  Placed on {new Date(order?.orderDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-3 items-center">
                <div className=" border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="font-black text-2xl text-primary">
                    {formatVndCurrency(order?.totalAmount ?? 0)}
                  </span>
                </div>
                {order.status === "Draff" && (
                  <button
                    onClick={() => {
                      navigate(`/orders/checkout/${order.id}`);
                    }}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                  >
                    <span className="material-symbols-outlined text-lg">
                      payment
                    </span>
                    Continue Payment
                  </button>
                )}
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <section className="lg:col-span-3 space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-lg">Order Items</h3>
                </div>
                <div className="p-6 space-y-6">
                  {order?.items.map((item: OrderItem) => (
                    <div key={item.productId} className="flex gap-6">
                      <div className="w-32 h-32 rounded-xl bg-slate-50 overflow-hidden">
                        <img
                          className="w-full h-full object-cover"
                          src={item.thumbnailUrl}
                          alt={item.productName}
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-xl">
                            {item.productName}
                          </h4>
                          <span className="font-black text-lg">
                            {formatVndCurrency(item.price)}
                          </span>
                        </div>

                        <div className="text-sm text-slate-500 mb-4 flex gap-4">
                          <p>Size: {item.size}</p>
                          <p>Gender: {item.gender}</p>
                          <p>Qty: {item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <section className="lg:col-span-2 space-y-8">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div>
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                    Shipping Address
                  </h5>
                  <div className="flex gap-3">
                    <span className="material-symbols-outlined text-slate-400">
                      location_on
                    </span>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {order.shippingAddress ?? ""}
                        <br />
                      </p>
                    </div>
                  </div>
                </div>
                {/* <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                    Payment Method
                  </h5>
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-bold">Visa ending in 4429</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Billed on Oct 24, 2023
                      </p>
                    </div>
                  </div>
                </div> */}
              </div>
              {/* <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                Order Summary
              </h5>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    $184.00
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Shipping (Express)</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    $15.00
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Estimated Tax</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    $12.50
                  </span>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-black text-2xl text-primary">
                    $211.50
                  </span>
                </div>
              </div>
            </div> */}
            </section>
          </div>
        </div>
      )}
    </>
  );
};

export default DetailOrder;
