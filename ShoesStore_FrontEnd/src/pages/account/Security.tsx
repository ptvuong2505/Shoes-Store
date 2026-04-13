import { accountApi } from "@/api/account.api";
import { useState } from "react";

const Security = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      alert("Confirm password does not match");
      return;
    }

    try {
      setLoading(true);

      await accountApi.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      alert("Password updated successfully");
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      alert(err.response?.data?.message || "Change password failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:col-span-3 space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight">
          Security Settings
        </h1>
        <p className="text-[#9a5f4c] dark:text-[#b08e84]">
          Manage your password, two-factor authentication.
        </p>
      </div>
      <div className="bg-white dark:bg-[#2c1d18] rounded-xl border border-[#e7d5cf] dark:border-[#3d2a23] shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-[#e7d5cf] dark:border-[#3d2a23]">
          <h3 className="text-lg font-bold">Change Password</h3>
          <p className="text-sm text-[#9a5f4c] dark:text-[#b08e84]">
            We recommend using a unique password that you don't use elsewhere.
          </p>
        </div>
        <form className="p-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-semibold">Current Password</label>
              <input
                className="form-input w-full md:w-1/2 rounded-lg border-[#e7d5cf] dark:border-[#3d2a23] bg-[#fcf9f8] dark:bg-background-dark h-12 px-4 focus:ring-primary focus:border-primary transition-all"
                value={form.currentPassword}
                onChange={handleChange}
                name="currentPassword"
                type="password"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">New Password</label>
              <input
                className="form-input w-full rounded-lg border-[#e7d5cf] dark:border-[#3d2a23] bg-[#fcf9f8] dark:bg-background-dark h-12 px-4 focus:ring-primary focus:border-primary transition-all"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                type="password"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">
                Confirm New Password
              </label>
              <input
                className="form-input w-full rounded-lg border-[#e7d5cf] dark:border-[#3d2a23] bg-[#fcf9f8] dark:bg-background-dark h-12 px-4 focus:ring-primary focus:border-primary transition-all"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                type="password"
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button
              className={`px-8 py-3 bg-primary text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              type="submit"
              disabled={loading}
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
      {/* <div className="bg-white dark:bg-[#2c1d18] rounded-xl border border-[#e7d5cf] dark:border-[#3d2a23] shadow-sm overflow-hidden">
        <div className="p-8 flex items-center justify-between">
          <div className="flex gap-4">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">
                verified_user
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold">
                Two-Factor Authentication (2FA)
              </h3>
              <p className="text-sm text-[#9a5f4c] dark:text-[#b08e84] mt-1">
                Add an extra layer of security to your account by requiring a
                code from your phone.
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              defaultChecked=""
              className="sr-only peer"
              type="checkbox"
              defaultValue=""
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary" />
          </label>
        </div>
      </div> */}
      {/* <div className="bg-white dark:bg-[#2c1d18] rounded-xl border border-[#e7d5cf] dark:border-[#3d2a23] shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-[#e7d5cf] dark:border-[#3d2a23] flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Active Sessions</h3>
            <p className="text-sm text-[#9a5f4c] dark:text-[#b08e84]">
              These are the devices that have logged into your account.
            </p>
          </div>
          <button className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors">
            Log out from all other devices
          </button>
        </div>
        <div className="p-0">
          <div className="flex items-center justify-between px-8 py-6 border-b border-[#e7d5cf] dark:border-[#3d2a23]">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-[#9a5f4c] dark:text-[#b08e84] text-3xl">
                desktop_windows
              </span>
              <div>
                <p className="font-bold text-sm">Chrome on Windows 11</p>
                <p className="text-xs text-[#9a5f4c] dark:text-[#b08e84]">
                  San Francisco, USA •{" "}
                  <span className="text-primary font-medium">
                    Current Session
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between px-8 py-6 border-b border-[#e7d5cf] dark:border-[#3d2a23]">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-[#9a5f4c] dark:text-[#b08e84] text-3xl">
                smartphone
              </span>
              <div>
                <p className="font-bold text-sm">ShoeStore App on iPhone 15</p>
                <p className="text-xs text-[#9a5f4c] dark:text-[#b08e84]">
                  San Francisco, USA • 2 hours ago
                </p>
              </div>
            </div>
            <button className="px-4 py-2 text-xs font-bold bg-[#fcf9f8] dark:bg-[#1b110d] border border-[#e7d5cf] dark:border-[#3d2a23] rounded-lg hover:bg-gray-100 dark:hover:bg-[#2c1d18] transition-colors">
              Log out
            </button>
          </div>
          <div className="flex items-center justify-between px-8 py-6">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-[#9a5f4c] dark:text-[#b08e84] text-3xl">
                tablet_mac
              </span>
              <div>
                <p className="font-bold text-sm">Safari on iPad Pro</p>
                <p className="text-xs text-[#9a5f4c] dark:text-[#b08e84]">
                  New York, USA • Yesterday
                </p>
              </div>
            </div>
            <button className="px-4 py-2 text-xs font-bold bg-[#fcf9f8] dark:bg-[#1b110d] border border-[#e7d5cf] dark:border-[#3d2a23] rounded-lg hover:bg-gray-100 dark:hover:bg-[#2c1d18] transition-colors">
              Log out
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Security;
