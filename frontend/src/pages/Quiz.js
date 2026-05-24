import React, { useState, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Input,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  TextField,
  Modal,
  Chip,
  Stack,
} from "@mui/material";
import NavBar from "../components/NavBar";
import { Toaster, toast } from "react-hot-toast";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export default function Quiz() {
  const [darkMode, setDarkMode] = useState(true);
  const url = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [number, setNumber] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(null);

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState([]);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const f = e.dataTransfer.files[0];

    if (f?.type === "application/pdf") {
      setFile(f);
    } else {
      toast.error("Please upload a valid PDF file.");
    }
  }, []);

  const handleUpload = async () => {
    if (!file || file.type !== "application/pdf") {
      toast.error("Please upload a valid PDF file.");
      return;
    }

    if (!number) {
      toast.error("Please select the number of questions.");
      return;
    }

    setData([]);
    setSelectedAnswers({});
    setChecked(false);
    setScore(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("number", number);

    try {
      setLoading(true);

      const resp = await fetch(`${url}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!resp.ok) throw new Error("Failed to upload file");

      const json = await resp.json();
      setData(json.data);
    } catch (e) {
      toast.error(e.message || "Failed to upload file.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (qIndex, option) => {
    if (checked) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  const handleCheck = () => {
    if (Object.keys(selectedAnswers).length < data.questions.length) {
      toast.error("Please answer all questions before checking.");
      return;
    }

    let correct = 0;

    data.questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correct_answer) correct++;
    });

    setScore(correct);
    setChecked(true);
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setChecked(false);
    setScore(null);
  };

  const getOptionStyle = (qIndex, option, correctAnswer) => {
    const selected = selectedAnswers[qIndex] === option;

    if (!checked) {
      return {
        border: selected ? "2px solid #6366f1" : "1px solid #e2e8f0",
        backgroundColor: selected ? "rgba(99,102,241,0.1)" : "#ffffff",
        cursor: "pointer",
      };
    }

    if (option === correctAnswer) {
      return {
        border: "2px solid #22c55e",
        backgroundColor: "#dcfce7",
        cursor: "default",
      };
    }

    if (selected && option !== correctAnswer) {
      return {
        border: "2px solid #ef4444",
        backgroundColor: "#fee2e2",
        cursor: "default",
      };
    }

    return {
      border: "1px solid #e2e8f0",
      backgroundColor: "#ffffff",
      cursor: "default",
    };
  };

  const handleEdit = () => {
    if (data?.questions) {
      setEditData([...data.questions]);
      setOpen(true);
    } else {
      toast.error("No questions available to edit.");
    }
  };

  const handleSave = () => {
    const isValid = editData.every((q) => q.options.includes(q.correct_answer));

    if (!isValid) {
      toast.error("Correct answer must be one of the options.");
      return;
    }

    setData((prev) => ({ ...prev, questions: editData }));
    setSelectedAnswers({});
    setChecked(false);
    setScore(null);
    toast.success("Quiz saved successfully");
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    setEditData([]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...editData];
    updated[index][field] = value;
    setEditData(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...editData];
    updated[qIndex].options[oIndex] = value;
    setEditData(updated);
  };

  const addQuestion = () => {
    setEditData([
      ...editData,
      {
        question: "",
        options: ["", "", "", ""],
        correct_answer: "",
      },
    ]);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: darkMode
          ? "radial-gradient(circle at top left, rgba(99,102,241,0.35), transparent 35%), linear-gradient(135deg, #0f172a 0%, #1e1b4b 45%, #312e81 100%)"
          : "linear-gradient(135deg, #d5c9dd 0%, #ede9fe 35%, #c4b5fd 100%)",
      }}
    >
      <Toaster />
      <NavBar />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          onClick={() => setDarkMode(!darkMode)}
          sx={{
            color: "white",
            bgcolor: "rgba(255,255,255,0.1)",
            borderRadius: "999px",
            px: 3,
            py: 1,
            fontWeight: 700,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.15)",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.18)",
            },
          }}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </Button>
      </Box>

      <Container maxWidth="lg" sx={{ flex: 1, py: { xs: 5, md: 8 } }}>
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Chip
            label="AI Study Assistant"
            sx={{
              mb: 2,
              color: "#c7d2fe",
              bgcolor: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.18)",
              fontWeight: 700,
            }}
          />

          <Typography
            component="h1"
            sx={{
              color: "#ffffff",
              fontWeight: 900,
              fontSize: {
                xs: "2rem",
                sm: "2.5rem",
                md: "4rem",
              },
              letterSpacing: "-0.05em",
              lineHeight: 1.05,
            }}
          >
            Create a smart quiz from your PDF
          </Typography>

          <Typography
            sx={{
              color: "#cbd5e1",
              fontSize: { xs: "1rem", md: "1.2rem" },
              mt: 2,
              maxWidth: 720,
              mx: "auto",
            }}
          >
            Upload lecture slides or notes. AI will analyze your material and
            generate multiple-choice questions for fast revision.
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            maxWidth: 680,
            mx: "auto",
            p: { xs: 3, md: 4 },
            borderRadius: "32px",
            bgcolor: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.35)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
          }}
        >
          <Typography
            sx={{
              fontWeight: 900,
              color: "#0f172a",
              fontSize: "1.4rem",
              mb: 1,
              textAlign: "center",
            }}
          >
            Upload your study material
          </Typography>

          <Typography sx={{ color: "#64748b", textAlign: "center", mb: 3 }}>
            Drag and drop a PDF file here, or click to select.
          </Typography>

          <Box
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Paper
              elevation={0}
              onClick={() => document.getElementById("file-upload").click()}
              sx={{
                p: 5,
                cursor: "pointer",
                textAlign: "center",
                mb: 3,
                borderRadius: "28px",
                border: dragActive
                  ? "2px dashed #6366f1"
                  : "2px dashed #cbd5e1",
                bgcolor: dragActive ? "rgba(99,102,241,0.08)" : "#f8fafc",
                transition: "0.25s",
                "&:hover": {
                  borderColor: "#6366f1",
                  bgcolor: "rgba(99,102,241,0.06)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              {file ? (
                <>
                  <CheckCircleIcon
                    sx={{ fontSize: 54, color: "#22c55e", mb: 1 }}
                  />
                  <Typography sx={{ color: "#0f172a", fontWeight: 800 }}>
                    {file.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    PDF selected successfully
                  </Typography>
                </>
              ) : (
                <>
                  <CloudUploadIcon
                    sx={{ fontSize: 64, color: "#6366f1", mb: 1 }}
                  />
                  <Typography sx={{ color: "#0f172a", fontWeight: 800 }}>
                    Drag your PDF here or click to browse
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    Only PDF files are accepted
                  </Typography>
                </>
              )}
            </Paper>

            <Input
              id="file-upload"
              type="file"
              accept=".pdf"
              sx={{ display: "none" }}
              onChange={handleFileChange}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Number of Questions</InputLabel>
              <Select
                value={number || ""}
                onChange={(e) => setNumber(e.target.value)}
                label="Number of Questions"
                sx={{
                  borderRadius: "16px",
                  bgcolor: "#ffffff",
                }}
              >
                <MenuItem value="" disabled>
                  Select
                </MenuItem>
                {[5, 10, 15, 20].map((n) => (
                  <MenuItem key={n} value={n}>
                    {n} Questions
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              fullWidth
              onClick={handleUpload}
              sx={{
                py: 1.7,
                borderRadius: "16px",
                fontWeight: 900,
                textTransform: "none",
                fontSize: "1rem",
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                boxShadow: "0 18px 40px rgba(99,102,241,0.35)",
              }}
            >
              Generate Smart Quiz
            </Button>
          </Box>

          {!loading && data?.questions?.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                mt: 4,
                p: { xs: 3, md: 4 },
                borderRadius: "28px",
                bgcolor: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.35)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              }}
            >
              <Chip
                label="AI Generated Summary"
                sx={{
                  mb: 2,
                  bgcolor: "rgba(99,102,241,0.12)",
                  color: "#4f46e5",
                  fontWeight: 800,
                }}
              />

              <Typography
                sx={{
                  fontSize: "1.6rem",
                  fontWeight: 900,
                  color: "#0f172a",
                  mb: 1,
                }}
              >
                Quick Summary
              </Typography>

              <Typography sx={{ color: "#64748b", mb: 3 }}>
                AI analyzed your document and extracted the main concepts.
              </Typography>

              <Stack spacing={2}>
                {[
                  "Machine learning uses data to train intelligent systems.",
                  "Neural networks imitate how the human brain processes information.",
                  "Deep learning is a subset of machine learning using multiple layers.",
                  "AI models improve accuracy through continuous training.",
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                      p: 2,
                      borderRadius: "18px",
                      bgcolor: "#f8fafc",
                      transition: "0.25s ease",
                      "&:hover": {
                        transform: "translateX(6px)",
                        bgcolor: "rgba(99,102,241,0.06)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        mt: "10px",
                        bgcolor: "#6366f1",
                        flexShrink: 0,
                      }}
                    />

                    <Typography
                      sx={{
                        color: "#0f172a",
                        fontWeight: 600,
                        lineHeight: 1.7,
                      }}
                    >
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          )}

          {loading && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: 4,
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: 90,
                  height: 90,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    width: 90,
                    height: 90,
                    borderRadius: "50%",
                    background:
                      "conic-gradient(from 0deg, #6366f1, #8b5cf6, #3b82f6, #6366f1)",
                    animation: "spin 1.2s linear infinite",
                    filter: "blur(1px)",
                    "@keyframes spin": {
                      from: {
                        transform: "rotate(0deg)",
                      },
                      to: {
                        transform: "rotate(360deg)",
                      },
                    },
                  }}
                />

                <Box
                  sx={{
                    width: 68,
                    height: 68,
                    borderRadius: "50%",
                    bgcolor: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 2,
                    boxShadow: "0 10px 30px rgba(99,102,241,0.25)",
                  }}
                >
                  <CloudUploadIcon
                    sx={{
                      color: "#6366f1",
                      fontSize: 34,
                    }}
                  />
                </Box>
              </Box>

              <Typography sx={{ mt: 2, color: "#475569", fontWeight: 700 }}>
                Generating questions...
              </Typography>
            </Box>
          )}
        </Paper>

        {!loading && data?.questions?.length > 0 && (
          <Box sx={{ width: "100%", mt: 5 }}>
            {checked && (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 3,
                  textAlign: "center",
                  borderRadius: "24px",
                  bgcolor:
                    score === data.questions.length
                      ? "#dcfce7"
                      : score >= data.questions.length / 2
                      ? "#fef9c3"
                      : "#fee2e2",
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "2.2rem", md: "3.2rem" },
                    fontWeight: 900,
                    background:
                      score === data.questions.length
                        ? "linear-gradient(135deg, #22c55e, #16a34a)"
                        : score >= data.questions.length / 2
                        ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                        : "linear-gradient(135deg, #ef4444, #dc2626)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: "popIn 0.5s ease",
                    "@keyframes popIn": {
                      from: {
                        transform: "scale(0.7)",
                        opacity: 0,
                      },
                      to: {
                        transform: "scale(1)",
                        opacity: 1,
                      },
                    },
                  }}
                >
                  Your Score: {score} / {data.questions.length}
                </Typography>

                <Typography color="text.secondary">
                  {score === data.questions.length
                    ? "🎉 Perfect!"
                    : score >= data.questions.length / 2
                    ? "👍 Good job!"
                    : "📚 Keep practicing!"}
                </Typography>
              </Paper>
            )}

            {data.questions.map((question, qIndex) => (
              <Paper
                key={qIndex}
                elevation={0}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: "24px",
                  bgcolor: "rgba(255,255,255,0.96)",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ mb: 2, fontWeight: 900, color: "#0f172a" }}
                >
                  {qIndex + 1}. {question.question}
                </Typography>

                {question.options.map((option, oIndex) => (
                  <Box
                    key={oIndex}
                    onClick={() => handleSelectAnswer(qIndex, option)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      p: 1.8,
                      mb: 1.2,
                      borderRadius: "16px",
                      transition: "0.2s",
                      ...getOptionStyle(
                        qIndex,
                        option,
                        question.correct_answer
                      ),
                      "&:hover": !checked
                        ? {
                            backgroundColor: "rgba(99,102,241,0.08)",
                            transform: "translateX(4px)",
                          }
                        : {},
                    }}
                  >
                    <Typography sx={{ flex: 1, color: "#0f172a" }}>
                      {String.fromCharCode(65 + oIndex)}. {option}
                    </Typography>

                    {checked && option === question.correct_answer && (
                      <CheckCircleIcon sx={{ color: "#22c55e" }} />
                    )}

                    {checked &&
                      selectedAnswers[qIndex] === option &&
                      option !== question.correct_answer && (
                        <CancelIcon sx={{ color: "#ef4444" }} />
                      )}
                  </Box>
                ))}
              </Paper>
            ))}

            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              flexWrap="wrap"
              sx={{ mb: 4 }}
            >
              {!checked ? (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleCheck}
                  >
                    Check Answers
                  </Button>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={handleEdit}
                  >
                    Edit
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="contained" onClick={handleRetry}>
                    Try Again
                  </Button>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={handleEdit}
                  >
                    Edit
                  </Button>
                </>
              )}
            </Stack>
          </Box>
        )}
      </Container>

      <Modal
        open={open}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") handleClose();
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            width: { xs: "90vw", sm: "80vw", md: "60vw" },
            p: 4,
            borderRadius: "24px",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight="900">
            Edit Questions
          </Typography>

          {editData.map((question, qIndex) => (
            <Box key={qIndex} sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography
                  variant="h6"
                  color="primary"
                  fontWeight="bold"
                  sx={{ flex: 1 }}
                >
                  Question {qIndex + 1}
                </Typography>

                <IconButton
                  color="error"
                  onClick={() =>
                    setEditData(editData.filter((_, i) => i !== qIndex))
                  }
                >
                  <DeleteIcon />
                </IconButton>
              </Box>

              <TextField
                label={`Question ${qIndex + 1}`}
                fullWidth
                value={question.question}
                onChange={(e) =>
                  handleChange(qIndex, "question", e.target.value)
                }
                sx={{ mb: 2 }}
              />

              {question.options.map((option, oIndex) => (
                <TextField
                  key={oIndex}
                  label={`Option ${oIndex + 1}`}
                  fullWidth
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(qIndex, oIndex, e.target.value)
                  }
                  sx={{ mb: 1 }}
                />
              ))}

              <TextField
                label="Correct Answer"
                fullWidth
                value={question.correct_answer}
                onChange={(e) =>
                  handleChange(qIndex, "correct_answer", e.target.value)
                }
                sx={{
                  mt: 1,
                  border: question.options.includes(question.correct_answer)
                    ? "none"
                    : "2px solid red",
                  borderRadius: 1,
                }}
              />
            </Box>
          ))}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button startIcon={<AddCircleIcon />} onClick={addQuestion}>
              Add Question
            </Button>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="contained" color="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="contained" color="success" onClick={handleSave}>
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}