// src/components/UserList.js
import React, { useEffect, useState, useCallback, useMemo } from "react";
import API from "../api";
import {
  Card, CardContent, List, ListItem, ListItemText, IconButton,
  Typography, Stack, Divider, Box, Tooltip, Grid, TextField
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ContactsIcon from "@mui/icons-material/Contacts";
import SearchIcon from "@mui/icons-material/Search";
import CreateUserForm from "./CreateUserForm";
import UserDetail from "./UserDetail";

const UserList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [q, setQ] = useState("");

  const cargarUsuarios = useCallback(async () => {
    const res = await API.get("/usuarios/");
    setUsuarios(res.data);
    if (usuarioSeleccionado) {
      const actualizado = res.data.find(u => u.id === usuarioSeleccionado.id) || null;
      setUsuarioSeleccionado(actualizado);
    }
  }, [usuarioSeleccionado?.id]);

  useEffect(() => { cargarUsuarios(); }, [cargarUsuarios]);

  const eliminarUsuario = async (id) => {
    if (!window.confirm("¿Deseas eliminar este usuario y sus contactos?")) return;
    await API.delete(`/usuarios/${id}`);
    await cargarUsuarios();
  };

  const usuariosFiltrados = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return usuarios;
    return usuarios.filter(u =>
      u.nombre.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
    );
  }, [q, usuarios]);

  return (
    <Grid container spacing={3} wrap="nowrap">
      {/* Columna izquierda */}
      <Grid item xs={12} sm={5}>
        <CreateUserForm onCreate={cargarUsuarios} />

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="h6">Usuarios</Typography>
              <Tooltip title="Selecciona un usuario para ver sus datos">
                <ContactsIcon />
              </Tooltip>
            </Stack>

            <TextField
              fullWidth size="small" placeholder="Buscar por nombre o correo..."
              value={q} onChange={(e) => setQ(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon style={{ marginRight: 8, opacity: 0.6 }} /> }}
              sx={{ mb: 2 }}
            />

            <Divider sx={{ mb: 1 }} />

            <List dense>
              {usuariosFiltrados.map((usuario) => (
                <ListItem
                  key={usuario.id}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => eliminarUsuario(usuario.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                  sx={{
                    borderRadius: 2, mb: 1,
                    bgcolor: usuarioSeleccionado?.id === usuario.id ? "action.selected" : "transparent",
                    "&:hover": { bgcolor: "action.hover" }, cursor: "pointer"
                  }}
                  onClick={() => setUsuarioSeleccionado(usuario)}
                >
                  <ListItemText
                    primary={<Typography fontWeight={600}>{usuario.nombre}</Typography>}
                    secondary={usuario.email}
                  />
                </ListItem>
              ))}
              {usuariosFiltrados.length === 0 && (
                <Typography color="text.secondary">Sin resultados.</Typography>
              )}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Columna derecha */}
      <Grid item xs={12} sm={7}>
        {usuarioSeleccionado ? (
          <UserDetail usuario={usuarioSeleccionado} onRefresh={cargarUsuarios} />
        ) : (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Selecciona un usuario
              </Typography>
              <Typography color="text.secondary">
                Elige un usuario de la lista para ver sus datos, foto y contactos.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Grid>
    </Grid>
  );
};

export default UserList;
