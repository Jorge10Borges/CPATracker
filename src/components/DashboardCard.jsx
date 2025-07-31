import React from "react";


const DashboardCard = ({ title, subtitle, rows }) => {
  // Siempre mostrar 5 filas, rellenando con vacías si faltan
  const displayRows = rows && rows.length > 0 ? rows.slice(0, 5) : [];
  const emptyCount = 5 - displayRows.length;
  return (
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col">
      {/* Encabezado */}
      <div className="flex justify-between bg-[#273958] px-2 py-2 text-white rounded-t-lg">
        <h5>{title}</h5>
        <span className="text-gray-100">{subtitle}</span>
      </div>
          <div className="flex-1">
            {displayRows.map((row, idx) => (
              <div
                key={idx}
                className={
                  "flex items-center justify-between py-1 min-h-[32px]" +
                  (row.label === '' && row.value === '' ? ' opacity-50' : '')
                }
                style={{ minHeight: 32, height: 32 }}
              >
                <span className="truncate text-sm text-gray-700 ps-2">{row.label || '\u00A0'}</span>
                <span className="font-semibold text-sm text-[#273958] pe-2">{row.value || '\u00A0'}</span>
              </div>
            ))}
          </div>
      {[...Array(emptyCount)].map((_, idx) => (
        <div key={`empty-${idx}`} className="px-2 flex justify-between items-center border-b border-gray-200 py-1 min-h-[32px]">
          <div>&nbsp;</div>
          <div>&nbsp;</div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCard;
