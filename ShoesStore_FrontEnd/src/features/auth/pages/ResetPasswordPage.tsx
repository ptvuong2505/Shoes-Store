import { authApi } from "@/features/auth/api/auth.api";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setLoading(true);
      await authApi.resetPassword({
        email,
        newPassword,
        confirmPassword,
      });
      setSuccess("Password reset successfully. Redirecting to login...");
      setTimeout(() => {
        navigate("/auth/login", { replace: true });
      }, 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || "Reset password failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <div className="max-w-xl w-full bg-white dark:bg-[#2c1d18] rounded-xl shadow-xl border border-[#e7d5cf] dark:border-[#3d2a23] p-8 md:p-12">
        <div className="flex flex-col gap-2 mb-8">
          <h2 className="text-[#1b110d] dark:text-[#fcf9f8] text-3xl font-black leading-tight tracking-[-0.033em]">
            Reset Password
          </h2>
          <p className="text-[#9a5f4c] dark:text-[#b08e84] text-base font-normal">
            Create a new password for <span className="font-bold">{email}</span>
          </p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
              {success}
            </div>
          )}

          <input
            className="form-input w-full rounded-lg border-[#e7d5cf] dark:border-[#3d2a23] bg-[#fcf9f8] dark:bg-[#1b110d] h-12 px-4"
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <input
            className="form-input w-full rounded-lg border-[#e7d5cf] dark:border-[#3d2a23] bg-[#fcf9f8] dark:bg-[#1b110d] h-12 px-4"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            className={`${loading ? "opacity-50 cursor-not-allowed" : ""} flex w-full items-center justify-center rounded-lg h-14 px-4 bg-primary text-white text-base font-bold`}
            type="submit"
            disabled={loading || !email}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};
