import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container, Box } from "@mui/material";
import { useAuth } from "../Auth/useAuth"; 

const Navbar: React.FC = () => {
  const { user, logout } = useAuth(); 

  return (
    <AppBar position="static">
      <Toolbar>
        <Container sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">
            <Button color="inherit" component={Link} to="/">
              Notifications
            </Button>
          </Typography>
          <Box>
            {user ? (
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            ) : (
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
            )}
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
