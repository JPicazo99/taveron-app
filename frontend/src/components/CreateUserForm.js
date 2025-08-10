import React, { useState } from "react";
import API from "../api";
import { Card, CardContent, Stack, TextField, Button, Typography } from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

const CreateUserForm = ({ onCreate }) => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validar = () => {
    if (!nombre.trim()) return "El nombre es obligatorio.";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) return "Correo inválido.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const msg = validar();
    if (msg) return setError(msg);
    setError("");

    try {
      await API.post("/usuarios/", { nombre, email });
      setNombre(""); setEmail("");
      onCreate && onCreate();
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(Array.isArray(detail) ? detail.map(d => d.msg).join(" | ") : "No se pudo crear el usuario.");
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" sx={{ mb: 2 }}>Crear usuario</Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            fullWidth
          />
          <TextField
            label="Correo"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <Button type="submit" variant="contained" startIcon={<PersonAddAlt1Icon />}>
            Save
          </Button>
        </Stack>
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default CreateUserForm;
