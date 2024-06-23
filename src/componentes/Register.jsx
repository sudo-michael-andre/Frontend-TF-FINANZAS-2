import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import { urlAPI } from "./urlAPI";
import { FaBuilding, FaUserPlus, FaSave } from "react-icons/fa";

const Register = () => {
  const [empresaNombre, setEmpresaNombre] = useState("");
  const [empresaRuc, setEmpresaRuc] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [empresaCreada, setEmpresaCreada] = useState(false);
  const [empresaId, setEmpresaId] = useState(null);
  const navigate = useNavigate();

  const handleEmpresaSubmit = async (e) => {
    e.preventDefault();
    try {
      const empresaResponse = await fetch(`${urlAPI.urlAPI}/empresas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre: empresaNombre, ruc: empresaRuc }),
      });

      if (!empresaResponse.ok) {
        const empresaData = await empresaResponse.json();
        throw new Error(empresaData.mensaje || "Error al registrar la empresa");
      }

      const empresaResult = await empresaResponse.json();
      setEmpresaCreada(true);
      setEmpresaId(empresaResult._id);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUsuarioSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const newUser = {
        user: username,
        pass: password,
        correo: email,
        Empresa_id: empresaId,
      };

      const userResponse = await fetch(`${urlAPI.urlAPI}/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!userResponse.ok) {
        const userData = await userResponse.json();
        throw new Error(userData.mensaje || "Error al registrar el usuario");
      }

      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="layout-register">
      <div className="auth-container">
        <div className="auth-form">
          <h2>
            <FaBuilding className="icon" />
            {empresaCreada ? "Registrar Usuario" : "Registrar Empresa"}
          </h2>
          <form onSubmit={empresaCreada ? handleUsuarioSubmit : handleEmpresaSubmit}>
            {!empresaCreada ? (
              <>
                <label htmlFor="empresaNombre">Nombre de Empresa</label>
                <input
                  type="text"
                  id="empresaNombre"
                  value={empresaNombre}
                  onChange={(e) => setEmpresaNombre(e.target.value)}
                  required
                />
                <label htmlFor="empresaRuc">RUC de Empresa</label>
                <input
                  type="text"
                  id="empresaRuc"
                  value={empresaRuc}
                  onChange={(e) => setEmpresaRuc(e.target.value)}
                  required
                />
              </>
            ) : (
              <>
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </>
            )}
            {error && <div className="alert alert-danger mt-3">{error}</div>}
            <button type="submit">
              <FaSave className="icon" />
              {empresaCreada ? "Registrar Usuario" : "Registrar Empresa"}
            </button>
          </form>
          <p>
            Ya estás registrado? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </div>
      <div className="image-container">
        <img
          src="https://noticias.upc.edu.pe/wp-content/uploads/2020/08/Monterrico6-scaled.jpg"
          alt="Background"
        />
      </div>
    </div>
  );
};

export default Register;
