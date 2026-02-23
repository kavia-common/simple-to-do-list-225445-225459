import React from "react";
import styles from "../styles/TodoItem.module.css";

// PUBLIC_INTERFACE
export default function TodoItem({ todo, onToggle, onDelete }) {
  /** One todo row with toggle + delete actions. */
  return (
    <li className={styles.item}>
      <button
        type="button"
        className={styles.check}
        onClick={onToggle}
        aria-pressed={todo.completed}
        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        <span className={styles.checkIcon} aria-hidden="true">
          {todo.completed ? "✓" : ""}
        </span>
      </button>

      <div className={styles.content}>
        <p className={todo.completed ? styles.textDone : styles.text}>
          {todo.title}
        </p>
        {todo.remindAt ? (
          <p className={styles.sub}>
            ⏰{" "}
            {new Date(todo.remindAt).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        ) : (
          <p className={styles.subMuted}>No reminder</p>
        )}
      </div>

      <button type="button" className={styles.delete} onClick={onDelete}>
        Delete
      </button>
    </li>
  );
}
