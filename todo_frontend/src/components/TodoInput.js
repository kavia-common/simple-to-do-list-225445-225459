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
    <form className="RetroAdd" onSubmit={submit} aria-label="Add a new task">
      <label className="RetroAdd__label" htmlFor={inputId}>
        NEW QUEST
      </label>

      <div className="RetroAdd__row">
        <input
          id={inputId}
          className="RetroInput RetroInput--main"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError("");
          }}
          placeholder="e.g., Defeat the bug boss…"
          autoComplete="off"
          spellCheck="false"
          maxLength={200}
        />

        <button type="submit" className="RetroBtn RetroBtn--primary">
          Add
        </button>
      </div>

      <div className="RetroAdd__help" aria-live="polite">
        {error ? (
          <span className="RetroError">{error}</span>
        ) : (
          <span className="RetroHint">Your tasks are saved locally.</span>
        )}
      </div>
    </form>
  );
}
