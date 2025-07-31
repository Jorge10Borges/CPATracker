import React from "react";

const ToastMessage = ({ message, type = "success", show, onClose }) => {
  if (!show) return null;
  let bg = "bg-green-500";
  if (type === "error") bg = "bg-red-500";
  if (type === "info") bg = "bg-blue-500";
  if (type === "warning") bg = "bg-yellow-500 text-black";
  return (
    <div className={`fixed top-6 right-6 z-[9999] px-4 py-2 rounded shadow-lg text-white font-semibold transition-all duration-300 ${bg}`}
      style={{ minWidth: 200 }}
      role="alert"
    >
      <div className="flex items-center justify-between gap-4">
        <span>{message}</span>
        <button
          className="ml-4 text-lg font-bold text-white/80 hover:text-white focus:outline-none"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ToastMessage;
