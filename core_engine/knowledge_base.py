from typing import List, Dict, Any

# Tiered Role Definitions
ROLES: Dict[str, List[str]] = {
    "Data Engineer": [
        "Python", "SQL", "Database Concepts", "Data Warehousing", 
        "ETL Pipelines", "Big Data (Apache Spark / PySpark)", 
        "Cloud Platforms (AWS / GCP / Azure)", 
        "Streaming Data (Apache Kafka)", 
        "Data Modeling (Star Schema, Snowflake)", "Projects", "Tools"
    ],
    "Full Stack Developer": [
        "HTML", "CSS", "JavaScript", "Git/GitHub", "Basic Responsive UI",
        "React.js", "Node.js", "Express.js", "MongoDB", "REST APIs", "Authentication"
    ],
    "Data Scientist": [
        "Python", "Pandas", "NumPy", "Data Cleaning", "Visualization (Matplotlib)",
        "Statistics", "Machine Learning", "Scikit-learn", "Feature Engineering", "Real Datasets"
    ],
    "AI/ML Engineer": [
        "Python", "Math Basics", "NumPy/Pandas", "Basic ML Concepts",
        "Machine Learning Algorithms", "Deep Learning", "TensorFlow/PyTorch", "Model Building"
    ],
    "DevOps Engineer": [
        "Python", "Linux Admin & Scripting", "Networking & Security", "Version Control (Git)",
        "Containers (Docker)", "CI/CD Pipelines", "Container Orchestration (Kubernetes)",
        "Cloud Infrastructure", "Infrastructure as Code (Terraform)", "Monitoring (Prometheus & Grafana)"
    ]
}

# Quest Tier Classification
SKILL_TIERS: Dict[str, str] = {
    "Python": "Basic",
    "SQL": "Basic",
    "Database Concepts": "Basic",
    "Data Warehousing": "Intermediate",
    "ETL Pipelines": "Intermediate",
    "Big Data (Apache Spark / PySpark)": "Intermediate",
    "Cloud Platforms (AWS / GCP / Azure)": "Intermediate",
    "Streaming Data (Apache Kafka)": "Intermediate",
    "Data Modeling (Star Schema, Snowflake)": "Intermediate",
    "Projects": "Advanced",
    "Tools": "Advanced",
    "Git": "Basic",
    "HTML": "Basic",
    "CSS": "Basic",
    "JavaScript": "Basic",
    "Git/GitHub": "Basic",
    "Basic Responsive UI": "Basic",
    "React.js": "Intermediate",
    "Node.js": "Intermediate",
    "Express.js": "Intermediate",
    "MongoDB": "Intermediate",
    "REST APIs": "Intermediate",
    "Authentication": "Intermediate",
    "Pandas": "Basic",
    "NumPy": "Basic",
    "Data Cleaning": "Basic",
    "Visualization (Matplotlib)": "Basic",
    "Statistics": "Intermediate",
    "Machine Learning": "Intermediate",
    "Scikit-learn": "Intermediate",
    "Feature Engineering": "Intermediate",
    "Real Datasets": "Intermediate",
    "Math Basics": "Basic",
    "NumPy/Pandas": "Basic",
    "Basic ML Concepts": "Basic",
    "Machine Learning Algorithms": "Intermediate",
    "Deep Learning": "Intermediate",
    "TensorFlow/PyTorch": "Intermediate",
    "Model Building": "Intermediate",
    "DSA": "Intermediate",
    "System Design": "Intermediate",
    "Databases": "Intermediate",
    "React": "Intermediate",
    "Redux": "Intermediate",
    "Linux Admin & Scripting": "Basic",
    "Networking & Security": "Basic",
    "Version Control (Git)": "Basic",
    "Containers (Docker)": "Intermediate",
    "CI/CD Pipelines": "Intermediate",
    "Container Orchestration (Kubernetes)": "Intermediate",
    "Cloud Infrastructure": "Intermediate",
    "Infrastructure as Code (Terraform)": "Advanced",
    "Monitoring (Prometheus & Grafana)": "Advanced"
}

