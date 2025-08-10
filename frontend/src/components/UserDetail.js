// src/components/UserDetail.js
import React, { useRef, useState } from "react";
import {
  Card, CardContent, Stack, Typography, Avatar, Button, IconButton, Divider
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import API from "../api";
import CreateContactForm from "./CreateContactForm";
import ContactList from "./ContactList";

const UserDetail = ({ usuario, onRefresh }) => {
  const fileRef = useRef(null);
  const [subiendo, setSubiendo] = useState(false);

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

          <Stack flex={1} spacing={0.5}>
            <Typography variant="h6">{usuario.nombre}</Typography>
            <Typography color="text.secondary">{usuario.email}</Typography>

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
        <ContactList contactos={usuario.contactos} />
      </CardContent>
    </Card>
  );
};

export default UserDetail;
