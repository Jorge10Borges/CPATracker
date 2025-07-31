import * as React from "react";
import { useState, useRef } from "react";
import DataTableSection from "../components/DataTableSection";
import DateRangePicker from "../components/DateRangePicker";
import { useDateRange } from "../context/DateRangeContext";
import ConfirmDialog from "../components/ConfirmDialog";
import ToastMessage from "../components/ToastMessage";
import RedModal from "../components/redes/RedModal";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";

// Se usará fetch para cargar datos reales del API

const defaultColumns = [
  { header: "Red", accessorKey: "red", size: 160, minSize: 100, enableResizing: true },
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

const Redes = () => {
  const [data, setData] = React.useState([]);
  const [columns] = React.useState(() => [...defaultColumns]);
  const [search, setSearch] = React.useState("");
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  // Ref para mantener el id seleccionado tras recarga
  const selectedRowIdRef = useRef(null);
  const { dateRange, setDateRange } = useDateRange();
  // Modal para crear/editar red
  const [showRedModal, setShowRedModal] = useState(false);
  const [editRed, setEditRed] = useState(null); // null = crear, objeto = editar
  // Estado para loading de eliminación
  const [deleting, setDeleting] = useState(false);
  // Toast
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  // Cargar datos reales del API filtrando por fechas
  React.useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    let url = apiUrl + "redes_stats.php";
    if (dateRange.start && dateRange.end) {
      url += `?start=${encodeURIComponent(dateRange.start)}&end=${encodeURIComponent(dateRange.end)}`;
    }
    fetch(url)
      .then(res => res.json())
      .then(apiData => {
        const mapped = apiData.map(row => ({
          id: String(row.id),
          nombre: row.nombre,
          estado: row.estado,
          parametro: row.parametro || '',
          red: row.nombre,
          visitas: Number(row.visitas) || 0,
          visitas_unicas: Number(row.visitas_unicas) || 0,
          clics: Number(row.clics) || 0,
          clics_unicos: Number(row.clics_unicos) || 0,
          conversiones: Number(row.conversiones) || 0,
          ingresos: Number(row.ingresos) || 0,
          costo: Number(row.costo) || 0,
          beneficio: Number(row.beneficio) || 0,
          cpv: Number(row.cpv) || 0,
          cpc: Number(row.cpc) || 0,
          ctr: row.ctr || '',
          ctr1x: row.ctr1x || '',
          uctr: row.uctr || '',
          cr: row.cr || '',
          cr1x: row.cr1x || '',
          cv: row.cv || '',
          cv1x: row.cv1x || '',
          roi: row.roi || '',
          epv: Number(row.epv) || 0,
          epc: Number(row.epc) || 0,
          ap: Number(row.ap) || 0,
        }));
        setData(mapped);
        // Mantener la selección si el id sigue existiendo
        const lastSelected = selectedRowIdRef.current;
        if (lastSelected) {
          const found = mapped.find(r => String(r.id) === String(lastSelected));
          if (found) {
            setSelectedRow(found);
          } else {
            setSelectedRow(null);
          }
        } else {
          setSelectedRow(null);
        }
      });
  }, [dateRange]);

  // Filtrado por búsqueda
  const filteredData = React.useMemo(() => {
    if (!search) return data;
    return data.filter(row =>
      Object.values(row).some(val =>
        String(val).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, search]);

  // Configuración de la tabla
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: false,
  });

  return (
    <>

      <DataTableSection
        title="Redes"
        toolbar={
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
              className={`bg-gray-200 hover:bg-gray-300 text-[#273958] font-semibold px-3 py-1 rounded${selectedRow ? ' cursor-pointer' : ' disabled:opacity-50 disabled:cursor-not-allowed'}`}
              onClick={() => setShowConfirm(true)}
              disabled={!selectedRow}
            >
              Excluir
            </button>
            <button
              className="bg-[#4EC4FE] hover:bg-[#38a3d8] text-white font-semibold px-3 py-1 rounded cursor-pointer"
              onClick={() => { setEditRed(null); setShowRedModal(true); setSelectedRow(null); }}
            >
              Nueva
            </button>
            <button
              className={`bg-[#AD43FF] hover:bg-[#8e2ecb] text-white font-semibold px-3 py-1 rounded${selectedRow ? ' cursor-pointer' : ' disabled:opacity-50 disabled:cursor-not-allowed'}`}
              disabled={!selectedRow}
              onClick={() => {
                if (!selectedRow) return;
                // Buscar la fila seleccionada en los datos filtrados (para reflejar la vista actual)
                let row = filteredData.find(r => String(r.id) === String(selectedRow.id));
                if (!row) row = data.find(r => String(r.id) === String(selectedRow.id));
                if (row) {
                  setEditRed({ ...row });
                  setShowRedModal(true);
                } else {
                  showToast(`No se encontró la red seleccionada. ID: ${selectedRow.id}`, 'error');
                }
              }}
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
          message="¿Deseas excluir la red seleccionada?"
          onConfirm={async () => {
            if (!selectedRow) return;
            setDeleting(true);
            const apiUrl = import.meta.env.VITE_API_URL;
            try {
              const res = await fetch(apiUrl + 'redes_delete.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedRow })
              });
              if (!res.ok) throw new Error('Error al eliminar');
              showToast('Red excluida correctamente', 'success');
              // Refrescar datos
              const statsUrl = apiUrl + "redes_stats.php" + (dateRange.start && dateRange.end ? `?start=${encodeURIComponent(dateRange.start)}&end=${encodeURIComponent(dateRange.end)}` : '');
              fetch(statsUrl)
                .then(res => res.json())
                .then(apiData => {
                  const mapped = apiData.map(row => ({
                    id: row.id,
                    nombre: row.nombre,
                    estado: row.estado,
                    parametro: row.parametro,
                    red: row.nombre,
                    visitas: Number(row.visitas) || 0,
                    visitas_unicas: Number(row.visitas_unicas) || 0,
                    clics: Number(row.clics) || 0,
                    clics_unicos: Number(row.clics_unicos) || 0,
                    conversiones: Number(row.conversiones) || 0,
                    ingresos: Number(row.ingresos) || 0,
                    costo: Number(row.costo) || 0,
                    beneficio: Number(row.beneficio) || 0,
                    cpv: Number(row.cpv) || 0,
                    cpc: Number(row.cpc) || 0,
                    ctr: row.ctr || '',
                    ctr1x: row.ctr1x || '',
                    uctr: row.uctr || '',
                    cr: row.cr || '',
                    cr1x: row.cr1x || '',
                    cv: row.cv || '',
                    cv1x: row.cv1x || '',
                    roi: row.roi || '',
                    epv: Number(row.epv) || 0,
                    epc: Number(row.epc) || 0,
                    ap: Number(row.ap) || 0,
                  }));
                  setData(mapped);
                  setSelectedRow(null);
                });
            } catch (err) {
              showToast('Error al eliminar la red', 'error');
            } finally {
              setShowConfirm(false);
              setDeleting(false);
            }
          }}
          onCancel={() => setShowConfirm(false)}
          confirmText={deleting ? "Eliminando..." : "Sí"}
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
                  className={selectedRow && String(selectedRow.id) === String(row.original.id) ? "bg-[#E6F7FF]" : "hover:bg-gray-100 cursor-pointer"}
                  onClick={() => {
                    setSelectedRow(row.original);
                    selectedRowIdRef.current = String(row.original.id);
                  }}
                >
                  {row.getVisibleCells().map(cell => {
                    const isLeft = cell.column.id === 'red';
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
                  if (id === 'red') return <td key={id} className="px-4 py-2 border-t text-left">Total</td>;
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

      {/* Modal para crear/editar Red de Afiliados extraído a componente */}
      <RedModal
        show={showRedModal}
        onClose={() => setShowRedModal(false)}
        editRed={editRed}
        showToast={showToast}
        dateRange={dateRange}
        setData={setData}
        setEditRed={setEditRed}
        setShowRedModal={setShowRedModal}
        onSubmit={async e => {
          e.preventDefault();
          const form = e.target;
          const nombre = form.nombre.value.trim();
          const estado = form.estado.value;
          const parametro = form.parametro.value.trim();
          if (!nombre) {
            showToast('El nombre es obligatorio', 'warning');
            return;
          }
          // Lógica para crear o editar
          const apiUrl = import.meta.env.VITE_API_URL;
          const body = { nombre, estado, parametro };
          let url = apiUrl + (editRed ? 'redes_update.php' : 'redes_create.php');
          let method = 'POST';
          if (editRed) body.id = editRed.id;
          try {
            const res = await fetch(url, {
              method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error('Error al guardar');
            setShowRedModal(false);
            setEditRed(null);
            showToast(editRed ? 'Red editada correctamente' : 'Red creada correctamente', 'success');
            // Refrescar datos
            const statsUrl = apiUrl + "redes_stats.php" + (dateRange.start && dateRange.end ? `?start=${encodeURIComponent(dateRange.start)}&end=${encodeURIComponent(dateRange.end)}` : '');
            fetch(statsUrl)
              .then(res => res.json())
              .then(apiData => {
                const mapped = apiData.map(row => ({
                  id: String(row.id),
                  nombre: row.nombre,
                  estado: row.estado,
                  parametro: row.parametro || '',
                  red: row.nombre,
                  visitas: Number(row.visitas) || 0,
                  visitas_unicas: Number(row.visitas_unicas) || 0,
                  clics: Number(row.clics) || 0,
                  clics_unicos: Number(row.clics_unicos) || 0,
                  conversiones: Number(row.conversiones) || 0,
                  ingresos: Number(row.ingresos) || 0,
                  costo: Number(row.costo) || 0,
                  beneficio: Number(row.beneficio) || 0,
                  cpv: Number(row.cpv) || 0,
                  cpc: Number(row.cpc) || 0,
                  ctr: row.ctr || '',
                  ctr1x: row.ctr1x || '',
                  uctr: row.uctr || '',
                  cr: row.cr || '',
                  cr1x: row.cr1x || '',
                  cv: row.cv || '',
                  cv1x: row.cv1x || '',
                  roi: row.roi || '',
                  epv: Number(row.epv) || 0,
                  epc: Number(row.epc) || 0,
                  ap: Number(row.ap) || 0,
                }));
                setData(mapped);
              });
          } catch (err) {
            showToast('Error al guardar la red', 'error');
          }
        }}
      />
      <ToastMessage
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(t => ({ ...t, show: false }))}
      />
    </>
  );
  // ...
};

export default Redes;
