import React, { useId, useMemo, useState } from "react";
import TodoItem from "./TodoItem";
import TodoFilters from "./TodoFilters";
import TodoInput from "./TodoInput";

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
  const listHeadingId = useId();

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

  return (
    <div className="RetroShell">
      <header className="RetroHeader">
        <div className="RetroHeader__topline">
          <div className="RetroBrand">
            <span className="RetroBrand__badge" aria-hidden="true">
              8-BIT
            </span>
            <div className="RetroBrand__text">
              <h1 className="RetroTitle">Retro To‑Do</h1>
              <p className="RetroSubtitle">
                Local save • Keyboard friendly • Pixel vibes
              </p>
            </div>
          </div>

          <div className="RetroStats" aria-label="To-do statistics">
            <div className="StatChip">
              <span className="StatChip__label">TOTAL</span>
              <span className="StatChip__value">{stats.total}</span>
            </div>
            <div className="StatChip">
              <span className="StatChip__label">ACTIVE</span>
              <span className="StatChip__value">{stats.active}</span>
            </div>
            <div className="StatChip StatChip--good">
              <span className="StatChip__label">DONE</span>
              <span className="StatChip__value">{stats.completed}</span>
            </div>
          </div>
        </div>

        <TodoInput onAdd={addTodo} />
        <div className="RetroToolbar">
          <TodoFilters filter={filter} setFilter={setFilter} />

          <div className="RetroToolbar__right">
            <label className="RetroSearch" aria-label="Search tasks">
              <span className="RetroSearch__label">FIND</span>
              <input
                className="RetroInput RetroInput--search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="type to search…"
                inputMode="search"
              />
            </label>
          </div>
        </div>
      </header>

      <main className="RetroMain">
        <div className="RetroListHeader">
          <h2 className="RetroSectionTitle" id={listHeadingId}>
            Task List
          </h2>

          <div className="RetroBulkActions" aria-label="Bulk actions">
            <button
              type="button"
              className="RetroBtn RetroBtn--ghost"
              onClick={() => markAll(false)}
              disabled={stats.total === 0}
            >
              Uncheck all
            </button>
            <button
              type="button"
              className="RetroBtn RetroBtn--ghost"
              onClick={() => markAll(true)}
              disabled={stats.total === 0}
            >
              Check all
            </button>
            <button
              type="button"
              className="RetroBtn RetroBtn--danger"
              onClick={clearCompleted}
              disabled={!hasCompleted}
            >
              Clear completed
            </button>
          </div>
        </div>

        <section
          className="RetroList"
          aria-labelledby={listHeadingId}
          role="list"
        >
          {filteredTodos.length === 0 ? (
            <div className="RetroEmpty" role="status" aria-live="polite">
              <div className="RetroEmpty__frame" aria-hidden="true">
                <div className="Scanlines" />
                <div className="RetroEmpty__icon">▢</div>
              </div>
              <div className="RetroEmpty__text">
                <p className="RetroEmpty__title">No tasks found.</p>
                <p className="RetroEmpty__hint">
                  Try a different filter or add a new quest above.
                </p>
              </div>
            </div>
          ) : (
            <ul className="RetroUl">
              {filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                />
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="RetroFooter">
        <div className="RetroFooter__left">
          <span className="RetroFootnote">
            Saved automatically in <code>localStorage</code>.
          </span>
        </div>
        <div className="RetroFooter__right">
          <span className="RetroFootnote" aria-label="Keyboard shortcuts">
            Tip: Press <kbd>Enter</kbd> to add
          </span>
        </div>
      </footer>
    </div>
  );
}
