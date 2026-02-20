import React, { useId } from "react";

// PUBLIC_INTERFACE
export default function TodoItem({ todo, onToggle, onDelete, onSetReminder }) {
  /** Renders a single to-do item row with completion toggle, delete, and reminder. */
  const checkboxId = useId();

  const hasReminder = todo.reminderDate && todo.reminderTime;
  const isOverdue = hasReminder && new Date(`${todo.reminderDate}T${todo.reminderTime}`) < new Date();

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
          {hasReminder && (
            <div className={`flex items-center gap-1 mt-1 text-xs ${
              isOverdue ? "text-error font-semibold" : "text-gray-600"
            }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                {isOverdue ? "⚠️ Overdue: " : "Reminder: "}
                {todo.reminderDate} at {todo.reminderTime}
              </span>
            </div>
          )}
        </label>
      </div>

      <div className="flex gap-2 sm:flex-shrink-0 justify-end flex-wrap">
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            hasReminder
              ? "bg-primary text-white hover:bg-blue-600"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
          onClick={() => onSetReminder(todo)}
          aria-label={hasReminder ? "Edit reminder" : "Set reminder"}
        >
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {hasReminder ? "Edit" : "Remind"}
          </span>
        </button>

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
