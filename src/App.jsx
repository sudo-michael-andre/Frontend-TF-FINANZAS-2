import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./componentes/Login";
import Register from "./componentes/Register";
import Clientes from "./componentes/Clientes";
import CrearVentaConCuotas from "./componentes/CrearVentaConCuotas";
import VerVentas from "./componentes/VerVentas";
import VerCuotas from "./componentes/VerCuotas";
import { CuentaCorriente } from "./componentes/CuentaCorriente";
import Usuario from "./componentes/usuario";
import { Home } from "./componentes/Home";

function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUsuario(user);
    }
  }, []); // Se ejecuta solo una vez después del montaje para verificar la sesión

  return (
    <Router>
      <Routes>
        {/* Rutas protegidas */}
        <Route path="/login" element={usuario ? <Navigate to="/home" /> : <Login setUsuario={setUsuario} />} />
        <Route path="/register" element={usuario ? <Navigate to="/home" /> : <Register />} />
        <Route path="/clientes" element={usuario ? <Clientes usuario={usuario} setUsuario={setUsuario} /> : <Navigate to="/login" />} />
        <Route path="/ventascuotas" element={usuario ? <CrearVentaConCuotas usuario={usuario} setUsuario={setUsuario} /> : <Navigate to="/login" />} />
        <Route path="/ventas" element={usuario ? <VerVentas usuario={usuario} setUsuario={setUsuario} /> : <Navigate to="/login" />} />
        <Route path="/cuotas/:ventaId" element={usuario ? <VerCuotas usuario={usuario} setUsuario={setUsuario} /> : <Navigate to="/login" />} />
        <Route path="/cuenta" element={usuario ? <CuentaCorriente usuario={usuario} setUsuario={setUsuario} /> : <Navigate to="/login" />} />
        <Route path="/user" element={usuario ? <Usuario usuario={usuario} setUsuario={setUsuario} /> : <Navigate to="/login" />} />
        <Route path="/home" element={usuario ? <Home usuario={usuario} setUsuario={setUsuario} /> : <Navigate to="/login" />} />
        {/* Ruta por defecto */}
        <Route path="/" element={<Navigate to={usuario ? "/home" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
