import useAuth from "@/hooks/useAuth";
import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Register() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { success, error, loading, register } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register({ userName, email, password, phone, confirmPassword });
  };
  return (
    <>
      <div className="flex items-center justify-center py-12 px-4">
        <div className="max-w-275 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white dark:bg-[#2c1d18] rounded-xl shadow-xl overflow-hidden border border-[#e7d5cf] dark:border-[#3d2a23]">
          {/* Left Side: Image/Branding (Hidden on mobile) */}
          <div className="relative hidden lg:block bg-primary/10 overflow-hidden">
            <img
              alt="Bright red running shoe on simple background"
              className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80"
              data-alt="Modern red athletic shoe high quality lifestyle photo"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDq5nFbQ8wPP-hx6sYIT4PL5mEOoinUTEUpQIO_8XIf3Buq859gnJADEsNyZuZ6_JE03PTdQEbcy-ov1N1A4dvsmucuDLqSJPcyoFMkmAH4zXI1g85WBOnL0mXUIwv4H6zQbsEiGFQnOOaA67nQxr75QE4fy0fA_b57x2YLFuoifYQVV8rxVJfNIDRvCyHepGxQxaak65-Nvp-sPs7pcEC6VVB6rvxhEeX8YN5h0NwtvOgmjqws7KivBaUNjX8f7H0sIs25acVdylg"
            />
            <div className="relative z-10 h-full flex flex-col justify-end p-12 text-white bg-linear-to-t from-primary/80 to-transparent">
              <h1 className="text-5xl font-black mb-4">
                Step into the future.
              </h1>
              <p className="text-lg opacity-90 max-w-sm">
                Join our community and get exclusive access to limited drops,
                personalized recommendations, and member-only rewards.
              </p>
            </div>
          </div>
          {/* Right Side: Registration Form */}
          <div className="p-8 md:p-12 lg:p-16">
            {/* Success Message Example (Hidden by default, shown for user view) */}
            {error && (
              <div className=" mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
                <span className="material-symbols-outlined text-red-600 dark:text-red-400">
                  error
                </span>
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  {error}
                </p>
              </div>
            )}
            {success && (
              <div className=" mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
                <span className="material-symbols-outlined text-green-600 dark:text-green-400">
                  check_circle
                </span>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  {success}
                </p>
              </div>
            )}
            <div className="flex flex-col gap-2 mb-8">
              <h2 className="text-[#1b110d] dark:text-[#fcf9f8] text-3xl font-black leading-tight tracking-[-0.033em]">
                Create your Account
              </h2>
              <p className="text-[#9a5f4c] dark:text-[#b08e84] text-base font-normal">
                Ready for your next pair of favorites?
              </p>
            </div>
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <label className="text-[#1b110d] dark:text-[#fcf9f8] text-sm font-semibold">
                  Full Name
                </label>
                <input
                  className="form-input w-full rounded-lg text-[#1b110d] dark:text-[#fcf9f8] border-[#e7d5cf] dark:border-[#3d2a23] bg-[#fcf9f8] dark:bg-[#1b110d] h-12 placeholder:text-[#9a5f4c] px-4 focus:ring-primary focus:border-primary transition-all"
                  placeholder="John Doe"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-[#1b110d] dark:text-[#fcf9f8] text-sm font-semibold">
                  Email
                </label>
                <input
                  className="form-input w-full rounded-lg text-[#1b110d] dark:text-[#fcf9f8] border-[#e7d5cf] dark:border-[#3d2a23] bg-[#fcf9f8] dark:bg-[#1b110d] h-12 placeholder:text-[#9a5f4c] px-4 focus:ring-primary focus:border-primary transition-all"
                  placeholder="name@email.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {/* Phone Number */}
              <div className="flex flex-col gap-2">
                <label className="text-[#1b110d] dark:text-[#fcf9f8] text-sm font-semibold">
                  Phone Number
                </label>
                <input
                  className="form-input w-full rounded-lg text-[#1b110d] dark:text-[#fcf9f8] border-[#e7d5cf] dark:border-[#3d2a23] bg-[#fcf9f8] dark:bg-[#1b110d] h-12 placeholder:text-[#9a5f4c] px-4 focus:ring-primary focus:border-primary transition-all"
                  placeholder="+1 (555) 000-0000"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              {/* Password Fields Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[#1b110d] dark:text-[#fcf9f8] text-sm font-semibold">
                    Password
                  </label>
                  <input
                    className="form-input w-full rounded-lg text-[#1b110d] dark:text-[#fcf9f8] border-[#e7d5cf] dark:border-[#3d2a23] bg-[#fcf9f8] dark:bg-[#1b110d] h-12 placeholder:text-[#9a5f4c] px-4 focus:ring-primary focus:border-primary transition-all"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#1b110d] dark:text-[#fcf9f8] text-sm font-semibold">
                    Confirm Password
                  </label>
                  <input
                    className="form-input w-full rounded-lg text-[#1b110d] dark:text-[#fcf9f8] border-[#e7d5cf] dark:border-[#3d2a23] bg-[#fcf9f8] dark:bg-[#1b110d] h-12 placeholder:text-[#9a5f4c] px-4 focus:ring-primary focus:border-primary transition-all"
                    placeholder="••••••••"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                className={`${loading ? "opacity-50 cursor-not-allowed" : ""} mt-4 flex w-full cursor-pointer items-center justify-center rounded-lg h-14 px-4 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/20`}
                type="submit"
                disabled={loading}
              >
                Register Account{loading ? "..." : ""}
              </button>
              {/* Redirection */}
              <div className="mt-4 text-center">
                <p className="text-sm text-[#9a5f4c] dark:text-[#b08e84]">
                  Already have an account?
                  <NavLink to="/auth/login">
                    <span className="text-primary font-bold hover:underline ml-1">
                      Log in instead
                    </span>
                  </NavLink>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
