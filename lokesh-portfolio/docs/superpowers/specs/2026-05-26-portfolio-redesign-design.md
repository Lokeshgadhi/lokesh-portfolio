# Lokesh Kumar G — Cinematic Digital Identity System
## Full Portfolio Redesign Specification
**Date:** 2026-05-26
**Status:** Approved — Ready for Implementation Planning

---

## 1. Overview

A complete ground-up rewrite of the personal portfolio. The experience is not a website. It is a **cinematic digital identity system** — a futuristic AI operating system that tells the story of Lokesh Kumar G through environmental storytelling, symbolic motion, emotional pacing, and narrative transitions.

**Theme:** Cyberpunk + Futuristic OS + AI Consciousness + Holographic Interface
**Emotional arc:** Mystery → Intelligence → Memory → Precision → Humanity → Transcendence
**Stack:** Next.js 14 App Router, React 18, TailwindCSS, Framer Motion, Three.js, React Three Fiber, @react-three/drei, @react-three/postprocessing, GSAP ScrollTrigger, Lenis

---

## 2. Core Architecture Decision

### Single Persistent Global Canvas
One R3F `<Canvas>` component lives permanently behind the entire page (`position: fixed`, full viewport, `z-index: 0`). It never unmounts. It evolves.

All 7 sections are pure HTML/CSS overlay panels (`position: relative`, `z-index: 10+`) using glassmorphism, floating over the living background. Sections never contain their own Three.js contexts.

A `SceneManager` component inside the canvas reads global scroll progress via a `useScrollScene` hook and smoothly interpolates between named scene states on every animation frame.

### Scroll Architecture (Hybrid)
| Section | Scroll Behavior |
|---|---|
| Hero | Sticky / full viewport snap |
| Mind | Pinned for 200vh while neural network activates, then releases |
| Timeline | Natural vertical scroll with scroll-triggered milestone activation |
| Projects | Natural vertical scroll with scroll-triggered terminal replays |
| Lifestyle | Natural vertical scroll, staggered bento reveal |
| Vision | Snaps back to full viewport — final cinematic moment |

---

## 3. File Structure

```
src/
  app/
    page.js
    layout.js
    globals.css
  components/
    canvas/
      GlobalCanvas.jsx          — single R3F canvas, fixed behind everything
      SceneManager.jsx          — scroll progress → scene state interpolation
      scenes/
        ParticleField.jsx       — reactive symbolic particles (all scenes)
        HeroCore.jsx            — AI core sphere + holographic orbit rings
        NeuralWeb.jsx           — 3D neural graph geometry
        DataStream.jsx          — vertical memory stream + data lines
      fx/
        PostProcessing.jsx      — bloom + chromatic aberration + vignette
    ui/
      Navigation.jsx            — HUD-style persistent nav
      CustomCursor.jsx          — magnetic glow cursor
      HUDOverlay.jsx            — coordinates, system status, live clock
      SmoothScrollProvider.jsx  — Lenis wrapper
    sections/
      HeroSection.jsx
      MindSection.jsx
      TimelineSection.jsx
      ProjectsSection.jsx
      LifestyleSection.jsx
      VisionSection.jsx
    shared/
      GlassCard.jsx             — reusable glassmorphism card primitive
      TerminalText.jsx          — typewriter / terminal animation
      SectionLabel.jsx          — unified section numbering treatment
  hooks/
    useScrollScene.js           — maps scroll % → active scene + bridge state
    useMouseParallax.js         — mouse position → parallax offset
  lib/
    sceneStates.js              — full scene configuration objects per state
  data/
    personal.js                 — unchanged content data
```

---

## 4. Scene State System

### Full State Progression
```
HERO → HERO_EXIT → MIND_ENTER → MIND → MIND_EXIT →
TIMELINE_ENTER → TIMELINE → TIMELINE_EXIT →
PROJECTS_ENTER → PROJECTS → PROJECTS_EXIT →
LIFESTYLE_ENTER → LIFESTYLE → LIFESTYLE_EXIT →
VISION_ENTER → VISION → VISION_HOLD
```

