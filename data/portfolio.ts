/**
 * Personal portfolio data for Premjeet.
 * Updated based on authentic resume and credentials.
 */

export const PLACEHOLDER_PREFIX = "[PLACEHOLDER";

export const isPlaceholder = (value: string | null | undefined) =>
  !!value && value.startsWith(PLACEHOLDER_PREFIX);

export const portfolio = {
  name: "Premjeet",
  tagline: "Full-Stack Developer (MERN/Java) & Community Leader",
  heroSupport: "Founder of Study Group Hub (20,000+ students) · Google & Microsoft Student Ambassador",
  finalQuote: "Building reliable, user-focused products and empowering learner communities through code.",

  about: {
    summary:
      "Full-Stack Developer (MERN/Java) and Founder of Study Group Hub, serving 20,000+ students through AI-powered educational resources. Microsoft and Google Student Ambassador who has conducted 15+ cloud and AI workshops for 800+ students. Skilled in building and deploying web applications with React, Node.js, and MongoDB, with 100+ DSA problems solved on LeetCode. Seeking a software development role to build reliable, user-focused products.",
    interests: [
      "Full-Stack Web Development (React.js, Node.js, Express.js, MongoDB)",
      "Cloud Architecture & AI Integrations (Microsoft Azure, Google Cloud, Gemini AI)",
      "Scalable Educational Platforms & High-Traffic Resource Portals",
      "Competitive Coding & Algorithms (100+ LeetCode Problems Solved)",
      "Conversational AI Assistants & Agentic Systems (WeatherGPT, AI Research Agents)",
      "Technical Mentorship & Open-Source Community Leadership"
    ],
    approach:
      "Combines strong software engineering principles with community-driven user feedback. Decomposes complex real-world bottlenecks into scalable, reliable architectures — from building secure, role-based educational portals for 20,000+ learners to integrating conversational AI APIs and microservices.",
    currentlyLearning: [
      "Pursuing B.Tech 2nd Year in Computer Science & Engineering (AIML) at Kanpur Institute of Technology (KIT).",
      "Deepening expertise in Data Structures & Algorithms, System Design, and Scalable Cloud Architectures.",
      "Hands-on experimentation with Google Gemini AI, Azure AI Research Agents, and BigQuery ML."
    ],
  },

  education: [
    {
      institution: "Kanpur Institute of Technology (KIT), Kanpur",
      program: "Bachelor of Technology (B.Tech) in Computer Science & Engineering (AIML) — 2nd Year",
      period: "2026 – 2029 (Pursuing)",
      notes: "Specializing in Artificial Intelligence and Machine Learning (AIML).",
    },
    {
      institution: "Govt. Polytechnic College, Sikandra, Kanpur Dehat",
      program: "Diploma in Computer Software Engineering",
      period: "Aug 2023 – June 2026",
      notes: "Aggregate Marks: 70% | Completed: 2026",
    },
  ],

  experience: [
    {
      role: "Microsoft Student Ambassador (MLSA)",
      organization: "Microsoft",
      period: "July 2026 – Present",
      bullets: [
        "Conducted 15+ AI and Cloud workshops reaching 800+ students, focusing on Azure AI, GitHub, and cloud technologies.",
        "Mentored campus peers in open-source contributions and software engineering practices."
      ]
    },
    {
      role: "Google Student Ambassador (GSA@2026 Lead, GID: 733)",
      organization: "Google",
      period: "April 2026 – Present",
      bullets: [
        "Achieved Top 200 national ranking among 15,000 students in the Google Student Ambassador program.",
        "Led community outreach and promoted Google Gemini AI and developer resources."
      ]
    },
    {
      role: "Founder & Full-Stack Developer",
      organization: "Study Group Hub",
      period: "Jan 2024 – Present",
      bullets: [
        "Architected an educational portal (studygrouphub.in) serving 20,000+ students across diploma and engineering domains.",
        "Implemented secure JWT authentication, digital notes distribution, and exam preparation resources."
      ]
    },
    {
      role: "Campus Minister",
      organization: "GeeksforGeeks",
      period: "July 2025 – Dec 2025",
      bullets: [
        "Organized 10+ competitive programming drives and DSA mentorship sessions."
      ]
    },
    {
      role: "Summer Training (Java Programming)",
      organization: "BTPS Company, Kanpur",
      period: "June 2025",
      bullets: [
        "Completed a 2-month training in Java Programming, building small projects and mastering OOP concepts."
      ]
    }
  ],

  certifications: [
    {
      title: "Microsoft Applied Skills: Generate Reports with AI Research Agents",
      issuer: "Microsoft"
    },
    {
      title: "Microsoft Certified: Azure Fundamentals (AZ-900)",
      issuer: "Microsoft Azure"
    },
    {
      title: "Google Cloud: Professional Cloud Architect & ML Models with BigQuery ML",
      issuer: "Google Cloud"
    },
    {
      title: "Google Cloud: IoT Fundamentals",
      issuer: "Google Cloud"
    },
    {
      title: "GitHub Foundations Candidate & Professional Skilling Certificate (Udyam)",
      issuer: "GitHub & Wadhwani Foundation"
    }
  ],

  achievements: [
    "Google Student Ambassador (GID: 733): Selected for the 2026 Google Student Ambassador program (Top 200 rank of 15,000 nationwide).",
    "Community Founder: Built Study Group Hub into an active community serving 20,000+ learners across diploma & engineering.",
    "Competitive Coding: 100+ Data Structures & Algorithms problems solved on LeetCode.",
    "Conducted 15+ AI & Cloud workshops reaching 800+ students as MLSA & GSA."
  ],

  links: {
    email: "premjeetrajbhar2@gmail.com",
    github: "https://github.com/premjeetcsesr",
    linkedin: "https://www.linkedin.com/in/premjeet-37804a2a9",
    leetcode: "https://leetcode.com/u/premjeet1918/",
    credly: "https://www.credly.com/users/premjeet.69db616c",
    resume: "/resume.pdf",
    phone: "+91-7379134397",
    location: "Akbarpur / Ambedkar Nagar, Uttar Pradesh"
  }
};

export type Portfolio = typeof portfolio;
