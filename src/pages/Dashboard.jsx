import * as React from "react";
import DateRangePicker from "../components/DateRangePicker";
import DashboardCard from "../components/DashboardCard";
// import Chart.js components
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const kpiList = [
  { label: 'Visitas', value: 17000, color: 'bg-blue-100', text: 'text-blue-800' },
  { label: 'Clics', value: 750, color: 'bg-green-100', text: 'text-green-800' },
  { label: 'Conversiones', value: 33, color: 'bg-purple-100', text: 'text-purple-800' },
  { label: 'Ingresos', value: 1300, color: 'bg-yellow-100', text: 'text-yellow-800' },
  { label: 'Costo', value: 900, color: 'bg-red-100', text: 'text-red-800' },
  { label: 'Beneficio', value: 400, color: 'bg-teal-100', text: 'text-teal-800' },
  { label: 'ROI', value: '144%', color: 'bg-pink-100', text: 'text-pink-800' },
];

const chartData = {
  labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  datasets: [
    {
      label: 'Visitas',
      data: [2000, 2500, 3000, 2800, 2600, 3200, 2900],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59,130,246,0.1)',
      tension: 0.4,
    },
    {
      label: 'Clics',
      data: [90, 110, 120, 100, 95, 130, 105],
      borderColor: '#22C55E',
      backgroundColor: 'rgba(34,197,94,0.1)',
      tension: 0.4,
    },
    {
      label: 'Conversiones',
      data: [4, 5, 6, 5, 4, 7, 6],
      borderColor: '#A21CAF',
      backgroundColor: 'rgba(168,85,247,0.1)',
      tension: 0.4,
    },
    {
      label: 'Ingresos',
      data: [200, 250, 300, 280, 260, 320, 290],
      borderColor: '#F59E42',
      backgroundColor: 'rgba(251,191,36,0.1)',
      tension: 0.4,
    },
    {
      label: 'Costo',
      data: [120, 130, 140, 135, 125, 150, 140],
      borderColor: '#EF4444',
      backgroundColor: 'rgba(239,68,68,0.1)',
      tension: 0.4,
    },
    {
      label: 'Beneficio',
      data: [80, 120, 160, 145, 135, 170, 150],
      borderColor: '#14B8A6',
      backgroundColor: 'rgba(20,184,166,0.1)',
      tension: 0.4,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Resumen semanal',
    },
  },
};

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#273958]">Dashboard</h1>
        <div className="flex items-center gap-2">
          <DateRangePicker />
          <button className="bg-[#273958] hover:bg-[#1b263b] text-white font-semibold px-4 py-2 rounded">Actualizar</button>
        </div>
      </div>
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {kpiList.map(kpi => (
          <div key={kpi.label} className={`rounded-lg shadow-sm p-4 flex flex-col items-center ${kpi.color}`}>
            <span className={`text-lg font-bold ${kpi.text}`}>{kpi.value}</span>
            <span className="text-xs text-gray-500 mt-1">{kpi.label}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h4>Estadisticas</h4>
        <div>
          <label>Mostrar: </label>
          <select className="border rounded px-2 py-1 text-sm">
            <option>Visitas</option>
            <option>Click</option>
            <option>Conversiones</option>
            <option>Ingresos</option>
            <option>Beneficios</option>
          </select>
        </div>
      </div>
      {/* Grid 2x2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DashboardCard
          title="Campañas"
          subtitle="Visitas"
          rows={[
            { label: "Campaña 1", value: 1200 },
            { label: "Campaña 2", value: 950 },
            { label: "Campaña 3", value: 870 },
            { label: "Campaña 4", value: 650 },
            { label: "Campaña 5", value: 500 },
          ]}
        />
        <DashboardCard
          title="Ofertas"
          subtitle="Conversiones"
          rows={[
            { label: "Oferta 1", value: 30 },
            { label: "Oferta 2", value: 22 },
            { label: "Oferta 3", value: 18 },
            { label: "Oferta 4", value: 15 },
            { label: "Oferta 5", value: 10 },
          ]}
        />
        <DashboardCard
          title="Fuentes"
          subtitle="Clics"
          rows={[
            { label: "Fuente 1", value: 400 },
            { label: "Fuente 2", value: 350 },
            { label: "Fuente 3", value: 300 },
            { label: "Fuente 4", value: 250 },
            { label: "Fuente 5", value: 200 },
          ]}
        />
        <DashboardCard
          title="Flows"
          subtitle="Ingresos"
          rows={[
            { label: "Flow 1", value: "$500" },
            { label: "Flow 2", value: "$420" },
            { label: "Flow 3", value: "$380" },
            { label: "Flow 4", value: "$300" },
            { label: "Flow 5", value: "$250" },
          ]}
        />
      </div>
      {/* Gráfico de líneas */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Dashboard;
