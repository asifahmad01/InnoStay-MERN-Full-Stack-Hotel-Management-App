import React, { useEffect, useMemo, useState } from "react";
import API from "../api/client";
import { Link } from "react-router-dom";

const TYPES = ["all", "sweet", "spicy", "sour"];
const CURRENCY = "₹"; // change to "$" if needed

export default function MenuList() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState("name"); // 'name' | 'price'
  const [sortDir, setSortDir] = useState("asc");  // 'asc' | 'desc'
  const [confirm, setConfirm] = useState({ open: false, item: null });

  const fetchData = (type) => {
    setLoading(true);
    setErr("");
    // IMPORTANT FIX: use a query param for taste so `/menu/:id` stays unambiguous
    const url = type === "all" ? "/menu" : `/menu?taste=${encodeURIComponent(type)}`;
    API.get(url)
      .then((res) => setItems(Array.isArray(res.data) ? res.data : []))
      .catch(() => setErr("Could not load menu items."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const askDelete = (item) => setConfirm({ open: true, item });

  const handleDelete = async () => {
    const id = confirm.item?._id;
    if (!id) return;
    try {
      await API.delete(`/menu/${id}`);
      setConfirm({ open: false, item: null });
      fetchData(filter);
    } catch {
      setErr("Delete failed. Please try again.");
    }
  };

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let rows = items;

    if (needle) {
      rows = rows.filter((it) => {
        const bag = [
          it.name,
          it.taste || it.type || "",
          it.price != null ? String(it.price) : "",
          it.description || "",
        ]
          .join(" ")
          .toLowerCase();
        return bag.includes(needle);
      });
    }

    const get = (o) =>
      sortKey === "price"
        ? Number(o.price ?? Number.NaN)
        : String(o.name || "").toLowerCase();

    rows = [...rows].sort((a, b) => {
      const A = get(a);
      const B = get(b);
      if (Number.isFinite(A) && Number.isFinite(B)) {
        return sortDir === "asc" ? A - B : B - A;
      }
      if (A < B) return sortDir === "asc" ? -1 : 1;
      if (A > B) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return rows;
  }, [items, q, sortKey, sortDir]);

  const exportCSV = () => {
    const headers = ["Name", "Type", "Price"];
    const lines = [
      headers.join(","),
      ...filtered.map((it) =>
        [csvEsc(it.name), csvEsc(it.taste || it.type || ""), csvEsc(it.price)].join(",")
      ),
    ];
    const blob = new Blob([`\uFEFF${lines.join("\n")}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "menu.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <h1 className="text-xl font-semibold tracking-tight">Menu</h1>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search name, type, price…"
                className="h-9 w-72 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none ring-indigo-500/0 transition focus:ring-2"
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

            <Link to="/menu/add">
              <button className="inline-flex h-9 items-center gap-2 rounded-md bg-emerald-600 px-3 text-sm font-medium text-white transition hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
                <PlusIcon className="h-4 w-4" />
                Add Item
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Segmented filter */}
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`h-9 rounded-full px-3 text-sm font-medium transition ${
                  filter === t
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`}
              >
                {titleCase(t)}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">Sort by</label>
            <div className="flex items-center gap-2">
              <SortButton
                label="Name"
                active={sortKey === "name"}
                dir={sortKey === "name" ? sortDir : "none"}
                onClick={() =>
                  setSortKey((k) => {
                    if (k === "name") setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                    return "name";
                  })
                }
              />
              <SortButton
                label="Price"
                active={sortKey === "price"}
                dir={sortKey === "price" ? sortDir : "none"}
                onClick={() =>
                  setSortKey((k) => {
                    if (k === "price") setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                    return "price";
                  })
                }
              />
            </div>
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

        {loading ? (
          <GridSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <>
            {/* Desktop grid */}
            <ul className="hidden grid-cols-3 gap-4 md:grid">
              {filtered.map((it) => (
                <li
                  key={it._id}
                  className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold">{it.name || "—"}</h3>
                      <div className="mt-0.5 flex items-center gap-2 text-sm text-slate-600">
                        <TypeBadge type={it.taste || it.type || filter} />
                        <span className="inline-flex items-center gap-1">
                          <CurrencyIcon className="h-4 w-4" />
                          {formatPrice(it.price, CURRENCY)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-2 flex shrink-0 gap-2">
                      <Link to={`/menu/${it._id}/edit`}>
                        <button className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs transition hover:bg-slate-50">
                          <EditIcon className="h-3.5 w-3.5" />
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => askDelete(it)}
                        className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-2.5 py-1.5 text-xs text-white transition hover:bg-rose-500"
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>

                  {it.description && (
                    <p className="mt-3 line-clamp-3 text-sm text-slate-600">{it.description}</p>
                  )}
                </li>
              ))}
            </ul>

            {/* Mobile list */}
            <ul className="space-y-3 md:hidden">
              {filtered.map((it) => (
                <li key={it._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                      {getInitials(it.name)}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-medium">{it.name || "—"}</div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-600">
                        <TypeBadge type={it.taste || it.type || filter} />
                        <span className="inline-flex items-center gap-1">
                          <CurrencyIcon className="h-3 w-3" />
                          {formatPrice(it.price, CURRENCY)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-auto flex gap-2">
                      <Link to={`/menu/${it._id}/edit`}>
                        <button className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs transition hover:bg-slate-50">
                          <EditIcon className="h-3.5 w-3.5" />
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => askDelete(it)}
                        className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-2.5 py-1.5 text-xs text-white transition hover:bg-rose-500"
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>

                  {it.description && (
                    <p className="mt-2 line-clamp-3 text-sm text-slate-600">{it.description}</p>
                  )}
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
                <h3 className="text-base font-semibold">Delete item</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Are you sure you want to delete{" "}
                  <span className="font-medium">{confirm.item?.name || "this item"}</span>?
                  This action cannot be undone.
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

/* ---------------- helpers & micro components ---------------- */

function titleCase(s) {
  return String(s || "")
    .split(" ")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function getInitials(name) {
  if (!name) return "?";
  const [a = "", b = ""] = String(name).trim().split(" ");
  return `${a[0] || ""}${b[0] || ""}`.toUpperCase();
}

function csvEsc(v) {
  const s = (v ?? "").toString();
  if (/[,\n"]/.test(s)) return `"${s.replace(/\"/g, '""')}"`;
  return s;
}

function formatPrice(value, symbol = "₹") {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return `${symbol}${n.toFixed(2)}`;
}

function TypeBadge({ type }) {
  const t = String(type || "").toLowerCase();
  const palette =
    t.includes("sweet")
      ? "bg-pink-50 text-pink-700 ring-pink-200"
      : t.includes("spicy")
      ? "bg-red-50 text-red-700 ring-red-200"
      : t.includes("sour")
      ? "bg-amber-50 text-amber-700 ring-amber-200"
      : "bg-slate-50 text-slate-700 ring-slate-200";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${palette}`}
    >
      {titleCase(t || "Other")}
    </span>
  );
}

function SortButton({ label, active, dir, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs transition ${
        active
          ? "border-slate-300 bg-white text-slate-900 shadow-sm"
          : "border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
      aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
      title="Sort"
    >
      {label}
      <SortIcon className="h-3.5 w-3.5" dir={active ? dir : "none"} />
    </button>
  );
}

function GridSkeleton() {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i} className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="h-4 w-8/12 animate-pulse rounded bg-slate-100" />
          <div className="mt-3 h-3 w-6/12 animate-pulse rounded bg-slate-100" />
          <div className="mt-2 h-3 w-10/12 animate-pulse rounded bg-slate-100" />
        </li>
      ))}
    </ul>
  );
}

function EmptyState({ filter }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="mb-2 grid h-12 w-12 place-items-center rounded-full bg-slate-100">
        <TagIcon className="h-5 w-5" />
      </div>
      <h3 className="text-base font-semibold">No items found</h3>
      <p className="mt-1 max-w-md text-sm text-slate-600">
        {filter === "all"
          ? "Your menu is empty. Start by adding your first item."
          : `No ${filter} items yet. Try a different filter or add one now.`}
      </p>
      <Link to="/menu/add" className="mt-4 inline-block">
        <button className="h-9 rounded-md bg-emerald-600 px-3 text-sm font-medium text-white transition hover:bg-emerald-500">
          Add Item
        </button>
      </Link>
    </div>
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
function SortIcon({ dir = "none", className }) {
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
function TagIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="stroke-slate-700" {...props}>
      <path d="M20 10V4H4v16h6" strokeWidth="1.5" />
      <path d="M20 4l-8 8" strokeWidth="1.5" />
    </svg>
  );
}
function CurrencyIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="stroke-current" {...props}>
      <path d="M5 6h10M5 10h10M5 14h6a4 4 0 0 0 0-8" strokeWidth="1.5" />
      <path d="M5 20l7-8" strokeWidth="1.5" />
    </svg>
  );
}
