// src/components/UserDetail.js
import React, { useRef, useState, useEffect } from "react";
import {
  Card, CardContent, Stack, Typography, Avatar, Button, IconButton, Divider, TextField
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import API from "../api";
import CreateContactForm from "./CreateContactForm";
import ContactList from "./ContactList";

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const req = (v) => !!v?.trim();

const UserDetail = ({ usuario, onRefresh }) => {
  const fileRef = useRef(null);
  const [subiendo, setSubiendo] = useState(false);

  // ---- edición de usuario ----
  const [edit, setEdit] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [uError, setUError] = useState("");

  useEffect(() => {
    if (usuario) {
      setNombre(usuario.nombre || "");
      setEmail(usuario.email || "");
      setUError("");
      setEdit(false);
    }
  }, [usuario?.id]); // reset al cambiar selección

  const abrirFile = () => fileRef.current?.click();

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    try {
      setSubiendo(true);
      await API.post(`/usuarios/${usuario.id}/foto`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onRefresh && onRefresh();
    } finally {
      setSubiendo(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const quitarFoto = async () => {
    await API.delete(`/usuarios/${usuario.id}/foto`);
    onRefresh && onRefresh();
  };

  const validarUsuario = () => {
    if (!req(nombre)) return "El nombre es obligatorio.";
    if (!emailOk(email)) return "Correo inválido.";
    return "";
  };

  const guardarUsuario = async () => {
    const msg = validarUsuario();
    if (msg) return setUError(msg);
    setUError("");
    try {
      setSaving(true);
      await API.put(`/usuarios/${usuario.id}`, {
        nombre: nombre.trim(),
        email: email.trim(),
        // photo_url: no se envía; el backend la conserva
      });
      setEdit(false);
      onRefresh && onRefresh();
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setUError(Array.isArray(detail) ? detail.map(d => d.msg).join(" | ") : "No se pudo actualizar el usuario.");
    } finally {
      setSaving(false);
    }
  };

  if (!usuario) return null;

  return (
    <Card>
      <CardContent>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
          <Avatar
            src={usuario.photo_url || undefined}
            sx={{ width: 96, height: 96, fontSize: 28 }}
          >
            {usuario?.nombre?.[0]?.toUpperCase() || "?"}
          </Avatar>

          <Stack flex={1} spacing={1}>
            {edit ? (
              <>
                <TextField
                  label="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  size="small"
                />
                <TextField
                  label="Correo"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size="small"
                />
                {uError && <Typography color="error">{uError}</Typography>}
                <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                  <Button variant="contained" onClick={guardarUsuario} disabled={saving}>
                    Guardar
                  </Button>
                  <Button variant="text" onClick={() => { setEdit(false); setUError(""); setNombre(usuario.nombre); setEmail(usuario.email); }}>
                    Cancelar
                  </Button>
                </Stack>
              </>
            ) : (
              <>
                <Typography variant="h6">{usuario.nombre}</Typography>
                <Typography color="text.secondary">{usuario.email}</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Button variant="outlined" onClick={() => setEdit(true)}>
                    Editar usuario
                  </Button>
                </Stack>
              </>
            )}

            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{ display: "none" }}
              />
              <Button
                variant="outlined"
                startIcon={<UploadIcon />}
                onClick={abrirFile}
                disabled={subiendo}
              >
                {usuario.photo_url ? "Cambiar foto" : "Cargar foto"}
              </Button>
              {usuario.photo_url && (
                <IconButton color="error" onClick={quitarFoto} title="Quitar foto">
                  <DeleteOutlineIcon />
                </IconButton>
              )}
            </Stack>
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Agregar contacto
        </Typography>
        <CreateContactForm userId={usuario.id} onCreate={onRefresh} />

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
          Contactos
        </Typography>
        <ContactList contactos={usuario.contactos} onChange={onRefresh} />
      </CardContent>
    </Card>
  );
};

export default UserDetail;
