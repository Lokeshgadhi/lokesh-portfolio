# 🌌 Lokesh Kumar G — The Digital Mind

> An immersive cinematic portfolio experience built with Next.js, Three.js, and Framer Motion.

**Building systems today for the freedom of tomorrow.**

---

## ⚡ Tech Stack

- **Next.js 14** — App Router
- **React 18**
- **Three.js + React Three Fiber** — 3D hero scene
- **Framer Motion** — Animations & transitions
- **GSAP** — (Available for advanced scroll animations)
- **Lenis** — Smooth scrolling
- **Tailwind CSS** — Styling
- **Lucide React** — Icons

## 🎬 Sections

1. **Hero** — Cyberpunk city with 3D character silhouette (Three.js)
2. **Neural Brain** — Interactive skill network visualization
3. **Origin Story** — Cinematic calendar + Earth reveal sequence
4. **Timeline** — Year portals with milestone cards
5. **Projects** — Holographic dashboard project displays
6. **Lifestyle** — Discipline and principles grid
7. **Vision** — Future goals with starry night sky finale

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.17 or higher
- **npm** or **yarn** or **pnpm**

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd lokesh-portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   *Note: This will install ~50+ packages. May take 2-3 minutes.*

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

---

## 📂 Project Structure

```
lokesh-portfolio/
├── src/
│   ├── app/
│   │   ├── globals.css       # Global styles + custom utilities
│   │   ├── layout.js          # Root layout with metadata
│   │   └── page.js            # Main page orchestration
│   ├── components/
│   │   ├── sections/          # Page sections
│   │   │   ├── HeroSection.jsx
│   │   │   ├── NeuralBrainSection.jsx
│   │   │   ├── OriginSection.jsx
│   │   │   ├── TimelineSection.jsx
│   │   │   ├── ProjectsSection.jsx
│   │   │   ├── LifestyleSection.jsx
│   │   │   └── VisionSection.jsx
│   │   ├── three/             # Three.js scenes
│   │   │   └── HeroScene.jsx
│   │   └── ui/                # Reusable UI components
│   │       ├── Navigation.jsx
│   │       ├── CustomCursor.jsx
│   │       └── SmoothScrollProvider.jsx
│   └── data/
│       └── personal.js        # All your personal data
├── public/                    # Static assets
├── package.json
├── tailwind.config.mjs
├── next.config.mjs
├── postcss.config.mjs
└── jsconfig.json
```

---

## ✏️ Customization

### Update Your Information

All your personal data lives in **`src/data/personal.js`**. Update:

- Name, tagline, identity tags
- Birth date and location
- Skills with custom colors
- Timeline events
- Projects (name, URL, description)
- Lifestyle elements
- Vision goals

### Change Colors

Edit `tailwind.config.mjs` to customize the neon palette:

```js
colors: {
  'neon-purple': '#a855f7',    // Change to your preferred purple
  'neon-blue': '#3b82f6',      // Or any color
  'neon-cyan': '#06b6d4',
}
```

### Replace 3D Character

The character in the hero is a simple silhouette in `src/components/three/HeroScene.jsx`. For a real anime character model, you would need to:

1. Obtain a `.glb` or `.gltf` 3D model
2. Place it in `public/models/`
3. Import using `useGLTF` from `@react-three/drei`

---

## ⚠️ Things I Want To Be Honest About

This portfolio was built within real constraints. Here's what is and isn't included from the original spec, so you have clear expectations:

### ✅ What Works
- Three.js cyberpunk hero scene with floating particles, fog, and skyscrapers
- Interactive neural network with hoverable skill nodes
- Multi-stage origin story (calendar → Earth → reveal)
- Cinematic timeline with year portals
- Holographic-style project showcases with hover effects
- Smooth Lenis scrolling
- Custom cursor with glow follower
- Full responsive design

### 🟡 What's Simplified vs. Original Vision
- **Anime character model**: Used a stylized silhouette instead of a custom 3D anime model (would need a 3D artist)
- **Spline 3D scenes**: Not included — would require pre-built `.splinecode` files
- **GLSL shaders**: Not included — used standard Three.js materials + CSS for performance
- **AI Clone with voice**: Not included — would need a backend + LLM API integration
- **Volumetric fog & advanced post-processing**: Used basic fog; advanced bloom would require `@react-three/postprocessing` and may impact performance
- **Real rotating Earth with continents**: Simplified visual representation (a real Earth would need a texture map)

### 💡 If You Want To Add More
- Install `@react-three/postprocessing` for bloom & glow effects
- Add a real Earth texture from [Solar System Scope](https://www.solarsystemscope.com/textures/) (verify license)
- Integrate Spline scenes via `@splinetool/react-spline`
- Add an AI chat using OpenAI/Anthropic API with a backend

*I'd recommend verifying any third-party assets, fonts, or library versions in their current docs before adding them.*

---

## 🐛 Troubleshooting

**Three.js scene not loading?**
- Make sure you're using Node 18+ 
- Try `rm -rf node_modules .next && npm install`

**Hydration errors?**
- The Three.js scene is dynamically imported with `ssr: false` to prevent this. If you add more 3D, do the same.

**Performance issues?**
- Reduce particle count in `HeroScene.jsx` (currently 1500)
- Disable the custom cursor on lower-end devices

---

## 📝 License

Personal portfolio code — free to use and modify for your own portfolio.
3D scene techniques are common patterns from the Three.js / R3F community.

---

## 🚀 Deploy

The easiest way to deploy is with [Vercel](https://vercel.com):

```bash
npm install -g vercel
vercel
```

---

**Built by Lokesh Kumar G**  
*This is only the beginning.*
