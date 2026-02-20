import React, { useEffect, useRef, useCallback } from "react";

// PUBLIC_INTERFACE
export default function ReminderNotification({ reminders, onDismiss }) {
  /** Displays active reminder alerts with visual and audio notifications. */
  const hasPlayedRef = useRef(false);
  const audioContextRef = useRef(null);
  const loopIntervalRef = useRef(null);
  const loopTimeoutRef = useRef(null);

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

      // Configure notification sound (pleasant two-tone beep) - LOUDER
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.frequency.setValueAtTime(600, ctx.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, ctx.currentTime + 0.2);

      // Increased gain from 0.3 to 0.8 for significantly louder sound
      gainNode.gain.setValueAtTime(0.8, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.3);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    } catch (error) {
      // Ignore audio errors in browsers that don't support Web Audio API
      console.warn("Could not play notification sound:", error);
    }
  }, []);

  const startLoopingSound = useCallback(() => {
    // Play the sound immediately
    playNotificationSound();

    // Set up looping - play sound every 1.5 seconds (0.3s sound + 1.2s pause)
    loopIntervalRef.current = setInterval(() => {
      playNotificationSound();
    }, 1500);

    // Stop looping after 1 minute (60000ms)
    loopTimeoutRef.current = setTimeout(() => {
      if (loopIntervalRef.current) {
        clearInterval(loopIntervalRef.current);
        loopIntervalRef.current = null;
      }
    }, 60000);
  }, [playNotificationSound]);

  const stopLoopingSound = useCallback(() => {
    if (loopIntervalRef.current) {
      clearInterval(loopIntervalRef.current);
      loopIntervalRef.current = null;
    }
    if (loopTimeoutRef.current) {
      clearTimeout(loopTimeoutRef.current);
      loopTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Start looping sound when reminders appear
    if (reminders.length > 0 && !hasPlayedRef.current) {
      startLoopingSound();
      hasPlayedRef.current = true;
    }

    // Stop looping and reset when reminders are dismissed
    if (reminders.length === 0) {
      stopLoopingSound();
      hasPlayedRef.current = false;
    }

    // Cleanup on unmount
    return () => {
      stopLoopingSound();
    };
  }, [reminders, startLoopingSound, stopLoopingSound]);

  if (reminders.length === 0) return null;

  return (
    <>
      <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          @keyframes pulse-glow {
            0%, 100% {
              box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
            }
            50% {
              box-shadow: 0 0 30px rgba(239, 68, 68, 0.6);
            }
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }

          .reminder-card {
            animation: slideInRight 0.4s ease-out, shake 0.5s ease-in-out 0.4s;
          }

          .reminder-glow {
            animation: pulse-glow 2s ease-in-out infinite;
          }
        `}
      </style>

      <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md w-full px-4 sm:px-0" role="alert" aria-live="assertive">
        {reminders.map((reminder, index) => (
          <div
            key={reminder.id}
            className="reminder-card reminder-glow bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-red-200 overflow-hidden"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Header with gradient */}
            <div className="relative bg-gradient-to-r from-red-500 via-red-600 to-rose-600 px-5 py-4">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
              </div>
              
              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Animated bell icon */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/30 rounded-full blur-md animate-pulse"></div>
                    <div className="relative bg-white/20 backdrop-blur-sm p-2.5 rounded-full">
                      <svg className="w-6 h-6 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-bold text-lg tracking-tight">Reminder Alert</h3>
                    <p className="text-white/90 text-xs font-medium mt-0.5">
                      {reminder.isOverdue ? "⚠️ Overdue task" : "📌 Due now"}
                    </p>
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={() => onDismiss(reminder.id)}
                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1.5 transition-all duration-200"
                  aria-label="Dismiss notification"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-5 py-4 space-y-4">
              {/* Task text */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="bg-red-50 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-semibold text-base leading-relaxed break-words">
                    {reminder.text}
                  </p>
                </div>
              </div>

              {/* Time info */}
              <div className="flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border border-red-100">
                <div className="flex-shrink-0">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 flex-1">
                  {reminder.reminderDate} at {reminder.reminderTime}
                </span>
                {reminder.isOverdue && (
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                    Overdue
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => onDismiss(reminder.id)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Dismiss
                  </span>
                </button>
              </div>
            </div>

            {/* Bottom accent line */}
            <div className="h-1 bg-gradient-to-r from-red-500 via-rose-500 to-red-500"></div>
          </div>
        ))}
      </div>
    </>
  );
}
