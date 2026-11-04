"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { frame } from "@/lib/timeline";
import { projStart, SPAN, smoothstep } from "@/lib/layout";
import { story } from "@/lib/store";
import { seeded, additive, radialTex } from "./helpers";

/** [p, background colour] — lerped smoothly through the story. */
const PALETTE: [number, string][] = [
  [0, "#060a15"],
  [0.1, "#08101f"],
  [0.24, "#0a1024"],
  [0.3, "#0c1028"],
  [0.4, "#0d1a36"],
  [0.5, "#0e2142"],
  [0.72, "#0c1a35"],
  [0.745, "#070b14"],
  [0.84, "#0a1226"],
  [0.87, "#16264a"],
  [0.94, "#1b2a52"],
  [1, "#2a2446"],
];
const PAL = PALETTE.map(([p, c]) => [p, new THREE.Color(c)] as const);

function paletteInto(p: number, out: THREE.Color) {
  let i = 0;
  while (i < PAL.length - 2 && p >= PAL[i + 1][0]) i++;
  const [pa, ca] = PAL[i];
  const [pb, cb] = PAL[i + 1];
  const t = THREE.MathUtils.clamp((p - pa) / (pb - pa || 1), 0, 1);
  out.copy(ca).lerp(cb, t * t * (3 - 2 * t));
}

