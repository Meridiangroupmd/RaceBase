"use client";

import { useState, useEffect, useCallback } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { encodeFunctionData, createPublicClient, http, type Hex } from "viem";
import { base } from "viem/chains";
import { CarIcon } from "./CarIcon";
import { RACEBASE_ADDRESS, raceBaseAbi } from "@/config/contract";

const BUILDER_CODE_SUFFIX = "0x62635f6c347977356c376d0b0080218021802180218021802180218021" as Hex;
const PAYMASTER_URL = "https://api.developer.coinbase.com/rpc/v1/base/OPj0vhkXuMRNsVxHcgZRF0WGjlR7FV26";

const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

export function GameApp() {
  const { ready, authenticated, login, user } = usePrivy();
  const [showMain, setShowMain] = useState(false);

  const address = user?.wallet?.address;

  useEffect(() => {
    if (authenticated && address) {
      setShowMain(true);
    }
  }, [authenticated, address]);

  if (!ready) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#0a0a14]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
      </div>
    );
  }

  if (showMain && address) {
    return <MainScreen address={address} />;
  }

  return <LandingScreen onStart={login} isConnecting={false} />;
}

function LandingScreen({
  onStart,
  isConnecting,
}: {
  onStart: () => void;
  isConnecting: boolean;
}) {
  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center overflow-hidden">
      {/* Full desert scene */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 600 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a5ca8" />
            <stop offset="30%" stopColor="#4a90cc" />
            <stop offset="50%" stopColor="#88bbdd" />
            <stop offset="62%" stopColor="#eebb66" />
            <stop offset="70%" stopColor="#dd9944" />
            <stop offset="76%" stopColor="#cc8838" />
          </linearGradient>
          <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#fffde8" />
            <stop offset="50%" stopColor="#ffee88" />
            <stop offset="100%" stopColor="#ffcc44" />
          </radialGradient>
          <radialGradient id="sunH" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="rgba(255,245,200,0.45)" />
            <stop offset="50%" stopColor="rgba(255,225,130,0.15)" />
            <stop offset="100%" stopColor="rgba(255,200,80,0)" />
          </radialGradient>
          <linearGradient id="sandG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4aa58" />
            <stop offset="100%" stopColor="#c09848" />
          </linearGradient>
          <linearGradient id="roadG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c8a060" />
            <stop offset="6%" stopColor="#7a7868" />
            <stop offset="15%" stopColor="#5a584a" />
            <stop offset="100%" stopColor="#45443a" />
          </linearGradient>
        </defs>

        {/* Sky gradient */}
        <rect width="600" height="1000" fill="url(#sky)" />

        {/* Sun — far left, low on horizon */}
        <circle cx="110" cy="440" r="40" fill="url(#sun)" />
        <circle cx="110" cy="440" r="100" fill="url(#sunH)" />

        {/* Soft clouds */}
        <ellipse cx="350" cy="180" rx="80" ry="8" fill="white" opacity="0.1" />
        <ellipse cx="150" cy="220" rx="60" ry="7" fill="white" opacity="0.07" />
        <ellipse cx="480" cy="250" rx="70" ry="6" fill="white" opacity="0.08" />
        <ellipse cx="280" cy="300" rx="50" ry="5" fill="white" opacity="0.05" />

        {/* Distant mountains */}
        <path d="M0 480 Q50 450 100 465 Q160 430 220 455 Q290 420 360 445 Q430 415 500 440 Q550 425 600 450 L600 510 L0 510Z" fill="#a08040" opacity="0.35" />

        {/* Mid dunes */}
        <path d="M0 505 Q60 480 130 495 Q200 470 280 490 Q360 468 440 488 Q520 472 600 492 L600 540 L0 540Z" fill="#bb9648" opacity="0.6" />

        {/* Close dunes */}
        <path d="M0 535 Q70 518 150 528 Q230 512 310 525 Q400 510 480 522 Q540 514 600 525 L600 560 L0 560Z" fill="#ccaa55" />

        {/* Desert floor */}
        <rect x="0" y="555" width="600" height="450" fill="url(#sandG)" />

        {/* Road — narrow perspective to horizon */}
        <path d="M293 555 L307 555 L390 1000 L210 1000Z" fill="url(#roadG)" />

        {/* Road edge lines — fade in from horizon */}
        <defs>
          <linearGradient id="edgeFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="15%" stopColor="white" stopOpacity="0.2" />
            <stop offset="40%" stopColor="white" stopOpacity="0.5" />
            <stop offset="100%" stopColor="white" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <line x1="293" y1="555" x2="210" y2="1000" stroke="url(#edgeFade)" strokeWidth="1.5" />
        <line x1="307" y1="555" x2="390" y2="1000" stroke="url(#edgeFade)" strokeWidth="1.5" />

        {/* Center dashes — fade in from horizon */}
        {Array.from({ length: 14 }).map((_, i) => {
          const t = i / 14;
          const y = 570 + t * 430;
          const w = 1 + t * 2;
          const h = 6 + t * 18;
          const opacity = t < 0.15 ? 0 : t < 0.3 ? (t - 0.15) * 3 : 0.4 + t * 0.5;
          return <rect key={i} x={300 - w / 2} y={y} width={w} height={h} fill="#ffdd00" opacity={opacity} rx="0.5" />;
        })}

        {/* ═══ SUPERCAR on road — driving into sunset ═══ */}
        <g transform="translate(300, 760) scale(0.38)">
          {/* Ground shadow */}
          <ellipse cx="0" cy="68" rx="52" ry="14" fill="rgba(0,0,0,0.3)" />

          {/* Body — sleek supercar shape */}
          <path d="M-30,-65 Q-32,-60 -34,-40 L-36,-10 L-38,30 Q-38,55 -32,62 L-28,64 L28,64 L32,62 Q38,55 38,30 L36,-10 L34,-40 Q32,-60 30,-65 Q20,-72 0,-74 Q-20,-72 -30,-65Z" fill="#c0392b" />
          {/* Body highlight — center */}
          <path d="M-18,-65 Q-10,-72 0,-74 Q10,-72 18,-65 L20,-40 L22,30 Q22,55 18,60 L-18,60 Q-22,55 -22,30 L-20,-40Z" fill="#e74c3c" opacity="0.5" />
          {/* Body side reflection */}
          <path d="M-34,-40 L-36,-10 L-38,20 L-36,22 L-34,-8 L-32,-38Z" fill="white" opacity="0.08" />
          <path d="M34,-40 L36,-10 L38,20 L36,22 L34,-8 L32,-38Z" fill="white" opacity="0.05" />

          {/* Windshield */}
          <path d="M-22,-28 L22,-28 Q24,-26 20,-10 L-20,-10 Q-24,-26 -22,-28Z" fill="rgba(100,180,240,0.6)" />
          <path d="M-18,-26 L0,-27 L0,-12 L-18,-12Z" fill="rgba(160,210,255,0.15)" />

          {/* Roof / cabin */}
          <path d="M-20,-10 L20,-10 L22,12 L-22,12Z" fill="#a02018" />
          <rect x="-16" y="-8" width="32" height="16" rx="3" fill="rgba(80,160,220,0.3)" />

          {/* Rear window */}
          <path d="M-20,12 L20,12 Q22,14 18,26 L-18,26 Q-22,14 -20,12Z" fill="rgba(80,140,180,0.45)" />

          {/* Hood vents */}
          <rect x="-6" y="-52" width="12" height="3" rx="1" fill="#8b2020" />
          <rect x="-4" y="-46" width="8" height="2" rx="1" fill="#8b2020" />

          {/* Headlights — aggressive angular */}
          <path d="M-28,-62 L-14,-64 L-14,-58 L-30,-56Z" fill="#ffffdd" />
          <path d="M28,-62 L14,-64 L14,-58 L30,-56Z" fill="#ffffdd" />
          <ellipse cx="-22" cy="-60" rx="8" ry="12" fill="rgba(255,255,200,0.06)" />
          <ellipse cx="22" cy="-60" rx="8" ry="12" fill="rgba(255,255,200,0.06)" />

          {/* Taillights — wide LED strip */}
          <rect x="-28" y="58" width="56" height="4" rx="2" fill="#ff2222" />
          <rect x="-24" y="59" width="48" height="2" rx="1" fill="#ff6644" opacity="0.6" />
          {/* Tail glow */}
          <ellipse cx="0" cy="66" rx="30" ry="10" fill="rgba(255,30,30,0.1)" />

          {/* Exhaust tips */}
          <ellipse cx="-14" cy="65" rx="3" ry="2" fill="#333" />
          <ellipse cx="14" cy="65" rx="3" ry="2" fill="#333" />
          <ellipse cx="-14" cy="65" rx="2" ry="1.2" fill="#555" />
          <ellipse cx="14" cy="65" rx="2" ry="1.2" fill="#555" />

          {/* Wheels — front */}
          <ellipse cx="-34" cy="-38" rx="6" ry="10" fill="#111" />
          <ellipse cx="-34" cy="-38" rx="4" ry="7" fill="#333" />
          <ellipse cx="-34" cy="-38" rx="2" ry="4" fill="#555" />
          <ellipse cx="34" cy="-38" rx="6" ry="10" fill="#111" />
          <ellipse cx="34" cy="-38" rx="4" ry="7" fill="#333" />
          <ellipse cx="34" cy="-38" rx="2" ry="4" fill="#555" />

          {/* Wheels — rear (wider) */}
          <ellipse cx="-36" cy="38" rx="7" ry="11" fill="#111" />
          <ellipse cx="-36" cy="38" rx="4.5" ry="7.5" fill="#333" />
          <ellipse cx="-36" cy="38" rx="2.5" ry="4.5" fill="#555" />
          <ellipse cx="36" cy="38" rx="7" ry="11" fill="#111" />
          <ellipse cx="36" cy="38" rx="4.5" ry="7.5" fill="#333" />
          <ellipse cx="36" cy="38" rx="2.5" ry="4.5" fill="#555" />

          {/* Side mirrors */}
          <ellipse cx="-36" cy="-22" rx="4" ry="2.5" fill="#992222" />
          <ellipse cx="36" cy="-22" rx="4" ry="2.5" fill="#992222" />

          {/* Rear spoiler */}
          <rect x="-30" y="56" width="60" height="2.5" rx="1" fill="#881818" />
          <rect x="-32" y="55" width="4" height="5" rx="1" fill="#881818" />
          <rect x="28" y="55" width="4" height="5" rx="1" fill="#881818" />
        </g>

        {/* ═══ LARGE SAGUARO CACTUS — left near road ═══ */}
        <g transform="translate(195,520)">
          <ellipse cx="4" cy="52" rx="8" ry="3" fill="rgba(0,0,0,0.15)" />
          {/* Trunk */}
          <path d="M0,52 L0,4 Q0,-2 4,-2 Q8,-2 8,4 L8,52Z" fill="#2d6622" />
          <path d="M2,52 L2,6 Q2,0 4,0 Q6,0 6,6 L6,52Z" fill="#3a7a2e" opacity="0.6" />
          <path d="M3,4 L3,50" stroke="#4a8c38" strokeWidth="1" opacity="0.3" />
          {/* Left arm */}
          <path d="M0,22 L-8,22 Q-12,22 -12,18 L-12,8 Q-12,4 -9,4 Q-6,4 -6,8 L-6,18 L0,18Z" fill="#2d6622" />
          <path d="M-6,18 L-6,10 Q-6,6 -8,6 Q-10,6 -10,10 L-10,18Z" fill="#3a7a2e" opacity="0.5" />
          {/* Right arm */}
          <path d="M8,30 L16,30 Q20,30 20,26 L20,14 Q20,10 17,10 Q14,10 14,14 L14,26 L8,26Z" fill="#2d6622" />
          <path d="M14,26 L14,16 Q14,12 16,12 Q18,12 18,16 L18,26Z" fill="#3a7a2e" opacity="0.5" />
          {/* Spines hint */}
          <g stroke="#5a9944" strokeWidth="0.3" opacity="0.4">
            <line x1="-1" y1="10" x2="-3" y2="9" /><line x1="-1" y1="20" x2="-3" y2="19" /><line x1="-1" y1="35" x2="-3" y2="34" />
            <line x1="9" y1="12" x2="11" y2="11" /><line x1="9" y1="25" x2="11" y2="24" /><line x1="9" y1="40" x2="11" y2="39" />
          </g>
        </g>

        {/* ═══ MEDIUM CACTUS — right of road ═══ */}
        <g transform="translate(410,535)">
          <ellipse cx="3" cy="36" rx="6" ry="2.5" fill="rgba(0,0,0,0.12)" />
          <path d="M0,36 L0,3 Q0,-1 3,-1 Q6,-1 6,3 L6,36Z" fill="#2d6622" />
          <path d="M1.5,34 L1.5,4 Q1.5,1 3,1 Q4.5,1 4.5,4 L4.5,34Z" fill="#3a7a2e" opacity="0.5" />
          <path d="M0,14 L-6,14 Q-9,14 -9,11 L-9,5 Q-9,2 -7,2 Q-5,2 -5,5 L-5,11 L0,11Z" fill="#2d6622" />
          <path d="M-5,11 L-5,6 Q-5,4 -7,4 L-7,11Z" fill="#3a7a2e" opacity="0.4" />
          <g stroke="#5a9944" strokeWidth="0.3" opacity="0.35">
            <line x1="-1" y1="8" x2="-2" y2="7" /><line x1="7" y1="10" x2="8" y2="9" /><line x1="7" y1="22" x2="8" y2="21" />
          </g>
        </g>

        {/* ═══ SMALL CACTUS — far right ═══ */}
        <g transform="translate(490,548)">
          <ellipse cx="2" cy="20" rx="4" ry="1.5" fill="rgba(0,0,0,0.1)" />
          <path d="M0,20 L0,3 Q0,0 2,0 Q4,0 4,3 L4,20Z" fill="#266020" opacity="0.8" />
          <path d="M1,18 L1,4 Q1,2 2,2 Q3,2 3,4 L3,18Z" fill="#358030" opacity="0.35" />
        </g>

        {/* ═══ TINY CACTUS — far left ═══ */}
        <g transform="translate(75,550)">
          <ellipse cx="2" cy="24" rx="4" ry="1.5" fill="rgba(0,0,0,0.08)" />
          <path d="M0,24 L0,4 Q0,0 2,0 Q4,0 4,4 L4,24Z" fill="#266020" opacity="0.7" />
          <path d="M0,10 L-4,10 Q-5,10 -5,8 L-5,5 Q-5,4 -4,4 L-4,8 L0,8Z" fill="#266020" opacity="0.65" />
        </g>

        {/* ═══ RED ROCK FORMATION — left ═══ */}
        <g transform="translate(120,545)">
          <ellipse cx="24" cy="30" rx="28" ry="5" fill="rgba(0,0,0,0.1)" />
          <path d="M0,30 L8,8 Q10,2 14,5 L18,14 Q20,6 24,0 Q28,6 30,12 L36,8 Q40,4 42,10 L48,30Z" fill="#8b4422" />
          <path d="M4,30 L10,12 L16,18 L22,4 L28,15 L34,10 L38,14 L44,30Z" fill="#a85830" opacity="0.5" />
          <path d="M10,12 L14,8 L16,14" fill="#bb6638" opacity="0.3" />
          <path d="M28,10 L30,6 L34,14" fill="#bb6638" opacity="0.25" />
          {/* Horizontal erosion lines */}
          <line x1="8" y1="20" x2="40" y2="20" stroke="#7a3818" strokeWidth="0.5" opacity="0.3" />
          <line x1="12" y1="25" x2="36" y2="25" stroke="#7a3818" strokeWidth="0.4" opacity="0.2" />
        </g>

        {/* ═══ RED ROCK FORMATION — right ═══ */}
        <g transform="translate(428,550)">
          <ellipse cx="20" cy="28" rx="24" ry="4" fill="rgba(0,0,0,0.1)" />
          <path d="M0,28 L6,10 Q8,4 12,8 L16,16 Q18,8 22,2 Q26,8 28,14 L34,6 Q36,4 38,12 L42,28Z" fill="#8b4422" />
          <path d="M3,28 L8,14 L14,20 L20,6 L26,16 L32,10 L38,28Z" fill="#a85830" opacity="0.45" />
          <line x1="6" y1="18" x2="36" y2="18" stroke="#7a3818" strokeWidth="0.5" opacity="0.25" />
          <line x1="10" y1="23" x2="32" y2="23" stroke="#7a3818" strokeWidth="0.4" opacity="0.2" />
        </g>

        {/* ═══ ROCKS with depth ═══ */}
        <g>
          {/* Rock cluster left */}
          <ellipse cx="100" cy="592" rx="8" ry="4" fill="#8a7744" />
          <ellipse cx="100" cy="591" rx="7" ry="3.5" fill="#9a8855" />
          <ellipse cx="98" cy="590" rx="4" ry="2" fill="#b8a868" />
          <ellipse cx="108" cy="594" rx="5" ry="3" fill="#8a7744" />
          <ellipse cx="107" cy="593" rx="4" ry="2.5" fill="#9a8855" />

          {/* Rock cluster right */}
          <ellipse cx="510" cy="602" rx="7" ry="3.5" fill="#8a7744" />
          <ellipse cx="510" cy="601" rx="6" ry="3" fill="#9a8855" />
          <ellipse cx="508" cy="600" rx="3.5" ry="2" fill="#b8a868" />

          {/* Scattered pebbles */}
          <ellipse cx="60" cy="700" rx="9" ry="4" fill="#887744" />
          <ellipse cx="60" cy="699" rx="7" ry="3" fill="#998855" />
          <ellipse cx="58" cy="698" rx="4" ry="2" fill="#aa9966" />
          <ellipse cx="540" cy="752" rx="8" ry="3.5" fill="#887744" />
          <ellipse cx="540" cy="751" rx="6.5" ry="2.8" fill="#998855" />
          <ellipse cx="538" cy="750" rx="3.5" ry="1.8" fill="#aa9966" />
        </g>

        {/* ═══ DEAD SHRUB — left ═══ */}
        <g transform="translate(170,555)">
          <g stroke="#5a4420" strokeWidth="1.2" fill="none" strokeLinecap="round">
            <path d="M0,12 L-3,0" /><path d="M0,12 L-5,2 Q-6,0 -4,-1" /><path d="M0,12 L2,1" />
            <path d="M0,12 L5,3 Q6,1 8,2" /><path d="M0,12 L-1,4 Q-2,2 0,1" />
          </g>
          <g stroke="#6a5530" strokeWidth="0.6" fill="none" strokeLinecap="round" opacity="0.5">
            <path d="M-3,3 L-6,1" /><path d="M4,5 L7,3" /><path d="M-4,6 L-7,5" />
          </g>
        </g>

        {/* ═══ DEAD SHRUB — right ═══ */}
        <g transform="translate(450,558)">
          <g stroke="#5a4420" strokeWidth="1" fill="none" strokeLinecap="round">
            <path d="M0,10 L-2,1" /><path d="M0,10 L3,2 Q4,0 5,1" /><path d="M0,10 L-4,3" />
          </g>
          <g stroke="#6a5530" strokeWidth="0.5" fill="none" strokeLinecap="round" opacity="0.4">
            <path d="M-3,4 L-5,3" /><path d="M3,4 L5,2" />
          </g>
        </g>

        {/* ═══ EARTH CRACKS ═══ */}
        <g stroke="#b09050" strokeWidth="0.8" opacity="0.2" fill="none" strokeLinecap="round">
          <path d="M35 650 Q50 655 65 658 Q60 665 55 675" />
          <path d="M535 680 Q548 677 560 675 Q558 682 555 695" />
          <path d="M75 800 Q90 805 100 810" />
          <path d="M500 850 Q515 847 525 850" />
        </g>

        {/* ═══ ROAD SIGN — detailed ═══ */}
        <g transform="translate(378,650)">
          {/* Post shadow */}
          <ellipse cx="5" cy="42" rx="6" ry="2" fill="rgba(0,0,0,0.1)" />
          {/* Metal post with gradient */}
          <rect x="0" y="0" width="4" height="42" rx="1" fill="#999" />
          <rect x="0.5" y="0" width="1.5" height="42" rx="0.5" fill="#bbb" opacity="0.4" />
          {/* Sign panel */}
          <rect x="-10" y="-20" width="24" height="22" rx="2.5" fill="#1a7a1a" />
          <rect x="-9" y="-19" width="22" height="20" rx="2" stroke="white" strokeWidth="0.8" fill="none" />
          {/* Inner border */}
          <rect x="-7" y="-17" width="18" height="16" rx="1.5" stroke="white" strokeWidth="0.3" fill="none" opacity="0.4" />
          <text x="2" y="-6" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="sans-serif">65</text>
          {/* Bolts */}
          <circle cx="-5" cy="-15" r="0.8" fill="#bbb" /><circle cx="9" cy="-15" r="0.8" fill="#bbb" />
          <circle cx="-5" cy="-3" r="0.8" fill="#bbb" /><circle cx="9" cy="-3" r="0.8" fill="#bbb" />
        </g>

        {/* ═══ UTILITY POLE — detailed ═══ */}
        <g transform="translate(222,570)">
          {/* Pole shadow */}
          <ellipse cx="5" cy="78" rx="8" ry="2.5" fill="rgba(0,0,0,0.1)" />
          {/* Main pole */}
          <rect x="0" y="0" width="4" height="78" rx="1" fill="#6a6658" />
          <rect x="0.5" y="0" width="1.5" height="78" rx="0.5" fill="#7a7668" opacity="0.4" />
          {/* Crossbar */}
          <rect x="-12" y="3" width="28" height="2.5" rx="0.8" fill="#6a6658" />
          <rect x="-12" y="3.3" width="28" height="1" rx="0.5" fill="#7a7668" opacity="0.3" />
          {/* Insulators */}
          <rect x="-12" y="1" width="2" height="4" rx="0.8" fill="#5a8888" />
          <rect x="14" y="1" width="2" height="4" rx="0.8" fill="#5a8888" />
          <rect x="-4" y="1" width="2" height="4" rx="0.8" fill="#5a8888" />
          {/* Wires hint */}
          <line x1="-12" y1="3" x2="-30" y2="8" stroke="#6a6658" strokeWidth="0.4" opacity="0.3" />
          <line x1="16" y1="3" x2="34" y2="8" stroke="#6a6658" strokeWidth="0.4" opacity="0.3" />
        </g>
      </svg>


      {/* Title in the sky area */}
      <div className="relative z-10 mt-[6vh] flex flex-col items-center">
        <h1 className="text-[32px] font-black tracking-tight" style={{
          color: "#fff",
          textShadow: "0 2px 20px rgba(0,0,0,0.5), 0 0 60px rgba(255,220,100,0.12)",
        }}>
          Race<span style={{ color: "#0052FF" }}>Base</span>
        </h1>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Button at bottom */}
      <div className="relative z-10 w-full px-6 pb-[8vh] flex flex-col items-center">
        <button
          onClick={onStart}
          disabled={isConnecting}
          className="w-full max-w-[280px] rounded-full bg-yellow-400 py-3 text-center text-base font-extrabold text-black transition-all hover:bg-yellow-300 active:scale-[0.97] disabled:opacity-60"
          style={{ animation: "pulse-glow 3s ease-in-out infinite" }}
        >
          {isConnecting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
              Connecting…
            </span>
          ) : (
            "Start Playing"
          )}
        </button>
      </div>
    </div>
  );
}