DAG_DEPENDENCIES: Dict[str, List[str]] = {
    "Python": [],
    "SQL": ["Python"],
    "Database Concepts": ["SQL"],
    "Data Warehousing": ["Database Concepts"],
    "ETL Pipelines": ["Data Warehousing", "Python"],
    "Big Data (Apache Spark / PySpark)": ["ETL Pipelines"],
    "Cloud Platforms (AWS / GCP / Azure)": ["Big Data (Apache Spark / PySpark)"],
    "Streaming Data (Apache Kafka)": ["Cloud Platforms (AWS / GCP / Azure)"],
    "Data Modeling (Star Schema, Snowflake)": ["Streaming Data (Apache Kafka)", "Database Concepts"],
    "Projects": ["Data Modeling (Star Schema, Snowflake)", "ETL Pipelines"],
    "Tools": ["Projects"],
    "HTML": [],
    "CSS": ["HTML"],
    "JavaScript": ["CSS"],
    "Git/GitHub": ["JavaScript"],
    "Basic Responsive UI": ["Git/GitHub"],
    "React.js": ["Basic Responsive UI"],
    "Node.js": ["React.js"],
    "Express.js": ["Node.js"],
    "MongoDB": ["Express.js"],
    "REST APIs": ["MongoDB"],
    "Authentication": ["REST APIs"],
    "Pandas": ["Python"],
    "NumPy": ["Pandas"],
    "Data Cleaning": ["NumPy"],
    "Visualization (Matplotlib)": ["Data Cleaning"],
    "Statistics": ["Visualization (Matplotlib)"],
    "Machine Learning": ["Statistics"],
    "Scikit-learn": ["Machine Learning"],
    "Feature Engineering": ["Scikit-learn"],
    "Real Datasets": ["Feature Engineering"],
    "Math Basics": ["Python"],
    "NumPy/Pandas": ["Math Basics"],
    "Basic ML Concepts": ["NumPy/Pandas"],
    "Machine Learning Algorithms": ["Basic ML Concepts"],
    "Deep Learning": ["Machine Learning Algorithms"],
    "TensorFlow/PyTorch": ["Deep Learning"],
    "Model Building": ["TensorFlow/PyTorch"],
    "DSA": ["Python"],
    "Git": [],
    "System Design": ["DSA", "Database Concepts"],
    "Databases": ["SQL"],
    "Linux Admin & Scripting": ["Python"],
    "Networking & Security": ["Linux Admin & Scripting"],
    "Version Control (Git)": ["Networking & Security"],
    "Containers (Docker)": ["Version Control (Git)"],
    "CI/CD Pipelines": ["Containers (Docker)"],
    "Container Orchestration (Kubernetes)": ["CI/CD Pipelines"],
    "Cloud Infrastructure": ["Container Orchestration (Kubernetes)"],
    "Infrastructure as Code (Terraform)": ["Cloud Infrastructure"],
    "Monitoring (Prometheus & Grafana)": ["Infrastructure as Code (Terraform)"]
}

