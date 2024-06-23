import React, { useState, useEffect } from "react";
import Aside from "./Aside";
import "../styles/usuario.css";
import { FaUserEdit, FaBuilding, FaSave, FaEdit } from "react-icons/fa";
import { urlAPI } from "./urlAPI";

const Usuario = () => {
  const [usuario, setUsuario] = useState(null); // Estado para almacenar el usuario
  const [empresa, setEmpresa] = useState(null); // Estado para almacenar la empresa
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar la carga de datos
  const [editandoUsuario, setEditandoUsuario] = useState(false); // Estado para controlar la edición de usuario
  const [editandoEmpresa, setEditandoEmpresa] = useState(false); // Estado para controlar la edición de empresa

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.usuario) {
          setUsuario(user.usuario);
          if (user.usuario.Empresa_id) {
            const empresaData = await obtenerEmpresa(user.usuario.Empresa_id);
            setEmpresa(empresaData);
          }
        } else {
          setIsLoading(false);
          // Aquí podrías redirigir a la página de login si no hay usuario
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const obtenerEmpresa = async (empresaId) => {
    try {
      const response = await fetch(
        `${urlAPI.urlAPI}/empresas/${empresaId}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener empresa");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener empresa:", error);
      return null;
    }
  };

  const handleEditarUsuario = async () => {
    try {
      const response = await fetch(
        `${urlAPI.urlAPI}/usuarios/${usuario._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(usuario),
        }
      );
      if (!response.ok) {
        throw new Error("Error al actualizar usuario");
      }
      const data = await response.json();
      setUsuario(data);
      localStorage.setItem("user", JSON.stringify({ usuario: data }));
      setEditandoUsuario(false); // Salir del modo de edición
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const handleEditarEmpresa = async () => {
    try {
      const response = await fetch(
        `${urlAPI.urlAPI}/empresas/${empresa._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(empresa),
        }
      );
      if (!response.ok) {
        throw new Error("Error al actualizar empresa");
      }
      const data = await response.json();
      setEmpresa(data);
      setEditandoEmpresa(false); // Salir del modo de edición
    } catch (error) {
      console.error("Error al actualizar empresa:", error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const handleChangeUsuario = (e) => {
    // Actualizar el estado local del usuario al cambiar los campos
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeEmpresa = (e) => {
    // Actualizar el estado local de la empresa al cambiar los campos
    setEmpresa({
      ...empresa,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  if (!usuario) {
    return <p>No se encontró usuario.</p>;
  }

  return (
    <div className="layout-usuario">
      <Aside setUsuario={setUsuario} usuario={usuario} />
      <div className="edit-section">
        <h1><FaUserEdit className="icon" /> Editar Usuario</h1>
        <p>Nombre de usuario: {usuario.user}</p>
        <p>Correo electrónico: {usuario.correo}</p>
        {editandoUsuario ? (
          <div className="edit-form">
            <input
              type="text"
              name="user"
              value={usuario.user}
              onChange={handleChangeUsuario}
              placeholder="Nuevo nombre de usuario"
            />
            <input
              type="email"
              name="correo"
              value={usuario.correo}
              onChange={handleChangeUsuario}
              placeholder="Nuevo correo electrónico"
            />
            <button className="save-btn" onClick={handleEditarUsuario}>
              <FaSave className="icon" /> Guardar Cambios
            </button>
          </div>
        ) : (
          <button className="edit-btn" onClick={() => setEditandoUsuario(true)}>
            <FaEdit className="icon" /> Editar Usuario
          </button>
        )}

        <h1><FaBuilding className="icon" /> Editar Empresa</h1>
        {empresa && (
          <>
            <p>Nombre de la empresa: {empresa.nombre}</p>
            {editandoEmpresa ? (
              <div className="edit-form">
                <input
                  type="text"
                  name="nombre"
                  value={empresa.nombre}
                  onChange={handleChangeEmpresa}
                  placeholder="Nuevo nombre de la empresa"
                />
                <button className="save-btn" onClick={handleEditarEmpresa}>
                  <FaSave className="icon" /> Guardar Cambios
                </button>
              </div>
            ) : (
              <button className="edit-btn" onClick={() => setEditandoEmpresa(true)}>
                <FaEdit className="icon" /> Editar Empresa
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Usuario;