Bridge states (HERO_EXIT, MIND_ENTER, etc.) occupy ~15% of scroll distance between sections. They are not abrupt cuts — they are emotionally authored transitions.

### Scene State Configurations (`sceneStates.js`)

**HERO**
- Particles: "energy" — dense (2000pts desktop / 600pts mobile), electric, drawn toward core
- Geometry: HeroCore visible (AI sphere + 3 orbit rings), FogRings active
- Lighting: cyan point light top, purple ambient, pink bottom fill
- Fog: dark, tight (`#0a0118`, near: 8, far: 50)
- Bloom: intensity 1.5, luminanceThreshold 0.15
- Chromatic aberration: offset 0.002
- Camera FOV: 60

**HERO_EXIT**
- Particles stretch into trails pointing backward (velocity scaled 3×, opacity fades on trail end)
- HeroCore begins slow scale-down
- Fog lightens slightly

**MIND_ENTER**
- HeroCore fades out fully
- NeuralWeb geometry begins fade-in
- Particles contract from wide field into approximate sphere formation
- Lighting shifts: cyan dominant, purple secondary, warmer

**MIND**
- Particles: "neural intelligence" — sphere formation, individual nodes pulse
- Geometry: NeuralWeb active — 3D sphere nodes + tube connection geometry
- Lighting: warmer purple-cyan blend, no harsh fills
- Bloom: reduced to 1.0 (let HTML overlays dominate visually)
- Camera FOV: 60

**MIND_EXIT**
- Neural connection tubes begin dissolving at their endpoints
- Dissolving particles fall downward, becoming early memory-stream particles
- That visual: neural trails → memory streams is a signature transition moment

**TIMELINE_ENTER**
- Particles fully reorganize into vertical downward-flowing streams ("memory streams")
- Camera FOV lerps: 60 → 72 (pulls back, creates archive depth)
- Fog density increases — deeper layers feel further away
- DataStream column geometry fades in, slightly left of center

**TIMELINE**
- Particles: "memory streams" — long vertical trails drifting slowly downward
- Near active checkpoints: turbulence + slight orbiting + brightness spikes
- Older memories: particles in those regions desaturate subtly
- Lighting: cooler, blue-shifted, deeper fog
- Camera FOV: 72

**TIMELINE_EXIT**
- Memory-stream particles begin reorganizing: outer particles snap to horizontal/vertical alignment first
- Center of field holds its streaming motion slightly longer
- Gradual transition: chaos → order (memories → systems, symbolically)

**PROJECTS_ENTER**
- Particles fully snap into orthographic grid (rows and columns, precise spacing)
- One synchronized scan-beam sweeps across the entire canvas simultaneously with the first scan across the deployment chamber — "system initialization" moment
- Wireframe rectangular prism geometry fades in (upper-right background)
- Lighting: sharp cyan-white point lights, no warm fill

**PROJECTS**
- Particles: "engineered systems" — rigid grid formation
- Geometry: wireframe prism (occasionally one edge over-brightens as if overloaded with energy transfer)
- Two diagonal scan beams sweep canvas on 6s loops
- Per-project environmental personality:
  - Aura Interior: softer ambient glow, smoother pulse timing
  - AdLogix: sharper scan frequency, more aggressive diagnostic animation
- Lighting: sharp, cool, cyan-white

**PROJECTS_EXIT**
- Grid dissolution: outer columns destabilize first (outer → inward stagger)
- Center holds rigid for ~0.8s longer than edges
- Lighting begins warming back toward purple
- Wireframe prism fades out

**LIFESTYLE_ENTER**
- Particles return to organic drift — slow curves, no formation
- Scan beams gone
- Wireframe geometry gone
- Bloom softens
- Warm purple ambiance restores

**LIFESTYLE**
- Particles: "free humanity" — organic, slow, drifting curves
- Lighting: softest of all scenes — warm purple, relaxed bloom
- No structured geometry
- This is the only scene that feels calm

**LIFESTYLE_EXIT**
- Particles begin very slow outward drift, increasing speed gradually

**VISION_ENTER**
- Particle drift accelerates
- Canvas lighting begins brightening toward cyan core

