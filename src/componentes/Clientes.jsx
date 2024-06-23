import React, { useState, useEffect } from "react";
import { Aside } from "./Aside";
import "../styles/Clientes.css";
import { urlAPI } from "./urlAPI";

const Clientes = ({ usuario, setUsuario }) => {
  const [clientes, setClientes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombres: "",
    correo: "",
    tasaMoratoria: "",
    limiteCredito: "",
    fechaPagoMensual: "",
    Empresa_id: usuario.usuario.Empresa_id, // Ajusta según tu lógica de empresa
  });

  useEffect(() => {
    obtenerClientes(); // Llama a la función para obtener clientes al montar el componente
  }, []);

  const obtenerClientes = () => {
    fetch(
      `${urlAPI.urlAPI}/clientes/clientes-por-usuario-empresa/${usuario.usuario.Empresa_id}`
    )
      .then((response) => response.json())
      .then((data) => setClientes(data))
      .catch((error) => console.error("Error al obtener los clientes:", error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "tasaMoratoria" || name === "limiteCredito") {
      if (value < 0) return; // Evita valores negativos
    }
    setNuevoCliente({ ...nuevoCliente, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    fetch(`${urlAPI.urlAPI}/clientes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoCliente),
    })
      .then((response) => response.json())
      .then((data) => {
        setClientes([...clientes, data]);
        setIsModalOpen(false);
        setNuevoCliente({
          nombres: "",
          correo: "",
          tasaMoratoria: "",
          limiteCredito: "",
          fechaPagoMensual: "",
          Empresa_id: "", // Ajustar según sea necesario
        });
      })
      .catch((error) => console.error("Error al crear el cliente:", error));
  };

  const eliminarCliente = (clienteId) => {
    fetch(`${urlAPI.urlAPI}/clientes/${clienteId}`, {
      method: "DELETE",
    })
      .then(() => {
        setClientes(clientes.filter((cliente) => cliente._id !== clienteId));
      })
      .catch((error) => console.error("Error al eliminar el cliente:", error));
  };

  return (
    <div className="layout-clientes">
      <Aside usuario={usuario} setUsuario={setUsuario} />
      <div className="clientes-content">
        <h1>Clientes</h1>
        <button className="add-client-btn" onClick={() => setIsModalOpen(true)}>
          Agregar Cliente
        </button>
        <table className="clientes-table">
          <thead>
            <tr>
              <th>Nombres</th>
              <th>Correo</th>
              <th>Tasa Moratoria</th>
              <th>Límite de Crédito</th>
              <th>Fecha de Pago Mensual</th>

            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente._id}>
                <td>{cliente.nombres}</td>
                <td>{cliente.correo}</td>
                <td>{cliente.tasaMoratoria}%</td>
                <td>S/ {cliente.limiteCredito}</td>
                <td>
                  {cliente.fechaPagoMensual[8] + cliente.fechaPagoMensual[9] + " de cada mes"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close-btn" onClick={() => setIsModalOpen(false)}>
                &times;
              </span>
              <h2>Registrar Nuevo Cliente</h2>
              <form onSubmit={handleFormSubmit}>
                <label htmlFor="nombres">Nombres</label>
                <input
                  type="text"
                  id="nombres"
                  name="nombres"
                  value={nuevoCliente.nombres}
                  onChange={handleInputChange}
                  required
                />

                <label htmlFor="correo">Correo</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={nuevoCliente.correo}
                  onChange={handleInputChange}
                  required
                />

                <label htmlFor="tasaMoratoria">Tasa Moratoria</label>
                <input
                  type="number"
                  id="tasaMoratoria"
                  name="tasaMoratoria"
                  value={nuevoCliente.tasaMoratoria}
                  onChange={handleInputChange}
                  min="0" // Evita valores negativos
                  required
                />

                <label htmlFor="limiteCredito">Límite de Crédito</label>
                <input
                  type="number"
                  id="limiteCredito"
                  name="limiteCredito"
                  value={nuevoCliente.limiteCredito}
                  onChange={handleInputChange}
                  min="0" // Evita valores negativos
                  required
                />

                <label htmlFor="fechaPagoMensual">Fecha de Pago Mensual</label>
                <input
                  type="date"
                  id="fechaPagoMensual"
                  name="fechaPagoMensual"
                  value={nuevoCliente.fechaPagoMensual}
                  onChange={handleInputChange}
                  required
                />

                <label style={{ display: "none" }} htmlFor="Empresa_id">
                  ID de Empresa
                </label>
                <input
                  type="text"
                  id="Empresa_id"
                  name="Empresa_id"
                  value={usuario.usuario.Empresa_id}
                  onChange={handleInputChange}
                  required
                  style={{ display: "none" }}
                />

                <button type="submit" className="submit-btn">
                  Registrar
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clientes;
