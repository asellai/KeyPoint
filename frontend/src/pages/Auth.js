import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

const URL = "http://127.0.0.1:8000";

export default function Auth() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // переключение между Login и Register
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      toast.success(`Welcome back, ${data.username}!`);
      setTimeout(() => navigate("/home"), 1000);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!form.username || !form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.username, email: form.email, password: form.password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Registration failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      toast.success(`Welcome, ${data.username}!`);
      setTimeout(() => navigate("/home"), 1000);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #1b1445 0%, #2d1f6f 45%, #5c4fe5 100%)",
        p: 2,
      }}
    >
      <Toaster />
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 460,
          p: 5,
          borderRadius: "32px",
          backdropFilter: "blur(20px)",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        }}
      >
        <Typography variant="h3" fontWeight={900} sx={{ color: "#ffffff", textAlign: "center", mb: 1 }}>
          {isLogin ? "Welcome Back" : "Create Account"}
        </Typography>

        <Typography sx={{ color: "#cfc9ff", textAlign: "center", mb: 4 }}>
          {isLogin ? "Login to continue your AI learning journey" : "Sign up to start your AI learning journey"}
        </Typography>

        {/* Username — только при регистрации */}
        {!isLogin && (
          <TextField
            fullWidth
            name="username"
            placeholder="Username"
            margin="normal"
            value={form.username}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: "#9b8cff" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": { borderRadius: "18px", background: "rgba(255,255,255,0.08)", color: "#fff" },
              "& .MuiInputBase-input::placeholder": { color: "#cfc9ff" },
            }}
          />
        )}

        <TextField
          fullWidth
          name="email"
          placeholder="Email Address"
          margin="normal"
          value={form.email}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon sx={{ color: "#9b8cff" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": { borderRadius: "18px", background: "rgba(255,255,255,0.08)", color: "#fff" },
            "& .MuiInputBase-input::placeholder": { color: "#cfc9ff" },
          }}
        />

        <TextField
          fullWidth
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          margin="normal"
          value={form.password}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon sx={{ color: "#9b8cff" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff sx={{ color: "#cfc9ff" }} /> : <Visibility sx={{ color: "#cfc9ff" }} />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": { borderRadius: "18px", background: "rgba(255,255,255,0.08)", color: "#fff" },
            "& .MuiInputBase-input::placeholder": { color: "#cfc9ff" },
          }}
        />

        <Button
          fullWidth
          disabled={loading}
          onClick={isLogin ? handleLogin : handleRegister}
          sx={{
            py: 1.7,
            borderRadius: "18px",
            fontWeight: 900,
            textTransform: "none",
            fontSize: "1rem",
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            boxShadow: "0 12px 35px rgba(99,102,241,0.45)",
            mb: 3,
            color: "#fff",
          }}
          variant="contained"
        >
          {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
        </Button>

        <Divider sx={{ color: "#cfc9ff", mb: 3 }}>OR</Divider>

        <Typography
          sx={{ color: "#d6d0ff", textAlign: "center", mt: 2, fontSize: "0.95rem", cursor: "pointer" }}
          onClick={() => {
            setIsLogin(!isLogin);
            setForm({ username: "", email: "", password: "" });
          }}
        >
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span style={{ color: "#a78bfa", fontWeight: 700 }}>
            {isLogin ? "Sign Up" : "Sign In"}
          </span>
        </Typography>
      </Paper>
    </Box>
  );
}