import React, { useMemo, useState } from "react";
import API from "../api/client";
import { useNavigate } from "react-router-dom";

export default function AddStaff() {
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
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverErr, setServerErr] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const setField = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: validateField(name, value, { ...form, [name]: value }) }));
  };

  const validateField = (name, value, all = form) => {
    const v = String(value ?? "").trim();
    const num = Number(v);
    switch (name) {
      case "name":
        if (v.length < 2) return "Please enter a full name.";
        return "";
      case "age":
        if (!v) return "Age is required.";
        if (!Number.isFinite(num)) return "Age must be a number.";
        if (num < 18 || num > 70) return "Age must be between 18 and 70.";
        return "";
      case "work":
        if (!v) return "Role is required.";
        return "";
      case "mobile":
        if (!v) return "Mobile is required.";
        if (!/^\+?[0-9]{10,15}$/.test(v)) return "Enter 10–15 digits (optionally starting with +).";
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

  const validateAll = () => {
    const next = {};
    Object.keys(form).forEach((k) => {
      const msg = validateField(k, form[k]);
      if (msg) next[k] = msg;
    });
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
      await API.post("/person/signup", payload);
      navigate("/staff");
    } catch (err) {
      setServerErr(err?.response?.data?.message || "Add staff failed");
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
    setErrors({});
    setServerErr("");
  };

  const fillDemo = () => {
    const demo = {
      name: "Alex Johnson",
      age: "29",
      work: "Receptionist",
      mobile: "+911234567890",
      email: "alex.johnson@example.com",
      address: "12, MG Road, Bengaluru",
      salary: "35000",
      username: "alexj",
      password: "Alex@2025",
    };
    setForm(demo);
    setErrors({});
  };

  const Field = ({ label, name, type = "text", placeholder, rightSlot, ...props }) => (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-slate-700">
        {label} <span className="text-rose-600">*</span>
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={form[name]}
          onChange={(e) => setField(name, e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition
            ${errors[name] ? "border-rose-300 ring-2 ring-rose-200" : "border-slate-200 focus:ring-2 focus:ring-indigo-500"}
          `}
          required
          {...props}
        />
        {rightSlot && <div className="pointer-events-none absolute inset-y-0 right-3 grid place-items-center text-slate-400">{rightSlot}</div>}
      </div>
      {errors[name] && <p className="mt-1 text-xs text-rose-600">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* top bar */}
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <h1 className="text-lg font-semibold tracking-tight">Add Staff</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={fillDemo}
              type="button"
              className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Fill Demo
            </button>
            <button
              onClick={() => navigate(-1)}
              type="button"
              className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-8">
        {/* Server error */}
        {serverErr && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {serverErr}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          noValidate
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" name="name" placeholder="Full name" autoFocus />
            <Field label="Age" name="age" type="number" min="18" max="70" placeholder="e.g., 28" />
            {/* Role with suggestions (datalist) */}
            <div className="sm:col-span-1">
              <label htmlFor="work" className="mb-1 block text-sm font-medium text-slate-700">
                Role <span className="text-rose-600">*</span>
              </label>
              <input
                list="roles"
                id="work"
                name="work"
                value={form.work}
                onChange={(e) => setField("work", e.target.value)}
                placeholder="e.g., Receptionist"
                className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition ${
                  errors.work ? "border-rose-300 ring-2 ring-rose-200" : "border-slate-200 focus:ring-2 focus:ring-indigo-500"
                }`}
                required
              />
              <datalist id="roles">
                <option>Manager</option>
                <option>Receptionist</option>
                <option>Chef</option>
                <option>Housekeeping</option>
                <option>Waiter</option>
                <option>Security</option>
              </datalist>
              {errors.work && <p className="mt-1 text-xs text-rose-600">{errors.work}</p>}
            </div>

            <Field label="Mobile" name="mobile" placeholder="+911234567890" />
            <Field label="Email" name="email" type="email" placeholder="name@hotel.com" />
            <div className="sm:col-span-2">
              <Field label="Address" name="address" placeholder="Street, City, State" />
            </div>
            <Field label="Salary" name="salary" type="number" min="0" step="1" placeholder="e.g., 35000" rightSlot={<RupeeIcon className="h-4 w-4" />} />
            <Field label="Username" name="username" placeholder="Choose a username" />

            {/* Password with toggle + strength */}
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
                  onChange={(e) => setField("password", e.target.value)}
                  placeholder="Min 8 characters"
                  className={`w-full rounded-md border px-3 py-2 pr-10 text-sm outline-none transition ${
                    errors.password ? "border-rose-300 ring-2 ring-rose-200" : "border-slate-200 focus:ring-2 focus:ring-indigo-500"
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
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="h-10 rounded-md border border-slate-200 bg-white px-4 text-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm text-white transition focus-visible:outline-none focus-visible:ring-2
                ${submitting ? "bg-emerald-400" : "bg-emerald-600 hover:bg-emerald-500 focus-visible:ring-emerald-500"}
              `}
            >
              {submitting && <Spinner />}
              Create
            </button>
          </div>
        </form>

        <p className="mt-3 text-xs text-slate-500">
          Fields marked with <span className="text-rose-600">*</span> are required.
        </p>
      </div>
    </div>
  );
}

/* ---------------- Small UI bits (no extra libs) ---------------- */

function Spinner() {
  return <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-white" />;
}

function PasswordMeter({ score }) {
  const labels = ["Too short", "Weak", "Okay", "Good", "Strong", "Very strong"];
  return (
    <div className="mt-1">
      <div className="mb-1 flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${
              i < score ? "bg-emerald-500" : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-slate-500">{labels[score] || labels[0]}</p>
    </div>
  );
}

/* ---------------- Inline Icons ---------------- */

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
      <path d="M7 5h10M7 9h10M7 13h6a4 4 0 0 0 0-8" strokeWidth="1.5" />
      <path d="M7 21l7-8" strokeWidth="1.5" />
    </svg>
  );
}
