


import './App.css'
import Layout from './components/Layout'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Dashboard from './pages/Dashboard';
import Campanas from './pages/Campanas';
import Ofertas from './pages/Ofertas';
import Fuentes from './pages/Fuentes';
import Flow from './pages/Flow';
import Redes from './pages/Redes';
import PaginaDestino from './pages/PaginaDestino';
import Personalizado from './pages/Personalizado';


function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/campanas" element={<Campanas />} />
          <Route path="/ofertas" element={<Ofertas />} />
          <Route path="/fuentes" element={<Fuentes />} />
          <Route path="/flow" element={<Flow />} />
          <Route path="/redes" element={<Redes />} />
          <Route path="/pagina-destino" element={<PaginaDestino />} />
          <Route path="/personalizado" element={<Personalizado />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App
