const OrderHistory = () => {
  return (
    <div className="md:col-span-3 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight">Order History</h1>
          <p className="text-[#9a5f4c] dark:text-[#b08e84]">
            Check the status of recent orders or manage returns.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-background-dark border border-[#e7d5cf] dark:border-[#3d2a23] rounded-lg p-1">
          <button className="px-4 py-1.5 text-xs font-bold rounded-md bg-primary text-white shadow-sm">
            Last 3 months
          </button>
          <button className="px-4 py-1.5 text-xs font-bold rounded-md text-[#9a5f4c] hover:bg-gray-50 dark:hover:bg-[#3d2a23]">
            6 months
          </button>
          <button className="px-4 py-1.5 text-xs font-bold rounded-md text-[#9a5f4c] hover:bg-gray-50 dark:hover:bg-[#3d2a23]">
            All time
          </button>
        </div>
      </div>
      <div className="space-y-4">
        <div className="bg-white dark:bg-background-dark rounded-xl border border-[#e7d5cf] dark:border-[#3d2a23] shadow-sm overflow-hidden hover:border-primary/30 transition-colors">
          <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="size-20 bg-[#fcf9f8] dark:bg-background-dark rounded-lg border border-[#e7d5cf] dark:border-[#3d2a23] p-2 shrink-0">
                <img
                  alt="Product thumbnail"
                  className="w-full h-full object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPXPzzL6i3mY4yEt3HMjdgrZImsXmG2t9ZLAj4ZgmsIKIQ2M3XAB60UQ0tRj7hr3T5kRW3bIstRYG_8EpwIp5qRoHDNOxAyFGdaxrh-pqaheIKtOHeoyUvF6dWG64qdgGSOj1SCD3QowW0BYwfOFFlW3V9MvuUEfXu9eJaF1aUMj01uu91M8W8AHMKgQtyRtQlV3IrKm2yahHyg7J-8q64zP-1OYyRmmbxSMtchPCmIoVpIc-MKWD7YkRjRhiLWabEznB44AkbOog"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#9a5f4c] uppercase tracking-wider">
                    Order #SH-92841
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full status-delivered uppercase tracking-wider">
                    Delivered
                  </span>
                </div>
                <h3 className="font-bold text-lg">Premium Leather Runner</h3>
                <p className="text-sm text-[#9a5f4c] dark:text-[#b08e84]">
                  Placed on Oct 24, 2023
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
              <div className="text-right">
                <p className="text-xs text-[#9a5f4c] dark:text-[#b08e84]">
                  Total Amount
                </p>
                <p className="text-xl font-black text-primary">$189.00</p>
              </div>
              <button className="px-4 py-2 text-sm font-bold bg-[#fcf9f8] dark:bg-background-dark border border-[#e7d5cf] dark:border-[#3d2a23] rounded-lg hover:border-primary hover:text-primary transition-all flex items-center gap-2">
                View Details
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#2c1d18] rounded-xl border border-[#e7d5cf] dark:border-[#3d2a23] shadow-sm overflow-hidden hover:border-primary/30 transition-colors">
          <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="size-20 bg-[#fcf9f8] dark:bg-background-dark rounded-lg border border-[#e7d5cf] dark:border-[#3d2a23] p-2 shrink-0">
                <img
                  alt="Product thumbnail"
                  className="w-full h-full object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJJxi1c0TcmIzQtI9_iCAlFrUWKjfJDfG7pEhbtFpyQryl91Ht3ahxtM2yFPtwELsVgR9VWDvdc4t7aGJqa03CegzR0Ei7cqEH6ZISzlo5JkiRouIgmGF1GAcxq4MwRnyE4ZnwL6neg3pCzwf--SJHdvWHVoLdIhroDHxrRbw9mhPFTQg1MyXTHsVsN0x02U7QgnMkojEkIB9zm9OMFe2RfkdhAoUeq6PU0csq-TyJ2YVjbAxWovSsHa-vmUcWnndez_N58U-ULYs"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#9a5f4c] uppercase tracking-wider">
                    Order #SH-91732
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full status-shipping uppercase tracking-wider">
                    Shipping
                  </span>
                </div>
                <h3 className="font-bold text-lg">Urban Street High-Top</h3>
                <p className="text-sm text-[#9a5f4c] dark:text-[#b08e84]">
                  Placed on Nov 02, 2023
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
              <div className="text-right">
                <p className="text-xs text-[#9a5f4c] dark:text-[#b08e84]">
                  Total Amount
                </p>
                <p className="text-xl font-black text-primary">$145.50</p>
              </div>
              <button className="px-4 py-2 text-sm font-bold bg-[#fcf9f8] dark:bg-background-dark border border-[#e7d5cf] dark:border-[#3d2a23] rounded-lg hover:border-primary hover:text-primary transition-all flex items-center gap-2">
                View Details
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#2c1d18] rounded-xl border border-[#e7d5cf] dark:border-[#3d2a23] shadow-sm overflow-hidden opacity-80 hover:opacity-100 hover:border-primary/30 transition-all">
          <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="size-20 bg-[#fcf9f8] dark:bg-background-dark rounded-lg border border-[#e7d5cf] dark:border-[#3d2a23] p-2 shrink-0 grayscale">
                <img
                  alt="Product thumbnail"
                  className="w-full h-full object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPXPzzL6i3mY4yEt3HMjdgrZImsXmG2t9ZLAj4ZgmsIKIQ2M3XAB60UQ0tRj7hr3T5kRW3bIstRYG_8EpwIp5qRoHDNOxAyFGdaxrh-pqaheIKtOHeoyUvF6dWG64qdgGSOj1SCD3QowW0BYwfOFFlW3V9MvuUEfXu9eJaF1aUMj01uu91M8W8AHMKgQtyRtQlV3IrKm2yahHyg7J-8q64zP-1OYyRmmbxSMtchPCmIoVpIc-MKWD7YkRjRhiLWabEznB44AkbOog"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#9a5f4c] uppercase tracking-wider">
                    Order #SH-89210
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full status-cancelled uppercase tracking-wider">
                    Cancelled
                  </span>
                </div>
                <h3 className="font-bold text-lg text-background-dark/60 dark:text-[#fcf9f8]/60">
                  Air Mesh Sport v2
                </h3>
                <p className="text-sm text-[#9a5f4c] dark:text-[#b08e84]">
                  Placed on Sep 12, 2023
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
              <div className="text-right">
                <p className="text-xs text-[#9a5f4c] dark:text-[#b08e84]">
                  Total Amount
                </p>
                <p className="text-xl font-black text-background-dark/60 dark:text-[#fcf9f8]/60">
                  $110.00
                </p>
              </div>
              <button className="px-4 py-2 text-sm font-bold bg-[#fcf9f8] dark:bg-background-dark border border-[#e7d5cf] dark:border-[#3d2a23] rounded-lg hover:border-primary hover:text-primary transition-all flex items-center gap-2">
                View Details
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-primary/5 rounded-xl border border-primary/20 p-6 flex gap-4">
        <span className="material-symbols-outlined text-primary text-2xl">
          help_outline
        </span>
        <div>
          <h4 className="font-bold text-sm mb-1">Need help with an order?</h4>
          <p className="text-sm text-[#9a5f4c] dark:text-[#b08e84]">
            Visit our support center or start a return within 30 days of your
            purchase date. Tracking information is updated every 2 hours.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