**VISION**
- Particles: "transcendence" — full radial explosion outward from center
- Bloom peaks (intensity 2.5)
- Bright cyan core blazes at canvas center

**VISION_HOLD** (2-second authored moment)
- Particle velocity decelerates to near-zero (not mathematical freeze — tiny residual motion remains, organic)
- Canvas enters stillness — the system has completed its sequence
- Cyan core pulses gently once every ~4 seconds after stabilization (system still breathing quietly)
- This is the most memorable moment in the experience: silence after maximum energy

---

## 5. Post-Processing Stack

Desktop only (mobile uses CSS glow instead):
- **Bloom:** intensity 1.5, luminanceThreshold 0.15, luminanceSmoothing 0.9, radius 0.85, mipmapBlur
- **Chromatic Aberration:** offset 0.002 — subtle, not nauseating
- **Vignette:** darkness 0.5 — cinematic lens framing

Mobile: `dpr={[1, 1.5]}`, no postprocessing, particle count 600, geometry complexity halved

---

## 6. Navigation & HUD

### Navigation (`Navigation.jsx`)
- HUD-style persistent bar, not a traditional nav
- Frosted glass pill at top-center on desktop
- Section indicators: monospace labels + active glow dot
- Active section tracked via IntersectionObserver
- On scroll: opacity 0.7 default → 1.0 when hovering

### Persistent HUD Overlay (`HUDOverlay.jsx`)
- Top-left corner (desktop only): `LAT: 16.5667°N` / `LON: 81.5167°E` / `SYS: ACTIVE`
- Top-right corner: `ID: LK_G_2004` / `VER: 2.0` / `STATUS: BUILDING`
- Bottom-left: `© 2026 LOKESH.SYSTEM`
- Bottom-right: live clock in `HH:MM:SS` format, monospace, updates every second
- All HUD elements: `z-index: 50`, `position: fixed`, `font-mono`, `text-cyan-400/60`

### Custom Cursor (`CustomCursor.jsx`)
- 12px glowing dot (cyan, `blur(4px)`, follows actual cursor position with 0 lag)
- 40px outer ring (white/10 opacity, follows with spring lag — `stiffness: 150, damping: 20`)
- On hovering interactive elements: ring expands to 60px, glows brighter
- On hovering project cards: ring displays `EXPLORE ↗` text
- Mobile: cursor hidden entirely

---

## 7. Section Designs

> **Section numbering:** Hero (no number — boot screen), Mind (02), Timeline (03), Projects (04), Lifestyle (05), Vision (06). Section 01 is intentionally skipped — the Hero exists outside the numbered system as the pre-boot environment.

### 7.1 HERO SECTION

**Layout:** Left-anchored, not centered. 55/45 split.

```
[LEFT COLUMN — 55%]
  ● SYSTEM ONLINE                        [canvas shows through right half]

  LOKESH
  KUMAR G
  ────────────────────
  Building systems today
  for the freedom of tomorrow.

  [Software Developer] [AI Builder]
  [Futuristic Creator] [Late-night Builder]
  [Disciplined Introvert]

  ↕ (vertical dashed scroll indicator with gravity-driven glowing dot)

[HUD BAR — full width, bottom]
  LAT:16.5667  LON:81.5167  //  ID:LK_G_2004  //  VER:2.0  //  ████ BUILDING
```

**Typography:**
- `LOKESH`: `clamp(5rem, 14vw, 11rem)`, tracking `-0.05em`, `neon-text` class (purple glow shadow)
- `KUMAR G`: ~80% of LOKESH size, `gradient-text` fill
- Tagline: `font-mono`, `text-sm md:text-base`, `text-white/70`
- Identity tags: pill-shaped glass, `font-mono text-xs`, staggered slide-in, NOT centered cluster

