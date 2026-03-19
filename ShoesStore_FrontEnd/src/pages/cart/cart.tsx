import { cartApi } from "@/api/cart.api";
import { orderApi } from "@/api/order.api";
import { formatVndCurrency } from "@/lib/currency";
import type { CartItem, CartResponse } from "@/types/cart.types";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80";

const asNumber = (value: unknown, defaultValue = 0) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : defaultValue;
  }
  return defaultValue;
};

const normalizeCartItem = (
  item: Record<string, unknown>,
  index: number,
): CartItem => {
  const quantity = Math.max(1, asNumber(item.quantity, 1));
  const unitPrice = asNumber(item.unitPrice ?? item.price, 0);

  return {
    id: String(item.id ?? `${item.productId ?? "item"}-${index}`),
    productId: String(item.productId ?? item.id ?? ""),
    productName: String(item.productName ?? item.name ?? "Unnamed product"),
    variantLabel:
      typeof item.variantLabel === "string" ? item.variantLabel : undefined,
    color: typeof item.color === "string" ? item.color : undefined,
    size: String(item.size ?? "N/A"),
    quantity,
    unitPrice,
    imageUrl:
      typeof item.imageUrl === "string" && item.imageUrl
        ? item.imageUrl
        : FALLBACK_IMAGE,
    isAvailable: item.isAvailable !== false,
    selected: item.isAvailable !== false,
  };
};

