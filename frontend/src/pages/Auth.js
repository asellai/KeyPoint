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
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function Auth() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #1b1445 0%, #2d1f6f 45%, #5c4fe5 100%)",
        p: 2,
      }}
    >
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
        <Typography
          variant="h3"
          fontWeight={900}
          sx={{
            color: "#ffffff",
            textAlign: "center",
            mb: 1,
          }}
        >
          Welcome Back
        </Typography>

        <Typography
          sx={{
            color: "#cfc9ff",
            textAlign: "center",
            mb: 4,
          }}
        >
          Login to continue your AI learning journey
        </Typography>

        <TextField
          fullWidth
          placeholder="Email Address"
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon sx={{ color: "#9b8cff" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "18px",
              background: "rgba(255,255,255,0.08)",
              color: "#fff",
            },
          }}
        />

        <TextField
          fullWidth
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon sx={{ color: "#9b8cff" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <VisibilityOff sx={{ color: "#cfc9ff" }} />
                  ) : (
                    <Visibility sx={{ color: "#cfc9ff" }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: "18px",
              background: "rgba(255,255,255,0.08)",
              color: "#fff",
            },
          }}
        />

        <Button
          fullWidth
          sx={{
            py: 1.7,
            borderRadius: "18px",
            fontWeight: 900,
            textTransform: "none",
            fontSize: "1rem",
            background:
              "linear-gradient(135deg, #6366f1, #a855f7)",
            boxShadow: "0 12px 35px rgba(99,102,241,0.45)",
            mb: 3,
          }}
          variant="contained"
        >
          Sign In
        </Button>

        <Divider
          sx={{
            color: "#cfc9ff",
            mb: 3,
          }}
        >
          OR CONTINUE WITH
        </Divider>

        <Button
          fullWidth
          startIcon={<GoogleIcon />}
          sx={{
            py: 1.4,
            borderRadius: "16px",
            mb: 2,
            background: "rgba(255,255,255,0.08)",
            color: "#fff",
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          Continue with Google
        </Button>

        <Button
          fullWidth
          startIcon={<GitHubIcon />}
          sx={{
            py: 1.4,
            borderRadius: "16px",
            background: "rgba(255,255,255,0.08)",
            color: "#fff",
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          Continue with GitHub
        </Button>

        <Typography
          sx={{
            color: "#d6d0ff",
            textAlign: "center",
            mt: 4,
            fontSize: "0.95rem",
          }}
        >
          Don’t have an account? Sign Up
        </Typography>
      </Paper>
    </Box>
  );
}