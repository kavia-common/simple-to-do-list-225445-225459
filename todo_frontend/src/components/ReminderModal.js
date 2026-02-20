import React, { useState, useEffect, useId } from "react";

// PUBLIC_INTERFACE
export default function ReminderModal({ todo, onSave, onClose }) {
  /** Modal for setting reminder date and time for a task. */
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const dateId = useId();
  const timeId = useId();

  useEffect(() => {
    // Pre-fill with existing reminder if available
    if (todo.reminderDate) {
      setDate(todo.reminderDate);
    }
    if (todo.reminderTime) {
      setTime(todo.reminderTime);
    }
  }, [todo]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!date || !time) {
      alert("Please select both date and time for the reminder.");
      return;
    }
    onSave({ date, time });
  };

  const handleRemove = () => {
    onSave({ date: null, time: null });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reminder-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 id="reminder-modal-title" className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Set Reminder
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-gray-700 font-medium break-words">{todo.text}</p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor={dateId} className="block text-sm font-semibold text-gray-700 mb-2">
              Reminder Date
            </label>
            <input
              id={dateId}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={today}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor={timeId} className="block text-sm font-semibold text-gray-700 mb-2">
              Reminder Time
            </label>
            <input
              id={timeId}
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-md"
            >
              Save Reminder
            </button>
            {(todo.reminderDate || todo.reminderTime) && (
              <button
                type="button"
                onClick={handleRemove}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Remove
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
