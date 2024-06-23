import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import { urlAPI } from "./urlAPI";
import { FaSignInAlt } from "react-icons/fa";

const Login = ({ setUsuario }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email, password);
    try {
      const response = await fetch(`${urlAPI.urlAPI}/usuarios/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo: email, pass: password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.mensaje || "Error al iniciar sesión");
      }

      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data));
      const user = JSON.parse(localStorage.getItem("user"));
      setUsuario(user);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="layout-login">
      <div className="auth-container login-container">
        <div className="auth-form login-form">
          <h2>
            <FaSignInAlt className="icon" />
            Login
          </h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">
              <FaSignInAlt className="icon" />
              Login
            </button>
          </form>
          {error && <div className="alert alert-danger">{error}</div>}
          <p>
            Don't have an account? <Link to="/register">Register</Link>
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

export default Login;
