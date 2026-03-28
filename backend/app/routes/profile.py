from datetime import datetime, timezone
from io import BytesIO
import re

from docx import Document
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from pypdf import PdfReader

from app.db.firestore import get_profiles_collection
from app.dependencies.auth import get_current_user
from app.schemas.profile import CareerProfilePayload, CareerProfileResponse

router = APIRouter()

SKILL_KEYWORDS = [
    "python",
    "java",
    "c++",
    "javascript",
    "typescript",
    "machine learning",
    "deep learning",
    "nlp",
    "computer vision",
    "sql",
    "data analysis",
    "pandas",
    "numpy",
    "power bi",
    "react",
    "node.js",
    "express",
    "tailwind css",
    "git",
    "docker",
    "kubernetes",
    "aws",
]

INTEREST_KEYWORDS = {
    "ai engineer": "AI Engineer",
    "data scientist": "Data Scientist",
    "ml engineer": "ML Engineer",
    "backend developer": "Backend Developer",
    "frontend developer": "Frontend Developer",
    "full stack developer": "Full Stack Developer",
    "cloud engineer": "Cloud Engineer",
}


def _extract_text_from_pdf(content: bytes) -> str:
    reader = PdfReader(BytesIO(content))
    return "\n".join((page.extract_text() or "") for page in reader.pages)


def _extract_text_from_docx(content: bytes) -> str:
    doc = Document(BytesIO(content))
    return "\n".join(paragraph.text for paragraph in doc.paragraphs)


def _extract_section_lines(text: str, patterns: list[str]) -> list[str]:
    lines = [line.strip(" -•\t") for line in text.splitlines() if line.strip()]
    results: list[str] = []
    for line in lines:
        lower = line.lower()
        if any(pattern in lower for pattern in patterns):
            results.append(line)
    return list(dict.fromkeys(results))[:8]


def _extract_academic_background(text: str) -> str:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    degree_pattern = re.compile(
        r"(b\.?tech|b\.?e|bachelor|m\.?tech|master|phd|bsc|msc|university|college)",
        re.IGNORECASE,
    )
    matches = [line for line in lines if degree_pattern.search(line)]
    return matches[0] if matches else ""


def _parse_resume_text(text: str) -> CareerProfilePayload:
    lower = text.lower()
    skills = [skill for skill in SKILL_KEYWORDS if skill in lower]
    skills = [skill.upper() if skill == "nlp" else skill.title() for skill in skills]

    interests = [
        label for keyword, label in INTEREST_KEYWORDS.items() if keyword in lower
    ]
    if not interests and ("machine learning" in lower or "ai" in lower):
        interests.append("AI Engineer")

    projects = _extract_section_lines(
        text, ["project", "built", "developed", "implemented"]
    )
    experience = _extract_section_lines(
        text,
        ["intern", "engineer", "developer", "experience", "responsible", "worked"],
    )
    academic_background = _extract_academic_background(text)

    return CareerProfilePayload(
        skills=list(dict.fromkeys(skills)),
        interests=list(dict.fromkeys(interests)),
        academic_background=academic_background,
        projects=projects,
        experience=experience,
        career_goals=list(dict.fromkeys(interests)),
    )


@router.post("/profile", response_model=CareerProfileResponse)
async def save_profile(
    payload: CareerProfilePayload, current_user=Depends(get_current_user)
):
    if not payload.skills and not payload.interests:
        raise HTTPException(status_code=400, detail="Profile data is incomplete")

    profiles = get_profiles_collection()
    user_id = str(current_user["_id"])
    now = datetime.now(timezone.utc)

    doc_ref = profiles.document(user_id)
    existing = doc_ref.get()
    created_at = now
    if hasattr(existing, "exists") and existing.exists:
        existing_data = existing.to_dict() or {}
        created_at = existing_data.get("created_at", now)

    doc_ref.set(
        {
            "skills": payload.skills,
            "interests": payload.interests,
            "academic_background": payload.academic_background,
            "projects": payload.projects,
            "experience": payload.experience,
            "career_goals": payload.career_goals,
            "created_at": created_at,
            "updated_at": now,
        },
        merge=True,
    )
    return CareerProfileResponse(message="Profile saved successfully")


@router.post("/profile/parse-resume", response_model=CareerProfilePayload)
async def parse_resume(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Missing file name")
    ext = file.filename.rsplit(".", 1)[-1].lower()
    if ext not in {"pdf", "docx"}:
        raise HTTPException(status_code=400, detail="Only PDF or DOCX is supported")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="File is empty")

    if ext == "pdf":
        text = _extract_text_from_pdf(content)
    else:
        text = _extract_text_from_docx(content)

    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from file")

    return _parse_resume_text(text)