export function Atmosphere({ lite }: { lite: boolean }) {
  const key = useRef<THREE.DirectionalLight>(null);
  const rim = useRef<THREE.PointLight>(null);
  const warm = useRef<THREE.PointLight>(null);
  const lightning = useRef<THREE.PointLight>(null);
  const fog = useRef<THREE.Fog>(null);
  const starsGroup = useRef<THREE.Group>(null);
  const dustPoints = useRef<THREE.Points>(null);
  const planet = useRef<THREE.Group>(null);
  const moon = useRef<THREE.Group>(null);
  const cyberGrid = useRef<THREE.Mesh>(null);
  const nebulae = useRef<THREE.Group>(null);
  const crystals = useRef<THREE.Group>(null);
  const bg = useMemo(() => new THREE.Color(), []);

  // 1. 360-Degree Spherical Cosmic Starfield (charo taraf deep space)
  const { starPositions, starColors } = useMemo(() => {
    const count = lite ? 2000 : 4000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const rnd = seeded(108);

    const palette = [
      new THREE.Color("#ffffff"),
      new THREE.Color("#bae6fd"),
      new THREE.Color("#7dd3fc"),
      new THREE.Color("#c084fc"),
      new THREE.Color("#fef08a"),
      new THREE.Color("#a5f3fc"),
    ];

    for (let i = 0; i < count; i++) {
      const theta = rnd() * 2 * Math.PI;
      const phi = Math.acos(2 * rnd() - 1);
      const r = 145 + rnd() * 125;

      pos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi);
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const c = palette[Math.floor(rnd() * palette.length)];
      col[i * 3 + 0] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { starPositions: pos, starColors: col };
  }, [lite]);

  // 2. Near-camera interactive ambient dust
  const dustPositions = useMemo(() => {
    const n = lite ? 1000 : 2400;
    const rnd = seeded(42);
    const a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      a[i * 3] = -20 + rnd() * 280;
      a[i * 3 + 1] = -4 + rnd() * 26;
      a[i * 3 + 2] = -22 + rnd() * 38;
    }
    return a;
  }, [lite]);

  // 3. Floating 3D Cosmic Space Crystals
  const crystalSpecs = useMemo(() => {
    const rnd = seeded(77);
    return Array.from({ length: 10 }, () => ({
      x: rnd() * 260 - 30,
      y: 4 + rnd() * 28,
      z: -45 - rnd() * 50,
      scale: 0.6 + rnd() * 1.2,
      color: rnd() > 0.5 ? "#38bdf8" : "#a855f7",
      rotSpeed: 0.2 + rnd() * 0.4,
    }));
  }, []);

  const starMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.14,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
        map: radialTex(),
        depthWrite: false,
      }),
    []
  );

  const dustMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.055,
        color: "#a9d0ff",
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        sizeAttenuation: true,
        map: radialTex(),
        alphaTest: 0.01,
      }),
    []
  );

  const halo = useMemo(() => additive("#5aa8ff", 0.18), []);
  const cyanNebulaMat = useMemo(() => additive("#38bdf8", 0.14), []);
  const violetNebulaMat = useMemo(() => additive("#a855f7", 0.12), []);
  const roseNebulaMat = useMemo(() => additive("#ff2a6d", 0.12), []);

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const t = state.clock.elapsedTime;
    const p = story.p;
    const cam = state.camera;

    // WeatherGPT (SIH 2026) storm effect
    const s1 = projStart(1);
    const stormIn = smoothstep(s1 - 0.02, s1 + 0.015, p);
    const stormOut = 1 - smoothstep(s1 + SPAN - 0.015, s1 + SPAN + 0.02, p);
    const storm = Math.max(0, stormIn * stormOut);

    let lightningFlash = 0;
    if (storm > 0.04) {
      const cycle = (t % 3.4) / 3.4;
      if (cycle >= 0.08 && cycle < 0.11) {
        lightningFlash = Math.sin(((cycle - 0.08) / 0.03) * Math.PI);
      } else if (cycle >= 0.12 && cycle < 0.18) {
        const u = (cycle - 0.12) / 0.06;
        const flicker = Math.sin(t * 70) * 0.18;
        lightningFlash = Math.max(0, (1 - u) + flicker);
      } else if (cycle >= 0.21 && cycle < 0.235) {
        lightningFlash = Math.sin(((cycle - 0.21) / 0.025) * Math.PI) * 0.4;
      }
    }

    // Secure Vision AI Security Lockdown & Inspection Alert
    const s2 = projStart(2);
    const alertIn = smoothstep(s2 - 0.02, s2 + 0.015, p);
    const alertOut = 1 - smoothstep(s2 + SPAN - 0.015, s2 + SPAN + 0.02, p);
    const securityAlert = Math.max(0, alertIn * alertOut);

    paletteInto(p, bg);
    // Dark stormy sky during WeatherGPT
    const stormSky = new THREE.Color("#020308");
    const flashSky = new THREE.Color("#cbe4ff");
    bg.lerp(stormSky, storm * 0.96);
    if (lightningFlash > 0.01 && storm > 0.05) {
      bg.lerp(flashSky, lightningFlash * 0.9 * storm);
    }
    // Deep obsidian red cyber security alert background during Secure Vision AI
    if (securityAlert > 0.02) {
      const alertPulse = Math.sin(t * 4.5) * 0.5 + 0.5;
      const alertSky = new THREE.Color("#160408");
      const alertStrobeSky = new THREE.Color("#2a0812");
      bg.lerp(alertSky.clone().lerp(alertStrobeSky, alertPulse * 0.7), securityAlert * 0.94);
    }
    (state.scene.background as THREE.Color).copy(bg);

    if (fog.current) {
      fog.current.color.copy(bg);
      const inside = p > 0.745 && p < 0.86;
      const baseNear = inside ? 22 : 18;
      const baseFar = inside ? 60 : 85;
      const targetNear = THREE.MathUtils.lerp(baseNear, 7, storm);
      const targetFar = THREE.MathUtils.lerp(baseFar, 34, storm);
      fog.current.near = THREE.MathUtils.damp(fog.current.near, targetNear, 3, dt);
      fog.current.far = THREE.MathUtils.damp(fog.current.far, targetFar, 3, dt);
    }

    if (key.current) {
      key.current.position.set(frame.x + 4, 8, frame.z + 5);
      key.current.target.position.set(frame.x, 0.8, frame.z);
      key.current.target.updateMatrixWorld();
      const stormSunDim = 1 - storm * 0.85;
      const lightningSurge = lightningFlash * 6.5 * storm;
      key.current.intensity = 1.9 * stormSunDim + lightningSurge;
      if (lightningFlash > 0.05) {
        key.current.color.set("#dbeafe");
      } else {
        key.current.color.set("#ffffff");
      }
    }

    if (lightning.current) {
      if (storm > 0.04) {
        lightning.current.position.set(frame.x - 2, 14, frame.z - 2);
        lightning.current.intensity = lightningFlash * 65 * storm;
        lightning.current.color.set("#bae6fd");
      } else if (securityAlert > 0.04) {
        const alertPulse = Math.sin(t * 4.5) * 0.5 + 0.5;
        lightning.current.position.set(frame.x, 10, frame.z + 1);
        lightning.current.intensity = alertPulse * 32 * securityAlert;
        lightning.current.color.set("#ff1e56");
      } else {
        lightning.current.intensity = 0;
      }
    }
    if (rim.current) rim.current.position.set(frame.x - 1.6, frame.y + 1.8, frame.z - 1.8);
    if (warm.current) {
      warm.current.position.set(frame.x + 1.2, frame.y + 2.6, frame.z + 2.2);
      warm.current.intensity = frame.warmth * 26;
    }

    // 4D Starfield Parallax & Continuous Cosmic Rotation (charo taraf)
    if (starsGroup.current) {
      starsGroup.current.position.set(cam.position.x * 0.96, cam.position.y * 0.96, cam.position.z * 0.96);
      starsGroup.current.rotation.y = t * 0.006;
      starsGroup.current.rotation.x = Math.sin(t * 0.003) * 0.02;
    }

    if (dustPoints.current && !story.reduced) {
      dustPoints.current.position.y = Math.sin(t * 0.12) * 0.35;
      dustPoints.current.rotation.y = Math.sin(t * 0.03) * 0.01;
    }

    // 4D Nebulae Pulsing & Drift
    if (nebulae.current) {
      nebulae.current.position.set(cam.position.x * 0.9, cam.position.y * 0.9, cam.position.z * 0.9);
      nebulae.current.children.forEach((c, idx) => {
        c.scale.setScalar(1 + Math.sin(t * 0.4 + idx) * 0.06);
      });
    }

    // Planetary parallax
    if (planet.current) {
      planet.current.position.set(cam.position.x * 0.82 + 42, 25, -100);
      planet.current.rotation.y = t * 0.02;
    }
    if (moon.current) {
      moon.current.position.set(cam.position.x * 0.86 - 55, 34, -85);
      moon.current.rotation.y = t * 0.03;
    }

    // Deep Cyber Grid Horizon Floor (Infinite 3D Floor below)
    if (cyberGrid.current) {
      cyberGrid.current.position.set(cam.position.x * 0.85, -20, cam.position.z * 0.85);
      (cyberGrid.current.material as THREE.MeshStandardMaterial).opacity = 0.28 + Math.sin(t * 1.5) * 0.06;
    }

    // Floating Space Crystals
    if (crystals.current) {
      crystals.current.children.forEach((cr, i) => {
        cr.rotation.x += dt * crystalSpecs[i].rotSpeed;
        cr.rotation.y += dt * crystalSpecs[i].rotSpeed * 1.2;
      });
    }
  });

  return (
    <>
      <color attach="background" args={["#060a15"]} />
      <fog ref={fog} attach="fog" args={["#060a15", 18, 85]} />

      <ambientLight intensity={0.28} />
      <hemisphereLight args={["#bcd6ff", "#0a1226", 0.6]} />
      <directionalLight ref={key} intensity={1.9} color="#ffffff" />
      <pointLight ref={rim} intensity={9} distance={9} color="#4da3ff" decay={2} />
      <pointLight ref={warm} intensity={0} distance={14} color="#ffb36b" decay={2} />
      <pointLight ref={lightning} intensity={0} distance={42} color="#bae6fd" decay={2} />

      {/* Reflections */}
      <Environment resolution={lite ? 128 : 256} frames={1} environmentIntensity={0.9}>
        <Lightformer form="rect" intensity={2.4} position={[0, 7, 2]} rotation-x={Math.PI / 2} scale={[14, 10, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.6} position={[-6, 2, 4]} rotation-y={Math.PI / 2} scale={[8, 5, 1]} color="#6fb4ff" />
        <Lightformer form="rect" intensity={1.2} position={[6, 3, -5]} rotation-y={-Math.PI / 2} scale={[8, 5, 1]} color="#9fc8ff" />
        <Lightformer form="ring" intensity={1.4} position={[0, 2, -8]} scale={4} color="#cfe8ff" />
      </Environment>

      {/* -------------------- 360° Omnidirectional Spherical Starfield -------------------- */}
      <group ref={starsGroup}>
        <points frustumCulled={false} material={starMaterial}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
            <bufferAttribute attach="attributes-color" args={[starColors, 3]} />
          </bufferGeometry>
        </points>
      </group>

      {/* Near Ambient Space Dust */}
      <points ref={dustPoints} frustumCulled={false} material={dustMaterial}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPositions, 3]} />
        </bufferGeometry>
      </points>

      {/* -------------------- Volumetric Deep Space Nebulae -------------------- */}
      <group ref={nebulae}>
        {/* Northern Cyan Nebula */}
        <mesh position={[50, 30, -115]} scale={[65, 42, 1]}>
          <planeGeometry args={[1, 1]} />
          <primitive object={cyanNebulaMat} attach="material" />
        </mesh>
        {/* Southern Violet Deep Space Nebula */}
        <mesh position={[-65, 25, 95]} scale={[55, 38, 1]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1, 1]} />
          <primitive object={violetNebulaMat} attach="material" />
        </mesh>
        {/* Cosmic Arc Overhead */}
        <mesh position={[15, 80, -25]} scale={[75, 52, 1]} rotation={[Math.PI / 2.2, 0, 0.4]}>
          <planeGeometry args={[1, 1]} />
          <primitive object={roseNebulaMat} attach="material" />
        </mesh>
      </group>

      {/* -------------------- Deep Infinite Cyber Grid Floor -------------------- */}
      <mesh ref={cyberGrid} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[300, 300, 30, 30]} />
        <meshStandardMaterial
          wireframe
          color="#1e3a8a"
          emissive="#0d1b38"
          emissiveIntensity={0.65}
          transparent
          opacity={0.3}
          roughness={0.8}
        />
      </mesh>

      {/* -------------------- Distant Planet + Ring (Gas Giant) -------------------- */}
      <group ref={planet}>
        <mesh>
          <sphereGeometry args={[12, 48, 32]} />
          <meshStandardMaterial color="#10224a" roughness={0.85} emissive="#0a1c44" emissiveIntensity={0.7} fog={false} />
        </mesh>
        <mesh scale={1.5} material={halo}>
          <sphereGeometry args={[12, 32, 24]} />
        </mesh>
        <mesh rotation={[Math.PI / 2.4, 0, 0.3]}>
          <torusGeometry args={[18, 0.22, 8, 120]} />
          <meshBasicMaterial color="#6fa8ff" transparent opacity={0.4} fog={false} />
        </mesh>
      </group>

      {/* -------------------- Secondary Icy Moon & Orbiting Beacon -------------------- */}
      <group ref={moon}>
        <mesh>
          <sphereGeometry args={[5.5, 32, 24]} />
          <meshStandardMaterial color="#1e293b" emissive="#38bdf8" emissiveIntensity={0.25} roughness={0.9} fog={false} />
        </mesh>
        {/* Glowing atmospheric rim */}
        <mesh scale={1.2}>
          <sphereGeometry args={[5.5, 24, 16]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.12} fog={false} />
        </mesh>
      </group>

      {/* -------------------- Floating Space Crystals -------------------- */}
      <group ref={crystals}>
        {crystalSpecs.map((cr, idx) => (
          <mesh key={idx} position={[cr.x, cr.y, cr.z]} scale={cr.scale}>
            <octahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color={cr.color} wireframe toneMapped={false} />
          </mesh>
        ))}
      </group>
    </>
  );
}
