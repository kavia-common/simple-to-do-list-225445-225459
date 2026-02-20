import React from "react";

// PUBLIC_INTERFACE
export default function TodoFilters({ filter, setFilter }) {
  /** Filter control for the list view (all/active/completed). */
  const items = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
  ];

  return (
    <div className="flex gap-2 flex-wrap" role="group" aria-label="Filters">
      {items.map((it) => {
        const active = filter === it.key;
        return (
          <button
            key={it.key}
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              active
                ? "bg-primary text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
            aria-pressed={active}
            onClick={() => setFilter(it.key)}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
