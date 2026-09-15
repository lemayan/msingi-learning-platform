import { createClient } from "@sanity/client";

const token = "skDiML82y8KB2AQgIoH3NBQCJWJEJIaHQ4uIOK8MkTiEu1MlaJIEbNvAJ9zmt72Njdhel2GofRPpaOgPECbzqmKRXa96utMCY9zR0x2t2BPj7qJlLrEeLvYbfTcUkLm8MJ989PkWFJGDgVoIYKeiPJ4Z1t5pkYPBenXaNcNEZOAg81VPwxNR";
const projectId = "xyto8u3e";
const dataset = "production";

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
  token,
});

// Helper for high-resolution SVGs (1600x900, 16:9 ratio)
const courseGraphics = {
  "building-ai-apps-with-llms": {
    alt: "Neural network nodes and large language model transformer architecture graphic",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090A1A" />
      <stop offset="50%" stop-color="#151238" />
      <stop offset="100%" stop-color="#241042" />
    </linearGradient>
    <linearGradient id="primaryGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#A855F7" />
      <stop offset="100%" stop-color="#EC4899" />
    </linearGradient>
    <linearGradient id="accentGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#6366F1" />
      <stop offset="100%" stop-color="#A855F7" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <rect width="1600" height="900" fill="url(#bg)" />

  <!-- Background grid pattern -->
  <g opacity="0.12" stroke="#A855F7" stroke-width="1">
    <path d="M0,150 L1600,150 M0,300 L1600,300 M0,450 L1600,450 M0,600 L1600,600 M0,750 L1600,750" />
    <path d="M200,0 L200,900 M400,0 L400,900 M600,0 L600,900 M800,0 L800,900 M1000,0 L1000,900 M1200,0 L1200,900 M1400,0 L1400,900" />
  </g>

  <!-- Neural network connections -->
  <g stroke="url(#accentGlow)" stroke-width="3" opacity="0.45" filter="url(#glow)">
    <line x1="450" y1="450" x2="650" y2="300" />
    <line x1="450" y1="450" x2="650" y2="450" />
    <line x1="450" y1="450" x2="650" y2="600" />
    
    <line x1="650" y1="300" x2="950" y2="250" />
    <line x1="650" y1="300" x2="950" y2="450" />
    <line x1="650" y1="450" x2="950" y2="350" />
    <line x1="650" y1="450" x2="950" y2="550" />
    <line x1="650" y1="600" x2="950" y2="450" />
    <line x1="650" y1="600" x2="950" y2="650" />

    <line x1="950" y1="250" x2="1150" y2="450" />
    <line x1="950" y1="350" x2="1150" y2="450" />
    <line x1="950" y1="450" x2="1150" y2="450" />
    <line x1="950" y1="550" x2="1150" y2="450" />
    <line x1="950" y1="650" x2="1150" y2="450" />
  </g>

  <!-- Neural Nodes -->
  <g fill="#090A1A" stroke="url(#primaryGlow)" stroke-width="4">
    <!-- Input layer -->
    <circle cx="450" cy="450" r="32" filter="url(#glow)" />
    <!-- Hidden layer 1 -->
    <circle cx="650" cy="300" r="24" />
    <circle cx="650" cy="450" r="28" fill="#8B5CF6" />
    <circle cx="650" cy="600" r="24" />
    <!-- Hidden layer 2 -->
    <circle cx="950" cy="250" r="22" />
    <circle cx="950" cy="350" r="26" fill="#A855F7" />
    <circle cx="950" cy="450" r="32" fill="#EC4899" filter="url(#glow)" />
    <circle cx="950" cy="550" r="26" fill="#A855F7" />
    <circle cx="950" cy="650" r="22" />
    <!-- Output layer -->
    <circle cx="1150" cy="450" r="36" filter="url(#glow)" />
  </g>

  <!-- Node Inner Pulses -->
  <circle cx="450" cy="450" r="14" fill="#FFFFFF" opacity="0.9" />
  <circle cx="950" cy="450" r="16" fill="#FFFFFF" opacity="0.9" />
  <circle cx="1150" cy="450" r="18" fill="#FFFFFF" opacity="0.95" />

  <!-- Center AI Sparkle Glyph -->
  <path d="M800,180 Q800,240 750,240 Q800,240 800,300 Q800,240 850,240 Q800,240 800,180 Z" fill="#F472B6" filter="url(#glow)" />
  <path d="M1250,280 Q1250,320 1220,320 Q1250,320 1250,360 Q1250,320 1280,320 Q1250,320 1250,280 Z" fill="#C084FC" />

  <!-- Prominent Badge -->
  <rect x="580" y="730" width="440" height="64" rx="32" fill="#1E1338" stroke="#A855F7" stroke-width="2" opacity="0.9" />
  <text x="800" y="772" fill="#F3E8FF" font-size="24" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" text-anchor="middle" letter-spacing="3">
    LLMS &amp; NEURAL NETWORKS
  </text>
</svg>`,
  },

  "devops-with-docker-and-kubernetes": {
    alt: "Docker containers, Kubernetes helm wheel, and cloud orchestration infrastructure graphic",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06121E" />
      <stop offset="50%" stop-color="#0C253E" />
      <stop offset="100%" stop-color="#083344" />
    </linearGradient>
    <linearGradient id="k8sBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#326CE5" />
      <stop offset="100%" stop-color="#0EA5E9" />
    </linearGradient>
    <linearGradient id="dockerCyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06B6D4" />
      <stop offset="100%" stop-color="#38BDF8" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="14" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <rect width="1600" height="900" fill="url(#bg)" />

  <!-- Cloud Infrastructure Matrix -->
  <g opacity="0.12" stroke="#0EA5E9" stroke-width="1">
    <circle cx="800" cy="430" r="380" fill="none" stroke-dasharray="8 8" />
    <circle cx="800" cy="430" r="260" fill="none" />
    <circle cx="800" cy="430" r="140" fill="none" stroke-dasharray="4 4" />
  </g>

  <!-- Kubernetes Steering Wheel (Helm) -->
  <g transform="translate(800, 410)" filter="url(#glow)">
    <!-- 7 Helm Spokes -->
    <g stroke="url(#dockerCyan)" stroke-width="12" stroke-linecap="round">
      <line x1="0" y1="-140" x2="0" y2="140" />
      <line x1="-128" y1="-57" x2="128" y2="57" />
      <line x1="-109" y1="89" x2="109" y2="-89" />
      <line x1="-35" y1="136" x2="35" y2="-136" />
      <line x1="89" y1="109" x2="-89" y2="-109" />
    </g>

    <!-- Outer Rim -->
    <circle cx="0" cy="0" r="140" fill="none" stroke="url(#k8sBlue)" stroke-width="18" />

    <!-- 7 Helm Handles -->
    <circle cx="0" cy="-170" r="16" fill="#38BDF8" />
    <circle cx="132" cy="-107" r="16" fill="#38BDF8" />
    <circle cx="165" cy="41" r="16" fill="#38BDF8" />
    <circle cx="74" cy="153" r="16" fill="#38BDF8" />
    <circle cx="-74" cy="153" r="16" fill="#38BDF8" />
    <circle cx="-165" cy="41" r="16" fill="#38BDF8" />
    <circle cx="-132" cy="-107" r="16" fill="#38BDF8" />

    <!-- Center Hub -->
    <circle cx="0" cy="0" r="60" fill="#0C253E" stroke="url(#dockerCyan)" stroke-width="10" />
    <polygon points="0,-26 24,18 -24,18" fill="#38BDF8" />
  </g>

  <!-- Left: Docker Stacked Container Blocks -->
  <g transform="translate(240, 320)" filter="url(#glow)">
    <!-- Row 1 -->
    <rect x="0" y="80" width="70" height="50" rx="8" fill="#0284C7" stroke="#38BDF8" stroke-width="2" />
    <rect x="85" y="80" width="70" height="50" rx="8" fill="#0284C7" stroke="#38BDF8" stroke-width="2" />
    <rect x="170" y="80" width="70" height="50" rx="8" fill="#0369A1" stroke="#38BDF8" stroke-width="2" />
    <!-- Row 2 -->
    <rect x="42" y="20" width="70" height="50" rx="8" fill="#0EA5E9" stroke="#E0F2FE" stroke-width="2" />
    <rect x="127" y="20" width="70" height="50" rx="8" fill="#0284C7" stroke="#38BDF8" stroke-width="2" />
    <!-- Row 3 -->
    <rect x="85" y="-40" width="70" height="50" rx="8" fill="#38BDF8" stroke="#FFFFFF" stroke-width="2" />
  </g>

  <!-- Right: Cloud Node Pods -->
  <g transform="translate(1200, 320)">
    <rect x="0" y="0" width="160" height="90" rx="14" fill="#0F2B48" stroke="#06B6D4" stroke-width="3" />
    <circle cx="35" cy="45" r="12" fill="#22C55E" />
    <text x="65" y="52" fill="#E0F2FE" font-size="20" font-family="monospace">node-01</text>

    <rect x="30" y="110" width="160" height="90" rx="14" fill="#0F2B48" stroke="#06B6D4" stroke-width="3" />
    <circle cx="65" cy="155" r="12" fill="#22C55E" />
    <text x="95" y="162" fill="#E0F2FE" font-size="20" font-family="monospace">node-02</text>
  </g>

  <!-- Badge -->
  <rect x="560" y="730" width="480" height="64" rx="32" fill="#082238" stroke="#0EA5E9" stroke-width="2" />
  <text x="800" y="772" fill="#E0F2FE" font-size="24" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" text-anchor="middle" letter-spacing="3">
    DOCKER &amp; KUBERNETES DEVOPS
  </text>
</svg>`,
  },

  "nextjs-app-router-in-depth": {
    alt: "Next.js App Router architecture and server client boundary graphic",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#000000" />
      <stop offset="60%" stop-color="#0B0F17" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <linearGradient id="nextSlash" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <rect width="1600" height="900" fill="url(#bg)" />

  <!-- Radial Glow Behind Logo -->
  <circle cx="800" cy="410" r="280" fill="#3B82F6" opacity="0.08" filter="url(#glow)" />

  <!-- Central Next.js Emblem -->
  <g transform="translate(800, 400)">
    <circle cx="0" cy="0" r="160" fill="#000000" stroke="#334155" stroke-width="4" />
    
    <!-- Next 'N' stylized shape -->
    <path d="M-60,75 L-60,-75 L-25,-75 L50,45 L50,-75 L80,-75 L80,75 L45,75 L-30,-45 L-30,75 Z" fill="#FFFFFF" />
    <!-- Gradient slash across N -->
    <path d="M-30,-45 L50,75 L75,75 L-5,-45 Z" fill="url(#nextSlash)" />
  </g>

  <!-- Left: Server Components Tree -->
  <g transform="translate(280, 290)">
    <rect x="0" y="0" width="220" height="60" rx="10" fill="#1E293B" stroke="#60A5FA" stroke-width="2" />
    <text x="110" y="38" fill="#93C5FD" font-size="18" font-family="monospace" text-anchor="middle">app/layout.tsx</text>

    <line x1="110" y1="60" x2="110" y2="120" stroke="#64748B" stroke-width="2" stroke-dasharray="4 4" />

    <rect x="0" y="120" width="220" height="60" rx="10" fill="#1E293B" stroke="#60A5FA" stroke-width="2" />
    <text x="110" y="158" fill="#93C5FD" font-size="18" font-family="monospace" text-anchor="middle">app/page.tsx</text>

    <rect x="25" y="200" width="170" height="34" rx="17" fill="#1D4ED8" opacity="0.8" />
    <text x="110" y="223" fill="#FFFFFF" font-size="14" font-weight="700" font-family="sans-serif" text-anchor="middle">SERVER COMPONENT</text>
  </g>

  <!-- Right: Client Boundary -->
  <g transform="translate(1100, 290)">
    <rect x="0" y="0" width="230" height="60" rx="10" fill="#1E293B" stroke="#F59E0B" stroke-width="2" />
    <text x="115" y="38" fill="#FCD34D" font-size="18" font-family="monospace" text-anchor="middle">'use client'</text>

    <line x1="115" y1="60" x2="115" y2="120" stroke="#64748B" stroke-width="2" stroke-dasharray="4 4" />

    <rect x="0" y="120" width="230" height="60" rx="10" fill="#1E293B" stroke="#F59E0B" stroke-width="2" />
    <text x="115" y="158" fill="#FCD34D" font-size="18" font-family="monospace" text-anchor="middle">search-bar.tsx</text>

    <rect x="30" y="200" width="170" height="34" rx="17" fill="#B45309" opacity="0.8" />
    <text x="115" y="223" fill="#FFFFFF" font-size="14" font-weight="700" font-family="sans-serif" text-anchor="middle">CLIENT BOUNDARY</text>
  </g>

  <!-- Badge -->
  <rect x="560" y="730" width="480" height="64" rx="32" fill="#0B132B" stroke="#475569" stroke-width="2" />
  <text x="800" y="772" fill="#F8FAFC" font-size="24" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" text-anchor="middle" letter-spacing="3">
    NEXT.JS APP ROUTER IN DEPTH
  </text>
</svg>`,
  },

  "react-performance-engineering": {
    alt: "React performance profiling, speed gauge, and optimization graphic",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#051923" />
      <stop offset="50%" stop-color="#003554" />
      <stop offset="100%" stop-color="#051923" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="14" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <rect width="1600" height="900" fill="url(#bg)" />

  <!-- Speedometer / Performance Arc -->
  <g transform="translate(800, 420)">
    <path d="M-220,0 A220,220 0 1,1 220,0" fill="none" stroke="#1E3A5F" stroke-width="32" stroke-linecap="round" />
    <path d="M-220,0 A220,220 0 0,1 180,-120" fill="none" stroke="#00A6FB" stroke-width="32" stroke-linecap="round" filter="url(#glow)" />

    <!-- Tachometer Needle pointing high performance (fast) -->
    <line x1="0" y1="0" x2="140" y2="-100" stroke="#F97316" stroke-width="8" stroke-linecap="round" filter="url(#glow)" />
    <circle cx="0" cy="0" r="22" fill="#FFFFFF" />

    <!-- Performance Metric Indicator -->
    <text x="0" y="70" fill="#00A6FB" font-size="44" font-weight="900" font-family="monospace" text-anchor="middle">60 FPS</text>
    <text x="0" y="105" fill="#94A3B8" font-size="18" font-family="sans-serif" text-anchor="middle">ZERO WASTE RENDERS</text>
  </g>

  <!-- Left: React Atom Motif -->
  <g transform="translate(360, 400)" filter="url(#glow)">
    <ellipse cx="0" cy="0" rx="130" ry="46" fill="none" stroke="#00A6FB" stroke-width="8" />
    <ellipse cx="0" cy="0" rx="130" ry="46" fill="none" stroke="#00A6FB" stroke-width="8" transform="rotate(60)" />
    <ellipse cx="0" cy="0" rx="130" ry="46" fill="none" stroke="#00A6FB" stroke-width="8" transform="rotate(120)" />
    <circle cx="0" cy="0" r="22" fill="#00A6FB" />
  </g>

  <!-- Right: DevTools Flamegraph Bars -->
  <g transform="translate(1120, 310)">
    <rect x="0" y="0" width="220" height="28" rx="6" fill="#10B981" />
    <rect x="0" y="38" width="140" height="28" rx="6" fill="#059669" />
    <rect x="150" y="38" width="70" height="28" rx="6" fill="#10B981" />
    <rect x="0" y="76" width="90" height="28" rx="6" fill="#34D399" />
    <rect x="100" y="76" width="120" height="28" rx="6" fill="#059669" />
    <text x="110" y="145" fill="#6EE7B7" font-size="18" font-family="monospace" text-anchor="middle">React Profiler: 1.2ms</text>
  </g>

  <!-- Badge -->
  <rect x="540" y="730" width="520" height="64" rx="32" fill="#051923" stroke="#00A6FB" stroke-width="2" />
  <text x="800" y="772" fill="#E0F2FE" font-size="24" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" text-anchor="middle" letter-spacing="3">
    REACT PERFORMANCE ENGINEERING
  </text>
</svg>`,
  },

  "typescript-for-application-developers": {
    alt: "TypeScript type safety, structural typing, and generic systems graphic",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="50%" stop-color="#1E3A8A" />
      <stop offset="100%" stop-color="#172554" />
    </linearGradient>
    <linearGradient id="tsBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3B82F6" />
      <stop offset="100%" stop-color="#1D4ED8" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <rect width="1600" height="900" fill="url(#bg)" />

  <!-- Code/Type matrix background pattern -->
  <g opacity="0.15" fill="#60A5FA" font-family="monospace" font-size="18">
    <text x="120" y="180">type Result&lt;T, E&gt; = Ok&lt;T&gt; | Err&lt;E&gt;;</text>
    <text x="120" y="240">interface StrictConfig extends BaseOptions</text>
    <text x="1100" y="200">type NonNullable&lt;T&gt; = T extends null</text>
    <text x="1100" y="260">infer R ? Promise&lt;R&gt; : never;</text>
  </g>

  <!-- Central TypeScript Emblem -->
  <g transform="translate(800, 400)" filter="url(#glow)">
    <rect x="-130" y="-130" width="260" height="260" rx="36" fill="url(#tsBlue)" stroke="#60A5FA" stroke-width="4" />
    <!-- TS Text Monogram -->
    <text x="-45" y="80" fill="#FFFFFF" font-size="140" font-weight="900" font-family="sans-serif">T</text>
    <text x="35" y="80" fill="#FFFFFF" font-size="140" font-weight="900" font-family="sans-serif">S</text>
  </g>

  <!-- Left: Generic Type Bracket Structure -->
  <g transform="translate(340, 400)">
    <text x="0" y="20" fill="#93C5FD" font-size="72" font-family="monospace" font-weight="300">&lt;</text>
    <text x="50" y="20" fill="#F8FAFC" font-size="54" font-family="monospace" font-weight="700">T extends Model</text>
    <text x="530" y="20" fill="#93C5FD" font-size="72" font-family="monospace" font-weight="300">&gt;</text>
  </g>

  <!-- Right: Verification Checkmark Shield -->
  <g transform="translate(1260, 400)" filter="url(#glow)">
    <path d="M0,-70 L60,-40 L60,30 Q60,80 0,110 Q-60,80 -60,30 L-60,-40 Z" fill="#1E293B" stroke="#3B82F6" stroke-width="4" />
    <path d="M-22,12 L-8,26 L26,-12" fill="none" stroke="#22C55E" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
  </g>

  <!-- Badge -->
  <rect x="520" y="730" width="560" height="64" rx="32" fill="#0F172A" stroke="#3B82F6" stroke-width="2" />
  <text x="800" y="772" fill="#EFF6FF" font-size="24" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" text-anchor="middle" letter-spacing="3">
    TYPESCRIPT FOR DEVELOPERS
  </text>
</svg>`,
  },

  "retrieval-augmented-generation-from-scratch": {
    alt: "Vector embeddings, multi-dimensional search space, and RAG knowledge retrieval pipeline",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#041F1E" />
      <stop offset="50%" stop-color="#064E3B" />
      <stop offset="100%" stop-color="#022C22" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="14" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <rect width="1600" height="900" fill="url(#bg)" />

  <!-- 3D Vector Space Axes -->
  <g transform="translate(800, 420)" stroke="#10B981" opacity="0.4" stroke-width="2">
    <line x1="0" y1="0" x2="0" y2="-240" />
    <line x1="0" y1="0" x2="220" y2="120" />
    <line x1="0" y1="0" x2="-220" y2="120" />
    
    <!-- Coordinate Grid Rings -->
    <ellipse cx="0" cy="0" rx="260" ry="120" fill="none" stroke-dasharray="6 6" />
    <ellipse cx="0" cy="0" rx="160" ry="70" fill="none" />
  </g>

  <!-- Clustered Embeddings -->
  <g transform="translate(800, 420)" filter="url(#glow)">
    <!-- Target Cluster -->
    <circle cx="80" cy="-60" r="12" fill="#34D399" />
    <circle cx="110" cy="-80" r="14" fill="#6EE7B7" />
    <circle cx="130" cy="-40" r="10" fill="#34D399" />
    <circle cx="60" cy="-90" r="10" fill="#A7F3D0" />
    
    <!-- Cosine similarity rays from query -->
    <line x1="-120" y1="-30" x2="80" y2="-60" stroke="#F59E0B" stroke-width="3" stroke-dasharray="4 4" />
    <!-- Query Point -->
    <circle cx="-120" cy="-30" r="16" fill="#F59E0B" stroke="#FFFFFF" stroke-width="3" />
    <text x="-120" y="-55" fill="#FCD34D" font-size="16" font-weight="700" font-family="sans-serif" text-anchor="middle">QUERY</text>

    <!-- Outlier points -->
    <circle cx="-140" cy="80" r="8" fill="#047857" opacity="0.6" />
    <circle cx="-80" cy="110" r="8" fill="#047857" opacity="0.6" />
    <circle cx="140" cy="80" r="8" fill="#047857" opacity="0.6" />
  </g>

  <!-- Left: Document Chunking Pipeline -->
  <g transform="translate(280, 310)">
    <rect x="0" y="0" width="160" height="200" rx="10" fill="#064E3B" stroke="#34D399" stroke-width="2" />
    <line x1="25" y1="40" x2="135" y2="40" stroke="#A7F3D0" stroke-width="6" stroke-linecap="round" />
    <line x1="25" y1="70" x2="135" y2="70" stroke="#A7F3D0" stroke-width="6" stroke-linecap="round" />
    <line x1="25" y1="100" x2="100" y2="100" stroke="#A7F3D0" stroke-width="6" stroke-linecap="round" />
    
    <!-- Arrows to chunks -->
    <path d="M180,100 L240,100" stroke="#34D399" stroke-width="3" marker-end="url(#arrow)" />
    <text x="80" y="235" fill="#6EE7B7" font-size="16" font-family="monospace" text-anchor="middle">Docs -> Chunks</text>
  </g>

  <!-- Right: Top-K Ranked Context -->
  <g transform="translate(1160, 310)">
    <rect x="0" y="0" width="180" height="50" rx="8" fill="#065F46" stroke="#10B981" stroke-width="2" />
    <text x="90" y="32" fill="#E0F2FE" font-size="16" font-family="monospace" text-anchor="middle">Rank 1: Sim 0.94</text>

    <rect x="0" y="65" width="180" height="50" rx="8" fill="#064E3B" stroke="#10B981" stroke-width="2" />
    <text x="90" y="97" fill="#E0F2FE" font-size="16" font-family="monospace" text-anchor="middle">Rank 2: Sim 0.88</text>

    <rect x="0" y="130" width="180" height="50" rx="8" fill="#064E3B" stroke="#047857" stroke-width="2" />
    <text x="90" y="162" fill="#94A3B8" font-size="16" font-family="monospace" text-anchor="middle">Rank 3: Sim 0.82</text>
  </g>

  <!-- Badge -->
  <rect x="550" y="730" width="500" height="64" rx="32" fill="#022C22" stroke="#10B981" stroke-width="2" />
  <text x="800" y="772" fill="#ECFDF5" font-size="24" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" text-anchor="middle" letter-spacing="3">
    RETRIEVAL-AUGMENTED GENERATION
  </text>
</svg>`,
  },

  "python-for-data-work": {
    alt: "Python for data analysis with pandas dataframes, charts, and statistics",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="50%" stop-color="#1E293B" />
      <stop offset="100%" stop-color="#0B1329" />
    </linearGradient>
    <linearGradient id="pyBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#0284C7" />
    </linearGradient>
    <linearGradient id="pyYellow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCD34D" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <rect width="1600" height="900" fill="url(#bg)" />

  <!-- Tabular Dataframe Matrix (Center-Left) -->
  <g transform="translate(320, 270)" filter="url(#glow)">
    <!-- Header -->
    <rect x="0" y="0" width="460" height="50" rx="8" fill="#1E3A8A" />
    <text x="40" y="32" fill="#BAE6FD" font-size="18" font-weight="700" font-family="monospace">index</text>
    <text x="160" y="32" fill="#BAE6FD" font-size="18" font-weight="700" font-family="monospace">revenue</text>
    <text x="290" y="32" fill="#BAE6FD" font-size="18" font-weight="700" font-family="monospace">variance</text>
    <text x="390" y="32" fill="#BAE6FD" font-size="18" font-weight="700" font-family="monospace">score</text>

    <!-- Rows -->
    <rect x="0" y="58" width="460" height="42" fill="#1E293B" opacity="0.9" />
    <text x="40" y="85" fill="#94A3B8" font-size="16" font-family="monospace">0</text>
    <text x="160" y="85" fill="#38BDF8" font-size="16" font-family="monospace">84.2k</text>
    <text x="290" y="85" fill="#34D399" font-size="16" font-family="monospace">+14.2%</text>
    <text x="390" y="85" fill="#FCD34D" font-size="16" font-family="monospace">0.96</text>

    <rect x="0" y="106" width="460" height="42" fill="#0F172A" opacity="0.9" />
    <text x="40" y="133" fill="#94A3B8" font-size="16" font-family="monospace">1</text>
    <text x="160" y="133" fill="#38BDF8" font-size="16" font-family="monospace">92.7k</text>
    <text x="290" y="133" fill="#34D399" font-size="16" font-family="monospace">+18.5%</text>
    <text x="390" y="133" fill="#FCD34D" font-size="16" font-family="monospace">0.98</text>

    <rect x="0" y="154" width="460" height="42" fill="#1E293B" opacity="0.9" />
    <text x="40" y="181" fill="#94A3B8" font-size="16" font-family="monospace">2</text>
    <text x="160" y="181" fill="#38BDF8" font-size="16" font-family="monospace">76.1k</text>
    <text x="290" y="181" fill="#F87171" font-size="16" font-family="monospace">-4.1%</text>
    <text x="390" y="181" fill="#FCD34D" font-size="16" font-family="monospace">0.89</text>
  </g>

  <!-- Statistical Chart Visualization (Right) -->
  <g transform="translate(900, 270)">
    <!-- Chart axes -->
    <line x1="0" y1="210" x2="380" y2="210" stroke="#475569" stroke-width="2" />
    <line x1="0" y1="0" x2="0" y2="210" stroke="#475569" stroke-width="2" />

    <!-- Histogram Bars -->
    <rect x="40" y="110" width="45" height="100" rx="4" fill="url(#pyBlue)" />
    <rect x="105" y="60" width="45" height="150" rx="4" fill="url(#pyBlue)" />
    <rect x="170" y="30" width="45" height="180" rx="4" fill="url(#pyYellow)" />
    <rect x="235" y="80" width="45" height="130" rx="4" fill="url(#pyYellow)" />
    <rect x="300" y="140" width="45" height="70" rx="4" fill="url(#pyBlue)" />

    <!-- Trend Curve -->
    <path d="M40,120 Q170,10 340,150" fill="none" stroke="#F43F5E" stroke-width="4" filter="url(#glow)" />
  </g>

  <!-- Center Python Iconic Motif -->
  <g transform="translate(800, 160)" filter="url(#glow)">
    <circle cx="0" cy="0" r="50" fill="#0F172A" stroke="#38BDF8" stroke-width="3" />
    <text x="0" y="16" fill="#FCD34D" font-size="46" font-weight="900" font-family="monospace" text-anchor="middle">Py</text>
  </g>

  <!-- Badge -->
  <rect x="550" y="730" width="500" height="64" rx="32" fill="#0F172A" stroke="#F59E0B" stroke-width="2" />
  <text x="800" y="772" fill="#FEF3C7" font-size="24" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" text-anchor="middle" letter-spacing="3">
    PYTHON FOR DATA SCIENCE
  </text>
</svg>`,
  },

  "system-design-foundations": {
    alt: "Distributed system design, microservices, load balancing, and caching topology graphic",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F0F23" />
      <stop offset="50%" stop-color="#1E103A" />
      <stop offset="100%" stop-color="#2D0845" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="14" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <rect width="1600" height="900" fill="url(#bg)" />

  <!-- Distributed System Architecture Topology Flow -->
  <g transform="translate(180, 240)" filter="url(#glow)">
    <!-- Clients -->
    <rect x="0" y="110" width="140" height="80" rx="12" fill="#1E1B4B" stroke="#818CF8" stroke-width="3" />
    <text x="70" y="156" fill="#E0E7FF" font-size="18" font-weight="700" font-family="sans-serif" text-anchor="middle">CLIENTS</text>

    <!-- Arrow 1 -->
    <line x1="140" y1="150" x2="230" y2="150" stroke="#818CF8" stroke-width="4" />

    <!-- Load Balancer -->
    <rect x="230" y="80" width="160" height="140" rx="16" fill="#311042" stroke="#C084FC" stroke-width="3" />
    <text x="310" y="145" fill="#F3E8FF" font-size="18" font-weight="700" font-family="sans-serif" text-anchor="middle">LOAD</text>
    <text x="310" y="172" fill="#F3E8FF" font-size="18" font-weight="700" font-family="sans-serif" text-anchor="middle">BALANCER</text>

    <!-- Fan-out arrows -->
    <line x1="390" y1="120" x2="480" y2="70" stroke="#C084FC" stroke-width="3" />
    <line x1="390" y1="150" x2="480" y2="150" stroke="#C084FC" stroke-width="3" />
    <line x1="390" y1="180" x2="480" y2="230" stroke="#C084FC" stroke-width="3" />

    <!-- Service Instances -->
    <rect x="480" y="30" width="170" height="60" rx="10" fill="#1E1B4B" stroke="#A855F7" stroke-width="2" />
    <text x="565" y="66" fill="#E9D5FF" font-size="16" font-family="monospace" text-anchor="middle">api-service-1</text>

    <rect x="480" y="120" width="170" height="60" rx="10" fill="#1E1B4B" stroke="#A855F7" stroke-width="2" />
    <text x="565" y="156" fill="#E9D5FF" font-size="16" font-family="monospace" text-anchor="middle">api-service-2</text>

    <rect x="480" y="210" width="170" height="60" rx="10" fill="#1E1B4B" stroke="#A855F7" stroke-width="2" />
    <text x="565" y="246" fill="#E9D5FF" font-size="16" font-family="monospace" text-anchor="middle">api-service-3</text>

    <!-- Cache Layer (Redis) -->
    <rect x="730" y="30" width="200" height="80" rx="12" fill="#450A0A" stroke="#EF4444" stroke-width="3" />
    <text x="830" y="75" fill="#FEE2E2" font-size="18" font-weight="700" font-family="sans-serif" text-anchor="middle">REDIS CACHE</text>

    <!-- Partitioned Database Cluster -->
    <rect x="730" y="170" width="200" height="120" rx="12" fill="#0C4A6E" stroke="#38BDF8" stroke-width="3" />
    <text x="830" y="225" fill="#E0F2FE" font-size="18" font-weight="700" font-family="sans-serif" text-anchor="middle">SHARDED DB</text>
    <text x="830" y="255" fill="#BAE6FD" font-size="14" font-family="monospace" text-anchor="middle">Primary / Replica</text>

    <!-- Connections to storage -->
    <line x1="650" y1="60" x2="730" y2="60" stroke="#EF4444" stroke-width="3" stroke-dasharray="4 4" />
    <line x1="650" y1="150" x2="730" y2="210" stroke="#38BDF8" stroke-width="3" />
    <line x1="650" y1="240" x2="730" y2="240" stroke="#38BDF8" stroke-width="3" />
  </g>

  <!-- Badge -->
  <rect x="540" y="730" width="520" height="64" rx="32" fill="#1B0A2E" stroke="#A855F7" stroke-width="2" />
  <text x="800" y="772" fill="#F3E8FF" font-size="24" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" text-anchor="middle" letter-spacing="3">
    SYSTEM DESIGN &amp; ARCHITECTURE
  </text>
</svg>`,
  },

  "postgresql-for-developers": {
    alt: "PostgreSQL database tables, SQL queries, and relational indexing graphic",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#081528" />
      <stop offset="50%" stop-color="#0F2B48" />
      <stop offset="100%" stop-color="#0B1A30" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="14" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <rect width="1600" height="900" fill="url(#bg)" />

  <!-- Center: Stylized Database Cylinder Stack -->
  <g transform="translate(800, 390)" filter="url(#glow)">
    <!-- Top Cylinder -->
    <path d="M-120,-80 C-120,-115 120,-115 120,-80 C120,-45 -120,-45 -120,-80 Z" fill="#3B82F6" />
    <path d="M-120,-80 L-120, -10 C-120,25 120,25 120,-10 L120,-80" fill="#1D4ED8" stroke="#60A5FA" stroke-width="3" />
    <path d="M-120,-10 C-120,25 120,25 120,-10" fill="none" stroke="#93C5FD" stroke-width="3" />

    <!-- Middle Cylinder -->
    <path d="M-120,-10 L-120, 60 C-120,95 120,95 120,60 L120,-10" fill="#1E40AF" stroke="#60A5FA" stroke-width="3" />
    <path d="M-120,60 C-120,95 120,95 120,60" fill="none" stroke="#93C5FD" stroke-width="3" />

    <!-- Bottom Cylinder -->
    <path d="M-120,60 L-120, 130 C-120,165 120,165 120,130 L120,60" fill="#172554" stroke="#60A5FA" stroke-width="3" />
    <path d="M-120,130 C-120,165 120,165 120,130" fill="none" stroke="#93C5FD" stroke-width="3" />

    <text x="0" y="70" fill="#FFFFFF" font-size="28" font-weight="900" font-family="monospace" text-anchor="middle">SQL ACID</text>
  </g>

  <!-- Left: Relational Schema Entity Table -->
  <g transform="translate(320, 270)">
    <rect x="0" y="0" width="300" height="240" rx="12" fill="#0F172A" stroke="#38BDF8" stroke-width="3" />
    <rect x="0" y="0" width="300" height="48" rx="12" fill="#0284C7" />
    <text x="20" y="32" fill="#FFFFFF" font-size="18" font-weight="700" font-family="monospace">users_table</text>

    <text x="20" y="85" fill="#38BDF8" font-size="16" font-family="monospace">id: UUID [PK]</text>
    <text x="20" y="125" fill="#E2E8F0" font-size="16" font-family="monospace">email: VARCHAR UNIQUE</text>
    <text x="20" y="165" fill="#E2E8F0" font-size="16" font-family="monospace">created_at: TIMESTAMPTZ</text>
    <text x="20" y="205" fill="#F59E0B" font-size="16" font-family="monospace">INDEX (email, created)</text>
  </g>

  <!-- Right: Orders Table linked by Foreign Key -->
  <g transform="translate(980, 270)">
    <rect x="0" y="0" width="300" height="240" rx="12" fill="#0F172A" stroke="#38BDF8" stroke-width="3" />
    <rect x="0" y="0" width="300" height="48" rx="12" fill="#0284C7" />
    <text x="20" y="32" fill="#FFFFFF" font-size="18" font-weight="700" font-family="monospace">orders_table</text>

    <text x="20" y="85" fill="#38BDF8" font-size="16" font-family="monospace">order_id: UUID [PK]</text>
    <text x="20" y="125" fill="#F59E0B" font-size="16" font-family="monospace">user_id: UUID [FK]</text>
    <text x="20" y="165" fill="#E2E8F0" font-size="16" font-family="monospace">amount: DECIMAL(10,2)</text>
    <text x="20" y="205" fill="#34D399" font-size="16" font-family="monospace">EXPLAIN ANALYZE index</text>
  </g>

  <!-- Relational FK Link Line -->
  <path d="M620,395 L980,395" stroke="#F59E0B" stroke-width="3" stroke-dasharray="6 6" />

  <!-- Badge -->
  <rect x="540" y="730" width="520" height="64" rx="32" fill="#0A1E38" stroke="#38BDF8" stroke-width="2" />
  <text x="800" y="772" fill="#E0F2FE" font-size="24" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" text-anchor="middle" letter-spacing="3">
    POSTGRESQL FOR DEVELOPERS
  </text>
</svg>`,
  },

  "practical-web-security": {
    alt: "Cybersecurity protection, cryptographic shield, and vulnerability defense graphic",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#180B10" />
      <stop offset="50%" stop-color="#2D0F1E" />
      <stop offset="100%" stop-color="#16080F" />
    </linearGradient>
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E11D48" />
      <stop offset="50%" stop-color="#9F1239" />
      <stop offset="100%" stop-color="#4C0519" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <rect width="1600" height="900" fill="url(#bg)" />

  <!-- Security concentric rings -->
  <g opacity="0.15" stroke="#F43F5E" stroke-width="2">
    <circle cx="800" cy="400" r="320" fill="none" stroke-dasharray="10 10" />
    <circle cx="800" cy="400" r="240" fill="none" />
  </g>

  <!-- Central Security Fortress Shield -->
  <g transform="translate(800, 400)" filter="url(#glow)">
    <path d="M0,-160 L140,-90 L140,50 Q140,170 0,220 Q-140,170 -140,50 L-140,-90 Z" fill="url(#shieldGrad)" stroke="#FB7185" stroke-width="6" />

    <!-- Padlock Glyph -->
    <path d="M-40,-20 L-40,-50 C-40,-75 40,-75 40,-50 L40,-20 Z" fill="none" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" />
    <rect x="-55" y="-20" width="110" height="85" rx="14" fill="#FFFFFF" />
    <circle cx="0" cy="16" r="10" fill="#9F1239" />
    <line x1="0" y1="26" x2="0" y2="40" stroke="#9F1239" stroke-width="6" stroke-linecap="round" />
  </g>

  <!-- Left: Threat Defense Badges -->
  <g transform="translate(300, 310)">
    <rect x="0" y="0" width="220" height="50" rx="10" fill="#3B0716" stroke="#FB7185" stroke-width="2" />
    <circle cx="30" cy="25" r="8" fill="#10B981" />
    <text x="55" y="32" fill="#FFE4E6" font-size="16" font-family="monospace">CSRF / XSS: BLOCKED</text>

    <rect x="0" y="70" width="220" height="50" rx="10" fill="#3B0716" stroke="#FB7185" stroke-width="2" />
    <circle cx="30" cy="95" r="8" fill="#10B981" />
    <text x="55" y="102" fill="#FFE4E6" font-size="16" font-family="monospace">SQLi: PREVENTED</text>

    <rect x="0" y="140" width="220" height="50" rx="10" fill="#3B0716" stroke="#FB7185" stroke-width="2" />
    <circle cx="30" cy="165" r="8" fill="#10B981" />
    <text x="55" y="172" fill="#FFE4E6" font-size="16" font-family="monospace">MFA &amp; JWT: SECURE</text>
  </g>

  <!-- Right: Cryptographic Key & Cipher Matrix -->
  <g transform="translate(1100, 310)">
    <rect x="0" y="0" width="230" height="190" rx="12" fill="#1C0913" stroke="#F43F5E" stroke-width="2" />
    <text x="25" y="40" fill="#F43F5E" font-size="16" font-family="monospace">TLS 1.3 / AES-256</text>
    <text x="25" y="75" fill="#94A3B8" font-size="14" font-family="monospace">Hash: SHA-512</text>
    <text x="25" y="110" fill="#94A3B8" font-size="14" font-family="monospace">HSTS: max-age=31536000</text>
    <text x="25" y="145" fill="#34D399" font-size="14" font-family="monospace">CSP: strict-dynamic</text>
  </g>

  <!-- Badge -->
  <rect x="530" y="730" width="540" height="64" rx="32" fill="#240713" stroke="#F43F5E" stroke-width="2" />
  <text x="800" y="772" fill="#FFE4E6" font-size="24" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" text-anchor="middle" letter-spacing="3">
    PRACTICAL APPLICATION SECURITY
  </text>
</svg>`,
  },
};

async function main() {
  console.log("Starting upload of topic-relevant course artwork...");

  const slugs = Object.keys(courseGraphics);

  for (const slug of slugs) {
    const graphic = courseGraphics[slug];
    const filename = `${slug}-cover.svg`;
    console.log(`\nUploading asset for course: ${slug}...`);

    const asset = await client.assets.upload("image", Buffer.from(graphic.svg), {
      filename,
      contentType: "image/svg+xml",
    });

    console.log(`-> Asset created: ${asset._id} (${asset.url})`);

    const courseId = `course.${slug}`;
    console.log(`Patching document ${courseId}...`);

    await client
      .patch(courseId)
      .set({
        coverImage: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: asset._id,
          },
          alt: graphic.alt,
        },
      })
      .commit();

    console.log(`-> Successfully updated ${courseId}!`);
  }

  console.log("\nAll 10 courses successfully updated with topic-relevant artwork!");
}

main().catch((err) => {
  console.error("Failed to update course covers:", err);
  process.exit(1);
});
