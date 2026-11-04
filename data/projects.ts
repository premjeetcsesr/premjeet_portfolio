/**
 * Authentic projects built by Premjeet.
 * Data verified from resume, GitHub repositories, and live credentials.
 */

export type ProjectStatus = "project" | "in-progress" | "concept";

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  summary: string;
  features: string[];
  stack: string[];
  repo: string | null;
  demo: string | null;
  /** Accent colour for this project's world */
  accent: string;
  /** Which 3D world to show */
  world: "quiz" | "travel" | "flow" | "generic" | "study-hub" | "weather" | "security";
  dialogue: string;
}

export const projects: Project[] = [
  {
    id: "study-group-hub",
    name: "Study Group Hub Platform",
    status: "project",
    summary:
      "A full-stack educational portal serving 20,000+ students across diploma and engineering domains with digital notes distribution, syllabus guides, and exam resources.",
    features: [
      "Architected educational portal serving 20,000+ active students across diploma and engineering domains.",
      "Built digital notes distribution system with categorized subject modules and instant document previews.",
      "Implemented secure JWT authentication and role-based access control (RBAC) to protect user and admin data.",
      "Engineered scalable REST APIs with Node.js, Express.js, and MongoDB for high concurrency.",
    ],
    stack: [
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "JWT Authentication",
      "Tailwind CSS",
      "RESTful APIs",
    ],
    repo: "https://github.com/premjeetcsesr/studygrouphubFfrontant.git",
    demo: "https://studygrouphub.in",
    accent: "#5ab0ff",
    world: "study-hub",
    dialogue:
      "Welcome to Study Group Hub — an educational ecosystem I founded and built, serving 20,000+ students with digital notes and exam resources!",
  },
  {
    id: "weathergpt",
    name: "WeatherGPT (SIH 2026)",
    status: "in-progress",
    summary:
      "A conversational AI weather assistant developed for Smart India Hackathon 2026 that enables users to query live weather conditions, forecasts, and climate trends using natural language.",
    features: [
      "Conversational AI interface allowing natural language queries for real-time weather and meteorological data.",
      "FastAPI backend microservice integrated with external weather APIs and AI models for low-latency responses.",
      "Location-based forecast analysis, severe weather warning alerts, and multilingual accessibility.",
      "Responsive React interface with live climate condition cards and animated forecast charts.",
    ],
    stack: [
      "React.js",
      "Python",
      "FastAPI",
      "Conversational AI APIs",
      "Weather APIs",
      "Tailwind CSS",
    ],
    repo: "https://github.com/premjeetcsesr/weathergpt.git",
    demo: null,
    accent: "#38bdf8",
    world: "weather",
    dialogue:
      "This is WeatherGPT, developed for Smart India Hackathon 2026 — an intelligent conversational weather assistant driven by natural language and real-time APIs!",
  },
  {
    id: "secure-vision-ai",
    name: "Secure Vision AI | Privacy-First Browser Agent",
    status: "project",
    summary:
      "A privacy-first autonomous browser agent designed to understand webpage interfaces and automate browser tasks using on-device visual AI with real-time PII redaction.",
    features: [
      "Developed a privacy-first browser agent designed to understand webpage interfaces and automate browser tasks using visual AI.",
      "Designed an on-device privacy filtering approach to detect and redact sensitive information such as passwords, emails, phone numbers, and other PII before server transmission.",
      "Implemented a hybrid architecture combining lightweight local visual processing with server-side AI reasoning using sanitized context.",
      "Focused on optimizing device resource utilization, reducing inference latency, and maintaining privacy during browser automation.",
    ],
    stack: [
      "JavaScript",
      "Python",
      "FastAPI",
      "WebGPU",
      "WebAssembly",
      "ONNX Runtime Web",
      "Transformers.js",
    ],
    repo: "https://github.com/premjeetcsesr",
    demo: null,
    accent: "#ff3366",
    world: "security",
    dialogue:
      "HALT! Security Checkpoint ahead. Privacy Guard agent robots are scanning frames for passwords, faces, and sensitive PII to guarantee 100% Safe Context transmission!",
  },
];
