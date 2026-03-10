interface BrandLogoProps {
  variant?: "default" | "light";
  size?: "sm" | "md";
}

const TEAL = "#2D8EA5";
const WHITE = "#FFFFFF";

function ShieldIcon({ color, size }: { color: string; size: "sm" | "md" }) {
  const dim = size === "sm" ? 28 : 36;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      width={dim}
      height={dim}
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      {/*
        Outer shield — single open stroke.
        Starts at upper-right shoulder, sweeps counterclockwise (right side →
        bottom point → left side → left shoulder), ends with the left arm
        curling up above the right start — the open-top asymmetric design.
      */}
      <path
        d="M21.5 5.5 C25 5.5 28.5 9 28.5 14 C28.5 21 24 27 16 30.5 C8 27 3.5 21 3.5 14 C3.5 9 7 5.5 10.5 5.5 C12.5 5.5 14.5 5 16 4"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/*
        Inner shield — same open-stroke motif, smaller and inset.
        Right end at upper-right, left end curls up to above center.
      */}
      <path
        d="M20 10.5 C22.5 10.5 24.5 13 24.5 16.5 C24.5 21.5 21.5 26 16 28.5 C10.5 26 7.5 21.5 7.5 16.5 C7.5 13 9.5 10.5 12 10.5 C13.5 10.5 15 9.5 16 8.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BrandLogo({ variant = "default", size = "sm" }: BrandLogoProps) {
  const color = variant === "light" ? WHITE : TEAL;
  const textSize = size === "sm" ? "text-base" : "text-lg";

  return (
    <div className="flex items-center gap-2" style={{ lineHeight: 1 }}>
      <ShieldIcon color={color} size={size} />
      <span
        className={`font-bold ${textSize} tracking-tight`}
        style={{ color, letterSpacing: "-0.01em" }}
      >
        OpenDefender
      </span>
    </div>
  );
}

export function BrandShieldIcon({
  size = 16,
  className = "",
  light = false,
}: {
  size?: number;
  className?: string;
  light?: boolean;
}) {
  const color = light ? WHITE : TEAL;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      width={size}
      height={size}
      aria-hidden="true"
      className={className}
      style={{ flexShrink: 0 }}
    >
      <path
        d="M21.5 5.5 C25 5.5 28.5 9 28.5 14 C28.5 21 24 27 16 30.5 C8 27 3.5 21 3.5 14 C3.5 9 7 5.5 10.5 5.5 C12.5 5.5 14.5 5 16 4"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 10.5 C22.5 10.5 24.5 13 24.5 16.5 C24.5 21.5 21.5 26 16 28.5 C10.5 26 7.5 21.5 7.5 16.5 C7.5 13 9.5 10.5 12 10.5 C13.5 10.5 15 9.5 16 8.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
