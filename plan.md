# Upgrade Plan: Personal Developer Portfolio
**Project:** Premjeet — Developer Portfolio (AWS Student Builder Challenge)  
**Target Environment:** AWS Amplify Hosting / CloudFront / S3 (selected Region: `ap-southeast-2`)  
**Design Direction:** Premium Futuristic Dark Theme (`#05060d`) with Volt Blue (`#2f6bff`), Violet (`#7c4dff`), and Cyan (`#35e0ff`) Accents, 3D-Inspired Visuals, and Interactive "My Tech Superpower Machine"

---

## 1. Executive Summary & Existing Portfolio Audit

### 1.1 Existing Architecture & Codebase Inspection
The existing portfolio located in `premjeet-portfolio` was carefully inspected. It is built on a modern, high-performance web stack:
- **Framework & Bundler:** React 18 (`react` 18.3.1, `react-dom` 18.3.1) with Vite 5.
- **Styling System:** Tailwind CSS 3.4 (`tailwind.config.js`) extended with custom futuristic color tokens (`void: #05060d`, `navy: #0a1030`, `volt: #2f6bff`, `violet: #7c4dff`, `cyan: #35e0ff`) and Google Fonts (`Syne` for display headings, `Manrope` for body copy).
- **3D & Canvas Graphics:** Three.js (`three` 0.166.0), React Three Fiber (`@react-three/fiber` 8.17.0), and Drei (`@react-three/drei` 9.109.0).
- **Motion & Interactions:** Framer Motion 11.3.0 for spring-based reveals, magnetic cursors, and layout transitions; GSAP 3.12.5 with `ScrollTrigger` for timeline scrub animations; `lucide-react` for icons.
- **Cloud & Deployment Ready:** Contains `amplify.yml` pre-configured for AWS Amplify Hosting build pipeline (`dist` output directory, `npm ci`, and `npm run build`).
- **Data Architecture:** A clean, centralized single source of truth (`src/data.js`) storing structured resume facts.

### 1.2 Resume Audit (Single Source of Truth)
All biographical data, education, metrics, projects, and achievements are drawn strictly from Premjeet's official resume (`Premjeet (2).pdf`):
- **Name:** Premjeet
- **Professional Title:** Full-Stack Developer (MERN / Java)
- **Contact:** `premjeetrajbhar2@gmail.com` | `+91-7379134397`
- **Location:** Akbarpur / Ambedkar Nagar, Uttar Pradesh
- **Profiles:**
  - LinkedIn: `https://www.linkedin.com/in/premjeet-37804a2a9`
  - GitHub: `https://github.com/premjeetcsesr`
  - LeetCode: `https://leetcode.com/u/premjeet1918/`
  - Credly: `https://www.credly.com/users/premjeet.69db616c`
  - Community Site: `https://studygrouphub.in`

---

## 2. Evaluation: Strengths, Areas for Improvement & AWS Challenge Gaps

### What is Good (Preserve and Retain)
1. **Strong Visual Aesthetics:** Deep dark space/void background (`#05060d`) with electric violet and cyan neon highlights and glassmorphic panels (`backdrop-blur-xl`).
2. **Innovative 3D Experiences:**
   - Interactive hero background core (`Scene.jsx`) with dynamic mesh distortion, wireframe shields, and orbital particle stars.
   - Interactive 3D Vending Machine (`Machine.jsx`) featuring interactive rotation, push-button triggering, shake animations, and dispensing physical items.
3. **Accessibility First:** Includes `prefers-reduced-motion` fallbacks across canvas loops and GSAP triggers, semantic HTML5 structure, skip links, and ARIA labels.
4. **Data Integrity:** Existing `src/data.js` adheres strictly to verified resume facts with zero fabricated claims.

### What Needs Improvement
1. **Section Hierarchy & Separation:**
   - Education is currently blended directly into the Experience timeline. Academic degrees (B.Tech AIML at KIT & Diploma at Govt. Polytechnic) deserve their own dedicated, highlighted cards with credentials and specializations.
   - Fun Fact is currently only accessible as a random drop inside the machine; it should also have an engaging spotlight element in the biographical narrative.
2. **Project Portfolio Balance:**
   - Currently presents 2 projects with an unbalanced 3-to-2 column layout. Upgrading to a curated 3-project showcase (including the Java Swing / JDBC Student Portal from the resume) establishes a balanced, symmetrical grid.
