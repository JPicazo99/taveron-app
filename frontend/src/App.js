import React, { useEffect, useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import getTheme from "./theme";
import {
  CssBaseline, AppBar, Toolbar, Typography, Container, Button, Stack, Box
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import UserList from "./components/UserList";

function App() {
  const [mode, setMode] = useState(() => localStorage.getItem("taveron-mode") || "light");
  useEffect(() => { localStorage.setItem("taveron-mode", mode); }, [mode]);
  const theme = useMemo(() => getTheme(mode), [mode]);
  const toggleMode = () => setMode(m => (m === "light" ? "dark" : "light"));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* AppBar con título + descripción debajo */}
      <AppBar position="sticky" elevation={1}>
        <Toolbar sx={{ flexDirection: "column", alignItems: "flex-start", py: 1 }}>
          {/* Primera línea: título y botón */}
          <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Directorio de Contactos
            </Typography>
            <Button
              onClick={toggleMode}
              variant="outlined"
              color="inherit"
              size="small"
              startIcon={mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            >
              {mode === "dark" ? "Modo día" : "Modo noche"}
            </Button>
          </Box>

          {/* Segunda línea: descripción */}
          <Typography variant="body2" color="inherit" sx={{ opacity: 0.85 }}>
            Visualización distribuciones — (Bootstrap, Chart.js, FastAPI, NumPy, JavaScript, HTML, CSS, Python).{" "}
            <strong>by Joel Picazo</strong>
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Box sx={{ py: 3 }}>
          <UserList />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
