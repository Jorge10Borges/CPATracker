import React from "react";

const DashboardCard = ({ title, subtitle, rows }) => (
  <div className="bg-white rounded-lg shadow-sm text-gray-700">
    {/* Encabezado */}
    <div className="flex justify-between bg-[#273958] px-2 py-2 text-white rounded-t-lg">
      <h5>{title}</h5>
      <span className="text-gray-100">{subtitle}</span>
    </div>
    {rows && rows.length > 0 ? (
      rows.map((row, idx) => (
        <div key={idx} className="px-2 flex justify-between items-center border-b border-gray-200 last:border-b-0 py-1">
          <div>{row.label}</div>
          <div>{row.value}</div>
        </div>
      ))
    ) : (
      <div className="px-2 py-4 text-gray-400 text-center">Sin datos</div>
    )}
  </div>
);

export default DashboardCard;