# Quest Milestones & Rewards
MILESTONES: Dict[str, Dict[str, Any]] = {
    "Data Engineer": {
        "Basic": {
            "title": "Data Foundation Architect",
            "description": "You've mastered Python, SQL, and Database Concepts! The foundation is indestructible.",
            "reward": "Crystalline Certificate of Foundation",
            "next_tier": "The Magma Forge",
            "icon": "gem"
        },
        "Intermediate": {
            "title": "Industrial Data Engineer",
            "description": "ETL, Big Data, Cloud, and Modelingâ€”you are now a master of scale.",
            "reward": "Professional Data Engineer Badge",
            "next_tier": "The Apotheosis (Internships)",
            "icon": "flame"
        }
    },
    "Full Stack Developer": {
        "Basic": {
            "title": "Frontend Developer Ready",
            "description": "HTML, CSS, JS, and Gitâ€”the web is your canvas. You can now build any UI!",
            "reward": "Pixel Master Certificate",
            "next_tier": "The Backend Nexus",
            "icon": "gem"
        },
        "Intermediate": {
            "title": "Full Stack Developer Ready",
            "description": "React to Authâ€”you can now build complete, secure, and scalable web applications.",
            "reward": "Full Stack Architect Badge",
            "next_tier": "The Apotheosis (Internships)",
            "icon": "flame"
        }
    },
    "Data Scientist": {
        "Basic": {
            "title": "Data Analyst Ready",
            "description": "Python, Pandas, and Visualizationâ€”you can now turn raw data into powerful insights.",
            "reward": "Insight Voyager Certificate",
            "next_tier": "The Logic Core",
            "icon": "gem"
        },
        "Intermediate": {
            "title": "Data Scientist Ready",
            "description": "Statistics to MLâ€”you can now predict the future and solve complex business problems.",
            "reward": "Senior Data Scientist Badge",
            "next_tier": "The Apotheosis (Internships)",
            "icon": "flame"
        }
    },
    "AI/ML Engineer": {
        "Basic": {
            "title": "ML Beginner Ready",
            "description": "Math and Python basicsâ€”you've taken your first steps into the world of Artificial Intelligence.",
            "reward": "Neuron Initiate Certificate",
            "next_tier": "The Neural Network",
            "icon": "gem"
        },
        "Intermediate": {
            "title": "AI/ML Engineer Ready",
            "description": "Deep Learning to Model Buildingâ€”you can now build autonomous, intelligent systems.",
            "reward": "AI Overlord Badge",
            "next_tier": "The Apotheosis (Internships)",
            "icon": "flame"
        }
    },
    "DevOps Engineer": {
        "Basic": {
            "title": "SysAdmin Initiate",
            "description": "Linux, Networking, and Gitâ€”you have mastered the foundations of the server world.",
            "reward": "Terminal Operator Certificate",
            "next_tier": "The Automation Forge",
            "icon": "gem"
        },
        "Intermediate": {
            "title": "Automation Architect",
            "description": "Docker, CI/CD, and Kubernetesâ€”you can now automate and scale entire infrastructures.",
            "reward": "Cloud Architect Badge",
            "next_tier": "The Apotheosis (Internships)",
            "icon": "flame"
        }
    }
}

