"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, RoundedBox, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { projects, type Project } from "@/data/projects";
import { LAB_X, LAUNCH_X, SPAN, islandAt, projStart } from "@/lib/layout";
import { projectReveal } from "@/lib/timeline";
import { story } from "@/lib/store";
import { HoloPanel } from "@/components/experience/HoloPanel";
import { M, additive, badgeTex, canvasTexture, mapTex, ringsTex, seeded, symbolTex, useGate } from "@/components/experience/helpers";

const R = 5.4;

/* ------------------------------------------------------------ island base */

function IslandBase({ accent }: { accent: string }) {
  const rocks = useRef<THREE.Group>(null);
  const data = useMemo(() => {
    const rnd = seeded(Math.round(accent.charCodeAt(2) * 31));
    return Array.from({ length: 7 }, () => ({
      x: (rnd() - 0.5) * R * 1.5,
      y: -2.2 - rnd() * 3.6,
      z: (rnd() - 0.5) * R * 1.5,
      s: 0.22 + rnd() * 0.5,
      ph: rnd() * 6,
    }));
  }, [accent]);
  const glow = useMemo(() => additive(accent, 0.35), [accent]);

  useFrame((state) => {
    if (!rocks.current || story.reduced) return;
    const t = state.clock.elapsedTime;
    rocks.current.children.forEach((c, i) => {
      c.position.y = data[i].y + Math.sin(t * 0.6 + data[i].ph) * 0.18;
      c.rotation.y += 0.004;
    });
  });

  return (
    <>
      <mesh position={[0, -0.25, 0]} material={M.floor}>
        <cylinderGeometry args={[R, R * 1.03, 0.5, 56]} />
      </mesh>
      <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[R - 0.12, 56]} />
        <meshStandardMaterial map={ringsTex(accent)} roughness={0.5} metalness={0.4} emissive={accent} emissiveMap={ringsTex(accent)} emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[R - 0.08, R + 0.02, 80]} />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.5 - R * 0.62, 0]} rotation={[Math.PI, 0, 0]} material={M.rock}>
        <coneGeometry args={[R * 0.99, R * 1.25, 9, 1]} />
      </mesh>
      <mesh position={[0, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]} material={glow}>
        <circleGeometry args={[R * 0.9, 40]} />
      </mesh>
      <group ref={rocks}>
        {data.map((r, i) => (
          <mesh key={i} position={[r.x, r.y, r.z]} scale={r.s} material={M.rock}>
            <dodecahedronGeometry args={[1, 0]} />
          </mesh>
        ))}
      </group>
    </>
  );
}

/* -------------------------------------------------- Study Group Hub (House & Materials) */

const studyHubSignTex = (color = "#5ab0ff") =>
  canvasTexture(`study-hub-sign-${color}`, 800, 240, (ctx, w, h) => {
    // dark futuristic glass panel
    ctx.fillStyle = "rgba(7, 12, 25, 0.95)";
    ctx.fillRect(0, 0, w, h);

    // outer neon frame
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.strokeRect(12, 12, w - 24, h - 24);

    // corner brackets
    ctx.lineWidth = 8;
    const len = 34;
    ctx.beginPath(); ctx.moveTo(8, 8 + len); ctx.lineTo(8, 8); ctx.lineTo(8 + len, 8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w - 8 - len, 8); ctx.lineTo(w - 8, 8); ctx.lineTo(w - 8, 8 + len); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(8, h - 8 - len); ctx.lineTo(8, h - 8); ctx.lineTo(8 + len, h - 8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w - 8 - len, h - 8); ctx.lineTo(w - 8, h - 8); ctx.lineTo(w - 8, h - 8 - len); ctx.stroke();

    // glowing top pill badge
    ctx.fillStyle = color;
    ctx.fillRect(w / 2 - 165, 22, 330, 26);
    ctx.fillStyle = "#060a16";
    ctx.font = "800 13px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("STUDENT LEARNING ECOSYSTEM", w / 2, 40);

    // Main title: STUDY GROUP HUB
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 46px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("STUDY GROUP HUB", w / 2, 112);

    // Subtitle: 20,000+ LEARNERS • NOTES • SYLLABUS • EXAM PORTAL
    ctx.fillStyle = color;
    ctx.font = "700 19px system-ui, sans-serif";
    ctx.fillText("20,000+ ACTIVE LEARNERS  •  DIGITAL NOTES & EXAM PORTAL", w / 2, 154);

    // Bottom tagline
    ctx.fillStyle = "rgba(226, 232, 240, 0.65)";
    ctx.font = "600 13px monospace";
    ctx.fillText("FULL-STACK MERN ARCHITECTURE  •  HANDWRITTEN & PREP MODULES", w / 2, 194);
  });

