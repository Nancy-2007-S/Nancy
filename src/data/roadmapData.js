export const roadmapData = {
  full_stack: {
    title: "Full Stack Developer",
    nodes: [
      {
        id: "fs-1",
        title: "Internet Basics",
        level: "beginner",
        description: "How does the internet work? DNS, HTTP.",
        resources: [{ type: 'article', title: 'How the web works', link: 'https://roadmap.sh/guides/what-is-internet' }]
      },
      {
        id: "fs-2",
        title: "HTML",
        level: "beginner",
        description: "Learn HTML basics.",
        resources: [{ type: 'youtube', title: 'HTML crash course', link: 'https://youtube.com' }]
      },
      {
        id: "fs-3",
        title: "CSS",
        level: "beginner",
        description: "Learn CSS basics and responsive design.",
        resources: [{ type: 'course', title: 'CSS Mastery', link: 'https://udemy.com' }]
      },
      {
        id: "fs-4",
        title: "JavaScript",
        level: "beginner",
        description: "Learn the core language of the web. DOM, ES6+.",
        resources: [{ type: 'article', title: 'MDN JS Guide', link: 'https://developer.mozilla.org' }]
      },
      {
        id: "fs-5",
        title: "React",
        level: "intermediate",
        description: "Component based UI framework.",
        resources: [{ type: 'youtube', title: 'React full course', link: 'https://youtube.com' }]
      },
      {
        id: "fs-6",
        title: "Node.js",
        level: "intermediate",
        description: "JavaScript runtime for building backend APIs.",
        resources: []
      },
      {
        id: "fs-7",
        title: "Relational Databases",
        level: "intermediate",
        description: "PostgreSQL, MySQL design and querying.",
        resources: []
      },
      {
        id: "fs-8",
        title: "System Design",
        level: "advanced",
        description: "Design scalable backend systems. Caching, Load balancing.",
        resources: []
      }
    ],
    edges: [
      { from: "fs-1", to: "fs-2" },
      { from: "fs-2", to: "fs-3" },
      { from: "fs-3", to: "fs-4" },
      { from: "fs-4", to: "fs-5" },
      { from: "fs-4", to: "fs-6" },
      { from: "fs-6", to: "fs-7" },
      { from: "fs-5", to: "fs-8" },
      { from: "fs-7", to: "fs-8" }
    ]
  },
  data_science: {
    title: "Data Scientist",
    nodes: [
      { id: "ds-1", title: "Python Basics", level: "beginner", description: "Learn Python syntax and data structures.", resources: [{ type: 'course', title: 'Python for Beginners', link: '#' }] },
      { id: "ds-2", title: "Math & Statistics", level: "beginner", description: "Linear algebra, probability theory.", resources: [] },
      { id: "ds-3", title: "Pandas & Numpy", level: "intermediate", description: "Data manipulation and analysis.", resources: [] },
      { id: "ds-4", title: "Machine Learning Concepts", level: "advanced", description: "Supervised and Unsupervised learning methods.", resources: [] }
    ],
    edges: [
      { from: "ds-1", to: "ds-3" },
      { from: "ds-2", to: "ds-3" },
      { from: "ds-3", to: "ds-4" }
    ]
  },
  frontend: {
    title: "Frontend Developer",
    nodes: [
      { id: "fe-1", title: "HTML/CSS", level: "beginner", description: "Web building blocks", resources: [] },
      { id: "fe-2", title: "JavaScript", level: "beginner", description: "Web logic", resources: [] },
      { id: "fe-3", title: "React", level: "intermediate", description: "Component UI", resources: [] },
      { id: "fe-4", title: "Next.js", level: "advanced", description: "React Framework", resources: [] }
    ],
    edges: [
      { from: "fe-1", to: "fe-2" },
      { from: "fe-2", to: "fe-3" },
      { from: "fe-3", to: "fe-4" }
    ]
  },
  backend: {
    title: "Backend Developer",
    nodes: [
      { id: "be-1", title: "Programming Language", level: "beginner", description: "Python, Go, or Node.js", resources: [] },
      { id: "be-2", title: "APIs & REST", level: "intermediate", description: "Building endpoints", resources: [] },
      { id: "be-3", title: "Databases & ORMs", level: "intermediate", description: "SQL and NoSQL", resources: [] },
      { id: "be-4", title: "Docker & CI/CD", level: "advanced", description: "Containers and pipelines", resources: [] }
    ],
    edges: [
      { from: "be-1", to: "be-2" },
      { from: "be-2", to: "be-3" },
      { from: "be-3", to: "be-4" }
    ]
  },
  ml_engineer: {
    title: "Machine Learning Engineer",
    nodes: [
      { id: "ml-1", title: "Python & Math", level: "beginner", description: "Python programming, linear algebra, statistics.", resources: [{ type: 'course', title: 'Python for ML', link: 'https://roadmap.sh/ai-data-scientist' }] },
      { id: "ml-2", title: "Data Handling", level: "beginner", description: "Pandas, Numpy, data cleaning & EDA.", resources: [] },
      { id: "ml-3", title: "ML Algorithms", level: "intermediate", description: "Regression, Classification, Clustering, SVMs.", resources: [] },
      { id: "ml-4", title: "Deep Learning", level: "intermediate", description: "Neural networks, CNNs, RNNs with PyTorch/TensorFlow.", resources: [] },
      { id: "ml-5", title: "MLOps & Deployment", level: "advanced", description: "Model serving, monitoring, CI/CD for ML pipelines.", resources: [] }
    ],
    edges: [
      { from: "ml-1", to: "ml-2" },
      { from: "ml-2", to: "ml-3" },
      { from: "ml-3", to: "ml-4" },
      { from: "ml-4", to: "ml-5" }
    ]
  },
  devops: {
    title: "DevOps Engineer",
    nodes: [
      { id: "do-1", title: "Linux & Scripting", level: "beginner", description: "Linux fundamentals, Bash scripting.", resources: [] },
      { id: "do-2", title: "Version Control & CI", level: "beginner", description: "Git, GitHub Actions, Jenkins.", resources: [] },
      { id: "do-3", title: "Containers", level: "intermediate", description: "Docker, container registries, multi-stage builds.", resources: [] },
      { id: "do-4", title: "Kubernetes", level: "intermediate", description: "Orchestration, deployments, services, Helm.", resources: [] },
      { id: "do-5", title: "Cloud & IaC", level: "advanced", description: "AWS/GCP/Azure, Terraform, infrastructure as code.", resources: [] }
    ],
    edges: [
      { from: "do-1", to: "do-2" },
      { from: "do-2", to: "do-3" },
      { from: "do-3", to: "do-4" },
      { from: "do-4", to: "do-5" }
    ]
  },
  mobile: {
    title: "Mobile Developer",
    nodes: [
      { id: "mob-1", title: "Programming Basics", level: "beginner", description: "JavaScript (React Native) or Dart (Flutter).", resources: [] },
      { id: "mob-2", title: "UI Components", level: "beginner", description: "Layouts, navigation, gesture handling.", resources: [] },
      { id: "mob-3", title: "State Management", level: "intermediate", description: "Redux / Provider / Riverpod.", resources: [] },
      { id: "mob-4", title: "Native APIs", level: "intermediate", description: "Camera, GPS, push notifications, storage.", resources: [] },
      { id: "mob-5", title: "Publishing", level: "advanced", description: "App Store & Play Store deployment, CI/CD.", resources: [] }
    ],
    edges: [
      { from: "mob-1", to: "mob-2" },
      { from: "mob-2", to: "mob-3" },
      { from: "mob-3", to: "mob-4" },
      { from: "mob-4", to: "mob-5" }
    ]
  }
};
