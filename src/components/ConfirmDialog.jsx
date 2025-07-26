import React from "react";


const ConfirmDialog = ({
  open,
  title = "Confirmar",
  message = "¿Estás seguro?",
  onConfirm,
  onCancel,
  confirmText = "Sí",
  cancelText = "No",
  children
}) => {
  if (!open) return null;
  // Cerrar al hacer click fuera del modal
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && onCancel) onCancel();
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-[90vw]" onClick={e => e.stopPropagation()}>
        {title && <h3 className="text-lg font-bold text-[#273958] mb-2">{title}</h3>}
        <div className="mb-4 text-[#273958]">
          {children ? children : message}
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 text-[#273958] font-semibold cursor-pointer"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className="px-4 py-1 rounded bg-[#4EC4FE] hover:bg-[#38a3d8] text-white font-semibold cursor-pointer"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
