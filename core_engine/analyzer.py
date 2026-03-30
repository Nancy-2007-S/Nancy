from typing import List, Tuple, Dict, Any
from core_engine.models import UserProfile # type: ignore
from core_engine.knowledge_base import ROLES, DAG_DEPENDENCIES, SKILL_TIERS # type: ignore

def get_required_skills(goal: str) -> List[str]:
    return ROLES.get(goal, [])

def analyze_skill_gap(user_profile: UserProfile, required_skills: List[str]) -> Tuple[List[str], List[str]]:
    user_skills = set([s.lower() for s in user_profile.skills])
    missing = []
    completed = []
    for req in required_skills:
        if req.lower() in user_skills:
            completed.append(req)
        else:
            missing.append(req)
    return completed, missing

def calculate_progress(roadmap: List[str], completed: List[str]) -> float:
    if not roadmap: return 100.0
    progress = (len(completed) / len(roadmap)) * 100.0
    return round(progress, 2)

def rank_skill_importance(roadmap: List[str]) -> Dict[str, Dict[str, Any]]:
    ranking: Dict[str, Dict[str, Any]] = {}  # type: ignore
    
    out_degree: Dict[str, int] = {}  # type: ignore
    for skill in roadmap:
        out_degree[skill] = 0

    for node in roadmap:
        prereqs = DAG_DEPENDENCIES.get(node, [])
        for p in prereqs:
            if p in out_degree:
                out_degree[p] += 1
                
    for i, skill in enumerate(roadmap):
        depth = i
        # Use explicit tier from knowledge base
        tier = SKILL_TIERS.get(skill, "Basic")
        
        score = float(out_degree[skill] * 1.5 + (len(roadmap) - depth))
        ranking[skill] = {
            "level": tier,
            "importance_score": round(score, 2),
            "dependents": out_degree[skill]
        }
    return ranking
