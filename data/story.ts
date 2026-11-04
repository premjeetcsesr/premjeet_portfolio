/**
 * Story chapters: ids, labels, dialogue and scroll ranges.
 * `start`/`end` are fractions of total scroll progress (0..1).
 * `anchor` is where chapter navigation lands (a well-composed moment).
 */

export type ChapterId =
  | "arrival"
  | "introduction"
  | "scooter"
  | "flight"
  | "projects"
  | "lab"
  | "contact"
  | "finale";

export interface Chapter {
  id: ChapterId;
  label: string;
  start: number;
  end: number;
  anchor: number;
  dialogue: string;
}

export const chapters: Chapter[] = [
  {
    id: "arrival",
    label: "Arrival",
    start: 0,
    end: 0.1,
    anchor: 0.045,
    dialogue:
      "Hello there! Welcome to Premjeet's digital world. I'm your robotic guide. Come along — I'll show you what Premjeet builds, the learner communities he empowers, and where his ideas are heading!",
  },
  {
    id: "introduction",
    label: "Introduction",
    start: 0.1,
    end: 0.24,
    anchor: 0.125,
    dialogue:
      "First, let me introduce you to Premjeet. He's a Full-Stack Developer, Founder of Study Group Hub serving 20,000+ students, and a Microsoft & Google Student Ambassador.",
  },
  {
    id: "scooter",
    label: "Scooter journey",
    start: 0.24,
    end: 0.4,
    anchor: 0.312,
    dialogue:
      "Ready for the next stop? Let's explore the languages, frameworks, and cloud technologies Premjeet uses to engineer scalable web platforms and intelligent AI solutions!",
  },
  {
    id: "flight",
    label: "Drone flight",
    start: 0.4,
    end: 0.5,
    anchor: 0.468,
    dialogue:
      "Now for my favorite part — let's take these ideas to the sky! Each destination represents a signature project Premjeet has been building.",
  },
  {
    id: "projects",
    label: "Projects",
    start: 0.5,
    end: 0.72,
    anchor: 0.545,
    dialogue: "",
  },
  {
    id: "lab",
    label: "Invention lab",
    start: 0.72,
    end: 0.84,
    anchor: 0.805,
    dialogue:
      "Welcome to the Invention Lab! Premjeet loves building with MERN Stack, Java, Azure, and Google Cloud, mastering algorithms with 100+ LeetCode problems solved.",
  },
  {
    id: "contact",
    label: "Contact",
    start: 0.84,
    end: 0.94,
    anchor: 0.915,
    dialogue:
      "That brings us to the end of our adventure! If you'd like to collaborate with Premjeet, discuss an opportunity, or build something impactful together, let's connect.",
  },
  {
    id: "finale",
    label: "Namaskar finale",
    start: 0.94,
    end: 1.001,
    anchor: 0.999,
    dialogue: "Thank you for joining me on this adventure through Premjeet's world! Namaskar.",
  },
];

export const chapterIndexAt = (p: number): number => {
  for (let i = chapters.length - 1; i >= 0; i--) if (p >= chapters[i].start) return i;
  return 0;
};
