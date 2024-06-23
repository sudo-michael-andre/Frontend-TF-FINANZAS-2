import React, { useState } from "react";
import {
  FaHome,
  FaUser,
  FaCog,
  FaBars,
  FaUsers,
  FaMoneyBillAlt,
  FaBalanceScale,
  FaSignOutAlt,
} from "react-icons/fa";
import "../styles/Aside.css";
import { NavLink, useNavigate } from "react-router-dom";
import { urlAPI } from "./urlAPI";

export const Aside = ({ usuario, setUsuario }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.clear("user");
    setUsuario(null);
    navigate("/login");
  };

  return (
    <aside className={`aside ${isOpen ? "open" : ""}`}>
      <button className="toggle-btn" onClick={toggleMenu}>
        <FaBars />
      </button>
      <ul className="menu">
        <NavLink to="/home" activeClassName="active">
          <li className="menu-item">
            <FaHome className="menu-icon" />
            {isOpen && <span>Home</span>}
          </li>
        </NavLink>
        <NavLink to="/user" activeClassName="active">
          <li className="menu-item">
            <FaUser className="menu-icon" />
            {isOpen && <span>Profile</span>}
          </li>
        </NavLink>
        <NavLink to="/clientes" activeClassName="active">
          <li className="menu-item">
            <FaUsers className="menu-icon" />
            {isOpen && <span>Clientes</span>}
          </li>
        </NavLink>
        <NavLink to="/ventascuotas" activeClassName="active">
          <li className="menu-item">
            <FaMoneyBillAlt className="menu-icon" />
            {isOpen && <span>Crear Venta</span>}
          </li>
        </NavLink>
        <NavLink to="/ventas" activeClassName="active">
          <li className="menu-item">
            <FaMoneyBillAlt className="menu-icon" />
            {isOpen && <span>Ventas</span>}
          </li>
        </NavLink>
        <NavLink to="/cuenta" activeClassName="active">
          <li className="menu-item">
            <FaBalanceScale className="menu-icon" />
            {isOpen && <span>Cuenta Corriente</span>}
          </li>
        </NavLink>
        <li className="menu-item logout" onClick={handleLogout}>
          <FaSignOutAlt className="menu-icon" />
          {isOpen && <span>Cerrar Sesión</span>}
        </li>
      </ul>
    </aside>
  );
};

export default Aside;