function MainScreen({ address }: { address: string }) {
  const { wallets } = useWallets();
  const [canCheck, setCanCheck] = useState(false);
  const [playerData, setPlayerData] = useState({ checkIns: BigInt(0), races: BigInt(0), streak: BigInt(0) });
  const [loading, setLoading] = useState("");
  const [txStatus, setTxStatus] = useState("");

  const fetchPlayerData = useCallback(async () => {
    try {
      const [player, canCheckIn] = await Promise.all([
        publicClient.readContract({
          address: RACEBASE_ADDRESS,
          abi: raceBaseAbi,
          functionName: "getPlayer",
          args: [address as `0x${string}`],
        }),
        publicClient.readContract({
          address: RACEBASE_ADDRESS,
          abi: raceBaseAbi,
          functionName: "canCheckIn",
          args: [address as `0x${string}`],
        }),
      ]);
      setPlayerData({ checkIns: player[0], races: player[1], streak: player[3] });
      setCanCheck(canCheckIn);
    } catch {}
  }, [address]);

  useEffect(() => { fetchPlayerData(); }, [fetchPlayerData]);

  const sendTx = async (functionName: "checkIn" | "race") => {
    const wallet = wallets.find(w => w.address?.toLowerCase() === address.toLowerCase()) ?? wallets[0];
    if (!wallet) return;
    setLoading(functionName);
    setTxStatus("");
    try {
      const provider = await wallet.getEthereumProvider();
      const data = encodeFunctionData({ abi: raceBaseAbi, functionName });
      const dataWithBuilder = (data + BUILDER_CODE_SUFFIX.slice(2)) as Hex;

      // Send via paymaster
      await provider.request({
        method: "wallet_sendCalls",
        params: [{
          version: "1.0",
          chainId: "0x2105",
          from: address,
          calls: [{
            to: RACEBASE_ADDRESS,
            value: "0x0",
            data: dataWithBuilder,
          }],
          capabilities: {
            paymasterService: {
              url: PAYMASTER_URL,
            },
          },
        }],
      });

      // Success — redirect or refresh
      if (functionName === "race") {
        window.location.href = "/game.html";
        return;
      }
      setTxStatus("Done!");
      setTimeout(() => fetchPlayerData(), 2000);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Transaction failed";
      setTxStatus(msg.length > 50 ? msg.slice(0, 50) + "…" : msg);
    } finally {
      setLoading("");
      setTimeout(() => setTxStatus(""), 4000);
    }
  };

  const now = new Date();
  const resetHour = 1;
  const nextReset = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + (now.getUTCHours() >= resetHour ? 1 : 0), resetHour));
  const hoursLeft = Math.max(0, Math.ceil((nextReset.getTime() - now.getTime()) / 3600000));

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center px-5 pt-8 pb-10" style={{ background: "linear-gradient(to bottom, #0d1117 0%, #121a2b 50%, #1a1a2e 100%)" }}>
      <div className="pointer-events-none absolute left-1/2 top-0 h-[30%] w-[120%] -translate-x-1/2"
        style={{ background: "radial-gradient(ellipse at center top, rgba(255,150,50,0.05) 0%, transparent 70%)" }}
      />

      {/* Header */}
      <div className="relative z-10 flex w-full max-w-sm items-center justify-between">
        <span className="text-lg font-black text-white">
          Race<span style={{ color: "#0052FF" }}>Base</span>
        </span>
        <span className="rounded-full bg-zinc-800/80 px-3 py-1 font-mono text-xs text-zinc-400">
          {address.slice(0, 6)}…{address.slice(-4)}
        </span>
      </div>

      {/* Car */}
      <div className="relative z-10 mt-8" style={{ animation: "float 4s ease-in-out infinite" }}>
        <CarIcon size={80} />
      </div>

      {/* Status */}
      {txStatus && (
        <div className="relative z-10 mt-3 rounded-lg bg-zinc-800/80 px-4 py-2 text-xs text-zinc-300">
          {txStatus}
        </div>
      )}

      {/* Check In */}
      <div className="relative z-10 mt-6 w-full max-w-sm">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Daily Check-In</h2>
              <p className="mt-1 text-xs text-zinc-500">
                {!canCheck ? `Done! Resets in ${hoursLeft}h` : "Check in once per day"}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400/10">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
          </div>
          <button
            onClick={() => sendTx("checkIn")}
            disabled={!canCheck || loading === "checkIn"}
            className="mt-4 w-full rounded-xl bg-yellow-400 py-3 text-center text-sm font-bold text-black transition-all hover:bg-yellow-300 active:scale-[0.97] disabled:bg-zinc-700 disabled:text-zinc-500"
          >
            {loading === "checkIn" ? "Signing…" : !canCheck ? "Checked In ✓" : "Check In"}
          </button>
        </div>
      </div>

      {/* Race */}
      <div className="relative z-10 mt-4 w-full max-w-sm">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Race</h2>
              <p className="mt-1 text-xs text-zinc-500">Start a race to earn points</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400/10">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
          </div>
          <button
            onClick={() => sendTx("race")}
            disabled={loading === "race"}
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-center text-sm font-bold text-white transition-all hover:from-cyan-400 hover:to-blue-500 active:scale-[0.97] disabled:opacity-50"
          >
            {loading === "race" ? "Signing…" : "Start Race"}
          </button>
        </div>
      </div>

      {/* Stats — live from contract */}
      <div className="relative z-10 mt-4 grid w-full max-w-sm grid-cols-3 gap-3">
        {[
          { label: "Streak", value: playerData.streak.toString(), icon: "🔥" },
          { label: "Races", value: playerData.races.toString(), icon: "🏁" },
          { label: "Check-ins", value: playerData.checkIns.toString(), icon: "⭐" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-center">
            <span className="text-lg">{s.icon}</span>
            <p className="mt-1 text-lg font-bold text-white">{s.value}</p>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
