import * as React from "react";
import DataTableSection from "../components/DataTableSection";
import DateRangePicker from "../components/DateRangePicker";
import ConfirmDialog from "../components/ConfirmDialog";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";

// Datos de ejemplo para la tabla de Ofertas
const defaultData = [
  {
    oferta: "Oferta 1",
    visitas: 12000,
    visitas_unicas: 9000,
    clics: 400,
    clics_unicos: 350,
    conversiones: 20,
    ingresos: 800,
    costo: 600,
    beneficio: 200,
    cpv: 0.05,
    cpc: 1.5,
    ctr: "3.3%",
    ctr1x: 0.033,
    uctr: "2.9%",
    cr: "5%",
    cr1x: 0.05,
    cv: 20,
    cv1x: 0.0017,
    roi: "133%",
    epv: 1.2,
    epc: 0.7,
    ap: 8,
  },
  {
    oferta: "Oferta 2",
    visitas: 15000,
    visitas_unicas: 11000,
    clics: 600,
    clics_unicos: 500,
    conversiones: 30,
    ingresos: 1200,
    costo: 900,
    beneficio: 300,
    cpv: 0.06,
    cpc: 1.8,
    ctr: "4%",
    ctr1x: 0.04,
    uctr: "3.5%",
    cr: "5.5%",
    cr1x: 0.055,
    cv: 30,
    cv1x: 0.002,
    roi: "133%",
    epv: 1.3,
    epc: 0.8,
    ap: 10,
  },
];

const defaultColumns = [
  { header: "Oferta", accessorKey: "oferta", size: 160, minSize: 100, enableResizing: true },
  { header: "Visitas", accessorKey: "visitas", size: 100, minSize: 80, enableResizing: true },
  { header: "Visitas únicas", accessorKey: "visitas_unicas", size: 110, minSize: 90, enableResizing: true },
  { header: "Clics", accessorKey: "clics", size: 80, minSize: 60, enableResizing: true },
  { header: "Clics únicos", accessorKey: "clics_unicos", size: 90, minSize: 70, enableResizing: true },
  { header: "Conversiones", accessorKey: "conversiones", size: 110, minSize: 90, enableResizing: true },
  { header: "Ingresos", accessorKey: "ingresos", size: 90, minSize: 70, enableResizing: true },
  { header: "Costo", accessorKey: "costo", size: 80, minSize: 70, enableResizing: true },
  { header: "Beneficio", accessorKey: "beneficio", size: 90, minSize: 70, enableResizing: true },
  { header: "CPV", accessorKey: "cpv", size: 60, minSize: 50, enableResizing: true },
  { header: "CPC", accessorKey: "cpc", size: 60, minSize: 50, enableResizing: true },
  { header: "CTR", accessorKey: "ctr", size: 60, minSize: 50, enableResizing: true },
  { header: "CTR, 1/x", accessorKey: "ctr1x", size: 70, minSize: 60, enableResizing: true },
  { header: "UCTR", accessorKey: "uctr", size: 60, minSize: 50, enableResizing: true },
  { header: "CR", accessorKey: "cr", size: 60, minSize: 50, enableResizing: true },
  { header: "CR, 1/x", accessorKey: "cr1x", size: 70, minSize: 60, enableResizing: true },
  { header: "CV", accessorKey: "cv", size: 60, minSize: 50, enableResizing: true },
  { header: "CV, 1/x", accessorKey: "cv1x", size: 70, minSize: 60, enableResizing: true },
  { header: "ROI", accessorKey: "roi", size: 70, minSize: 60, enableResizing: true },
  { header: "EPV", accessorKey: "epv", size: 60, minSize: 50, enableResizing: true },
  { header: "EPC", accessorKey: "epc", size: 60, minSize: 50, enableResizing: true },
  { header: "AP", accessorKey: "ap", size: 60, minSize: 50, enableResizing: true },
];

