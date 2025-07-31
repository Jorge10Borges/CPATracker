import React, { useState, useEffect } from "react";

const PaginaDestinoModal = ({ show, onClose, editPagina, showToast, onSubmit, setEditPagina }) => {
  const [nombre, setNombre] = useState("");
  const [estado, setEstado] = useState("activa");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (editPagina) {
      setNombre(editPagina.nombre || "");
      setEstado(editPagina.estado || "activa");
      setUrl(editPagina.url || "");
    } else {
      setNombre("");
      setEstado("activa");
      setUrl("");
    }
  }, [editPagina, show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">{editPagina ? "Editar página de destino" : "Nueva página de destino"}</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              className="border rounded px-3 py-2 w-full"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">URL</label>
            <input
              type="text"
              name="url"
              className="border rounded px-3 py-2 w-full"
              value={url}
              onChange={e => setUrl(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select
              name="estado"
              className="border rounded px-3 py-2 w-full"
              value={estado}
              onChange={e => setEstado(e.target.value)}
            >
              <option value="activa">Activa</option>
              <option value="inactiva">Inactiva</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 rounded bg-[#4EC4FE] text-white font-semibold hover:bg-[#38a3d8]">
              {editPagina ? "Guardar cambios" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaginaDestinoModal;
