import React, { useEffect, useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import getTheme from "./theme";
import {
  CssBaseline, AppBar, Toolbar, Typography, Container, Box, Button, Stack
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import UserList from "./components/UserList";

function App() {
  // modo dark/light con persistencia
  const [mode, setMode] = useState(() => localStorage.getItem("taveron-mode") || "light");
  useEffect(() => { localStorage.setItem("taveron-mode", mode); }, [mode]);
  const theme = useMemo(() => getTheme(mode), [mode]);
  const toggleMode = () => setMode(m => (m === "light" ? "dark" : "light"));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* AppBar con título y único botón de modo noche */}
      <AppBar position="sticky" elevation={1}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Directorio de Contactos
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1}>
            {/* icono visible en pantallas pequeñas */}
            <Button
              onClick={toggleMode}
              variant="outlined"
              color="inherit"
              size="small"
              startIcon={mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            >
              {mode === "dark" ? "Modo día" : "Modo noche"}
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* SOLO la línea descriptiva, alineada a la izquierda */}
      <Container maxWidth="lg">
        <Box sx={{ py: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Visualización distribuciones — (Bootstrap, Chart.js, FastAPI, NumPy, JavaScript, HTML, CSS, Python).{" "}
            <strong>by Joel Picazo</strong>
          </Typography>
        </Box>

        <Box sx={{ py: 3 }}>
          <UserList />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
