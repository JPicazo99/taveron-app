// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light", // cambia a "dark" si prefieres
    primary: { main: "#2563eb" },   // azul
    secondary: { main: "#0ea5e9" }, // cian
  },
  shape: { borderRadius: 14 },
});

export default theme;
