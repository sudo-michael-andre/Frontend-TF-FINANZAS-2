import React from "react";
import "../styles/FacturaModal.css";
import { urlAPI } from "./urlAPI";

const FacturaModal = ({ cuota, onClose, onPagoConfirmado }) => {
  const handleConfirmarPago = () => {
    const usuarioObject = JSON.parse(localStorage.getItem("user")).usuario;

    fetch(`${urlAPI.urlAPI}/cuotas/pagar/${cuota._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ventaId: cuota.venta_id,
        usuarioObject: usuarioObject,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al pagar la cuota");
        }
        return response.json();
      })
      .then((data) => {
        onPagoConfirmado(data.cuota);
      })
      .catch((error) => console.error("Error al pagar la cuota:", error));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Factura de Pago</h2>
        <p><strong>Número de Cuota:</strong> {cuota.numeroCuota}</p>
        <p><strong>Monto:</strong> ${cuota.monto}</p>
        <p><strong>Mes:</strong> {cuota.mes}</p>
        <p><strong>Días de Atraso:</strong> {cuota.diasAtrasado}</p>
        <p><strong>Monto de Mora:</strong> S/ {cuota.montoMora}</p>
        <p><strong>Total a Pagar:</strong> S/ {cuota.monto + cuota.montoMora}</p>
        <div className="modal-actions">
          <button className="action-btn" onClick={onClose}>Cancelar</button>
          <button className="action-btn confirm-btn" onClick={handleConfirmarPago}>Confirmar Pago</button>
        </div>
      </div>
    </div>
  );
};

export default FacturaModal;
