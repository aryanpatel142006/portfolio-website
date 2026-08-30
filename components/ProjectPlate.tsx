/** Technical "plates" for the case studies — blueprint-style SVG figures
    drawn in the site's own ink + accent tokens, so they adapt to both
    themes. One motif per project, keyed by `Project.plate`. */

export type PlateKind = "vision" | "launch" | "meta";

const MONO = "var(--font-mono), monospace";

function Label({
  x,
  y,
  children,
  anchor = "start",
  accent = false,
}: {
  x: number;
  y: number;
  children: string;
  anchor?: "start" | "end";
  accent?: boolean;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontFamily={MONO}
      fontSize="9"
      letterSpacing="1.2"
      fill={accent ? "var(--accent)" : "var(--muted)"}
    >
      {children}
    </text>
  );
}

/** Shared furniture: dotted grid, corner ticks, figure captions. */
function Frame({
  fig,
  topLeft,
  bottomLeft,
  bottomRight,
  children,
}: {
  fig: string;
  topLeft: string;
  bottomLeft: string;
  bottomRight: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 480 300"
      className="h-full w-full text-foreground"
      role="img"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="plate-dots" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="12" r="0.8" fill="currentColor" opacity="0.14" />
        </pattern>
      </defs>
      <rect width="480" height="300" fill="url(#plate-dots)" />

      {/* corner ticks */}
      <g stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.5" fill="none">
        <path d="M12 26 V12 H26" />
        <path d="M454 12 H468 V26" />
        <path d="M12 274 V288 H26" />
        <path d="M468 274 V288 H454" />
      </g>

      <Label x={16} y={31}>{topLeft}</Label>
      <Label x={464} y={31} anchor="end">{fig}</Label>
      <Label x={16} y={289}>{bottomLeft}</Label>
      <Label x={464} y={289} anchor="end">{bottomRight}</Label>

      {children}
    </svg>
  );
}

/* ── VoxIQ: hand-tracking schematic ─────────────────────────────── */
function VisionPlate() {
  // simplified MediaPipe-style hand: wrist + five joint chains
  const chains: [number, number][][] = [
    [[240, 235], [202, 212], [182, 188], [172, 168]], // thumb
    [[240, 235], [225, 180], [220, 146], [218, 120]], // index
    [[240, 235], [245, 176], [247, 138], [248, 108]], // middle
    [[240, 235], [264, 182], [269, 146], [271, 121]], // ring
    [[240, 235], [283, 197], [293, 169], [299, 147]], // pinky
  ];
  return (
    <Frame
      fig="FIG. 01 — VOXIQ"
      topLeft="ON-DEVICE VISION"
      bottomLeft="OPENCV · MEDIAPIPE · PYTTSX3"
      bottomRight="ADAPTIVE ASSESSMENT"
    >
      {/* viewfinder brackets */}
      <g stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" fill="none">
        <path d="M150 78 V60 H168" />
        <path d="M312 60 H330 V78" />
        <path d="M150 234 V252 H168" />
        <path d="M330 234 V252 H312" />
      </g>

      {/* scanline sweeping the viewfinder */}
      <line
        x1="152"
        y1="64"
        x2="328"
        y2="64"
        stroke="var(--accent)"
        strokeOpacity="0.45"
        strokeWidth="1.5"
        className="plate-scan"
      />

      {/* hand skeleton */}
      <g stroke="currentColor" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" fill="none">
        {chains.map((c, i) => (
          <polyline key={i} points={c.map((p) => p.join(",")).join(" ")} />
        ))}
      </g>
      <g fill="currentColor">
        {chains.flat().map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.4" />
        ))}
      </g>

      {/* tracked fingertip + leader to confidence chip */}
      <circle cx="218" cy="120" r="8" fill="none" stroke="var(--accent)" strokeOpacity="0.6" className="plate-ping" />
      <circle cx="218" cy="120" r="8" fill="none" stroke="var(--accent)" strokeOpacity="0.45" />
      <circle cx="218" cy="120" r="3.5" fill="var(--accent)" />
      <line x1="226" y1="116" x2="292" y2="104" stroke="var(--accent)" strokeOpacity="0.5" strokeDasharray="3 3" />
      <rect x="294" y="92" width="112" height="22" rx="4" fill="var(--accent)" fillOpacity="0.1" stroke="var(--accent)" strokeOpacity="0.4" />
      <Label x={303} y={106} accent>GESTURE · 97%</Label>

      {/* text-to-speech waves, speaking */}
      <g stroke="currentColor" strokeWidth="1.5" fill="none">
        <path d="M128 185 q10 18 0 36" className="plate-wave" />
        <path d="M140 177 q16 26 0 52" className="plate-wave-2" />
      </g>
      <rect x="112" y="196" width="9" height="14" fill="currentColor" opacity="0.6" />
      <path d="M121 196 l8 -7 v28 l-8 -7 z" fill="currentColor" opacity="0.6" />
    </Frame>
  );
}

