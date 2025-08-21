import React, { useEffect, useMemo, useState } from "react";
import API from "../api/client";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    API.get("/person/profile")
      .then((res) => {
        if (mounted) setProfile(res.data);
      })
      .catch(() => {
        if (mounted) setErr("Could not load profile.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => (mounted = false);
  }, []);

  const initials = useMemo(() => {
    if (!profile?.name) return "?";
    const [a = "", b = ""] = profile.name.split(" ");
    return `${a[0] || ""}${b[0] || ""}`.toUpperCase();
  }, [profile]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* soft background blobs */}
      <div className="pointer-events-none absolute -top-20 -right-28 h-72 w-72 rounded-full bg-indigo-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />

      {/* Skip link for a11y */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 rounded-md bg-indigo-600 px-3 py-1 text-sm font-medium text-white"
      >
        Skip to content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/75 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <div className="inline-flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-slate-900 text-white">
              HM
            </div>
            <span className="font-semibold tracking-tight">Hotel Manager</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-2 md:flex">
              <input
                type="search"
                placeholder="Search rooms, guests, orders…"
                className="h-9 w-72 rounded-md border border-slate-200 bg-white/70 px-3 text-sm outline-none ring-indigo-500/0 transition focus:ring-2"
              />
              <button className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                Search
              </button>
            </div>

            {/* Avatar */}
            <div
              className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700"
              title={profile?.name || "User"}
              aria-label="Account avatar"
            >
              {initials}
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main id="main" className="mx-auto max-w-7xl px-4 py-8">
        {/* Greeting */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1
              className="text-2xl font-bold tracking-tight sm:text-3xl"
              aria-live="polite"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
                  Loading…
                </span>
              ) : (
                <>Hello{profile?.name ? ", " : " "}{profile?.name || "there"} 👋</>
              )}
            </h1>
            <p className="mt-1 text-slate-500">
              Quick actions to manage today’s operations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/profile">
              <button className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                <UserIcon className="h-4 w-4" />
                My Profile
              </button>
            </Link>
            <Link to="/">
              <button className="inline-flex h-9 items-center gap-2 rounded-md bg-rose-600 px-3 text-sm text-white transition hover:bg-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500">
                <LogoutIcon className="h-4 w-4" />
                Logout
              </button>
            </Link>
          </div>
        </div>

        {err && (
          <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
            {err}
          </div>
        )}

        {/* Quick Action Cards */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ActionCard to="/staff" title="Manage Staff" subtitle="Onboard, roles & shifts">
            <UsersIcon className="h-5 w-5" />
          </ActionCard>
          <ActionCard to="/menu" title="Manage Menu" subtitle="Dishes, pricing & availability">
            <UtensilsIcon className="h-5 w-5" />
          </ActionCard>
          <ActionCard to="/profile" title="My Profile" subtitle="Account & preferences">
            <UserIcon className="h-5 w-5" />
          </ActionCard>
          <ActionCard to="/" title="Logout" subtitle="End current session">
            <LogoutIcon className="h-5 w-5" />
          </ActionCard>
        </section>

        {/* Optional recent activity (static placeholders) */}
        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-semibold">Overview</h2>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
              <Kpi label="Occupancy" value="76%" />
              <Kpi label="Check-ins Today" value="12" />
              <Kpi label="Open Orders" value="7" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-semibold">Recent activity</h2>
            </div>
            <ul className="space-y-3 p-5 text-sm">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-500" />
                <div>
                  <p>
                    <strong>Room 204</strong> checked in by <strong>J. Smith</strong>.
                  </p>
                  <p className="text-slate-500">2 mins ago</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-amber-500" />
                <div>
                  <p>
                    New <strong>room service</strong> order for <strong>Room 318</strong>.
                  </p>
                  <p className="text-slate-500">12 mins ago</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-indigo-500" />
                <div>
                  <p>
                    <strong>Staff</strong> shift reminder sent to <strong>A. Patel</strong>.
                  </p>
                  <p className="text-slate-500">30 mins ago</p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-1 py-10 text-xs text-slate-500">
          <div className="mb-4 h-px w-full bg-slate-200" />
          © {new Date().getFullYear()} Hotel Manager UI.
        </footer>
      </main>
    </div>
  );
}

/* ---------- Small UI bits (no extra libraries) ---------- */

function ActionCard({ to, title, subtitle, children }) {
  return (
    <Link
      to={to}
      className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-slate-50 transition group-hover:bg-slate-100">
          {children}
        </div>
        <div>
          <div className="font-medium">{title}</div>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
    </Link>
  );
}

function Kpi({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold tracking-tight">{value}</div>
    </div>
  );
}

/* ---------- Inline SVG icons (no packages) ---------- */

function UsersIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="stroke-slate-700" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" strokeWidth="1.5" />
      <circle cx="9" cy="7" r="4" strokeWidth="1.5" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" strokeWidth="1.5" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="1.5" />
    </svg>
  );
}

function UtensilsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="stroke-slate-700" {...props}>
      <path d="M4 3v7a3 3 0 0 0 3 3v8" strokeWidth="1.5" />
      <path d="M7 3v7" strokeWidth="1.5" />
      <path d="M10 3v7a3 3 0 0 1-3 3" strokeWidth="1.5" />
      <path d="M14 3v20" strokeWidth="1.5" />
      <path d="M19 3v20" strokeWidth="1.5" />
      <path d="M14 11h5" strokeWidth="1.5" />
    </svg>
  );
}

function UserIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="stroke-slate-700" {...props}>
      <path d="M20 21a8 8 0 1 0-16 0" strokeWidth="1.5" />
      <circle cx="12" cy="7" r="4" strokeWidth="1.5" />
    </svg>
  );
}

function LogoutIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="stroke-slate-700" {...props}>
      <path d="M15 12H3" strokeWidth="1.5" />
      <path d="M8 7l-5 5 5 5" strokeWidth="1.5" />
      <path d="M21 3v18" strokeWidth="1.5" />
    </svg>
  );
}
