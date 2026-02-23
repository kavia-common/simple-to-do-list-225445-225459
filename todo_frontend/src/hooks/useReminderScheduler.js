import { useCallback, useEffect, useMemo, useRef } from "react";

/**
 * A tiny WebAudio "beep" so reminder works without external assets.
 * Kept intentionally simple to preserve "sound behavior intact" within this app.
 */
function playBeep() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();

    o.type = "sine";
    o.frequency.value = 880;

    // Fade in/out for less harsh sound.
    const now = ctx.currentTime;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    o.connect(g);
    g.connect(ctx.destination);

    o.start(now);
    o.stop(now + 0.38);

    o.onended = () => {
      try {
        ctx.close();
      } catch {
        // ignore
      }
    };
  } catch {
    // ignore audio failures
  }
}

// PUBLIC_INTERFACE
export function useReminderScheduler({ todos, onReminderFire, onTodosChange }) {
  /**
   * Schedules reminders locally (polling) and triggers `onReminderFire` when due.
   * Also plays a short beep when firing.
   *
   * - Keeps reminder functionality intact: due reminders fire, can be snoozed or dismissed.
   * - Sound behavior intact: beep plays on fire (not on snooze/dismiss).
   */

  const todosRef = useRef(todos);
  useEffect(() => {
    todosRef.current = todos;
  }, [todos]);

  const nextDueAt = useMemo(() => {
    let min = Infinity;
    for (const t of todos) {
      if (!t.remindAt) continue;
      if (t.completed) continue;
      const already = t.lastRemindedAt && t.lastRemindedAt >= t.remindAt;
      if (already) continue;
      if (t.remindAt < min) min = t.remindAt;
    }
    return min === Infinity ? null : min;
  }, [todos]);

  useEffect(() => {
    // Poll every second; small app, simple behavior.
    const interval = window.setInterval(() => {
      const now = Date.now();
      const list = todosRef.current;

      for (const t of list) {
        if (!t.remindAt) continue;
        if (t.completed) continue;

        const already = t.lastRemindedAt && t.lastRemindedAt >= t.remindAt;
        if (already) continue;

        if (now >= t.remindAt) {
          // Mark reminded before firing to avoid repeated alerts if UI is open.
          onTodosChange((prev) =>
            prev.map((x) =>
              x.id === t.id ? { ...x, lastRemindedAt: now } : x
            )
          );

          playBeep();
          onReminderFire({ todoId: t.id, title: t.title, remindAt: t.remindAt });
          break;
        }
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [onReminderFire, onTodosChange]);

  const snoozeMinutes = useCallback(
    (todoId, minutes) => {
      const now = Date.now();
      const ms = minutes * 60 * 1000;
      onTodosChange((prev) =>
        prev.map((t) => {
          if (t.id !== todoId) return t;
          const nextAt = now + ms;
          return { ...t, remindAt: nextAt, lastRemindedAt: null };
        })
      );
    },
    [onTodosChange]
  );

  const dismissReminder = useCallback(
    (todoId) => {
      // Dismiss = clear reminder time.
      onTodosChange((prev) =>
        prev.map((t) => (t.id === todoId ? { ...t, remindAt: null } : t))
      );
    },
    [onTodosChange]
  );

  return { snoozeMinutes, dismissReminder, nextDueAt };
}