**3D HeroCore specifics:**
- Central AI sphere: `SphereGeometry(0.8, 32, 32)`, emissive cyan, bloom catches it strongly
- Ring 1: `TorusGeometry(2.0, 0.02, 8, 128)`, rotates on Y at 0.3 rad/s, tilt 15°
- Ring 2: `TorusGeometry(2.8, 0.015, 8, 128)`, rotates on X at 0.2 rad/s, tilt 35°
- Ring 3: `TorusGeometry(3.6, 0.01, 8, 128)`, rotates on Z at 0.15 rad/s, tilt 55°
- Desync: each ring has a `Math.sin(time * randomOffset) * 0.02` tilt perturbation — never perfectly mathematical
- Light spill from HeroCore: `<pointLight position={[0,0,3]} color="#06b6d4" intensity={3}/>` — spills onto typography edges from behind. On `LOKESH` specifically, the left edge catches cyan bounce light
- Camera rig: mouse parallax at `pointer.x * 0.5`, `pointer.y * 0.3`, lerp factor 0.03

**Scroll indicator:** Vertical dashed line (`border-l-2 border-dashed border-white/20`), 80px tall. Glowing dot uses `easeIn` animation — starts slow, accelerates downward, resets. Gravity-driven, not linear.

**Boot sequence on load:**
1. t=0: HUD corner data types in line by line
2. t=0.8: "● SYSTEM ONLINE" pill fades in
3. t=1.2: `LOKESH` scales in from 0.85 → 1.0
4. t=1.6: `KUMAR G` follows
5. t=2.0: tagline appears
6. t=2.4: identity tags stagger in
7. t=3.0: scroll indicator appears
- Animated scan line sweeps across name every 8s (not looped continuously)

**Mobile:** Single column, canvas behind, type scales down, HUD bar shows 2 items only

---

### 7.2 MIND SECTION

**Layout:** Full-width immersive. Heading split to frame the graph.
- `NEURAL` — top-left, large
- `ARCHITECTURE` — bottom-right, large
- 3D graph lives between them inside the global canvas

**Scroll behavior:** Section pinned for 200vh.
- First 100vh: nodes activate one by one (asymmetric — not all identical)
- Second 100vh: data pulses travel through connections, atmosphere dims slightly, active paths brighten
- Unpins and releases scroll

**Node activation types (asymmetric awakening):**
- Type A (Rapid): node flashes to full brightness immediately, ring expands fast
- Type B (Slow): node fades in over 1.5s, pulse builds gradually
- Type C (Unstable): node flickers 3–4 times before stabilizing — digital boot instability
- Type D (High-energy): node activates normally but emits a strong outward energy burst ring that fades over 0.5s
- Assignment: randomized per session, weighted toward A/B with occasional C/D

**Data pulse timing:** NOT synchronized. Each connection has a randomized base delay (0–2s) plus a small jitter (±0.3s) applied each cycle. Perfect synchronization would feel artificial.

**Second 100vh pulse phase:**
- Surrounding canvas atmosphere dims 20%
- Active data paths (whichever connection is pulsing at that moment) brighten 40%
- Creates visual focus — the data flow feels intelligent, not decorative

**HTML overlays synced to 3D positions:**
- Use `useThree().camera` + manual projection math to convert 3D node positions → 2D screen positions
- Labels rendered as `position: absolute` divs over the canvas
- Mouse parallax: `useMouseParallax` hook offsets labels by `pointer * 0.015` — drift without disconnecting from nodes
- Label shows on node hover: category (small mono) + skill name (bold display)

**MIND_EXIT transition:**
- Neural connection tubes begin dissolving from endpoints inward
- Freed particles fall downward, inheriting memory-stream styling
- This is the signature transition: consciousness → memory

**Section label:** `02 / NEURAL ARCHITECTURE` — bottom-left, small mono, not above the graph

---

### 7.3 TIMELINE SECTION

**Layout:** Asymmetric. Rail at 40% from left (not centered). Cards alternate left/right relative to rail.

**Scene atmosphere:**
- FOV: 72 (pulled back, archive depth)
- Memory-stream particles fall downward
- Particle turbulence near active checkpoints: slight orbiting + brightness spikes
- Older memories: desaturate slightly as newer ones activate (temporal depth signal)
- Occasional corrupted micro-glitch on 1–2 timeline labels: 1-frame flicker, partial text distortion — very rare, very subtle

