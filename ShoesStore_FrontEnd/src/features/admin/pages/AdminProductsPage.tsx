import { productApi } from "@/features/product/api/product.api";
import { formatVndCurrency } from "@/shared/lib/currency";
import type {
  AdminProductItem,
  AdminProductSummary,
  AdminUpsertProductPayload,
} from "@/features/product/types/product.types";
import { useCallback, useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 10;

interface ProductFormState {
  name: string;
  brand: string;
  price: string;
  discountPrice: string;
  totalStock: string;
  size: string;
  mainImageUrl: string;
  description: string;
  gender: string;
}

const defaultFormState: ProductFormState = {
  name: "",
  brand: "",
  price: "",
  discountPrice: "",
  totalStock: "0",
  size: "42",
  mainImageUrl: "",
  description: "",
  gender: "Unisex",
};

const getStatusClass = (status: string) => {
  const normalized = status.toLowerCase();

  if (normalized.includes("out")) {
    return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
  }

  if (normalized.includes("low")) {
    return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
  }

  return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
};

const AdminProductsPage = () => {
  const [products, setProducts] = useState<AdminProductItem[]>([]);
  const [summary, setSummary] = useState<AdminProductSummary | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(defaultFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await productApi.getAdminProducts(page, PAGE_SIZE, search);

      setProducts(result.data.items);
      setTotalPages(result.data.totalPages || 1);
      setTotalItems(result.data.totalItems || 0);
      setSummary(result.summary);
    } catch {
      setError("Khong the tai du lieu san pham. Vui long thu lai.");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const fromItem = useMemo(() => {
    if (totalItems === 0) return 0;
    return (page - 1) * PAGE_SIZE + 1;
  }, [page, totalItems]);

  const toItem = useMemo(() => {
    return Math.min(page * PAGE_SIZE, totalItems);
  }, [page, totalItems]);

  const openAddModal = () => {
    setIsEditMode(false);
    setEditingId(null);
    setForm(defaultFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (product: AdminProductItem) => {
    setIsEditMode(true);
    setEditingId(product.id);
    setForm({
      name: product.name,
      brand: product.brand,
      price: String(product.price),
      discountPrice: "",
      totalStock: String(product.totalStock),
      size: "42",
      mainImageUrl: product.mainImageUrl ?? "",
      description: "",
      gender: "Unisex",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsSubmitting(false);
  };

  const handleFormChange = (field: keyof ProductFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const mapFormToPayload = (): AdminUpsertProductPayload | null => {
    const price = Number(form.price);
    const discountPrice = form.discountPrice.trim()
      ? Number(form.discountPrice)
      : undefined;
    const totalStock = Number(form.totalStock);
    const size = Number(form.size);

    if (
      !form.name.trim() ||
      !form.brand.trim() ||
      Number.isNaN(price) ||
      price <= 0
    ) {
      return null;
    }

    if (
      Number.isNaN(totalStock) ||
      totalStock < 0 ||
      Number.isNaN(size) ||
      size <= 0
    ) {
      return null;
    }

    if (
      discountPrice !== undefined &&
      (Number.isNaN(discountPrice) || discountPrice < 0)
    ) {
      return null;
    }

    return {
      name: form.name.trim(),
      brand: form.brand.trim(),
      price,
      discountPrice,
      totalStock,
      size,
      mainImageUrl: form.mainImageUrl.trim() || undefined,
      description: form.description.trim() || undefined,
      gender: form.gender.trim() || undefined,
    };
  };

  const handleSubmitForm = async () => {
    const payload = mapFormToPayload();
    if (!payload) {
      setError(
        "Vui long nhap dung cac truong bat buoc: Name, Brand, Price, Stock, Size.",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      if (isEditMode && editingId) {
        await productApi.updateAdminProduct(editingId, payload);
      } else {
        await productApi.createAdminProduct(payload);
      }

      closeModal();
      await fetchProducts();
    } catch {
      setError("Khong the luu san pham. Vui long thu lai.");
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (product: AdminProductItem) => {
    const confirmed = window.confirm(`Delete product ${product.name}?`);
    if (!confirmed) return;

    try {
      setError(null);
      await productApi.deleteAdminProduct(product.id);

      if (products.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await fetchProducts();
      }
    } catch {
      setError("Khong the xoa san pham. Vui long thu lai.");
    }
  };

  return (
    <>
      <div className="px-8 pt-8 pb-4">
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-slate-900 dark:text-white text-3xl font-extrabold tracking-tight">
              Product Management
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Review, edit, and track your global shoe inventory across all
              channels.
            </p>
          </div>
          <button
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-5 rounded-lg transition-all shadow-lg shadow-primary/20"
            onClick={openAddModal}
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="px-8 pb-3">
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
        </div>
      )}

      <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-background-dark/30 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
              Total Products
            </p>
            <span className="material-symbols-outlined text-slate-400">
              inventory
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {summary?.totalProducts ?? 0}
          </p>
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">
              monitoring
            </span>
            <span>Total in catalog</span>
          </p>
        </div>

        <div className="bg-white dark:bg-background-dark/30 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
              Out of Stock
            </p>
            <span className="material-symbols-outlined text-slate-400">
              error
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {summary?.outOfStockProducts ?? 0}
          </p>
          <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">warning</span>
            <span>Requires attention</span>
          </p>
        </div>

        <div className="bg-white dark:bg-background-dark/30 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
              Top Selling
            </p>
            <span className="material-symbols-outlined text-slate-400">
              star
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white truncate">
            {summary?.topSellingProductName ?? "N/A"}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            {summary?.topSellingUnits ?? 0} units sold
          </p>
        </div>

        <div className="bg-white dark:bg-background-dark/30 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
              Avg. Margin
            </p>
            <span className="material-symbols-outlined text-slate-400">
              payments
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {summary?.averageMarginPercent?.toFixed(1) ?? "0.0"}%
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Estimated from current prices
          </p>
        </div>
      </div>

      <div className="px-8 pb-4">
        <div className="flex flex-col lg:flex-row gap-4 bg-white dark:bg-background-dark/30 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800/50 border-none rounded-lg focus:ring-2 focus:ring-primary text-sm"
              placeholder="Search by product name or brand..."
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="px-8 pb-8 flex-1 overflow-hidden">
        <div className="bg-white dark:bg-background-dark/30 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col h-full shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Product
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Brand
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Price
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Total Stock
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading &&
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={`skeleton-${index}`}>
                      <td className="px-6 py-4" colSpan={6}>
                        <div className="h-12 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
                      </td>
                    </tr>
                  ))}

                {!loading && products.length === 0 && (
                  <tr>
                    <td
                      className="px-6 py-6 text-sm text-slate-500"
                      colSpan={6}
                    >
                      Khong co san pham nao phu hop.
                    </td>
                  </tr>
                )}

                {!loading &&
                  products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-12 rounded bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                            {product.mainImageUrl ? (
                              <img
                                src={product.mainImageUrl}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="material-symbols-outlined text-slate-400">
                                image
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                              {product.name}
                            </p>
                            <p className="text-xs text-slate-500 font-medium">
                              {product.sku}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                        {product.brand}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">
                        {formatVndCurrency(product.price)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {product.totalStock} units
                      </td>
                      <td className="px-6 py-4">
                        <span className={getStatusClass(product.stockStatus)}>
                          {product.stockStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            className="p-1.5 text-slate-400 hover:text-primary transition-colors rounded-md hover:bg-primary/5"
                            onClick={() => openEditModal(product)}
                          >
                            <span className="material-symbols-outlined text-xl">
                              edit
                            </span>
                          </button>
                          <button
                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50"
                            onClick={() => handleDelete(product)}
                          >
                            <span className="material-symbols-outlined text-xl">
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="mt-auto px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {fromItem}
              </span>{" "}
              to{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {toItem}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {totalItems}
              </span>{" "}
              results
            </p>
            <div className="flex items-center gap-2">
              <button
                className="p-2 border border-slate-300 dark:border-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
                disabled={page <= 1 || loading}
                onClick={() => setPage((prev) => prev - 1)}
              >
                <span className="material-symbols-outlined text-sm">
                  chevron_left
                </span>
              </button>
              <button className="size-8 flex items-center justify-center bg-primary text-white text-sm font-bold rounded">
                {page}
              </button>
              <button
                className="p-2 border border-slate-300 dark:border-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((prev) => prev + 1)}
              >
                <span className="material-symbols-outlined text-sm">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark/95 shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isEditMode ? "Edit Product" : "Add Product"}
              </h3>
              <button
                className="text-slate-500 hover:text-slate-900"
                onClick={closeModal}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/50"
                placeholder="Name*"
                value={form.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
              />
              <input
                className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/50"
                placeholder="Brand*"
                value={form.brand}
                onChange={(e) => handleFormChange("brand", e.target.value)}
              />
              <input
                className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/50"
                placeholder="Price*"
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => handleFormChange("price", e.target.value)}
              />
              <input
                className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/50"
                placeholder="Discount Price"
                type="number"
                min="0"
                value={form.discountPrice}
                onChange={(e) =>
                  handleFormChange("discountPrice", e.target.value)
                }
              />
              <input
                className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/50"
                placeholder="Stock*"
                type="number"
                min="0"
                value={form.totalStock}
                onChange={(e) => handleFormChange("totalStock", e.target.value)}
              />
              <input
                className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/50"
                placeholder="Size*"
                type="number"
                min="1"
                value={form.size}
                onChange={(e) => handleFormChange("size", e.target.value)}
              />
              <input
                className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/50 md:col-span-2"
                placeholder="Main Image URL"
                value={form.mainImageUrl}
                onChange={(e) =>
                  handleFormChange("mainImageUrl", e.target.value)
                }
              />
              <input
                className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/50"
                placeholder="Gender"
                value={form.gender}
                onChange={(e) => handleFormChange("gender", e.target.value)}
              />
              <input
                className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/50"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  handleFormChange("description", e.target.value)
                }
              />
            </div>

            <div className="px-6 pb-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700"
                onClick={closeModal}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-primary text-white font-semibold disabled:opacity-50"
                onClick={handleSubmitForm}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Saving..."
                  : isEditMode
                    ? "Save Changes"
                    : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminProductsPage;
