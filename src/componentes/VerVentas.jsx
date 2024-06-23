import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Aside from "./Aside";
import "../styles/VerVentas.css";
import { urlAPI } from "./urlAPI";

const VerVentas = ({ usuario, setUsuario }) => {
  const [ventas, setVentas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVentas();
  }, []);

  const fetchVentas = () => {
    fetch(`${urlAPI.urlAPI}/ventas/por-empresa/${usuario.usuario._id}`)
      .then((response) => response.json())
      .then((data) => setVentas(data))
      .catch((error) => console.error("Error al obtener las ventas:", error));
  };

  const eliminarVenta = (ventaId) => {
    fetch(`${urlAPI.urlAPI}/ventas/${ventaId}`, {
      method: "DELETE",
    })
      .then(() => {
        setVentas(ventas.filter((venta) => venta._id !== ventaId));
      })
      .catch((error) => console.error("Error al eliminar la venta:", error));
  };

  const verCuotas = (ventaId) => {
    navigate(`/cuotas/${ventaId}`);
  };

  return (
    <div className="layout-ventas">
      <Aside usuario={usuario} setUsuario={setUsuario} />
      <div className="ventas-content">
        <h1>Ventas</h1>
        <table className="ventas-table">
          <thead>
            <tr>
              <th>Nro Venta</th>
              <th>Cliente</th>
              <th>Monto Total</th>
              <th>Fecha de Venta</th>
              <th>Cuotas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta) => (
              <tr key={venta._id}>
                <td>{venta.nroVenta}</td>
                <td>{venta.Cliente_id.nombres}</td>
                <td>S/ {venta.montoTotal}</td>
                <td>{new Date(venta.fechaVenta).toLocaleDateString()}</td>
                <td>{venta.cuotas}</td>
                <td>
                  <button
                    className="action-btn view-btn"
                    onClick={() => verCuotas(venta._id)}
                  >
                    Ver Cuotas
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => eliminarVenta(venta._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VerVentas;
