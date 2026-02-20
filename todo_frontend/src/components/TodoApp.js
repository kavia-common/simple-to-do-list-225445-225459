import React, { useId, useMemo, useState } from "react";
import TodoItem from "./TodoItem";
import TodoFilters from "./TodoFilters";
import TodoInput from "./TodoInput";
import ReminderModal from "./ReminderModal";
import ReminderNotification from "./ReminderNotification";
import useReminderChecker from "../hooks/useReminderChecker";

const FILTERS = {
  all: "all",
  active: "active",
  completed: "completed",
};

// PUBLIC_INTERFACE
export default function TodoApp({ todos, setTodos, stats }) {
  /** Main to-do app surface (header + input + list + controls). */
  const [filter, setFilter] = useState(FILTERS.all);
  const [query, setQuery] = useState("");
  const [reminderModalTodo, setReminderModalTodo] = useState(null);
  const listHeadingId = useId();

  const { activeReminders, dismissReminder } = useReminderChecker(todos);

  const filteredTodos = useMemo(() => {
    const q = query.trim().toLowerCase();

    return todos.filter((t) => {
      const matchesFilter =
        filter === FILTERS.all ||
        (filter === FILTERS.active && !t.completed) ||
        (filter === FILTERS.completed && t.completed);

      const matchesQuery = !q || t.text.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [todos, filter, query]);

  const hasCompleted = stats.completed > 0;

  const addTodo = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const newTodo = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      text: trimmed,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTodos((prev) => [newTodo, ...prev]);
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  const markAll = (completed) => {
    setTodos((prev) => prev.map((t) => ({ ...t, completed })));
  };

  const setReminder = (todo, { date, time }) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === todo.id
          ? { ...t, reminderDate: date, reminderTime: time }
          : t
      )
    );
    setReminderModalTodo(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 border border-gray-100">
        <div className="bg-gradient-to-br from-primary via-blue-600 to-success p-6 sm:p-8 relative overflow-hidden">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMTAgNjAgTSAwIDEwIEwgNjAgMTAgTSAyMCAwIEwgMjAgNjAgTSAwIDIwIEwgNjAgMjAgTSAzMCAwIEwgMzAgNjAgTSAwIDMwIEwgNjAgMzAgTSA0MCAwIEwgNDAgNjAgTSAwIDQwIEwgNjAgNDAgTSA1MCAwIEwgNTAgNjAgTSAwIDUwIEwgNjAgNTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <span className="text-white font-bold text-sm tracking-wider">TODO</span>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">My Tasks</h1>
                <p className="text-white/90 text-sm mt-1">Stay organized and productive</p>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap" aria-label="To-do statistics">
              <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-3 min-w-[110px] border border-white/20 hover:bg-white/30 transition-all duration-200">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="block text-white/90 text-xs font-semibold uppercase tracking-wide">Total</span>
                </div>
                <span className="block text-white text-2xl font-bold">{stats.total}</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-3 min-w-[110px] border border-white/20 hover:bg-white/30 transition-all duration-200">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="block text-white/90 text-xs font-semibold uppercase tracking-wide">Active</span>
                </div>
                <span className="block text-white text-2xl font-bold">{stats.active}</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-3 min-w-[110px] border border-white/20 hover:bg-white/30 transition-all duration-200">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="block text-white/90 text-xs font-semibold uppercase tracking-wide">Done</span>
                </div>
                <span className="block text-white text-2xl font-bold">{stats.completed}</span>
              </div>
            </div>
          </div>

          <TodoInput onAdd={addTodo} />
        </div>

        <div className="p-4 sm:p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TodoFilters filter={filter} setFilter={setFilter} />

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-300 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary w-full sm:w-auto" aria-label="Search tasks">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  className="outline-none text-sm flex-1 bg-transparent min-w-0"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tasks..."
                  inputMode="search"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-white border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-lg font-semibold text-gray-900" id={listHeadingId}>
              Task List
            </h2>

            <div className="flex flex-wrap gap-2" aria-label="Bulk actions">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
                onClick={() => markAll(false)}
                disabled={stats.total === 0}
              >
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Uncheck all
                </span>
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
                onClick={() => markAll(true)}
                disabled={stats.total === 0}
              >
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Check all
                </span>
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                onClick={clearCompleted}
                disabled={!hasCompleted}
              >
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear completed
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <section
          className="p-4 sm:p-6"
          aria-labelledby={listHeadingId}
          role="list"
        >
          {filteredTodos.length === 0 ? (
            <div className="flex items-center gap-4 p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50" role="status" aria-live="polite">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary to-success rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-semibold text-gray-900">No tasks found</p>
                <p className="text-sm text-gray-600 mt-1">
                  Try a different filter or add a new task above.
                </p>
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onSetReminder={(t) => setReminderModalTodo(t)}
                />
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="mt-6 text-center text-sm text-gray-600">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4">
          <span>
            Saved automatically in <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">localStorage</code>
          </span>
          <span aria-label="Keyboard shortcuts">
            Tip: Press <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Enter</kbd> to add
          </span>
        </div>
      </footer>

      {reminderModalTodo && (
        <ReminderModal
          todo={reminderModalTodo}
          onSave={(data) => setReminder(reminderModalTodo, data)}
          onClose={() => setReminderModalTodo(null)}
        />
      )}

      <ReminderNotification
        reminders={activeReminders}
        onDismiss={dismissReminder}
      />
    </div>
  );
}
