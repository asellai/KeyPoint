import { Button, Container, Typography, Box, Chip, Stack } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import QuizIcon from "@mui/icons-material/Quiz";
import SummarizeIcon from "@mui/icons-material/Summarize";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box className="min-h-screen" sx={{ background: "linear-gradient(135deg, #eef2ff 0%, #f8fafc 45%, #ecfeff 100%)" }}>
      <NavBar />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
            gap: 5,
            alignItems: "center",
          }}
        >
          <Box>
            <Chip
              icon={<AutoAwesomeIcon />}
              label="AI-powered study assistant"
              sx={{
                mb: 3,
                px: 1,
                bgcolor: "rgba(37, 99, 235, 0.08)",
                color: "#2563eb",
                fontWeight: 700,
              }}
            />

            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "2.6rem", md: "4.7rem" },
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.06em",
                color: "#0f172a",
                mb: 3,
              }}
            >
              Turn lecture notes into smart quizzes.
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "1.05rem", md: "1.25rem" },
                color: "#475569",
                maxWidth: 620,
                mb: 4,
                lineHeight: 1.8,
              }}
            >
              Upload slides or notes, get a clear AI summary, key concepts, and
              multiple-choice questions to review faster and study smarter.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/quiz")}
                sx={{
                  borderRadius: "16px",
                  px: 4,
                  py: 1.5,
                  fontWeight: 800,
                  textTransform: "none",
                  background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                  boxShadow: "0 18px 40px rgba(37, 99, 235, 0.28)",
                }}
              >
                Start creating quiz
              </Button>

              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderRadius: "16px",
                  px: 4,
                  py: 1.5,
                  fontWeight: 800,
                  textTransform: "none",
                  borderColor: "#cbd5e1",
                  color: "#0f172a",
                  bgcolor: "rgba(255,255,255,0.7)",
                }}
              >
                View demo
              </Button>
            </Stack>
          </Box>

          <Box
            sx={{
              p: 3,
              borderRadius: "32px",
              bgcolor: "rgba(255,255,255,0.72)",
              backdropFilter: "blur(18px)",
              border: "1px solid rgba(148,163,184,0.25)",
              boxShadow: "0 30px 80px rgba(15, 23, 42, 0.12)",
            }}
          >
            {[
              ["Upload material", "PDF slides, lecture notes, study documents", <UploadFileIcon />],
              ["AI Summary", "Main ideas, key terms, and important points", <SummarizeIcon />],
              ["Generated Quiz", "MCQs with options for self-checking", <QuizIcon />],
            ].map(([title, text, icon]) => (
              <Box
                key={title}
                sx={{
                  display: "flex",
                  gap: 2,
                  p: 2.5,
                  mb: 2,
                  borderRadius: "24px",
                  bgcolor: "#ffffff",
                  border: "1px solid #e2e8f0",
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "16px",
                    display: "grid",
                    placeItems: "center",
                    color: "#2563eb",
                    bgcolor: "#eff6ff",
                  }}
                >
                  {icon}
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 900, color: "#0f172a" }}>
                    {title}
                  </Typography>
                  <Typography sx={{ color: "#64748b", mt: 0.5 }}>
                    {text}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}