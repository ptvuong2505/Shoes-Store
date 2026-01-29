import useAuth from "@/hooks/useAuth";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const ForgotPassword = () => {
  const { sendOtp, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendOtp(email);
  };
  return (
    <>
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-250 w-full grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-[#2c1d18] rounded-2xl shadow-2xl overflow-hidden border border-[#e7d5cf] dark:border-[#3d2a23]">
          <div className="relative bg-primary/5 p-12 flex flex-col items-center justify-center text-center border-r border-[#e7d5cf] dark:border-[#3d2a23]">
            <div className="mb-8 p-8 bg-white dark:bg-[#1b110d] rounded-full shadow-lg">
              <span
                className="material-symbols-outlined text-primary text-8xl!"
                style={{
                  fontVariationSettings:
                    '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 48',
                }}
              >
                lock_reset
              </span>
            </div>
            <h1 className="text-3xl font-black mb-4 text-[#1b110d] dark:text-white leading-tight">
              Secure Your Step.
            </h1>
            <p className="text-[#9a5f4c] dark:text-[#b08e84] text-base max-w-xs mx-auto">
              Don't worry, even the best athletes trip sometimes. Let's get you
              back on track with a new password.
            </p>
          </div>
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <div className="flex flex-col gap-2 mb-8">
              <h2 className="text-[#1b110d] dark:text-[#fcf9f8] text-3xl font-black leading-tight tracking-[-0.033em]">
                Forgot Password?
              </h2>
              <p className="text-[#9a5f4c] dark:text-[#b08e84] text-base font-normal">
                Enter your email address and we'll send you a 6-digit code to
                reset your password.
              </p>
            </div>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                {error && (
                  <div className="flex items-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 gap-3">
                    <span className="material-symbols-outlined text-red-600 dark:text-red-400">
                      error
                    </span>
                    <p className=" text-red-700 dark:text-red-300 text-sm font-medium">
                      {error}
                    </p>
                  </div>
                )}
                <label className="text-[#1b110d] dark:text-[#fcf9f8] text-sm font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">
                    mail
                  </span>
                  Email Address
                </label>
                <input
                  className="form-input w-full rounded-lg text-[#1b110d] dark:text-[#fcf9f8] border-[#e7d5cf] dark:border-[#3d2a23] bg-[#fcf9f8] dark:bg-[#1b110d] h-12 placeholder:text-[#9a5f4c]/50 px-4 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Enter your registered email"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                className={`${loading ? "opacity-50 cursor-not-allowed" : ""} mt-2 flex w-full cursor-pointer items-center justify-center rounded-lg h-14 px-4 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 `}
                type="submit"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
              <div className="mt-4 text-center">
                <NavLink
                  to="/auth/login"
                  className="flex items-center justify-center gap-2 text-sm text-primary font-bold hover:underline group"
                >
                  <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">
                    arrow_back
                  </span>
                  Back to Login
                </NavLink>
              </div>
            </form>
            <div className="mt-12 pt-8 border-t border-[#e7d5cf] dark:border-[#3d2a23]">
              <div className="bg-primary/5 p-4 rounded-lg flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl">
                  info
                </span>
                <p className="text-xs text-[#9a5f4c] leading-relaxed">
                  If you don't receive an email within 60 seconds, check your
                  spam folder or try re-entering your email address.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
