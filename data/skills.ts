/**
 * Technical skills vouchsafed from Premjeet's resume and real project experience.
 * No placeholders, accurate and cleanly categorized.
 */

export interface SkillGroup {
  title: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    title: "Programming languages",
    items: [
      "Java (Core & OOP)",
      "JavaScript (ES6+)",
      "Python",
      "SQL",
      "HTML5 & CSS3",
    ],
  },
  {
    title: "Cloud & AI technologies",
    items: [
      "Microsoft Azure",
      "Google Cloud Platform (GCP)",
      "Firebase",
      "Azure AI Research Agents",
      "Google Gemini AI",
      "BigQuery ML",
      "AI Tools Integration",
    ],
  },
  {
    title: "Web frameworks & backend",
    items: [
      "React.js",
      "Node.js",
      "Express.js",
      "FastAPI",
      "MERN Stack",
      "Tailwind CSS",
      "Bootstrap",
      "Java Swing",
    ],
  },
  {
    title: "Databases & storage",
    items: [
      "MongoDB",
      "MySQL",
      "JDBC",
    ],
  },
  {
    title: "Developer tools & workflows",
    items: [
      "Git & GitHub",
      "VS Code",
      "Postman",
      "Android Studio",
      "RESTful APIs",
    ],
  },
  {
    title: "Problem solving & fundamentals",
    items: [
      "Data Structures & Algorithms (DSA)",
      "100+ LeetCode Problems Solved",
      "Object-Oriented Programming (OOP)",
      "JWT Authentication & RBAC",
    ],
  },
];

/** Shown on the scooter ride (Education and Skills chapter). */
export const exploring: string[] = [
  "Google Gemini AI & Agent Workflows",
  "Azure AI Research Agents",
  "Advanced LeetCode & Competitive Coding",
  "High-Concurrency Microservices",
  "Next.js & Full-Stack Systems",
];
