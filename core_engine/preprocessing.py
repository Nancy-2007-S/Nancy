from core_engine.models import UserProfile  # type: ignore
from typing import Dict, Any

def preprocess_user_data(raw_data: Dict[str, Any]) -> UserProfile:
    skills = [s.strip().title() for s in raw_data.get("skills", [])]
    # Simple synonym mapping mapping
    mapped_skills = []
    for s in skills:
        s_lower = s.lower()
        if s_lower in ["py", "python3", "python"]:
            mapped_skills.append("Python")
        elif s_lower in ["js", "javascript"]:
            mapped_skills.append("JavaScript")
        elif s_lower in ["sql"]:
            mapped_skills.append("SQL")
        elif s_lower in ["dbms"]:
            mapped_skills.append("DBMS")
        elif s_lower in ["etl"]:
            mapped_skills.append("ETL")
        elif s_lower in ["html"]:
            mapped_skills.append("HTML")
        elif s_lower in ["css"]:
            mapped_skills.append("CSS")
        else:
            mapped_skills.append(s)
            
    return UserProfile(
        skills=list(set(mapped_skills)),
        interests=raw_data.get("interests", []),
        projects=raw_data.get("projects", []),
        academic_background=raw_data.get("academic_background", ""),
        certifications=raw_data.get("certifications", []),
        career_goal=raw_data.get("career_goal", "Software Engineer")
    )