**Section header (not a traditional block):**
```
THE
JOURNEY
─────────
03 / Memory Tunnel

> **Note:** The original `OriginSection` (birth data, location) is intentionally removed in this rewrite. Its content (coordinates, birth year) is absorbed into the persistent HUD overlay which displays this data globally. Removing the section reduces page height and eliminates an isolated block that broke narrative flow.
```
Top-left of section. Small and integrated, not dominant.

**Rail construction:**
- Vertical line: `border-left: 1px solid` with gradient glow `rgba(6,182,212,0.5)`
- Rail draws progressively via `scaleY` on scroll — the line itself fills downward
- Each `●` checkpoint: `width: 12px, height: 12px, border-radius: 50%`, cyan with `box-shadow` glow
- On checkpoint activate: scale 0.5 → 1.0, emits single `border-radius: 50%` radial pulse that expands and fades

**Milestone card anatomy:**
```
┌──────────────────────────────────────────────────┐
│  MEMORY_ID: 001  ░░░░░░░░░░  STATUS: UNLOCKED ▓ │
│  ──────────────────────────────────────────────  │
│  [Icon]  MILESTONE TITLE                         │
│                                                  │
│  "Cinematic first-person memory fragment         │
│   written as a present-tense lived moment."      │
│                                                  │
│  TIMESTAMP: 2026  //  MILESTONE_WEIGHT: CRITICAL │
└──────────────────────────────────────────────────┘
```

**Card entrance animation:** `rotateY(8deg)` → `rotateY(0)` + `translateX(±60px)` → `0`. Simultaneously: `box-shadow` depth shifts from `0 20px 60px rgba(0,0,0,0.8)` → `0 4px 20px rgba(0,0,0,0.4)` — cards feel physically present, not flat DOM layers.

**Cinematic memory text (personalData replacement):**
- Career start: "The first line of code written at 2am. The first system that felt alive."
- Gym start: "The body became the first discipline. Everything after was easier."
- First bike: "Freedom on two wheels. The city seen differently for the first time."
- First car: "Four wheels. More distance. The same hunger to move."
- First webpage: "A blank screen became something. That moment doesn't leave you."

**Year floating element:** `font-display, text-4xl, gradient-text`, positioned separately from card with `perspective: 800px, rotateX(10deg)` — feels depth-layered against card.

**TIMELINE_EXIT:** Memory streams reorganize from vertical chaos → horizontal/vertical grid alignment. Outer particles snap first, center holds streaming motion longer. Symbolic: memories → systems, chaos → engineering.

---

### 7.4 PROJECTS SECTION

**Section header (embedded, not separate):**
```
DEPLOYMENT TERMINAL  //  04 / PROJECTS  //  2 ACTIVE SYSTEMS  //  ● ALL OPERATIONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
No separate heading block. User scrolls into Projects and is already inside it.

**Deployment chamber anatomy (Project 001 — layout A):**
```
┌──────────────────────────────────────────────────────────────────────┐
│  PROJECT_001  ░░░░░░░░░░░░░░░░░░░░░░░░  ████ LIVE  ██ STABLE        │
│  ─────────────────────────────────────────────────────────────────── │
│                                                                      │
│  AURA                          ┌─────────────────────────────────┐  │
│  INTERIOR         [Web App]    │  DEPLOYMENT CONSOLE             │  │
│  APP                           │  ─────────────────────────────  │  │
│                                │  $ npm run build                │  │
│  First webpage. The beginning  │  ✓ Compiled successfully        │  │
│  of everything. Built when     │  $ vercel deploy --prod         │  │
│  the only tool was ambition.   │  ✓ Deployed to production       │  │
│                                │  ◉ SYSTEM_OPERATIONAL           │  │
│  [React]  [Vercel]             │                                 │  │
│  [First Project]               │  CPU  ████████░░  76%           │  │
│                                │  MEM  ██████░░░░  61%           │  │
│  [→ Visit Live Site ↗]         │  NET  ███░░░░░░░  32%  ● STABLE │  │
│                                └─────────────────────────────────┘  │
│                                                                      │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  UPTIME: 99.9%   │
└──────────────────────────────────────────────────────────────────────┘
```
Project 002 (AdLogix): layout mirrors — terminal LEFT, info RIGHT.

**Terminal deployment replay sequence (on scroll-enter):**
```
$ npm run build              ← typewriter, char by char
  Compiling...               ← 800ms delay, ellipsis animation
