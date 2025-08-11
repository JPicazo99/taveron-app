// src/App.js
import React, { useEffect, useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import getTheme from "./theme";
import {
  CssBaseline, AppBar, Toolbar, Typography, Container, Box, IconButton, Button, Stack
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import UserList from "./components/UserList";

function App() {
  // ----- modo (light/dark) con persistencia -----
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("taveron-mode") || "light";
  });

  useEffect(() => {
    localStorage.setItem("taveron-mode", mode);
  }, [mode]);

  const theme = useMemo(() => getTheme(mode), [mode]);
  const toggleMode = () => setMode((m) => (m === "light" ? "dark" : "light"));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppBar position="sticky" elevation={1}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Directorio de Contactos
          </Typography>

          {/* Botón Modo noche / día */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton
              onClick={toggleMode}
              color="inherit"
              aria-label="Cambiar modo"
              size="small"
              sx={{ display: { xs: "inline-flex", sm: "none" } }}
            >
              {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            <Button
              onClick={toggleMode}
              variant="outlined"
              color="inherit"
              size="small"
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
            >
              {mode === "dark" ? "Modo día" : "Modo noche"}
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Descripción (como en tu imagen) */}
      <Container maxWidth="lg">
        <Box
          sx={{
            py: 2,
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ mb: 0.5 }}>
              Simulador de Distribuciones
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Visualización distribuciones — (Bootstrap, Chart.js, FastAPI, NumPy, JavaScript, HTML, CSS, Python).{" "}
              <strong>by Joel Picazo</strong>
            </Typography>
          </Box>

          {/* Duplicamos el botón aquí si también quieres tenerlo a la derecha de la descripción */}
          <Button
            onClick={toggleMode}
            variant="outlined"
            size="small"
            sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}
          >
            {mode === "dark" ? "Modo día" : "Modo noche"}
          </Button>
        </Box>

        <Box sx={{ py: 3 }}>
          <UserList />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
