"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

interface ToastProps {
  message: string;
  type?: "error" | "success" | "info";
  onClose?: () => void;
}

export function Toast({ message, type = "info", onClose }: ToastProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  const typeStyles = {
    error: "bg-red-500 text-white",
    success: "bg-green-500 text-white",
    info: "bg-blue-500 text-white",
  };

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transition-all duration-300",
        typeStyles[type]
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium">{message}</p>
        {onClose && (
          <button
            onClick={() => {
              setIsVisible(false);
              onClose();
            }}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Close notification"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

interface ToastContextValue {
  showToast: (message: string, type?: "error" | "success" | "info") => void;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(
  undefined
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = React.useState<{
    message: string;
    type: "error" | "success" | "info";
  } | null>(null);

  const showToast = React.useCallback(
    (message: string, type: "error" | "success" | "info" = "info") => {
      setToast({ message, type });
    },
    []
  );

  const handleClose = React.useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleClose}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
