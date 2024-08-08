import React from "react";
import { Button, Container, Paper } from "@mui/material";
import { getAuth, signOut } from "firebase/auth";

const Logout: React.FC = () => {

  const handleLogout = async () => {    // Function to handle user logout
    const auth = getAuth();
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <Container>
      <Paper style={{ padding: 16 }}>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Paper>
    </Container>
  );
};

export default Logout;
