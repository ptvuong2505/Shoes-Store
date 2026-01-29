import useAuth from "@/hooks/useAuth";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const OTP_LENGTH = 6;
const RESEND_TIME = 120; // giây

export const OtpVerification = () => {
  const { loading, error, verifyOtp } = useAuth();
  const location = useLocation();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timeLeft, setTimeLeft] = useState(RESEND_TIME);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const email = location.state?.email;

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleResend = () => {
    // gọi API resend OTP ở đây
    console.log("Resend OTP");
    setOtp(Array(OTP_LENGTH).fill(""));
    inputsRef.current[0]?.focus();
    setTimeLeft(RESEND_TIME);
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return; // chỉ cho số
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const otpValue = otp.join("").length < 6;

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("text").slice(0, OTP_LENGTH);
    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = pasteData.split("");
    setOtp([...newOtp, ...Array(OTP_LENGTH - newOtp.length).fill("")]);

    inputsRef.current[pasteData.length - 1]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyOtp(email, otp.join(""));
  };

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <div className="max-w-250 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white dark:bg-[#2c1d18] rounded-xl shadow-xl overflow-hidden border border-[#e7d5cf] dark:border-[#3d2a23]">
        <div className="relative hidden lg:block bg-primary/10 overflow-hidden">
          <img
            alt="Athletic shoes details"
            className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDq5nFbQ8wPP-hx6sYIT4PL5mEOoinUTEUpQIO_8XIf3Buq859gnJADEsNyZuZ6_JE03PTdQEbcy-ov1N1A4dvsmucuDLqSJPcyoFMkmAH4zXI1g85WBOnL0mXUIwv4H6zQbsEiGFQnOOaA67nQxr75QE4fy0fA_b57x2YLFuoifYQVV8rxVJfNIDRvCyHepGxQxaak65-Nvp-sPs7pcEC6VVB6rvxhEeX8YN5h0NwtvOgmjqws7KivBaUNjX8f7H0sIs25acVdylg"
          />
          <div className="relative z-10 h-full flex flex-col justify-end p-12 text-white bg-linear-to-t from-primary/80 to-transparent">
            <h1 className="text-5xl font-black mb-4">Security first.</h1>
            <p className="text-lg opacity-90 max-w-sm">
              We've sent a verification code to your email. Please enter it to
              continue resetting your password.
            </p>
          </div>
        </div>
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="flex flex-col gap-2 mb-8">
            <h2 className="text-[#1b110d] dark:text-[#fcf9f8] text-3xl font-black leading-tight tracking-[-0.033em]">
              Verify OTP
            </h2>
            <p className="text-[#9a5f4c] dark:text-[#b08e84] text-base font-normal">
              Please enter the 6-digit code sent to{" "}
              <span className="font-bold text-[#1b110d] dark:text-[#fcf9f8]">
                {email}
              </span>
            </p>
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
          </div>
          <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            <div className="flex justify-between gap-2 md:gap-4">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputsRef.current[i] = el;
                  }}
                  value={digit}
                  maxLength={1}
                  type="text"
                  inputMode="numeric"
                  onChange={(e) => handleChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  onPaste={handlePaste}
                  placeholder="-"
                  className="w-full aspect-square text-center text-2xl font-bold rounded-lg"
                />
              ))}
            </div>
            <div className="flex flex-col gap-6">
              <button
                className={`${otpValue || loading ? "opacity-50 cursor-not-allowed" : ""} flex w-full cursor-pointer items-center justify-center rounded-lg h-14 px-4 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/20`}
                type="submit"
                disabled={otpValue || loading}
              >
                Verify Code
              </button>
              <div className="flex flex-col items-center gap-3">
                <p className="text-sm text-[#9a5f4c] dark:text-[#b08e84]">
                  Didn't receive the code?
                </p>
                <div className="flex items-center gap-2">
                  {timeLeft > 0 && (
                    <>
                      <span className="material-symbols-outlined text-sm text-[#9a5f4c]">
                        schedule
                      </span>
                      <span className="text-sm font-bold text-[#9a5f4c]">
                        {timeLeft}
                      </span>
                    </>
                  )}
                  <button
                    className={`text-primary font-bold text-sm transition ${timeLeft > 0 ? "opacity-50 cursor-not-allowed" : "hover:underline cursor-pointer"}`}
                    disabled={timeLeft > 0}
                    type="button"
                    onClick={handleResend}
                  >
                    Resend Code
                  </button>
                </div>
              </div>
            </div>
          </form>
          <div className="mt-12 text-center">
            <a
              className="inline-flex items-center gap-2 text-sm text-[#9a5f4c] dark:text-[#b08e84] font-medium hover:text-primary transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-base">
                arrow_back
              </span>
              Back to login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
