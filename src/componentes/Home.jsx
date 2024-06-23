import React from "react";
import "../styles/Home.css";
import Aside from "./Aside";
import { FaRegCreditCard, FaPercentage, FaMoneyBillWave } from "react-icons/fa";

export const Home = ({ usuario, setUsuario }) => {
  return (
    <div className="layout-usuario">
      <Aside setUsuario={setUsuario} usuario={usuario} />
      <div className="home-container">
        <div className="header">
          <FaRegCreditCard className="icon-credit-card" />
          <h1 className="title">Bienvenido a la App Financiera</h1>
        </div>
        <p className="description">
          Otorga créditos por tus ventas con tasas efectivas
        </p>
        <div className="financial-info">
          <div className="info-section">
            <FaPercentage className="icon" />
            <h2 className="info-title">Tasas de Interés</h2>
            <p className="info-description">
              Conoce las tasas de interés más competitivas del mercado y cómo
              afectan a tus créditos y finanzas.
            </p>
          </div>
          <div className="info-section">
            <FaMoneyBillWave className="icon" />
            <h2 className="info-title">Créditos Disponibles</h2>
            <p className="info-description">
              Explora los diferentes tipos de créditos que ofrecemos para tus
              necesidades financieras.
            </p>
          </div>
        </div>
        <div className="credit-offer">
          <h2 className="info-title">Administra tu CUENTA CORRIENTE</h2>
          <p className="credit-text">
              Administra tu cuenta corriente y imprimelos!
          </p>
        </div>
        <div className="creators">
          <p>Creado por:</p>
          <ul>
            <li>Ccotarma Ttito, Sihuar Eduardo - u20211c736</li>
            <li>Martel Zevallos, Gabriel - U202121584</li>
            <li>Mayta Lopez, Harold Jame - U202114851</li>
            <li>Cueva Elera, Erick Armando - U201910151</li>
            <li>Gonzales Cancio, Gonzalo Freddy - u20171a663</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
