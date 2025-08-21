// src/pages/Signup.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    work: "",
    mobile: "",
    email: "",
    address: "",
    salary: "",
    username: "",
    password: "",
  });
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [serverErr, setServerErr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  // Focus "Name" only once on mount
  const nameRef = useRef(null);
  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  // ---------- Validation ----------
  const validateField = (name, value) => {
    const v = String(value ?? "").trim();
    const num = Number(v);
    switch (name) {
      case "name":
        if (v.length < 2) return "Please enter your full name.";
        return "";
      case "age":
        if (!v) return "Age is required.";
        if (!Number.isFinite(num)) return "Age must be a number.";
        if (num < 18 || num > 100) return "Age must be between 18 and 100.";
        return "";
      case "work":
        if (!v) return "Role is required.";
        return "";
      case "mobile":
        if (!v) return "Mobile is required.";
        if (!/^\+?[0-9]{10,15}$/.test(v))
          return "Use 10–15 digits (optionally starting with +).";
        return "";
      case "email":
        if (!v) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email.";
        return "";
      case "address":
        if (!v) return "Address is required.";
        return "";
      case "salary":
        if (!v) return "Salary is required.";
        if (!Number.isFinite(num) || num < 0) return "Salary must be a positive number.";
        return "";
      case "username":
        if (v.length < 4) return "Username must be at least 4 characters.";
        return "";
      case "password":
        if (v.length < 8) return "Password must be at least 8 characters.";
        return "";
      default:
        return "";
    }
  };

  const validateConfirm = (pwd, conf) => {
    if (!conf) return "Please re-enter the password.";
    if (pwd !== conf) return "Passwords do not match.";
    return "";
  };

  const validateAll = () => {
    const next = {};
    Object.keys(form).forEach((k) => {
      const msg = validateField(k, form[k]);
      if (msg) next[k] = msg;
    });
    const cmsg = validateConfirm(form.password, confirm);
    if (cmsg) next.confirm = cmsg;
    setErrors(next);
    return next;
  };

  const passStrength = useMemo(() => {
    const p = form.password || "";
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score; // 0–5
  }, [form.password]);

  // ---------- Handlers ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setServerErr("");
    setForm((prev) => ({ ...prev, [name]: value }));
    // Lightweight field validation (does not mutate the value)
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    if (name === "password") {
      setErrors((prev) => ({ ...prev, confirm: validateConfirm(value, confirm) }));
    }
  };

  const handleConfirmChange = (e) => {
    const v = e.target.value;
    setConfirm(v);
    setErrors((prev) => ({ ...prev, confirm: validateConfirm(form.password, v) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerErr("");
    const errs = validateAll();
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        age: Number(form.age),
        salary: Number(form.salary),
      };
      await signup(payload);
      navigate("/dashboard");
    } catch (err) {
      setServerErr(err?.response?.data?.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm({
      name: "",
      age: "",
      work: "",
      mobile: "",
      email: "",
      address: "",
      salary: "",
      username: "",
      password: "",
    });
    setConfirm("");
    setErrors({});
    setServerErr("");
  };

  const fillDemo = () => {
    const demo = {
      name: "Priya Sharma",
      age: "27",
      work: "Receptionist",
      mobile: "+919876543210",
      email: "priya.sharma@example.com",
      address: "221B Residency, Andheri, Mumbai",
      salary: "32000",
      username: "priya27",
      password: "Priya@2025",
    };
    setForm(demo);
    setConfirm("Priya@2025");
    setErrors({});
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />

      <main className="mx-auto max-w-md px-4 pt-12">
        <div className="mb-6 text-center">
          <div className="mx-auto grid h-10 w-10 place-items-center rounded-md bg-slate-900 text-white">
            HM
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="mt-1 text-sm text-slate-600">Join Hotel Manager</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {serverErr && (
            <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {serverErr}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
                  Name <span className="text-rose-600">*</span>
                </label>
                <input
                  ref={nameRef}
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  autoComplete="name"
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition ${
                    errors.name ? "border-rose-300 ring-2 ring-rose-200" : "border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  }`}
                  required
                />
                {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
              </div>

              {/* Age */}
              <div>
                <label htmlFor="age" className="mb-1 block text-sm font-medium text-slate-700">
                  Age <span className="text-rose-600">*</span>
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  inputMode="numeric"
                  min="18"
                  max="100"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="e.g., 28"
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition ${
                    errors.age ? "border-rose-300 ring-2 ring-rose-200" : "border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  }`}
                  required
                />
                {errors.age && <p className="mt-1 text-xs text-rose-600">{errors.age}</p>}
              </div>

              {/* Role (with datalist) */}
              <div>
                <label htmlFor="work" className="mb-1 block text-sm font-medium text-slate-700">
                  Role <span className="text-rose-600">*</span>
                </label>
                <input
                  id="work"
                  name="work"
                  list="roles"
                  value={form.work}
                  onChange={handleChange}
                  placeholder="e.g., Manager"
                  autoComplete="organization-title"
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition ${
                    errors.work ? "border-rose-300 ring-2 ring-rose-200" : "border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  }`}
                  required
                />
                <datalist id="roles">
                  <option>Manager</option>
                  <option>Receptionist</option>
                  <option>Chef</option>
                  <option>Housekeeping</option>
                  <option>Security</option>
                  <option>Waiter</option>
                </datalist>
                {errors.work && <p className="mt-1 text-xs text-rose-600">{errors.work}</p>}
              </div>

              {/* Mobile */}
              <div>
                <label htmlFor="mobile" className="mb-1 block text-sm font-medium text-slate-700">
                  Mobile <span className="text-rose-600">*</span>
                </label>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  inputMode="tel"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="+911234567890"
                  autoComplete="tel"
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition ${
                    errors.mobile ? "border-rose-300 ring-2 ring-rose-200" : "border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  }`}
                  required
                />
                {errors.mobile && <p className="mt-1 text-xs text-rose-600">{errors.mobile}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                  Email <span className="text-rose-600">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@hotel.com"
                  autoComplete="email"
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition ${
                    errors.email ? "border-rose-300 ring-2 ring-rose-200" : "border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  }`}
                  required
                />
                {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
              </div>

              {/* Address (full width on sm+) */}
              <div className="sm:col-span-2">
                <label htmlFor="address" className="mb-1 block text-sm font-medium text-slate-700">
                  Address <span className="text-rose-600">*</span>
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Street, City, State"
                  autoComplete="street-address"
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition ${
                    errors.address ? "border-rose-300 ring-2 ring-rose-200" : "border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  }`}
                  required
                />
                {errors.address && <p className="mt-1 text-xs text-rose-600">{errors.address}</p>}
              </div>

              {/* Salary */}
              <div>
                <label htmlFor="salary" className="mb-1 block text-sm font-medium text-slate-700">
                  Salary <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    id="salary"
                    name="salary"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    step="1"
                    value={form.salary}
                    onChange={handleChange}
                    placeholder="e.g., 30000"
                    className={`w-full rounded-md border px-3 py-2 pr-8 text-sm outline-none transition ${
                      errors.salary ? "border-rose-300 ring-2 ring-rose-200" : "border-slate-200 focus:ring-2 focus:ring-emerald-500"
                    }`}
                    required
                  />
                  <RupeeIcon className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
                {errors.salary && <p className="mt-1 text-xs text-rose-600">{errors.salary}</p>}
              </div>

              {/* Username */}
              <div>
                <label htmlFor="username" className="mb-1 block text-sm font-medium text-slate-700">
                  Username <span className="text-rose-600">*</span>
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  autoComplete="username"
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition ${
                    errors.username ? "border-rose-300 ring-2 ring-rose-200" : "border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  }`}
                  required
                />
                {errors.username && <p className="mt-1 text-xs text-rose-600">{errors.username}</p>}
              </div>

              {/* Password */}
              <div className="sm:col-span-2">
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
                  Password <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min 8 characters"
                    autoComplete="new-password"
                    className={`w-full rounded-md border px-3 py-2 pr-10 text-sm outline-none transition ${
                      errors.password ? "border-rose-300 ring-2 ring-rose-200" : "border-slate-200 focus:ring-2 focus:ring-emerald-500"
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute inset-y-0 right-2 my-1 grid w-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100"
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password ? (
                  <p className="mt-1 text-xs text-rose-600">{errors.password}</p>
                ) : (
                  <PasswordMeter score={passStrength} />
                )}
              </div>

              {/* Confirm Password */}
              <div className="sm:col-span-2">
                <label htmlFor="confirm" className="mb-1 block text-sm font-medium text-slate-700">
                  Confirm Password <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirm"
                    name="confirm"
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    onChange={handleConfirmChange}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    className={`w-full rounded-md border px-3 py-2 pr-10 text-sm outline-none transition ${
                      errors.confirm ? "border-rose-300 ring-2 ring-rose-200" : "border-slate-200 focus:ring-2 focus:ring-emerald-500"
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute inset-y-0 right-2 my-1 grid w-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirm && <p className="mt-1 text-xs text-rose-600">{errors.confirm}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm text-white transition focus-visible:outline-none focus-visible:ring-2 ${
                submitting
                  ? "bg-emerald-400"
                  : "bg-emerald-600 hover:bg-emerald-500 focus-visible:ring-emerald-500"
              }`}
            >
              {submitting && <Spinner />}
              Sign Up
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-indigo-600 hover:underline">
              Login
            </Link>
          </p>

          {/* Dev convenience; remove anytime */}
          <button
            type="button"
            onClick={fillDemo}
            className="mt-3 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            Fill demo data
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            Reset
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Hotel Manager UI
        </p>
      </main>
    </div>
  );
}

/* ---------- Small UI bits (no extra libs) ---------- */

function Spinner() {
  return <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-white" />;
}

function PasswordMeter({ score }) {
  const labels = ["Too short", "Weak", "Okay", "Good", "Strong", "Very strong"];
  return (
    <div className="mt-1">
      <div className="mb-1 flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i < score ? "bg-emerald-500" : "bg-slate-200"}`} />
        ))}
      </div>
      <p className="text-xs text-slate-500">{labels[score] || labels[0]}</p>
    </div>
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
function RupeeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="stroke-current" {...props}>
      <path d="M5 6h10M5 10h10M5 14h6a4 4 0 0 0 0-8" strokeWidth="1.5" />
      <path d="M5 20l7-8" strokeWidth="1.5" />
    </svg>
  );
}