# The Apotheosis (Advanced Rewards)
ADVANCED_OFFERS: Dict[str, List[Dict[str, Any]]] = {
    "Data Engineer": [
        {"type": "Certification", "name": "Google Professional Data Engineer", "provider": "Google"},
        {"type": "Certification", "name": "AWS Certified Data Analytics", "provider": "Amazon"},
        {"type": "Internship", "name": "AI Data Pipeline Intern", "company": "Databricks", "location": "Remote"},
        {"type": "Internship", "name": "Machine Learning Data Engineer Intern", "company": "Snowflake", "location": "San Francisco"},
        {"type": "Internship", "name": "Data Engineering Intern", "company": "Google", "location": "Mountain View"},
        {"type": "Internship", "name": "Big Data Intern", "company": "Palantir", "location": "Palo Alto"},
        {"type": "Internship", "name": "AI/ML Infra Intern", "company": "Meta", "location": "New York"}
    ],
    "Full Stack Developer": [
        {"type": "Certification", "name": "AWS Certified Developer", "provider": "Amazon"},
        {"type": "Certification", "name": "Meta Front-End Developer", "provider": "Coursera"},
        {"type": "Internship", "name": "AI Full Stack Engineer Intern", "company": "OpenAI", "location": "San Francisco"},
        {"type": "Internship", "name": "Generative AI Web Developer Intern", "company": "Anthropic", "location": "Remote"},
        {"type": "Internship", "name": "Software Engineering Intern (AI Platform)", "company": "Google", "location": "Mountain View"},
        {"type": "Internship", "name": "Full Stack Intern", "company": "Meta", "location": "New York"},
        {"type": "Internship", "name": "Frontend AI Integrations Intern", "company": "Vercel", "location": "Remote"}
    ],
    "Data Scientist": [
        {"type": "Certification", "name": "Professional Data Scientist", "provider": "DataCamp"},
        {"type": "Certification", "name": "IBM Data Science Professional", "provider": "IBM"},
        {"type": "Internship", "name": "AI/LLM Data Scientist Intern", "company": "Hugging Face", "location": "Remote"},
        {"type": "Internship", "name": "Data Scientist Intern (Algorithms)", "company": "Netflix", "location": "Los Gatos"},
        {"type": "Internship", "name": "Data Analyst Intern", "company": "Spotify", "location": "Remote"},
        {"type": "Internship", "name": "Machine Learning Intern", "company": "Tesla", "location": "Palo Alto"},
        {"type": "Internship", "name": "AI Research Data Intern", "company": "Apple", "location": "Cupertino"}
    ],
    "AI/ML Engineer": [
        {"type": "Certification", "name": "AWS Certified Machine Learning", "provider": "Amazon"},
        {"type": "Certification", "name": "Azure AI Engineer Associate", "provider": "Microsoft"},
        {"type": "Internship", "name": "AI Research Intern", "company": "OpenAI", "location": "San Francisco"},
        {"type": "Internship", "name": "Deep Learning Intern", "company": "NVIDIA", "location": "Remote"},
        {"type": "Internship", "name": "Machine Learning Engineer Intern", "company": "Google Brain", "location": "Mountain View"},
        {"type": "Internship", "name": "Applied AI Intern", "company": "Meta FAIR", "location": "New York"},
        {"type": "Internship", "name": "GenAI Models Intern", "company": "Anthropic", "location": "Remote"}
    ],
    "DevOps Engineer": [
        {"type": "Certification", "name": "Certified Kubernetes Administrator (CKA)", "provider": "CNCF"},
        {"type": "Certification", "name": "AWS Certified DevOps Engineer", "provider": "Amazon"},
        {"type": "Internship", "name": "MLOps & Cloud Infrastructure Intern", "company": "AWS", "location": "Seattle"},
        {"type": "Internship", "name": "Site Reliability Intern (AI Systems)", "company": "Datadog", "location": "Remote"},
        {"type": "Internship", "name": "DevOps Intern", "company": "GitLab", "location": "Remote"},
        {"type": "Internship", "name": "Kubernetes Engineering Intern", "company": "Google Cloud", "location": "Mountain View"},
        {"type": "Internship", "name": "Infrastructure Automation Intern", "company": "HashiCorp", "location": "Remote"}
    ]
}

