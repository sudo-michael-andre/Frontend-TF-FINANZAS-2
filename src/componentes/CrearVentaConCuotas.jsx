import "../styles/CrearVentaConCuotas.css";
import React, { useState, useEffect, useRef } from "react";
import Aside from "./Aside";
import { urlAPI } from "./urlAPI";

const CrearVentaConCuotas = ({ usuario, setUsuario }) => {
  const [formData, setFormData] = useState({
    montoTotal: "",
    plazoGracia: "",
    Cliente_id: "",
    cuotas: "",
    estado: true,
    FechaInicio: "",
    FechaFin: "",
    TipoCredito_id: "",
    TipoInteres_id: "",
    tasaInteres: "",
    Usuario_id: usuario.usuario._id,
  });

  const [clientes, setClientes] = useState([]);
  const [tiposCredito, setTiposCredito] = useState([]);
  const [tiposInteres, setTiposInteres] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCuotas, setShowCuotas] = useState(true);

  const plazoGraciaRef = useRef(null);
  const cuotasRef = useRef(null);

  useEffect(() => {
    fetchTiposCredito();
    fetchTiposInteres();
    fetchClientesPorEmpresa();
  }, []);

  useEffect(() => {
    const plazoGraciaInput = plazoGraciaRef.current;
    const cuotasInput = cuotasRef.current;

    const selectedTipoCredito = tiposCredito.find(tc => tc._id === formData.TipoCredito_id);

    if (selectedTipoCredito?.nombre === "Pago a la siguiente fecha") {
      setFormData(prevState => ({
        ...prevState,
        plazoGracia: 0,
        cuotas: 1,
      }));
      setShowCuotas(false);
    } else {
      setShowCuotas(true);
    }
  }, [formData.TipoCredito_id, tiposCredito]);

  const fetchTiposCredito = () => {
    fetch(`${urlAPI.urlAPI}/tipocreditos`)
      .then((response) => response.json())
      .then((data) => setTiposCredito(data))
      .catch((error) => console.error("Error al obtener los tipos de crédito:", error));
  };

  const fetchTiposInteres = () => {
    fetch(`${urlAPI.urlAPI}/tipointereses`)
      .then((response) => response.json())
      .then((data) => setTiposInteres(data))
      .catch((error) => console.error("Error al obtener los tipos de interés:", error));
  };

  const fetchClientesPorEmpresa = () => {
    fetch(`${urlAPI.urlAPI}/clientes/clientes-por-usuario-empresa/${usuario.usuario.Empresa_id}`)
      .then((response) => response.json())
      .then((data) => setClientes(data))
      .catch((error) => console.error("Error al obtener los clientes por empresa:", error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Prevent negative values
    if ((name === "montoTotal" || name === "tasaInteres" || name === "cuotas" || name === "plazoGracia") && value < 0) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(urlAPI.urlAPI+"/ventas/concuotas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error al crear la venta: ${errorMessage}`);
      }
      setErrorMessage('VENTA CREADA');
      const data = await response.json();
      console.log("Venta creada con cuotas:", data);
    } catch (error) {
      console.error("Error al crear la venta:", error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="layout-crear-venta">
      <Aside usuario={usuario} setUsuario={setUsuario} />
      <div className="crear-venta-content">
        <h2>Crear Venta con Cuotas</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Datos Generales</h3>

            <div className="form-row">
              <label>Monto Total:</label>
              <input
                type="number"
                step="0.01"
                name="montoTotal"
                value={formData.montoTotal}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <label>Cliente:</label>
              <select
                name="Cliente_id"
                value={formData.Cliente_id}
                onChange={handleSelectChange}
                required
              >
                <option value="" disabled>Seleccione un cliente</option>
                {clientes.map(cliente => (
                  <option key={cliente._id} value={cliente._id}>
                    {cliente.nombres}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label>Fecha de Venta:</label>
              <input
                type="date"
                name="fechaVenta"
                value={formData.fechaVenta}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Detalles de la Venta</h3>
            <div className="form-row">
              <label>Tipo Crédito:</label>
              <select
                name="TipoCredito_id"
                value={formData.TipoCredito_id}
                onChange={handleSelectChange}
                required
              >
                <option value="" disabled>Seleccione un tipo de crédito</option>
                {tiposCredito.map(tipo => (
                  <option key={tipo._id} value={tipo._id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            </div>
            {showCuotas && (
              <>
                <div className="form-row">
                  <label>Cuotas:</label>
                  <input
                    type="number"
                    name="cuotas"
                    value={formData.cuotas}
                    onChange={handleChange}
                    required
                    ref={cuotasRef}
                  />
                </div>
                <div className="form-row">
                  <label>Plazo de Gracia:</label>
                  <input
                    type="number"
                    name="plazoGracia"
                    value={formData.plazoGracia}
                    onChange={handleChange}
                    required
                    ref={plazoGraciaRef}
                  />
                </div>
              </>
            )}
            <div className="form-row">
              <label>Tipo Interés:</label>
              <select
                name="TipoInteres_id"
                value={formData.TipoInteres_id}
                onChange={handleSelectChange}
                required
              >
                <option value="" disabled>Seleccione un tipo de interés</option>
                {tiposInteres.map(tipo => (
                  <option key={tipo._id} value={tipo._id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label>Tasa de Interés (no poner %):</label>
              <input
                type="number"
                step="0.01"
                name="tasaInteres"
                value={formData.tasaInteres}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit">Crear Venta con Cuotas</button>
        </form>
      </div>
    </div>
  );
};

export default CrearVentaConCuotas;