const codingScreenTex = (color = "#5ab0ff") =>
  canvasTexture(`study-hub-coding-${color}`, 1024, 640, (ctx, w, h) => {
    ctx.fillStyle = "#080d1a";
    ctx.fillRect(0, 0, w, h);

    // window header bar
    ctx.fillStyle = "#050812";
    ctx.fillRect(0, 0, w, 46);

    // mac style traffic light dots
    ctx.fillStyle = "#ff5f56";
    ctx.beginPath(); ctx.arc(28, 23, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ffbd2e";
    ctx.beginPath(); ctx.arc(48, 23, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#27c93f";
    ctx.beginPath(); ctx.arc(68, 23, 7, 0, Math.PI * 2); ctx.fill();

    // active tab
    ctx.fillStyle = "#101a33";
    ctx.fillRect(100, 8, 250, 38);
    ctx.fillStyle = color;
    ctx.fillRect(100, 44, 250, 2);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "600 15px monospace";
    ctx.textAlign = "left";
    ctx.fillText("⚛ StudyGroupHub.jsx", 118, 32);

    // second inactive tab
    ctx.fillStyle = "#64748b";
    ctx.font = "500 15px monospace";
    ctx.fillText("📄 notes.controller.ts", 375, 32);
    ctx.fillText("⚡ server.js", 605, 32);

    // sidebar line numbers divider
    ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
    ctx.fillRect(0, 46, 52, h - 84);

    const lines = [
      { num: "01", text: "// Study Group Hub - 20,000+ Active Students", color: "#64748b" },
      { num: "02", text: "import { Router, verifyJWT } from '@studygrouphub/core';", color: "#c084fc" },
      { num: "03", text: "import { NotesModel, SyllabusDB } from '@/database';", color: "#38bdf8" },
      { num: "04", text: "", color: "" },
      { num: "05", text: "export async function distributeNotes(req, res) {", color: "#fbbf24" },
      { num: "06", text: "  const { branch, semester, subjectCode } = req.params;", color: "#e2e8f0" },
      { num: "07", text: "  const user = await verifyJWT(req.headers.authorization);", color: "#38bdf8" },
      { num: "08", text: "  if (!user.isEnrolled) return res.status(401).json('Denied');", color: "#f87171" },
      { num: "09", text: "  ", color: "" },
      { num: "10", text: "  // Fetch categorized handwritten notes & exam papers", color: "#64748b" },
      { num: "11", text: "  const notes = await NotesModel.find({ branch, semester })", color: "#34d399" },
      { num: "12", text: "    .select('title unit pdfUrl downloads upvotes')", color: "#a78bfa" },
      { num: "13", text: "    .sort({ downloads: -1 });", color: "#a78bfa" },
      { num: "14", text: "  ", color: "" },
      { num: "15", text: "  console.log(`[HUB] Dispatched ${notes.length} notes to ${user.name}`);", color: "#38bdf8" },
      { num: "16", text: "  return res.json({ success: true, count: 20450, notes });", color: "#4ade80" },
      { num: "17", text: "}", color: "#fbbf24" },
    ];

    ctx.font = "14px monospace";
    lines.forEach((l, i) => {
      const y = 76 + i * 29;
      ctx.fillStyle = "#475569";
      ctx.fillText(l.num, 14, y);
      if (l.text) {
        ctx.fillStyle = l.color;
        ctx.fillText(l.text, 68, y);
      }
    });

    // blinking cursor box
    ctx.fillStyle = color;
    ctx.fillRect(505, 76 + 16 * 29 - 14, 9, 18);

    // status bar
    ctx.fillStyle = "#050812";
    ctx.fillRect(0, h - 38, w, 38);
    ctx.fillStyle = color;
    ctx.fillRect(0, h - 38, w, 1);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "600 13px monospace";
    ctx.fillText("✓ PRETTIER  |  UTF-8  |  TypeScript React  |  MongoDB: CONNECTED (20,000+ USERS)", 16, h - 14);
  });

const studySheetTex = (title: string, badge: string, subtitle: string, color = "#5ab0ff") =>
  canvasTexture(`study-sheet-${title}-${color}`, 420, 560, (ctx, w, h) => {
    ctx.fillStyle = "rgba(8, 14, 28, 0.94)";
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, w - 20, h - 20);

    ctx.fillStyle = color;
    ctx.fillRect(20, 20, 140, 26);
    ctx.fillStyle = "#050a16";
    ctx.font = "800 12px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(badge, 90, 37);

    ctx.fillStyle = "#ffffff";
    ctx.font = "800 24px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(title, 22, 85);

    ctx.fillStyle = color;
    ctx.font = "600 14px system-ui, sans-serif";
    ctx.fillText(subtitle, 22, 114);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(22, 132); ctx.lineTo(w - 22, 132); ctx.stroke();

    ctx.fillStyle = "rgba(226, 232, 240, 0.88)";
    ctx.font = "14px monospace";
    const notes = [
      "▸ UNIT 1: Core Architecture",
      "▸ UNIT 2: RESTful Routing & APIs",
      "▸ UNIT 3: MongoDB Aggregations",
      "▸ UNIT 4: JWT & RBAC Security",
      "▸ UNIT 5: Scalable Performance",
      "──────────────────────────",
      "★ Verified by 20k+ Students",
      "★ Solved Exam Papers & PYQs",
      "★ Handwritten Study Summaries",
    ];
    notes.forEach((nt, i) => {
      ctx.fillText(nt, 24, 168 + i * 36);
    });

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(w - 126, h - 58, 102, 34);
    ctx.fillStyle = color;
    ctx.font = "700 12px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("STUDY HUB", w - 75, h - 37);
  });

function StudyGroupHubWorld({ accent }: { accent: string }) {
  const sheets = useRef<THREE.Group>(null);
  const openBook = useRef<THREE.Group>(null);
  const screenGlow = useRef<THREE.MeshBasicMaterial>(null);

  const shelfBooks = useMemo(() => {
    const bookColors = [
      "#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b",
      "#ec4899", "#6366f1", "#14b8a6", "#38bdf8", "#e2e8f0"
    ];
    const shelves = [0.38, 0.98, 1.58];
    const list: Array<{ x: number; y: number; z: number; w: number; h: number; d: number; color: string; tilt: number }> = [];
    shelves.forEach((shelfY, sIdx) => {
      let curX = -0.96;
      const maxX = 0.96;
      let i = 0;
      while (curX < maxX) {
        const w = 0.08 + (Math.sin(sIdx * 5 + i * 3) * 0.5 + 0.5) * 0.06;
        const h = 0.36 + (Math.cos(sIdx * 3 + i * 7) * 0.5 + 0.5) * 0.16;
        const d = 0.32;
        const color = bookColors[(sIdx * 4 + i) % bookColors.length];
        const tilt = i % 6 === 5 ? 0.16 : 0;
        list.push({ x: curX + w / 2, y: shelfY + h / 2, z: 0, w, h, d, color, tilt });
        curX += w + 0.02;
        i++;
      }
    });
    return list;
  }, []);

  const sheetSpecs = useMemo(
    () => [
      { title: "DSA & Algorithms", badge: "EXAM NOTES", sub: "20k+ Downloads • Unit 1-5", x: -2.6, y: 1.8, z: 0.8, ry: 0.45 },
      { title: "Full-Stack MERN", badge: "DEV GUIDE", sub: "React, Node, Express, Mongo", x: 2.8, y: 2.1, z: 0.6, ry: -0.5 },
      { title: "Operating Systems", badge: "B.TECH PREP", sub: "Solved Papers & PYQs", x: -2.3, y: 2.4, z: -1.2, ry: 0.3 },
      { title: "Database Systems", badge: "DBMS NOTES", sub: "SQL & NoSQL Architecture", x: 2.5, y: 1.6, z: -1.0, ry: -0.35 },
      { title: "Syllabus Explorer", badge: "CURRICULUM", sub: "Diploma & Engineering", x: 0.2, y: 3.3, z: -2.2, ry: 0.1 },
    ],
    [],
  );

  const beamMat = useMemo(() => additive(accent, 0.15), [accent]);
  const pageMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#f8fafc", emissive: accent, emissiveIntensity: 0.45, side: THREE.DoubleSide, roughness: 0.5 }),
    [accent],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const calm = story.reduced ? 0 : 1;

    // floating study sheets motion
    sheets.current?.children.forEach((c, i) => {
      c.position.y = sheetSpecs[i].y + Math.sin(t * 0.9 + i * 1.1) * 0.15 * calm;
      c.rotation.y = sheetSpecs[i].ry + Math.sin(t * 0.5 + i) * 0.08 * calm;
    });

    // open reading book floating glow motion
    if (openBook.current) {
      openBook.current.position.y = 0.76 + Math.sin(t * 1.2) * 0.04 * calm;
    }

    // screen glow breathing
    if (screenGlow.current) {
      screenGlow.current.opacity = 0.8 + 0.2 * Math.sin(t * 3);
    }
  });

  return (
    <group position={[0.6, 0, -0.4]}>
      {/* -------------------- House Structure -------------------- */}

      {/* Modern Floor Deck with illuminated trim */}
      <mesh position={[0, 0.08, 0]} material={M.dark}>
        <boxGeometry args={[4.6, 0.16, 3.4]} />
      </mesh>
      <mesh position={[0, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.5, 3.3]} />
        <meshStandardMaterial color="#0c1322" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Floor border neon line */}
      <mesh position={[0, 0.175, 1.64]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.5, 0.03]} />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </mesh>

      {/* Back Wall (solid dark slate panel) */}
      <mesh position={[0, 1.35, -1.6]} material={M.dark}>
        <boxGeometry args={[4.6, 2.4, 0.14]} />
      </mesh>
      <mesh position={[0, 1.35, -1.52]}>
        <planeGeometry args={[4.4, 2.3]} />
        <meshStandardMaterial color="#080d19" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* 4 Corner Architecture Pillars */}
      {[
        [-2.2, 1.35, -1.55],
        [2.2, 1.35, -1.55],
        [-2.2, 1.35, 1.55],
        [2.2, 1.35, 1.55],
      ].map(([px, py, pz], idx) => (
        <group key={idx} position={[px, py, pz]}>
          <mesh material={M.dark}>
            <boxGeometry args={[0.2, 2.4, 0.2]} />
          </mesh>
          <mesh position={[0, 0, 0.105]}>
            <planeGeometry args={[0.04, 2.3]} />
            <meshBasicMaterial color={accent} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* Left Glass Window Wall */}
      <mesh position={[-2.2, 1.35, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[3.0, 2.2]} />
        <meshStandardMaterial color="#35e0ff" transparent opacity={0.15} roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Right Glass Window Wall */}
      <mesh position={[2.2, 1.35, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[3.0, 2.2]} />
        <meshStandardMaterial color="#35e0ff" transparent opacity={0.15} roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Slanted Cantilever Roof */}
      <mesh position={[0, 2.62, 0]} material={M.dark}>
        <boxGeometry args={[4.8, 0.14, 3.6]} />
      </mesh>
      {/* Roof Skylight in the center */}
      <mesh position={[0, 2.65, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.6, 1.8]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.25} roughness={0.1} />
      </mesh>
      {/* Front Roof Neon Edge Trim */}
      <mesh position={[0, 2.62, 1.81]}>
        <boxGeometry args={[4.82, 0.04, 0.04]} />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </mesh>

      {/* -------------------- House Signboard -------------------- */}
      <group position={[0, 2.9, 1.76]}>
        {/* Backing plate */}
        <mesh material={M.dark}>
          <boxGeometry args={[3.3, 0.98, 0.08]} />
        </mesh>
        {/* Glowing border */}
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[3.24, 0.92]} />
          <meshBasicMaterial map={studyHubSignTex(accent)} toneMapped={false} />
        </mesh>
        {/* Sign support brackets */}
        <mesh position={[-1.2, -0.45, -0.1]} material={M.dark}>
          <cylinderGeometry args={[0.03, 0.03, 0.3]} />
        </mesh>
        <mesh position={[1.2, -0.45, -0.1]} material={M.dark}>
          <cylinderGeometry args={[0.03, 0.03, 0.3]} />
        </mesh>
      </group>

      {/* -------------------- Study Materials: Bookshelf -------------------- */}
      <group position={[-0.85, 0.16, -1.35]}>
        {/* Bookshelf Frame (dark casing with 3 shelves) */}
        <mesh position={[0, 1.05, 0]} material={M.dark}>
          <boxGeometry args={[2.14, 2.05, 0.38]} />
        </mesh>
        {/* Inner cavity */}
        <mesh position={[0, 1.05, 0.03]}>
          <boxGeometry args={[2.02, 1.95, 0.34]} />
          <meshStandardMaterial color="#0b1120" roughness={0.8} />
        </mesh>
        {/* Shelf dividers */}
        {[0.4, 1.0, 1.6].map((sy, i) => (
          <mesh key={i} position={[0, sy, 0.03]} material={M.dark}>
            <boxGeometry args={[2.02, 0.04, 0.34]} />
          </mesh>
        ))}

        {/* 30+ Books across the 3 shelves */}
        {shelfBooks.map((b, i) => (
          <group key={i} position={[b.x, b.y, b.z + 0.02]} rotation={[0, 0, b.tilt]}>
            <RoundedBox args={[b.w, b.h, b.d]} radius={0.01} smoothness={1}>
              <meshStandardMaterial color={b.color} roughness={0.4} metalness={0.2} />
            </RoundedBox>
            {/* White pages edge */}
            <mesh position={[0, 0, 0.01]}>
              <boxGeometry args={[b.w * 0.85, b.h * 0.92, 0.02]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
            </mesh>
          </group>
        ))}

        {/* Stack of horizontal binders on top right shelf */}
        <group position={[0.72, 1.66, 0.03]}>
          {[0, 1, 2].map((k) => (
            <mesh key={k} position={[0, 0.03 + k * 0.06, 0]}>
              <boxGeometry args={[0.42, 0.05, 0.3]} />
              <meshStandardMaterial color={k === 1 ? accent : "#334155"} roughness={0.5} />
            </mesh>
          ))}
        </group>
      </group>

      {/* -------------------- Coding Workstation -------------------- */}
      <group position={[-0.45, 0.16, 0.45]} rotation={[0, 0.15, 0]}>
        {/* Modern Desk */}
        <mesh position={[0, 0.72, 0]} material={M.dark}>
          <boxGeometry args={[1.7, 0.06, 0.85]} />
        </mesh>
        {/* Metallic Desk Legs */}
        {[-0.78, 0.78].map((lx, idx) => (
          <mesh key={idx} position={[lx, 0.36, 0]} material={M.dark}>
            <boxGeometry args={[0.06, 0.72, 0.7]} />
          </mesh>
        ))}

        {/* Ultrawide Curved Coding Monitor */}
        <group position={[0, 0.75, -0.15]}>
          {/* Monitor Stand */}
          <mesh position={[0, 0.15, -0.05]} material={M.dark}>
            <cylinderGeometry args={[0.03, 0.04, 0.32, 16]} />
          </mesh>
          <mesh position={[0, 0.01, -0.02]} material={M.dark}>
            <cylinderGeometry args={[0.18, 0.2, 0.02, 24]} />
          </mesh>

          {/* Monitor Bezel */}
          <mesh position={[0, 0.52, 0]} material={M.dark}>
            <boxGeometry args={[1.44, 0.82, 0.05]} />
          </mesh>
          {/* Active Coding Screen */}
          <mesh position={[0, 0.52, 0.028]}>
            <planeGeometry args={[1.4, 0.78]} />
            <meshBasicMaterial ref={screenGlow} map={codingScreenTex(accent)} toneMapped={false} />
          </mesh>
          {/* Rear Ambient Glow Strip */}
          <mesh position={[0, 0.52, -0.028]}>
            <planeGeometry args={[1.36, 0.74]} />
            <meshBasicMaterial color={accent} transparent opacity={0.3} />
          </mesh>
        </group>

        {/* Mechanical Keyboard with Backlit Keys */}
        <group position={[0, 0.76, 0.16]}>
          <mesh material={M.dark}>
            <boxGeometry args={[0.62, 0.02, 0.22]} />
          </mesh>
          <mesh position={[0, 0.012, 0]}>
            <planeGeometry args={[0.58, 0.18]} />
            <meshBasicMaterial color={accent} transparent opacity={0.7} />
          </mesh>
        </group>

        {/* Mouse */}
        <mesh position={[0.42, 0.76, 0.16]} material={M.dark}>
          <boxGeometry args={[0.09, 0.025, 0.14]} />
        </mesh>

        {/* Desk Task Lamp */}
        <group position={[-0.72, 0.75, -0.2]}>
          <mesh position={[0, 0.01, 0]} material={M.dark}>
            <cylinderGeometry args={[0.07, 0.08, 0.02]} />
          </mesh>
          <mesh position={[0, 0.28, 0]} material={M.dark}>
            <cylinderGeometry args={[0.018, 0.018, 0.54]} />
          </mesh>
          <mesh position={[0.12, 0.54, 0.08]} rotation={[0.4, 0, 0.3]} material={M.dark}>
            <coneGeometry args={[0.08, 0.14, 16]} />
          </mesh>
          <mesh position={[0.12, 0.5, 0.08]}>
            <sphereGeometry args={[0.03, 12, 8]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
        </group>

        {/* Coffee Mug */}
        <group position={[0.65, 0.75, -0.15]}>
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.05, 0.045, 0.12, 16]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.042, 16]} />
            <meshStandardMaterial color="#3b1d11" roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* -------------------- Reading Area & Open Book -------------------- */}
      <group position={[1.25, 0.16, 0.35]}>
        {/* Round Study Table */}
        <mesh position={[0, 0.68, 0]} material={M.dark}>
          <cylinderGeometry args={[0.62, 0.62, 0.05, 32]} />
        </mesh>
        <mesh position={[0, 0.34, 0]} material={M.dark}>
          <cylinderGeometry args={[0.06, 0.08, 0.68, 16]} />
        </mesh>
        <mesh position={[0, 0.01, 0]} material={M.dark}>
          <cylinderGeometry args={[0.35, 0.38, 0.02, 24]} />
        </mesh>

        {/* Open Study Book lying flat */}
        <group ref={openBook} position={[0, 0.72, 0]}>
          {/* Left open page */}
          <mesh position={[-0.22, 0, 0]} rotation={[0, 0, 0.12]} material={pageMat}>
            <planeGeometry args={[0.42, 0.58]} />
          </mesh>
          {/* Right open page */}
          <mesh position={[0.22, 0, 0]} rotation={[0, 0, -0.12]} material={pageMat}>
            <planeGeometry args={[0.42, 0.58]} />
          </mesh>
          {/* Book Spine */}
          <mesh position={[0, -0.01, 0]} material={M.dark}>
            <boxGeometry args={[0.04, 0.03, 0.6]} />
          </mesh>
          {/* Upward beam of learning light */}
          <mesh position={[0, 0.6, 0]} material={beamMat}>
            <cylinderGeometry args={[0.45, 0.08, 1.2, 16, 1, true]} />
          </mesh>
        </group>

        {/* Stack of Study Notes Beside the Book */}
        <group position={[0.34, 0.71, 0.22]} rotation={[0, 0.3, 0]}>
          {[0, 1, 2, 3].map((k) => (
            <mesh key={k} position={[0, 0.01 + k * 0.02, 0]}>
              <boxGeometry args={[0.26, 0.018, 0.34]} />
              <meshStandardMaterial color={k === 1 ? accent : "#f8fafc"} roughness={0.7} />
            </mesh>
          ))}
        </group>
      </group>

      {/* -------------------- Floating Study Material Sheets -------------------- */}
      <group ref={sheets}>
        {sheetSpecs.map((s, idx) => (
          <mesh key={idx} position={[s.x, s.y, s.z]}>
            <planeGeometry args={[0.82, 1.1]} />
            <meshBasicMaterial
              map={studySheetTex(s.title, s.badge, s.sub, accent)}
              toneMapped={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* Ambient Knowledge Sparkles inside Hub */}
      <Sparkles
        count={story.lite ? 16 : 36}
        scale={[3.8, 2.2, 2.8]}
        position={[0, 1.4, 0]}
        size={3.2}
        speed={0.6}
        color={accent}
      />
    </group>
  );
}

// Backward-compatible alias for any legacy references
function QuizWorld({ accent }: { accent: string }) {
  return <StudyGroupHubWorld accent={accent} />;
}

/* -------------------------------------------------- WeatherGPT (SIH 2026) - Storm & Rain */

const weatherGptScreenTex = (color = "#38bdf8") =>
  canvasTexture(`weathergpt-screen-${color}`, 1024, 640, (ctx, w, h) => {
    // dark futuristic terminal background
    ctx.fillStyle = "#070c18";
    ctx.fillRect(0, 0, w, h);

    // outer cyber frame
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, w - 20, h - 20);

    // Top window bar
    ctx.fillStyle = "#040710";
    ctx.fillRect(10, 10, w - 20, 48);

    ctx.fillStyle = "#ef4444";
    ctx.beginPath(); ctx.arc(36, 34, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath(); ctx.arc(58, 34, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#10b981";
    ctx.beginPath(); ctx.arc(80, 34, 7, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "800 18px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("⚡ WeatherGPT (SIH 2026) • SMART INDIA HACKATHON", 110, 39);

    ctx.fillStyle = color;
    ctx.font = "700 13px monospace";
    ctx.textAlign = "right";
    ctx.fillText("CONVERSATIONAL METEOROLOGY AI v2.4", w - 30, 39);

    // Emergency storm banner (pulsing warning)
    ctx.fillStyle = "rgba(220, 38, 38, 0.35)";
    ctx.fillRect(24, 72, w - 48, 54);
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.strokeRect(24, 72, w - 48, 54);

    ctx.fillStyle = "#ef4444";
    ctx.font = "900 18px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("⚠ SEVERE THUNDERSTORM & HEAVY RAINFALL WARNING", 44, 98);

    ctx.fillStyle = "#fecaca";
    ctx.font = "600 13px system-ui, sans-serif";
    ctx.fillText("Convective squall line active • Intense cloud-to-ground lightning • Torrential downpour alert", 44, 116);

    // Left column: Conversational AI prompt/response
    ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
    ctx.fillRect(24, 138, 520, 422);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.strokeRect(24, 138, 520, 422);

    ctx.fillStyle = color;
    ctx.font = "700 15px system-ui, sans-serif";
    ctx.fillText("💬 Natural Language Weather Assistant", 40, 166);

    // Chat Bubble 1 (User)
    ctx.fillStyle = "rgba(30, 41, 59, 0.9)";
    ctx.fillRect(40, 184, 480, 52);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "600 11px monospace";
    ctx.fillText("USER QUERY:", 52, 202);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "600 14px system-ui, sans-serif";
    ctx.fillText('"WeatherGPT, will it storm during SIH 2026 hackathon?"', 52, 224);

    // Chat Bubble 2 (WeatherGPT AI)
    ctx.fillStyle = "rgba(12, 74, 110, 0.45)";
    ctx.fillRect(40, 248, 480, 142);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 248, 480, 142);

    ctx.fillStyle = color;
    ctx.font = "700 11px monospace";
    ctx.fillText("WEATHERGPT AI (FastAPI + Deep Weather Models):", 52, 268);
    ctx.fillStyle = "#f1f5f9";
    ctx.font = "500 13px system-ui, sans-serif";
    ctx.fillText("▸ Severe squall line detected over local coordinates.", 52, 292);
    ctx.fillText("▸ Rainfall Rate: 58 mm/hr with heavy gusts (65 km/h NW).", 52, 314);
    ctx.fillText("▸ 32 Cloud-to-Ground lightning strikes logged in 10 mins.", 52, 336);
    ctx.fillText("▸ Advisory: Remain indoors; automated emergency alert active.", 52, 358);

    // Architecture badge
    ctx.fillStyle = "#091020";
    ctx.fillRect(40, 404, 480, 138);
    ctx.strokeStyle = "rgba(56, 189, 248, 0.3)";
    ctx.strokeRect(40, 404, 480, 138);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "700 13px monospace";
    ctx.fillText("FULL-STACK ARCHITECTURE", 52, 426);
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "12px monospace";
    ctx.fillText("• Backend: Python FastAPI Microservice & Async Queues", 52, 450);
    ctx.fillText("• AI Engine: Natural Language Weather & Intent NLP", 52, 472);
    ctx.fillText("• Frontend: React.js, Tailwind CSS, Live Climate Cards", 52, 494);
    ctx.fillText("• Radar APIs: Open-Meteo, Radar Doppler, Alert Webhooks", 52, 516);

    // Right column: Live Doppler Radar
    ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
    ctx.fillRect(560, 138, 440, 422);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.strokeRect(560, 138, 440, 422);

    ctx.fillStyle = color;
    ctx.font = "700 15px system-ui, sans-serif";
    ctx.fillText("📡 Live Doppler Radar Reflectivity", 576, 166);

    // Radar circle
    const rcx = 780;
    const rcy = 308;
    const rrad = 120;
    ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
    ctx.lineWidth = 1;
    for (let r = 30; r <= rrad; r += 30) {
      ctx.beginPath(); ctx.arc(rcx, rcy, r, 0, Math.PI * 2); ctx.stroke();
    }
    // Crosshairs
    ctx.beginPath(); ctx.moveTo(rcx - rrad, rcy); ctx.lineTo(rcx + rrad, rcy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(rcx, rcy - rrad); ctx.lineTo(rcx, rcy + rrad); ctx.stroke();

    // Storm cells on radar (convective squall line)
    ctx.fillStyle = "rgba(239, 68, 68, 0.75)";
    ctx.beginPath(); ctx.arc(rcx + 24, rcy - 16, 42, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(245, 158, 11, 0.75)";
    ctx.beginPath(); ctx.arc(rcx - 10, rcy + 22, 48, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(34, 197, 94, 0.45)";
    ctx.beginPath(); ctx.arc(rcx - 28, rcy - 32, 34, 0, Math.PI * 2); ctx.fill();

    // Sweep line
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(rcx, rcy); ctx.lineTo(rcx + rrad * 0.72, rcy - rrad * 0.72); ctx.stroke();

    // Radar metrics
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 13px monospace";
    ctx.fillText("RAIN: 58 mm/hr", 580, 468);
    ctx.fillText("WIND: 65 km/h NW", 580, 494);
    ctx.fillText("PRESSURE: 986 hPa", 780, 468);
    ctx.fillText("STATUS: SEVERE STORM", 780, 494);

    // Bottom status bar
    ctx.fillStyle = "#050812";
    ctx.fillRect(10, h - 38, w - 20, 28);
    ctx.fillStyle = color;
    ctx.font = "600 12px monospace";
    ctx.fillText("● DOPPLER LIVE  |  SIH 2026 OFFICIAL ENTRY  |  PREMJEET  |  FASTAPI BACKEND", 24, h - 20);
  });

/* -------------------- 3D Rain Particle System -------------------- */

const RAIN_COUNT = 1200;

function RainSystem() {
  const geomRef = useRef<THREE.BufferGeometry>(null);
  const posArray = useMemo(() => {
    const arr = new Float32Array(RAIN_COUNT * 6);
    for (let i = 0; i < RAIN_COUNT; i++) {
      const x = (Math.random() - 0.5) * 12;
      const y = Math.random() * 9;
      const z = (Math.random() - 0.5) * 12;
      const len = 0.45 + Math.random() * 0.35;
      const windX = -0.12;
      arr[i * 6 + 0] = x;
      arr[i * 6 + 1] = y;
      arr[i * 6 + 2] = z;
      arr[i * 6 + 3] = x + windX;
      arr[i * 6 + 4] = y + len;
      arr[i * 6 + 5] = z;
    }
    return arr;
  }, []);

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const speed = 22 * dt;
    const wind = -2.8 * dt;
    const arr = posArray;
    for (let i = 0; i < RAIN_COUNT; i++) {
      const idx = i * 6;
      arr[idx + 1] -= speed;
      arr[idx + 4] -= speed;
      arr[idx + 0] += wind;
      arr[idx + 3] += wind;

      // Ground collision: reset to top of storm clouds
      if (arr[idx + 1] < -0.1) {
        const x = (Math.random() - 0.5) * 12 + 1.2;
        const y = 8.0 + Math.random() * 2.0;
        const z = (Math.random() - 0.5) * 12;
        const len = 0.45 + Math.random() * 0.35;
        const windX = -0.12;
        arr[idx + 0] = x;
        arr[idx + 1] = y;
        arr[idx + 2] = z;
        arr[idx + 3] = x + windX;
        arr[idx + 4] = y + len;
        arr[idx + 5] = z;
      }
    }
    if (geomRef.current) {
      geomRef.current.attributes.position.needsUpdate = true;
    }
  });

  return (
    <lineSegments>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach="attributes-position" args={[posArray, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#93c5fd" transparent opacity={0.65} depthWrite={false} blending={THREE.AdditiveBlending} />
    </lineSegments>
  );
}

/* -------------------- 3D Procedural Branching Lightning -------------------- */

function LightningBolt({ active, target = [1.2, 2.7, -0.5] }: { active: boolean; target?: [number, number, number] }) {
  const lineRef = useRef<THREE.LineSegments>(null);
  const flashLight = useRef<THREE.PointLight>(null);
  const segments = 12;
  const boltPositions = useMemo(() => new Float32Array(44 * 3), []);

  useFrame(() => {
    if (!active) {
      if (lineRef.current) lineRef.current.visible = false;
      if (flashLight.current) flashLight.current.intensity = 0;
      return;
    }
    if (lineRef.current) lineRef.current.visible = true;
    if (flashLight.current) flashLight.current.intensity = 85;

    const startX = 0.2 + (Math.random() - 0.5) * 0.4;
    const startY = 6.0;
    const startZ = -0.4 + (Math.random() - 0.5) * 0.4;

    let curX = startX;
    let curY = startY;
    let curZ = startZ;
    let ptr = 0;

    for (let i = 0; i < segments; i++) {
      const frac = (i + 1) / segments;
      const targetX = startX + (target[0] - startX) * frac;
      const targetY = startY + (target[1] - startY) * frac;
      const targetZ = startZ + (target[2] - startZ) * frac;

      const jitter = (1 - frac) * 0.45;
      const nextX = i === segments - 1 ? target[0] : targetX + (Math.random() - 0.5) * jitter;
      const nextY = i === segments - 1 ? target[1] : targetY;
      const nextZ = i === segments - 1 ? target[2] : targetZ + (Math.random() - 0.5) * jitter;

      boltPositions[ptr++] = curX;
      boltPositions[ptr++] = curY;
      boltPositions[ptr++] = curZ;
      boltPositions[ptr++] = nextX;
      boltPositions[ptr++] = nextY;
      boltPositions[ptr++] = nextZ;

      curX = nextX;
      curY = nextY;
      curZ = nextZ;
    }

    // Branch 1
    let b1X = boltPositions[12];
    let b1Y = boltPositions[13];
    let b1Z = boltPositions[14];
    for (let k = 0; k < 5; k++) {
      const nX = b1X - 0.35 + (Math.random() - 0.5) * 0.3;
      const nY = b1Y - 0.38 + (Math.random() - 0.5) * 0.2;
      const nZ = b1Z + 0.3 + (Math.random() - 0.5) * 0.3;
      boltPositions[ptr++] = b1X; boltPositions[ptr++] = b1Y; boltPositions[ptr++] = b1Z;
      boltPositions[ptr++] = nX; boltPositions[ptr++] = nY; boltPositions[ptr++] = nZ;
      b1X = nX; b1Y = nY; b1Z = nZ;
    }

    // Branch 2
    let b2X = boltPositions[36];
    let b2Y = boltPositions[37];
    let b2Z = boltPositions[38];
    for (let k = 0; k < 5; k++) {
      const nX = b2X + 0.4 + (Math.random() - 0.5) * 0.3;
      const nY = b2Y - 0.35 + (Math.random() - 0.5) * 0.2;
      const nZ = b2Z - 0.25 + (Math.random() - 0.5) * 0.3;
      boltPositions[ptr++] = b2X; boltPositions[ptr++] = b2Y; boltPositions[ptr++] = b2Z;
      boltPositions[ptr++] = nX; boltPositions[ptr++] = nY; boltPositions[ptr++] = nZ;
      b2X = nX; b2Y = nY; b2Z = nZ;
    }

    if (lineRef.current) {
      lineRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[boltPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" linewidth={3} transparent opacity={0.95} blending={THREE.AdditiveBlending} />
      </lineSegments>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[boltPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#38bdf8" linewidth={6} transparent opacity={0.5} blending={THREE.AdditiveBlending} />
      </lineSegments>
      <pointLight ref={flashLight} position={target} distance={18} color="#e0f2fe" decay={2} />
    </group>
  );
}

/* -------------------- Rain Splash Rings on Deck -------------------- */

function RainSplashes() {
  const ripples = useRef<THREE.Group>(null);
  const spots = useMemo(
    () => [
      [-1.8, -0.6], [0.8, -1.2], [-0.4, 1.4], [1.6, 0.8],
      [-2.1, 0.7], [2.2, -0.8], [0.1, -1.8], [1.3, 1.6],
    ],
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ripples.current?.children.forEach((c, idx) => {
      const ph = (t * 2.2 + idx * 0.6) % 1;
      c.scale.setScalar(0.4 + ph * 1.6);
      const mat = (c as THREE.Mesh).material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = (1 - ph) * 0.65;
    });
  });

  return (
    <group ref={ripples}>
      {spots.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.08, 0.14, 24]} />
          <meshBasicMaterial color="#bae6fd" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

/* -------------------- Main WeatherGPT World Component -------------------- */

function WeatherGPTWorld({ accent }: { accent: string }) {
  const clouds = useRef<THREE.Group>(null);
  const cloudMat = useRef<THREE.MeshStandardMaterial>(null);
  const radar = useRef<THREE.Group>(null);
  const anemometer = useRef<THREE.Group>(null);
  const beaconLight = useRef<THREE.PointLight>(null);
  const [lightningActive, setLightningActive] = useState(false);

  // Cloud clusters
  const cloudClusters = useMemo(
    () => [
      { x: -1.6, y: 5.6, z: -0.4, s: 1.8 },
      { x: 0.2, y: 6.0, z: 0.1, s: 2.3 },
      { x: 1.8, y: 5.7, z: -0.6, s: 1.9 },
      { x: -0.8, y: 5.3, z: 1.2, s: 1.6 },
      { x: 1.1, y: 5.4, z: 1.0, s: 1.7 },
      { x: 0.0, y: 6.4, z: -1.4, s: 2.1 },
      { x: -2.3, y: 5.2, z: 0.5, s: 1.4 },
      { x: 2.4, y: 5.3, z: -0.2, s: 1.5 },
    ],
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const calm = story.reduced ? 0 : 1;

    // Cloud swirling motion
    if (clouds.current) {
      clouds.current.children.forEach((c, i) => {
        c.position.y = cloudClusters[i].y + Math.sin(t * 0.8 + i) * 0.12 * calm;
        c.rotation.y = t * 0.05 * (i % 2 === 0 ? 1 : -1) * calm;
      });
    }

    // Rotating Doppler Radar
    if (radar.current) {
      radar.current.rotation.y = t * 1.8 * calm;
    }

    // Fast-spinning Anemometer wind cups
    if (anemometer.current) {
      anemometer.current.rotation.y = t * 9.5 * calm;
    }

    // Thunderstorm lightning cycle
    const cycle = (t % 3.4) / 3.4;
    const isFlashing = (cycle >= 0.08 && cycle < 0.11) || (cycle >= 0.12 && cycle < 0.18);
    setLightningActive(isFlashing);

    // Intra-cloud flash luminescence
    if (cloudMat.current) {
      if (isFlashing) {
        cloudMat.current.emissiveIntensity = 2.4;
        cloudMat.current.color.set("#38bdf8");
      } else {
        cloudMat.current.emissiveIntensity = 0.05;
        cloudMat.current.color.set("#0f172a");
      }
    }

    // Warning beacon pulse
    if (beaconLight.current) {
      beaconLight.current.intensity = (Math.sin(t * 5.0) * 0.5 + 0.5) * 16;
    }
  });

  return (
    <>
      {/* -------------------- 3D Rain & Ripples -------------------- */}
      <RainSystem />
      <RainSplashes />

      {/* -------------------- Volumetric Storm Clouds -------------------- */}
      <group ref={clouds}>
        {cloudClusters.map((cl, i) => (
          <mesh key={i} position={[cl.x, cl.y, cl.z]} scale={cl.s}>
            <sphereGeometry args={[0.9, 16, 12]} />
            <meshStandardMaterial
              ref={i === 0 ? cloudMat : undefined}
              color="#0f172a"
              emissive="#38bdf8"
              emissiveIntensity={0.05}
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>
        ))}
      </group>

      {/* -------------------- 3D Branching Lightning Bolt -------------------- */}
      <LightningBolt active={lightningActive} target={[1.2, 2.7, -0.5]} />

      {/* -------------------- Weather Station Deck -------------------- */}
      {/* Octagonal station base */}
      <mesh position={[0, 0.15, 0]} material={M.dark}>
        <cylinderGeometry args={[4.2, 4.4, 0.28, 8]} />
      </mesh>
      {/* Deck top with weather radar ring */}
      <mesh position={[0, 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4.1, 32]} />
        <meshStandardMaterial color="#091222" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Perimeter hazard border */}
      <mesh position={[0, 0.31, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.95, 4.08, 48]} />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </mesh>

      {/* -------------------- Lightning Conductor Mast -------------------- */}
      <group position={[1.2, 0.3, -0.5]}>
        {/* Mast pillar */}
        <mesh position={[0, 1.25, 0]} material={M.dark}>
          <cylinderGeometry args={[0.08, 0.12, 2.5, 16]} />
        </mesh>
        {/* Copper lightning rod tip */}
        <mesh position={[0, 2.55, 0]}>
          <coneGeometry args={[0.07, 0.35, 16]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Corona discharge glow ring */}
        <mesh position={[0, 2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.08, 0.22, 16]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} toneMapped={false} />
        </mesh>

        {/* Fast-spinning Anemometer (wind cups) */}
        <group ref={anemometer} position={[0, 2.2, 0]}>
          <mesh material={M.dark}>
            <cylinderGeometry args={[0.04, 0.04, 0.12]} />
          </mesh>
          {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((ang, k) => (
            <group key={k} rotation={[0, ang, 0]}>
              <mesh position={[0.2, 0, 0]} material={M.dark}>
                <boxGeometry args={[0.4, 0.02, 0.02]} />
              </mesh>
              <mesh position={[0.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <sphereGeometry args={[0.06, 12, 8, 0, Math.PI]} />
                <meshStandardMaterial color="#ffffff" metalness={0.7} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Warning strobe beacon */}
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.14]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.9} />
        </mesh>
        <pointLight ref={beaconLight} position={[0, 0.8, 0]} color="#ef4444" distance={8} decay={2} />
      </group>

      {/* -------------------- Rotating Doppler Weather Radar -------------------- */}
      <group position={[-1.8, 0.3, -1.2]}>
        {/* Radar tower */}
        <mesh position={[0, 0.8, 0]} material={M.dark}>
          <cylinderGeometry args={[0.18, 0.25, 1.6, 16]} />
        </mesh>
        {/* Rotating radar dish assembly */}
        <group ref={radar} position={[0, 1.7, 0]}>
          {/* Dish mounting bracket */}
          <mesh material={M.dark}>
            <boxGeometry args={[0.2, 0.2, 0.2]} />
          </mesh>
          {/* Parabolic radar dish tilted at 25 degrees */}
          <group rotation={[0.4, 0, 0]}>
            <mesh position={[0, 0, 0.15]}>
              <sphereGeometry args={[0.65, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#0e1726" metalness={0.8} roughness={0.2} side={THREE.DoubleSide} />
            </mesh>
            {/* Center radar feed horn */}
            <mesh position={[0, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.06, 0.25, 12]} />
              <meshBasicMaterial color="#38bdf8" toneMapped={false} />
            </mesh>
          </group>
        </group>
      </group>

      {/* -------------------- Holographic WeatherGPT Workstation -------------------- */}
      <group position={[0.2, 0.3, 0.6]}>
        {/* Terminal Pedestal */}
        <mesh position={[0, 0.45, 0]} material={M.dark}>
          <boxGeometry args={[2.5, 0.9, 0.4]} />
        </mesh>
        {/* Main Weather Display */}
        <mesh position={[0, 1.45, 0]} rotation={[-0.08, 0, 0]}>
          <boxGeometry args={[2.7, 1.7, 0.06]} />
          <mesh material={M.dark} />
        </mesh>
        {/* Live WeatherGPT UI Canvas Screen */}
        <mesh position={[0, 1.45, 0.035]} rotation={[-0.08, 0, 0]}>
          <planeGeometry args={[2.64, 1.64]} />
          <meshBasicMaterial map={weatherGptScreenTex(accent)} toneMapped={false} />
        </mesh>
      </group>

      {/* -------------------- Floating Weather Hologram Icon -------------------- */}
      <group position={[-2.4, 2.6, 1.2]} rotation={[0, 0.4, 0]}>
        {/* Hologram cloud */}
        <mesh>
          <sphereGeometry args={[0.35, 16, 12]} />
          <meshBasicMaterial color="#38bdf8" wireframe toneMapped={false} />
        </mesh>
        <mesh position={[0.22, -0.05, 0]}>
          <sphereGeometry args={[0.26, 16, 12]} />
          <meshBasicMaterial color="#38bdf8" wireframe toneMapped={false} />
        </mesh>
        <mesh position={[-0.22, -0.05, 0]}>
          <sphereGeometry args={[0.26, 16, 12]} />
          <meshBasicMaterial color="#38bdf8" wireframe toneMapped={false} />
        </mesh>
        {/* Lightning bolt emblem below cloud */}
        <mesh position={[0, -0.4, 0]} rotation={[0, 0, -0.3]}>
          <coneGeometry args={[0.12, 0.35, 3]} />
          <meshBasicMaterial color="#facc15" toneMapped={false} />
        </mesh>
      </group>

      {/* Ambient weather station sparkles */}
      <Sparkles
        count={story.lite ? 14 : 32}
        scale={[4.2, 3.5, 4.2]}
        position={[0, 2.0, 0]}
        size={3.8}
        speed={0.8}
        color="#38bdf8"
      />
    </>
  );
}

// Backward-compatible alias for TravelWorld
function TravelWorld({ accent }: { accent: string }) {
  return <WeatherGPTWorld accent={accent} />;
}

/* -------------------------------------------------- Secure Vision AI | Privacy-First Browser Agent */

const secureVisionScreenTex = (color = "#ff3366") =>
  canvasTexture(`secure-vision-screen-${color}`, 1024, 640, (ctx, w, h) => {
    // dark cybersecurity terminal
    ctx.fillStyle = "#0a060d";
    ctx.fillRect(0, 0, w, h);

    // outer cyber neon border
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, w - 20, h - 20);

    // top header bar
    ctx.fillStyle = "#050208";
    ctx.fillRect(10, 10, w - 20, 48);

    ctx.fillStyle = "#ff0055";
    ctx.beginPath(); ctx.arc(36, 34, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ffb703";
    ctx.beginPath(); ctx.arc(58, 34, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#00f5d4";
    ctx.beginPath(); ctx.arc(80, 34, 7, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "800 18px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("🛡 SECURE VISION AI | PRIVACY-FIRST BROWSER AGENT", 110, 39);

    ctx.fillStyle = color;
    ctx.font = "700 13px monospace";
    ctx.textAlign = "right";
    ctx.fillText("ON-DEVICE PRIVACY FILTERING • WEBGPU/WASM", w - 30, 39);

    // Alert Banner (Sensitive Data Intercepted)
    ctx.fillStyle = "rgba(255, 0, 85, 0.28)";
    ctx.fillRect(24, 72, w - 48, 54);
    ctx.strokeStyle = "#ff0055";
    ctx.lineWidth = 2;
    ctx.strokeRect(24, 72, w - 48, 54);

    ctx.fillStyle = "#ff3366";
    ctx.font = "900 17px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("⚠ SENSITIVE DATA DETECTED • PRIVACY GUARD HALT & SCAN ACTIVE", 44, 98);

    ctx.fillStyle = "#ffe4e8";
    ctx.font = "600 13px system-ui, sans-serif";
    ctx.fillText("Browser Video Frames Captured ➔ On-Device Vision AI ➔ Real-Time PII Redaction ➔ Safe Context", 44, 116);

    // Left column: Visual UI Inspection & Redaction
    ctx.fillStyle = "rgba(18, 10, 24, 0.94)";
    ctx.fillRect(24, 138, 520, 422);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.strokeRect(24, 138, 520, 422);

    ctx.fillStyle = "#00f5d4";
    ctx.font = "700 15px system-ui, sans-serif";
    ctx.fillText("👁 Live Browser Frame Analysis (WebGPU / ONNX)", 40, 166);

    // Simulated Webpage Frame with Redaction Bounding Boxes
    const piiItems = [
      { label: "PASSWORD FIELD:", raw: "•••••••••••• (SuperSecretKey123)", status: "[REDACTED ON-DEVICE]", color: "#ff0055" },
      { label: "USER EMAIL:", raw: "premjeet.cse****@domain.com", status: "[MASKED ON-DEVICE]", color: "#ffb703" },
      { label: "PHONE / OTP:", raw: "+91-98******10 [TOKEN REDACTED]", status: "[BLOCKED]", color: "#ff0055" },
      { label: "BIOMETRIC FACE:", raw: "Webcam Face Stream Detected", status: "[PII BLURRED 100%]", color: "#00f5d4" },
    ];

    piiItems.forEach((item, idx) => {
      const y = 196 + idx * 48;
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.fillRect(40, y, 488, 40);
      ctx.strokeStyle = item.color;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(40, y, 488, 40);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "600 11px monospace";
      ctx.fillText(item.label, 52, y + 18);

      ctx.fillStyle = "#f8fafc";
      ctx.font = "500 12px monospace";
      ctx.fillText(item.raw, 180, y + 18);

      ctx.fillStyle = item.color;
      ctx.font = "800 11px monospace";
      ctx.textAlign = "right";
      ctx.fillText(item.status, 516, y + 18);
      ctx.textAlign = "left";
    });

    // Sanitized Context Output Box
    ctx.fillStyle = "#081614";
    ctx.fillRect(40, 404, 488, 140);
    ctx.strokeStyle = "#00f5d4";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(40, 404, 488, 140);

    ctx.fillStyle = "#00f5d4";
    ctx.font = "700 13px monospace";
    ctx.fillText("✔ SAFE CONTEXT GENERATED (Ready for Server AI)", 54, 426);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "12px monospace";
    ctx.fillText("{\n  \"action\": \"click_button\",\n  \"target\": \"login_submit\",\n  \"sanitized_context\": \"[SAFE: NO PII TRANSMITTED]\",\n  \"privacy_verified\": true\n}", 54, 448);

    // Right column: The 4 Agents & Pipeline
    ctx.fillStyle = "rgba(18, 10, 24, 0.94)";
    ctx.fillRect(560, 138, 440, 422);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.strokeRect(560, 138, 440, 422);

    ctx.fillStyle = "#ffffff";
    ctx.font = "700 15px system-ui, sans-serif";
    ctx.fillText("🤖 Active Agent Checkpoint Pipeline", 576, 166);

    const agents = [
      { name: "AGENT 1: Live Video / Screen Input", desc: "Captures browser frames with user consent", icon: "📹", color: "#38bdf8" },
      { name: "AGENT 2: On-Device Vision AI", desc: "Local ONNX/Transformers.js visual parsing", icon: "🧠", color: "#b7a4ff" },
      { name: "AGENT 3: Privacy Guard (PII Filter)", desc: "Halts robot & redacts passwords/PII", icon: "🛑", color: "#ff0055" },
      { name: "AGENT 4: Safe Context Gatekeeper", desc: "Validates sanitized context & clears gate", icon: "✅", color: "#00f5d4" },
    ];

    agents.forEach((ag, i) => {
      const ay = 186 + i * 86;
      ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
      ctx.fillRect(576, ay, 408, 74);
      ctx.strokeStyle = ag.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(576, ay, 408, 74);

      ctx.fillStyle = ag.color;
      ctx.font = "800 13px system-ui, sans-serif";
      ctx.fillText(`${ag.icon} ${ag.name}`, 592, ay + 26);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "500 12px system-ui, sans-serif";
      ctx.fillText(ag.desc, 592, ay + 48);

      ctx.fillStyle = ag.color;
      ctx.font = "700 10px monospace";
      ctx.fillText("STATUS: ACTIVE & VERIFYING", 592, ay + 64);
    });

    // Bottom status bar
    ctx.fillStyle = "#050208";
    ctx.fillRect(10, h - 38, w - 20, 28);
    ctx.fillStyle = "#00f5d4";
    ctx.font = "600 12px monospace";
    ctx.fillText("● PRIVACY GUARD ENGAGED  |  0% DATA LEAKAGE  |  CLIENT-SIDE WebGPU  |  PREMJEET", 24, h - 20);
  });

const miniRobotBadgeTex = (label: string, color = "#ff3366") =>
  canvasTexture(`agent-badge-${label}-${color}`, 360, 90, (ctx, w, h) => {
    ctx.fillStyle = "rgba(10, 4, 14, 0.92)";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(4, 4, w - 8, h - 8);

    ctx.fillStyle = color;
    ctx.font = "800 15px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(label, w / 2, 34);

    ctx.fillStyle = "#ffffff";
    ctx.font = "600 12px monospace";
    ctx.fillText("SECURITY AGENT", w / 2, 60);
  });

const checkpointSignTex = (isSafe: boolean) =>
  canvasTexture(`checkpoint-sign-${isSafe ? "safe" : "halt"}`, 680, 160, (ctx, w, h) => {
    ctx.fillStyle = isSafe ? "rgba(4, 24, 20, 0.92)" : "rgba(28, 4, 12, 0.92)";
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = isSafe ? "#00f5d4" : "#ff0055";
    ctx.lineWidth = 4;
    ctx.strokeRect(6, 6, w - 12, h - 12);

    if (isSafe) {
      ctx.fillStyle = "#00f5d4";
      ctx.font = "900 28px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("✔ ACCESS GRANTED • SAFE CONTEXT VERIFIED", w / 2, 62);

      ctx.fillStyle = "#ffffff";
      ctx.font = "600 16px monospace";
      ctx.fillText("ALL PII REDACTED ON-DEVICE • PASSING SECURITY GATE", w / 2, 105);
    } else {
      ctx.fillStyle = "#ff0055";
      ctx.font = "900 28px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🛑 HALT! SENSITIVE DATA DETECTED", w / 2, 62);

      ctx.fillStyle = "#ffcdd2";
      ctx.font = "600 15px monospace";
      ctx.fillText("AGENT SCANNING PASSWORDS, EMAILS & FACES...", w / 2, 105);
    }
  });

/* -------------------- 3D Mini Agent Robot Component -------------------- */

function MiniAgentRobot({
  position,
  rotationY = 0,
  label,
  accentColor = "#ff3366",
  holdingShield = false,
  isScanning = false,
  armHalt = false,
}: {
  position: [number, number, number];
  rotationY?: number;
  label: string;
  accentColor?: string;
  holdingShield?: boolean;
  isScanning?: boolean;
  armHalt?: boolean;
}) {
  const headRef = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const calm = story.reduced ? 0 : 1;
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 1.5 + position[0]) * 0.25 * calm;
    }
    if (armRef.current && armHalt) {
      armRef.current.rotation.x = -Math.PI / 2.2 + Math.sin(t * 3.5) * 0.1 * calm;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Floating Name Badge */}
      <mesh position={[0, 1.35, 0]}>
        <planeGeometry args={[1.1, 0.32]} />
        <meshBasicMaterial map={miniRobotBadgeTex(label, accentColor)} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>

      {/* Robot Body Chassis */}
      <mesh position={[0, 0.42, 0]} material={M.dark}>
        <cylinderGeometry args={[0.22, 0.26, 0.48, 16]} />
      </mesh>
      {/* Glowing chest core */}
      <mesh position={[0, 0.42, 0.23]}>
        <circleGeometry args={[0.07, 16]} />
        <meshBasicMaterial color={accentColor} toneMapped={false} />
      </mesh>

      {/* Robot Base / Track */}
      <mesh position={[0, 0.1, 0]} material={M.dark}>
        <sphereGeometry args={[0.18, 16, 12]} />
      </mesh>
      {/* Neon rim around base */}
      <mesh position={[0, 0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.18, 0.22, 24]} />
        <meshBasicMaterial color={accentColor} toneMapped={false} />
      </mesh>

      {/* Head Assembly */}
      <group ref={headRef} position={[0, 0.78, 0]}>
        <mesh material={M.dark}>
          <sphereGeometry args={[0.22, 20, 16]} />
        </mesh>
        {/* Glowing Visor Eye */}
        <mesh position={[0, 0.02, 0.19]}>
          <boxGeometry args={[0.26, 0.08, 0.06]} />
          <meshBasicMaterial color={accentColor} toneMapped={false} />
        </mesh>
        {/* Dual Antennas */}
        {[-0.14, 0.14].map((ax, i) => (
          <group key={i} position={[ax, 0.22, 0]}>
            <mesh material={M.dark}>
              <cylinderGeometry args={[0.012, 0.012, 0.15]} />
            </mesh>
            <mesh position={[0, 0.08, 0]}>
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshBasicMaterial color={accentColor} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Arm with Halt Shield / Wand */}
      <group ref={armRef} position={[-0.26, 0.48, 0.05]} rotation={armHalt ? [-Math.PI / 2.2, 0, 0.2] : [0, 0, 0]}>
        <mesh material={M.dark}>
          <cylinderGeometry args={[0.03, 0.03, 0.28]} />
        </mesh>
        {holdingShield && (
          <group position={[0, -0.16, 0.12]}>
            <mesh rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[0.24, 0.24, 0.02]} />
              <meshBasicMaterial color={accentColor} toneMapped={false} />
            </mesh>
            <pointLight intensity={10} distance={2.5} color={accentColor} />
          </group>
        )}
      </group>

      {/* Other Arm holding tablet/scanner */}
      <group position={[0.26, 0.44, 0.08]} rotation={[-0.4, 0, -0.2]}>
        <mesh material={M.dark}>
          <cylinderGeometry args={[0.03, 0.03, 0.24]} />
        </mesh>
        {isScanning && (
          <mesh position={[0, -0.14, 0.06]} rotation={[-0.3, 0, 0]}>
            <boxGeometry args={[0.18, 0.02, 0.24]} />
            <meshBasicMaterial color="#00f5d4" toneMapped={false} />
          </mesh>
        )}
      </group>
    </group>
  );
}

/* -------------------- Main Secure Vision AI World Component -------------------- */

function SecureVisionAIWorld({ accent }: { accent: string }) {
  const laserScannerRef = useRef<THREE.Group>(null);
  const barrierLightRef = useRef<THREE.PointLight>(null);
  const [inspectionComplete, setInspectionComplete] = useState(false);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const calm = story.reduced ? 0 : 1;

    // Checkpoint cycle: 5.5 second loop (halts & scans robot, then grants clearance)
    const cycle = (t % 5.5) / 5.5;
    const isSafe = cycle > 0.55;
    setInspectionComplete(isSafe);

    // Laser scanning beam sweeping down over the robot area
    if (laserScannerRef.current) {
      laserScannerRef.current.position.y = 1.1 + Math.sin(t * 3.5) * 0.7 * calm;
    }

    if (barrierLightRef.current) {
      barrierLightRef.current.color.set(isSafe ? "#00f5d4" : "#ff0055");
      barrierLightRef.current.intensity = (Math.sin(t * 4.5) * 0.3 + 0.7) * 22;
    }
  });

  const barrierColor = inspectionComplete ? "#00f5d4" : "#ff0055";

  return (
    <>
      {/* -------------------- Security Deck Platform -------------------- */}
      <mesh position={[0, 0.12, 0]} material={M.dark}>
        <cylinderGeometry args={[4.4, 4.6, 0.24, 8]} />
      </mesh>
      {/* Platform Top with Hazard Grid */}
      <mesh position={[0, 0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4.3, 32]} />
        <meshStandardMaterial color="#0d0714" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Outer Alert Border Ring */}
      <mesh position={[0, 0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.1, 4.25, 48]} />
        <meshBasicMaterial color={barrierColor} toneMapped={false} />
      </mesh>

      {/* -------------------- 4 Mini Agent Robots -------------------- */}

      {/* Agent 1: Live Video / Screen Input */}
      <MiniAgentRobot
        position={[-2.2, 0.28, 0.6]}
        rotationY={0.6}
        label="1. SCREEN CAPTURE"
        accentColor="#38bdf8"
        isScanning={true}
      />

      {/* Agent 2: On-Device Vision AI */}
      <MiniAgentRobot
        position={[-1.4, 0.28, -0.2]}
        rotationY={0.3}
        label="2. VISION AI (ONNX)"
        accentColor="#b7a4ff"
        isScanning={true}
      />

      {/* Agent 3: Privacy Guard (Halts the main robot & redacts PII) */}
      <MiniAgentRobot
        position={[-0.3, 0.28, 1.4]}
        rotationY={-0.4}
        label="3. PRIVACY GUARD"
        accentColor={inspectionComplete ? "#00f5d4" : "#ff0055"}
        holdingShield={true}
        armHalt={!inspectionComplete}
      />

      {/* Agent 4: Safe Context Gatekeeper */}
      <MiniAgentRobot
        position={[0.7, 0.28, 0.4]}
        rotationY={-0.6}
        label="4. SAFE CONTEXT"
        accentColor="#00f5d4"
        isScanning={true}
      />

      {/* -------------------- Security Checkpoint Laser Gate -------------------- */}
      {/* Gate Left Pylon */}
      <group position={[-1.4, 0.28, 1.4]}>
        <mesh position={[0, 1.0, 0]} material={M.dark}>
          <cylinderGeometry args={[0.14, 0.18, 2.0, 16]} />
        </mesh>
        <mesh position={[0, 2.05, 0]}>
          <sphereGeometry args={[0.12, 16, 12]} />
          <meshBasicMaterial color={barrierColor} toneMapped={false} />
        </mesh>
      </group>

      {/* Gate Right Pylon */}
      <group position={[0.2, 0.28, 1.4]}>
        <mesh position={[0, 1.0, 0]} material={M.dark}>
          <cylinderGeometry args={[0.14, 0.18, 2.0, 16]} />
        </mesh>
        <mesh position={[0, 2.05, 0]}>
          <sphereGeometry args={[0.12, 16, 12]} />
          <meshBasicMaterial color={barrierColor} toneMapped={false} />
        </mesh>
      </group>

      {/* Holographic Security Laser Barrier Beams */}
      <group position={[-0.6, 0.28, 1.4]}>
        {[0.6, 1.1, 1.6].map((ly, i) => (
          <mesh
            key={i}
            position={[0, ly + (inspectionComplete ? 1.2 : 0), 0]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.015, 0.015, 1.6, 8]} />
            <meshBasicMaterial color={barrierColor} toneMapped={false} />
          </mesh>
        ))}

        {/* Overhead Laser Scanner Beam (Sweeps up/down scanning the main robot) */}
        <group ref={laserScannerRef}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 1.7, 8]} />
            <meshBasicMaterial color={barrierColor} toneMapped={false} />
          </mesh>
          <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.6, 0.4]} />
            <meshBasicMaterial color={barrierColor} transparent opacity={0.25} side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* Floating Checkpoint Status Banner */}
        <mesh position={[0, 2.4, 0]}>
          <planeGeometry args={[2.2, 0.52]} />
          <meshBasicMaterial map={checkpointSignTex(inspectionComplete)} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>

        <pointLight ref={barrierLightRef} position={[0, 1.2, 0]} distance={7} decay={2} />
      </group>

      {/* -------------------- Holographic Operations Dashboard -------------------- */}
      <group position={[1.2, 0.28, -0.6]} rotation={[0, -0.35, 0]}>
        {/* Terminal Pedestal */}
        <mesh position={[0, 0.45, 0]} material={M.dark}>
          <boxGeometry args={[2.6, 0.9, 0.4]} />
        </mesh>
        {/* Bezel frame */}
        <mesh position={[0, 1.45, 0]} rotation={[-0.08, 0, 0]} material={M.dark}>
          <boxGeometry args={[2.8, 1.75, 0.06]} />
        </mesh>
        {/* Canvas Display */}
        <mesh position={[0, 1.45, 0.035]} rotation={[-0.08, 0, 0]}>
          <planeGeometry args={[2.74, 1.68]} />
          <meshBasicMaterial map={secureVisionScreenTex(accent)} toneMapped={false} />
        </mesh>
      </group>

      {/* -------------------- Floating 3D Privacy Shield Icon -------------------- */}
      <group position={[-2.4, 2.5, -0.8]} rotation={[0, 0.5, 0]}>
        {/* Shield body */}
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.55, 0.55, 0.05]} />
          <meshBasicMaterial color={barrierColor} wireframe toneMapped={false} />
        </mesh>
        {/* Padlock center */}
        <mesh position={[0, -0.05, 0.04]} material={M.dark}>
          <boxGeometry args={[0.22, 0.18, 0.04]} />
        </mesh>
        <mesh position={[0, 0.08, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.07, 0.025, 8, 16, Math.PI]} />
          <meshBasicMaterial color={barrierColor} toneMapped={false} />
        </mesh>
      </group>

      {/* Ambient security particles */}
      <Sparkles
        count={story.lite ? 14 : 32}
        scale={[4.2, 3.2, 4.2]}
        position={[0, 1.8, 0]}
        size={3.5}
        speed={0.7}
        color={barrierColor}
      />
    </>
  );
}

