// ─────────────────────────────────────────────────────────
// Recommendation Engine — Content-Based + Collaborative + External APIs
// ─────────────────────────────────────────────────────────

const GOAL_SKILL_MAP = {
  'Full Stack Developer':       ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'SQL', 'Git'],
  'Frontend Developer':          ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Git'],
  'Backend Developer':           ['Node.js', 'Express', 'Python', 'Django', 'SQL', 'MongoDB', 'PostgreSQL', 'Docker', 'Git'],
  'Data Scientist':              ['Python', 'Pandas', 'NumPy', 'SQL', 'Machine Learning', 'Data Visualization', 'Jupyter'],
  'Machine Learning Engineer':   ['Python', 'TensorFlow', 'PyTorch', 'Scikit-Learn', 'Math/Stats', 'SQL', 'Docker'],
  'DevOps Engineer':             ['Linux', 'Bash', 'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform', 'Git'],
  'Mobile Developer':            ['JavaScript', 'React Native', 'Swift', 'Kotlin', 'Firebase', 'Git'],
};

// ── Content-Based Filtering ──────────────────────────────
export const generateRecommendations = (goal, currentSkills) => {
  const currentLower = (currentSkills || []).map(s => s.toLowerCase());
  const targetSkills = GOAL_SKILL_MAP[goal] || GOAL_SKILL_MAP['Full Stack Developer'];

  const skillGaps = targetSkills.filter(
    ts => !currentLower.some(cs => cs.includes(ts.toLowerCase()) || ts.toLowerCase().includes(cs))
  );

  const platforms = ['Coursera', 'Udemy', 'edX', 'FreeCodeCamp'];
  const courses = skillGaps.map((skill, i) => ({
    id: `course-${i}`,
    title: `Mastering ${skill}`,
    platform: platforms[i % platforms.length],
    difficulty: 'Beginner to Intermediate',
    type: 'course',
  }));

  const projects = [
    { id: 'proj-1', title: `Build a ${goal} Portfolio`, type: 'project' },
    { id: 'proj-2', title: `Create a Real-world Clone using ${skillGaps[0] || 'your core stack'}`, type: 'project' },
  ];

  return { targetSkills, skillGaps, courses, projects };
};

// ── Collaborative Boost (Mock Peer Data) ─────────────────
// Simulates "users similar to you also learned these next"
const PEER_NEXT_SKILLS = {
  'Full Stack Developer':       ['TypeScript', 'GraphQL', 'Redis', 'AWS', 'Testing (Jest)'],
  'Frontend Developer':          ['Storybook', 'Vitest', 'Web Accessibility', 'Performance Audits'],
  'Backend Developer':           ['RabbitMQ', 'gRPC', 'Microservices', 'Rate Limiting', 'OpenAPI'],
  'Data Scientist':              ['Apache Spark', 'Airflow', 'Feature Engineering', 'A/B Testing'],
  'Machine Learning Engineer':   ['MLflow', 'ONNX', 'Triton Inference Server', 'Quantization'],
  'DevOps Engineer':             ['Istio', 'Prometheus', 'Grafana', 'ArgoCD', 'Vault'],
  'Mobile Developer':            ['Detox (E2E)', 'CodePush', 'Performance Profiling', 'Accessibility'],
};

export const collaborativeBoost = (goal, completedNodes) => {
  const peerSkills = PEER_NEXT_SKILLS[goal] || [];
  // Suggest 3 most relevant peer skills not yet in the roadmap
  return peerSkills.slice(0, 3).map((skill, i) => ({
    id: `peer-${i}`,
    skill,
    reason: `Learners with your ${goal} goal who reached your stage also studied this`,
  }));
};

