import React, { useState } from "react";
import API from "../api";

const CreateContactForm = ({ userId, onCreate }) => {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validar = () => {
    const soloDigitos = telefono.replace(/\D/g, "");
    if (soloDigitos.length < 10) {
      return "El teléfono debe tener al menos 10 dígitos.";
    }
    if (!nombre.trim()) return "El nombre es obligatorio.";
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) return "Correo inválido.";
    return "";
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const msg = validar();
    if (msg) {
      setError(msg);
      return;
    }
    setError("");

    try {
      await API.post(`/usuarios/${userId}/contactos/`, {
        nombre,
        telefono: telefono.replace(/\D/g, ""), 
        email,
      });
      setNombre("");
      setTelefono("");
      setEmail("");
      onCreate && onCreate();
    } catch (err) { // En caso de error
      const detail = err?.response?.data?.detail;
      setError(
        Array.isArray(detail)
          ? detail.map(d => d.msg).join(" | ")
          : "No se pudo crear el contacto."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
      <h4>Agregar contacto</h4>
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      <input
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        style={{ marginRight: 8 }}
      />
      <input
        placeholder="Teléfono (10+ dígitos)"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        style={{ marginRight: 8 }}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginRight: 8 }}
      />
      <button type="submit">Agregar</button>
    </form>
  );
};

export default CreateContactForm;
