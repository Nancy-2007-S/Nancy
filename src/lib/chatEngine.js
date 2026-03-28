// ─────────────────────────────────────────────────────────
// Chat Engine — Intent Detection · Entity Extraction · Action Mapping
// ─────────────────────────────────────────────────────────

const INTENTS = {
  DIFFICULTY:     'DIFFICULTY',
  GOAL_CHANGE:    'GOAL_CHANGE',
  REQUEST_PROJECTS: 'REQUEST_PROJECTS',
  REQUEST_COURSES:  'REQUEST_COURSES',
  GENERAL:        'GENERAL',
};

// ── Intent Detection ─────────────────────────────────────
export const detectIntent = (message) => {
  const msg = message.toLowerCase();

  if (/switch|change.*goal|want to be|become a|move to|interested in/.test(msg)) {
    return INTENTS.GOAL_CHANGE;
  }
  if (/hard|difficult|struggling|confused|don.?t understand|stuck|too complex/.test(msg)) {
    return INTENTS.DIFFICULTY;
  }
  if (/project|build|create|make something|portfolio/.test(msg)) {
    return INTENTS.REQUEST_PROJECTS;
  }
  if (/course|learn|resource|tutorial|book|video/.test(msg)) {
    return INTENTS.REQUEST_COURSES;
  }
  return INTENTS.GENERAL;
};

// ── Entity Extraction ────────────────────────────────────
const SKILL_KEYWORDS = [
  'javascript', 'python', 'react', 'node', 'css', 'html', 'typescript',
  'sql', 'mongodb', 'docker', 'kubernetes', 'aws', 'machine learning',
  'tensorflow', 'pytorch', 'next.js', 'tailwind', 'git', 'linux', 'java',
  'graphql', 'rest api', 'flutter', 'kotlin', 'swift', 'pandas', 'numpy',
];

const GOAL_KEYWORDS = {
  'data science': 'Data Scientist',
  'data scientist': 'Data Scientist',
  'machine learning': 'Machine Learning Engineer',
  'ml engineer': 'Machine Learning Engineer',
  'frontend': 'Frontend Developer',
  'front end': 'Frontend Developer',
  'backend': 'Backend Developer',
  'back end': 'Backend Developer',
  'full stack': 'Full Stack Developer',
  'fullstack': 'Full Stack Developer',
  'devops': 'DevOps Engineer',
  'mobile': 'Mobile Developer',
  'android': 'Mobile Developer',
  'ios': 'Mobile Developer',
};

export const extractEntities = (message) => {
  const msg = message.toLowerCase();
  const skills = SKILL_KEYWORDS.filter(sk => msg.includes(sk));
  let detectedGoal = null;
  for (const [keyword, goal] of Object.entries(GOAL_KEYWORDS)) {
    if (msg.includes(keyword)) {
      detectedGoal = goal;
      break;
    }
  }
  return { skills, detectedGoal };
};

// ── Goal → RoadmapId Map ─────────────────────────────────
export const GOAL_TO_ROADMAP_ID = {
  'Full Stack Developer': 'full_stack',
  'Frontend Developer': 'frontend',
  'Backend Developer': 'backend',
  'Data Scientist': 'data_science',
  'Machine Learning Engineer': 'ml_engineer',
  'DevOps Engineer': 'devops',
  'Mobile Developer': 'mobile',
};

