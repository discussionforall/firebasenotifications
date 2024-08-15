import React, { useState } from "react";
import {
  Button,
  Container,
  Paper,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { getAuth, signOut } from "firebase/auth";

const Logout: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    const auth = getAuth();
    setLoading(true);
    setError(null);

    try {
      await signOut(auth);
    } catch (error) {
      setError("Failed to log out. Please try again.");
      console.error("Failed to log out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Paper sx={{ padding: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h5" gutterBottom>
          Logout
        </Typography>
        <Box sx={{ marginTop: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            disabled={loading}
            sx={{ marginTop: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Logout"}
          </Button>
          {error && (
            <Typography color="error" sx={{ marginTop: 2 }}>
              {error}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Logout;
