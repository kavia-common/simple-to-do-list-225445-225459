import React, { useId } from "react";

// PUBLIC_INTERFACE
export default function TodoItem({ todo, onToggle, onDelete }) {
  /** Renders a single to-do item row with completion toggle and delete. */
  const checkboxId = useId();

  return (
    <li className={`TodoRow ${todo.completed ? "is-done" : ""}`} role="listitem">
      <div className="TodoRow__left">
        <input
          id={checkboxId}
          type="checkbox"
          className="TodoRow__checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <label className="TodoRow__label" htmlFor={checkboxId}>
          <span className="TodoRow__text">{todo.text}</span>
        </label>
      </div>

      <div className="TodoRow__right">
        <button
          type="button"
          className="RetroBtn RetroBtn--ghost RetroBtn--small"
          onClick={() => onToggle(todo.id)}
          aria-label={todo.completed ? "Mark as not completed" : "Mark as completed"}
        >
          {todo.completed ? "Undo" : "Done"}
        </button>

        <button
          type="button"
          className="RetroBtn RetroBtn--danger RetroBtn--small"
          onClick={() => onDelete(todo.id)}
          aria-label="Delete task"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