/* ── HerLaunch: 24-hour launch trajectory ───────────────────────── */
function LaunchPlate() {
  return (
    <Frame
      fig="FIG. 02 — HERLAUNCH"
      topLeft="24-HR BUILD"
      bottomLeft="GEMINI · PRESAGE · FISERV"
      bottomRight="FOR WOMEN FOUNDERS"
    >
      {/* mentor-match graph */}
      <g stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.2">
        <line x1="92" y1="112" x2="130" y2="86" />
        <line x1="92" y1="112" x2="148" y2="130" />
        <line x1="92" y1="112" x2="112" y2="160" />
        <line x1="130" y1="86" x2="148" y2="130" />
      </g>
      <g fill="currentColor" opacity="0.75">
        <circle cx="130" cy="86" r="4" />
        <circle cx="148" cy="130" r="4" />
        <circle cx="112" cy="160" r="4" />
      </g>
      <circle cx="92" cy="112" r="5.5" fill="var(--accent)" />
      <Label x={78} y={182}>MENTOR MATCH</Label>

      {/* trajectory, dashes marching upward */}
      <path
        d="M60 252 C 180 246, 300 204, 416 74"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.6"
        strokeWidth="1.5"
        strokeDasharray="5 5"
        className="plate-dash"
      />

      {/* milestones */}
      <circle cx="60" cy="252" r="3.5" fill="currentColor" opacity="0.7" />
      <Label x={70} y={262}>IDEA — 00:00</Label>
      <circle cx="240" cy="219" r="4.5" fill="none" stroke="currentColor" strokeOpacity="0.8" strokeWidth="1.5" />
      <Label x={250} y={237}>MVP — 12:40</Label>
      <circle cx="352" cy="152" r="4.5" fill="none" stroke="currentColor" strokeOpacity="0.8" strokeWidth="1.5" />
      <Label x={344} y={143} anchor="end">PITCH — 23:59</Label>

      {/* rocket flying the curve (CSS motion path); static fallback at apex */}
      <g className="plate-rocket">
        <path d="M9 0 L-9 -7 L-4 0 L-9 7 Z" fill="var(--accent)" />
        <line x1="-12" y1="0" x2="-20" y2="0" stroke="var(--accent)" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g className="plate-rocket-static">
        <path d="M430 58 L406 76 L418 88 Z" fill="var(--accent)" />
        <line x1="398" y1="92" x2="388" y2="101" stroke="var(--accent)" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />
        <line x1="404" y1="102" x2="397" y2="109" stroke="var(--accent)" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
      </g>
    </Frame>
  );
}

/* ── aryan.is-a.dev: the site inside its own case study ─────────── */
function MetaPlate() {
  return (
    <Frame
      fig="FIG. 03 — ARYAN.IS-A.DEV"
      topLeft="META"
      bottomLeft="NEXT.JS 16 · AI SDK"
      bottomRight="RECURSION DEPTH 01"
    >
      {/* browser window */}
      <rect x="96" y="58" width="290" height="194" rx="6" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" />
      <line x1="96" y1="84" x2="386" y2="84" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />
      <circle cx="110" cy="71" r="3.5" fill="none" stroke="currentColor" strokeOpacity="0.5" />
      <circle cx="124" cy="71" r="3.5" fill="none" stroke="currentColor" strokeOpacity="0.5" />
      <circle cx="138" cy="71" r="3.5" fill="var(--live)" fillOpacity="0.8" />

      {/* mini hero: the name block + its accent period */}
      <rect x="112" y="100" width="92" height="11" fill="currentColor" opacity="0.75" />
      <rect x="112" y="117" width="70" height="11" fill="currentColor" opacity="0.75" />
      <circle cx="188" cy="123" r="3.2" fill="var(--accent)" />
      <rect x="112" y="140" width="150" height="4" fill="currentColor" opacity="0.28" />
      <rect x="112" y="149" width="118" height="4" fill="currentColor" opacity="0.28" />

      {/* mini query-me terminal — cursor blinking, reply "thinking" */}
      <rect x="112" y="168" width="258" height="66" rx="4" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.4" />
      <text x="122" y="192" fontFamily={MONO} fontSize="10" letterSpacing="1" fill="var(--muted)">
        &gt; whoami
      </text>
      <rect x="176" y="183" width="6" height="11" fill="var(--accent)" className="caret-blink" />
      <g fill="var(--accent)">
        <circle cx="126" cy="215" r="2.2" className="plate-dot-1" />
        <circle cx="136" cy="215" r="2.2" className="plate-dot-2" />
        <circle cx="146" cy="215" r="2.2" className="plate-dot-3" />
      </g>

      {/* you are here, leader dashes marching toward the window */}
      <line x1="386" y1="132" x2="412" y2="120" stroke="var(--accent)" strokeOpacity="0.55" strokeDasharray="3 3" className="plate-dash" />
      <Label x={396} y={112} accent>YOU ARE HERE</Label>
    </Frame>
  );
}

export default function ProjectPlate({ kind }: { kind: PlateKind }) {
  if (kind === "vision") return <VisionPlate />;
  if (kind === "launch") return <LaunchPlate />;
  return <MetaPlate />;
}
