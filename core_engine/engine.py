from typing import Dict, Any, List, Optional
from core_engine.models import UserProfile, EngineResponse  # type: ignore
from core_engine.preprocessing import preprocess_user_data  # type: ignore
from core_engine.analyzer import get_required_skills, analyze_skill_gap, calculate_progress, rank_skill_importance  # type: ignore
from core_engine.roadmap import generate_roadmap, get_next_step, smart_unlock_status, generate_alternate_path  # type: ignore
from core_engine.recommender import get_recommendations  # type: ignore
from core_engine.explanations import get_skill_explanations  # type: ignore
from core_engine.knowledge_base import ADVANCED_OFFERS, MILESTONES # type: ignore
from core_engine.offers_api import get_dynamic_internships, enhance_certifications_with_udemy # type: ignore
import time
import urllib.parse

class CoreIntelligenceEngine:
    def process_user(self, raw_user_data: Dict[str, Any]) -> EngineResponse:
        start_time = time.time()
        
        user_profile = preprocess_user_data(raw_user_data)
        goal = user_profile.career_goal
        checkpoint2 = time.time()
        
        required_skills = get_required_skills(goal)
        completed, missing_skills = analyze_skill_gap(user_profile, required_skills)
        checkpoint3 = time.time()
        
        full_roadmap = generate_roadmap(required_skills, user_profile.skills, False)
        roadmap_levels = {skill: i + 1 for i, skill in enumerate(full_roadmap)}
        checkpoint4 = time.time()
        
        roadmap = generate_roadmap(required_skills, user_profile.skills, raw_user_data.get('concise', False))
        next_step = get_next_step(user_profile, roadmap)
        progress = calculate_progress(roadmap, completed)
        checkpoint5 = time.time()
        
        readiness_score = 0.0
        if len(roadmap) > 0:
            readiness_score = round((len(completed) / len(roadmap)) * 100, 2) # type: ignore
            
        recommendations = get_recommendations(roadmap)
        explanations = get_skill_explanations(roadmap)
        ranking = rank_skill_importance(roadmap)
        
        # Get advanced offers (Certifications/Internships)
        base_offers = ADVANCED_OFFERS.get(goal, [])
        certifications = [o for o in base_offers if o.get("type", "") == "Certification"]
        
        # User strictly requested 5 internships ONLY, eliminating certifications.
        
        # Apify LinkedIn Scraper is now handled asynchronously by the UI via /api/dynamic_offers
        # Return 2 Certifications and 3 hardcoded AI internships immediately so the UI is fully unblocked!
        certifications = [o for o in base_offers if o.get("type", "") == "Certification"]
        
        # INSTANT OPTIMIZATION: Instead of scraping Udemy synchronously (which takes 10s+), 
        # we provide a direct search fallback. The UI will call /api/dynamic_offers 
        # to "upgrade" these links in the background.
        import urllib.parse
        for cert in certifications:
            if "url" not in cert or not cert["url"]:
                query = urllib.parse.quote(cert["name"])
                cert["url"] = f"https://www.udemy.com/courses/search/?q={query}"
        
        hardcoded_internships = [o for o in base_offers if o.get("type", "") == "Internship"]
        for hc in hardcoded_internships:
            if "url" not in hc or not hc["url"]:
                query = urllib.parse.quote(f"{hc['name']} {hc['company']}")
                hc["url"] = f"https://www.linkedin.com/jobs/search/?keywords={query}"
                
        offers = certifications[:2] + hardcoded_internships[:3]

        duration = time.time() - start_time
        print(f"--- ENGINE PROCESSED USER IN {duration:.4f} SECONDS ---")

        return EngineResponse(
            roadmap=roadmap,
            next_step=next_step if next_step != "All steps completed!" else None,
            missing_skills=missing_skills,
            readiness_score=readiness_score,
            progress=progress,
            recommendations=recommendations,
            explanations=explanations,
            skill_ranking=ranking,
            advanced_offers=offers,
            roadmap_levels=roadmap_levels,
            milestones=MILESTONES.get(goal, {})
        )
        
    def simulate_what_if(self, raw_user_data: Dict[str, Any], new_goal: Optional[str] = None, additional_skills: Optional[List[str]] = None) -> EngineResponse:
        import copy
        simulated_data = copy.deepcopy(raw_user_data)
        
        if new_goal:
            simulated_data['career_goal'] = new_goal
            
        if additional_skills:
            if 'skills' not in simulated_data:
                simulated_data['skills'] = []
            simulated_data['skills'].extend(additional_skills)
            
        return self.process_user(simulated_data)

    def skip_skill_and_recalculate(self, raw_user_data: Dict[str, Any], skipped_skill: str) -> EngineResponse:
        """Simulates skipping a skill and recalculates the roadmap."""
        response = self.process_user(raw_user_data)
        
        # Generate alternate path using the existing utility from roadmap.py
        new_roadmap = generate_alternate_path(response.roadmap, skipped_skill)
        
        # Update response with new roadmap and next step
        from core_engine.analyzer import calculate_progress # type: ignore
        from core_engine.roadmap import get_next_step # type: ignore
        
        # Re-calculate next step based on new roadmap
        user_profile = preprocess_user_data(raw_user_data)
        next_step = get_next_step(user_profile, new_roadmap)
        
        # Re-calculate progress based on new roadmap
        # (Note: This is a simplification; in a real DAG we might need to re-evaluate dependencies)
        completed = [s for s in user_profile.skills if s in new_roadmap]
        progress = calculate_progress(new_roadmap, completed)
        
        response.roadmap = new_roadmap
        response.next_step = next_step if next_step != "All steps completed!" else None
        response.progress = progress
        
        return response
