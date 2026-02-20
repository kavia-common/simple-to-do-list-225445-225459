import React, { useId } from "react";

// PUBLIC_INTERFACE
export default function TodoItem({ todo, onToggle, onDelete }) {
  /** Renders a single to-do item row with completion toggle and delete. */
  const checkboxId = useId();

  return (
    <li 
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-lg border transition-all ${
        todo.completed
          ? "bg-gray-50 border-gray-200"
          : "bg-white border-gray-300 hover:border-primary hover:shadow-sm"
      }`} 
      role="listitem"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <input
          id={checkboxId}
          type="checkbox"
          className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary cursor-pointer flex-shrink-0"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <label className="cursor-pointer flex-1 min-w-0" htmlFor={checkboxId}>
          <span className={`block text-base break-words ${
            todo.completed
              ? "text-gray-500 line-through"
              : "text-gray-900"
          }`}>
            {todo.text}
          </span>
        </label>
      </div>

      <div className="flex gap-2 sm:flex-shrink-0 justify-end">
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={() => onToggle(todo.id)}
          aria-label={todo.completed ? "Mark as not completed" : "Mark as completed"}
        >
          {todo.completed ? "Undo" : "Done"}
        </button>

        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-white bg-error rounded-lg hover:bg-red-600 transition-colors"
          onClick={() => onDelete(todo.id)}
          aria-label="Delete task"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
