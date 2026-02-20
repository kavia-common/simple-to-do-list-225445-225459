import React, { useId } from "react";

// PUBLIC_INTERFACE
export default function TodoItem({ todo, onToggle, onDelete, onSetReminder }) {
  /** Renders a single to-do item row with completion toggle, delete, and reminder. */
  const checkboxId = useId();

  const hasReminder = todo.reminderDate && todo.reminderTime;
  const isOverdue = hasReminder && new Date(`${todo.reminderDate}T${todo.reminderTime}`) < new Date();

  return (
    <li 
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border transition-all duration-200 ${
        todo.completed
          ? "bg-gradient-to-r from-gray-50 to-gray-100/50 border-gray-200 opacity-75"
          : "bg-white border-gray-200 hover:border-primary/50 hover:shadow-lg hover:scale-[1.01] transform"
      }`} 
      role="listitem"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <input
          id={checkboxId}
          type="checkbox"
          className="w-5 h-5 text-primary rounded-md focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0 transition-all"
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
            <div className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1.5 rounded-lg text-xs font-medium ${
              isOverdue 
                ? "bg-red-50 text-red-700 border border-red-200" 
                : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                {isOverdue ? "⚠️ Overdue: " : "📅 "}
                {todo.reminderDate} at {todo.reminderTime}
              </span>
            </div>
          )}
        </label>
      </div>

      <div className="flex gap-2 sm:flex-shrink-0 justify-end flex-wrap">
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 ${
            hasReminder
              ? "bg-gradient-to-r from-primary to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-primary/50"
          }`}
          onClick={() => onSetReminder(todo)}
          aria-label={hasReminder ? "Edit reminder" : "Set reminder"}
        >
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {hasReminder ? "Edit" : "Remind"}
          </span>
        </button>

        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-success/50 transition-all duration-200 transform hover:scale-105 active:scale-95"
          onClick={() => onToggle(todo.id)}
          aria-label={todo.completed ? "Mark as not completed" : "Mark as completed"}
        >
          <span className="flex items-center gap-1.5">
            {todo.completed ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {todo.completed ? "Undo" : "Done"}
          </span>
        </button>

        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md transform hover:scale-105 active:scale-95"
          onClick={() => onDelete(todo.id)}
          aria-label="Delete task"
        >
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </span>
        </button>
      </div>
    </li>
  );
}
