import logoShieldPng from "@assets/OpenDefenderLogo2-removebg-preview_1773114975197.png";

interface BrandLogoProps {
  variant?: "default" | "light";
  size?: "sm" | "md";
}

const TEAL = "var(--editorial-signal)";
const WHITE = "#FFFFFF";

export function BrandLogo({ variant = "default", size = "sm" }: BrandLogoProps) {
  const color = variant === "light" ? WHITE : TEAL;
  const textSize = size === "sm" ? "text-lg" : "text-lg";
  const dim = size === "sm" ? 28 : 36;

  return (
    <div className="flex items-center gap-2" style={{ lineHeight: 1 }}>
      <span
        aria-hidden="true"
        style={{ width: dim, height: dim, flexShrink: 0, backgroundColor: color,
          mask: `url(${logoShieldPng}) center / contain no-repeat`,
          WebkitMask: `url(${logoShieldPng}) center / contain no-repeat` }}
      />
      <span
        className={`brand-wordmark font-semibold ${textSize} tracking-tight`}
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
