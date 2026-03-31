from typing import Dict, Any, Optional
from core_engine.engine import CoreIntelligenceEngine  # type: ignore
from core_engine.recommender import get_recommendations  # type: ignore

class ChatbotIntegration:
    """
    Step 12: Chatbot Integration
    Exposes intelligent functions that a chatbot UI can call to answer user queries,
    preventing the need for raw LLM generation and ensuring deterministic answers.
    """
    def __init__(self, engine: CoreIntelligenceEngine):
        self.engine = engine
        
    def ask_what_to_learn_next(self, raw_user_data: Dict[str, Any]) -> str:
        """Intent: 'What should I learn next?'"""
        response = self.engine.process_user(raw_user_data)
        if response.next_step == "All steps completed!":
            return "You have completed all prerequisites for your goal. Keep grinding!"
        return f"Based on your roadmap, your next step is to learn: {response.next_step}."

    def ask_what_am_i_missing(self, raw_user_data: Dict[str, Any]) -> str:
        """Intent: 'What am I missing?'"""
        response = self.engine.process_user(raw_user_data)
        if not response.missing_skills:
            return "You aren't missing any core skills for your target role!"
        skills_str = ", ".join(response.missing_skills)
        return f"To reach your goal, you are missing the following skills: {skills_str}."

    def ask_suggest_projects(self, raw_user_data: Dict[str, Any], skill: Optional[str] = None) -> str:
        """Intent: 'Suggest projects' (Optionally for a specific skill)"""
        if skill:
            recs = get_recommendations([skill])
            projects = recs.get(skill, {}).get("projects", [])
            if not projects:
                return f"I don't have specific project recommendations for {skill} at the moment."
            return f"For {skill}, you should try building: {', '.join(projects)}."
            
        # Overall
        response = self.engine.process_user(raw_user_data)
        if not response.next_step or response.next_step == "All steps completed!":
            return "You're all set! Try building a capstone project combining all your skills."
            
        next_recs = response.recommendations.get(response.next_step, {})
        projects = next_recs.get("projects", [])
        if not projects:
            return f"I recommend finding a project that practices {response.next_step}."
            
        return f"Since your next step is {response.next_step}, I recommend these projects: {', '.join(projects)}."
        
    def ask_why_this_step(self, raw_user_data: Dict[str, Any], skill: str) -> str:
        """Intent: 'Why this step?'"""
        response = self.engine.process_user(raw_user_data)
        explanation = response.explanations.get(skill)
        if explanation:
            return f"Here is why {skill} is important: {explanation}"
            
        return f"{skill} doesn't seem to be a core requirement for your main goal right now."
