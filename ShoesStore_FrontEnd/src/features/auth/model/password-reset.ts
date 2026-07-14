const RESET_SESSION_KEY = "password-reset";

interface PasswordResetSession {
  email: string;
  resetToken: string;
}

export const passwordResetSession = {
  save: (value: PasswordResetSession) =>
    sessionStorage.setItem(RESET_SESSION_KEY, JSON.stringify(value)),
  read: (): PasswordResetSession | null => {
    const value = sessionStorage.getItem(RESET_SESSION_KEY);
    if (!value) return null;
    try {
      return JSON.parse(value) as PasswordResetSession;
    } catch {
      sessionStorage.removeItem(RESET_SESSION_KEY);
      return null;
    }
  },
  clear: () => sessionStorage.removeItem(RESET_SESSION_KEY),
};
