"use client";

export function CarIcon({ size = 200 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * 1.5}
      viewBox="0 0 200 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 0 30px rgba(0,200,255,0.3))" }}
    >
      {/* Shadow */}
      <ellipse cx="100" cy="280" rx="60" ry="12" fill="rgba(0,0,0,0.4)" />

      {/* Body */}
      <rect x="55" y="80" width="90" height="160" rx="16" fill="#1a5522" />
      <rect x="60" y="80" width="80" height="55" rx="12" fill="#1f6628" />

      {/* Windshield */}
      <path d="M70 130 L130 130 L126 152 L74 152 Z" fill="rgba(85,180,255,0.5)" />

      {/* Sunroof */}
      <rect x="76" y="156" width="48" height="18" rx="4" fill="#0d2a10" />
      <rect x="80" y="158" width="40" height="14" rx="3" fill="rgba(100,180,220,0.35)" />

      {/* Rear window */}
      <path d="M74 180 L126 180 L130 198 L70 198 Z" fill="rgba(68,150,140,0.45)" />

      {/* Side skirts */}
      <rect x="55" y="120" width="6" height="100" rx="2" fill="#133d19" />
      <rect x="139" y="120" width="6" height="100" rx="2" fill="#133d19" />

      {/* Side mirrors */}
      <rect x="47" y="126" width="10" height="6" rx="2" fill="#0f3318" />
      <rect x="143" y="126" width="10" height="6" rx="2" fill="#0f3318" />

      {/* Headlights */}
      <rect x="66" y="78" width="18" height="6" rx="2" fill="#ffffcc" />
      <rect x="116" y="78" width="18" height="6" rx="2" fill="#ffffcc" />

      {/* Headlight glow */}
      <ellipse cx="75" cy="60" rx="20" ry="30" fill="rgba(255,238,170,0.06)" />
      <ellipse cx="125" cy="60" rx="20" ry="30" fill="rgba(255,238,170,0.06)" />

      {/* Taillights */}
      <rect x="66" y="234" width="16" height="6" rx="2" fill="#ff3333" />
      <rect x="118" y="234" width="16" height="6" rx="2" fill="#ff3333" />
      <ellipse cx="74" cy="244" rx="12" ry="8" fill="rgba(255,50,50,0.15)" />
      <ellipse cx="126" cy="244" rx="12" ry="8" fill="rgba(255,50,50,0.15)" />

      {/* Spoiler */}
      <rect x="58" y="232" width="84" height="4" rx="2" fill="#0a1f0a" />
      <rect x="60" y="232" width="8" height="8" rx="1" fill="#0a1f0a" />
      <rect x="132" y="232" width="8" height="8" rx="1" fill="#0a1f0a" />

      {/* Wheels */}
      {[
        [56, 92], [136, 92],
        [56, 218], [136, 218],
      ].map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x + 4} cy={y + 4} rx="10" ry="7" fill="#111" />
          <ellipse cx={x + 4} cy={y + 4} rx="6" ry="4.5" fill="#777" />
          <circle cx={x + 4} cy={y + 4} r="2" fill="#aaa" />
        </g>
      ))}

      {/* Neon underglow */}
      <rect x="62" y="242" width="76" height="2" rx="1" fill="#00ccff" opacity="0.6" />
      <ellipse cx="100" cy="244" rx="45" ry="8" fill="rgba(0,200,255,0.08)" />
    </svg>
  );
}
