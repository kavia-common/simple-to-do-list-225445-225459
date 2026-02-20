import React, { useEffect, useRef, useCallback } from "react";

// PUBLIC_INTERFACE
export default function ReminderNotification({ reminders, onDismiss }) {
  /** Displays active reminder alerts with visual and audio notifications. */
  const hasPlayedRef = useRef(false);
  const audioContextRef = useRef(null);

  const playNotificationSound = useCallback(() => {
    try {
      // Create AudioContext if it doesn't exist
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Configure notification sound (pleasant two-tone beep)
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.frequency.setValueAtTime(600, ctx.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, ctx.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    } catch (error) {
      // Ignore audio errors in browsers that don't support Web Audio API
      console.warn("Could not play notification sound:", error);
    }
  }, []);

  useEffect(() => {
    // Play sound when reminders appear
    if (reminders.length > 0 && !hasPlayedRef.current) {
      playNotificationSound();
      hasPlayedRef.current = true;
    }

    if (reminders.length === 0) {
      hasPlayedRef.current = false;
    }
  }, [reminders, playNotificationSound]);

  if (reminders.length === 0) return null;

  return (
    <>
      <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full px-4" role="alert" aria-live="assertive">
        {reminders.map((reminder) => (
          <div
            key={reminder.id}
            className="bg-white rounded-xl shadow-2xl border-2 border-error overflow-hidden animate-bounce"
            style={{ animation: "bounce 1s ease-in-out 3" }}
          >
            <div className="bg-gradient-to-r from-error to-red-600 p-3">
              <div className="flex items-center gap-2">
                <div className="animate-pulse">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg">Reminder Alert!</h3>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-error flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-900 font-semibold break-words flex-1">{reminder.text}</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  {reminder.isOverdue ? "Overdue" : "Due now"} - {reminder.reminderDate} at {reminder.reminderTime}
                </span>
              </div>

              <button
                onClick={() => onDismiss(reminder.id)}
                className="w-full px-4 py-2 bg-error text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
