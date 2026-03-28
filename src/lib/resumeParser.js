import * as pdfjs from "pdfjs-dist";
import mammoth from "mammoth";

// For build compatibility with pdfjs in Next.js
if (typeof window !== "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
}

const SKILL_KEYWORDS = [
  "python", "java", "c++", "javascript", "typescript",
  "machine learning", "deep learning", "nlp", "computer vision",
  "sql", "data analysis", "pandas", "numpy", "power bi",
  "react", "node.js", "express", "tailwind css",
  "git", "docker", "kubernetes", "aws",
];

const INTEREST_KEYWORDS = {
  "ai engineer": "AI Engineer",
  "data scientist": "Data Scientist",
  "ml engineer": "ML Engineer",
  "backend developer": "Backend Developer",
  "frontend developer": "Frontend Developer",
  "full stack developer": "Full Stack Developer",
  "cloud engineer": "Cloud Engineer",
};

async function extractTextFromPdf(arrayBuffer) {
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item) => item.str);
    fullText += strings.join(" ") + "\n";
  }
  return fullText;
}

async function extractTextFromDocx(arrayBuffer) {
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

function extractSectionLines(text, patterns) {
  const lines = text.split("\n").map(l => l.trim().replace(/^[-•\t\s]+/, "")).filter(Boolean);
  const results = [];
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (patterns.some(p => lower.includes(p))) {
      results.push(line);
    }
  }
  return Array.from(new Set(results)).slice(0, 8);
}

function extractAcademicBackground(text) {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const degreePattern = /(b\.?tech|b\.?e|bachelor|m\.?tech|master|phd|bsc|msc|university|college)/i;
  const match = lines.find(line => degreePattern.test(line));
  return match || "";
}

export async function parseResume(file) {
  const arrayBuffer = await file.arrayBuffer();
  const ext = file.name.split(".").pop().toLowerCase();
  
  let text = "";
  if (ext === "pdf") {
    text = await extractTextFromPdf(arrayBuffer);
  } else if (ext === "docx" || ext === "doc") {
    text = await extractTextFromDocx(arrayBuffer);
  } else {
    throw new Error("Only PDF or DOCX is supported");
  }

  if (!text.trim()) {
    throw new Error("Could not extract text from file");
  }

  const lower = text.toLowerCase();
  const skills = SKILL_KEYWORDS.filter(s => lower.includes(s)).map(s => {
    if (s === "nlp") return "NLP";
    return s.charAt(0).toUpperCase() + s.slice(1);
  });

  const interests = Object.entries(INTEREST_KEYWORDS)
    .filter(([kw]) => lower.includes(kw))
    .map(([, label]) => label);
  
  if (interests.length === 0 && (lower.includes("machine learning") || lower.includes("ai"))) {
    interests.push("AI Engineer");
  }

  return {
    skills: Array.from(new Set(skills)),
    interests: Array.from(new Set(interests)),
    academic_background: extractAcademicBackground(text),
    projects: extractSectionLines(text, ["project", "built", "developed", "implemented"]),
    experience: extractSectionLines(text, ["intern", "engineer", "developer", "experience", "responsible", "worked"]),
    career_goals: Array.from(new Set(interests)),
  };
}
