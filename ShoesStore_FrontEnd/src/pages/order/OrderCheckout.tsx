const OrderCheckout = () => {
  return (
    <main className="flex-1 flex justify-center py-10 px-4 md:px-10 lg:px-20 xl:px-40">
      <div className="max-w-300 w-full flex flex-col lg:flex-row gap-8">
        {/* Left Column: Items List */}
        <div className="flex-1 flex flex-col gap-6">
          {/* PageHeading */}
          <div className="flex flex-wrap justify-between items-center gap-3">
            <h1 className="text-background-dark dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
              Shopping Cart (3 items)
            </h1>
          </div>
          <div className="flex flex-col gap-1">
            {/* ListItem 1 */}
            <div className="flex flex-col sm:flex-row gap-6 bg-white dark:bg-white/5 p-6 rounded-xl border border-[#f3eae7] dark:border-white/10">
              <div
                className="bg-center bg-no-repeat aspect-4/3 bg-cover rounded-lg h-32 w-full sm:w-44 shrink-0"
                data-alt="Nike Air Max 270 Sunset Orange"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDK9OfV9TRyev64xDGjAPbqu3Mkt4qzRr62URlQ7evO0gpNNoYQiSypOCIAXVK898v-SUqZ53LypQYAW_2saus2kXH9bKLyXAuy-IC5iGkxZvqR3s3v1miwLeBUTiuqvZCVwu3ii9_7GJH0qWnEZNhhEb__fINOaxai_1eO3LWCUyvjFxy0u7BOBzDABXqPMJzZp56n0KeyjgX3TWStxPA6c8339AgLOAuNaneqokW_vJGHq19BsHd1Chx5rmzl29y1LRlzPKDQoz8")',
                }}
              />
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[#1b110d] dark:text-white text-lg font-bold leading-normal">
                      Nike Air Max 270
                    </p>
                    <p className="text-[#9a5f4c] dark:text-white/60 text-sm mt-1">
                      Size: 10.5 US | Color: Sunset Orange
                    </p>
                  </div>
                  <p className="text-[#1b110d] dark:text-white text-lg font-bold">
                    $150.00
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 bg-[#f3eae7] dark:bg-white/10 rounded-lg p-1">
                      <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-white dark:hover:bg-white/20 transition-colors">
                        <span className="material-symbols-outlined text-sm">
                          remove
                        </span>
                      </button>
                      <input
                        className="w-8 text-center bg-transparent border-none focus:ring-0 text-sm font-bold"
                        type="number"
                        defaultValue={1}
                      />
                      <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-white dark:hover:bg-white/20 transition-colors">
                        <span className="material-symbols-outlined text-sm">
                          add
                        </span>
                      </button>
                    </div>
                  </div>
                  <button className="flex items-center text-[#9a5f4c] dark:text-white/40 hover:text-red-500 transition-colors gap-1.5 text-sm font-bold">
                    <span className="material-symbols-outlined text-[18px]">
                      delete
                    </span>
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
            {/* ListItem 2 */}
            <div className="flex flex-col sm:flex-row gap-6 bg-white dark:bg-white/5 p-6 rounded-xl border border-[#f3eae7] dark:border-white/10 mt-4">
              <div
                className="bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-lg h-32 w-full sm:w-44 shrink-0"
                data-alt="Adidas Ultraboost Cloud White"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBdnP4zyb9y8GdYXoTeCr8QoAWKrZAgH-UmujvchqIHtVy0gdFmxnchlhHj4peZ7aYu347tZxdKXjPBrcPCv7470j1lI0Q2OkpuK4vvsdHssoLlmDekE8Dkhhj8AtPhUq1lFYcdNlprxTviGMG9Vl3g09hKSNAb2B2oTOySTLrgfRySihPlD7w23ohmOkdKo4dSkH1Dt45a1chT7fOJQEemuXbf8Q04xkk4_LC0S-ktH6qHTe_CNrGTpWDbFK2UuhpfZLEhs7dvRKA")',
                }}
              />
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[#1b110d] dark:text-white text-lg font-bold leading-normal">
                      Adidas Ultraboost 22
                    </p>
                    <p className="text-[#9a5f4c] dark:text-white/60 text-sm mt-1">
                      Size: 9.0 US | Color: Cloud White
                    </p>
                  </div>
                  <p className="text-[#1b110d] dark:text-white text-lg font-bold">
                    $180.00
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 bg-[#f3eae7] dark:bg-white/10 rounded-lg p-1">
                      <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-white dark:hover:bg-white/20 transition-colors">
                        <span className="material-symbols-outlined text-sm">
                          remove
                        </span>
                      </button>
                      <input
                        className="w-8 text-center bg-transparent border-none focus:ring-0 text-sm font-bold"
                        type="number"
                        defaultValue={1}
                      />
                      <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-white dark:hover:bg-white/20 transition-colors">
                        <span className="material-symbols-outlined text-sm">
                          add
                        </span>
                      </button>
                    </div>
                  </div>
                  <button className="flex items-center text-[#9a5f4c] dark:text-white/40 hover:text-red-500 transition-colors gap-1.5 text-sm font-bold">
                    <span className="material-symbols-outlined text-[18px]">
                      delete
                    </span>
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
            {/* ListItem 3 */}
            <div className="flex flex-col sm:flex-row gap-6 bg-white dark:bg-white/5 p-6 rounded-xl border border-[#f3eae7] dark:border-white/10 mt-4">
              <div
                className="bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-lg h-32 w-full sm:w-44 shrink-0"
                data-alt="Puma RS-X Bold Blue"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBG86hPEDmadNoSwteOKIpa9nnfXaX1NVBuxVMM59ymYhmEKQxBSAjI_QFuu7ZWJ3dXf1Y4a02QVPD14iZ0wf3klkNPFZ3gmeMxluFMyf0l49rx-tKsDvBv0EDiLX4f6VOitenIBgUWtzM37__GjMGpBn42lUYXrRqjb94g4Fb_Cmhno9ATSKOlVYlvsSwCSRb1SnkO2oheDNAfqBHAMbdol8RY8LpH7ZB6EM26oGCwedw7RoaijMsVaDy2SfN5IfyxTAWUw7tuT-o")',
                }}
              />
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[#1b110d] dark:text-white text-lg font-bold leading-normal">
                      Puma RS-X Reinvent
                    </p>
                    <p className="text-[#9a5f4c] dark:text-white/60 text-sm mt-1">
                      Size: 11.0 US | Color: Digital Blue
                    </p>
                  </div>
                  <p className="text-[#1b110d] dark:text-white text-lg font-bold">
                    $110.00
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 bg-[#f3eae7] dark:bg-white/10 rounded-lg p-1">
                      <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-white dark:hover:bg-white/20 transition-colors">
                        <span className="material-symbols-outlined text-sm">
                          remove
                        </span>
                      </button>
                      <input
                        className="w-8 text-center bg-transparent border-none focus:ring-0 text-sm font-bold"
                        type="number"
                        defaultValue={1}
                      />
                      <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-white dark:hover:bg-white/20 transition-colors">
                        <span className="material-symbols-outlined text-sm">
                          add
                        </span>
                      </button>
                    </div>
                  </div>
                  <button className="flex items-center text-[#9a5f4c] dark:text-white/40 hover:text-red-500 transition-colors gap-1.5 text-sm font-bold">
                    <span className="material-symbols-outlined text-[18px]">
                      delete
                    </span>
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <a
            className="flex items-center gap-2 text-primary font-bold mt-4"
            href="#"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span>Continue Shopping</span>
          </a>
        </div>
        {/* Right Column: Summary Sidebar */}
        <div className="w-full lg:w-[380px]">
          <div className="sticky top-24 flex flex-col gap-6">
            <div className="bg-white dark:bg-white/5 p-8 rounded-xl border border-[#f3eae7] dark:border-white/10 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              <div className="flex flex-col gap-4 border-b border-[#f3eae7] dark:border-white/10 pb-6">
                <div className="flex justify-between">
                  <span className="text-[#9a5f4c] dark:text-white/60">
                    Subtotal
                  </span>
                  <span className="font-bold">$440.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9a5f4c] dark:text-white/60">
                    Estimated Shipping
                  </span>
                  <span className="text-green-600 font-bold">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9a5f4c] dark:text-white/60">
                    Estimated Tax
                  </span>
                  <span className="font-bold">$35.20</span>
                </div>
              </div>
              <div className="flex justify-between items-center py-6">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-black text-primary">
                  $475.20
                </span>
              </div>
              <div className="flex flex-col gap-4 mt-2">
                <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-xl flex items-center justify-center gap-2 transition-all">
                  <span>Proceed to Checkout</span>
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </button>
                <div className="mt-4">
                  <p className="text-xs font-bold text-[#9a5f4c] dark:text-white/40 uppercase tracking-widest mb-3">
                    Apply Promo Code
                  </p>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 bg-background-light dark:bg-white/5 border border-[#f3eae7] dark:border-white/10 rounded-lg px-4 h-10 text-sm focus:ring-primary focus:border-primary"
                      placeholder="Code"
                      type="text"
                    />
                    <button className="px-4 bg-[#1b110d] text-white dark:bg-white dark:text-background-dark text-sm font-bold rounded-lg hover:opacity-90">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Trust Badge */}
            <div className="flex flex-col items-center gap-4 px-4 text-center">
              <p className="text-xs text-[#9a5f4c] dark:text-white/40">
                Secure Payment Guaranteed
              </p>
              <div className="flex items-center gap-4 grayscale opacity-60">
                <span className="material-symbols-outlined text-4xl">
                  credit_card
                </span>
                <span className="material-symbols-outlined text-4xl">
                  account_balance_wallet
                </span>
                <span className="material-symbols-outlined text-4xl">
                  payments
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderCheckout;
