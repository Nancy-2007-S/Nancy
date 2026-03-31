from pydantic import BaseModel, Field # type: ignore
from typing import List, Dict, Optional, Any

class UserProfile(BaseModel):
    skills: List[str] = Field(default_factory=list)
    interests: List[str] = Field(default_factory=list)
    projects: List[str] = Field(default_factory=list)
    academic_background: str = ""
    certifications: List[str] = Field(default_factory=list)
    career_goal: str = ""

class EngineResponse(BaseModel):
    roadmap: List[str]
    next_step: Optional[str]
    missing_skills: List[str]
    readiness_score: float
    progress: float
    recommendations: Dict[str, Any]
    explanations: Dict[str, Dict[str, str]]  # description, prerequisites, paragraph, gfg_link
    skill_ranking: Dict[str, Dict[str, Any]]
    advanced_offers: List[Dict[str, Any]]
    roadmap_levels: Dict[str, int] = Field(default_factory=dict)
    milestones: Dict[str, Any] = Field(default_factory=dict)
