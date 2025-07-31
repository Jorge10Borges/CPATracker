
import * as React from "react";
import { useEffect, useState } from "react";
import DateRangePicker from "../components/DateRangePicker";
import { useDateRange } from "../context/DateRangeContext";
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
  const { dateRange, setDateRange } = useDateRange();
  const [selectedMetric, setSelectedMetric] = useState('Visitas');

  // Estados para los datos reales de cada entidad según la métrica
  const [campaniasData, setCampaniasData] = useState([]);
  const [ofertasData, setOfertasData] = useState([]);
  const [fuentesData, setFuentesData] = useState([]);
  const [landingPagesData, setLandingPagesData] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    let dateQuery = "";
    if (dateRange.start && dateRange.end) {
      dateQuery = `?start=${encodeURIComponent(dateRange.start)}&end=${encodeURIComponent(dateRange.end)}`;
    }
    Promise.all([
      fetch(`${API_BASE}/dashboard_kpis.php${dateQuery}`).then(res => res.json()),
      fetch(`${API_BASE}/dashboard_series.php${dateQuery}`).then(res => res.json()),
    ])
      .then(([kpiData, seriesData]) => {
        setKpis(kpiData);
        // Adaptar para soportar seriesData como array de objetos (por fecha)
        // o como objeto con arrays por métrica (labels, visitas, clics, etc.)
        let labels = [];
        let visitas = [];
        let clics = [];
        let conversiones = [];
        let ingresos = [];
        let costo = [];
        let beneficio = [];
        if (Array.isArray(seriesData)) {
          labels = seriesData.map(d => d.fecha);
          visitas = seriesData.map(d => Number(d.visitas) || 0);
          clics = seriesData.map(d => Number(d.clics) || 0);
          conversiones = seriesData.map(d => Number(d.conversiones) || 0);
          ingresos = seriesData.map(d => Number(d.ingresos) || 0);
          costo = seriesData.map(d => Number(d.costo) || 0);
          beneficio = seriesData.map(d => Number(d.beneficio) || 0);
        } else {
          labels = seriesData.labels || [];
          visitas = seriesData.visitas || [];
          clics = seriesData.clics || [];
          conversiones = seriesData.conversiones || [];
          ingresos = seriesData.ingresos || [];
          costo = seriesData.costo || [];
          beneficio = seriesData.beneficio || [];
        }
        setChartData({
          labels,
          datasets: [
            {
              label: 'Visitas',
              data: visitas,
              borderColor: '#3B82F6',
              backgroundColor: 'rgba(59,130,246,0.1)',
              tension: 0.4,
            },
            {
              label: 'Clics',
              data: clics,
              borderColor: '#22C55E',
              backgroundColor: 'rgba(34,197,94,0.1)',
              tension: 0.4,
            },
            {
              label: 'Conversiones',
              data: conversiones,
              borderColor: '#A21CAF',
              backgroundColor: 'rgba(168,85,247,0.1)',
              tension: 0.4,
            },
            {
              label: 'Ingresos',
              data: ingresos,
              borderColor: '#F59E42',
              backgroundColor: 'rgba(251,191,36,0.1)',
              tension: 0.4,
            },
            {
              label: 'Costo',
              data: costo,
              borderColor: '#EF4444',
              backgroundColor: 'rgba(239,68,68,0.1)',
              tension: 0.4,
            },
            {
              label: 'Beneficio',
              data: beneficio,
              borderColor: '#14B8A6',
              backgroundColor: 'rgba(20,184,166,0.1)',
              tension: 0.4,
            },
          ],
        });
        setLoading(false);
      })
      .catch((err) => {
        setError('Error al cargar los datos del dashboard');
        setLoading(false);
      });
  }, [dateRange]);

  // Cargar datos reales para cada entidad según la métrica seleccionada
  useEffect(() => {
    // Helper para construir la URL correctamente
    function buildApiUrl(endpoint) {
      let url = `${API_BASE.replace(/\/$/, '')}/${endpoint}`;
      let params = [];
      if (dateRange.start && dateRange.end) {
        params.push(`start=${encodeURIComponent(dateRange.start)}`);
        params.push(`end=${encodeURIComponent(dateRange.end)}`);
      }
      params.push(`metric=${selectedMetric.toLowerCase()}`);
      if (params.length > 0) {
        url += '?' + params.join('&');
      }
      return url;
    }

    // Campañas
    fetch(buildApiUrl('campanias_stats.php'))
      .then(res => res.json())
      .then(data => {
        const rows = (data || [])
          .sort((a, b) => (b[selectedMetric.toLowerCase()] || 0) - (a[selectedMetric.toLowerCase()] || 0))
          .slice(0, 5)
          .map(c => ({ label: c.nombre, value: c[selectedMetric.toLowerCase()] ?? '-' }));
        setCampaniasData(rows);
      });
    // Ofertas
    fetch(buildApiUrl('ofertas_stats.php'))
      .then(res => res.json())
      .then(data => {
        const rows = (data || [])
          .sort((a, b) => (b[selectedMetric.toLowerCase()] || 0) - (a[selectedMetric.toLowerCase()] || 0))
          .slice(0, 5)
          .map(o => ({ label: o.nombre, value: o[selectedMetric.toLowerCase()] ?? '-' }));
        setOfertasData(rows);
      });
    // Fuentes
    fetch(buildApiUrl('fuentes_stats.php'))
      .then(res => res.json())
      .then(data => {
        const rows = (data || [])
          .sort((a, b) => (b[selectedMetric.toLowerCase()] || 0) - (a[selectedMetric.toLowerCase()] || 0))
          .slice(0, 5)
          .map(f => ({ label: f.nombre, value: f[selectedMetric.toLowerCase()] ?? '-' }));
        setFuentesData(rows);
      });
    // Páginas destino
    fetch(buildApiUrl('paginas_destino_stats.php'))
      .then(res => res.json())
      .then(data => {
        const rows = (data || [])
          .sort((a, b) => (b[selectedMetric.toLowerCase()] || 0) - (a[selectedMetric.toLowerCase()] || 0))
          .slice(0, 5)
          .map(p => ({ label: p.nombre, value: p[selectedMetric.toLowerCase()] ?? '-' }));
        setLandingPagesData(rows);
      });
  }, [selectedMetric, dateRange]);


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
          <select
            className="border rounded px-2 py-1 text-sm"
            value={selectedMetric}
            onChange={e => setSelectedMetric(e.target.value)}
          >
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
          subtitle={selectedMetric}
          rows={campaniasData.length === 5 ? campaniasData : [...campaniasData, ...Array(5 - campaniasData.length).fill({ label: '', value: '' })]}
        />
        <DashboardCard
          title="Ofertas"
          subtitle={selectedMetric}
          rows={ofertasData.length === 5 ? ofertasData : [...ofertasData, ...Array(5 - ofertasData.length).fill({ label: '', value: '' })]}
        />
        <DashboardCard
          title="Fuentes"
          subtitle={selectedMetric}
          rows={fuentesData.length === 5 ? fuentesData : [...fuentesData, ...Array(5 - fuentesData.length).fill({ label: '', value: '' })]}
        />
        <DashboardCard
          title="Páginas Destino"
          subtitle={selectedMetric}
          rows={landingPagesData.length === 5 ? landingPagesData : [...landingPagesData, ...Array(5 - landingPagesData.length).fill({ label: '', value: '' })]}
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