// ── Action Builder ───────────────────────────────────────
export const buildBotResponse = (intent, entities, userProfile, roadmap) => {
  const currentGoal = userProfile?.goal || 'Full Stack Developer';
  const firstName = (userProfile?.name || 'there').split(' ')[0];

  switch (intent) {

    case INTENTS.GOAL_CHANGE: {
      if (entities.detectedGoal && entities.detectedGoal !== currentGoal) {
        const newRoadmapId = GOAL_TO_ROADMAP_ID[entities.detectedGoal];
        return {
          reply: `Great choice, ${firstName}! Switching your roadmap to **${entities.detectedGoal}**. Your completed beginner skills will be preserved. I'm loading your new personalised path now... 🚀`,
          action: {
            type: 'SWITCH_ROADMAP',
            payload: {
              goal: entities.detectedGoal,
              roadmapId: newRoadmapId,
            },
          },
        };
      }
      return {
        reply: `You're already on the **${currentGoal}** path! If you'd like to switch, tell me the new goal — for example "I want to switch to Data Science".`,
        action: { type: 'NONE' },
      };
    }

    case INTENTS.DIFFICULTY: {
      const skill = entities.skills[0] || 'this topic';
      const nodeId = `extra-${skill.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
      const newNode = {
        id: nodeId,
        title: `${capitalise(skill)} — Extra Practice`,
        level: 'beginner',
        description: `Strengthening your foundation in ${capitalise(skill)} with additional exercises and simpler resources.`,
        resources: [
          { type: 'article', title: `${capitalise(skill)} Simplified`, link: `https://www.google.com/search?q=${encodeURIComponent(skill + ' beginner tutorial')}` },
        ],
        isNew: true,
      };
      // Find a beginner node to attach after
      const beginnerNodes = roadmap?.nodes?.filter(n => n.level === 'beginner') || [];
      const afterNodeId = beginnerNodes.length > 0 ? beginnerNodes[beginnerNodes.length - 1].id : null;

      return {
        reply: `No worries, ${firstName}! I've added an extra **${capitalise(skill)} practice node** to your roadmap to help reinforce the basics. Struggling is part of learning — let's take it step by step 💪`,
        action: {
          type: 'ADD_NODE',
          payload: { node: newNode, afterNodeId },
        },
      };
    }

    case INTENTS.REQUEST_PROJECTS: {
      const projects = generateProjectSuggestions(currentGoal);
      const projectNodes = projects.map((p, i) => ({
        id: `project-${Date.now()}-${i}`,
        title: p.title,
        level: 'intermediate',
        description: p.description,
        resources: [],
        isNew: true,
      }));

      return {
        reply: `Here are some project ideas for your **${currentGoal}** journey, ${firstName}! I'm adding them to your roadmap:\n\n${projects.map((p, i) => `**${i + 1}. ${p.title}** — ${p.description}`).join('\n\n')}`,
        action: {
          type: 'ADD_NODES_BATCH',
          payload: { nodes: projectNodes },
        },
      };
    }

    case INTENTS.REQUEST_COURSES: {
      const skill = entities.skills[0] || currentGoal;
      return {
        reply: `Here are some top resources for **${capitalise(skill)}**, ${firstName}:\n\n1. 🎓 **freeCodeCamp** — Free, project-based curriculum\n2. 📘 **The Odin Project** — Full curriculum with community support\n3. 🎬 **Traversy Media on YouTube** — Practical crash courses\n4. 📚 **MDN Web Docs** — Official reference & guides\n\nCheck your Recommendations page for a full personalised list!`,
        action: { type: 'NONE' },
      };
    }

    default: {
      return {
        reply: getGeneralResponse(firstName, currentGoal),
        action: { type: 'NONE' },
      };
    }
  }
};

// ── Helpers ──────────────────────────────────────────────
const capitalise = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const generateProjectSuggestions = (goal) => {
  const map = {
    'Full Stack Developer': [
      { title: 'Full-Stack Blog Platform', description: 'Build a blog with Next.js + MongoDB with auth, CRUD, comments.' },
      { title: 'E-Commerce Store', description: 'Product listing, cart, checkout with Stripe integration.' },
    ],
    'Frontend Developer': [
      { title: 'Design System Library', description: 'Build a reusable React component library with Storybook.' },
      { title: 'Animated Portfolio', description: 'Personal portfolio with Framer Motion animations.' },
    ],
    'Backend Developer': [
      { title: 'REST API with Auth', description: 'Node.js + Express + JWT authentication + PostgreSQL.' },
      { title: 'Microservices Demo', description: 'Split a monolith into two services connected via message queue.' },
    ],
    'Data Scientist': [
      { title: 'Customer Churn Predictor', description: 'ML model with Pandas + Scikit-Learn + a Streamlit dashboard.' },
      { title: 'EDA Dashboard', description: 'Interactive Plotly dashboard on a public dataset.' },
    ],
    'Machine Learning Engineer': [
      { title: 'Image Classifier', description: 'CNN trained on CIFAR-10, deployed with FastAPI.' },
      { title: 'Sentiment Analysis API', description: 'Fine-tune a HuggingFace model and serve via REST endpoint.' },
    ],
    'DevOps Engineer': [
      { title: 'CI/CD Pipeline', description: 'GitHub Actions to Docker → Kubernetes deployment on minikube.' },
      { title: 'Infrastructure as Code', description: 'Provision AWS EC2 + S3 + RDS with Terraform.' },
    ],
    'Mobile Developer': [
      { title: 'Task Manager App', description: 'React Native app with offline-first SQLite and push notifications.' },
      { title: 'Real-Time Chat', description: 'Flutter chat app backed by Firebase Firestore.' },
    ],
  };
  return map[goal] || map['Full Stack Developer'];
};

const getGeneralResponse = (firstName, goal) => {
  const tips = [
    `Hi ${firstName}! I'm your AI Career Mentor. Ask me anything about your **${goal}** path — I can help with skill gaps, project ideas, resources, or even switching goals.`,
    `Great question, ${firstName}! Remember: consistency beats intensity. Even 30 minutes a day on your **${goal}** skills compounds dramatically over time.`,
    `For your **${goal}** path, I'd recommend focusing on building real projects after each concept. Theory without practice fades quickly!`,
    `You're doing great, ${firstName}! If you ever feel stuck on a topic, just tell me — e.g., "I find React hard" — and I'll add extra practice material to your roadmap.`,
  ];
  return tips[Math.floor(Math.random() * tips.length)];
};
