import React from "react";
import DateRangePicker from "../../components/DateRangePicker";

const Toolbar = ({
  dateRange,
  setDateRange,
  search,
  setSearch,
  selectedRowId,
  loadingExcluir,
  onExcluir,
  onNueva,
  onEditar,
  onInforme
}) => (
  <>
    <div className="flex items-center gap-1 text-sm">
      <span>Fecha:</span>
      <DateRangePicker value={dateRange} onChange={setDateRange} />
    </div>
    <input
      type="text"
      placeholder="Buscar..."
      className="border rounded px-2 py-1 text-sm flex-1 min-w-[120px]"
      value={search}
      onChange={e => setSearch(e.target.value)}
    />
    <button
      className={`bg-gray-200 hover:bg-gray-300 text-[#273958] font-semibold px-3 py-1 rounded${selectedRowId ? ' cursor-pointer' : ' disabled:opacity-50 disabled:cursor-not-allowed'}`}
      onClick={onExcluir}
      disabled={!selectedRowId}
    >
      {loadingExcluir ? 'Excluyendo...' : 'Excluir'}
    </button>
    <button
      className="bg-[#4EC4FE] hover:bg-[#38a3d8] text-white font-semibold px-3 py-1 rounded cursor-pointer"
      onClick={onNueva}
    >
      Nueva
    </button>
    <button
      className={`bg-[#AD43FF] hover:bg-[#8e2ecb] text-white font-semibold px-3 py-1 rounded${selectedRowId ? ' cursor-pointer' : ' disabled:opacity-50 disabled:cursor-not-allowed'}`}
      onClick={onEditar}
      disabled={!selectedRowId}
    >
      Editar
    </button>
    <button
      className="bg-[#FFB211] hover:bg-[#e09c0f] text-white font-semibold px-3 py-1 rounded cursor-pointer"
      onClick={onInforme}
    >
      Informe
    </button>
  </>
);

export default Toolbar;
