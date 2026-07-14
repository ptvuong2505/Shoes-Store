import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import { authApi } from "@/features/auth/api/auth.api";
import { passwordResetSession } from "@/features/auth/model/password-reset";
import {
  AuthAlert,
  AuthFormHeader,
  AuthSubmitButton,
} from "@/features/auth/ui/AuthForm";
import { toApiClientError } from "@/shared/api/api-error";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 120;

export function OtpVerificationPage({ email }: { email: string }) {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timeLeft, setTimeLeft] = useState(RESEND_SECONDS);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputs.current[0]?.focus();
    const timer = window.setInterval(
      () => setTimeLeft((value) => Math.max(0, value - 1)),
      1_000,
    );
    return () => window.clearInterval(timer);
  }, []);

  const verifyMutation = useMutation({
    mutationFn: (code: string) => authApi.verifyOtp(email, code),
    onSuccess: async ({ resetToken }) => {
      passwordResetSession.save({ email, resetToken });
      await navigate({ to: "/auth/reset-password", replace: true });
    },
  });
  const resendMutation = useMutation({
    mutationFn: () => authApi.sendOtp(email),
    onSuccess: () => {
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimeLeft(RESEND_SECONDS);
      inputs.current[0]?.focus();
    },
  });

  const error = verifyMutation.error ?? resendMutation.error;
  const complete = otp.every(Boolean);

  const updateDigit = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    setOtp((current) => current.map((digit, i) => (i === index ? value : digit)));
    if (value && index < OTP_LENGTH - 1) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData("text").trim().slice(0, OTP_LENGTH);
    if (!/^\d{1,6}$/.test(pasted)) return;
    event.preventDefault();
    const digits = [...pasted, ...Array(OTP_LENGTH - pasted.length).fill("")];
    setOtp(digits);
    inputs.current[Math.min(pasted.length, OTP_LENGTH) - 1]?.focus();
  };

  return (
    <div className="space-y-8">
      <AuthFormHeader
        title="Check your inbox"
        description={`Enter the six-digit code sent to ${email}.`}
      />
      {error && <AuthAlert>{toApiClientError(error).message}</AuthAlert>}

      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          if (complete) verifyMutation.mutate(otp.join(""));
        }}
      >
        <fieldset>
          <legend className="sr-only">Verification code</legend>
          <div className="grid grid-cols-6 gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputs.current[index] = element;
                }}
                value={digit}
                onChange={(event) => updateDigit(event.target.value, index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                onPaste={handlePaste}
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                aria-label={`Digit ${index + 1}`}
                maxLength={1}
                className="aspect-square min-w-0 rounded-xl border border-input bg-background text-center text-xl font-bold outline-none focus:border-primary focus:ring-3 focus:ring-primary/15"
              />
            ))}
          </div>
        </fieldset>

        <AuthSubmitButton loading={verifyMutation.isPending || !complete}>
          {verifyMutation.isPending ? "Verifying..." : "Verify code"}
        </AuthSubmitButton>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        {timeLeft > 0 ? (
          <p>Request a new code in {timeLeft}s</p>
        ) : (
          <button
            type="button"
            disabled={resendMutation.isPending}
            onClick={() => resendMutation.mutate()}
            className="font-semibold text-primary hover:underline disabled:opacity-60"
          >
            {resendMutation.isPending ? "Sending..." : "Send a new code"}
          </button>
        )}
        <div className="mt-4">
          <Link to="/auth/forgot-password" className="font-semibold hover:text-foreground">
            Use another email
          </Link>
        </div>
      </div>
    </div>
  );
}
