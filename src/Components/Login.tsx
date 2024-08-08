import React, { useEffect, useState } from "react";
import { Button, TextField, Typography, Container, Paper } from "@mui/material";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const auth = getAuth();
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {  // It will Listen for authentication state changes
        if (user) {
          navigate("/");
        }
      });
  
      return () => unsubscribe();
    }, [navigate, auth]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => { // Handle login functionality
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError("Failed to login. Please check your credentials.");
    }
  };

  return (
    <Container sx={{ marginTop: 2 }}>
      <Paper style={{ padding: 16 }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          placeholder="test@gmail.com"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          placeholder="Sparkle1#"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Login
        </Button>
        {error && <Typography color="error">{error}</Typography>}
      </Paper>
    </Container>
  );
};

export default Login;