3. **Certifications & Credential Showcase:**
   - Certifications from Microsoft and Google Cloud are currently formatted as a plain list; they should be styled as high-impact verified digital credential badges with direct links to Credly.
4. **Mobile & Viewport Responsiveness:**
   - Heavy 3D canvas elements need automatic downsampling on low-powered mobile devices to guarantee smooth 60fps scrolling.

### What is Missing for the AWS Student Builder Challenge
1. **AWS Challenge Badge & Cloud Focus:**
   - An AWS Student Builder Challenge indicator and cloud architecture highlight showing deployment on AWS infrastructure.
2. **Modular Architecture for Future AWS Integrations:**
   - Preparation for serverless contact form handling via AWS API Gateway and AWS Lambda without breaking the current client-side fallback.

---

## 3. Detailed Structure & Content Plan

### Section 1: Introduction (Hero Section)
- **Headline:** `PREMJEET` — Bold display typography with animated letter-by-letter spring entrance and neon gradient text (`#8fb0ff` → `#35e0ff` → `#b79bff`).
- **Subheadline:** *"Beyond Code."* — Full-Stack Developer (MERN / Java), Founder of Study Group Hub (20,000+ students), Microsoft Learn Student Ambassador & Google Student Ambassador.
- **Visual Centerpiece:** Real-time 3D floating icosahedron core (`Scene.jsx`) encased in a wireframe energy field, glowing orbital rings, and a 700-particle interactive starfield responding to pointer movement.
- **Action Buttons:**
  - Primary Magnetic Button: `Explore My Work` (Smooth scroll to `#projects`)
  - Secondary Ghost Button: `Get in Touch` (Smooth scroll to `#contact`)
- **Direct Social Badges:** High-contrast rounded pill icons linking directly to GitHub, LinkedIn, and LeetCode.

### Section 2: About Me
- **Core Narrative:**
  - *"Full-Stack Developer (MERN/Java) and Founder of Study Group Hub, serving 20,000+ students through AI-powered educational resources. Microsoft and Google Student Ambassador who has conducted 15+ cloud and AI workshops for 800+ students."*
  - Engineering philosophy: Building software that solves genuine problems for real learners, prioritizing reliability, usability, and accessible education.
- **Interactive Journey Timeline:**
  - `Aug 2023`: Enrolls in Diploma in Computer Software Engineering at Govt. Polytechnic College, Sikandra.
  - `Jan 2024`: Founds Study Group Hub, architecting digital study resources for diploma students.
  - `Jun 2025`: Completes intensive Java Programming Summer Training at BTPS Company, Kanpur.
  - `Jul 2025 – Dec 2025`: Appointed Campus Minister at GeeksforGeeks; organizes 10+ programming drives.
  - `Apr 2026`: Selected as Google Student Ambassador (GSA@2026 Lead), ranking Top 200 nationally.
  - `Jul 2026`: Appointed Microsoft Student Ambassador (MLSA), conducting cloud and AI workshops.
  - `2026 – 2029`: Commences B.Tech in Computer Science & Engineering (AIML) at Kanpur Institute of Technology.

### Section 3: Education (Dedicated Milestone Grid)
- **Institution 1:** Kanpur Institute of Technology (KIT), Kanpur
  - **Degree:** Bachelor of Technology (B.Tech) in Computer Science & Engineering (Artificial Intelligence & Machine Learning)
  - **Timeline:** 2026 – 2029 (2nd Year, Currently Pursuing)
  - **Focus:** AI/ML Foundations, Advanced Software Engineering, Cloud Architecture.
- **Institution 2:** Govt. Polytechnic College, Sikandra, Kanpur Dehat
  - **Credential:** Diploma in Computer Software Engineering
  - **Timeline:** August 2023 – June 2026 (Completed)
  - **Performance:** 70% Aggregate Score
  - **Foundations:** Core Computing, Data Structures, OOP with Java, Database Systems.

### Section 4: Technical Skills (Interactive Superpower Radar / Categorized Tabs)
Grouped strictly according to the verified resume categories:
1. **Languages:** Java (Core & OOP), JavaScript (ES6+), SQL, HTML5, CSS3.
2. **Web & Frameworks:** React.js, Node.js, Express.js, MERN Stack, Bootstrap, Tailwind CSS, Java Swing.
3. **Cloud & AI:** Microsoft Azure, Google Cloud Platform (GCP), Firebase, AI Tools Integration.
4. **Databases:** MySQL, MongoDB.
5. **Developer Tools:** Git, GitHub, VS Code, JDBC, Android Studio, Postman.
6. **Problem Solving:** Data Structures & Algorithms (DSA) — 100+ Problems Solved on LeetCode.

