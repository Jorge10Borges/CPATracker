import * as React from "react";
import DataTableSection from "../components/DataTableSection";
import Toolbar from "../components/PaginaDestino/Toolbar";
import ConfirmDialog from "../components/ConfirmDialog";
import ToastMessage from "../components/ToastMessage";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";

// Datos de ejemplo eliminados. Se usará fetch para cargar datos reales.

const defaultColumns = [
  { header: "Página destino", accessorKey: "pagina", size: 160, minSize: 100, enableResizing: true },
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


const PaginaDestino = () => {
  // Callbacks para el toolbar
  const handleExcluir = () => {
    if (selectedRowId !== null) {
      const row = table.getRowModel().rows.find(r => r.id === selectedRowId);
      setSelectedDbId(row?.original?.id || null);
      setShowConfirm(true);
    }
  };
  const handleNueva = () => {};
  const handleEditar = () => {};
  const handleInforme = () => {};
  const [data, setData] = React.useState([]);
  const [columns] = React.useState(() => [...defaultColumns]);
  const [search, setSearch] = React.useState("");
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [selectedRowId, setSelectedRowId] = React.useState(null); // row.id de react-table
  const [selectedDbId, setSelectedDbId] = React.useState(null); // id real de la base de datos
  const [dateRange, setDateRange] = React.useState({ start: null, end: null });
  const [loadingExcluir, setLoadingExcluir] = React.useState(false);
  // Toast
  const [toast, setToast] = React.useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  // Cargar datos desde la API
  const fetchData = React.useCallback(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    let url = apiUrl + "paginas_destino_stats.php";
    if (dateRange.start && dateRange.end) {
      url += `?start=${encodeURIComponent(dateRange.start)}&end=${encodeURIComponent(dateRange.end)}`;
    }
    fetch(url)
      .then(res => res.json())
      .then(apiData => {
        // Guardar el id real de la base de datos en cada fila
        const mapped = apiData.map(row => ({
          id: row.id, // id real de la base de datos
          pagina: row.nombre,
          visitas: Number(row.visitas) || 0,
          visitas_unicas: Number(row.visitas_unicas) || 0,
          clics: Number(row.clics) || 0,
          clics_unicos: 0, // Si tienes este dato en el futuro, agrégalo aquí
          conversiones: Number(row.conversiones) || 0,
          ingresos: Number(row.ingresos) || 0,
          costo: Number(row.costo) || 0,
          beneficio: Number(row.beneficio) || 0,
          cpv: row.visitas > 0 ? (row.costo / row.visitas).toFixed(2) : "0.00",
          cpc: row.clics > 0 ? (row.costo / row.clics).toFixed(2) : "0.00",
          ctr: row.CTR + "%",
          ctr1x: row.CTR > 0 ? `1/${Math.round(100/row.CTR)}` : "",
          uctr: "0%", // Si tienes este dato en el futuro, agrégalo aquí
          cr: row.CR + "%",
          cr1x: row.CR > 0 ? `1/${Math.round(100/row.CR)}` : "",
          cv: row.conversiones,
          cv1x: row.conversiones > 0 ? `1/${row.conversiones}` : "",
          roi: row.costo > 0 ? ((row.beneficio / row.costo) * 100).toFixed(2) + "%" : "0%",
          epv: row.visitas > 0 ? (row.ingresos / row.visitas).toFixed(2) : "0.00",
          epc: row.clics > 0 ? (row.ingresos / row.clics).toFixed(2) : "0.00",
          ap: row.visitas > 0 ? (row.beneficio / row.visitas).toFixed(2) : "0.00",
        }));
        setData(mapped);
      });
  }, [dateRange]);

  // Ejecutar fetchData al montar y cuando cambie dateRange
  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ...resto del código sin cambios...

  // Filtrado de datos para la tabla y totales
  const filteredData = React.useMemo(() => {
    let filtered = data;
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(row =>
        Object.values(row).some(val => String(val).toLowerCase().includes(s))
      );
    }
    // Si quieres filtrar por dateRange aquí, agrega lógica adicional
    return filtered;
  }, [data, search]);

  // Instancia de la tabla react-table
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
            // ...existing code...
  // Render principal limpio
  return (
    <>
      <DataTableSection
        title="Página destino"
        toolbar={
          <Toolbar
            dateRange={dateRange}
            setDateRange={setDateRange}
            search={search}
            setSearch={setSearch}
            selectedRowId={selectedRowId}
            loadingExcluir={loadingExcluir}
            onExcluir={handleExcluir}
            onNueva={handleNueva}
            onEditar={handleEditar}
            onInforme={handleInforme}
          />
        }
      >
        <ConfirmDialog
          open={showConfirm}
          title="¿Estás seguro?"
          message="¿Deseas excluir la página seleccionada?"
          onConfirm={async () => {
            setLoadingExcluir(true);
            try {
              const apiUrl = import.meta.env.VITE_API_URL;
              const res = await fetch(apiUrl + 'paginas_destino_delete.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedDbId })
              });
              const result = await res.json();
              if (result.success) {
                setShowConfirm(false);
                setSelectedRowId(null);
                setSelectedDbId(null);
                fetchData(); // Recargar datos
                showToast('Página excluida correctamente', 'success');
              } else {
                showToast(result.error || 'Error al excluir la página', 'error');
              }
            } catch (err) {
              showToast('Error de red al excluir la página', 'error');
            } finally {
              setLoadingExcluir(false);
            }
          }}
          onCancel={() => setShowConfirm(false)}
          confirmText={loadingExcluir ? 'Excluyendo...' : 'Sí'}
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
                  onClick={() => {
                    setSelectedRowId(row.id);
                    setSelectedDbId(row.original?.id || null);
                  }}
                >
                  {row.getVisibleCells().map(cell => {
                    const isLeft = cell.column.id === 'pagina';
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
              {/* Fila de totales única y correctamente cerrada */}
              <tr className="bg-gray-100 font-bold">
                {table.getAllColumns().map((col, idx) => {
                  const id = col.id || col.accessorKey;
                  if (id === 'pagina') {
                    return <td key={id} className="px-4 py-2 border-t text-left">Total</td>;
                  }
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
              {/* Fila de totales única y correctamente cerrada */}
            </tbody>
          </table>
        </div>
        <ToastMessage
          show={toast.show}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(t => ({ ...t, show: false }))}
        />
      </DataTableSection>
    </>
  );
}

export default PaginaDestino;
