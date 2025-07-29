
import * as React from "react";
import { useEffect, useState } from "react";
import DateRangePicker from "../components/DateRangePicker";
import DashboardCard from "../components/DashboardCard";
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

const API_BASE = import.meta.env.VITE_API_URL || "";


const kpiMeta = [
  { label: 'Visitas', key: 'visitas', color: 'bg-blue-100', text: 'text-blue-800' },
  { label: 'Clics', key: 'clics', color: 'bg-green-100', text: 'text-green-800' },
  { label: 'Conversiones', key: 'conversiones', color: 'bg-purple-100', text: 'text-purple-800' },
  { label: 'Ingresos', key: 'ingresos', color: 'bg-yellow-100', text: 'text-yellow-800' },
  { label: 'Costo', key: 'costo', color: 'bg-red-100', text: 'text-red-800' },
  { label: 'Beneficio', key: 'beneficio', color: 'bg-teal-100', text: 'text-teal-800' },
  { label: 'ROI', key: 'roi', color: 'bg-pink-100', text: 'text-pink-800' },
];


const defaultChartData = {
  labels: [],
  datasets: [],
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
  const [landingPages, setLandingPages] = useState([]);
  const [kpis, setKpis] = useState(null);
  const [chartData, setChartData] = useState(defaultChartData);
  const [campanias, setCampanias] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const [fuentes, setFuentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  useEffect(() => {
    setLoading(true);
    setError(null);
    // Construir query string para fechas
    let dateQuery = "";
    if (dateRange.start && dateRange.end) {
      dateQuery = `?start=${encodeURIComponent(dateRange.start)}&end=${encodeURIComponent(dateRange.end)}`;
    }
    Promise.all([
      fetch(`${API_BASE}/dashboard_kpis.php${dateQuery}`).then(res => res.json()),
      fetch(`${API_BASE}/dashboard_series.php${dateQuery}`).then(res => res.json()),
      fetch(`${API_BASE}/paginas_destino.php${dateQuery}`).then(res => res.json()),
      fetch(`${API_BASE}/campanias.php${dateQuery}`).then(res => res.json()),
      fetch(`${API_BASE}/ofertas.php${dateQuery}`).then(res => res.json()),
      fetch(`${API_BASE}/fuentes.php${dateQuery}`).then(res => res.json()),
    ])
      .then(([kpiData, seriesData, landingData, campaniasData, ofertasData, fuentesData]) => {
        setKpis(kpiData);
        setChartData({
          labels: seriesData.labels,
          datasets: [
            {
              label: 'Visitas',
              data: seriesData.visitas,
              borderColor: '#3B82F6',
              backgroundColor: 'rgba(59,130,246,0.1)',
              tension: 0.4,
            },
            {
              label: 'Clics',
              data: seriesData.clics,
              borderColor: '#22C55E',
              backgroundColor: 'rgba(34,197,94,0.1)',
              tension: 0.4,
            },
            {
              label: 'Conversiones',
              data: seriesData.conversiones,
              borderColor: '#A21CAF',
              backgroundColor: 'rgba(168,85,247,0.1)',
              tension: 0.4,
            },
            {
              label: 'Ingresos',
              data: seriesData.ingresos,
              borderColor: '#F59E42',
              backgroundColor: 'rgba(251,191,36,0.1)',
              tension: 0.4,
            },
            {
              label: 'Costo',
              data: seriesData.costo,
              borderColor: '#EF4444',
              backgroundColor: 'rgba(239,68,68,0.1)',
              tension: 0.4,
            },
            {
              label: 'Beneficio',
              data: seriesData.beneficio,
              borderColor: '#14B8A6',
              backgroundColor: 'rgba(20,184,166,0.1)',
              tension: 0.4,
            },
          ],
        });
        setLandingPages(
          landingData.map(p => ({
            label: p.nombre,
            value: p.url
          }))
        );
        // Top 5 campañas por visitas
        setCampanias(
          campaniasData
            .sort((a, b) => (b.visitas || 0) - (a.visitas || 0))
            .slice(0, 5)
            .map(c => ({ label: c.nombre, value: c.visitas }))
        );
        // Top 5 ofertas por conversiones
        setOfertas(
          ofertasData
            .sort((a, b) => (b.conversiones || 0) - (a.conversiones || 0))
            .slice(0, 5)
            .map(o => ({ label: o.nombre, value: o.conversiones }))
        );
        // Top 5 fuentes por clics
        setFuentes(
          fuentesData
            .sort((a, b) => (b.clics || 0) - (a.clics || 0))
            .slice(0, 5)
            .map(f => ({ label: f.nombre, value: f.clics }))
        );
        setLoading(false);
      })
      .catch((err) => {
        setError('Error al cargar los datos del dashboard');
        setLoading(false);
      });
  }, [dateRange]);


  if (loading) {
    return <div className="p-6 max-w-6xl mx-auto">Cargando dashboard...</div>;
  }
  if (error) {
    return <div className="p-6 max-w-6xl mx-auto text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#273958]">Dashboard</h1>
        <div className="flex items-center gap-2">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          {/* Botón Aplicar eliminado, ahora está dentro del DateRangePicker */}
        </div>
      </div>
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {kpiMeta.map(kpi => (
          <div key={kpi.label} className={`rounded-lg shadow-sm p-4 flex flex-col items-center ${kpi.color}`}>
            <span className={`text-lg font-bold ${kpi.text}`}>{kpis ? kpis[kpi.key] : '-'}</span>
            <span className="text-xs text-gray-500 mt-1">{kpi.label}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h4>Estadísticas</h4>
        <div>
          <label>Mostrar: </label>
          <select className="border rounded px-2 py-1 text-sm">
            <option>Visitas</option>
            <option>Clics</option>
            <option>Conversiones</option>
            <option>Ingresos</option>
            <option>Beneficio</option>
          </select>
        </div>
      </div>
      {/* Grid 2x2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DashboardCard
          title="Campañas"
          subtitle="Visitas"
          rows={campanias}
        />
        <DashboardCard
          title="Ofertas"
          subtitle="Conversiones"
          rows={ofertas}
        />
        <DashboardCard
          title="Fuentes"
          subtitle="Clics"
          rows={fuentes}
        />
        <DashboardCard
          title="Páginas Destino"
          subtitle="Landing Pages"
          rows={landingPages}
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
