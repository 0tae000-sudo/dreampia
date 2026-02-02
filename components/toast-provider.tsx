"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type ToastType = "success" | "error" | "info";

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<ToastType>("success");
  const [toastVisible, setToastVisible] = useState(false);
  const toastHideTimeoutRef = useRef<number | null>(null);
  const toastClearTimeoutRef = useRef<number | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    setToastVisible(false);
    setToastMessage(message);
    setToastType(type);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    setToastVisible(false);
    if (toastHideTimeoutRef.current) {
      window.clearTimeout(toastHideTimeoutRef.current);
    }
    if (toastClearTimeoutRef.current) {
      window.clearTimeout(toastClearTimeoutRef.current);
    }
    const showAnimationFrameId = window.requestAnimationFrame(() => {
      setToastVisible(true);
    });
    toastHideTimeoutRef.current = window.setTimeout(() => {
      setToastVisible(false);
    }, 2000);
    toastClearTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 2400);
    return () => {
      window.cancelAnimationFrame(showAnimationFrameId);
      if (toastHideTimeoutRef.current) {
        window.clearTimeout(toastHideTimeoutRef.current);
      }
      if (toastClearTimeoutRef.current) {
        window.clearTimeout(toastClearTimeoutRef.current);
      }
    };
  }, [toastMessage]);

  useEffect(() => {
    return () => {
      if (toastHideTimeoutRef.current) {
        window.clearTimeout(toastHideTimeoutRef.current);
      }
      if (toastClearTimeoutRef.current) {
        window.clearTimeout(toastClearTimeoutRef.current);
      }
    };
  }, []);

  const typeStyles = {
    success: {
      wrapperClass: "bg-emerald-600 text-white",
      badgeClass: "bg-white/20 text-white",
      icon: "✓",
    },
    error: {
      wrapperClass: "bg-red-600 text-white",
      badgeClass: "bg-white/20 text-white",
      icon: "!",
    },
    info: {
      wrapperClass: "bg-blue-600 text-white",
      badgeClass: "bg-white/20 text-white",
      icon: "i",
    },
  } as const;

  const { wrapperClass, badgeClass, icon } = typeStyles[toastType];

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toastMessage && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 pb-[env(safe-area-inset-bottom)]">
          <div
            role="status"
            aria-live="polite"
            className={`flex items-center gap-3 rounded-full ${wrapperClass} px-6 py-3 text-base font-semibold shadow-2xl ring-1 ring-black/10 transition-all duration-600 ease-[cubic-bezier(0.22,1.1,0.36,1)] transform-gpu ${
              toastVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-16 opacity-0"
            }`}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full ${badgeClass}`}
            >
              {icon}
            </span>
            <span className="whitespace-nowrap">{toastMessage}</span>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

