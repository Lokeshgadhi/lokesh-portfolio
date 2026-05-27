# Portfolio Enhancement Progress

## Project
**Lokesh Kumar G — Cinematic Portfolio**
Next.js 14 · React Three Fiber · Framer Motion · Lenis · Tailwind CSS

---

## Completed

### Cinematic AI Operating System Overhaul (2026-05-26)
- Replaced the standard scrolling layout with the dynamic `<SystemSceneManager />` controlling full-viewport active scenes.
- Locked browser scrolling and bound mouse wheel, touch swipe gestures, and keyboard hooks to slide transitions.
- Integrated a persistent `GlobalCanvas` backdrop that morphs coordinates (skyscrapers, 3D neural brain synapses, 3D rotating globe, code monitors, particle vortex, volumetric beacon) and interpolates camera/fog/light variables.
- Added `BootSequence` loading screens with synthetic key-click and sync beeps procedurally generated using the browser's Web Audio API.
- Redesigned all 6 overlay layers: Hero, Mind (skills network), Timeline (origin coordinates + milestones), Projects (dual terminals), Lifestyle (8 behavioral monitors), and Vision (final transmission quote + contact command terminal).
- Constructed a global HUD telemetry border (CPU, system loading logs) and a layer navigation sidebar.
- Production build compiles successfully.

### Baseline Build (2026-05-25)
- `npm run build` passes clean — zero errors, zero warnings
- Dev server runs at `http://localhost:3001` (port 3000 occupied)
- All 7 sections render: Hero, Neural Brain, Origin, Timeline, Projects, Lifestyle, Vision
- Three.js hero scene working: cyberpunk city, 1500 particles, character silhouette, fog rings, parallax camera
- Lenis smooth scroll, custom cursor, Framer Motion animations all confirmed working
- Static export: 58.3 kB for `/`, First Load JS 146 kB

---

## Planned Enhancements (in order)

### 1. Bloom / Glow — Hero Scene `[NEXT UP]`
**Package:** `@react-three/postprocessing`
**Approach:** Global Bloom + Emissive Tuning (Approach B)
- `EffectComposer` + `Bloom` inside the R3F Canvas
- Three named presets at top of `HeroScene.jsx` — SUBTLE / CINEMATIC / EXTREME
- Default preset: CINEMATIC (Blade Runner energy, not blinding)
- Slight emissive bumps on character silhouette (body 0.2→0.4, head 0.3→0.5) so they catch bloom properly
- Particles already use `AdditiveBlending` — will bloom for free
- Dev toggle button (bottom-left, cyberpunk HUD style) — default ON
- Wrap toggle in `// DEV TOGGLE — Remove before production` comment block

**Files to change:**
- `package.json` — add `@react-three/postprocessing`
- `src/components/three/HeroScene.jsx` — EffectComposer + Bloom + presets + emissive tuning
- `src/components/sections/HeroSection.jsx` — bloomEnabled state + toggle button + prop pass

### 2. Real Earth Texture — Origin Section
**Goal:** Replace the simplified Earth visual in `OriginSection.jsx` with a proper sphere using a real texture map
**Asset:** Download from [Solar System Scope](https://www.solarsystemscope.com/textures/) (free for personal use — verify license)
**Approach:** `useTexture` from `@react-three/drei` + `meshStandardMaterial map={texture}`
**Files to change:** `src/components/sections/OriginSection.jsx`, `public/textures/earth.jpg`

### 3. Spline 3D Scene Support
**Package:** `@splinetool/react-spline`
**Goal:** Embed a pre-built Spline scene (`.splinecode` URL) into a section
**TBD:** Which section, which Spline scene, where the file lives

### 4. AI Chat Section
**Goal:** Working AI chat interface as a portfolio section ("Talk to the Digital Mind")
**Backend:** TBD — options are Anthropic API (Claude), OpenAI, or a serverless Next.js route
**Frontend:** Chat UI component, streaming responses, cyberpunk styling
**Files to create:** `src/components/sections/AIChatSection.jsx`, `src/app/api/chat/route.js`

---

## Key Decisions Made

| Decision | Choice | Reason |
|---|---|---|
| Bloom approach | Global + Emissive Tuning (Approach B) | Best cinematic result; neon elements bloom naturally, particles glow for free via AdditiveBlending |
| Dev toggle default | ON | Site looks final by default |
| Toggle persistence | Dev-only, removable | Wrapped in clear comment, not for visitors |
| Earth texture source | Solar System Scope | Free, high quality, good license for personal portfolios |

---

## Architecture Notes

- All Three.js scenes use `dynamic(() => import(...), { ssr: false })` — keep this pattern for any new 3D additions
- Personal data lives in `src/data/personal.js` — single source of truth for content
- `node_modules` and `.next` are in `.gitignore` — safe to commit everything else

---

## Next Immediate Steps

1. **You run:** `git init && git add . && git commit -m "baseline"`
2. Install `@react-three/postprocessing` and implement bloom (Enhancement #1 above)
3. Test on dev server, tune intensity, confirm 60fps feel
4. Move to Earth texture (Enhancement #2)
