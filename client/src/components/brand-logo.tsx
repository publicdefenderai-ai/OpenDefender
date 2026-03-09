interface BrandLogoProps {
  variant?: "default" | "light";
  size?: "sm" | "md";
}

const TEAL = "#2A8FA8";
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
      <path
        d="M16 2.5C11.5 2.5 6.5 4.5 5 9L5 15.5C5 22.5 9.5 27 16 29.5C22.5 27 27 22.5 27 15.5L27 9C25.5 4.5 20.5 2.5 16 2.5Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 6C12.5 6 9 7.5 8 11L8 16C8 21.5 11.5 24.5 16 26.5C20.5 24.5 24 21.5 24 16L24 11C23 7.5 19.5 6 16 6Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 9.5C14.5 9.5 13 11 13 12.5L13 15C13 17 14.5 18 16 18.5C17.5 18 19 17 19 15L19 12.5C19 11 17.5 9.5 16 9.5Z"
        stroke={color}
        strokeWidth="1.5"
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
        d="M16 2.5C11.5 2.5 6.5 4.5 5 9L5 15.5C5 22.5 9.5 27 16 29.5C22.5 27 27 22.5 27 15.5L27 9C25.5 4.5 20.5 2.5 16 2.5Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 6C12.5 6 9 7.5 8 11L8 16C8 21.5 11.5 24.5 16 26.5C20.5 24.5 24 21.5 24 16L24 11C23 7.5 19.5 6 16 6Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 9.5C14.5 9.5 13 11 13 12.5L13 15C13 17 14.5 18 16 18.5C17.5 18 19 17 19 15L19 12.5C19 11 17.5 9.5 16 9.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
