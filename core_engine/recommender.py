from typing import List, Dict, Any
from core_engine.knowledge_base import CONTENT_MAPPING  # type: ignore

def get_recommendations(roadmap: List[str]) -> Dict[str, Any]:
    """
    For each skill in the roadmap, recommends courses, projects, 
    and related technologies based on Content-Based Recommendation mapping.
    """
    recommendations: Dict[str, Any] = {}
    for skill in roadmap:
        if skill in CONTENT_MAPPING:
            recommendations[skill] = CONTENT_MAPPING[skill]
        else:
            # Fallback for generic skills
            recommendations[skill] = {
                "courses": [f"{skill} Masterclass"],
                "projects": [f"Basic {skill} Project"],
                "related": []
            }
    return recommendations
