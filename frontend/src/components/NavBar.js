import React from "react";
import { AppBar, Box, Toolbar, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import QuizifyLogo from "./Logo";

export default function NavBar() {
  const navigate = useNavigate();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "72px",
          display: "flex",
          justifyContent: "space-between",
          px: { xs: 2, md: 6 },
        }}
      >
        <Box
          onClick={() => navigate("/")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            cursor: "pointer",
            transition: "0.3s ease",
            "&:hover": {
              transform: "scale(1.03)",
            },
          }}
        >
          <QuizifyLogo />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, md: 2 },
          }}
        >
          <Button
            onClick={() => navigate("/")}
            sx={{
              color: "white",
              textTransform: "none",
              fontWeight: 600,
              px: 2,
              borderRadius: "14px",
              transition: "0.3s ease",
              "&:hover": {
                background: "rgba(255,255,255,0.12)",
                transform: "translateY(-2px)",
              },
            }}
          >
            Home
          </Button>

          <Button
            onClick={() => navigate("/quiz")}
            sx={{
              color: "white",
              textTransform: "none",
              fontWeight: 600,
              px: 2,
              borderRadius: "14px",
              transition: "0.3s ease",
              "&:hover": {
                background: "rgba(255,255,255,0.12)",
                transform: "translateY(-2px)",
              },
            }}
          >
            Quiz
          </Button>

          <Button
            onClick={() => navigate("/quiz")}
            sx={{
              color: "white",
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              py: 1,
              borderRadius: "999px",
              background: "linear-gradient(135deg, #7c3aed, #2563eb)",
              boxShadow: "0 10px 30px rgba(37, 99, 235, 0.35)",
              transition: "0.3s ease",
              "&:hover": {
                background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
                transform: "translateY(-3px)",
                boxShadow: "0 14px 35px rgba(37, 99, 235, 0.5)",
              },
            }}
          >
            Generate
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}