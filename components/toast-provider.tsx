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
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    setToastVisible(true);
    if (toastHideTimeoutRef.current) {
      window.clearTimeout(toastHideTimeoutRef.current);
    }
    if (toastClearTimeoutRef.current) {
      window.clearTimeout(toastClearTimeoutRef.current);
    }
    toastHideTimeoutRef.current = window.setTimeout(() => {
      setToastVisible(false);
    }, 2000);
    toastClearTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 2400);
    return () => {
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
      badgeClass: "bg-emerald-500/20 text-emerald-300",
      icon: "✓",
    },
    error: {
      badgeClass: "bg-red-500/20 text-red-300",
      icon: "!",
    },
    info: {
      badgeClass: "bg-blue-500/20 text-blue-300",
      icon: "i",
    },
  } as const;

  const { badgeClass, icon } = typeStyles[toastType];

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toastMessage && (
        <div className="pointer-events-none fixed top-6 left-1/2 z-50 -translate-x-1/2">
          <div
            role="status"
            aria-live="polite"
            className={`flex items-center gap-2 rounded-full border border-white/20 bg-gray-900/90 px-4 py-2 text-sm text-white shadow-xl backdrop-blur transition-all duration-200 ease-out ${
              toastVisible
                ? "translate-y-0 opacity-100 scale-100"
                : "-translate-y-2 opacity-0 scale-95"
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full ${badgeClass}`}
            >
              {icon}
            </span>
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