✓ Compiled successfully      ← green, instant flash
$ vercel deploy --prod       ← types after 400ms pause
  Uploading...               ← animated ellipsis
✓ Deployed to production     ← green flash
◉ SYSTEM_OPERATIONAL         ← cyan, slow pulse begins
```
Total: ~3.5 seconds. Mobile: 2× speed.

**Monitor persistence/glow lag:** Bright cyan/green terminal lines have a subtle after-image — `text-shadow` with 0.3s fade after text renders. Makes console feel physical, CRT-like.

**Diagnostics behavior (while hovered):**
- CPU: fluctuates ±2% randomly every 1.5–3s
- NET: pulse fluctuation — small value changes on 800ms interval
- MEM: stable but occasional 1% shift
- Prevents panels from feeling frozen/static

**Hover interaction cascade:**
1. Magnetic pull: card tracks cursor at `pointerOffset * 0.04`, max 12px, spring physics `stiffness:150 damping:20`
2. Border hue shift: inner border brightens, cycles purple→cyan→purple on 1.5s loop while hovered
3. Scan sweep: 2px horizontal line descends top→bottom over 0.6s on hover-enter (once only, does not repeat)

**PROJECTS_ENTER synchronized moment:**
- One scan-beam sweeps the canvas simultaneously with the first scan across deployment chamber 001
- Precisely timed — canvas beam and UI scan line begin at the same frame
- Creates a strong "system initialization" moment

**Per-project environmental personality:**
- Aura Interior: softer ambient glow during hover, smoother particle pulse timing
- AdLogix: sharper canvas scan frequency while card is active, more aggressive diagnostic fluctuation speed

**"More systems" footer:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  SCANNING FOR ADDITIONAL SYSTEMS...  ░░░░░░░░░░░░░░░░░  [STANDBY]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
Progress bar fills slowly, never completes.

**Mobile:** Single column. Terminal below info. Magnetic effect disabled. Terminal animation still plays at 2× speed.

---

### 7.5 LIFESTYLE SECTION

**Section name:** "Protocol: Human"
**Scene atmosphere:** Organic drift, warm purple, relaxed bloom, no geometry, no scan beams — the only calm scene.

**Layout:** Asymmetric bento grid with rotation angles (NOT uniform 4-column grid):

```
THE WAY  //  05 / PROTOCOL: HUMAN
──────────────────────────────────

 ┌──────────────────────────┬────────────────┬────────────────┐
 │  💪 GYM DISCIPLINE        │  🌙 LATE-NIGHT  │  🏍️ BIKES     │
 │  [LARGE — rotate: -1.5°] │  CODING         │  & CARS        │
 │                           │  [rotate: +1°]  │  [rotate: -1°] │
 │  "The body is the first   ├────────────────┴────────────────┤
 │   system you master."     │  ✈️ TRAVELING  [WIDE]            │
 │                           │  "Every destination is a new    │
 │                           │   operating system to explore." │
 └──────────────────────────┴─────────────────────────────────┘

 ┌──────────┬────────────────────────────────┬────────────────┐
 │  🐾 PETS  │  🎯 DEEP WORK [LARGE: +1.5°]  │  🏏 CRICKET   │
 │  [SMALL]  │  "Hours of silence =           │  [SMALL]       │
 │           │   years of progress.           │               │
 │           │   The introvert's edge."       │               │
 └──────────┴────────────────────────────────┴────────────────┘

 [📈 SELF-GROWTH — full-width strip]
 "Always becoming the next version. Never finished. Never settled."
