import { authApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/shared/state/auth.store";
import type { LoginPayload } from "@/features/auth/types/auth.types";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRemember, setIsRemember] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authApi.login({
        email,
        password,
        isRemember,
      } as LoginPayload);
      localStorage.setItem("accessToken", data.accessToken);
      useAuthStore.getState().login(data.user);
      navigate("/", { replace: true });
      console.log(data);
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full ">
      <div className="relative hidden md:flex md:w-1/2 lg:w-[60%] h-full bg-primary/10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuAkOnSGKWKITgBmTYExcVh3rmejXu31tWQOG8_HEoEy5rsnxquYyF3iDbnZy1TaMAXym41Fr4Km5M8I5Fd3KQB-lqmVTH54rbTsHBNALRZ2YS_53hkOlm3KjsTDCA2xxc6auRt7OL2JEP1ylrN4SqllkaQf49BnWV1NVXVGBKC4BJeXqdedrfcWL6kJEA3Tdy6pmO6Z_sWqe_2FrMuNrr3UjVGtBODuuB4fGzomJl8WPngftYsIDdE8TPzNXEZ22sX4IvBjZNOUuZE')]"
          data-alt="Lifestyle shot of premium white athletic sneakers on a minimalist background"
        ></div>
        <div className="absolute inset-0 bg-linear-to-t from-background-dark/60 to-transparent flex flex-col justify-end p-12 text-white">
          <h1 className="text-5xl font-extrabold leading-tight mb-4">
            Step into the <br />
            future of comfort.
          </h1>
          <p className="text-lg font-medium text-white/80 max-w-md">
            Join our community of sneaker enthusiasts and get exclusive access
            to limited drops and seasonal sales.
          </p>
        </div>
      </div>
      <div className="w-full md:w-1/2 lg:w-[40%] h-full flex flex-col items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-110 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h2 className="text-foreground text-3xl font-bold leading-tight tracking-[-0.015em]">
              Welcome back!
            </h2>
            <p className="text-[#9a5f4c] dark:text-white/60 text-base font-normal">
              Please enter your details to access your account and your
              wishlist.
            </p>
          </div>
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-background-dark dark:text-white text-sm font-semibold leading-normal">
                Email Address
              </label>
              <input
                className="form-input flex w-full min-w-0 flex-1 rounded-lg text-background-dark dark:text-white border border-[#e7d5cf] dark:border-white/10 bg-transparent focus:outline-0 focus:ring-1 focus:ring-primary h-14 placeholder:text-[#9a5f4c]/60 p-3.75 text-base font-normal"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-background-dark dark:text-white text-sm font-semibold leading-normal">
                Password
              </label>
              <div className="flex w-full flex-1 items-stretch rounded-lg group">
                <input
                  className="form-input flex w-full min-w-0 flex-1 rounded-lg rounded-r-none border-r-0 text-background-dark dark:text-white border border-[#e7d5cf] dark:border-white/10 bg-transparent focus:outline-0 focus:ring-0 h-14 placeholder:text-[#9a5f4c]/60 p-3.75 text-base font-normal"
                  placeholder="Enter your password"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="text-[#9a5f4c] dark:text-white/60 flex border border-[#e7d5cf] dark:border-white/10 bg-transparent items-center justify-center pr-3.75 rounded-r-lg border-l-0 cursor-pointer hover:text-primary">
                  <button
                    onClick={() => setShow(!show)}
                    type="button"
                    className="flex items-center w-full h-full"
                  >
                    <span className="material-symbols-outlined">
                      visibility_off
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-x-2 cursor-pointer">
                <input
                  className="h-5 w-5 rounded border-[#e7d5cf] dark:border-white/10 bg-transparent text-primary focus:ring-primary focus:ring-offset-0 focus:outline-none"
                  type="checkbox"
                  checked={isRemember}
                  onChange={(e) => setIsRemember(e.target.checked)}
                />
                <span className="text-background-dark dark:text-white/80 text-sm font-medium">
                  Remember me
                </span>
              </label>
              <NavLink
                to="/auth/forgot-password"
                className="text-primary text-sm font-bold hover:underline"
              >
                Forgot password?
              </NavLink>
            </div>
            <button
              disabled={loading}
              className={`${loading ? "opacity-50 cursor-not-allowed" : ""} flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-5 bg-primary text-white text-base font-bold leading-normal tracking-wide shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all`}
              type="submit"
            >
              <span className="truncate">
                {loading ? "Signing In..." : "Sign In"}
              </span>
            </button>
          </form>
          <div className="flex items-center gap-4 py-2">
            <div className="h-px bg-[#e7d5cf] dark:bg-white/10 grow"></div>
            <span className="text-xs font-bold text-[#9a5f4c] uppercase tracking-widest">
              Or continue with
            </span>
            <div className="h-px bg-[#e7d5cf] dark:bg-white/10 grow"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 h-12 border border-[#e7d5cf] dark:border-white/10 rounded-lg bg-white dark:bg-transparent hover:bg-background-light dark:hover:bg-white/5 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                ></path>
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                ></path>
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                ></path>
              </svg>
              <span className="text-sm font-bold text-background-dark dark:text-white">
                Google
              </span>
            </button>
            <button className="flex items-center justify-center gap-2 h-12 border border-[#e7d5cf] dark:border-white/10 rounded-lg bg-white dark:bg-transparent hover:bg-background-light dark:hover:bg-white/5 transition-colors">
              <span className="material-symbols-outlined text-background-dark dark:text-white text-[22px]">
                ios
              </span>
              <span className="text-sm font-bold text-background-dark dark:text-white">
                Apple
              </span>
            </button>
          </div>
          <div className="text-center mt-4">
            <p className="text-background-dark dark:text-white/80 text-sm font-medium">
              Don't have an account?
              <NavLink
                to="/auth/register"
                className="text-primary font-bold hover:underline ml-1"
              >
                Sign up for free
              </NavLink>
            </p>
          </div>
        </div>
        <div className="mt-12 text-[#9a5f4c]/60 text-[11px] font-medium tracking-tight uppercase flex gap-4">
          <a className="hover:text-primary transition-colors" href="#">
            Privacy Policy
          </a>
          <span>•</span>
          <a className="hover:text-primary transition-colors" href="#">
            Terms of Service
          </a>
          <span>•</span>
          <span>© 2024 Urban Sole</span>
        </div>
      </div>
    </div>
  );
}
