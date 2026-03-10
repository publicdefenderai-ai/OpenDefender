import logoShieldPng from "@assets/OpenDefenderLogo2-removebg-preview_1773114975197.png";

interface BrandLogoProps {
  variant?: "default" | "light";
  size?: "sm" | "md";
}

const TEAL = "#2D8EA5";
const WHITE = "#FFFFFF";

export function BrandLogo({ variant = "default", size = "sm" }: BrandLogoProps) {
  const color = variant === "light" ? WHITE : TEAL;
  const textSize = size === "sm" ? "text-base" : "text-lg";
  const dim = size === "sm" ? 28 : 36;
  const isLight = variant === "light";

  return (
    <div className="flex items-center gap-2" style={{ lineHeight: 1 }}>
      <img
        src={logoShieldPng}
        width={dim}
        height={dim}
        alt=""
        aria-hidden="true"
        style={{
          flexShrink: 0,
          display: "block",
          filter: isLight ? "brightness(0) invert(1)" : "none",
        }}
      />
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
  return (
    <img
      src={logoShieldPng}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      className={className}
      style={{
        flexShrink: 0,
        display: "block",
        filter: light ? "brightness(0) invert(1)" : "none",
      }}
    />
  );
}
