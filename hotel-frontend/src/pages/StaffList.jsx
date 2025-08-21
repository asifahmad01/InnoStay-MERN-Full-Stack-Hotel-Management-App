import React, { useEffect, useMemo, useState } from "react";
import API from "../api/client";
import { Link } from "react-router-dom";

export default function StaffList() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc"); // 'asc' | 'desc'
  const [confirm, setConfirm] = useState({ open: false, item: null });

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    API.get("/person")
      .then((res) => {
        if (mounted) setStaff(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => mounted && setErr("Could not load staff."))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  const handleAskDelete = (item) => {
    setConfirm({ open: true, item });
  };

  const handleDelete = async () => {
    const id = confirm.item?._id;
    if (!id) return;
    try {
      await API.delete(`/person/${id}`);
      setStaff((s) => s.filter((x) => x._id !== id));
      setConfirm({ open: false, item: null });
    } catch (e) {
      setErr("Delete failed. Please try again.");
    }
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let rows = staff;
    if (needle) {
      rows = rows.filter((s) => {
        const bag = [
          s.name,
          s.work,
          s.mobile,
          s.email,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return bag.includes(needle);
      });
    }
    const get = (obj, key) =>
      String(
        (key === "name" && obj.name) ||
          (key === "work" && obj.work) ||
          (key === "mobile" && obj.mobile) ||
          (key === "email" && obj.email) ||
          ""
      ).toLowerCase();

    rows = [...rows].sort((a, b) => {
      const A = get(a, sortKey);
      const B = get(b, sortKey);
      if (A < B) return sortDir === "asc" ? -1 : 1;
      if (A > B) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return rows;
  }, [staff, q, sortKey, sortDir]);

  const exportCSV = () => {
    const headers = ["Name", "Role", "Mobile", "Email"];
    const lines = [
      headers.join(","),
      ...filtered.map((s) =>
        [
          csvEsc(s.name),
          csvEsc(s.work),
          csvEsc(s.mobile),
          csvEsc(s.email),
        ].join(",")
      ),
    ];
    const blob = new Blob([`\uFEFF${lines.join("\n")}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "staff.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      {/* Header bar */}
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <h1 className="text-xl font-semibold tracking-tight">Staff</h1>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search name, role, phone, email…"
                className="h-9 w-64 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none ring-indigo-500/0 transition focus:ring-2"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                ⌘K
              </span>
            </div>

            <button
              onClick={exportCSV}
              className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Export CSV
            </button>

            <Link to="/staff/add">
              <button className="inline-flex h-9 items-center gap-2 rounded-md bg-emerald-600 px-3 text-sm font-medium text-white transition hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
                <PlusIcon className="h-4 w-4" />
                Add Staff
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-6xl px-4 py-6">
        {err && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
            {err}
          </div>
        )}

        {/* Loading skeleton */}
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-14 w-full rounded-lg border border-slate-200 bg-white"
              >
                <div className="h-full w-full animate-pulse rounded-lg bg-slate-100" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState query={q} />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-sm text-slate-600">
                  <tr>
                    <Th
                      label="Name"
                      active={sortKey === "name"}
                      dir={sortDir}
                      onClick={() => handleSort("name")}
                    />
                    <Th
                      label="Role"
                      active={sortKey === "work"}
                      dir={sortDir}
                      onClick={() => handleSort("work")}
                    />
                    <Th
                      label="Mobile"
                      active={sortKey === "mobile"}
                      dir={sortDir}
                      onClick={() => handleSort("mobile")}
                    />
                    <Th
                      label="Email"
                      active={sortKey === "email"}
                      dir={sortDir}
                      onClick={() => handleSort("email")}
                    />
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filtered.map((s) => (
                    <tr key={s._id} className="hover:bg-slate-50/60">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <Avatar initials={getInitials(s?.name)} />
                          <div className="min-w-0">
                            <div className="truncate font-medium">
                              {s.name || "—"}
                            </div>
                            <div className="truncate text-xs text-slate-500">
                              ID: {s._id?.slice(-6) || "—"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <RoleBadge role={s.work} />
                      </td>
                      <td className="p-3">{s.mobile || "—"}</td>
                      <td className="p-3">{s.email || "—"}</td>
                      <td className="p-3">
                        <div className="flex justify-end gap-2">
                          <Link to={`/staff/${s._id}/edit`}>
                            <button className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs transition hover:bg-slate-50">
                              <EditIcon className="h-3.5 w-3.5" />
                              Edit
                            </button>
                          </Link>
                          <button
                            onClick={() => handleAskDelete(s)}
                            className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-2.5 py-1.5 text-xs text-white transition hover:bg-rose-500"
                          >
                            <TrashIcon className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="space-y-3 md:hidden">
              {filtered.map((s) => (
                <li
                  key={s._id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <Avatar initials={getInitials(s?.name)} />
                    <div className="min-w-0">
                      <div className="truncate font-medium">{s.name || "—"}</div>
                      <div className="mt-0.5 text-xs text-slate-500">
                        <RoleBadge role={s.work} />
                      </div>
                    </div>
                    <div className="ml-auto flex gap-2">
                      <Link to={`/staff/${s._id}/edit`}>
                        <button
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs transition hover:bg-slate-50"
                          aria-label="Edit"
                        >
                          <EditIcon className="h-3.5 w-3.5" />
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleAskDelete(s)}
                        className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-2.5 py-1.5 text-xs text-white transition hover:bg-rose-500"
                        aria-label="Delete"
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="h-4 w-4" />
                      {s.mobile || "—"}
                    </div>
                    <div className="flex items-center gap-2 break-all">
                      <MailIcon className="h-4 w-4" />
                      {s.email || "—"}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Confirm delete modal */}
      {confirm.open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-40 grid place-items-center bg-black/40 p-4"
          onClick={() => setConfirm({ open: false, item: null })}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-rose-100 text-rose-700">
                <TrashIcon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold">Delete staff</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Are you sure you want to delete{" "}
                  <span className="font-medium">
                    {confirm.item?.name || "this staff member"}
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setConfirm({ open: false, item: null })}
                className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="h-9 rounded-md bg-rose-600 px-3 text-sm text-white transition hover:bg-rose-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- helpers & small UI bits ---------------- */

function getInitials(name) {
  if (!name) return "?";
  const [a = "", b = ""] = String(name).split(" ");
  return `${a[0] || ""}${b[0] || ""}`.toUpperCase();
}

function csvEsc(v) {
  const s = (v ?? "").toString();
  if (/[,\n"]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function Avatar({ initials = "?" }) {
  return (
    <div
      className="grid h-9 w-9 flex-none place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700"
      title="Avatar"
    >
      {initials}
    </div>
  );
}

function RoleBadge({ role }) {
  const r = (role || "").toLowerCase();
  const palette =
    r.includes("manager") || r.includes("admin")
      ? "bg-indigo-50 text-indigo-700 ring-indigo-200"
      : r.includes("chef") || r.includes("cook")
      ? "bg-amber-50 text-amber-700 ring-amber-200"
      : r.includes("reception") || r.includes("front")
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : r.includes("house") || r.includes("clean")
      ? "bg-sky-50 text-sky-700 ring-sky-200"
      : "bg-slate-50 text-slate-700 ring-slate-200";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${palette}`}
    >
      {role || "—"}
    </span>
  );
}

function Th({ label, active, dir, onClick }) {
  return (
    <th className="p-3">
      <button
        onClick={onClick}
        className={`group inline-flex items-center gap-1 text-left font-medium ${
          active ? "text-slate-900" : "text-slate-600"
        }`}
        aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
        title="Sort"
      >
        {label}
        <SortIcon
          className={`h-3.5 w-3.5 transition ${
            active ? "opacity-100" : "opacity-30 group-hover:opacity-70"
          }`}
          dir={active ? dir : "none"}
        />
      </button>
    </th>
  );
}

/* ---------------- inline icons (no packages) ---------------- */

function PlusIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="stroke-white" {...props}>
      <path d="M12 5v14M5 12h14" strokeWidth="2" />
    </svg>
  );
}
function EditIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="stroke-slate-700" {...props}>
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" strokeWidth="1.5" />
      <path d="M14.06 4.94l3.75 3.75" strokeWidth="1.5" />
    </svg>
  );
}
function TrashIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="stroke-current" {...props}>
      <path d="M3 6h18" strokeWidth="1.5" />
      <path d="M8 6V4h8v2M6 6l1 14h10l1-14" strokeWidth="1.5" />
    </svg>
  );
}
function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="stroke-slate-700" {...props}>
      <path d="M4 6h16v12H4z" strokeWidth="1.5" />
      <path d="M4 7l8 6 8-6" strokeWidth="1.5" />
    </svg>
  );
}
function PhoneIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="stroke-slate-700" {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.09 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.89.3 1.76.57 2.6a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.48-1.13a2 2 0 0 1 2.11-.45c.84.27 1.71.45 2.6.57A2 2 0 0 1 22 16.92z" strokeWidth="1.5"/>
    </svg>
  );
}
function SortIcon({ dir = "none", className }) {
  // dir: 'asc' | 'desc' | 'none'
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`stroke-current ${className || ""}`}>
      <path
        d="M8 9l4-4 4 4"
        strokeWidth="1.5"
        className={dir === "asc" ? "opacity-100" : "opacity-40"}
      />
      <path
        d="M16 15l-4 4-4-4"
        strokeWidth="1.5"
        className={dir === "desc" ? "opacity-100" : "opacity-40"}
      />
    </svg>
  );
}