// ── Mock External Jobs (LinkedIn / Coursera style) ───────
const MOCK_JOBS = {
  'Full Stack Developer': [
    { id: 'job-1', role: 'Junior Full Stack Developer', company: 'TechStartup Inc.', type: 'Internship', salary: '₹15,000/mo', skills: ['React', 'Node.js', 'MongoDB'], link: '#', logo: 'T' },
    { id: 'job-2', role: 'Software Engineer Intern', company: 'MegaCorp Ltd.', type: 'Internship', salary: '₹20,000/mo', skills: ['JavaScript', 'SQL', 'REST APIs'], link: '#', logo: 'M' },
    { id: 'job-3', role: 'Web Developer (Remote)', company: 'DigitalAgency', type: 'Part-time', salary: '₹25,000/mo', skills: ['HTML', 'CSS', 'React', 'Git'], link: '#', logo: 'D' },
  ],
  'Data Scientist': [
    { id: 'job-1', role: 'Data Science Intern', company: 'Analytics Co.', type: 'Internship', salary: '₹18,000/mo', skills: ['Python', 'Pandas', 'SQL'], link: '#', logo: 'A' },
    { id: 'job-2', role: 'ML Research Assistant', company: 'AI Labs', type: 'Internship', salary: '₹22,000/mo', skills: ['Python', 'Jupyter', 'Scikit-Learn'], link: '#', logo: 'L' },
    { id: 'job-3', role: 'Data Analyst (Remote)', company: 'DataFirst', type: 'Contract', salary: '₹30,000/mo', skills: ['SQL', 'Tableau', 'Excel'], link: '#', logo: 'D' },
  ],
  'Machine Learning Engineer': [
    { id: 'job-1', role: 'ML Engineer Intern', company: 'DeepVentures', type: 'Internship', salary: '₹20,000/mo', skills: ['Python', 'PyTorch', 'Docker'], link: '#', logo: 'D' },
    { id: 'job-2', role: 'AI Research Intern', company: 'NeuralLab', type: 'Internship', salary: '₹25,000/mo', skills: ['TensorFlow', 'Python', 'MLOps'], link: '#', logo: 'N' },
    { id: 'job-3', role: 'Data Engineer', company: 'CloudScale', type: 'Full-time', salary: '₹50,000/mo', skills: ['Spark', 'Airflow', 'AWS'], link: '#', logo: 'C' },
  ],
  'Frontend Developer': [
    { id: 'job-1', role: 'React Developer Intern', company: 'UIStudio', type: 'Internship', salary: '₹12,000/mo', skills: ['React', 'CSS', 'TypeScript'], link: '#', logo: 'U' },
    { id: 'job-2', role: 'Frontend Engineer', company: 'PixelPush', type: 'Full-time', salary: '₹45,000/mo', skills: ['Next.js', 'Tailwind', 'GraphQL'], link: '#', logo: 'P' },
    { id: 'job-3', role: 'UI Intern', company: 'CreativeSpark', type: 'Internship', salary: '₹10,000/mo', skills: ['HTML', 'CSS', 'Figma'], link: '#', logo: 'C' },
  ],
  'Backend Developer': [
    { id: 'job-1', role: 'Backend Intern', company: 'ServerSide Inc.', type: 'Internship', salary: '₹18,000/mo', skills: ['Node.js', 'Express', 'MongoDB'], link: '#', logo: 'S' },
    { id: 'job-2', role: 'API Developer', company: 'IntegrationHub', type: 'Contract', salary: '₹35,000/mo', skills: ['Python', 'REST', 'Docker'], link: '#', logo: 'I' },
    { id: 'job-3', role: 'Java Backend Engineer', company: 'EnterpriseCo', type: 'Full-time', salary: '₹55,000/mo', skills: ['Java', 'Spring Boot', 'SQL'], link: '#', logo: 'E' },
  ],
  'DevOps Engineer': [
    { id: 'job-1', role: 'DevOps Intern', company: 'CloudOps', type: 'Internship', salary: '₹20,000/mo', skills: ['Docker', 'Linux', 'Git'], link: '#', logo: 'C' },
    { id: 'job-2', role: 'Site Reliability Engineer', company: 'Infra Labs', type: 'Full-time', salary: '₹60,000/mo', skills: ['Kubernetes', 'Terraform', 'AWS'], link: '#', logo: 'I' },
    { id: 'job-3', role: 'Cloud Engineer', company: 'ScaleUp', type: 'Full-time', salary: '₹50,000/mo', skills: ['AWS', 'CI/CD', 'Ansible'], link: '#', logo: 'S' },
  ],
  'Mobile Developer': [
    { id: 'job-1', role: 'React Native Intern', company: 'AppFactory', type: 'Internship', salary: '₹15,000/mo', skills: ['React Native', 'JavaScript', 'Firebase'], link: '#', logo: 'A' },
    { id: 'job-2', role: 'Flutter Developer', company: 'MobileFirst', type: 'Full-time', salary: '₹40,000/mo', skills: ['Flutter', 'Dart', 'REST APIs'], link: '#', logo: 'M' },
    { id: 'job-3', role: 'iOS Intern', company: 'AppleShop', type: 'Internship', salary: '₹22,000/mo', skills: ['Swift', 'Xcode', 'UIKit'], link: '#', logo: 'A' },
  ],
};

export const mockExternalJobs = (goal) => MOCK_JOBS[goal] || MOCK_JOBS['Full Stack Developer'];

// ── Combined Export ──────────────────────────────────────
export const getFullRecommendations = (goal, skills, completedNodes) => {
  const base = generateRecommendations(goal, skills);
  const peerInsights = collaborativeBoost(goal, completedNodes);
  const jobs = mockExternalJobs(goal);
  return { ...base, peerInsights, jobs };
};
