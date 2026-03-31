from fastapi import FastAPI, Body, HTTPException  # type: ignore
from fastapi.middleware.cors import CORSMiddleware  # type: ignore
from pydantic import BaseModel  # type: ignore
from typing import List, Dict, Any, Optional

import sys
import os
from dotenv import load_dotenv  # type: ignore

# Load environment variables
load_dotenv()

# Adjust the path to import core_engine from the parent directory  # type: ignore
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core_engine.engine import CoreIntelligenceEngine  # type: ignore
from core_engine.chatbot import ChatbotIntegration  # type: ignore

app = FastAPI(title="AI Career Mentor API")

@app.on_event("startup")
async def warmup_engine():
    """Pre-imports all heavy modules at server startup to eliminate cold-start latency."""
    print("Warming up Intelligence Engine...")
    import core_engine.preprocessing  # noqa
    import core_engine.analyzer  # noqa
    import core_engine.roadmap  # noqa
    import core_engine.recommender  # noqa
    import core_engine.explanations  # noqa
    import core_engine.knowledge_base  # noqa
    import core_engine.offers_api  # noqa
    print("Engine warmed up. First request will be instant.")

@app.get("/api/warmup")
async def warmup_ping():
    """Lightweight ping to confirm the engine is ready."""
    return {"status": "warm"}

# Configure CORS based on environment
allowed_origins = os.getenv("CORS_ORIGINS", "*").split(",")
if allowed_origins == ["*"]:
    allow_origins = ["*"]
else:
    allow_origins = [origin.strip() for origin in allowed_origins]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = CoreIntelligenceEngine()
chatbot = ChatbotIntegration(engine)

class UserDataInput(BaseModel):
    skills: List[str]
    career_goal: str
    academic_background: Optional[str] = ""
    interests: Optional[List[str]] = []
    concise: Optional[bool] = False

class ChatRequest(BaseModel):
    intent: str # "next_step", "missing", "projects", "why"
    user_data: UserDataInput
    target_skill: Optional[str] = None
    
class WhatIfRequest(BaseModel):
    user_data: UserDataInput
    new_goal: Optional[str] = None
    new_skills: Optional[List[str]] = None

class SkipRequest(BaseModel):
    user_data: UserDataInput
    skipped_skill: str

class QuizRequest(BaseModel):
    skill: str

@app.post("/api/process")
async def process_user_flow(data: UserDataInput):
    """Generates the full roadmap and readiness response."""
    try:
        response = engine.process_user(data.model_dump())
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
        
@app.post("/api/chat")
async def chat_intent(req: ChatRequest):
    """Handles Chatbot intents to return deterministic answers."""
    try:
        raw_data = req.user_data.model_dump()
        if req.intent == "next_step":
            return {"reply": chatbot.ask_what_to_learn_next(raw_data)}
        elif req.intent == "missing":
            return {"reply": chatbot.ask_what_am_i_missing(raw_data)}
        elif req.intent == "projects":
            return {"reply": chatbot.ask_suggest_projects(raw_data, req.target_skill)}
        elif req.intent == "why":
            if not req.target_skill:
                return {"reply": "Please specify a skill to explain."}
            return {"reply": chatbot.ask_why_this_step(raw_data, req.target_skill)}
        else:
            return {"reply": "Sorry, I am not programmed to understand that intent."}
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/whatif")
async def what_if_simulation(req: WhatIfRequest):
    """Rebuilds the roadmap with hypothetical data."""
    try:
        raw_data = req.user_data.model_dump()
        response = engine.simulate_what_if(
            raw_data=raw_data, 
            new_goal=req.new_goal, 
            additional_skills=req.new_skills
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/skip")
async def skip_skill_flow(req: SkipRequest):
    """Handles skipping a skill and recalculating the roadmap."""
    try:
        response = engine.skip_skill_and_recalculate(
            raw_user_data=req.user_data.model_dump(),
            skipped_skill=req.skipped_skill
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/quest/quiz")
async def get_quest_quiz(req: QuizRequest):
    """Generates 5 dynamic MCQs for the skill quest."""
    try:
        from core_engine.quiz_generator import generate_quiz_for_skill # type: ignore
        quiz = generate_quiz_for_skill(req.skill)
        return {"quiz": quiz}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/news/daily")
async def fetch_daily_tech_checkin():
    """Fetches Google News and generates a daily True/False checkin question."""
    try:
        from news_scraper import scrape_google_news, generate_trivia_from_news
        # Default query for daily checking
        news = scrape_google_news("Tech News", limit=5)
        trivia = generate_trivia_from_news(news)
        return {"news": news, "trivia": trivia}
    except Exception as e:
        print(f"Error fetching daily check-in: {e}")
        return {"news": [], "trivia": {
            "question": "Is Artificial Intelligence a part of Computer Science?",
            "is_true": True,
            "explanation": "Yes, AI is fundamentally a computer science discipline."
        }}

@app.get("/api/dynamic_offers")
async def fetch_dynamic_internships_background(goal: str, missing: str = ""):
    """Fetches dynamic offers from Apify in the background without blocking roadmap UI."""
    try:
        from core_engine.offers_api import get_dynamic_internships, enhance_certifications_with_udemy # type: ignore
        from core_engine.knowledge_base import ADVANCED_OFFERS # type: ignore
        
        base_offers = ADVANCED_OFFERS.get(goal, [])
        certifications = [o for o in base_offers if o.get("type", "") == "Certification"]
        
        if missing:
            missing_skills = [s.strip() for s in missing.split(",") if s.strip()]
            for skill in missing_skills[:3]: # Scrape Udemy specifically for top 3 missing stack skills
                if not any(skill.lower() in c['name'].lower() for c in certifications):
                    certifications.insert(0, {
                        "type": "Certification",
                        "name": f"{skill} for Beginners to Advanced",
                        "company": "Udemy",
                        "url": "" 
                    })
        
        certifications = enhance_certifications_with_udemy(certifications)
        
        dynamic_internships = get_dynamic_internships(goal)
        dynamic_internships = dynamic_internships[:3]
        
        if len(dynamic_internships) < 3:
             import urllib.parse
             hardcoded_internships = [o for o in base_offers if o.get("type", "") == "Internship"]
             for hc in hardcoded_internships:
                 if len(dynamic_internships) >= 3:
                     break
                 if not any(o["name"].lower() == hc["name"].lower() for o in dynamic_internships):
                     if "url" not in hc or not hc["url"]:
                         query = urllib.parse.quote(f"{hc['name']} {hc['company']}")
                         hc["url"] = f"https://www.linkedin.com/jobs/search/?keywords={query}"
                     dynamic_internships.append(hc)
                     
        offers = certifications[:4] + dynamic_internships
        return {"offers": offers}
    except Exception as e:
        print(f"Error fetching dynamic offers: {e}")
        return {"offers": []}
