export const AdminOrderPage = () => {
  return (
    <main className="flex-1 flex flex-col overflow-y-auto">
      <div className="px-8 pt-8 pb-4">
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-slate-900 dark:text-white text-3xl font-extrabold tracking-tight">
              Order Management
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Review, track, and update customer orders efficiently.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-5 rounded-lg transition-all shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-lg">add</span>
              <span>Create Order</span>
            </button>
          </div>
        </div>
      </div>
      <div className="px-8 py-4">
        <div className="bg-white dark:bg-background-dark/30 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px] relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
              placeholder="Search Order ID, Customer Name..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-2">
            <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm font-medium py-2 px-4 focus:ring-2 focus:ring-primary/20">
              <option>All Status</option>
              <option>Pending</option>
              <option>Preparing</option>
              <option>Packed</option>
              <option>Shipping</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
            <button className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border-none py-2 px-4 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined text-lg text-slate-400">
                calendar_today
              </span>
              <span>Oct 1 - Oct 31</span>
            </button>
            <button className="p-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>
        </div>
      </div>
      <div className="px-8 pb-8">
        <div className="bg-white dark:bg-background-dark/30 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Payment Method</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">
                    #ORD-2849
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    Oct 24, 2023 14:20
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="size-8 rounded-full bg-slate-200 overflow-hidden"
                        style={{
                          backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDz5OicLohowxdIspy_D-Mgoxne91DQGGNtpX_GW8KhqsHjg3HSKamic9m82aGmwYCCpFeQ8_cv6bKqJ-XhxIz2lA0ageBg8Eur4fUnqbos1yuzm7x1kD98uu5CYPkHPCydaqpVBCeIwo4AI6Pnewgwb57vIdHvQ0EFeZsHr3wE_tlbXsvV075ks4X849owdw6EiSI-Me2ONGkn-4GmQOH-srE4wc-nLTH_6FPnbKTwf3FAC72wdY-0j7t7xcEF7Z_Yu1tDxhmcS_g")',
                          backgroundSize: "cover",
                        }}
                      />
                      <span className="text-sm font-semibold">
                        Sarah Jenkins
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold">$158.00</td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    Credit Card
                  </td>
                  <td className="px-6 py-4">
                    <span className="status-badge bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      DELIVERED
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                      <span className="material-symbols-outlined">
                        more_vert
                      </span>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">
                    #ORD-2850
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    Oct 24, 2023 15:45
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-slate-300 flex items-center justify-center text-xs font-bold text-white uppercase">
                        MR
                      </div>
                      <span className="text-sm font-semibold">
                        Michael Ross
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold">$120.50</td>
                  <td className="px-6 py-4 text-sm text-slate-500">PayPal</td>
                  <td className="px-6 py-4">
                    <span className="status-badge bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                      SHIPPING
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                      <span className="material-symbols-outlined">
                        more_vert
                      </span>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">
                    #ORD-2851
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    Oct 25, 2023 09:12
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-slate-300 flex items-center justify-center text-xs font-bold text-white uppercase">
                        EG
                      </div>
                      <span className="text-sm font-semibold">
                        Elena Gilbert
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold">$245.00</td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    Credit Card
                  </td>
                  <td className="px-6 py-4">
                    <span className="status-badge bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      PREPARING
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                      <span className="material-symbols-outlined">
                        more_vert
                      </span>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">
                    #ORD-2852
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    Oct 25, 2023 10:30
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-slate-300 flex items-center justify-center text-xs font-bold text-white uppercase">
                        TS
                      </div>
                      <span className="text-sm font-semibold">Tom Shelby</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold">$89.99</td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    Bank Transfer
                  </td>
                  <td className="px-6 py-4">
                    <span className="status-badge bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                      CANCELLED
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                      <span className="material-symbols-outlined">
                        more_vert
                      </span>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">
                    #ORD-2853
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    Oct 25, 2023 11:15
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-slate-300 flex items-center justify-center text-xs font-bold text-white uppercase">
                        JD
                      </div>
                      <span className="text-sm font-semibold">Jane Doe</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold">$210.00</td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    Credit Card
                  </td>
                  <td className="px-6 py-4">
                    <span className="status-badge bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400">
                      PENDING
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                      <span className="material-symbols-outlined">
                        more_vert
                      </span>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">
                    #ORD-2854
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    Oct 25, 2023 12:40
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-slate-300 flex items-center justify-center text-xs font-bold text-white uppercase">
                        RB
                      </div>
                      <span className="text-sm font-semibold">
                        Rick Bennett
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold">$135.50</td>
                  <td className="px-6 py-4 text-sm text-slate-500">PayPal</td>
                  <td className="px-6 py-4">
                    <span className="status-badge bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                      PACKED
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                      <span className="material-symbols-outlined">
                        more_vert
                      </span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                1-6
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                124
              </span>{" "}
              orders
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <span className="material-symbols-outlined text-lg">
                  chevron_left
                </span>
              </button>
              <button className="size-10 rounded-lg bg-primary text-white font-bold text-sm">
                1
              </button>
              <button className="size-10 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold transition-colors">
                2
              </button>
              <button className="size-10 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold transition-colors">
                3
              </button>
              <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <span className="material-symbols-outlined text-lg">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
