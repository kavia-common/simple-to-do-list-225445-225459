import React, { useEffect, useMemo, useRef } from "react";
import styles from "../styles/ReminderAlert.module.css";

/**
 * @typedef {Object} ReminderPayload
 * @property {string} todoId
 * @property {string} title
 * @property {number} remindAt
 */

// PUBLIC_INTERFACE
export default function ReminderAlert({ open, reminder, onDismiss, onSnooze }) {
  /** Modern reminder alert modal. Preserves reminder behavior (dismiss/snooze) and does not alter sound logic. */

  const dialogRef = useRef(null);
  const primaryBtnRef = useRef(null);

  const timeText = useMemo(() => {
    if (!reminder?.remindAt) return "";
    try {
      return new Date(reminder.remindAt).toLocaleString();
    } catch {
      return "";
    }
  }, [reminder?.remindAt]);

  useEffect(() => {
    if (!open) return;

    // Move focus to primary button for keyboard users.
    const t = window.setTimeout(() => {
      primaryBtnRef.current?.focus();
    }, 0);

    function onKeyDown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        onDismiss();
        return;
      }

      // Light focus containment (keeps tab inside the modal controls).
      if (e.key === "Tab") {
        const root = dialogRef.current;
        if (!root) return;

        const focusables = root.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;

        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onDismiss]);

  if (!open || !reminder) return null;

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={onDismiss}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reminderTitle"
        aria-describedby="reminderDesc"
        ref={dialogRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.top}>
          <div className={styles.iconWrap} aria-hidden="true">
            <div className={styles.iconPulse} />
            <div className={styles.icon}>⏰</div>
          </div>

          <div className={styles.headings}>
            <p className={styles.kicker}>Reminder</p>
            <h2 id="reminderTitle" className={styles.title}>
              {reminder.title}
            </h2>
            <p id="reminderDesc" className={styles.desc}>
              {timeText ? (
                <>
                  Scheduled for <span className={styles.time}>{timeText}</span>
                </>
              ) : (
                "It’s time."
              )}
            </p>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primary}
            onClick={onDismiss}
            ref={primaryBtnRef}
          >
            Dismiss
          </button>

          <div className={styles.snoozeGroup} aria-label="Snooze options">
            <button
              type="button"
              className={styles.secondary}
              onClick={() => onSnooze(5)}
            >
              Snooze 5m
            </button>
            <button
              type="button"
              className={styles.secondary}
              onClick={() => onSnooze(15)}
            >
              15m
            </button>
            <button
              type="button"
              className={styles.secondary}
              onClick={() => onSnooze(60)}
            >
              1h
            </button>
          </div>
        </div>

        <div className={styles.footer}>
          <span className={styles.hint}>
            Tip: Press <kbd className={styles.kbd}>Esc</kbd> to dismiss.
          </span>
        </div>
      </div>
    </div>
  );
}
