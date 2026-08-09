
import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Token comes from:
  // http://localhost:5173/reset-password?token=xxxx
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    // Make sure the reset link contains a token
    if (!token) {
      setErrorMessage(
        "Invalid password reset link. Please request a new reset link.",
      );
      return;
    }

    // Backend requires minimum 8 characters
    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8080/api/password/reset",
        {
          token,
          newPassword,
          confirmPassword,
        },
      );

      setSuccessMessage(
        response.data?.message || "Password reset successful.",
      );

      // Give the user a moment to see the success message,
      // then return to login.
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (error) {
      console.error("Reset password error:", error);

      setErrorMessage(
        error?.response?.data?.message ||
          "Unable to reset your password. The reset link may be invalid or expired.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 grid-bg p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/90 p-8 shadow-2xl sm:p-10">
        <div className="mb-8 flex justify-center">
          <Logo variant="dark" />
        </div>

        <div className="mb-7 space-y-2 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Lock className="h-5 w-5" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white">
            Reset Password
          </h1>

          <p className="text-xs leading-relaxed text-slate-400">
            Create a new password for your ShipTrackPro account.
          </p>
        </div>

        {!token ? (
          <div className="space-y-5">
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs font-semibold text-rose-400">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

              <span>
                This password reset link is invalid. Please request a new
                password reset link.
              </span>
            </div>

            <Link
              to="/login"
              className="flex w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-900 py-3 text-xs font-bold text-white transition hover:bg-slate-800"
            >
              Back to Login
            </Link>
          </div>
        ) : successMessage ? (
          <div className="space-y-5">
            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />

              <span>{successMessage}</span>
            </div>

            <p className="text-center text-xs text-slate-400">
              Redirecting you to the login page...
            </p>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs font-semibold text-rose-400">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                New Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-2.5 pl-10 pr-11 text-xs text-white placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                  aria-label={
                    showNewPassword ? "Hide password" : "Show password"
                  }
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <p className="text-[11px] text-slate-500">
                Password must contain at least 8 characters.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Confirm Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-2.5 pl-10 pr-11 text-xs text-white placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl gradient-brand py-3 text-xs font-bold text-white shadow-lg shadow-primary/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Resetting Password...
                </>
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