const normalizeCartResponse = (data: unknown): CartResponse => {
  if (Array.isArray(data)) {
    return {
      items: data.map((item, index) =>
        normalizeCartItem(item as Record<string, unknown>, index),
      ),
    };
  }

  if (data && typeof data === "object") {
    const payload = data as Record<string, unknown>;
    const rawItems = Array.isArray(payload.items) ? payload.items : [];
    return {
      items: rawItems.map((item, index) =>
        normalizeCartItem(item as Record<string, unknown>, index),
      ),
      summary:
        payload.summary && typeof payload.summary === "object"
          ? (payload.summary as CartResponse["summary"])
          : undefined,
    };
  }

  return { items: [] };
};

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Cart - ShoesStore";

    const fetchCart = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await cartApi.getMyCart();
        const normalized = normalizeCartResponse(data);
        setCartItems(normalized.items);
      } catch (err) {
        console.error(err);
        setError("Cannot load cart data. Please refresh and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  const availableItems = useMemo(
    () => cartItems.filter((item) => item.isAvailable),
    [cartItems],
  );

  const selectedItems = useMemo(
    () => availableItems.filter((item) => item.selected),
    [availableItems],
  );

  const selectedSubtotal = useMemo(
    () =>
      selectedItems.reduce(
        (total, item) => total + item.unitPrice * item.quantity,
        0,
      ),
    [selectedItems],
  );

  const selectedQuantity = useMemo(
    () => selectedItems.reduce((total, item) => total + item.quantity, 0),
    [selectedItems],
  );

  const totalPrice = selectedSubtotal;

  const isAllSelected =
    availableItems.length > 0 &&
    availableItems.every((item) => item.selected === true);

  const toggleAll = (checked: boolean) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.isAvailable ? { ...item, selected: checked } : item,
      ),
    );
  };

  const toggleItem = (id: string, checked: boolean) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: checked } : item,
      ),
    );
  };

  const updateQuantity = (id: string, change: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== id || !item.isAvailable) return item;
        return { ...item, quantity: Math.max(1, item.quantity + change) };
      }),
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const removeSelected = () => {
    setCartItems((prev) => prev.filter((item) => !item.selected));
  };

  const handleCheckout = async () => {
    if (selectedItems.length === 0 || isCheckingOut) return;

    const payload = selectedItems
      .map((item) => ({
        productId: asNumber(item.productId, 0),
        size: asNumber(item.size, 0),
        quantity: item.quantity,
      }))
      .filter(
        (item) => item.productId > 0 && item.size > 0 && item.quantity > 0,
      );

    if (payload.length === 0) {
      setCheckoutError("Selected items are invalid for checkout.");
      return;
    }

    setCheckoutError(null);
    setIsCheckingOut(true);
    try {
      const checkoutResponse = await orderApi.checkoutCart(payload);
      const orderId =
        typeof checkoutResponse === "string"
          ? checkoutResponse
          : checkoutResponse.id;

      if (!orderId) {
        setCheckoutError("Checkout succeeded but no order id was returned.");
        return;
      }

      navigate(`/orders/checkout/${orderId}`, { replace: true });
    } catch (err) {
      console.error(err);
      setCheckoutError("Checkout failed. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-300 mx-auto px-4 md:px-10 py-8 min-h-screen">
        <h1 className="text-3xl font-extrabold mb-8">Your Cart</h1>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900">
          Loading cart...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-300 mx-auto px-4 md:px-10 py-8 min-h-screen">
        <h1 className="text-3xl font-extrabold mb-8">Your Cart</h1>
        <div className="rounded-xl border border-red-200 dark:border-red-900 p-6 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-300 mx-auto px-4 md:px-10 py-8 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-8">
        Your Cart ({cartItems.length} Items)
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                type="checkbox"
                checked={isAllSelected}
                onChange={(e) => toggleAll(e.target.checked)}
                disabled={availableItems.length === 0}
              />
              <span className="font-bold text-sm">
                Select All ({availableItems.length})
              </span>
            </div>
            <button
              className="text-sm text-gray-500 hover:text-red-500 font-semibold transition-colors disabled:opacity-50"
              onClick={removeSelected}
              disabled={selectedItems.length === 0}
            >
              Remove Selected
            </button>
          </div>

          {cartItems.length === 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 text-center shadow-sm border border-gray-100 dark:border-gray-800">
              <p className="text-lg font-bold mb-2">Your cart is empty</p>
              <p className="text-gray-500 text-sm">
                Add products to your cart to continue shopping.
              </p>
            </div>
          )}

          {cartItems.map((item) => {
            const totalItemPrice = item.unitPrice * item.quantity;

            return (
              <div
                key={item.id}
                className={`bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex gap-4 sm:gap-6 group relative ${
                  item.isAvailable
                    ? ""
                    : "opacity-75 hover:opacity-100 transition-opacity"
                }`}
              >
                <div className="flex items-center">
                  <input
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    type="checkbox"
                    checked={item.selected}
                    onChange={(e) => toggleItem(item.id, e.target.checked)}
                    disabled={!item.isAvailable}
                  />
                </div>
                <div className="size-24 sm:size-32 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700">
                  <div
                    className={`w-full h-full bg-center bg-cover ${item.isAvailable ? "" : "grayscale"}`}
                    style={{ backgroundImage: `url("${item.imageUrl}")` }}
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3
                          className={`font-bold text-lg leading-tight ${
                            item.isAvailable ? "" : "text-gray-500"
                          }`}
                        >
                          {item.productName}
                        </h3>
                        <p
                          className={`text-sm mt-1 ${
                            item.isAvailable ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          {item.variantLabel ?? item.color ?? "Default"}
                        </p>
                      </div>
                      <button
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        onClick={() => removeItem(item.id)}
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </button>
                    </div>
                    <div
                      className={`mt-2 inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded px-2 py-1 text-xs font-semibold ${
                        item.isAvailable
                          ? "text-gray-600 dark:text-gray-300"
                          : "text-gray-500"
                      }`}
                    >
                      Size: {item.size}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-4">
                    <div
                      className={`flex items-center border border-gray-200 dark:border-gray-700 rounded-lg h-9 w-fit bg-white dark:bg-gray-900 ${
                        item.isAvailable ? "" : "opacity-50 pointer-events-none"
                      }`}
                    >
                      <button
                        className="w-8 h-full flex items-center justify-center hover:text-primary transition-colors"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <span className="material-symbols-outlined text-sm">
                          remove
                        </span>
                      </button>
                      <span className="w-8 text-center text-sm font-bold">
                        {item.quantity}
                      </span>
                      <button
                        className="w-8 h-full flex items-center justify-center hover:text-primary transition-colors"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <span className="material-symbols-outlined text-sm">
                          add
                        </span>
                      </button>
                    </div>
                    <div className="text-right">
                      <span
                        className={`block text-xs ${
                          item.isAvailable ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        {formatVndCurrency(item.unitPrice)} / unit
                      </span>
                      <span
                        className={`font-extrabold text-xl ${
                          item.isAvailable ? "text-primary" : "text-gray-400"
                        }`}
                      >
                        {formatVndCurrency(totalItemPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="lg:col-span-4">
          <div className="sticky top-28 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-extrabold mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                Order Summary
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Selected Items
                  </span>
                  <span className="font-bold">{selectedItems.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total Quantity
                  </span>
                  <span className="font-bold">{selectedQuantity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Subtotal
                  </span>
                  <span className="font-bold">
                    {formatVndCurrency(selectedSubtotal)}
                  </span>
                </div>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mb-6">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-lg">Total Price</span>
                  <span className="font-black text-2xl text-primary">
                    {formatVndCurrency(totalPrice)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-right">
                  Calculated based on selected items only.
                </p>
              </div>
              <button
                className="w-full bg-primary text-white font-extrabold rounded-lg py-4 flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 mb-4 disabled:opacity-50"
                onClick={handleCheckout}
                disabled={selectedItems.length === 0 || isCheckingOut}
              >
                {isCheckingOut ? "PROCESSING..." : "PROCEED TO CHECKOUT"}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              {checkoutError && (
                <p className="text-sm text-red-500 text-center mb-3">{checkoutError}</p>
              )}
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <span className="material-symbols-outlined text-sm">lock</span>
                <span className="text-xs font-semibold">Secure Checkout</span>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                Have a promo code?
              </label>
              <div className="flex gap-2">
                <input
                  className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm px-3 py-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter code"
                  type="text"
                />
                <button className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black font-bold text-xs rounded-lg uppercase hover:opacity-90">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