const Ofertas = () => {
  const [data] = React.useState(() => [...defaultData]);
  const [columns] = React.useState(() => [...defaultColumns]);
  const [search, setSearch] = React.useState("");
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [selectedRowId, setSelectedRowId] = React.useState(null);

  // Filtrar datos por coincidencia en cualquier columna
  const filteredData = React.useMemo(() => {
    if (!search.trim()) return data;
    const lower = search.toLowerCase();
    return data.filter(row =>
      Object.values(row).some(val =>
        String(val).toLowerCase().includes(lower)
      )
    );
  }, [data, search]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
  });

  return (
    <DataTableSection
      title="Ofertas"
      toolbar={
        <>
          <div className="flex items-center gap-1 text-sm">
            <span>Fecha:</span>
            <DateRangePicker />
          </div>
          <button className="bg-[#273958] hover:bg-[#1b263b] text-white font-semibold px-3 py-1 rounded cursor-pointer">Aplicar</button>
          <input
            type="text"
            placeholder="Buscar..."
            className="border rounded px-2 py-1 text-sm flex-1 min-w-[120px]"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            className={`bg-gray-200 hover:bg-gray-300 text-[#273958] font-semibold px-3 py-1 rounded${selectedRowId ? ' cursor-pointer' : ' disabled:opacity-50 disabled:cursor-not-allowed'}`}
            onClick={() => setShowConfirm(true)}
            disabled={!selectedRowId}
          >
            Excluir
          </button>
          <button className="bg-[#4EC4FE] hover:bg-[#38a3d8] text-white font-semibold px-3 py-1 rounded cursor-pointer">Nueva</button>
          <button
            className={`bg-[#AD43FF] hover:bg-[#8e2ecb] text-white font-semibold px-3 py-1 rounded${selectedRowId ? ' cursor-pointer' : ' disabled:opacity-50 disabled:cursor-not-allowed'}`}
            disabled={!selectedRowId}
          >
            Editar
          </button>
          <button className="bg-[#FFB211] hover:bg-[#e09c0f] text-white font-semibold px-3 py-1 rounded cursor-pointer">Informe</button>
        </>
      }
    >
      <ConfirmDialog
        open={showConfirm}
        title="¿Estás seguro?"
        message="¿Deseas excluir los elementos seleccionados?"
        onConfirm={() => { setShowConfirm(false); }}
        onCancel={() => setShowConfirm(false)}
        confirmText="Sí"
        cancelText="No"
      />
      <div className="overflow-x-auto relative">
        <table className="min-w-full w-max bg-white border border-gray-200 rounded-lg select-none">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    style={{ width: header.getSize(), minWidth: 0, overflow: 'hidden' }}
                    className="px-4 py-2 text-left text-sm font-semibold text-[#273958] relative group whitespace-nowrap text-ellipsis overflow-hidden"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className="absolute right-0 top-0 h-full w-4 cursor-col-resize group-hover:bg-[#FFB211]/30"
                        style={{ userSelect: "none", touchAction: "none" }}
                        onClick={e => e.stopPropagation()}
                      />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className={selectedRowId === row.id ? "bg-[#E6F7FF]" : "hover:bg-gray-100 cursor-pointer"}
                onClick={() => setSelectedRowId(row.id)}
              >
                {row.getVisibleCells().map(cell => {
                  const isLeft = cell.column.id === 'oferta';
                  return (
                    <td
                      key={cell.id}
                      className={`px-4 py-2 border-t whitespace-nowrap overflow-hidden text-ellipsis ${isLeft ? 'text-left' : 'text-right'}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="bg-gray-100 font-bold">
              {table.getAllColumns().map((col, idx) => {
                const id = col.id || col.accessorKey;
                if (id === 'oferta') return <td key={id} className="px-4 py-2 border-t text-left">Total</td>;
                const total = filteredData.reduce((acc, row) => {
                  const val = row[id];
                  const num = typeof val === 'number' ? val : (parseFloat(String(val).replace(/[^\d.-]/g, '')) || 0);
                  return acc + (isNaN(num) ? 0 : num);
                }, 0);
                const isPercent = typeof filteredData[0]?.[id] === 'string' && String(filteredData[0][id]).includes('%');
                const isMoney = id === 'ingresos' || id === 'costo' || id === 'beneficio';
                let display = '';
                if (filteredData.length === 0) display = '';
                else if (isPercent) display = '';
                else if (isMoney) display = `$${total.toFixed(2)}`;
                else display = total % 1 === 0 ? total : total.toFixed(2);
                return (
                  <td key={id} className="px-4 py-2 border-t text-right">{display}</td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </DataTableSection>
  );
};

export default Ofertas;
