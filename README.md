**📚 AI Mentor - Intelligent Career Roadmap Guide**

Project Overview
AI Mentor is an intelligent mentorship platform that guides students through personalized career development roadmaps. It analyzes student skills, interests, and career goals to generate customized learning paths, provide interactive guidance, and offer real-time career insights.

✨ Key Features
1. Intelligent Roadmap Generation

Analyzes student skills, academic background, and career goals
Generates personalized learning paths tailored to career aspirations
Provides step-by-step progression recommendations
2. Interactive Chatbot Assistant

Answers "What should I learn next?"
Identifies skill gaps with "What am I missing?"
Suggests relevant projects based on career goals
Explains "Why this step?" for better understanding
3. What-If Analysis Engine

Simulate career goal changes and see updated roadmaps
Explore alternative learning paths
Skip skills and recalculate recommended progression
4. Skills Assessment

Auto-normalize skill names (e.g., 'py' → 'Python')
Calculate readiness scores
Identify knowledge gaps
5. Real-time Job Market Integration

Access current job offers via Apify
Scrape Udemy course recommendations
Stay updated with industry trends and news
🏗️ Architecture
Core Engine (Python) - Intelligent processing system handling:

Career roadmap generation
Skill analysis and gap detection
Interactive chatbot responses
Quiz generation for skill assessment
What-if scenario analysis
Backend (Python/FastAPI) - REST API providing:

User profile processing
Job market data
Course recommendations
News scraping capabilities
Frontend (Vue.js + Vite) - Modern web interface with:

Responsive design using Tailwind CSS
Interactive roadmap visualization
Real-time chatbot interactions
Career progress tracking
💻 Tech Stack
Backend: Python, FastAPI, Pydantic
Frontend: Vue.js, Vite, Tailwind CSS
APIs: Apify (web scraping), Firebase (optional)
Type Checking: Pyright (Python 3.12)
📂 Project Structure
Code
Nancy/
├── core_engine/          # AI engine & intelligence
│   ├── engine.py        # Main processing engine
│   ├── knowledge_base.py # Skill & career mappings
│   ├── chatbot.py       # Interactive assistant
│   ├── quiz_generator.py # Skill assessments
│   └── roadmap.py       # Career path generation
├── backend/              # FastAPI server
│   ├── main.py          # REST API endpoints
│   └── news_scraper.py  # Data collection
├── frontend/             # Vue.js web app
│   ├── src/             # Vue components
│   └── package.json     # Dependencies
└── run_demo.py          # Demo script
🚀 Quick Start
1. Setup Environment

bash
# Copy environment configuration
cp .env.example .env

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Install frontend dependencies
cd ../frontend
npm install
2. Run the Demo

bash
python run_demo.py
This executes:

Baseline pipeline processing
Chatbot integration tests
What-if analysis simulations
Alternative path generation
3. Start Development

bash
# Backend
python backend/main.py

# Frontend (in another terminal)
cd frontend
npm run dev
📊 Example Usage
Python
from core_engine.engine import CoreIntelligenceEngine

# Initialize the AI engine
engine = CoreIntelligenceEngine()

# Process student profile
student_data = {
    "skills": ["HTML", "Python"],
    "career_goal": "Data Engineer",
    "academic_background": "B.Tech",
    "interests": ["Big Data"]
}

# Get personalized roadmap
roadmap = engine.process_user(student_data)
print(roadmap.roadmap)
print(f"Readiness Score: {roadmap.readiness_score}")

# Interactive chatbot
from core_engine.chatbot import ChatbotIntegration
bot = ChatbotIntegration(engine)
print(bot.ask_what_to_learn_next(student_data))
🔄 Advanced Features
What-If Scenarios

Python
# Simulate changing career goal
simulation = engine.simulate_what_if(student_data, new_goal="Frontend Developer")
Skill Gap Analysis

Python
# See how roadmap changes if you skip a skill
modified = engine.skip_skill_and_recalculate(student_data, "SQL")
🛠️ Configuration
Environment Variables (.env)

CORS_ORIGINS - Allowed frontend origins
APIFY_TOKEN - Web scraping credentials
UDEMY_APIFY_TOKEN - Course scraping token
FIREBASE_* - Optional backend authentication
Python Version: 3.12

📈 Language Composition
JavaScript: 60.8% (Frontend)
Python: 33.2% (Core Engine & Backend)
CSS: 3.2% (Styling)
HTML: 0.1% (Markup)
🎯 Use Cases
Students: Get personalized learning paths for career goals
Career Switchers: Plan transitions between roles
Fresh Graduates: Navigate early career decisions
Professionals: Identify upskilling opportunities
🤝 Contributing
Contributions are welcome! Please feel free to submit issues and pull requests.

📝 License
Check the repository for license information.
