import { useState, useEffect, useCallback } from "react";
import { loadDismissedReminders, saveDismissedReminders } from "../utils/storage";

// PUBLIC_INTERFACE
export default function useReminderChecker(todos) {
  /** Custom hook to check for due/overdue reminders and manage notification state. */
  const [activeReminders, setActiveReminders] = useState([]);
  const [dismissedReminders, setDismissedReminders] = useState(() => loadDismissedReminders());

  const checkReminders = useCallback(() => {
    const now = new Date();
    const dueReminders = [];

    todos.forEach((todo) => {
      // Skip if no reminder set or already dismissed
      if (!todo.reminderDate || !todo.reminderTime) return;
      if (dismissedReminders[todo.id]) return;

      // Parse reminder datetime
      const reminderDateTime = new Date(`${todo.reminderDate}T${todo.reminderTime}`);
      
      // Check if reminder is due or overdue
      if (reminderDateTime <= now) {
        dueReminders.push({
          ...todo,
          isOverdue: reminderDateTime < now,
        });
      }
    });

    setActiveReminders(dueReminders);
  }, [todos, dismissedReminders]);

  useEffect(() => {
    // Check immediately
    checkReminders();

    // Check every 30 seconds
    const interval = setInterval(checkReminders, 30000);

    return () => clearInterval(interval);
  }, [checkReminders]);

  const dismissReminder = useCallback((todoId) => {
    const updated = { ...dismissedReminders, [todoId]: true };
    setDismissedReminders(updated);
    saveDismissedReminders(updated);
    setActiveReminders((prev) => prev.filter((r) => r.id !== todoId));
  }, [dismissedReminders]);

  const clearDismissed = useCallback((todoId) => {
    const updated = { ...dismissedReminders };
    delete updated[todoId];
    setDismissedReminders(updated);
    saveDismissedReminders(updated);
  }, [dismissedReminders]);

  return {
    activeReminders,
    dismissReminder,
    clearDismissed,
  };
}
