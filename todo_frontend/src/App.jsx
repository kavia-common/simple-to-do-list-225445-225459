import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles/App.module.css";
import TodoItem from "./components/TodoItem.jsx";
import ReminderAlert from "./components/ReminderAlert.jsx";
import { useLocalStorageState } from "./hooks/useLocalStorageState.js";
import { useReminderScheduler } from "./hooks/useReminderScheduler.js";

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

// PUBLIC_INTERFACE
export default function App() {
  /** Main application entry screen (single page). */

  const [todos, setTodos] = useLocalStorageState("todos", []);
  const [title, setTitle] = useState("");
  const [remindAt, setRemindAt] = useState("");

  // Notification state (refined UI is in ReminderAlert).
  const [activeReminder, setActiveReminder] = useState(null);

  const sortedTodos = useMemo(() => {
    // Keep UX: incomplete first, then completed; newest first within groups.
    const copy = [...todos];
    copy.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return (b.createdAt ?? 0) - (a.createdAt ?? 0);
    });
    return copy;
  }, [todos]);

  const addInputRef = useRef(null);

  const { snoozeMinutes, dismissReminder } = useReminderScheduler({
    todos,
    onReminderFire: (reminder) => setActiveReminder(reminder),
    onTodosChange: setTodos,
  });

  useEffect(() => {
    // Focus the input on load for quick entry.
    addInputRef.current?.focus();
  }, []);

  function onAddTodo(e) {
    e.preventDefault();

    const trimmed = title.trim();
    if (!trimmed) return;

    const remindAtMs = remindAt ? new Date(remindAt).getTime() : null;
    const now = Date.now();

    const next = {
      id: uid(),
      title: trimmed,
      completed: false,
      createdAt: now,
      remindAt: remindAtMs && !Number.isNaN(remindAtMs) ? remindAtMs : null,
      // lastRemindedAt used by scheduler to avoid repeated fires.
      lastRemindedAt: null,
    };

    setTodos((prev) => [next, ...prev]);
    setTitle("");
    setRemindAt("");
    addInputRef.current?.focus();
  }

  function toggleTodo(id) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function deleteTodo(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function clearCompleted() {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logoMark} aria-hidden="true">
            ✓
          </div>
          <div>
            <h1 className={styles.title}>Simple To‑Do</h1>
            <p className={styles.subtitle}>Fast, local, and lightly retro‑modern.</p>
          </div>
        </div>
      </header>

      <main className={styles.shell}>
        <section className={styles.card} aria-label="Add a task">
          <form className={styles.addRow} onSubmit={onAddTodo}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="todoTitle">
                Task
              </label>
              <input
                ref={addInputRef}
                id="todoTitle"
                className={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a task…"
                autoComplete="off"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="remindAt">
                Reminder (optional)
              </label>
              <input
                id="remindAt"
                className={styles.input}
                type="datetime-local"
                value={remindAt}
                onChange={(e) => setRemindAt(e.target.value)}
              />
            </div>

            <button className={styles.addBtn} type="submit">
              Add
            </button>
          </form>

          <div className={styles.metaRow}>
            <div className={styles.counts} aria-live="polite">
              <span className={styles.badge}>
                {todos.filter((t) => !t.completed).length} open
              </span>
              <span className={styles.badgeMuted}>
                {todos.filter((t) => t.completed).length} done
              </span>
            </div>

            <button
              type="button"
              className={styles.ghostBtn}
              onClick={clearCompleted}
              disabled={todos.every((t) => !t.completed)}
            >
              Clear completed
            </button>
          </div>
        </section>

        <section className={styles.listCard} aria-label="Task list">
          {sortedTodos.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon} aria-hidden="true">
                ⌁
              </div>
              <p className={styles.emptyTitle}>No tasks yet</p>
              <p className={styles.emptyHint}>Add one above to get started.</p>
            </div>
          ) : (
            <ul className={styles.list}>
              {sortedTodos.map((t) => (
                <TodoItem
                  key={t.id}
                  todo={t}
                  onToggle={() => toggleTodo(t.id)}
                  onDelete={() => deleteTodo(t.id)}
                />
              ))}
            </ul>
          )}
        </section>
      </main>

      <ReminderAlert
        open={Boolean(activeReminder)}
        reminder={activeReminder}
        onDismiss={() => {
          if (!activeReminder) return;
          dismissReminder(activeReminder.todoId);
          setActiveReminder(null);
        }}
        onSnooze={(minutes) => {
          if (!activeReminder) return;
          snoozeMinutes(activeReminder.todoId, minutes);
          setActiveReminder(null);
        }}
      />
    </div>
  );
}