SKILL_DESCRIPTIONS: Dict[str, str] = {
    "Python": "The Swiss Army knife of programming. Essential for data processing, automation, and AI development.",
    "SQL": "The language of data. Core skill ðŸ’¯ for managing and querying relational databases.",
    "Database Concepts": "MySQL, PostgreSQL, and Indexing. Master the foundations of how data is stored and retrieved.",
    "Data Warehousing": "ETL, OLAP vs OLTP. Learn to architect modern data repositories for analytics.",
    "ETL Pipelines": "Apache Airflow + DAG. The heartbeat of data engineeringâ€”automation of data flows.",
    "Big Data (Apache Spark / PySpark)": "Apache Spark / PySpark. Process massive datasets at scale with distributed computing.",
    "Cloud Platforms (AWS / GCP / Azure)": "AWS / GCP / Azure. Deploy and manage data infrastructure in the cloud.",
    "Streaming Data (Apache Kafka)": "Apache Kafka. Handle real-time event streams with low latency and high throughput.",
    "Data Modeling (Star Schema, Snowflake)": "Star Schema & Snowflake. Design optimal data structures for business intelligence.",
    "Projects": "ðŸ”¥ MOST IMPORTANT. Apply your skills to real-world datasets and build a portfolio.",
    "Tools": "Git, Linux, Docker. Professional tools every engineer needs in their arsenal.",
    "HTML": "The skeleton of the web. Every website starts hereâ€”structure your content for the digital world.",
    "CSS": "The art of layout. Transform plain HTML into stunning, responsive user interfaces.",
    "JavaScript": "The dynamic engine. Make your websites interactive, from animations to complex web apps.",
    "React": "Component-based UI. The most popular library for building modern, high-performance web applications.",
    "DSA": "Problem solving 101. Master the algorithms and data structures needed for world-class efficiency.",
    "System Design": "The big picture. Learn how to architect scalable systems like Netflix or Uber.",
    "Git": "Version control. The time machine for your codeâ€”collaborate with teams without losing history.",
    "Git/GitHub": "Master the art of collaborative development. Push, pull, and branch like a pro.",
    "Basic Responsive UI": "Build websites that look stunning on any deviceâ€”mobile, tablet, or desktop.",
    "React.js": "The most powerful library for building interactive user interfaces with components.",
    "Node.js": "Run JavaScript on the server. The engine behind high-performance backend systems.",
    "Express.js": "The minimalist web framework for Node.js. Build APIs and web servers with ease.",
    "MongoDB": "The leading NoSQL database. Store data in flexible, JSON-like documents.",
    "REST APIs": "The bridge between frontend and backend. Design clean, scalable communication layers.",
    "Authentication": "Secure your apps with JWT, OAuth, and sessions. Protect user data like a fortress.",
    "Pandas": "The power-house of data manipulation. Slice and dice massive datasets with ease.",
    "NumPy": "Numerical Python. The foundation of scientific computing and array processing.",
    "Data Cleaning": "The unsexy but vital part of DS. Handle missing values and outliers to ensure data quality.",
    "Visualization (Matplotlib)": "Turn numbers into stories. Create beautiful plots and charts to communicate insights.",
    "Statistics": "The language of probability. Understand distributions, hypothesis testing, and p-values.",
    "Machine Learning": "Teach computers to learn from data. predictive modeling at its core.",
    "Scikit-learn": "The industry standard for ML in Python. Implement algorithms with clean, consistent code.",
    "Feature Engineering": "The art of data. Create meaningful inputs to boost your model's predictive power.",
    "Real Datasets": "ðŸ”¥ FIELD EXPERIENCE. Work on Kaggle-style challenges and real-world messy data.",
    "Math Basics": "Calculus, Linear Algebra, and Probabilityâ€”the hidden engines of AI.",
    "NumPy/Pandas": "Essential data tools for ML engineers. Process tensors and dataframes.",
    "Basic ML Concepts": "Understand Supervised vs Unsupervised learning and the ML lifecycle.",
    "Machine Learning Algorithms": "Master Regression, Classification, Clustering, and Ensemble methods.",
    "Deep Learning": "Explore Neural Networks and the power of multi-layered intelligence.",
    "TensorFlow/PyTorch": "The titans of AI frameworks. Build and train complex neural architectures.",
    "Model Building": "The final stageâ€”architect, train, and deploy your very own AI models.",
    "Linux Admin & Scripting": "The OS of the cloud. Master the command line, bash scripting, and system administration.",
    "Networking & Security": "Understand how the internet works: TCP/IP, DNS, SSL, and securing web traffic.",
    "Version Control (Git)": "The foundation of collaboration. Branching, merging, and managing code history.",
    "Containers (Docker)": "Package your applications into portable, isolated containers that run anywhere.",
    "CI/CD Pipelines": "Automate everything. Build, test, and deploy applications seamlessly.",
    "Container Orchestration (Kubernetes)": "Manage thousands of containers. The ultimate tool for scaling and self-healing.",
    "Cloud Infrastructure": "Design and manage virtual networks, compute instances, and storage in the cloud.",
    "Infrastructure as Code (Terraform)": "Write code to provision your entire cloud infrastructure. Reproducible and versioned.",
    "Monitoring (Prometheus & Grafana)": "Keep the systems alive. Set up alerts, dashboards, and observe system health."
}

