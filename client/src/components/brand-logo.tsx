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
      {/* Outer shield left half */}
      <path
        d="M16 5 C13 4 9 5 7 7.5 C4.5 10.5 4.5 15 4.5 17 C4.5 23 9 27.5 16 30"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Outer shield right half */}
      <path
        d="M16 5 C19 4 23 5 25 7.5 C27.5 10.5 27.5 15 27.5 17 C27.5 23 23 27.5 16 30"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner shield left half */}
      <path
        d="M16 10 C14 9.5 11.5 10 10 12 C8.5 14 8 17 8 19.5 C8 23 11 26.5 16 28"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner shield right half */}
      <path
        d="M16 10 C18 9.5 20.5 10 22 12 C23.5 14 24 17 24 19.5 C24 23 21 26.5 16 28"
        stroke={color}
        strokeWidth="1.6"
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
      {/* Outer shield left half */}
      <path
        d="M16 5 C13 4 9 5 7 7.5 C4.5 10.5 4.5 15 4.5 17 C4.5 23 9 27.5 16 30"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Outer shield right half */}
      <path
        d="M16 5 C19 4 23 5 25 7.5 C27.5 10.5 27.5 15 27.5 17 C27.5 23 23 27.5 16 30"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner shield left half */}
      <path
        d="M16 10 C14 9.5 11.5 10 10 12 C8.5 14 8 17 8 19.5 C8 23 11 26.5 16 28"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner shield right half */}
      <path
        d="M16 10 C18 9.5 20.5 10 22 12 C23.5 14 24 17 24 19.5 C24 23 21 26.5 16 28"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
