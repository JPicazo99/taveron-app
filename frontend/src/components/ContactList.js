// src/components/ContactList.js
import React, { useState } from "react";
import API from "../api";

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const digits = (v) => (v || "").replace(/\D/g, "");

const ContactList = ({ contactos = [], onChange }) => {
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ nombre: "", telefono: "", email: "" });
  const [error, setError] = useState("");

  const onEdit = (c) => {
    setEditId(c.id);
    setForm({ nombre: c.nombre, telefono: c.telefono, email: c.email });
    setError("");
  };

  const onCancel = () => {
    setEditId(null);
    setForm({ nombre: "", telefono: "", email: "" });
    setError("");
  };

  const validar = () => {
    if (!form.nombre.trim()) return "El nombre es obligatorio.";
    const tel = digits(form.telefono);
    if (tel.length < 10) return "El teléfono debe tener al menos 10 dígitos.";
    if (!emailOk(form.email)) return "Correo inválido.";
    return "";
  };

  const onSave = async (id) => {
    const msg = validar();
    if (msg) return setError(msg);
    setError("");
    await API.put(`/contactos/${id}`, {
      nombre: form.nombre.trim(),
      telefono: digits(form.telefono),
      email: form.email.trim(),
    });
    setEditId(null);
    onChange && onChange();
  };

  const onDelete = async (id) => {
    await API.delete(`/contactos/${id}`);
    onChange && onChange();
  };

  if (!contactos.length) return <p>Sin contactos.</p>;

  return (
    <ul>
      {contactos.map((c) => (
        <li key={c.id} style={{ marginBottom: 8 }}>
          {editId === c.id ? (
            <>
              {error && <div style={{ color: "red", marginBottom: 6 }}>{error}</div>}
              <input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Nombre"
                style={{ marginRight: 6 }}
              />
              <input
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                placeholder="Teléfono (10+ dígitos)"
                style={{ marginRight: 6 }}
              />
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                style={{ marginRight: 6 }}
              />
              <button onClick={() => onSave(c.id)} style={{ marginRight: 6 }}>
                Guardar
              </button>
              <button onClick={onCancel}>Cancelar</button>
            </>
          ) : (
            <>
              <strong>{c.nombre}</strong> — {c.telefono} — {c.email}
              <button onClick={() => onEdit(c)} style={{ marginLeft: 8 }}>
                Editar
              </button>
              <button onClick={() => onDelete(c.id)} style={{ marginLeft: 6 }}>
                Eliminar
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ContactList;
