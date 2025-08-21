// src/pages/Profile.jsx
import React, { useEffect, useMemo, useState } from "react";
import API from "../api/client";
import { useAuth } from "../hooks/useAuth";

export default function Profile() {
  const { user, logout } = useAuth();
  const [form, setForm] = useState(null);
  const [initial, setInitial] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    API.get("/person/profile")
      .then((res) => {
        if (!mounted) return;
        setForm(res.data);
        setInitial(res.data);
        setMsg("");
      })
      .catch((err) => {
        console.error(err);
        if (mounted) setMsg("Failed to load profile");
      })
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  const setField = (name, value) => {
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      setErrors((e) => ({ ...e, [name]: validateField(name, value) }));
      return next;
    });
  };

  const validateField = (name, value) => {
    const v = String(value ?? "").trim();
    const num = Number(v);
    switch (name) {
      case "name":
        if (v.length < 2) return "Please enter your full name.";
        return "";
      case "age":
        if (v && (!Number.isFinite(num) || num < 18 || num > 100))
          return "Age should be between 18 and 100.";
        return "";
      case "mobile":
        if (v && !/^\+?[0-9]{10,15}$/.test(v))
          return "Use 10–15 digits (optionally starting with +).";
        return "";
      case "email":
        if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email.";
        return "";
      case "salary":
        if (v && (!Number.isFinite(num) || num < 0)) return "Salary must be a positive number.";
        return "";
      default:
        return "";
    }
  };

  const validateAll = () => {
    if (!form) return {};
    const next = {};
    ["name", "age", "work", "mobile", "email", "address", "salary"].forEach((k) => {
      const msg = validateField(k, form[k]);
      if (msg) next[k] = msg;
    });
    setErrors(next);
    return next;
  };

  const isDirty = useMemo(() => {
    if (!form || !initial) return false;
    return ["name", "age", "work", "mobile", "email", "address", "salary"].some(
      (k) => String(form[k] ?? "") !== String(initial[k] ?? "")
    );
  }, [form, initial]);

  const isValid = useMemo(() => Object.values(errors).every((e) => !e), [errors]);

  const initials = useMemo(() => {
    const name = form?.name || "";
    const [a = "", b = ""] = name.trim().split(" ");
    return `${a[0] || ""}${b[0] || ""}`.toUpperCase() || "?";
  }, [form?.name]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    const errs = validateAll();
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        age: form.age ? Number(form.age) : form.age,
        salary: form.salary ? Number(form.salary) : form.salary,
      };
      await API.put(`/person/${user?._id}`, payload);
      setInitial(payload);
      setMsg("Profile updated");
    } catch (err) {
      console.error(err);
      setMsg("Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(initial);
    setErrors({});
    setMsg("");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <h1 className="text-lg font-semibold tracking-tight">My Profile</h1>
          <button
            onClick={logout}
            className="h-9 rounded-md bg-rose-600 px-3 text-sm text-white transition hover:bg-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-8">
        {/* Status message */}
        {msg && (
          <div
            className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
              msg.toLowerCase().includes("fail")
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {msg}
          </div>
        )}

        {/* Loading state */}
        {loading || !form ? (
          <ProfileSkeleton />
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            noValidate
          >
            {/* Header row: avatar + basic meta */}
            <div className="mb-5 flex items-center gap-4">
              <div
                className="grid h-14 w-14 place-items-center rounded-full bg-slate-100 text-base font-semibold text-slate-700"
                aria-label="Avatar"
                title={form?.name || "User"}
              >
                {initials}
              </div>
              <div className="min-w-0">
                <div className="truncate text-lg font-semibold">{form?.name || "—"}</div>
                <div className="truncate text-xs text-slate-500">User ID: {user?._id || "—"}</div>
              </div>
              {isDirty && (
                <span className="ml-auto rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
                  Unsaved changes
                </span>
              )}
            </div>

            {/* Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Name"
                name="name"
                value={form.name || ""}
                onChange={setField}
                error={errors.name}
                placeholder="Full name"
                autoFocus
              />
              <Field
                label="Age"
                name="age"
                type="number"
                value={form.age ?? ""}
                onChange={setField}
                error={errors.age}
                min="18"
                max="100"
                placeholder="e.g., 30"
              />
              <Field
                label="Role"
                name="work"
                value={form.work || ""}
                onChange={setField}
                error={errors.work}
                placeholder="e.g., Manager"
                listId="roles"
              />
              <datalist id="roles">
                <option>Manager</option>
                <option>Receptionist</option>
                <option>Chef</option>
                <option>Housekeeping</option>
                <option>Security</option>
              </datalist>
              <Field
                label="Mobile"
                name="mobile"
                value={form.mobile || ""}
                onChange={setField}
                error={errors.mobile}
                placeholder="+911234567890"
              />
              <Field
                label="Email"
                name="email"
                type="email"
                value={form.email || ""}
                onChange={setField}
                error={errors.email}
                placeholder="you@hotel.com"
              />
              <Field
                className="sm:col-span-2"
                label="Address"
                name="address"
                value={form.address || ""}
                onChange={setField}
                error={errors.address}
                placeholder="Street, City, State"
              />
              <Field
                label="Salary"
                name="salary"
                type="number"
                value={form.salary ?? ""}
                onChange={setField}
                error={errors.salary}
                min="0"
                step="1"
                placeholder="e.g., 45000"
                rightSlot={<RupeeIcon className="h-4 w-4" />}
              />
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleReset}
                disabled={!isDirty}
                className={`h-10 rounded-md border px-4 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isDirty
                    ? "border-slate-200 bg-white hover:bg-slate-50"
                    : "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                }`}
                title={isDirty ? "Reset changes" : "No changes to reset"}
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={!isDirty || !isValid || submitting}
                className={`inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm text-white transition focus-visible:outline-none focus-visible:ring-2 ${
                  !isDirty || !isValid || submitting
                    ? "bg-indigo-300"
                    : "bg-indigo-600 hover:bg-indigo-500 focus-visible:ring-indigo-500"
                }`}
                title={!isDirty ? "No changes to save" : !isValid ? "Fix validation errors" : "Save changes"}
              >
                {submitting && <Spinner />}
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ---------------- Reusable bits (no extra libs) ---------------- */

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  error,
  placeholder,
  className = "",
  rightSlot,
  listId,
  ...props
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          list={listId}
          className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition ${
            error ? "border-rose-300 ring-2 ring-rose-200" : "border-slate-200 focus:ring-2 focus:ring-indigo-500"
          }`}
          {...props}
        />
        {rightSlot && (
          <div className="pointer-events-none absolute inset-y-0 right-3 grid place-items-center text-slate-400">
            {rightSlot}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}

function Spinner() {
  return <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-white" />;
}

function ProfileSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-4">
        <div className="h-14 w-14 animate-pulse rounded-full bg-slate-100" />
        <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded-md bg-slate-100" />
        ))}
        <div className="sm:col-span-2 mt-4 h-10 animate-pulse rounded-md bg-slate-100" />
      </div>
    </div>
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
