// src/pages/Login.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [remember, setRemember] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Hydrate remembered username
  useEffect(() => {
    const remembered = localStorage.getItem("rememberMe") === "1";
    const uname = localStorage.getItem("rememberedUsername") || "";
    setRemember(remembered);
    if (remembered && uname) {
      setCredentials((c) => ({ ...c, username: uname }));
    }
  }, []);

  const handleChange = (e) => {
    setError("");
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(credentials.username, credentials.password);
      if (remember) {
        localStorage.setItem("rememberMe", "1");
        localStorage.setItem("rememberedUsername", credentials.username);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("rememberedUsername");
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const disabled = useMemo(
    () => submitting || !credentials.username.trim() || !credentials.password,
    [submitting, credentials]
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />

      <main className="mx-auto flex max-w-sm flex-col px-4 pt-16">
        <div className="mb-6 text-center">
          <div className="mx-auto grid h-10 w-10 place-items-center rounded-md bg-slate-900 text-white">
            HM
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-600">Sign in to continue</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {error && (
            <div
              role="alert"
              className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Username */}
            <div>
              <label htmlFor="username" className="mb-1 block text-sm font-medium text-slate-700">
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={credentials.username}
                  onChange={handleChange}
                  autoComplete="username"
                  autoFocus
                  className="w-full rounded-md border border-slate-200 px-3 py-2 pl-9 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500"
                  placeholder="your.username"
                  aria-invalid={!!error}
                />
                <UserIcon className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPass ? "text" : "password"}
                  value={credentials.password}
                  onChange={handleChange}
                  onKeyUp={(e) => setCapsOn(e.getModifierState && e.getModifierState("CapsLock"))}
                  onKeyDown={(e) => setCapsOn(e.getModifierState && e.getModifierState("CapsLock"))}
                  autoComplete="current-password"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 pl-9 pr-10 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                  aria-invalid={!!error}
                />
                <LockIcon className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:bg-slate-100"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
              {capsOn && (
                <p className="mt-1 text-xs text-amber-700">
                  Warning: Caps Lock is on.
                </p>
              )}
            </div>

            {/* Row: remember + forgot */}
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-indigo-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={disabled}
              className={`mt-1 inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm text-white transition focus-visible:outline-none focus-visible:ring-2 ${
                disabled
                  ? "bg-indigo-300"
                  : "bg-indigo-600 hover:bg-indigo-500 focus-visible:ring-indigo-500"
              }`}
            >
              {submitting && <Spinner />}
              Login
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="font-medium text-emerald-600 hover:underline">
              Sign Up
            </Link>
          </p>

          {/* Optional: demo fill for dev/testing; remove anytime */}
          <button
            type="button"
            onClick={() =>
              setCredentials({ username: "demo", password: "Demo@1234" })
            }
            className="mt-3 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            Fill demo credentials
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Hotel Manager UI
        </p>
      </main>
    </div>
  );
}

/* ---------------- Inline icons (no extra libs) ---------------- */

function Spinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-white" />
  );
}

function UserIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="stroke-current" {...props}>
      <path d="M20 21a8 8 0 1 0-16 0" strokeWidth="1.5" />
      <circle cx="12" cy="7" r="4" strokeWidth="1.5" />
    </svg>
  );
}
function LockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="stroke-current" {...props}>
      <rect x="4" y="11" width="16" height="9" rx="2" strokeWidth="1.5" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" strokeWidth="1.5" />
    </svg>
  );
}
function EyeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="stroke-current" {...props}>
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
    </svg>
  );
}
function EyeOffIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="stroke-current" {...props}>
      <path d="M3 3l18 18" strokeWidth="1.5" />
      <path d="M10.58 5.08A10.53 10.53 0 0 1 12 5c7 0 11 7 11 7a18.78 18.78 0 0 1-4.49 4.83M6.24 6.24A18.45 18.45 0 0 0 1 12s4 7 11 7a10.78 10.78 0 0 0 4.13-.8" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
    </svg>
  );
}
