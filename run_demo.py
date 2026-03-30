import json
from core_engine.engine import CoreIntelligenceEngine
from core_engine.chatbot import ChatbotIntegration

def run():
    raw_data = {
        "skills": ["HTML", "py"], # 'py' will be normalized to Python
        "career_goal": "Data Engineer",
        "academic_background": "B.Tech",
        "interests": ["Big Data"]
    }
    
    engine = CoreIntelligenceEngine()
    
    print("="*60)
    print("1. BASELINE PIPELINE EXECUTION")
    print("="*60)
    response = engine.process_user(raw_data)
    print(json.dumps(response.model_dump(), indent=2))
    
    print("\n" + "="*60)
    print("2. CHATBOT INTEGRATION TEST")
    print("="*60)
    bot = ChatbotIntegration(engine)
    print("USER: What should I learn next?")
    print("BOT:", bot.ask_what_to_learn_next(raw_data))
    print("\nUSER: What am I missing?")
    print("BOT:", bot.ask_what_am_i_missing(raw_data))
    print("\nUSER: Suggest projects")
    print("BOT:", bot.ask_suggest_projects(raw_data))
    print("\nUSER: Why this step? (SQL)")
    print("BOT:", bot.ask_why_this_step(raw_data, "SQL"))
    
    print("\n" + "="*60)
    print("3. WHAT-IF ANALYZER")
    print("="*60)
    print("Simulation: Changing Goal to 'Frontend Developer'")
    what_if = engine.simulate_what_if(raw_data, new_goal="Frontend Developer")
    print("New Roadmap:", what_if.roadmap)
    print("New Readiness Score:", what_if.readiness_score)

    print("\n" + "="*60)
    print("4. ALTERNATE PATH GENERATOR")
    print("="*60)
    print("Simulation: Skipping SQL in Data Engineer path")
    skip_sim = engine.skip_skill_and_recalculate(raw_data, "SQL")
    print("Modified Roadmap (SQL removed):", skip_sim.roadmap)
    print("New Next Step:", skip_sim.next_step)

if __name__ == "__main__":
    run()
