import { accountApi } from "@/api/account.api";
import { orderApi } from "@/api/order.api";
import { formatVndCurrency } from "@/lib/currency";
import type { Address } from "@/types/address.types";
import type { OrderCheckout as OrderCheckoutType } from "@/types/order.types";
import { useEffect, useState } from "react";
import { replace, useNavigate, useParams } from "react-router-dom";

const OrderCheckout = () => {
  const { id } = useParams();
  const navigator = useNavigate();
  const [order, setOrder] = useState<OrderCheckoutType | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<Address, "id">>({
    receiverName: "",
    phone: "",
    addressLine: "",
    city: "",
    isPrimary: false,
  });

  const fetchAddressList = async () => {
    const data = await accountApi.getAddresses();
    setAddresses(data);
    const primary = data.find((a) => a.isPrimary);
    if (primary) setSelectedAddressId(primary.id);
    else if (data.length > 0) setSelectedAddressId(data[0].id);
  };

  useEffect(() => {
    document.title = "Checkout - ShoesStore";

    const fetchOrderCheckout = async (orderId: string) => {
      const data = await orderApi.checkoutBuyNow(orderId);
      setOrder(data);
    };

    const loadAddresses = async () => {
      const data = await accountApi.getAddresses();
      setAddresses(data);
      const primary = data.find((a) => a.isPrimary);
      if (primary) setSelectedAddressId(primary.id);
      else if (data.length > 0) setSelectedAddressId(data[0].id);
    };

    fetchOrderCheckout(id!);
    loadAddresses();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePayment = async () => {
    if (!selectedAddressId) return;
    try {
      await orderApi.payment(id!, selectedAddressId);
      navigator("/orders/" + id, { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await accountApi.create(formData);
      await fetchAddressList();
      setShowForm(false);
      setFormData({
        receiverName: "",
        phone: "",
        addressLine: "",
        city: "",
        isPrimary: false,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 px-4 md:px-20 lg:px-40 py-8">
      <h1 className="text-background-dark dark:text-[#f3eae7] text-3xl font-extrabold mb-8">
        Shipping Information
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-8">
          <section className="bg-white dark:bg-background-dark/50 p-6 rounded-xl border border-[#e7d5cf] dark:border-[#3d2a23]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  local_shipping
                </span>
                Select Address
              </h2>
              <button
                onClick={() => setShowForm((prev) => !prev)}
                className="text-primary font-bold text-sm hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-lg">
                  {showForm ? "close" : "add"}
                </span>
                {showForm ? "Cancel" : "Add New Address"}
              </button>
            </div>
            {showForm && (
              <form
                onSubmit={handleSubmit}
                className="mb-4 p-5 rounded-xl border border-[#e7d5cf] dark:border-[#3d2a23] bg-white dark:bg-background-dark/50 space-y-4"
              >
                <input
                  name="receiverName"
                  placeholder="Receiver Name"
                  value={formData.receiverName}
                  onChange={handleChange}
                  required
                  className="w-full border border-[#e7d5cf] dark:border-[#3d2a23] bg-transparent p-3 rounded-lg text-sm focus:outline-none focus:border-primary"
                />
                <input
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-[#e7d5cf] dark:border-[#3d2a23] bg-transparent p-3 rounded-lg text-sm focus:outline-none focus:border-primary"
                />
                <input
                  name="addressLine"
                  placeholder="Address Line"
                  value={formData.addressLine}
                  onChange={handleChange}
                  required
                  className="w-full border border-[#e7d5cf] dark:border-[#3d2a23] bg-transparent p-3 rounded-lg text-sm focus:outline-none focus:border-primary"
                />
                <input
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full border border-[#e7d5cf] dark:border-[#3d2a23] bg-transparent p-3 rounded-lg text-sm focus:outline-none focus:border-primary"
                />
                <label className="flex items-center gap-2 text-sm text-[#9a5f4c] dark:text-[#c4a195]">
                  <input
                    type="checkbox"
                    name="isPrimary"
                    checked={formData.isPrimary}
                    onChange={handleChange}
                    className="accent-primary"
                  />
                  Set as default address
                </label>
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  Save Address
                </button>
              </form>
            )}
            <div className="space-y-4">
              {addresses.map((address) => {
                const isSelected = selectedAddressId === address.id;
                return (
                  <label
                    key={address.id}
                    className={`relative flex cursor-pointer rounded-xl p-4 shadow-sm focus:outline-none ${
                      isSelected
                        ? "border-2 border-primary bg-primary/5 dark:bg-primary/10"
                        : "border border-[#e7d5cf] bg-transparent hover:border-primary/50 dark:border-[#3d2a23] dark:hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedAddressId(address.id)}
                  >
                    <input
                      className="sr-only"
                      name="shipping-address"
                      type="radio"
                      value={address.id}
                      checked={isSelected}
                      onChange={() => setSelectedAddressId(address.id)}
                    />
                    <span className="flex flex-1">
                      <span className="flex flex-col">
                        <span className="block text-sm font-bold text-background-dark dark:text-[#f3eae7] mb-1">
                          {address.city}
                          {address.isPrimary && (
                            <span className="ml-2 inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">
                              Default
                            </span>
                          )}
                        </span>
                        <span className="mt-1 flex items-center text-sm text-[#9a5f4c] dark:text-[#c4a195]">
                          <span className="material-symbols-outlined mr-1.5 text-base">
                            person
                          </span>
                          {address.receiverName}
                        </span>
                        <span className="mt-1 flex items-center text-sm text-[#9a5f4c] dark:text-[#c4a195]">
                          <span className="material-symbols-outlined mr-1.5 text-base">
                            location_on
                          </span>
                          {address.addressLine}, {address.city}
                        </span>
                        <span className="mt-1 flex items-center text-sm text-[#9a5f4c] dark:text-[#c4a195]">
                          <span className="material-symbols-outlined mr-1.5 text-base">
                            phone
                          </span>
                          {address.phone}
                        </span>
                      </span>
                    </span>
                    {isSelected ? (
                      <span
                        className="material-symbols-outlined text-primary absolute top-4 right-4"
                        style={{ fontVariationSettings: '"FILL" 1' }}
                      >
                        check_circle
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-[#e7d5cf] dark:text-[#3d2a23] absolute top-4 right-4">
                        radio_button_unchecked
                      </span>
                    )}
                  </label>
                );
              })}
              {addresses.length === 0 && (
                <p className="text-sm text-[#9a5f4c] dark:text-[#c4a195] text-center py-4">
                  No addresses found. Please add a new address.
                </p>
              )}
            </div>
          </section>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-green-100 border border-green-200 text-green-800 rounded-lg dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
              <span className="material-symbols-outlined">check_circle</span>
              <span className="text-sm font-medium">
                Standard shipping (3-5 business days) applied to selected
                address.
              </span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-6">
            <section className="bg-white dark:bg-background-dark/50 p-6 rounded-xl border border-[#e7d5cf] dark:border-[#3d2a23] shadow-sm">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {order?.items.map((item) => (
                  <div key={item.productId} className="flex gap-4">
                    <div className="w-16 h-16 bg-[#f3eae7] dark:bg-[#3d2a23] rounded-lg overflow-hidden shrink-0">
                      <img
                        className="w-full h-full object-cover"
                        alt={item.productName}
                        src={item.imageUrl}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{item.productName}</p>
                      <p className="text-xs text-[#9a5f4c] dark:text-[#c4a195]">
                        Size: {item.size} | Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <hr className="border-[#e7d5cf] dark:border-[#3d2a23] mb-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#9a5f4c] dark:text-[#c4a195]">
                    Subtotal
                  </span>
                  <span className="font-medium">
                    {formatVndCurrency(order?.totalAmount ?? 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9a5f4c] dark:text-[#c4a195]">
                    Shipping
                  </span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-4 border-t border-[#e7d5cf] dark:border-[#3d2a23] mt-4">
                  <span>Total</span>
                  <span className="text-primary">
                    {formatVndCurrency(order?.totalAmount ?? 0)}
                  </span>
                </div>
              </div>
            </section>
            <div>
              <button
                disabled={!selectedAddressId}
                onClick={() => handlePayment()}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-transform active:scale-[0.98] shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Payment
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <p className="text-center text-[11px] text-[#9a5f4c] dark:text-[#c4a195] mt-4 flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[14px]">
                  lock
                </span>
                Secure encrypted checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCheckout;
