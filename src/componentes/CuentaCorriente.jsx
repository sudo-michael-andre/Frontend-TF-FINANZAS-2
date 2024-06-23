import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Aside from './Aside';
import '../styles/CuentaCorriente.css'; // Importa el archivo de estilos CSS
import { urlAPI } from "./urlAPI";

export const CuentaCorriente = ({ usuario, setUsuario }) => {
  const [cuentaCorriente, setCuentaCorriente] = useState(null);
  const empresaId = 'someEmpresaId'; // Replace with actual empresaId
  const transaccionesRef = useRef(null);

  useEffect(() => {
    fetch(`${urlAPI.urlAPI}/cuentaCorriente/empresa/${usuario.usuario.Empresa_id}`)
      .then(response => response.json())
      .then(data => setCuentaCorriente(data))
      .catch(error => console.error('Error al obtener la cuenta corriente:', error));
   
  }, [empresaId]);

  const descargarTablaComoPDF = () => {
    if (!transaccionesRef.current || !cuentaCorriente) return;

    const input = transaccionesRef.current;

    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.text(`La cuenta corriente tiene un saldo de: S/ ${cuentaCorriente.saldo}`, 10, 10);
        pdf.text(`Transacciones: `, 10, 20);
        pdf.addImage(imgData, 'PNG', 10, 30, imgWidth - 20, imgHeight);
        pdf.save('transacciones.pdf');
      });
  };

  if (!cuentaCorriente) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="layout-cuenta-corriente">
      <Aside setUsuario={setUsuario} usuario={usuario} />
      <div className="cuenta-corriente-content">
        <h1>Cuenta Corriente</h1>
        <p>Saldo: S/ {cuentaCorriente.saldo}</p>
        <h2>Transacciones</h2>
        <div ref={transaccionesRef}>
          <table>
            <thead>
              <tr>
                <th>Monto</th>
                <th>Fecha</th>
                <th>Cliente</th>
              </tr>
            </thead>
            <tbody>
              {cuentaCorriente.transacciones.map(transaccion => (
                <tr key={transaccion._id} className={transaccion.tipo === 'egreso' ? 'fila-egreso' : 'fila-ingreso'}>
                  <td>S/ {transaccion.monto}</td>
                  <td>{new Date(transaccion.fecha).toLocaleDateString()}</td>
                  <td>{transaccion.Cliente_id.correo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="action-btn print-btn" onClick={descargarTablaComoPDF}>Descargar Tabla de Transacciones como PDF</button>
      </div>
    </div>
  );
};

export default CuentaCorriente;
