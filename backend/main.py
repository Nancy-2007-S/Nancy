from fastapi import FastAPI, Body, HTTPException  # type: ignore
from fastapi.middleware.cors import CORSMiddleware  # type: ignore
from pydantic import BaseModel  # type: ignore
from typing import List, Dict, Any, Optional

import sys
import os
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev purposes
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

@app.get("/api/dynamic_offers")
async def fetch_dynamic_internships_background(goal: str):
    """Fetches dynamic offers from Apify in the background without blocking roadmap UI."""
    try:
        from core_engine.offers_api import get_dynamic_internships, enhance_certifications_with_udemy # type: ignore
        from core_engine.knowledge_base import ADVANCED_OFFERS # type: ignore
        
        base_offers = ADVANCED_OFFERS.get(goal, [])
        certifications = [o for o in base_offers if o.get("type", "") == "Certification"]
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
                     
        offers = certifications[:2] + dynamic_internships
        return {"offers": offers}
    except Exception as e:
        print(f"Error fetching dynamic offers: {e}")
        return {"offers": []}
