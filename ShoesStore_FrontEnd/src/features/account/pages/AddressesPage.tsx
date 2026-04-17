import { useEffect, useState } from "react";
import type { Address } from "@/features/account/types/address.types";
import { accountApi } from "@/features/account/api/account.api";

const AddressesPage = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState<Omit<Address, "id">>({
    receiverName: "",
    phone: "",
    addressLine: "",
    city: "",
    isPrimary: false,
  });

  // ===========================
  // FETCH WHEN PAGE LOAD
  // ===========================
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await accountApi.getAddresses();
        console.log("Fetched addresses:", data);
        setAddresses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  // ===========================
  // HANDLE INPUT CHANGE
  // ===========================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ===========================
  // HANDLE SUBMIT
  // ===========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await accountApi.create(formData);

      // fetch lại danh sách
      const data = await accountApi.getAddresses();
      setAddresses(data);

      setShowForm(false);

      // reset form
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

  const handleSetPrimary = async (id: string) => {
    try {
      await accountApi.setPrimary(id);

      // reload lại danh sách
      const data = await accountApi.getAddresses();
      setAddresses(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this address?",
    );

    if (!confirmDelete) return;

    try {
      await accountApi.deleteAddress(id);

      // reload lại danh sách
      const data = await accountApi.getAddresses();
      setAddresses(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="md:col-span-3 space-y-8">
      {/* BUTTON OR FORM */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="p-6 border-2 border-dashed rounded-xl"
        >
          Add New Address
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-xl border space-y-4"
        >
          <input
            name="receiverName"
            placeholder="Receiver Name"
            value={formData.receiverName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="addressLine"
            placeholder="Address Line"
            value={formData.addressLine}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPrimary"
              checked={formData.isPrimary}
              onChange={handleChange}
            />
            Set as primary
          </label>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded"
            >
              Save
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ADDRESS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <div key={address.id} className="p-4 border rounded-xl bg-white">
            <div className="flex justify-between">
              <h3 className="font-bold">{address.receiverName}</h3>
              {address.isPrimary ? (
                <span className="text-xs bg-primary text-white px-2 py-1 rounded">
                  Default
                </span>
              ) : (
                <button
                  onClick={() => handleSetPrimary(address.id)}
                  className="text-xs cursor-pointer bg-gray-200 text-gray-700 px-2 py-1 rounded"
                >
                  Set as Default
                </button>
              )}
            </div>

            <div className="">
              <p className="text-sm mt-2">
                {address.addressLine}, {address.city}
              </p>

              <p className="text-sm text-gray-500 mt-1">{address.phone}</p>
              <button
                onClick={() => handleDelete(address.id)}
                className="text-sm hover:border-2 hover:border-red-500 rounded-2xl px-2 py-1 text-red-500 mt-2"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressesPage;
