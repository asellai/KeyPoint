from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import os
import json
import re
import fitz
from openai import OpenAI
from dotenv import load_dotenv
from database import engine, Base
from routers import users

load_dotenv()

API_KEY = os.getenv("API_KEY")

app = FastAPI()

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
allow_origins=[
    "http://localhost:3000",
    "https://feisty-elegance.up.railway.app",
    os.getenv("FRONTEND_URL", "http://localhost:3000")
],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

Base.metadata.create_all(bind=engine)
app.include_router(users.router)

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=API_KEY,
)

model = "openai/gpt-oss-120b:free"

class RequestData(BaseModel):
    prompt: str

def clean_text(text):
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()
    return text

def format_text(text):
    lines = text.split("\n")
    formatted_text = []
    for line in lines:
        line = line.strip()
        if line.startswith("•") or line.startswith("-"):
            formatted_text.append(f"\n- {line[1:].strip()}")
        elif line.isupper():
            formatted_text.append(f"\n\n{line}\n{'=' * len(line)}")
        else:
            formatted_text.append(line)
    return " ".join(formatted_text)

async def extract_text_from_pdf(file: UploadFile):
    file_content = await file.read()
    if len(file_content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max 10MB.")
    try:
        doc = fitz.open(stream=file_content, filetype="pdf")
        text = "\n".join([page.get_text("text") for page in doc])
        formatted_text = clean_text(text)
        formatted_text = format_text(formatted_text)
        return formatted_text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extracting text: {str(e)}")

async def generate_summary(text: str) -> str:
    summary_prompt = f"""Summarize the following text in 3-5 sentences. 
    The summary should be clear, concise and cover the main topics.
    Respond with ONLY the summary text, no additional formatting.
    
    Text: {text[:3000]}"""
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": summary_prompt}],
            temperature=0.3,
            extra_headers={
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "MCQ Generator App",
            },
        )
        return response.choices[0].message.content.strip()
    except Exception:
        return "Summary not available."

@app.post("/upload")
@limiter.limit("5/minute")
async def upload_file(request: Request, file: UploadFile = File(...), number: int = Form(...)):
    text = await extract_text_from_pdf(file)

    summary = await generate_summary(text)

    prompt = f""" [INST] <<SYS>>
    IMPORTANT:You MUST respond with ONLY valid JSON in the EXACT format specified below. 
    DO NOT include any additional text, explanations, or markdown formatting.
    
    Generate exactly {number} multiple-choice questions (MCQs) based on the following text.
    Ensure that:
    1. Each question is directly based on facts from the text.
    2. Each question has exactly four options.
    3. The correct answer is one of the four options.
    4. Irrelevant or generic questions are NOT included.
    5. Each question must have 4 options and one correct answer.
    6. The correct answer must be from the given options.

    Required JSON format:
    {{
        "questions": [
            {{
                "question": "Your question here",
                "options": ["Option 1", "Option 2", "Option 3", "Option 4"], 
                "correct_answer": "Correct option" 
            }}
        ]
    }}
    <</SYS>>

    Generate {number} MCQs using:
    1. The provided text (for context)
    2. Your own knowledge (to enhance questions if needed)
    Text to base questions on:
    {text}
    [/INST]"""

    try:
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            top_p=0.9,
            extra_headers={
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "MCQ Generator App",
            },
        )
        mcq_data = response.choices[0].message.content.strip()
        mcq_json = json.loads(mcq_data)

        return {
            "message": "MCQs generated successfully",
            "summary": summary,
            "data": mcq_json
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")

@app.get("/")
@limiter.limit("10/minute")
async def root(request: Request):
    return {"message": "KeyPoint API"}