### Section 5: Projects (The 3 Strongest Projects)
1. **Study Group Hub Platform** *(Featured Flagship)*
   - **Stack:** React, Node.js, Express, MongoDB (MERN Stack)
   - **Metrics & Impact:** Built and launched an educational web portal serving **20,000+ students** across diploma and engineering colleges with digital notes distribution and exam preparations.
   - **Key Features:** Secure JWT authentication, Role-Based Access Control (RBAC), fast digital resource delivery.
   - **Links:** Live URL (`https://studygrouphub.in`) & GitHub Repository (`https://github.com/premjeetcsesr/studygrouphubFfrontant.git`).
2. **WeatherGPT — Smart Conversational Weather Assistant (SIH 2026 Project)**
   - **Stack:** React, Python, FastAPI, AI / NLP, Weather APIs
   - **Metrics & Status:** In active development for Smart India Hackathon (SIH) 2026.
   - **Key Features:** Natural-language weather queries, multi-lingual weather communication, location-based precipitation forecasts, and real-time weather alerts.
   - **Links:** GitHub Repository (`https://github.com/premjeetcsesr/weathergpt.git`).
3. **Java Swing Student & Database Management System** *(Core Engineering Project)*
   - **Stack:** Java (OOP), Java Swing, JDBC, MySQL
   - **Key Features:** Desktop application featuring student registration, secure credential verification, relational data modeling with MySQL, and responsive management dashboard via Swing GUIs.
   - **Highlights:** Built during BTPS training demonstrating foundational object-oriented programming, data persistence, and SQL query optimization.

### Section 6: Achievements
- **Google Student Ambassador (GID: 733):** Selected as GSA@2026 Lead, achieving a **Top 200 National Rank** among 15,000+ student applicants across India.
- **Community Impact:** Founded Study Group Hub from scratch, growing it to an active learning community supporting **20,000+ students**.
- **Tech Educator:** Conducted **15+ Cloud & AI Workshops** empowering **800+ student attendees** as a Microsoft Student Ambassador.
- **Problem Solving:** **100+ LeetCode DSA Problems Solved**, and organized 10+ competitive coding drives as GeeksforGeeks Campus Minister.
- **Verified Certifications Display:**
  - Microsoft: Applied Skills – Generate Reports with AI Research Agents
  - Microsoft Azure: Azure Fundamentals (AZ-900)
  - Google Cloud: Professional Cloud Architect, ML Models with BigQuery ML, IoT Fundamentals
  - GitHub & Wadhwani Foundation: GitHub Foundations Candidate, Professional Skilling Certificate (Udyam)
  - Credly Verification Link: `https://www.credly.com/users/premjeet.69db616c`

### Section 7: Experience & Community Contributions
- **Microsoft Student Ambassador (MLSA) — Microsoft** *(July 2026 – Present)*
  - Led 15+ workshops on Azure AI, GitHub, and cloud fundamentals for 800+ students.
  - Mentored campus students in open-source practices and engineering fundamentals.
- **Google Student Ambassador (GSA@2026 Lead) — Google** *(April 2026 – Present)*
  - Spearheaded developer community events promoting Google Gemini AI and cloud developer tools.
- **Founder & Full-Stack Developer — Study Group Hub** *(Jan 2024 – Present)*
  - Architected full-stack web infrastructure serving thousands of daily active engineering learners.
- **Campus Minister — GeeksforGeeks** *(July 2025 – Dec 2025)*
  - Organized competitive coding contests, DSA study sessions, and peer code reviews.
- **Summer Trainee — BTPS Company, Kanpur** *(June 2025)*
  - Completed intensive training in Java programming, building desktop applications and relational databases.

### Section 8: Fun Fact
- **Verified Fun Fact:**
  - While completing his Diploma in Computer Software Engineering in 2026 with a 70% aggregate, Premjeet founded an online education portal (*Study Group Hub*) entirely by himself that scaled to over 20,000 learners before he even started his 2nd year of B.Tech!
  - Passionate about hands-on coding, mentoring campus peers, and solving algorithmic problems on LeetCode.

