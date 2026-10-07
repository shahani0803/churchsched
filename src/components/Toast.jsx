import React from "react";
import { useParish } from "../context/ParishContext";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export const ToastContainer = () => {
  const { toasts, removeToast } = useParish();

  if (!toasts.length) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type === "success" && <CheckCircle2 size={18} className="toast-icon" />}
          {t.type === "error" && <AlertCircle size={18} className="toast-icon" />}
          {t.type === "info" && <Info size={18} className="toast-icon" />}
          <span className="toast-msg">{t.message}</span>
          <button
            onClick={() => removeToast(t.id)}
            className="toast-close"
            aria-label="Close notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
