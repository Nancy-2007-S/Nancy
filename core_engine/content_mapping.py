from typing import Dict, Any

CONTENT_MAPPING: Dict[str, Dict[str, Any]] = {
    # ===== DATA ENGINEER =====
    "Python": {
        "courses": [
            {"name": "Python for Everybody (Full Course)", "url": "https://www.youtube.com/embed/8DvywoWv6fI", "type": "video"},
            {"name": "Automate the Boring Stuff with Python", "url": "https://www.youtube.com/embed/1F_OgqRuSdI", "type": "video"},
            {"name": "Python Bootcamp on Udemy", "url": "https://www.udemy.com/course/complete-python-bootcamp/", "type": "udemy"}
        ],
        "projects": ["CLI Weather App using OpenWeatherAPI", "Web Scraper for Job Listings", "Automated PDF Report Generator"],
        "related": ["Pandas", "NumPy", "FastAPI", "Requests"]
    },
    "SQL": {
        "courses": [
            {"name": "SQL Full Course – freeCodeCamp", "url": "https://www.youtube.com/embed/HXV3zeQKqGY", "type": "video"},
            {"name": "MySQL Crash Course", "url": "https://www.youtube.com/embed/7S_tz1z_5bA", "type": "video"},
            {"name": "The Complete SQL Bootcamp (Udemy)", "url": "https://www.udemy.com/course/the-complete-sql-bootcamp/", "type": "udemy"}
        ],
        "projects": ["Sales Database with Aggregations & CTEs", "Hospital Management Schema (3NF)", "Leaderboard with Window Functions"],
        "related": ["PostgreSQL", "MySQL", "JOINs", "Indexes", "Query Optimization"]
    },
    "Database Concepts": {
        "courses": [
            {"name": "MySQL Full Course for Beginners", "url": "https://www.youtube.com/embed/QziwC_ltqyA", "type": "video"},
            {"name": "PostgreSQL Tutorial", "url": "https://www.youtube.com/embed/-VO7YjQeG6Y", "type": "video"},
            {"name": "Database Design & Management (Udemy)", "url": "https://www.udemy.com/course/database-design-and-management/", "type": "udemy"}
        ],
        "projects": ["Library Management System", "E-Commerce Schema (3NF)", "Indexing Performance Lab"],
        "related": ["ACID", "Normalization", "Transactions", "Views", "Stored Procedures"]
    },
    "Data Warehousing": {
        "courses": [
            {"name": "Data Warehousing Tutorial", "url": "https://www.youtube.com/embed/J326LIUrZM8", "type": "video"},
            {"name": "Snowflake for Beginners", "url": "https://www.youtube.com/embed/9PBvVeCQi0w", "type": "video"},
            {"name": "Data Warehouse Fundamentals (Udemy)", "url": "https://www.udemy.com/course/data-warehouse-fundamentals-for-beginners/", "type": "udemy"}
        ],
        "projects": ["Retail Sales Data Warehouse on Snowflake", "BI Dashboard with OLAP Cubes", "Slowly Changing Dimensions (SCD Type 2)"],
        "related": ["Snowflake", "BigQuery", "Redshift", "dbt", "OLAP"]
    },
    "ETL Pipelines": {
        "courses": [
            {"name": "Apache Airflow Tutorial", "url": "https://www.youtube.com/embed/D18PQG7Ae34", "type": "video"},
            {"name": "ETL Pipeline with Python", "url": "https://www.youtube.com/embed/dB0d4UikuZQ", "type": "video"},
            {"name": "The Complete Airflow Course (Udemy)", "url": "https://www.udemy.com/course/the-complete-hands-on-course-to-master-apache-airflow/", "type": "udemy"}
        ],
        "projects": ["COVID Dataset ETL to PostgreSQL", "Automated Stock Price Pipeline with Airflow", "Wikipedia Scraper + DAG Orchestration"],
        "related": ["Apache Airflow", "Prefect", "Luigi", "dbt", "Cron"]
    },
    "Big Data (Apache Spark / PySpark)": {
        "courses": [
            {"name": "Apache Spark with PySpark – Full Course", "url": "https://www.youtube.com/embed/wNRjR6Cds5s", "type": "video"},
            {"name": "Databricks & Spark Fundamentals", "url": "https://www.youtube.com/embed/9mELEARcxJo", "type": "video"},
            {"name": "Taming Big Data with Spark (Udemy)", "url": "https://www.udemy.com/course/taming-big-data-with-apache-spark-hands-on/", "type": "udemy"}
        ],
        "projects": ["Movie Recommendation Engine with MLlib", "Twitter Sentiment with Spark Streaming", "E-Commerce Click Analysis on S3"],
        "related": ["Databricks", "Delta Lake", "HDFS", "Hive", "Parquet"]
    },
    "Cloud Platforms (AWS / GCP / Azure)": {
        "courses": [
            {"name": "AWS Cloud Practitioner Full Course", "url": "https://www.youtube.com/embed/SOTamWNgDKc", "type": "video"},
            {"name": "GCP Associate Cloud Engineer", "url": "https://www.youtube.com/embed/jpno8FSqpc8", "type": "video"},
            {"name": "AWS Solutions Architect (Udemy)", "url": "https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/", "type": "udemy"}
        ],
        "projects": ["Deploy a Flask App to AWS EC2", "Serverless Data Pipeline on GCP Cloud Functions", "Azure Data Lake + Synapse Analytics"],
        "related": ["S3", "Lambda", "IAM", "BigQuery", "Azure Data Factory"]
    },
    "Streaming Data (Apache Kafka)": {
        "courses": [
            {"name": "Apache Kafka Crash Course", "url": "https://www.youtube.com/embed/uvb00oaa3k8", "type": "video"},
            {"name": "Kafka for Beginners", "url": "https://www.youtube.com/embed/06iRM1Ghr1k", "type": "video"},
            {"name": "Apache Kafka Series (Udemy)", "url": "https://www.udemy.com/course/apache-kafka/", "type": "udemy"}
        ],
        "projects": ["Real-Time Ride Sharing Event Bus", "IoT Sensor Stream: Kafka → S3", "Log Aggregation with Kafka Connect"],
        "related": ["Kafka Connect", "ksqlDB", "Schema Registry", "Apache Flink"]
    },
    "Data Modeling (Star Schema, Snowflake)": {
        "courses": [
            {"name": "Star & Snowflake Schema Explained", "url": "https://www.youtube.com/embed/hQvCOBv_-LE", "type": "video"},
            {"name": "dbt Core Tutorial", "url": "https://www.youtube.com/embed/5rNquRnNb4E", "type": "video"},
            {"name": "Modern Data Modeling with dbt (Udemy)", "url": "https://www.udemy.com/course/complete-dbt-data-build-tool-bootcamp-zero-to-hero-learn-dbt/", "type": "udemy"}
        ],
        "projects": ["Sales Fact + Dim Model in Snowflake", "SCD Type 2 Implementation", "dbt Model for Shopify Analytics"],
        "related": ["dbt", "Kimball Methodology", "Fact Tables", "Conformed Dimensions"]
    },
    "Projects": {
        "courses": [
            {"name": "End-to-End Data Engineering Projects", "url": "https://www.youtube.com/embed/yZKJFKu49Dk", "type": "video"},
            {"name": "GitHub Portfolio Best Practices", "url": "https://www.youtube.com/embed/G-EGDH50hGE", "type": "video"},
            {"name": "Data Engineering Zoomcamp (Free)", "url": "https://github.com/DataTalksClub/data-engineering-zoomcamp", "type": "udemy"}
        ],
        "projects": ["NYC Taxi Analytics Pipeline (Airflow + BigQuery)", "Reddit API → PostgreSQL Dashboard", "API → Metabase BI Dashboard"],
        "related": ["GitHub", "Docker Compose", "Terraform", "Looker Studio"]
    },
    "Tools": {
        "courses": [
            {"name": "Git & GitHub Full Course", "url": "https://www.youtube.com/embed/RGOj5yH7evk", "type": "video"},
            {"name": "Docker for Beginners", "url": "https://www.youtube.com/embed/pTFZFxd4hOI", "type": "video"},
            {"name": "Linux Command Line Bootcamp (Udemy)", "url": "https://www.udemy.com/course/the-linux-command-line-bootcamp/", "type": "udemy"}
        ],
        "projects": ["Containerize a Python ETL Pipeline", "Docker Compose: API + DB + Redis", "Bash Server Monitoring Script"],
        "related": ["Bash", "Makefile", "VS Code", "Jupyter Notebooks"]
    },
    # ===== FULL STACK DEVELOPER =====
    "HTML": {
        "courses": [
            {"name": "HTML Full Course – Build Websites", "url": "https://www.youtube.com/embed/mbeT8mpmtHA", "type": "video"},
            {"name": "HTML5 Semantic Tags Deep Dive", "url": "https://www.youtube.com/embed/qz0aGYrrlhU", "type": "video"},
            {"name": "Web Developer Bootcamp (Udemy)", "url": "https://www.udemy.com/course/the-web-developer-bootcamp/", "type": "udemy"}
        ],
        "projects": ["Personal Resume/Portfolio Page", "HTML News Blog with Image Gallery", "Accessible Semantic Web Page"],
        "related": ["HTML5 Forms", "SEO Tags", "Semantic Elements", "canvas"]
    },
    "CSS": {
        "courses": [
            {"name": "CSS Full Course including Flexbox", "url": "https://www.youtube.com/embed/OXGznpKZ_sA", "type": "video"},
            {"name": "CSS Grid & Flexbox Crash Course", "url": "https://www.youtube.com/embed/t6CBKf8K_Ac", "type": "video"},
            {"name": "Advanced CSS & Sass (Udemy)", "url": "https://www.udemy.com/course/advanced-css-and-sass/", "type": "udemy"}
        ],
        "projects": ["Spotify-Clone Dark UI", "Animated Pricing Card Set", "Glassmorphic Dashboard Layout"],
        "related": ["SCSS/SASS", "CSS Variables", "Animations", "Tailwind CSS"]
    },
    "JavaScript": {
        "courses": [
            {"name": "JavaScript Full Course for Beginners", "url": "https://www.youtube.com/embed/ajdRvxDWH4w", "type": "video"},
            {"name": "JavaScript: Understanding the Weird Parts", "url": "https://www.youtube.com/embed/Bv_5Zv5c-Ts", "type": "video"},
            {"name": "The Complete JavaScript Course (Udemy)", "url": "https://www.udemy.com/course/the-complete-javascript-course/", "type": "udemy"}
        ],
        "projects": ["Drag-and-Drop To-Do App", "Real-Time Weather Dashboard (API)", "Infinite Scroll Blog with localStorage"],
        "related": ["ES6+", "Async/Await", "DOM API", "Fetch API", "LocalStorage"]
    },
    "Git/GitHub": {
        "courses": [
            {"name": "Git & GitHub Crash Course", "url": "https://www.youtube.com/embed/RGOj5yH7evk", "type": "video"},
            {"name": "Git Branching Strategies", "url": "https://www.youtube.com/embed/aKKNUd-OoE4", "type": "video"},
            {"name": "Git Complete (Udemy)", "url": "https://www.udemy.com/course/git-complete/", "type": "udemy"}
        ],
        "projects": ["Open Source GitHub Contribution", "Multi-Branch Feature Workflow Setup", "Git Hooks for Pre-Commit Linting"],
        "related": ["Pull Requests", "GitHub Actions", "GitFlow", "Forking"]
    },
    "Basic Responsive UI": {
        "courses": [
            {"name": "Responsive Web Design Tutorial", "url": "https://www.youtube.com/embed/HoKD1qIcchQ", "type": "video"},
            {"name": "CSS Flexbox in 15 Minutes", "url": "https://www.youtube.com/embed/fYq5PXgSsbE", "type": "video"},
            {"name": "Responsive Design Masterclass (Udemy)", "url": "https://www.udemy.com/course/responsive-web-design-with-html5-and-css3-intermediate/", "type": "udemy"}
        ],
        "projects": ["Mobile-First Portfolio Website", "E-Commerce Product Card Grid", "Responsive Navbar with Hamburger Menu"],
        "related": ["Media Queries", "Viewport Units", "clamp()", "Bootstrap"]
    },
    "React.js": {
        "courses": [
            {"name": "React Full Course 2024", "url": "https://www.youtube.com/embed/bMknfKXIFA8", "type": "video"},
            {"name": "React in 100 Seconds", "url": "https://www.youtube.com/embed/Tn6-PIqc4UM", "type": "video"},
            {"name": "React – The Complete Guide (Udemy)", "url": "https://www.udemy.com/course/react-the-complete-guide-incl-redux/", "type": "udemy"}
        ],
        "projects": ["Task Manager with Context API", "Real-Time Chat UI with Firebase", "Movie Search App with TMDB API"],
        "related": ["React Hooks", "useState/useEffect", "Context API", "React Router", "Vite"]
    },
    "Node.js": {
        "courses": [
            {"name": "Node.js Crash Course", "url": "https://www.youtube.com/embed/TlB_eWDSMt4", "type": "video"},
            {"name": "Build REST APIs with Node.js", "url": "https://www.youtube.com/embed/l8WPWK9mS5M", "type": "video"},
            {"name": "NodeJS – The Complete Guide (Udemy)", "url": "https://www.udemy.com/course/nodejs-the-complete-guide/", "type": "udemy"}
        ],
        "projects": ["CLI Notes App with File System", "Real-Time Chat Server with Socket.io", "JWT Auth REST API with Express"],
        "related": ["NPM", "EventEmitter", "Streams", "File System API"]
    },
    "Express.js": {
        "courses": [
            {"name": "Express.js Crash Course", "url": "https://www.youtube.com/embed/SccSCuHhOw0", "type": "video"},
            {"name": "REST API with Express + MongoDB", "url": "https://www.youtube.com/embed/-MTSQjw5DrM", "type": "video"},
            {"name": "Node & Express Bootcamp (Udemy)", "url": "https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/", "type": "udemy"}
        ],
        "projects": ["Blog API with MongoDB", "E-Commerce Backend with Stripe", "Middleware Chain for Auth + Rate Limiting"],
        "related": ["Middleware", "Routing", "CORS", "Helmet.js", "Morgan"]
    },
    "MongoDB": {
        "courses": [
            {"name": "MongoDB Crash Course", "url": "https://www.youtube.com/embed/ofme2o29ngU", "type": "video"},
            {"name": "MongoDB Atlas + Aggregation Tutorial", "url": "https://www.youtube.com/embed/-bt_y4Loofg", "type": "video"},
            {"name": "MongoDB – The Complete Guide (Udemy)", "url": "https://www.udemy.com/course/mongodb-the-complete-developers-guide/", "type": "udemy"}
        ],
        "projects": ["User Auth System with Mongoose", "Blog Platform with Nested Comments", "Atlas Full-Text Search Integration"],
        "related": ["Mongoose", "Aggregation Pipeline", "Atlas", "Indexes"]
    },
    "REST APIs": {
        "courses": [
            {"name": "What is a REST API?", "url": "https://www.youtube.com/embed/GZvSYJDk-us", "type": "video"},
            {"name": "Build a REST API from Scratch", "url": "https://www.youtube.com/embed/fgTGADljAeg", "type": "video"},
            {"name": "REST API with Flask & Python (Udemy)", "url": "https://www.udemy.com/course/rest-api-flask-and-python/", "type": "udemy"}
        ],
        "projects": ["Social Media API with CRUD + Pagination", "File Upload API with Multer", "Versioned API with Rate Limiting"],
        "related": ["OpenAPI/Swagger", "Postman", "JSON", "HTTP Status Codes", "Pagination"]
    },
    "Authentication": {
        "courses": [
            {"name": "JWT Authentication Tutorial", "url": "https://www.youtube.com/embed/mbsmsi7l3r4", "type": "video"},
            {"name": "OAuth 2.0 Explained", "url": "https://www.youtube.com/embed/t18YB3xDfXI", "type": "video"},
            {"name": "Web Security & Auth (Udemy)", "url": "https://www.udemy.com/course/the-complete-web-developer-zero-to-mastery/", "type": "udemy"}
        ],
        "projects": ["JWT Login with Refresh Token Rotation", "Google OAuth with Passport.js", "Role-Based Access Control (RBAC) System"],
        "related": ["JWT", "bcrypt", "OAuth 2.0", "Passport.js", "Sessions vs Tokens"]
    },
    # ===== DATA SCIENTIST =====
    "Pandas": {
        "courses": [
            {"name": "Pandas Full Course", "url": "https://www.youtube.com/embed/vmEHCJofslg", "type": "video"},
            {"name": "Pandas for Data Science", "url": "https://www.youtube.com/embed/dcqPhpY7tWk", "type": "video"},
            {"name": "Data Analysis with Pandas (Udemy)", "url": "https://www.udemy.com/course/data-analysis-with-pandas/", "type": "udemy"}
        ],
        "projects": ["E-Commerce Sales Analysis Dashboard", "COVID-19 Dataset EDA Report", "Netflix Trends Analysis"],
        "related": ["groupby()", "merge()", "pivot_table()", "read_csv()", "apply()"]
    },
    "NumPy": {
        "courses": [
            {"name": "NumPy Full Course", "url": "https://www.youtube.com/embed/QUT1VHiLmmI", "type": "video"},
            {"name": "NumPy for Data Science", "url": "https://www.youtube.com/embed/8Y0qQEh7dJg", "type": "video"},
            {"name": "Python for DS & ML Bootcamp (Udemy)", "url": "https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/", "type": "udemy"}
        ],
        "projects": ["Image Processing with NumPy", "Monte Carlo Simulation", "Matrix Multiplication from Scratch"],
        "related": ["Broadcasting", "ndarray", "Linear Algebra", "scipy", "random module"]
    },
    "Data Cleaning": {
        "courses": [
            {"name": "Data Cleaning in Python", "url": "https://www.youtube.com/embed/E3fzr21cxCY", "type": "video"},
            {"name": "Handling Missing Data Strategies", "url": "https://www.youtube.com/embed/MK4bwVAqOgU", "type": "video"},
            {"name": "Data Wrangling with Python (Udemy)", "url": "https://www.udemy.com/course/data-wrangling-with-python/", "type": "udemy"}
        ],
        "projects": ["Clean & Merge a Dirty Country Dataset", "Outlier Detection Pipeline", "Healthcare Dataset Imputation Lab"],
        "related": ["fillna()", "dropna()", "regex", "IQR method", "StandardScaler"]
    },
    "Visualization (Matplotlib)": {
        "courses": [
            {"name": "Matplotlib Tutorial", "url": "https://www.youtube.com/embed/q7Bo_J8x_dw", "type": "video"},
            {"name": "Seaborn Visual Data Analysis", "url": "https://www.youtube.com/embed/6GUZXDef2U0", "type": "video"},
            {"name": "Python for Data Visualization (Udemy)", "url": "https://www.udemy.com/course/python-for-data-visualization/", "type": "udemy"}
        ],
        "projects": ["Interactive Stock Performance Charts", "Heatmap of Correlation Matrix", "Animated Population Growth Visualization"],
        "related": ["Seaborn", "Plotly", "Subplots", "heatmap", "bar/pie/scatter"]
    },
    "Statistics": {
        "courses": [
            {"name": "Statistics for Data Science", "url": "https://www.youtube.com/embed/zeJD6dqJ5lo", "type": "video"},
            {"name": "Probability & Stats (Khan Academy)", "url": "https://www.youtube.com/embed/XZo4xyJXCak", "type": "video"},
            {"name": "Statistics for DS (Udemy)", "url": "https://www.udemy.com/course/statistics-for-data-science-and-business-analysis/", "type": "udemy"}
        ],
        "projects": ["A/B Test Analysis on Marketing Campaign", "Hypothesis Testing on Survey Data", "Normal Distribution Visualizer"],
        "related": ["p-value", "CLT", "z-score", "Confidence Intervals", "Chi-Square"]
    },
    "Machine Learning": {
        "courses": [
            {"name": "ML by Andrew Ng", "url": "https://www.youtube.com/embed/7IgVGSaQPaw", "type": "video"},
            {"name": "ML from Scratch in Python", "url": "https://www.youtube.com/embed/DKSZHN7jLmw", "type": "video"},
            {"name": "ML A-Z (Udemy – Bestseller)", "url": "https://www.udemy.com/course/machinelearning/", "type": "udemy"}
        ],
        "projects": ["House Price Prediction (Regression)", "Spam Email Classifier (Naive Bayes)", "Customer Churn Prediction (XGBoost)"],
        "related": ["Supervised Learning", "Train/Test Split", "Cross Validation", "Bias-Variance"]
    },
    "Scikit-learn": {
        "courses": [
            {"name": "Scikit-learn Crash Course", "url": "https://www.youtube.com/embed/0B5eIE_1vpU", "type": "video"},
            {"name": "ML Pipelines with Scikit-learn", "url": "https://www.youtube.com/embed/irHhDMbw3xo", "type": "video"},
            {"name": "ML with Python & Scikit-learn (Udemy)", "url": "https://www.udemy.com/course/machine-learning-with-python-and-scikit-learn/", "type": "udemy"}
        ],
        "projects": ["Iris Classifier with Grid Search", "Auto-ML Pipeline with Feature Unions", "Diabetes Prediction with ROC/AUC"],
        "related": ["Pipeline API", "GridSearchCV", "preprocessing", "metrics", "KFold"]
    },
    "Feature Engineering": {
        "courses": [
            {"name": "Feature Engineering Tutorial", "url": "https://www.youtube.com/embed/uu8um0JmYA8", "type": "video"},
            {"name": "Advanced Feature Engineering (Kaggle)", "url": "https://www.youtube.com/embed/XX7-PJv2uBo", "type": "video"},
            {"name": "Feature Engineering for ML (Udemy)", "url": "https://www.udemy.com/course/feature-engineering-for-machine-learning/", "type": "udemy"}
        ],
        "projects": ["Kaggle House Prices Feature Engineering", "TF-IDF Text Feature Extraction", "Time-Series Feature Creation Pipeline"],
        "related": ["One-Hot Encoding", "Binning", "PCA", "Target Encoding", "log transform"]
    },
    "Real Datasets": {
        "courses": [
            {"name": "Kaggle for Beginners", "url": "https://www.youtube.com/embed/vtgDGrUiUKk", "type": "video"},
            {"name": "EDA Full Project Walkthrough", "url": "https://www.youtube.com/embed/xi0vhXFPegw", "type": "video"},
            {"name": "Applied Data Science (Udemy)", "url": "https://www.udemy.com/course/data-science-bootcamp-with-python/", "type": "udemy"}
        ],
        "projects": ["Titanic Kaggle Competition Entry", "World Happiness Index Analysis", "Airbnb Listings Price Prediction"],
        "related": ["Kaggle Datasets", "UCI ML Repo", "EDA", "Google Dataset Search"]
    },
    # ===== AI/ML ENGINEER =====
    "Math Basics": {
        "courses": [
            {"name": "Math for AI – 3Blue1Brown", "url": "https://www.youtube.com/embed/fNk_zzaMoSs", "type": "video"},
            {"name": "Calculus for Machine Learning", "url": "https://www.youtube.com/embed/WUvTyaaNkzM", "type": "video"},
            {"name": "Mathematics for ML (Udemy)", "url": "https://www.udemy.com/course/mathematics-for-machine-learning/", "type": "udemy"}
        ],
        "projects": ["Visualize Gradient Descent from Scratch", "Matrix Operations Library in Python", "Chain Rule Derivation for Backprop"],
        "related": ["Linear Algebra", "Calculus", "Probability", "Eigenvalues", "Derivatives"]
    },
    "NumPy/Pandas": {
        "courses": [
            {"name": "NumPy & Pandas for ML", "url": "https://www.youtube.com/embed/h6CALsrbqCY", "type": "video"},
            {"name": "Data Wrangling for AI Projects", "url": "https://www.youtube.com/embed/Rk0QFXaL-0Y", "type": "video"},
            {"name": "Python Data Science Handbook", "url": "https://jakevdp.github.io/PythonDataScienceHandbook/", "type": "udemy"}
        ],
        "projects": ["Custom Tensor-Like Array Class", "Batch Data Loader for ML Datasets", "EDA Automation Script"],
        "related": ["ndarray", "DataFrames", "Vectorization", "Broadcasting", "scipy"]
    },
    "Basic ML Concepts": {
        "courses": [
            {"name": "Visual Intro to Machine Learning", "url": "https://www.youtube.com/embed/adhgNQmPXZU", "type": "video"},
            {"name": "ML Glossary – Simply Explained", "url": "https://www.youtube.com/embed/I74ymkoNTnw", "type": "video"},
            {"name": "AI For Everyone by Andrew Ng", "url": "https://www.coursera.org/learn/ai-for-everyone", "type": "udemy"}
        ],
        "projects": ["Bias vs Variance Visualization Tool", "ML Terminology Flashcard App", "Train/Test Split Analysis"],
        "related": ["Overfitting", "Loss Function", "Epochs", "Learning Rate", "Gradient Descent"]
    },
    "Machine Learning Algorithms": {
        "courses": [
            {"name": "All ML Algorithms in 60 min", "url": "https://www.youtube.com/embed/z18nw4adsx4", "type": "video"},
            {"name": "Decision Trees & Random Forests", "url": "https://www.youtube.com/embed/RmajweUFKvM", "type": "video"},
            {"name": "ML A-Z Bestseller (Udemy)", "url": "https://www.udemy.com/course/machinelearning/", "type": "udemy"}
        ],
        "projects": ["Multi-Class Text Classifier with SVM", "Random Forest for Credit Risk", "K-Means Customer Segmentation"],
        "related": ["SVM", "KNN", "Decision Trees", "XGBoost", "Clustering"]
    },
    "Deep Learning": {
        "courses": [
            {"name": "Deep Learning Full Course (MIT)", "url": "https://www.youtube.com/embed/VyWAvY2CF9c", "type": "video"},
            {"name": "Neural Networks from Scratch", "url": "https://www.youtube.com/embed/Wo5dMEP_BbI", "type": "video"},
            {"name": "Deep Learning A-Z (Udemy)", "url": "https://www.udemy.com/course/deeplearning/", "type": "udemy"}
        ],
        "projects": ["MNIST Digit Classifier", "CNN Dog vs Cat Classifier", "RNN Text Autocomplete Engine"],
        "related": ["Backpropagation", "Activation Functions", "Dropout", "BatchNorm", "CNN/RNN/LSTM"]
    },
    "TensorFlow/PyTorch": {
        "courses": [
            {"name": "PyTorch in 100 Seconds", "url": "https://www.youtube.com/embed/ORMx45xqWkA", "type": "video"},
            {"name": "TensorFlow 2.0 Full Course", "url": "https://www.youtube.com/embed/tPYj3fFJGjk", "type": "video"},
            {"name": "PyTorch for Deep Learning (Udemy)", "url": "https://www.udemy.com/course/pytorch-for-deep-learning-and-computer-vision/", "type": "udemy"}
        ],
        "projects": ["Custom ResNet Image Classifier", "GPT-2 Fine-Tuning on Custom Dataset", "Real-Time Object Detection with YOLO"],
        "related": ["Tensors", "Autograd", "DataLoaders", "CUDA", "torchvision"]
    },
    "Model Building": {
        "courses": [
            {"name": "Full ML Pipeline – Train to Deploy", "url": "https://www.youtube.com/embed/e2bzk_yikSI", "type": "video"},
            {"name": "Model Deployment with FastAPI", "url": "https://www.youtube.com/embed/h5wLuVDr0oc", "type": "video"},
            {"name": "MLOps Fundamentals (Udemy)", "url": "https://www.udemy.com/course/mlops-course/", "type": "udemy"}
        ],
        "projects": ["Deploy Sentiment Model to Hugging Face Spaces", "Flask API serving ResNet Classifier", "MLflow End-to-End Experiment Tracking"],
        "related": ["MLflow", "Hugging Face", "FastAPI", "ONNX", "BentoML"]
    },
    # ===== DEVOPS ENGINEER =====
    "Linux Admin & Scripting": {
        "courses": [
            {"name": "Linux Command Line Full Course", "url": "https://www.youtube.com/embed/sWbUDq4S6Y8", "type": "video"},
            {"name": "Bash Scripting Full Tutorial", "url": "https://www.youtube.com/embed/v-F3YLd6oMw", "type": "video"},
            {"name": "Linux Administration Bootcamp (Udemy)", "url": "https://www.udemy.com/course/linux-administration-bootcamp/", "type": "udemy"}
        ],
        "projects": ["Automated Server Backup Bash Script", "User Management Script for Teams", "Cron Job Log Rotator"],
        "related": ["Bash", "cron", "systemd", "awk/sed/grep", "file permissions"]
    },
    "Networking & Security": {
        "courses": [
            {"name": "Computer Networking Full Course", "url": "https://www.youtube.com/embed/qiQR5rTSshw", "type": "video"},
            {"name": "TCP/IP & DNS Explained", "url": "https://www.youtube.com/embed/3QhU9jd03a0", "type": "video"},
            {"name": "Networking Fundamentals (Udemy)", "url": "https://www.udemy.com/course/complete-networking-fundamentals-course-ccna-start/", "type": "udemy"}
        ],
        "projects": ["VPC Setup with Subnets & Route Tables", "SSL/TLS Certificate with Let's Encrypt", "Packet Analysis with Wireshark"],
        "related": ["OSI Model", "TCP/IP", "DNS", "HTTPS", "Firewall Rules"]
    },
    "Version Control (Git)": {
        "courses": [
            {"name": "Git & GitHub for DevOps", "url": "https://www.youtube.com/embed/RGOj5yH7evk", "type": "video"},
            {"name": "Advanced Git Techniques", "url": "https://www.youtube.com/embed/qsTthZi23VE", "type": "video"},
            {"name": "Git Complete: Definitive Guide (Udemy)", "url": "https://www.udemy.com/course/git-complete/", "type": "udemy"}
        ],
        "projects": ["Git Flow Release Strategy for a Team", "GitHub Actions CI for Python", "Monorepo Structure with Workspaces"],
        "related": ["GitFlow", "rebase", "cherry-pick", "GitHub Actions", "Trunk-Based Dev"]
    },
    "Containers (Docker)": {
        "courses": [
            {"name": "Docker Full Course", "url": "https://www.youtube.com/embed/pTFZFxd4hOI", "type": "video"},
            {"name": "Docker Compose Tutorial", "url": "https://www.youtube.com/embed/HG6yIjqMVnE", "type": "video"},
            {"name": "Docker & Kubernetes (Udemy)", "url": "https://www.udemy.com/course/docker-kubernetes-the-practical-guide/", "type": "udemy"}
        ],
        "projects": ["Containerize a Full-Stack MERN App", "Docker Compose: API + DB + Redis Stack", "Multi-Stage Production Build"],
        "related": ["Dockerfile", "Docker Hub", "Volumes", "Networks", "docker-compose"]
    },
    "CI/CD Pipelines": {
        "courses": [
            {"name": "Complete CI/CD Pipeline Tutorial", "url": "https://www.youtube.com/embed/scEDHsr3APg", "type": "video"},
            {"name": "GitHub Actions Full Course", "url": "https://www.youtube.com/embed/R8_veQiYBjI", "type": "video"},
            {"name": "DevOps CI/CD Mastery (Udemy)", "url": "https://www.udemy.com/course/devsecops/", "type": "udemy"}
        ],
        "projects": ["Auto-Deploy to AWS on PR Merge", "Multi-Environment Pipeline (Dev/Staging/Prod)", "Auto Docker Build + Push to Registry"],
        "related": ["GitHub Actions", "Jenkins", "GitLab CI", "Webhooks", "Artifacts"]
    },
    "Container Orchestration (Kubernetes)": {
        "courses": [
            {"name": "Kubernetes Crash Course for Beginners", "url": "https://www.youtube.com/embed/X48VuDVv0do", "type": "video"},
            {"name": "Kubernetes in 1 Hour", "url": "https://www.youtube.com/embed/s_o8dwzRlu4", "type": "video"},
            {"name": "CKA Exam Prep (Udemy)", "url": "https://www.udemy.com/course/certified-kubernetes-administrator-with-practice-tests/", "type": "udemy"}
        ],
        "projects": ["Deploy Microservices App on K8s", "Horizontal Pod Autoscaler Lab", "RBAC + Secrets Management in K8s"],
        "related": ["Pods", "Deployments", "Services", "Ingress", "Helm", "kubectl"]
    },
    "Cloud Infrastructure": {
        "courses": [
            {"name": "AWS Solutions Architect Course", "url": "https://www.youtube.com/embed/k1RI5locZE4", "type": "video"},
            {"name": "GCP Cloud Engineer Path", "url": "https://www.youtube.com/embed/jpno8FSqpc8", "type": "video"},
            {"name": "AWS Certified SA Associate (Udemy)", "url": "https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/", "type": "udemy"}
        ],
        "projects": ["Deploy 3-Tier Architecture on AWS", "HA Web App with Load Balancer + Auto-Scaling", "CloudWatch Alarms + SNS Notifications"],
        "related": ["EC2", "VPC", "RDS", "S3", "IAM", "CloudFormation"]
    },
    "Infrastructure as Code (Terraform)": {
        "courses": [
            {"name": "Terraform Full Course", "url": "https://www.youtube.com/embed/7xTgXCWOU4E", "type": "video"},
            {"name": "Terraform with AWS Step by Step", "url": "https://www.youtube.com/embed/iRaai1IBlB0", "type": "video"},
            {"name": "Complete Terraform Bootcamp (Udemy)", "url": "https://www.udemy.com/course/terraform-beginner-to-advanced/", "type": "udemy"}
        ],
        "projects": ["Provision AWS VPC with Terraform Modules", "Terraform Remote State with S3 Backend", "Multi-Cloud IaC: AWS + GCP"],
        "related": ["HCL", "State Files", "Modules", "Workspaces", "Packer"]
    },
    "Monitoring (Prometheus & Grafana)": {
        "courses": [
            {"name": "Prometheus & Grafana Full Tutorial", "url": "https://www.youtube.com/embed/mLSQhaFw0_Y", "type": "video"},
            {"name": "Grafana Dashboard from Scratch", "url": "https://www.youtube.com/embed/N0E_BFMdCr8", "type": "video"},
            {"name": "DevOps Monitoring Masterclass (Udemy)", "url": "https://www.udemy.com/course/mastering-prometheus-and-grafana/", "type": "udemy"}
        ],
        "projects": ["K8s Cluster Monitor with Grafana", "Custom Alertmanager Rules for API", "Node Exporter + Prometheus Full Stack"],
        "related": ["PromQL", "Alertmanager", "Loki", "Exporters", "SLO/SLI/SLA"]
    },
    # ===== SHARED / MISC =====
    "React": {"courses": [{"name": "React Tutorial", "url": "https://www.youtube.com/embed/SqcY0GlETPk", "type": "video"}], "projects": ["Todo App with Redux", "E-Commerce UI"], "related": ["JSX", "Hooks", "Props"]},
    "Redux": {"courses": [{"name": "Redux Tutorial", "url": "https://www.youtube.com/embed/NqzdVN2tyvQ", "type": "video"}], "projects": ["State Management App", "Shopping Cart"], "related": ["Store", "Actions", "Reducers"]},
    "DSA": {"courses": [{"name": "DSA Full Course", "url": "https://www.youtube.com/embed/8hly31xKli0", "type": "video"}], "projects": ["Algorithm Visualizer", "LeetCode Top 50"], "related": ["Binary Tree", "Graphs", "DP"]},
    "System Design": {"courses": [{"name": "System Design Interview", "url": "https://www.youtube.com/embed/m8Icp_Cid5o", "type": "video"}], "projects": ["Design Twitter Clone", "Design URL Shortener"], "related": ["Load Balancer", "Redis", "CDN"]},
    "Git": {"courses": [{"name": "Git & GitHub", "url": "https://www.youtube.com/embed/RGOj5yH7evk", "type": "video"}], "projects": ["Open Source PR", "Git Flow Repo"], "related": ["Merge", "Rebase", "Stash"]},
    "Databases": {"courses": [{"name": "Databases Tutorial", "url": "https://www.youtube.com/embed/HXV3zeQKqGY", "type": "video"}], "projects": ["Schema Design", "Query Optimization Lab"], "related": ["ACID", "Indexes", "Normalization"]},
}