// Backward-compatible alias for FlowWorld
function FlowWorld({ accent }: { accent: string }) {
  return <SecureVisionAIWorld accent={accent} />;
}

function GenericWorld({ accent }: { accent: string }) {
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[-1.5 + i * 1.5, 1.2 + (i % 2) * 0.7, -2.4]}>
          <octahedronGeometry args={[0.5, 0]} />
          <meshBasicMaterial color={accent} wireframe toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}

/* ------------------------------------------------------------- the island */

function ProjectIsland({ i, project }: { i: number; project: Project }) {
  const isl = islandAt(i);
  const content = useRef<THREE.Group>(null);
  useFrame(() => {
    const c = content.current;
    if (!c) return;
    const s = story.reduced ? 1 : 0.001 + 0.999 * projectReveal(i, story.p);
    c.scale.setScalar(s);
    c.visible = s > 0.01;
  });
  return (
    <group position={[isl.x, isl.top, isl.z]}>
      <IslandBase accent={project.accent} />
      <group ref={content}>
        {(project.world === "study-hub" || project.world === "quiz") && <StudyGroupHubWorld accent={project.accent} />}
        {(project.world === "weather" || project.world === "travel" || project.id === "weathergpt") && <WeatherGPTWorld accent={project.accent} />}
        {(project.world === "security" || project.world === "flow" || project.id === "secure-vision-ai") && <SecureVisionAIWorld accent={project.accent} />}
        {project.world === "generic" && <GenericWorld accent={project.accent} />}
      </group>
      <HoloPanel
        id={`project-${i}`}
        position={[-3.8, 2.7, -3.2]}
        rotationY={0.5}
        size={[2.9, 1.7]}
        kicker={`PROJECT ${String(i + 1).padStart(2, "0")}`}
        label={project.name}
        color={project.accent}
      />
    </group>
  );
}

/** Scene 5 world: one floating island per project, each with its own identity. */
export function ProjectsScene() {
  const gate = useGate(LAUNCH_X, LAB_X, 60);
  return (
    <group ref={gate}>
      {projects.map((p, i) => (
        <ProjectIsland key={p.id} i={i} project={p} />
      ))}
    </group>
  );
}
