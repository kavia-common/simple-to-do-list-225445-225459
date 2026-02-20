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
      <header className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-primary to-success p-6 sm:p-8">
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
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[100px]">
                <span className="block text-white/80 text-xs font-semibold uppercase tracking-wide">Total</span>
                <span className="block text-white text-2xl font-bold mt-1">{stats.total}</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[100px]">
                <span className="block text-white/80 text-xs font-semibold uppercase tracking-wide">Active</span>
                <span className="block text-white text-2xl font-bold mt-1">{stats.active}</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[100px]">
                <span className="block text-white/80 text-xs font-semibold uppercase tracking-wide">Done</span>
                <span className="block text-white text-2xl font-bold mt-1">{stats.completed}</span>
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
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={() => markAll(false)}
                disabled={stats.total === 0}
              >
                Uncheck all
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={() => markAll(true)}
                disabled={stats.total === 0}
              >
                Check all
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-error rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={clearCompleted}
                disabled={!hasCompleted}
              >
                Clear completed
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