```

**Card anatomy:**
- Unique accent color per card (not uniform cyan) — tied to emotional energy of each item:
  - Gym: fierce orange `#f97316`
  - Coding: cool cyan `#06b6d4`
  - Bikes: electric blue `#3b82f6`
  - Travel: warm gold `#f59e0b`
  - Pets: soft green `#10b981`
  - Deep Work: sharp white `#f1f5f9`
  - Cricket: earthy amber `#d97706`
  - Self-Growth: rising violet `#8b5cf6`
- Accent bleeds as subtle glow at card's dominant corner
- Lucide icon with accent color glow (not raw emoji)
- Cinematic description: first person, present tense

**Hover behavior:**
1. Card rotates from resting tilt → 0° (feels like being picked up from a surface)
2. Ambient shadow expands and shifts toward viewer (`box-shadow` depth increase)
3. Accent color glow intensifies at card edges
4. Accent color briefly bleeds into canvas background light in that region — ~200px radius, very subtle (canvas `pointLight` color lerps toward card accent while hovered, then reverts)

**Quote (left-aligned, NOT centered):**
```
"The quiet hours, the disciplined mornings,
 the focused nights —

 this is where the future is built."

                             — Lokesh Kumar G
```
`"this is where the future is built."` — `gradient-text`. All other text — `text-white/70`.

**Mobile:** 2-column grid, rotation angles halved, all cards same size.

---

### 7.6 VISION SECTION

**Layout:** Full viewport snap. Final cinematic moment. Three mission panels float asymmetrically at staggered depths — not a grid.

**Section header (minimal, top-left):**
```
FINAL TRANSMISSION  //  06 / THE VISION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Left column:**
```
MISSION
OBJECTIVES
──────────
[Loading ████░░]   ← progress bar fills as section enters
```

**Three objective panels — floating asymmetrically:**
- OBJ_001 (Financial Freedom): upper-left position, parallax depth coefficient 0.8
- OBJ_002 (Luxury Lifestyle): center, slightly lower, depth coefficient 1.0
- OBJ_003 (Travel The World): right, even lower, depth coefficient 1.3
- Different depth coefficients = different parallax response speed to mouse → panels feel suspended in physical space, not layered UI

**Objective panel anatomy:**
```
┌───────────────────────────┐
│  OBJ_001                  │
│  ░░░░░░░░░░  STATUS:      │
│              TARGET ↗     │  ← NOT "LOCKED", NOT "ACHIEVED"
│  FINANCIAL                │
│  FREEDOM                  │
│  ─────────────────────    │
│  "Independence from        │
│   every system."          │
│                           │
│  [Crown icon — glowing]   │
└───────────────────────────┘
```

Status starts as `LOADING...` → transitions to `TARGET ↗` as VISION_HOLD resolves (brief flash on update). Honest: these are destinations, not achievements.

**VISION_HOLD authored moment (the most memorable beat):**
1. Particles reach maximum radial spread
2. Velocity decelerates to near-zero (not mathematical freeze — tiny residual motion persists, organic)
3. 2-second stillness — canvas almost silent
4. Cyan core pulses once every ~4 seconds after stabilization (system still breathing)
5. Particles begin slow inward spiral
6. Lights decay to quiet single pulse

**Final quote reveal:**
```
THIS IS ONLY          ← neon-text, clamp(4rem, 12vw, 10rem), tracking tight
THE BEGINNING.        ← gradient-text, same scale
```
- `THIS IS ONLY` animates in first
- 0.4s pause
- `THE BEGINNING.` animates in
- Then: a single scan line passes left→right across both lines once
- Where scan line passes over `THE BEGINNING.` — gradient intensity briefly peaks (luminance spike under the scan position)
- Scan line disappears. Nothing more.

**The last particle:**
- After VISION_HOLD stabilizes and particles spiral inward, one single small particle (`size: 0.03`) continues drifting slowly upward
- It does not loop. It simply moves upward and eventually leaves the viewport
- No label. No call-out. Just there for those who notice.
- Symbolically: the journey continues.

**Footer:**
```
© 2026 LOKESH.SYSTEM // ALL TIMELINES RESERVED      BUILT WITH VISION & CODE
```
One line. Minimal. `text-white/30`, `font-mono text-xs`.

---

## 8. Visual System

### Color Palette
| Role | Value | Usage |
|---|---|---|
| Background | `#000308` | Page background, canvas background |
| Primary glow | `#06b6d4` | Cyan — system active, tech, data |
| Secondary glow | `#a855f7` | Purple — consciousness, intelligence |
| Accent | `#3b82f6` | Blue — structural, logical |
| Energy | `#ec4899` | Pink — fill light, emotional moments |
| Warning/Power | `#f97316` | Orange — Gym, physical energy |
| Warm | `#f59e0b` | Gold — Travel, freedom |

