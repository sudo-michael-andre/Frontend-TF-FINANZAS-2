import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Aside from "./Aside";
import FacturaModal from "./FacturaModal";
import "../styles/VerCuotas.css";
import { urlAPI } from "./urlAPI";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const VerCuotas = ({ usuario, setUsuario }) => {
  const { ventaId } = useParams();
  const [cuotas, setCuotas] = useState([]);
  const [cuotaSeleccionada, setCuotaSeleccionada] = useState(null);

  // Función para generar el PDF con detalles de la venta y tabla de cuotas
  const imprimirDetallesVenta = () => {
    const cuotasTable = document.getElementById('cuotas-table');
    const fechaActual = new Date().toLocaleDateString();

    html2canvas(cuotasTable).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      let position = 10;

      // Agregar detalles de la venta
      pdf.setFontSize(16);
      pdf.text('Detalles de la Venta', pdfWidth / 2, position, { align: 'center' });
      position += 10;

      pdf.setFontSize(12);
      pdf.text(`Código de Venta: ${ventaId}`, 10, position);
      position += 10;

      pdf.text(`Fecha: ${fechaActual}`, 10, position);
      position += 15;

      // Agregar tabla de cuotas
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 10, position, pdfWidth - 20, imgHeight);
      
      // Guardar el PDF con un nombre específico
      pdf.save(`DetallesVenta_${ventaId}.pdf`);
    });
  };

  // Fetch de las cuotas al cargar el componente
  useEffect(() => {
    fetchCuotas();
  }, [ventaId]);

  const fetchCuotas = () => {
    fetch(`${urlAPI.urlAPI}/cuotas/venta/${ventaId}`)
      .then((response) => response.json())
      .then((data) => setCuotas(data))
      .catch((error) => console.error("Error al obtener las cuotas:", error));
  };

  // Función para eliminar una cuota
  const eliminarCuota = (cuotaId) => {
    fetch(`${urlAPI.urlAPI}/cuotas/${cuotaId}`, {
      method: "DELETE",
    })
      .then(() => {
        setCuotas(cuotas.filter((cuota) => cuota._id !== cuotaId));
      })
      .catch((error) => console.error("Error al eliminar la cuota:", error));
  };

  // Función para manejar el pago confirmado de una cuota
  const handlePagoConfirmado = (cuotaActualizada) => {
    setCuotas(
      cuotas.map((cuota) =>
        cuota._id === cuotaActualizada._id ? cuotaActualizada : cuota
      )
    );
    setCuotaSeleccionada(null);
  };

  // Función para obtener la clase CSS según el estado de la cuota
  const obtenerClaseEstado = (cuota) => {
    if (cuota.pagado) {
      return "pagado";
    }
    const diasAtrasado = cuota.diasAtrasado || 0;
    if (diasAtrasado > 30) {
      return "retraso-severo";
    } else if (diasAtrasado > 0) {
      return "retraso-moderado";
    }
    return "no-pagado";
  };

  return (
    <div className="layout-cuotas">
      <Aside usuario={usuario} setUsuario={setUsuario} />
      <div className="cuotas-content">
        <h2>Color Verde: Pagado</h2>
        <h2>Color Amarillo: Sin Pagar</h2>
        <h2>Color Rojo: Moroso</h2>
        <br />
        <h1>Cuotas de la Venta {ventaId}</h1>
        <button className="action-btn print-btn" onClick={imprimirDetallesVenta}>
          Imprimir Detalles de la Venta
        </button>
        <table id="cuotas-table" className="cuotas-table">
          <thead>
            <tr>
              <th>Número de Cuota</th>
              <th>Monto</th>
              <th>Mes</th>
              <th>Días Atrasados</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cuotas.map((cuota) => (
              <tr key={cuota._id} className={obtenerClaseEstado(cuota)}>
                <td>{cuota.numeroCuota}</td>
                <td>S/ {cuota.monto}</td>
                <td>{cuota.mes}</td>
                <td>{cuota.diasAtrasado}</td>
                <td>
                  {!cuota.pagado && (
                    <button
                      className="action-btn pay-btn"
                      onClick={() => setCuotaSeleccionada(cuota)}
                    >
                      Pagar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {cuotaSeleccionada && (
          <FacturaModal
            cuota={cuotaSeleccionada}
            onClose={() => setCuotaSeleccionada(null)}
            onPagoConfirmado={handlePagoConfirmado}
          />
        )}
      </div>
    </div>
  );
};

export default VerCuotas;
