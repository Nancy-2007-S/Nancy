import sys, os, traceback
sys.path.append(os.getcwd())
with open("test_log.txt", "w", encoding="utf-8") as f:
    try:
        from core_engine.engine import CoreIntelligenceEngine
        engine = CoreIntelligenceEngine()
        response = engine.process_user({
            "skills": [],
            "career_goal": "Data Scientist",
            "concise": False
        })
        f.write("Success.\n")
        f.write("Nodes: " + str([n.skill for n in response.roadmap]) + "\n")
    except Exception as e:
        f.write("FAILED with Exception:\n")
        f.write(traceback.format_exc() + "\n")
