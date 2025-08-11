// src/theme.js
import { createTheme } from "@mui/material/styles";

export default function getTheme(mode = "light") {
  return createTheme({
    palette: {
      mode,
      primary: { main: mode === "light" ? "#1976d2" : "#90caf9" },
    },
    typography: {
      h6: { fontWeight: 700 },
    },
    shape: { borderRadius: 12 },
  });
}
