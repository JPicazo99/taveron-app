import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { CssBaseline, AppBar, Toolbar, Typography, Container, Box } from "@mui/material";
import UserList from "./components/UserList";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Directorio de Contactos
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <UserList />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
