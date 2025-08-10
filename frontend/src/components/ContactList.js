import React, { useState } from "react";
import API from "../api";

const ContactList = ({ contactos = [] }) => {
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ nombre: "", telefono: "", email: "" });

  const onEdit = (c) => {
    setEditId(c.id);
    setForm({ nombre: c.nombre, telefono: c.telefono, email: c.email });
  };

  const onCancel = () => {
    setEditId(null);
    setForm({ nombre: "", telefono: "", email: "" });
  };

  const onSave = async (id) => {
    await API.put(`/contactos/${id}`, form);
    setEditId(null);
    window.location.reload(); 
  };

  const onDelete = async (id) => {
    await API.delete(`/contactos/${id}`);
    window.location.reload();
  };

  if (!contactos.length) return <p>Sin contactos.</p>;

  return (
    <ul>
      {contactos.map((c) => (
        <li key={c.id} style={{ marginBottom: 8 }}>
          {editId === c.id ? (
            <>
              <input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                style={{ marginRight: 6 }}
              />
              <input
                value={form.telefono}
                onChange={(e) =>
                  setForm({ ...form, telefono: e.target.value })
                }
                style={{ marginRight: 6 }}
              />
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
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
