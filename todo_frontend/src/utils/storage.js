const STORAGE_KEY = "retro_todo__items_v1";
const REMINDERS_KEY = "retro_todo__reminders_v1";
const DISMISSED_KEY = "retro_todo__dismissed_v1";

/**
 * Checks whether a value is a plain object.
 * @param {unknown} v
 * @returns {boolean}
 */
function isObject(v) {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/**
 * Validates and normalizes a todo record.
 * @param {unknown} v
 * @returns {{id: string, text: string, completed: boolean, createdAt?: string, reminderDate?: string, reminderTime?: string} | null}
 */
function normalizeTodo(v) {
  if (!isObject(v)) return null;
  if (typeof v.id !== "string") return null;
  if (typeof v.text !== "string") return null;
  if (typeof v.completed !== "boolean") return null;

  const todo = {
    id: v.id,
    text: v.text,
    completed: v.completed,
  };

  if (typeof v.createdAt === "string") {
    todo.createdAt = v.createdAt;
  }

  if (typeof v.reminderDate === "string") {
    todo.reminderDate = v.reminderDate;
  }

  if (typeof v.reminderTime === "string") {
    todo.reminderTime = v.reminderTime;
  }

  return todo;
}

// PUBLIC_INTERFACE
export function loadTodos() {
  /** Loads todos from browser localStorage. Returns [] when missing/invalid. */
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const normalized = parsed.map(normalizeTodo).filter(Boolean);
    return normalized;
  } catch {
    // If storage is unavailable (privacy mode) or JSON is invalid, fail gracefully.
    return [];
  }
}

// PUBLIC_INTERFACE
export function saveTodos(todos) {
  /** Saves todos to browser localStorage (best-effort, non-throwing). */
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // ignore (storage full/blocked)
  }
}

// PUBLIC_INTERFACE
export function loadDismissedReminders() {
  /** Loads dismissed reminder IDs from localStorage. Returns empty object when missing/invalid. */
  try {
    const raw = window.localStorage.getItem(DISMISSED_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};

    return parsed;
  } catch {
    return {};
  }
}

// PUBLIC_INTERFACE
export function saveDismissedReminders(dismissed) {
  /** Saves dismissed reminder IDs to localStorage (best-effort, non-throwing). */
  try {
    window.localStorage.setItem(DISMISSED_KEY, JSON.stringify(dismissed));
  } catch {
    // ignore (storage full/blocked)
  }
}
