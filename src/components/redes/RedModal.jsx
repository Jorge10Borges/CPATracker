import React from "react";


import { useState, useEffect } from "react";

const RedModal = ({ show, onClose, onSubmit, editRed, showToast, dateRange, setData, setEditRed, setShowRedModal }) => {
  const [nombre, setNombre] = useState("");
  const [estado, setEstado] = useState("activa");
  const [parametro, setParametro] = useState("");

  useEffect(() => {
    setNombre(editRed?.nombre || "");
    setEstado(editRed?.estado || "activa");
    setParametro(editRed?.parametro || "");
  }, [editRed, show]);

  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative animate-fade-in">
        <h2 className="text-xl font-bold mb-4 text-[#273958]">
          {editRed ? 'Editar Red de Afiliados' : 'Nueva Red de Afiliados'}
        </h2>
        <form className="space-y-4" onSubmit={e => {
          e.preventDefault();
          onSubmit({
            target: {
              nombre: { value: nombre },
              estado: { value: estado },
              parametro: { value: parametro }
            },
            preventDefault: () => {},
          });
        }}>
          <div>
            <label className="block text-sm font-semibold mb-1">Nombre</label>
            <input name="nombre" type="text" className="w-full border rounded px-3 py-2" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre de la red" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Estado</label>
            <select name="estado" className="w-full border rounded px-3 py-2" value={estado} onChange={e => setEstado(e.target.value)}>
              <option value="activa">Activa</option>
              <option value="inactiva">Inactiva</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Parámetro de ID de clic (postback)</label>
            <input name="parametro" type="text" className="w-full border rounded px-3 py-2" value={parametro} onChange={e => setParametro(e.target.value)} placeholder="Ej: aff_sub" />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-[#273958] font-semibold cursor-pointer" onClick={onClose}>Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded bg-[#4EC4FE] hover:bg-[#38a3d8] text-white font-semibold cursor-pointer">{editRed ? 'Guardar cambios' : 'Crear Red'}</button>
          </div>
        </form>
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl cursor-pointer" onClick={onClose}>&times;</button>
      </div>
    </div>
  );
};

export default RedModal;