SKILL_DETAILS: Dict[str, Dict[str, str]] = {
    "Python": {
        "paragraph": "Python is a high-level, general-purpose programming language known for its simple, human-like syntax. Indispensable for data science, machine learning, and automation.",
        "gfg_link": "https://www.geeksforgeeks.org/python-programming-language/"
    },
    "SQL": {
        "paragraph": "SQL (Structured Query Language) is the standard language for accessing and manipulating databases. It is a CORE SKILL for any data professional.",
        "gfg_link": "https://www.geeksforgeeks.org/sql-tutorial/"
    },
    "Database Concepts": {
        "paragraph": "Master MySQL, PostgreSQL, and the critical art of Database Indexing to optimize query performance and ensure data integrity.",
        "gfg_link": "https://www.geeksforgeeks.org/dbms/"
    },
    "Data Warehousing": {
        "paragraph": "Explore Data Warehousing concepts including the differences between OLAP and OLTP systems, and how to build central repositories for business data.",
        "gfg_link": "https://www.geeksforgeeks.org/data-warehousing/"
    },
    "ETL Pipelines": {
        "paragraph": "Learn to build robust ETL (Extract, Transform, Load) pipelines using Apache Airflow. Understand DAGs (Directed Acyclic Graphs) for workflow orchestration.",
        "gfg_link": "https://www.geeksforgeeks.org/etl-process-in-data-warehouse/"
    },
    "Big Data (Apache Spark / PySpark)": {
        "paragraph": "Dive into the world of Big Data with Apache Spark and PySpark. Learn distributed processing of massive datasets across clusters.",
        "gfg_link": "https://www.geeksforgeeks.org/apache-spark/"
    },
    "Cloud Platforms (AWS / GCP / Azure)": {
        "paragraph": "Master the clouds: AWS, GCP, and Azure. Understand how to deploy scalable data solutions and leverage managed services.",
        "gfg_link": "https://www.geeksforgeeks.org/cloud-computing/"
    },
    "Streaming Data (Apache Kafka)": {
        "paragraph": "Handle real-time data with Apache Kafka. Learn about producer-consumer models and low-latency event streaming.",
        "gfg_link": "https://www.geeksforgeeks.org/apache-kafka/"
    },
    "Data Modeling (Star Schema, Snowflake)": {
        "paragraph": "Design efficient data architectures using Star Schema and Snowflake Schema. Learn to transform raw data into optimized models for BI.",
        "gfg_link": "https://www.geeksforgeeks.org/data-modeling-in-dbms/"
    },
    "Projects": {
        "paragraph": "ðŸ”¥ MOST IMPORTANT phase. Build end-to-end data pipelines, perform complex analysis, and document your work for your portfolio.",
        "gfg_link": "https://www.geeksforgeeks.org/data-engineering-projects/"
    },
    "Tools": {
        "paragraph": "Master the essential developer tools: Git for version control, Linux for server management, and Docker for containerization.",
        "gfg_link": "https://www.geeksforgeeks.org/introduction-to-docker/"
    },
    "HTML": {
        "paragraph": "The foundation of web development. Structure your content with semantic tags.",
        "gfg_link": "https://www.geeksforgeeks.org/html-tutorial/"
    },
    "CSS": {
        "paragraph": "Style the web. Master Flexbox, Grid, and responsive design.",
        "gfg_link": "https://www.geeksforgeeks.org/css-tutorial/"
    },
    "JavaScript": {
        "paragraph": "The engine of interactivity. Learn ES6+, Async/Await, and DOM manipulation.",
        "gfg_link": "https://www.geeksforgeeks.org/javascript/"
    },
    "React": {
        "paragraph": "Component-based UI development with hooks and state management.",
        "gfg_link": "https://www.geeksforgeeks.org/react/"
    },
    "DSA": {
        "paragraph": "Master algorithms and data structures for efficient problem solving.",
        "gfg_link": "https://www.geeksforgeeks.org/data-structures/"
    },
    "System Design": {
        "paragraph": "Architect scalable, reliable systems like Netflix or Uber.",
        "gfg_link": "https://www.geeksforgeeks.org/system-design-tutorial/"
    },
    "Git": {
        "paragraph": "Collaborative version control with branch management and pull requests.",
        "gfg_link": "https://www.geeksforgeeks.org/git-tutorial/"
    },
    "Redux": {
        "paragraph": "Predictable state management for complex JavaScript applications.",
        "gfg_link": "https://www.geeksforgeeks.org/redux/"
    },
    "Databases": {
        "paragraph": "Master relational database management systems and SQL.",
        "gfg_link": "https://www.geeksforgeeks.org/dbms/"
    },
    "Git/GitHub": {
        "paragraph": "Master version control with Git and collaboration with GitHub. Learn about branching, merging, and pull requests.",
        "gfg_link": "https://www.geeksforgeeks.org/git-tutorial/"
    },
    "Basic Responsive UI": {
        "paragraph": "Learn to design websites that adapt to any screen size using CSS Flexbox, Grid, and Media Queries.",
        "gfg_link": "https://www.geeksforgeeks.org/responsive-web-design-tutorials/"
    },
    "React.js": {
        "paragraph": "Build modern UIs with React. Master components, props, state, and the Virtual DOM.",
        "gfg_link": "https://www.geeksforgeeks.org/reactjs-tutorials/"
    },
    "Node.js": {
        "paragraph": "Use JavaScript for server-side programming. Understand the event loop and non-blocking I/O.",
        "gfg_link": "https://www.geeksforgeeks.org/nodejs/"
    },
    "Express.js": {
        "paragraph": "Build web applications and APIs quickly with Express. Master middleware and routing.",
        "gfg_link": "https://www.geeksforgeeks.org/express-js/"
    },
    "MongoDB": {
        "paragraph": "Store data in a flexible NoSQL format. Learn about collections, documents, and indexing.",
        "gfg_link": "https://www.geeksforgeeks.org/mongodb-tutorial/"
    },
    "REST APIs": {
        "paragraph": "Design and consume Representational State Transfer APIs for seamless frontend-backend communication.",
        "gfg_link": "https://www.geeksforgeeks.org/rest-api-introduction/"
    },
    "Authentication": {
        "paragraph": "Implement secure user login systems using JWT (JSON Web Tokens), cookies, and hashing.",
        "gfg_link": "https://www.geeksforgeeks.org/user-authentication-in-nodejs/"
    },
    "Pandas": {
        "paragraph": "Handle dataframes and series. Perform complex data analysis and transformation with Python's most popular data library.",
        "gfg_link": "https://www.geeksforgeeks.org/pandas-tutorial/"
    },
    "NumPy": {
        "paragraph": "Master multi-dimensional arrays and mathematical functions for scientific computing.",
        "gfg_link": "https://www.geeksforgeeks.org/numpy-tutorial/"
    },
    "Data Cleaning": {
        "paragraph": "Pre-process your data by handling null values, handling skewed data, and identifying outliers.",
        "gfg_link": "https://www.geeksforgeeks.org/data-cleansing-introduction/"
    },
    "Visualization (Matplotlib)": {
        "paragraph": "Create static, animated, and interactive visualizations in Python with Matplotlib and Seaborn.",
        "gfg_link": "https://www.geeksforgeeks.org/data-visualization-with-python/"
    },
    "Statistics": {
        "paragraph": "Understand the mathematical foundations of data science, from probability theory to linear regression.",
        "gfg_link": "https://www.geeksforgeeks.org/mathematics-for-data-science/"
    },
    "Machine Learning": {
        "paragraph": "Build predictive models. Learn about Supervised, Unsupervised, and Reinforcement learning.",
        "gfg_link": "https://www.geeksforgeeks.org/machine-learning/"
    },
    "Scikit-learn": {
        "paragraph": "Implement machine learning algorithms including classification, regression, and clustering efficiently.",
        "gfg_link": "https://www.geeksforgeeks.org/getting-started-with-scikit-learn/"
    },
    "Feature Engineering": {
        "paragraph": "Transform raw data into meaningful features that improve the performance of machine learning models.",
        "gfg_link": "https://www.geeksforgeeks.org/feature-engineering-for-machine-learning/"
    },
    "Real Datasets": {
        "paragraph": "Apply your skills to real-world datasets from Kaggle and other sources to build a robust portfolio.",
        "gfg_link": "https://www.geeksforgeeks.org/data-science-projects/"
    },
    "Math Basics": {
        "paragraph": "Master the essential linear algebra, calculus, and probability concepts required for AI.",
        "gfg_link": "https://www.geeksforgeeks.org/mathematics-for-machine-learning/"
    },
    "NumPy/Pandas": {
        "paragraph": "Master the data processing tools specifically for high-performance AI and ML workflows.",
        "gfg_link": "https://www.geeksforgeeks.org/numpy-and-pandas-for-machine-learning/"
    },
    "Basic ML Concepts": {
        "paragraph": "Understand the core concepts of AI/ML: bias-variance tradeoff, overfitting, and the training pipeline.",
        "gfg_link": "https://www.geeksforgeeks.org/introduction-to-machine-learning/"
    },
    "Machine Learning Algorithms": {
        "paragraph": "Deep dive into algorithms like Decision Trees, SVMs, and XGBoost.",
        "gfg_link": "https://www.geeksforgeeks.org/machine-learning-algorithms/"
    },
    "Deep Learning": {
        "paragraph": "Learn about Artificial Neural Networks (ANNs), CNNs for vision, and RNNs for sequence data.",
        "gfg_link": "https://www.geeksforgeeks.org/introduction-deep-learning/"
    },
    "TensorFlow/PyTorch": {
        "paragraph": "Build and train complex neural networks using the most popular deep learning frameworks.",
        "gfg_link": "https://www.geeksforgeeks.org/introduction-to-tensorflow/"
    },
    "Model Building": {
        "paragraph": "Architect, train, evaluate, and deploy production-ready AI models.",
        "gfg_link": "https://www.geeksforgeeks.org/steps-to-build-a-machine-learning-model/"
    },
    "Linux Admin & Scripting": {
        "paragraph": "Linux is the operating system that powers the internet and the cloud. Master the terminal, file permissions, and bash scripting.",
        "gfg_link": "https://www.geeksforgeeks.org/linux-tutorial/"
    },
    "Networking & Security": {
        "paragraph": "Understand the OSI model, IP addressing, DNS, subnets, and HTTP/HTTPS. Security is paramount in infrastructure design.",
        "gfg_link": "https://www.geeksforgeeks.org/computer-network-tutorials/"
    },
    "Version Control (Git)": {
        "paragraph": "Git is the industry standard for version control. Master repositories, branching strategies, and resolving conflicts.",
        "gfg_link": "https://www.geeksforgeeks.org/git-tutorial/"
    },
    "Containers (Docker)": {
        "paragraph": "Docker revolutionizes development by packaging applications and dependencies into standardized containers for deployment.",
        "gfg_link": "https://www.geeksforgeeks.org/introduction-to-docker/"
    },
    "CI/CD Pipelines": {
        "paragraph": "Continuous Integration and Continuous Deployment (CI/CD) automates the software release process. Use tools like GitHub Actions or Jenkins.",
        "gfg_link": "https://www.geeksforgeeks.org/what-is-cicd/"
    },
    "Container Orchestration (Kubernetes)": {
        "paragraph": "Kubernetes automatically deploys, scales, and manages containerized applications across clusters of hosts.",
        "gfg_link": "https://www.geeksforgeeks.org/kubernetes/"
    },
    "Cloud Infrastructure": {
        "paragraph": "Build virtual infrastructure using AWS, GCP, or Azure. Learn about VPCs, load balancers, and resilient architectures.",
        "gfg_link": "https://www.geeksforgeeks.org/cloud-computing/"
    },
    "Infrastructure as Code (Terraform)": {
        "paragraph": "Use Terraform to write declarative configuration files that define your cloud infrastructure, allowing for versioned deployments.",
        "gfg_link": "https://www.geeksforgeeks.org/introduction-to-terraform/"
    },
    "Monitoring (Prometheus & Grafana)": {
        "paragraph": "Implement observability to track system health. Use Prometheus for metrics collection and Grafana for visualization.",
        "gfg_link": "https://www.geeksforgeeks.org/what-is-grafana/"
    }
}

from core_engine.content_mapping import CONTENT_MAPPING  # noqa â€“ enriched per-skill recommendations