### Typography
| Role | Font | Weight | Notes |
|---|---|---|---|
| Display | Space Grotesk | 700 | All major headings |
| Mono | JetBrains Mono | 400/500 | HUD, terminals, labels |
| Body | Space Grotesk | 400 | Descriptions |

### Glassmorphism Tokens
```css
.glass        { background: rgba(255,255,255,0.03); backdrop-filter: blur(20px) saturate(180%); border: 1px solid rgba(255,255,255,0.08); }
.glass-strong { background: rgba(255,255,255,0.05); backdrop-filter: blur(30px) saturate(200%); border: 1px solid rgba(255,255,255,0.12); }
.glass-panel  { background: rgba(0,3,8,0.7); backdrop-filter: blur(40px); border: 1px solid rgba(6,182,212,0.15); }
```

### Utility Classes
- `.neon-text` — purple glow text-shadow (3 layers)
- `.cyan-glow` — cyan glow text-shadow
- `.gradient-text` — purple→blue→cyan animated gradient fill
- `.grid-bg` — 50px purple grid lines, 5% opacity
- `.holographic-border` — animated gradient border pseudo-element
- `.cinematic-fade-top` — mask-image fade at top and bottom

---

## 9. Motion Philosophy

**Core principle:** Motion serves narrative. Every animation is symbolic, not decorative.

**Timing defaults:**
- Section reveals: `duration: 0.8s, ease: easeOut`
- Canvas state lerp: `delta * 0.05` per frame (~20 frame crossfade at 60fps)
- Spring interactions: `stiffness: 150, damping: 20`
- Stagger children: `0.1s` between items

**Rules:**
1. Never animate just to animate
2. Every particle state has a symbolic name and meaning
3. Bridge states are emotionally authored, not mathematically interpolated
4. Stillness is as powerful as motion (VISION_HOLD proves this)
5. The canvas reacts to the user (mouse parallax, section awareness)
6. Mobile gets 90% of the experience — only heavy WebGL is reduced

---

## 10. Mobile Strategy

| Feature | Desktop | Mobile |
|---|---|---|
| Particle count | 2000 | 600 |
| Post-processing | Full stack | CSS glow only |
| 3D geometry | Full | Half complexity |
| Canvas DPR | [1, 2] | [1, 1.5] |
| Magnetic hover | Active | Disabled |
| HUD overlay | Full | 2 items |
| Bento grid | Asymmetric | 2-column uniform |
| Terminal animation | 3.5s | 1.75s (2× speed) |
| Cursor | Custom glow | Hidden |
| Card rotation | ±1.5° | ±0.5° |

Scene state transitions still fire on mobile — same emotional arc, lighter execution.

---

## 11. Content Updates (personal.js)

Timeline descriptions replace generic text with cinematic memory fragments:
- Career: `"The first line of code written at 2am. The first system that felt alive."`
- Gym: `"The body became the first discipline. Everything after was easier."`
- Bike: `"Freedom on two wheels. The city seen differently for the first time."`
- Car: `"Four wheels. More distance. The same hunger to move."`
- Webpage: `"A blank screen became something. That moment doesn't leave you."`

Vision objective descriptions added:
- Financial Freedom: `"Independence from every system."`
- Luxury Lifestyle: `"The reward of relentless execution."`
- Travel The World: `"Every border is a system unlocked."`

---

## 12. Out of Scope

- Backend / contact form / email sending
- CMS integration
- Analytics
- SEO optimization (meta tags only, no structured data)
- Additional projects beyond existing 2
- Authentication or user state
