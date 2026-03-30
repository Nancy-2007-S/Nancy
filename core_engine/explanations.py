from typing import List, Dict
from core_engine.knowledge_base import DAG_DEPENDENCIES, SKILL_DESCRIPTIONS, SKILL_DETAILS  # type: ignore

def get_skill_explanations(roadmap: List[str]) -> Dict[str, Dict[str, str]]:
    explanations = {}
    for skill in roadmap:
        prereqs = DAG_DEPENDENCIES.get(skill, [])
        desc = SKILL_DESCRIPTIONS.get(skill, "Master this critical skill to advance in your career journey.")
        details = SKILL_DETAILS.get(skill, {})
        
        prereq_text = ""
        if not prereqs:
            prereq_text = "Foundational skill (Level 1)."
        else:
            prereq_text = f"Requires {' and '.join(prereqs)}."
            
        explanations[skill] = {
            "description": desc,
            "prerequisites": prereq_text,
            "paragraph": details.get("paragraph", ""),
            "gfg_link": details.get("gfg_link", "https://www.geeksforgeeks.org/")
        }
    return explanations
