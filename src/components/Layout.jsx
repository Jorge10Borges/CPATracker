
import React from "react";
import { NavLink, Link } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#273958] text-white px-6 py-4 flex items-center justify-between shadow">
        <Link to="/">
          <img src="/logo128x50.webp" alt="CPA Tracker Logo" className="h-10 w-auto" style={{ maxHeight: 40 }} />
        </Link>
        <ul className="flex gap-6">
          <li>
            <NavLink to="/" end className={({ isActive }) => `hover:text-[#FFB211] cursor-pointer${isActive ? ' active-nav' : ''}`}>Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="/campanas" className={({ isActive }) => `hover:text-[#FFB211] cursor-pointer${isActive ? ' active-nav' : ''}`}>Campañas</NavLink>
          </li>
          <li>
            <NavLink to="/ofertas" className={({ isActive }) => `hover:text-[#AD43FF] cursor-pointer${isActive ? ' active-nav' : ''}`}>Ofertas</NavLink>
          </li>
          <li>
            <NavLink to="/fuentes" className={({ isActive }) => `hover:text-[#4EC4FE] cursor-pointer${isActive ? ' active-nav' : ''}`}>Fuentes</NavLink>
          </li>
          <li>
            <NavLink to="/flow" className={({ isActive }) => `hover:text-[#FFB211] cursor-pointer${isActive ? ' active-nav' : ''}`}>Flow</NavLink>
          </li>
          <li>
            <NavLink to="/redes" className={({ isActive }) => `hover:text-[#AD43FF] cursor-pointer${isActive ? ' active-nav' : ''}`}>Redes</NavLink>
          </li>
          <li>
            <NavLink to="/pagina-destino" className={({ isActive }) => `hover:text-[#FFB211] cursor-pointer${isActive ? ' active-nav' : ''}`}>Página destino</NavLink>
          </li>
          <li>
            <NavLink to="/personalizado" className={({ isActive }) => `hover:text-[#4EC4FE] cursor-pointer${isActive ? ' active-nav' : ''}`}>Personalizado</NavLink>
          </li>
        </ul>
      </nav>
      <main className="p-2">
        {children}
      </main>
    </div>
  );
};


// Clase para el item activo del navbar
// Puedes mover esto a tu CSS/Tailwind config si prefieres
const style = document.createElement('style');
style.innerHTML = `
  .active-nav {
    font-weight: bold;
    border-bottom: 2px solid #FFB211;
    color: #FFB211 !important;
  }
`;
document.head.appendChild(style);

export default Layout;
