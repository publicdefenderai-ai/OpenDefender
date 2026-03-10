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
      {/* Outer shield — top arch at y≈6 */}
      <path
        d="M16 5.5C11 5.5 5 8.5 4 13.5L4 18C4 24 8.5 28 16 30.5C23.5 28 28 24 28 18L28 13.5C27 8.5 21 5.5 16 5.5Z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner shield — top peak at y≈2, rises above outer arch */}
      <path
        d="M16 2C12.5 2 8 5 7.5 10L7.5 14.5C7.5 20 11 23.5 16 25.5C21 23.5 24.5 20 24.5 14.5L24.5 10C24 5 19.5 2 16 2Z"
        stroke={color}
        strokeWidth="1.9"
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
      {/* Outer shield */}
      <path
        d="M16 5.5C11 5.5 5 8.5 4 13.5L4 18C4 24 8.5 28 16 30.5C23.5 28 28 24 28 18L28 13.5C27 8.5 21 5.5 16 5.5Z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner shield — top peaks above outer */}
      <path
        d="M16 2C12.5 2 8 5 7.5 10L7.5 14.5C7.5 20 11 23.5 16 25.5C21 23.5 24.5 20 24.5 14.5L24.5 10C24 5 19.5 2 16 2Z"
        stroke={color}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
