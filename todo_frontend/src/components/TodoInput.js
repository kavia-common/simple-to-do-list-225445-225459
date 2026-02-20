import React, { useId, useState } from "react";

// PUBLIC_INTERFACE
export default function TodoInput({ onAdd }) {
  /** Controlled input for creating a new task. */
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const inputId = useId();

  const submit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();

    if (!trimmed) {
      setError("Type something first.");
      return;
    }
    if (trimmed.length > 120) {
      setError("Keep it under 120 characters.");
      return;
    }

    onAdd(trimmed);
    setText("");
    setError("");
  };

  return (
    <form className="space-y-3" onSubmit={submit} aria-label="Add a new task">
      <label className="block text-white/90 text-sm font-semibold uppercase tracking-wide" htmlFor={inputId}>
        New Task
      </label>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          id={inputId}
          className="flex-1 px-4 py-3 bg-white/95 backdrop-blur-sm text-gray-900 rounded-lg border-2 border-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-500"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError("");
          }}
          placeholder="e.g., Buy groceries, finish report..."
          autoComplete="off"
          spellCheck="false"
          maxLength={200}
        />

        <button 
          type="submit" 
          className="px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-md sm:w-auto w-full"
        >
          Add Task
        </button>
      </div>

      <div className="min-h-[20px]" aria-live="polite">
        {error ? (
          <span className="text-red-100 text-sm font-medium">{error}</span>
        ) : (
          <span className="text-white/70 text-sm">Your tasks are saved locally in your browser.</span>
        )}
      </div>
    </form>
  );
}