### Section 9: Website Design & Style System
- **Visual Identity:** Premium futuristic cyber-space aesthetic.
- **Palette Tokens:**
  - Background (Void): `#05060d`
  - Background Deep Navy: `#0a1030`
  - Accent Volt Blue: `#2f6bff`
  - Accent Violet Neon: `#7c4dff`
  - Accent Cyan Glow: `#35e0ff`
  - Text Primary: `#e8ecff`
  - Text Secondary: `#94a3b8` (Slate 400)
- **Glassmorphic Materiality:**
  - Surface: `linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.015))`
  - Border: `1px solid rgba(120, 150, 255, 0.18)`
  - Glow: `box-shadow: 0 20px 60px -25px rgba(47, 107, 255, 0.45)`
- **Typography:**
  - Display Font: `Syne` (Geometric, wide, futuristic headings)
  - Body Font: `Manrope` (Clean, hyper-readable modern sans-serif)
- **Micro-Interactions:**
  - Magnetic cursor follower with subtle violet ambient glow.
  - 3D card tilt on mouse move with perspective translation.
  - Interactive smooth scroll and scroll-linked neon gradient line in header.

---

## 4. Interactive Feature: "My Tech Superpower Machine"

### Concept & Mechanical Design
The interactive feature is a **3D Cyberpunk Vending Machine** built with React Three Fiber (`@react-three/fiber`) and Drei:
- **Visual Model:**
  - Metal chassis with reflective navy/dark-blue finish (`#0c1230`, metalness 0.9, roughness 0.25).
  - Glowing glass display window showcasing illuminated skill cubes in 5 distinct neon colors.
  - Interactive glowing dispenser push-button with pulsating emissive light.
  - Shaking spring physics when dispensing, with an animated payload falling into the collection tray.
- **Machine Pool Content (Direct from Resume):**
  1. **Hidden Skill:** Java Swing desktop GUIs with JDBC data persistence, Firebase, Android Studio, and Postman API testing.
  2. **Fun Fact:** Scaled an educational platform to 20,000+ students while in college; based in Akbarpur / Ambedkar Nagar, UP; organized 10+ CP drives as GfG Campus Minister.
  3. **Project Achievement:** Built Study Group Hub with JWT authentication and RBAC; developing WeatherGPT for SIH 2026; Top 200 in Google Student Ambassador program.
  4. **Coding Philosophy:** Build for real people; craft reliable, user-focused products; practice steadily (100+ LeetCode problems solved).
  5. **Personal Motivation:** Making high-quality educational resources accessible to every diploma and engineering student; mentoring campus peers in cloud and open source.
- **Interactive Controls:**
  - Direct 3D mesh interaction: Users can click the button on the 3D machine or click the magnetic *"Insert a coin"* UI button.
  - Animated results card with Framer Motion spring pop-up displaying category badge and quote.

---

## 5. Implementation Roadmap (Preserving Existing Code)

1. **Step 1 — Asset & File Preservation:**
   - Retain all existing source files in `src/` and configuration files (`vite.config.js`, `tailwind.config.js`, `amplify.yml`, `package.json`).
2. **Step 2 — Data Enrichment in `src/data.js`:**
   - Add the 3rd project (Java Swing / JDBC Student Portal) to `projects`.
   - Structure `education` into high-visibility academic cards.
   - Refine `machinePool` items to ensure 100% alignment with resume details.
3. **Step 3 — Component Enhancements in `src/components/Sections.jsx`:**
   - Elevate the Education section into its own dedicated grid alongside Experience.
   - Balance the Projects section into a sleek 3-card responsive grid with live preview badges.
   - Upgrade Certifications into branded credential cards linked to Credly.
4. **Step 4 — Performance Verification:**
   - Verify `npm run build` runs cleanly and generates static output in `dist/`.
   - Confirm AWS Amplify deployment compatibility with `amplify.yml`.

---

## 6. Open Clarifications for Premjeet
1. **Live Demo URL for WeatherGPT:** Is there an active deployment link for WeatherGPT, or should it remain marked as *"In development (SIH 2026 Project)"* with its GitHub repository link?
2. **Contact Email Delivery:** Would you prefer keeping the frictionless `mailto:` link opener, or would you like to connect a serverless backend contact form (AWS API Gateway + AWS Lambda) in a future challenge step?

