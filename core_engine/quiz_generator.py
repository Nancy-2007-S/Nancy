import random

# A robust generic template engine when specific knowledge isn't manually mapped
GENERIC_TEMPLATES = [
    {
        "q": "What is the primary function of {} in modern architectures?",
        "options": [
            "To optimize system storage and eliminate redundant hard drives.",
            "To provide a standard methodology for its defined domain and enhance developer efficiency.",
            "To secure network protocols at the TCP/IP layer.",
            "To act as a generic user interface framework for web browsers."
        ],
        "ans": 1,
        "exp": "{} is heavily used as a specialized tool to solve complex domain-specific problems efficiently rather than being a generic networking or storage layer."
    },
    {
        "q": "Which of the following problems does {} specifically solve?",
        "options": [
            "It automatically compiles Python code to raw binary.",
            "It resolves complex bottlenecks related to its specific theoretical domain.",
            "It replaces the need for an operating system.",
            "It acts as a substitute for cloud hosting."
        ],
        "ans": 1,
        "exp": "Tools and techniques like {} exist to simplify domain-specific complexity rather than replacing OS-level or hosting architectures."
    },
    {
        "q": "In a typical application lifecycle, where is {} most effectively utilized?",
        "options": [
            "Only during the final production deployment phase.",
            "Strictly in the CSS styling phase.",
            "Throughout its specialized pipeline from development to optimization.",
            "Exclusively inside the kernel network drivers."
        ],
        "ans": 2,
        "exp": "{} plays an active role in the development, operation, and optimization lifecycle corresponding to its domain."
    },
    {
        "q": "When a developer encounters a fatal error while using {}, what is usually the root cause?",
        "options": [
            "A hardware failure in the user's laptop.",
            "Misconfigured implementations or violating its core principles.",
            "The internet going down entirely.",
            "Running out of CSS grid styles."
        ],
        "ans": 1,
        "exp": "Most logical failures in {} stem from breaking its design patterns or architectural constraints."
    },
    {
        "q": "What is considered a 'Best Practice' when implementing {}?",
        "options": [
            "Writing everything in a single, massive 10,000-line file.",
            "Following modularity, standard conventions, and proper documentation.",
            "Never updating it or checking its official community guidelines.",
            "Using it for literally every single project, even when entirely unnecessary."
        ],
        "ans": 1,
        "exp": "Proper modularity and standard community practices are the golden rules for leveraging {}."
    }
]

# Specifically mapped knowledge for popular skills
SPECIFIC_QUIZZES = {
    "Python": [
        {"q": "What does the 'yield' keyword do in Python?", "options": ["Stops the program entirely", "Returns a generator object", "Imports an external library", "Allocates memory statically"], "ans": 1, "exp": "'yield' pauses a function and returns a generator, maintaining state for the next call."},
        {"q": "Which of the following is NOT an immutable data type in Python?", "options": ["String", "Tuple", "List", "Integer"], "ans": 2, "exp": "Lists are mutable, meaning their contents can be changed after creation."},
        {"q": "What is a python 'decorator'?", "options": ["A class that styles CSS", "A function that modifies the behavior of another function", "An annotation for HTML", "A syntax error"], "ans": 1, "exp": "Decorators wrap functions to extend their behavior dynamically."},
        {"q": "How does Python handle memory management?", "options": ["Manual allocation like C", "Using a private heap space and a garbage collector", "Only explicitly via pointers", "It does not allocate memory"], "ans": 1, "exp": "Python uses reference counting and a cyclic garbage collector."},
        {"q": "What does PEP 8 refer to?", "options": ["A core data structure", "The Python Enhancement Proposal for style guide", "A built-in framework", "The package manager"], "ans": 1, "exp": "PEP 8 is the definitive style guide for writing readable Python code."}
    ],
    "React.js": [
        {"q": "What is the Virtual DOM?", "options": ["A fake browser plugin", "An in-memory representation of the real DOM", "A backend database", "A replacement for JavaScript"], "ans": 1, "exp": "React keeps an in-memory representation to optimize real DOM updates."},
        {"q": "Which React hook is used to handle side effects?", "options": ["useState", "useEffect", "useContext", "useReducer"], "ans": 1, "exp": "useEffect is built specifically for managing side effects like API calls and DOM manipulation."},
        {"q": "What is the primary purpose of 'props'?", "options": ["To pass data between components", "To fetch data from backend", "To style components", "To manage global state"], "ans": 0, "exp": "Props (properties) are how React passes data top-down from parent to child."},
        {"q": "Why do we need 'keys' in React lists?", "options": ["To make loops faster", "To help React identify which items have changed", "To secure the data", "To style individual items"], "ans": 1, "exp": "Keys tell React exactly which array items changed, were added, or were removed."},
        {"q": "What triggers a re-render in a React component?", "options": ["Clicking any button", "Hovering the mouse", "Changes to state or props", "Resizing the window"], "ans": 2, "exp": "React components update automatically when their underlying state or props change."}
    ]
}

def generate_quiz_for_skill(skill: str):
    """Generates 5 Multiple Choice Questions tailored or mapped to a specific skill."""
    # If we have specific hardcoded ones, use them directly
    if skill in SPECIFIC_QUIZZES:
        return SPECIFIC_QUIZZES[skill]
    
    # Fallback pseudo-AI generic template mappings
    quiz = []
    for template in GENERIC_TEMPLATES:
        q_text = template["q"].replace("{}", skill)
        exp_text = template["exp"].replace("{}", skill)
        
        # Shuffle options to avoid index 1 always being correct (except we need to track answer)
        options = template["options"][:]
        correct_answer = options[template["ans"]]
        random.shuffle(options)
        new_ans_idx = options.index(correct_answer)
        
        quiz.append({
            "q": q_text,
            "options": options,
            "ans": new_ans_idx,
            "exp": exp_text
        })
    return quiz
